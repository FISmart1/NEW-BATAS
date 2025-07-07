import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function AddSiswa() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    angkatan: "",
    keahlian: "",
    link_porto: "",
    alamat: "",
    deskripsi: "",
    posisi: "",
    instansi: "",
    skill: "",
    linkedin: "",
  });
  const [files, setFiles] = useState({
    foto: null,
    portofolio_foto: null,
    cv: null,
  });
  const [siswaList, setSiswaList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  /* ------------ handlers ------------ */
  const handleEdit = (fd) => {
    setFormData({
      id: fd.id,
      name: fd.name,
      angkatan: fd.angkatan,
      keahlian: fd.keahlian,
      link_porto: fd.link_porto,
      alamat: fd.alamat,
      posisi: fd.posisi,
      instansi: fd.instansi,
      deskripsi: fd.deskripsi,
      skill: fd.skill,
      linkedin: fd.linkedin,
    });
    setShowModal(true);
    setIsEdit(true); // TAMBAHKAN INI
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus siswa ini?")) {
      try {
        await axios.delete(`http://localhost:3006/api/siswa/${id}`);
        alert("Data berhasil dihapus.");
        fetchSiswa();
      } catch (error) {
        console.error(error);
        alert("Gagal menghapus data.");
      }
    }
  };

  /* ------------ fetch data ------------ */
  const fetchSiswa = async () => {
    const res = await axios.get("http://localhost:3006/api/getsiswa");
    setSiswaList(res.data || []);
  };

  useEffect(() => {
    fetchSiswa();
  }, []);

  /* ------------ handlers ------------ */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) =>
    setFiles({ ...files, [e.target.name]: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
    Object.entries(files).forEach(([k, v]) => v && fd.append(k, v));

    try {
      if (isEdit) {
        await axios.put(`http://localhost:3006/api/siswa/update/${formData.id}`, fd);
        alert("Data siswa berhasil diperbarui.");
      } else {
        await axios.post("http://localhost:3006/api/siswa", fd);
        alert("Siswa ditambahkan!");
      }

      fetchSiswa();
      setShowModal(false);
      setFormData({
        id: "",
        name: "",
        angkatan: "",
        keahlian: "",
        link_porto: "",
        alamat: "",
        deskripsi: "",
        posisi: "",
        instansi: "",
        skill: "",
        linkedin: "",
      });
      setFiles({ foto: null, portofolio_foto: null, cv: null });
      setIsEdit(false); // RESET
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data siswa.");
      console.log("Error detail:", err.response?.data || err.message);

    }
  };

  /* ------------ JSX ------------ */
  return (
    <div className="container py-4 mt-5 mb-5">
      <h2 className="h4 fw-bold mb-4 mt-5">Data Siswa</h2>
      <div className="d-flex gap-4">
      <button
        onClick={() => navigate(-1)}
        className="btn btn-primary text-decoration-none mb-4"
      >
        &larr; Back
      </button>
      <button
        className="btn btn-success mb-4"
        onClick={() => {
          setShowModal(true);
          setIsEdit(false);
          setFormData({
            id: "",
            name: "",
            angkatan: "",
            keahlian: "",
            link_porto: "",
            alamat: "",
            deskripsi: "",
            posisi: "",
            instansi: "",
            skill: "",
            linkedin: "",
          });
          setFiles({ foto: null, portofolio_foto: null, cv: null });
        }}
      >
        Tambah Siswa Baru
      </button>

      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-sm align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ width: "15%" }}>NIS</th>
              <th>Nama</th>
              <th style={{ width: "10%" }}>Angkatan</th>
              <th style={{ width: "20%" }}>Keahlian</th>
              <th style={{ width: "10%" }}>Skill</th>
              <th style={{ width: "10%" }}>Linkedin</th>
              <th style={{ width: "10%" }}>Portofolio</th>
              <th style={{ width: "15%" }}>Profil</th>
              <th style={{ width: "15%" }}>Aksi</th> {/* Kolom Aksi */}
            </tr>
          </thead>
          <tbody>
            {siswaList.map((s, i) => (
              <tr key={i}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.angkatan}</td>
                <td>{s.keahlian}</td>
                <td>{s.skill}</td>
                <td>
                  {s.linkedin && (
                    <a href={s.linkedin} target="_blank" className="btn btn-primary">
                      Lihat
                    </a>
                  )}
                </td>
                <td>
                  {s.link_porto && (
                    <a href={s.link_porto} target="_blank" rel="noreferrer" className="btn btn-outline-primary">
                      Lihat
                    </a>
                  )}
                </td>
                <td>
                  <Link to={`/siswa/${s.id}`} className="text-decoration-none btn btn-primary">
                    Lihat Profil
                  </Link>
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(s)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(s.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Bootstrap 5 manual (tanpa JS plugin) */}
      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center"
          style={{ zIndex: 1055 }}
        >
          <div
            className="bg-white rounded-3 p-4 shadow w-100"
            style={{ maxWidth: "600px" }}
          >
            <button
              className="btn-close position-absolute end-0 me-3 mt-3"
              aria-label="Close"
              onClick={() => setShowModal(false)}
            ></button>

            <h5 className="fw-semibold mb-3">
              {isEdit ? "Edit Siswa" : "Tambah Siswa"}
            </h5>

            <form onSubmit={handleSubmit}>
              {/* kolom teks */}
              <input
                name="id"
                value={formData.id}
                onChange={handleChange}
                className="form-control mb-3"
                placeholder="NIS "
              />
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control mb-3"
                placeholder="Nama"
                required
              />
              <input
                name="angkatan"
                value={formData.angkatan}
                onChange={handleChange}
                className="form-control mb-3"
                placeholder="Angkatan"
                required
              />
              <input
                name="keahlian"
                value={formData.keahlian}
                onChange={handleChange}
                className="form-control mb-3"
                placeholder="Keahlian"
              />
              <input
                name="skill"
                value={formData.skill}
                onChange={handleChange}
                className="form-control mb-3"
                placeholder="Skill (Pisahkan dengan koma jika lebih dari satu)"
              />
              <input
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="form-control mb-3"
                placeholder="Masukan link linkedin"
              />
              <input
                name="link_porto"
                value={formData.link_porto}
                onChange={handleChange}
                className="form-control mb-3"
                placeholder="Link Portofolio"
              />
              <input
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                className="form-control mb-3"
                placeholder="Alamat"
              />
              <input
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                className="form-control mb-3"
                placeholder="Deskripsi"
              />
              <input
                name="posisi"
                value={formData.posisi}
                onChange={handleChange}
                className="form-control mb-3"
                placeholder="Posisi"
              />
              <input
                name="instansi"
                value={formData.instansi}
                onChange={handleChange}
                className="form-control mb-3"
                placeholder="Instansi"
              />

              {/* file upload */}
              <div className="mb-3">
                <label className="form-label d-block">Foto</label>
                <input
                  type="file"
                  name="foto"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label d-block">Foto Portofolio</label>
                <input
                  type="file"
                  name="portofolio_foto"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>
              <div className="mb-4">
                <label className="form-label d-block">CV (PDF, doc, dsb)</label>
                <input
                  type="file"
                  name="cv"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                {isEdit ? "Update" : "Tambah"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-link text-decoration-none"
              >
                Back
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddSiswa;
