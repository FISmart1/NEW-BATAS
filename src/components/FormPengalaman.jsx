import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function FormPengalaman() {
  const [name, setName] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [siswaList, setSiswaList] = useState([]);
  const [selectedSiswa, setSelectedSiswa] = useState("");
  const [pendingList, setPendingList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPengalaman, setEditingPengalaman] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSiswa();
    fetchPendingPengalaman();
  }, []);

  const fetchSiswa = async () => {
    const res = await axios.get("http://localhost:3006/api/getsiswa");
    setSiswaList(res.data);
  };

  const fetchPendingPengalaman = async () => {
    const res = await axios.get("http://localhost:3006/api/getpengalaman_pending");
    setPendingList(res.data.filter(p => p.status === 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSiswa) {
      alert("Pilih siswa terlebih dahulu.");
      return;
    }

    const payload = {
      name,
      lokasi,
      deskripsi,
      db_siswa_id: selectedSiswa,
    };

    try {
      if (editingPengalaman) {
        await axios.put(`http://localhost:3006/api/update_pengalaman_pending/${editingPengalaman.id}`, payload);
        alert("✅ Pengalaman berhasil diperbarui!");
      } else {
        await axios.post("http://localhost:3006/api/pengalaman_pending", payload);
        alert("✅ Pengalaman berhasil diajukan!");
      }

      setName("");
      setLokasi("");
      setDeskripsi("");
      setSelectedSiswa("");
      setEditingPengalaman(null);
      setShowModal(false);
      fetchPendingPengalaman();
    } catch (err) {
      console.error("Gagal mengirim data:", err);
      alert("❌ Terjadi kesalahan saat menyimpan data.");
    }
  };

  return (
    <div className="container mt-5">
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left me-2"></i> Kembali
      </button>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">Ajukan Pengalaman</h2>
        <button className="btn btn-primary" onClick={() => {
          setEditingPengalaman(null);
          setShowModal(true);
        }}>
          <i className="bi bi-plus-circle me-1"></i> Tambah Pengalaman
        </button>
      </div>

      {/* List pengalaman pending */}
      <div className="row g-4">
        {pendingList.length === 0 ? (
          <p className="text-muted text-center">Belum ada pengalaman yang diajukan.</p>
        ) : (
          pendingList.map((p) => (
            <div key={p.id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="fw-bold">{p.name}</h5>
                  <p className="text-muted mb-1">Lokasi: {p.lokasi}</p>
                  <p className="small">{p.deskripsi}</p>
                  <span className="badge bg-warning text-dark">Pending</span>
                  <button
                    className="btn btn-outline-primary btn-sm mt-3"
                    onClick={() => {
                      setEditingPengalaman(p);
                      setName(p.name);
                      setLokasi(p.lokasi);
                      setDeskripsi(p.deskripsi);
                      setSelectedSiswa(p.db_siswa_id);
                      setShowModal(true);
                    }}
                  >
                    <i className="bi bi-pencil-square me-1"></i>Edit
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal form */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content shadow">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-journal-plus me-2"></i>
                    {editingPengalaman ? "Edit Pengalaman" : "Form Pengalaman"}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body row g-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nama Pengalaman"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Lokasi"
                      value={lokasi}
                      onChange={(e) => setLokasi(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <textarea
                      className="form-control"
                      placeholder="Deskripsi Pengalaman"
                      rows="4"
                      value={deskripsi}
                      onChange={(e) => setDeskripsi(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <select
                      className="form-select"
                      value={selectedSiswa}
                      onChange={(e) => setSelectedSiswa(e.target.value)}
                      required
                    >
                      <option value="">Pilih Siswa</option>
                      {siswaList.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Batal</button>
                  <button type="submit" className="btn btn-primary">{editingPengalaman ? "Perbarui" : "Kirim"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormPengalaman;
