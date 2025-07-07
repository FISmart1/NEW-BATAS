import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

function FormPengajuanProject() {
  const [nameProject, setNameProject] = useState("");
  const [linkWeb, setLinkWeb] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tools, setTools] = useState("");
  const [foto, setFoto] = useState(null);
  const [siswaList, setSiswaList] = useState([]);
  const [selectedSiswa, setSelectedSiswa] = useState("");
  const [pendingList, setPendingList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3006/api/getsiswa").then((res) => {
      setSiswaList(res.data);
    });
    fetchPendingProjects();
  }, []);

  const fetchPendingProjects = async () => {
    const res = await axios.get("http://localhost:3006/api/getproject_pending");
    setPendingList(res.data.filter((p) => p.status === 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name_project", nameProject);
    formData.append("link_web", linkWeb);
    formData.append("deskripsi", deskripsi);
    formData.append("tools", tools);
    formData.append("db_siswa_id", selectedSiswa);

    if (foto) {
      formData.append("foto", foto);
    }

    try {
      if (editMode) {
        await axios.put(`http://localhost:3006/api/update_project_pending/${editId}`, formData);
        alert("Project berhasil diperbarui!");
      } else {
        if (!foto) {
          alert("Foto belum dipilih!");
          return;
        }
        await axios.post("http://localhost:3006/api/project_pending", formData);
        alert("Project berhasil diajukan!");
      }

      resetForm();
      fetchPendingProjects();
    } catch (error) {
      console.error("Gagal mengirim data:", error.response || error.message);
      alert("Gagal mengirim data.");
    }
  };

  const resetForm = () => {
    setNameProject("");
    setLinkWeb("");
    setDeskripsi("");
    setTools("");
    setFoto(null);
    setSelectedSiswa("");
    setShowModal(false);
    setEditMode(false);
    setEditId(null);
  };

  const handleEdit = (p) => {
    setEditMode(true);
    setEditId(p.id);
    setNameProject(p.name_project);
    setLinkWeb(p.link_web);
    setDeskripsi(p.deskripsi);
    setTools(p.tools);
    setSelectedSiswa(p.db_siswa_id);
    setShowModal(true);
  };

  return (
    <div className="container mt-5">
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left me-2"></i> Kembali
      </button>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">Ajukan Project</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-circle me-1"></i> Tambah Project
        </button>
      </div>

      <div className="row g-4">
        {pendingList.length === 0 ? (
          <p className="text-muted text-center">Belum ada project yang diajukan.</p>
        ) : (
          pendingList.map((p) => (
            <div key={p.id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="position-relative">
                  <img
                    src={`http://localhost:3006/uploads/${p.foto}`}
                    alt={p.name_project}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-2">
                    Belum Disetujui
                  </span>
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="fw-bold">{p.name_project}</h5>
                  <p className="text-muted small mb-2">{p.link_web}</p>
                  <p className="text-truncate">{p.deskripsi}</p>
                  {p.tools && (
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {p.tools.split(",").map((tool, index) => (
                        <span
                          key={index}
                          className="bg-dark text-white mb-2"
                          style={{ fontSize: "0.75rem", padding: "0.4em 0.6em", borderRadius: "0.5rem" }}
                        >
                          {tool.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  <button className="btn btn-outline-primary mt-3" onClick={() => handleEdit(p)}>
                    <i className="bi bi-pencil-square me-1"></i> Edit
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content shadow">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-clipboard2-plus me-2"></i> {editMode ? "Edit Project" : "Form Project"}
                  </h5>
                  <button type="button" className="btn-close" onClick={resetForm}></button>
                </div>
                <div className="modal-body row g-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nama Proyek"
                      value={nameProject}
                      onChange={(e) => setNameProject(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Link Website"
                      value={linkWeb}
                      onChange={(e) => setLinkWeb(e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <textarea
                      className="form-control"
                      placeholder="Deskripsi"
                      rows="3"
                      value={deskripsi}
                      onChange={(e) => setDeskripsi(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <textarea
                      className="form-control"
                      placeholder="Tools yang dipakai"
                      rows="3"
                      value={tools}
                      onChange={(e) => setTools(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="file"
                      name="foto"
                      className="form-control"
                      onChange={(e) => setFoto(e.target.files[0])}
                      accept="image/*"
                    />
                    {editMode && <small className="text-muted">Kosongkan jika tidak ingin mengubah foto.</small>}
                  </div>
                  <div className="col-md-6">
                    <select
                      className="form-select"
                      value={selectedSiswa}
                      onChange={(e) => setSelectedSiswa(e.target.value)}
                      required
                    >
                      <option value="">Pilih Siswa</option>
                      {siswaList.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Batal</button>
                  <button type="submit" className="btn btn-primary">
                    {editMode ? "Update" : "Kirim"}
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

export default FormPengajuanProject;
