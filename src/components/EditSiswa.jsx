// EditSiswa.js
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

// Modal Komponen (untuk modularisasi lebih rapi)
const ModalWrapper = ({ children, onClose }) => (
  <div
    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
    style={{
      zIndex: 9999,
      backgroundColor: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(3px)",
    }}
  >
    <div
      className="position-relative bg-white p-4 rounded shadow w-100"
      style={{ maxWidth: 480 }}
    >
      <button
        className="btn-close position-absolute top-0 end-0 m-3"
        onClick={onClose}
      />
      {children}
    </div>
  </div>
);

const EditSiswa = () => {
  const { id } = useParams();
  const [siswa, setSiswa] = useState(null);
  const [projects, setProjects] = useState([]);
  const [pengalaman, setPengalaman] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [formData, setFormData] = useState({});
  const [fotoFile, setFotoFile] = useState(null);
  const [pengalamanForm, setPengalamanForm] = useState({
    name: "",
    lokasi: "",
    deskripsi: "",
    foto: null,
  });
  const [projectForm, setProjectForm] = useState({
    name_project: "",
    link_web: "",
    deskripsi: "",
    tools: "",
    foto: null,
  });
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/home");
  };

  useEffect(() => {
    axios
      .get(`https://backend_best.smktibazma.com/api/siswa/${id}`)
      .then((res) => {
        setSiswa(res.data.siswa);
        setProjects(res.data.projects);
        setPengalaman(res.data.pengalaman);
        setFormData(res.data.siswa);
      })
      .catch(console.error);
  }, [id]);

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => setFotoFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, val]) => fd.append(key, val));
      if (fotoFile) fd.append("foto", fotoFile);
      if (formData.cv) fd.append("cv", formData.cv);

      await axios.put(`https://backend_best.smktibazma.com/api/siswa/update/${id}`, fd);
      alert("Data diperbarui!");
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Gagal update data");
    }
  };

  const handlePengalamanSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(pengalamanForm).forEach(([key, val]) => fd.append(key, val));
    fd.append("db_siswa_id", siswa.id);
    try {
      await axios.post("api/pengalaman/", fd);
      const res = await axios.get(`https://backend_best.smktibazma.com/api/siswa/${id}`);
      setPengalaman(res.data.pengalaman);
      alert("Pengalaman ditambahkan!");
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Gagal tambah pengalaman");
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("id", Date.now().toString());
    Object.entries(projectForm).forEach(([key, val]) => fd.append(key, val));
    fd.append("db_siswa_id", siswa.id);
    try {
      await axios.post("https://backend_best.smktibazma.com/api/project/upload", fd);
      const res = await axios.get(`https://backend_best.smktibazma.com/api/siswa/${id}`);
      setProjects(res.data.projects);
      alert("Project ditambahkan!");
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Gagal tambah project");
    }
  };

  if (!siswa) return <p className="text-center mt-5">Loading...</p>;

  const skills = siswa.skill?.split(",").map((s) => s.trim()) || [];

  return (
    <div className="container my-5">

      <div
        className="p-4 text-white rounded shadow"
        style={{ backgroundColor: "#12294A" }}
      >
        <div className="d-flex gap-4 align-items-center">
          <img
            src={`https://backend_best.smktibazma.com/uploads/${siswa.foto}`}
            alt={siswa.name}
            className="rounded-circle border border-white"
            style={{ width: 200, height: 200, objectFit: "cover" }}
          />
          <div>
            <h3 className="fw-bold mb-2">{siswa.name}</h3>
            <p className="mb-2">NIS {siswa.id}</p>
            {siswa.posisi && (
              <span className="badge bg-white text-dark mb-2">
                {siswa.posisi}
              </span>
            )}
            <p className="mb-0">
              <i className="bi bi-geo-alt me-1"></i> {siswa.alamat}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4 mt-3">
        <h5 className="text-center fw-semibold mb-3">Skill</h5>
        <div className="d-flex flex-wrap justify-content-center gap-2">
          {skills.length > 0 ? (
            skills.map((sk, idx) => (
              <span
                key={idx}
                className="badge px-3 py-2 rounded-pill"
                style={{ backgroundColor: "#12294A" }}
              >
                {sk}
              </span>
            ))
          ) : (
            <span className="text-muted">Belum ada skill</span>
          )}
        </div>
      </div>

      {/* Card Aksi */}
      <div className="row mt-4">
        {[
          {
            icon: "bi-clipboard",
            title: "Project",
            desc: "Tugas & Proyek",
            type: "project",
          },
          {
            icon: "bi-journal-text",
            title: "Pengalaman",
            desc: "Selama di BAZMA",
            type: "pengalaman",
          },
          {
            icon: "bi-person-vcard",
            title: "Data Pribadi",
            desc: "Tentang kamu",
            type: "pribadi",
          },
        ].map((item, idx) => (
          <div className="col-md-4 mb-3" key={idx}>
            <div className="card text-center shadow h-100 border-0">
              <div className="card-body">
                <i className={`bi ${item.icon} fs-2 mb-2`}></i>
                <h6 className="fw-bold">{item.title}</h6>
                <p className="text-muted small">{item.desc}</p>
                <button
                  className="btn"
                  style={{ backgroundColor: "#12294A", color: "white" }}
                  onClick={() => openModal(item.type)}
                >
                  {item.type === "pribadi" ? "Edit" : "Tambah"} Data
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}
      {showModal && modalType === "pribadi" && (
        <ModalWrapper onClose={closeModal}>
          <h5 className="fw-bold mb-3">Edit Data Pribadi</h5>
          <form onSubmit={handleSubmit}>
            {[
              "name",
              "angkatan",
              "keahlian",
              "alamat",
              "deskripsi",
              "posisi",
              "instansi",
              "skill",
              "linkedin",
              "email",
              "telepon",
              "password",
            ].map((field, idx) => (
              <input
                key={idx}
                type="text"
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="form-control mb-2"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              />
            ))}
            <input
              type="file"
              className="form-control mb-2"
              onChange={handleFileChange}
            />
            <input
              type="file"
              className="form-control mb-3"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, cv: e.target.files[0] }))
              }
            />
            <button type="submit" className="btn btn-primary w-100">
              Simpan
            </button>
          </form>
        </ModalWrapper>
      )}

      {showModal && modalType === "pengalaman" && (
        <ModalWrapper onClose={closeModal}>
          <h5 className="fw-bold mb-3">Tambah Pengalaman</h5>
          <form onSubmit={handlePengalamanSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Nama"
              value={pengalamanForm.name}
              onChange={(e) =>
                setPengalamanForm({ ...pengalamanForm, name: e.target.value })
              }
              className="form-control mb-2"
              required
            />
            <input
              type="text"
              name="lokasi"
              placeholder="Lokasi"
              value={pengalamanForm.lokasi}
              onChange={(e) =>
                setPengalamanForm({ ...pengalamanForm, lokasi: e.target.value })
              }
              className="form-control mb-2"
              required
            />
            <textarea
              name="deskripsi"
              rows="3"
              placeholder="Deskripsi"
              value={pengalamanForm.deskripsi}
              onChange={(e) =>
                setPengalamanForm({
                  ...pengalamanForm,
                  deskripsi: e.target.value,
                })
              }
              className="form-control mb-2"
              required
            />
            <input
              type="file"
              className="form-control mb-3"
              onChange={(e) =>
                setPengalamanForm({
                  ...pengalamanForm,
                  foto: e.target.files[0],
                })
              }
            />
            <button type="submit" className="btn btn-primary w-100">
              Simpan
            </button>
          </form>
        </ModalWrapper>
      )}

      {showModal && modalType === "project" && (
        <ModalWrapper onClose={closeModal}>
          <h5 className="fw-bold mb-3">Tambah Project</h5>
          <form onSubmit={handleProjectSubmit}>
            <input
              type="text"
              name="name_project"
              value={projectForm.name_project}
              onChange={(e) =>
                setProjectForm({ ...projectForm, name_project: e.target.value })
              }
              placeholder="Nama Project"
              className="form-control mb-2"
              required
            />
            <input
              type="text"
              name="link_web"
              value={projectForm.link_web}
              onChange={(e) =>
                setProjectForm({ ...projectForm, link_web: e.target.value })
              }
              placeholder="Link Web"
              className="form-control mb-2"
            />
            <textarea
              name="deskripsi"
              rows="3"
              value={projectForm.deskripsi}
              onChange={(e) =>
                setProjectForm({ ...projectForm, deskripsi: e.target.value })
              }
              placeholder="Deskripsi"
              className="form-control mb-2"
              required
            />
            <input
              type="text"
              name="tools"
              value={projectForm.tools}
              onChange={(e) =>
                setProjectForm({ ...projectForm, tools: e.target.value })
              }
              placeholder="Tools (pisahkan dengan koma)"
              className="form-control mb-2"
              required
            />
            <input
              type="file"
              className="form-control mb-3"
              onChange={(e) =>
                setProjectForm({ ...projectForm, foto: e.target.files[0] })
              }
            />
            <button type="submit" className="btn btn-primary w-100">
              Simpan
            </button>
          </form>
        </ModalWrapper>
      )}
    </div>
  );
};

export default EditSiswa;
