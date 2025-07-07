import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Spinner } from "react-bootstrap";

function AdminApproveProject() {
  const [pendingProjects, setPendingProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = () => {
    setLoading(true);
    axios.get("http://localhost:3006/api/getproject_pending").then((res) => {
      setPendingProjects(res.data.filter((p) => p.status === 0 || p.status === "0"));
      setLoading(false);
    });
  };

  const handleApprove = async (projectId) => {
    try {
      await axios.put(`http://localhost:3006/api/approve_project/${projectId}`);
      alert("✅ Project berhasil disetujui!");
      fetchPending();
    } catch (err) {
      console.error(err);
      alert("❌ Gagal menyetujui project.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus pengalaman ini?")) {
      try {
        await axios.delete(
          `http://localhost:3006/api/delproject-pending/${id}`
        );
        alert("🗑️ Project berhasil dihapus.");
        fetchPending();
      } catch (err) {
        console.error(err);
        alert("❌ Gagal menghapus pengalaman.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex align-items-center mb-4">
        <i className="bi bi-check-circle-fill text-success fs-3 me-2"></i>
        <h2 className="fw-bold mb-0">Persetujuan Proyek</h2>
      </div>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Memuat project pending...</p>
        </div>
      ) : pendingProjects.length === 0 ? (
        <div className="alert alert-secondary">Tidak ada project menunggu.</div>
      ) : (
        <div className="row">
          {pendingProjects.map((p) => (
            <motion.div
              key={p.id}
              className="col-md-6 mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="card shadow-sm h-100 border-0">
                <img
                  src={`http://localhost:3006/uploads/${p.foto}`}
                  className="card-img-top"
                  style={{ objectFit: "cover", height: "220px" }}
                  alt={p.name_project}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{p.name_project}</h5>
                  <p className="card-text text-muted small mb-2">{p.deskripsi}</p>
                  <span className="badge bg-warning text-dark mb-3" style={{ width: "fit-content" }}>
                    Menunggu Persetujuan
                  </span>
                  <button
                    onClick={() => handleApprove(p.id)}
                    className="btn btn-success mt-auto"
                  >
                    <i className="bi bi-check2-circle me-1"></i> Setujui
                  </button>
                  <button
                      onClick={() => handleDelete(p.id)}
                      className="btn btn-outline-danger w-100"
                    >
                      <i className="bi bi-trash3 me-1"></i> Hapus
                    </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminApproveProject;
