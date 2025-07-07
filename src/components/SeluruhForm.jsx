import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";

function FormPengajuanProject() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedPath, setSelectedPath] = useState("");
  const [password, setPassword] = useState("");
  const [correctPassword, setCorrectPassword] = useState("");

  useEffect(() => {
    // Ambil password dari backend
    axios.get("http://localhost:3006/api/password_edit")
      .then((res) => setCorrectPassword(res.data.password))
      .catch((err) => {
        console.error("Gagal mengambil password:", err);
        alert("Gagal mengambil password!");
      });
  }, []);

  const handleClick = (path) => {
    setSelectedPath(path);
    setShowModal(true);
  };

  const handleConfirm = async () => {
  const res = await axios.post("http://localhost:3006/api/verify-password", { password });
  if (res.data.success) {
    navigate(selectedPath);
  } else {
    alert("Password salah!");
  }
};


  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center" style={{ padding: "60px 20px" }}>
      <div className="w-100 mb-4" style={{ maxWidth: "900px" }}>
        <button className="btn btn-outline-dark" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left-circle me-2"></i> Kembali
        </button>
      </div>

      <h2 className="text-center mb-4 fw-bold text-black">Pilih Form Pengajuan</h2>

      <div className="row justify-content-center gap-4 w-100" style={{ maxWidth: "900px" }}>
        <div className="text-decoration-none text-dark flex-fill col-6 col-md-3" onClick={() => handleClick("/formproject")}>
          <div className="p-4 rounded-4 shadow-lg h-100 text-center bg-white" style={{ transition: "transform 0.3s" }}>
            <i className="bi bi-clipboard-plus-fill fs-1 text-dark mb-3"></i>
            <h5 className="fw-semibold mb-2">Form Project</h5>
            <p className="text-muted small">Ajukan project baru Anda untuk ditampilkan di BukaPorto.</p>
          </div>
        </div>
        <div className="text-decoration-none text-dark flex-fill col-6 col-md-3" onClick={() => handleClick("/formsiswa")}>
          <div className="p-4 rounded-4 shadow-lg h-100 text-center bg-white">
            <i className="bi bi-person-lines-fill fs-1 text-dark mb-3"></i>
            <h5 className="fw-semibold mb-2">Form Update Siswa</h5>
            <p className="text-muted small">Perbarui data siswa seperti keahlian, posisi, atau instansi.</p>
          </div>
        </div>
        <div className="text-decoration-none text-dark flex-fill col-6 col-md-3" onClick={() => handleClick("/formpengalaman")}>
          <div className="p-4 rounded-4 shadow-lg h-100 text-center bg-white">
            <i className="bi bi-person-lines-fill fs-1 text-dark mb-3"></i>
            <h5 className="fw-semibold mb-2">Form Pengalaman</h5>
            <p className="text-muted small">Tambahkan pengalaman yang kalian miliki.</p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal d-flex justify-content-center align-items-center" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="modal-content p-4 rounded bg-white" style={{ width: "90%", maxWidth: "400px" }}>
            <h5 className="mb-3 fw-bold">Verifikasi Password</h5>
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Masukkan Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-primary w-100 mb-2" onClick={handleConfirm}>
              Masuk
            </button>
            <button className="btn btn-secondary w-100" onClick={() => setShowModal(false)}>
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormPengajuanProject;
