import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

function AddKeahlian() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    name_keahlian: "",
    deskripsi: "",
    db_siswa_id: "",
  });
  const [foto, setFoto] = useState(null);
  const [keahlianList, setKeahlianList] = useState([]);
  const [siswaList, setSiswaList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // Ambil data keahlian
  const fetchKeahlian = async () => {
    const res = await axios.get("http://localhost:3006/api/getkeahlian");
    setKeahlianList(res.data || []);
  };

  // Ambil data siswa
  const fetchSiswa = async () => {
    try {
      const res = await axios.get("http://localhost:3006/api/getsiswa");
      setSiswaList(res.data || []);
    } catch (err) {
      console.error("Gagal mengambil data siswa", err);
    }
  };

  useEffect(() => {
    fetchKeahlian();
    fetchSiswa();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFoto(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("id", formData.id);
    data.append("name_keahlian", formData.name_keahlian);
    data.append("deskripsi", formData.deskripsi);
    data.append("db_siswa_id", formData.db_siswa_id);
    if (foto) data.append("foto", foto);

    try {
      if (isEdit) {
        // Mode edit
        await axios.put(
          `http://localhost:3006/api/keahlian/${formData.id}`,
          data
        );
        alert("Keahlian berhasil diperbarui");
      } else {
        // Mode tambah
        await axios.post("http://localhost:3006/api/keahlian/", data);
        alert("Keahlian berhasil ditambahkan");
      }

      fetchKeahlian();
      setShowModal(false);
      setFormData({
        id: "",
        name_keahlian: "",
        deskripsi: "",
        db_siswa_id: "",
      });
      setFoto(null);
      setIsEdit(false);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan keahlian.");
    }
  };

  const handleEdit = (data) => {
    setFormData({
      id: data.id,
      name_keahlian: data.name_keahlian,
      deskripsi: data.deskripsi,
      db_siswa_id: data.db_siswa_id,
    });
    setShowModal(true);
    setIsEdit(true); // <- ini juga penting
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus keahlian ini?")) {
      try {
        await axios.delete(`http://localhost:3006/api/delkeahlian/${id}`);
        alert("Keahlian berhasil dihapus.");
        fetchKeahlian();
      } catch (err) {
        console.error(err);
        alert("Gagal menghapus keahlian.");
      }
    }
  };

  return (
    <div className="container py-4 mt-5 mb-5">
      <h2 className="h4 fw-bold mb-4 mt-5">Data Keahlian</h2>
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
          setFormData({
            id: "",
            name_keahlian: "",
            deskripsi: "",
            db_siswa_id: "",
          });
          setFoto(null);
          setIsEdit(false); // <- penting
        }}
      >
        Tambah Keahlian
      </button>

      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-sm align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Nama Keahlian</th>
              <th>Deskripsi</th>
              <th>Nama Siswa</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {keahlianList.map((k, i) => (
              <tr key={i}>
                <td>{k.id}</td>
                <td>{k.name_keahlian}</td>
                <td>{k.deskripsi}</td>
                <td>{k.nama_siswa}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(k)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(k.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
              className="btn position-absolute end-0 me-3 mt-3"
              aria-label="Close"
              onClick={() => {
                setShowModal(false);
                setFormData({
                  id: "",
                  name_keahlian: "",
                  deskripsi: "",
                  db_siswa_id: "",
                });
                setFoto(null);
              }}
            >
              Back
            </button>

            <h5 className="fw-semibold mb-3">
              {isEdit ? "Edit Keahlian" : "Tambah Keahlian"}
            </h5>

            <form onSubmit={handleSubmit}>
              <input
                name="id"
                value={formData.id} // Generate ID if not provided
                className="form-control mb-3"
                placeholder="ID Keahlian"
                onChange={handleChange}
              />
              <input
                name="name_keahlian"
                value={formData.name_keahlian}
                onChange={handleChange}
                className="form-control mb-3"
                placeholder="Nama Keahlian"
                required
              />
              <input
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                className="form-control mb-3"
                placeholder="Deskripsi"
              />
              <select
                name="db_siswa_id"
                value={formData.db_siswa_id}
                onChange={handleChange}
                className="form-control mb-3"
                required
              >
                <option value="">Pilih Siswa</option>
                {siswaList.map((siswa) => (
                  <option key={siswa.id} value={siswa.id}>
                    {siswa.name}
                  </option>
                ))}
              </select>
              <div className="mb-4">
                <label className="form-label d-block">
                  Upload Foto Keahlian
                </label>
                <input
                  type="file"
                  name="foto"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Simpan
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

export default AddKeahlian;
