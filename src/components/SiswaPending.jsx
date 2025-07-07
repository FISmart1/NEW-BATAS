import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";

function FormUpdateSiswa() {
  const navigate = useNavigate();
  const [siswaList, setSiswaList] = useState([]);
  const [pendingList, setPendingList] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const [form, setForm] = useState({
    id: "",
    name: "",
    angkatan: "",
    keahlian: "",
    alamat: "",
    posisi: "",
    instansi: "",
    skill: "",
    deskripsi: "",
    foto: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3006/api/getsiswa")
      .then((res) => setSiswaList(res.data));
    fetchPending();
  }, []);

  const fetchPending = async () => {
    const res = await axios.get("http://localhost:3006/api/getsiswa_pending");
    setPendingList(
      res.data.filter((s) => s.status === 0 || s.status === false)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    setForm((prev) => ({ ...prev, foto: e.target.files[0] }));
  };

  const openModal = (siswaId) => {
    setIsNew(false);
    setSelectedId(siswaId);
    const selected = siswaList.find((s) => s.id === siswaId);
    if (selected) {
      setForm({
        id: selected.id || "",
        name: selected.name || "",
        angkatan: selected.angkatan || "",
        keahlian: selected.keahlian || "",
        alamat: selected.alamat || "",
        posisi: selected.posisi || "",
        instansi: selected.instansi || "",
        skill: selected.skill || "",
        deskripsi: selected.deskripsi || "",
        foto: null,
      });
      setShowModal(true);
    }
  };

  const openNewModal = () => {
    setIsNew(true);
    setSelectedId("");
    setForm({
      id: "",
      name: "",
      angkatan: "",
      keahlian: "",
      alamat: "",
      posisi: "",
      instansi: "",
      skill: "",
      deskripsi: "",
      foto: null,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    if (!isNew) {
      data.append("db_siswa_id", selectedId);
    } else if (form.id) {
      data.append("id", form.id);
    }

    Object.entries(form).forEach(([key, value]) => {
      if (key === "foto") {
        if (value) {
          data.append("foto", value);
        } else if (isNew) {
          // fallback ke foto default untuk siswa baru
          data.append("foto", "default.png"); // nama file default di uploads/
        }
      } else if (key !== "id") {
        data.append(key, value);
      }
    });

    try {
      await axios.post("http://localhost:3006/api/siswa_pending", data);
      alert(
        isNew
          ? "✅ Siswa baru berhasil diajukan!"
          : "✅ Update siswa berhasil diajukan!"
      );
      setShowModal(false);
      fetchPending();
    } catch (err) {
      console.error(err);
      alert("❌ Gagal mengirim data.");
    }
  };

  return (
    <div className="container mt-5">
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate(-1)}
      >
        <i className="bi bi-arrow-left me-2"></i> Kembali
      </button>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Form Update Siswa</h2>
        <div>
          <button
            className="btn btn-outline-success me-2"
            onClick={openNewModal}
          >
            Tambah Siswa Baru
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={() => openModal(siswaList[0]?.id || "")}
          >
            Update Siswa
          </button>
        </div>
      </div>

      <h4 className="mb-3">Pengajuan yang Belum Disetujui</h4>
      <div className="row g-4">
        {pendingList.length === 0 ? (
          <p className="text-muted">Tidak ada pengajuan update.</p>
        ) : (
          pendingList.map((s) => (
            <div className="col-md-4" key={s.id}>
              <div className="card h-100 border-0 shadow-sm">
                {s.foto && (
                  <img
                    src={`http://localhost:3006/uploads/${s.foto}`}
                    className="card-img-top"
                    style={{ objectFit: "cover", height: "200px" }}
                    alt={s.name}
                  />
                )}
                <div className="card-body">
                  <h5 className="fw-bold">{s.name}</h5>
                  <p>
                    <strong>Instansi:</strong> {s.instansi}
                  </p>
                  <p>
                    <strong>Keahlian:</strong> {s.keahlian}
                  </p>
                  <p>
                    <strong>Skill:</strong> {s.skill}
                  </p>
                  <p>
                    <strong>Waktu edit:</strong> {s.Timestamp}
                  </p>
                  <span className="badge bg-warning">Pending</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content shadow">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-person-lines-fill me-2"></i>
                    {isNew ? "Tambah Siswa Baru" : "Form Update Siswa"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body row g-3">
                  {isNew && (
                    <div className="col-md-6">
                      <input
                        name="id"
                        value={form.id}
                        onChange={handleChange}
                        placeholder="NIS"
                        className="form-control"
                        required
                      />
                    </div>
                  )}
                  {!isNew && (
                    <div className="col-md-6">
                      <select
                        className="form-select"
                        value={selectedId}
                        onChange={(e) => openModal(e.target.value)}
                      >
                        <option value="">Pilih Siswa</option>
                        {siswaList.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="col-md-6">
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Nama"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      name="angkatan"
                      value={form.angkatan}
                      onChange={handleChange}
                      placeholder="Angkatan"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      name="keahlian"
                      value={form.keahlian}
                      onChange={handleChange}
                      placeholder="Keahlian"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      name="alamat"
                      value={form.alamat}
                      onChange={handleChange}
                      placeholder="Alamat"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      name="posisi"
                      value={form.posisi}
                      onChange={handleChange}
                      placeholder="Posisi"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      name="instansi"
                      value={form.instansi}
                      onChange={handleChange}
                      placeholder="Instansi"
                      className="form-control"
                    />
                  </div>
                  <div className="col-12">
                    <input
                      name="skill"
                      value={form.skill}
                      onChange={handleChange}
                      placeholder="Skill (pisahkan dengan koma)"
                      className="form-control"
                    />
                  </div>
                  <div className="col-12">
                    <textarea
                      name="deskripsi"
                      value={form.deskripsi}
                      onChange={handleChange}
                      placeholder="Deskripsi"
                      className="form-control"
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <input
                      type="file"
                      name="foto"
                      onChange={handleFile}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Kirim
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormUpdateSiswa;
