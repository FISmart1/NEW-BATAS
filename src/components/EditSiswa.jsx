import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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

  useEffect(() => {
    axios
      .get(`http://localhost:3006/api/siswa/${id}`)
      .then((res) => {
        setSiswa(res.data.siswa);
        setProjects(res.data.projects);
        setPengalaman(res.data.pengalaman);
        setFormData(res.data.siswa);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!siswa) return <p>Loading...</p>;

  const skills = siswa.skill ? siswa.skill.split(",").map((s) => s.trim()) : [];

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFotoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        fd.append(key, val);
      });
      if (fotoFile) fd.append("foto", fotoFile);
      if (formData.cv) fd.append("cv", formData.cv);

      await axios.put(`http://localhost:3006/api/siswa/update/${id}`, fd);
      alert("Data berhasil diperbarui");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui data");
    }
  };

  const handlePengalamanChange = (e) => {
    const { name, value } = e.target;
    setPengalamanForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePengalamanFileChange = (e) => {
    setPengalamanForm((prev) => ({ ...prev, foto: e.target.files[0] }));
  };

  const handleSubmitPengalaman = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("name", pengalamanForm.name);
      fd.append("lokasi", pengalamanForm.lokasi);
      fd.append("deskripsi", pengalamanForm.deskripsi);
      fd.append("db_siswa_id", siswa.id);
      if (pengalamanForm.foto) {
        fd.append("foto", pengalamanForm.foto);
      }

      await axios.post("http://localhost:3006/api/pengalaman/", fd);
      alert("Pengalaman berhasil ditambahkan");
      setShowModal(false);
      // Refresh pengalaman
      const res = await axios.get(`http://localhost:3006/api/siswa/${id}`);
      setPengalaman(res.data.pengalaman);
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan pengalaman");
    }
  };
  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProjectForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjectFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file); // 👈 debug dulu
    setProjectForm((prev) => ({ ...prev, foto: file }));
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      const generatedId = Date.now().toString(); // karena di AddProject pakai Date.now()
      fd.append("id", generatedId);
      fd.append("name_project", projectForm.name_project);
      fd.append("deskripsi", projectForm.deskripsi);
      fd.append("link_web", projectForm.link_web);
      fd.append("tools", projectForm.tools);
      fd.append("db_siswa_id", siswa.id); // otomatis ambil dari data siswa yang sedang diedit
      if (projectForm.foto) {
        fd.append("foto", projectForm.foto);
      }

      await axios.post("http://localhost:3006/api/project/upload", fd);
      alert("Project berhasil ditambahkan");
      setShowModal(false);

      // reset form + refresh project list
      setProjectForm({
        id: "",
        name_project: "",
        deskripsi: "",
        link_web: "",
        tools: "",
        foto: null,
      });

      const res = await axios.get(`http://localhost:3006/api/siswa/${id}`);
      setProjects(res.data.projects);
    } catch (err) {
      console.error("❌ Gagal upload project:", err);
      alert("Gagal menambahkan project");
    }
  };

  return (
    <div className="container mt-5">
      <div
        className=" text-white p-4 rounded-top shadow"
        style={{ backgroundColor: "#12294A", borderRadius: "0 0 20px 20px" }}
      >
        <div className="d-flex align-items-center gap-4">
          <img
            src={`http://localhost:3006/uploads/${siswa.foto}`}
            alt={siswa.name}
            className="rounded-circle"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              border: "3px solid white",
            }}
          />
          <div>
            <h5 className="mb-0">NIS {siswa.id}</h5>
            <h3 className="fw-bold">{siswa.name}</h3>
            {siswa.posisi && (
              <span className="badge bg-white text-dark px-3 py-1">
                {siswa.posisi}
              </span>
            )}
            <p className="mt-2 mb-0">
              <i className="bi bi-geo-alt-fill me-2"></i>
              {siswa.alamat}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-3 p-4 mt-3">
        <h5 className="fw-semibold text-center mb-3">Skill</h5>
        <div className="d-flex flex-wrap gap-2 justify-content-center">
          {skills.length > 0 ? (
            skills.map((sk, idx) => (
              <span
                key={idx}
                className="badge bg-teal text-white px-3 py-2 rounded-pill"
                style={{ backgroundColor: "#0d6efd" }}
              >
                {sk}
              </span>
            ))
          ) : (
            <p className="text-muted">Belum ada skill</p>
          )}
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <i className="bi bi-clipboard fs-2 mb-2"></i>
              <h6 className="fw-bold">Project</h6>
              <p className="text-muted small">Tugas dan proyek dari guru</p>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => openModal("project")}
              >
                {" "}
                Tambah data
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <i className="bi bi-journal-text fs-2 mb-2"></i>
              <h6 className="fw-bold">Pengalaman</h6>
              <p className="text-muted small">
                Pengalaman selama di SMK TI BAZMA
              </p>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => openModal("pengalaman")}
              >
                Tambah data
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <i className="bi bi-person-vcard fs-2 mb-2"></i>
              <h6 className="fw-bold">Data Pribadi</h6>
              <p className="text-muted small">Tentang Anda dan data diri</p>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => openModal("pribadi")}
              >
                Edit data
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && modalType === "pribadi" && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center"
          style={{ zIndex: 1055 }}
        >
          <div
            className="bg-white rounded-3 p-3 shadow w-100"
            style={{ maxWidth: "480px" }}
          >
            <button
              className="btn-close position-absolute end-0 me-3 mt-3"
              aria-label="Close"
              onClick={() => setShowModal(false)}
            ></button>
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
              ].map((field, idx) =>
                field === "keahlian" ? (
                  <select
                    key={idx}
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
                ) : (
                  <input
                    key={idx}
                    type={field === "password" ? "password" : "text"}
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                    className="form-control mb-2"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  />
                )
              )}

              <select
                name="status"
                value={formData.status || ""}
                onChange={handleChange}
                className="form-select mb-2"
              >
                <option value="">Pilih Status</option>
                <option value="siswa">Siswa</option>
                <option value="alumni">Alumni</option>
              </select>

              <div className="mb-2">
                <label className="form-label mb-1">Foto</label>
                <input
                  type="file"
                  name="foto"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label mb-1">CV</label>
                <input
                  type="file"
                  name="cv"
                  className="form-control"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      cv: e.target.files[0],
                    }))
                  }
                />
              </div>

              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary">
                  Simpan
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

      {showModal && modalType === "pengalaman" && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center"
          style={{ zIndex: 1055 }}
        >
          <div
            className="bg-white rounded-3 p-3 shadow w-100"
            style={{ maxWidth: "480px" }}
          >
            <button
              className="btn-close position-absolute end-0 me-3 mt-3"
              aria-label="Close"
              onClick={() => setShowModal(false)}
            ></button>
            <h5 className="fw-bold mb-3">Tambah Pengalaman</h5>
            <form onSubmit={handleSubmitPengalaman}>
              <input
                type="text"
                name="name"
                value={pengalamanForm.name}
                onChange={handlePengalamanChange}
                className="form-control mb-2"
                placeholder="Nama Pengalaman"
                required
              />
              <input
                type="text"
                name="lokasi"
                value={pengalamanForm.lokasi}
                onChange={handlePengalamanChange}
                className="form-control mb-2"
                placeholder="Lokasi"
                required
              />
              <textarea
                name="deskripsi"
                value={pengalamanForm.deskripsi}
                onChange={handlePengalamanChange}
                className="form-control mb-2"
                placeholder="Deskripsi"
                rows="3"
                required
              ></textarea>

              <div className="mb-3">
                <label className="form-label mb-1">Foto (opsional)</label>
                <input
                  type="file"
                  name="foto"
                  className="form-control"
                  onChange={handlePengalamanFileChange}
                />
              </div>

              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary">
                  Simpan
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

      {showModal && modalType === "project" && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center"
          style={{ zIndex: 1055 }}
        >
          <div
            className="bg-white rounded-3 p-3 shadow w-100"
            style={{ maxWidth: "480px" }}
          >
            <button
              className="btn-close position-absolute end-0 me-3 mt-3"
              aria-label="Close"
              onClick={() => setShowModal(false)}
            ></button>
            <h5 className="fw-bold mb-3">Tambah Project</h5>
            <form>
              <input
                type="text"
                name="name_project"
                value={projectForm.name_project}
                onChange={handleProjectChange}
                className="form-control mb-2"
                placeholder="Nama Project"
                required
              />
              <input
                type="text"
                name="link_web"
                value={projectForm.link_web}
                onChange={handleProjectChange}
                className="form-control mb-2"
                placeholder="Link Web (jika ada)"
              />
              <textarea
                name="deskripsi"
                value={projectForm.deskripsi}
                onChange={handleProjectChange}
                className="form-control mb-2"
                placeholder="Deskripsi"
                rows="3"
                required
              ></textarea>
              <input
                type="text"
                name="tools"
                value={projectForm.tools}
                onChange={handleProjectChange}
                className="form-control mb-2"
                placeholder="Tools yang digunakan (pisahkan dengan koma)"
                required
              />

              <div className="mb-3">
                <label className="form-label mb-1">Foto (opsional)</label>
                <input
                  type="file"
                  name="foto"
                  className="form-control"
                  onChange={handleProjectFileChange}
                />
              </div>

              <div className="d-flex justify-content-between">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleSubmitProject}
                >
                  Simpan
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
};

export default EditSiswa;
