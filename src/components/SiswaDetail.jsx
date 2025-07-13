import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

function SiswaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [siswa, setSiswa] = useState(null);
  const [projects, setProjects] = useState([]);
  const [pengalaman, setPengalaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [expandedExperiences, setExpandedExperiences] = useState({});

  const baseImageUrl = "https://backend_best.smktibazma.com/uploads/";

  const fetchData = async () => {
    try {
      const res = await axios.get(`https://backend_best.smktibazma.com/api/siswa/${id}`);
      setSiswa(res.data.siswa);
      setProjects(res.data.projects);
      setPengalaman(res.data.pengalaman);
    } catch (err) {
      console.error("Error fetching student data:", err);
      navigate("/not-found", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const toggleExperience = (id) => {
    setExpandedExperiences((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const convertImgToBase64 = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting image to base64:", error);
      return url; // Fallback to original URL if conversion fails
    }
  };

  const downloadPDF = async () => {
    if (!siswa) return;
    
    try {
      const el = document.getElementById("profile-section");
      const img = el.querySelector("img");
      if (img) {
        img.src = await convertImgToBase64(img.src);
      }

      const options = {
        margin: 0.5,
        filename: `${siswa.name}-profile.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      await html2pdf().from(el).set(options).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Gagal mengunduh PDF. Silakan coba lagi.");
    }
  };

  const downloadPNG = async () => {
    if (!siswa) return;
    
    try {
      const canvas = await html2canvas(document.getElementById("profile-section"));
      const link = document.createElement("a");
      link.download = `${siswa.name}-profile.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error generating PNG:", error);
      alert("Gagal mengunduh PNG. Silakan coba lagi.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleShowMore = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!siswa) {
    return (
      <div className="container py-5 text-center">
        <h4>Data siswa tidak ditemukan</h4>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate("/")}
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const carouselResponsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1200 },
      items: 3
    },
    desktop: {
      breakpoint: { max: 1200, min: 992 },
      items: 2
    },
    tablet: {
      breakpoint: { max: 992, min: 768 },
      items: 1
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 1
    }
  };

  return (
    <div className="container py-5">
      {/* Profile Section */}
      <div
        className="card border-0 rounded-4 p-4"
        id="profile-section"
        style={{ color: "#12294A" }}
      >
        {/* Profile Header */}
        <div className="row align-items-center mb-4 border rounded-3 p-3 gx-3 gy-4">
          <div className="col-md-8 col-12">
            <h3 className="fw-bold text-dark">{siswa.name}</h3>
            <p className="text-dark mb-0">
              {siswa.posisi} - {siswa.instansi}
            </p>
            <p className="text-dark mb-0">Alamat : {siswa.alamat}</p>
            <p className="text-dark mt-0">Jumlah hafalan : {siswa.hafalan}</p>
            
            {/* Download Buttons */}
            <div className="d-flex flex-wrap gap-2">
              <button 
                onClick={downloadPDF} 
                className="btn btn-dark"
                aria-label="Download as PDF"
              >
                <i className="bi bi-file-earmark-pdf"></i> PDF
              </button>
              <button 
                onClick={downloadPNG} 
                className="btn btn-dark"
                aria-label="Download as PNG"
              >
                Portofolio <i className="bi bi-box-arrow-up-right"></i>
              </button>
            </div>
            
            {/* Contact Info */}
            <div className="d-flex flex-column gap-2 mt-3">
              {siswa.email && (
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-envelope-fill text-primary"></i>
                  <a
                    href={`mailto:${siswa.email}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-decoration-none text-dark text-truncate"
                  >
                    {siswa.email}
                  </a>
                </div>
              )}
              {siswa.telepon && (
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-telephone-fill text-success"></i>
                  <a
                    href={`https://wa.me/${siswa.telepon}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-decoration-none text-dark"
                  >
                    {siswa.telepon}
                  </a>
                </div>
              )}
            </div>
          </div>
          
          {/* Profile Image */}
          <div className="col-md-4 col-12 text-center">
            <img
              src={`${baseImageUrl}${siswa.foto}`}
              alt={`Profil ${siswa.name}`}
              className="rounded-circle img-fluid"
              style={{ 
                width: "200px", 
                height: "200px", 
                objectFit: "cover" 
              }}
            />
          </div>
        </div>

        {/* About Section */}
        <div className="mb-4 border row p-4 rounded-3 gx-3">
          <h5 className="fw-bold mb-3">Tentang Saya</h5>
          <p style={{ whiteSpace: "pre-line" }}>
            {siswa.deskripsi || "Belum ada deskripsi."}
          </p>
        </div>

        {/* Skills Section */}
        <div className="mb-4">
          <h5 className="fw-bold mb-3 text-dark">Keahlian</h5>
          <div className="d-flex flex-wrap gap-2">
            {siswa.skill ? (
              siswa.skill.split(",").map((s, i) => (
                <span
                  key={i}
                  className="badge text-white p-2"
                  style={{ backgroundColor: "#12294A" }}
                >
                  {s.trim()}
                </span>
              ))
            ) : (
              <span className="text-muted">Belum ada skill</span>
            )}
          </div>
        </div>

        {/* Projects Section */}
        <div className="mb-5">
          <h3 className="fw-bold mb-4 text-black">Proyek</h3>
          {projects.length > 0 ? (
            <Carousel
              responsive={carouselResponsive}
              itemClass="px-2"
              containerClass="px-0 py-3"
              arrows
              infinite={false}
              autoPlay={false}
              keyBoardControl
            >
              {projects.map((p) => {
                const shortDesc = p.deskripsi.length > 80 
                  ? `${p.deskripsi.substring(0, 80)}...` 
                  : p.deskripsi;
                
                return (
                  <div key={p.id} className="h-100">
                    <div className="card shadow-sm border-0 rounded overflow-hidden h-100">
                      {p.foto && (
                        <div className="overflow-hidden" style={{ height: "200px" }}>
                          <img
                            src={`${baseImageUrl}${p.foto}`}
                            alt={p.name_project}
                            className="w-100 h-100"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      )}
                      <div className="card-body d-flex flex-column">
                        <div>
                          <h6 className="fw-bold text-dark">{p.name_project}</h6>
                          <p className="text-muted small text-justify">
                            {shortDesc}
                            {p.deskripsi.length > 80 && (
                              <span 
                                className="text-primary ms-1" 
                                role="button" 
                                onClick={() => handleShowMore(p)}
                                aria-label="Baca selengkapnya"
                              >
                                selengkapnya →
                              </span>
                            )}
                          </p>
                          {p.tools && (
                            <div className="d-flex flex-wrap gap-2">
                              {p.tools.split(",").map((tool, index) => (
                                <span
                                  key={index}
                                  className="badge text-white"
                                  style={{ backgroundColor: "#12294A" }}
                                >
                                  {tool.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {p.link_web && (
                          <a 
                            href={p.link_web} 
                            className="btn btn-dark mt-2" 
                            target="_blank" 
                            rel="noreferrer"
                            aria-label="Lihat proyek"
                          >
                            Lihat Project <i className="bi bi-box-arrow-up-right"></i>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </Carousel>
          ) : (
            <p className="text-muted">Belum ada proyek.</p>
          )}
        </div>

        {/* Experience Section */}
        <div className="mb-4 text-dark">
          <h3 className="fw-bold mb-4">Pengalaman</h3>
          {pengalaman.length > 0 ? (
            pengalaman.map((e) => (
              <div key={e.id} className="mb-3 p-3 border-start border-dark">
                <h6 className="fw-bold">{e.name}</h6>
                <p className="mb-1">Lokasi: {e.lokasi}</p>
                <p style={{ fontSize: "14px" }}>
                  {expandedExperiences[e.id]
                    ? e.deskripsi
                    : `${e.deskripsi.slice(0, 100)}${e.deskripsi.length > 100 ? "..." : ""}`}
                  {e.deskripsi.length > 100 && (
                    <span
                      role="button"
                      className="ms-2 text-primary"
                      onClick={() => toggleExperience(e.id)}
                      aria-label={expandedExperiences[e.id] ? "Sembunyikan" : "Tampilkan lebih banyak"}
                    >
                      {expandedExperiences[e.id] ? "Sembunyikan" : "Tampilkan lebih banyak"}
                    </span>
                  )}
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted">Belum ada pengalaman.</p>
          )}
        </div>
      </div>

      {/* Project Modal */}
      {showModal && selectedProject && (
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedProject.name_project}</h5>
                <button 
                  className="btn-close" 
                  onClick={handleCloseModal}
                  aria-label="Tutup"
                ></button>
              </div>
              <div className="modal-body">
                {selectedProject.foto && (
                  <img
                    src={`${baseImageUrl}${selectedProject.foto}`}
                    className="img-fluid mb-3"
                    alt={selectedProject.name_project}
                  />
                )}
                <p>{selectedProject.deskripsi}</p>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary" 
                  onClick={handleCloseModal}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SiswaDetail;