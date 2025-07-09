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
    status: "", // ✅ TAMBAHKAN INI
    email: "",
    telepon: "",
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
      deskripsi: fd.deskripsi,
      posisi: fd.posisi,
      instansi: fd.instansi,
      email: fd.email,
      telepon: fd.telepon,

      skill: fd.skill,
      linkedin: fd.linkedin,
      status: fd.status, // ✅ TAMBAHKAN INI
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
        await axios.put(
          `http://localhost:3006/api/siswa/update/${formData.id}`,
          fd
        );
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
        status: "",
        email: "",
        telepon: "",
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
              status: "",
              email: "",
              telepon: "",
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
                    <a
                      href={s.linkedin}
                      target="_blank"
                      className="btn btn-primary"
                    >
                      Lihat
                    </a>
                  )}
                </td>
                <td>
                  {s.link_porto && (
                    <a
                      href={s.link_porto}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-primary"
                    >
                      Lihat
                    </a>
                  )}
                </td>
                <td>
                  <Link
                    to={`/siswa/${s.id}`}
                    className="text-decoration-none btn btn-primary"
                  >
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
              <div className="row">
                <div className="col-md-6">
                  <input
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    className="form-control mb-3"
                    placeholder="NIS"
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
                  />
                  <select
                    name="keahlian"
                    value={formData.keahlian || ""}
                    onChange={handleChange}
                    className="form-select mb-2"
                  >
                    <option value="">Pilih Keahlian</option>
                    <option value="Web Developer">Web Developer</option>
                    <option value="Back-End Developer">
                      Back-End Developer
                    </option>
                    <option value="Fullstack Developer">
                      Fullstack Developer
                    </option>
                    <option value="Mobile App Developer">
                      Mobile App Developer
                    </option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="Machine Learning Engineer">
                      Machine Learning Engineer
                    </option>
                    <option value="Network Engineer">Network Engineer</option>
                    <option value="IT Support">IT Support</option>
                    <option value="IT Support Assistant">
                      IT Support Assistant
                    </option>
                  </select>
                  <input
                    name="skill"
                    value={formData.skill}
                    onChange={handleChange}
                    className="form-control mb-3"
                    placeholder="Skill (pisahkan dengan koma)"
                  />
                  <input
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="form-control mb-3"
                    placeholder="Link LinkedIn"
                  />
                  <input
                    name="link_porto"
                    value={formData.link_porto}
                    onChange={handleChange}
                    className="form-control mb-3"
                    placeholder="Link Portofolio"
                  />
                </div>

                <div className="col-md-6">
                  <input
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    className="form-control mb-3"
                    placeholder="Alamat"
                  />
                  <textarea
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleChange}
                    className="form-control mb-3"
                    placeholder="Deskripsi"
                    rows={3}
                  ></textarea>
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
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control mb-3"
                    placeholder="Email"
                  />
                  <input
                    name="telepon"
                    value={formData.telepon}
                    onChange={handleChange}
                    className="form-control mb-3"
                    placeholder="No. Telepon (628...)"
                  />
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-select mb-3"
                  >
                    <option value="">Pilih Status</option>
                    <option value="siswa">Siswa</option>
                    <option value="alumni">Alumni</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Foto</label>
                  <input
                    type="file"
                    name="foto"
                    className="form-control"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Foto Portofolio</label>
                  <input
                    type="file"
                    name="portofolio_foto"
                    className="form-control"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">CV (PDF/DOC)</label>
                  <input
                    type="file"
                    name="cv"
                    className="form-control"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary">
                  {isEdit ? "Update" : "Tambah"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline-secondary"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddSiswa;
