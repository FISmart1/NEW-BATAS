// SiswaDetail.js
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

  const baseImageUrl = "http://localhost:3006/uploads/";

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:3006/api/siswa/${id}`);
      setSiswa(res.data.siswa);
      setProjects(res.data.projects);
      setPengalaman(res.data.pengalaman);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExperience = (id) => {
    setExpandedExperiences((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const convertImgToBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const downloadPDF = async () => {
    const el = document.getElementById("profile-section");
    const img = el.querySelector("img");
    if (img) img.src = await convertImgToBase64(img.src);

    html2pdf()
      .from(el)
      .set({
        margin: 0.5,
        filename: `${siswa.name}-profile.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .save();
  };

  const downloadPNG = async () => {
    const canvas = await html2canvas(document.getElementById("profile-section"));
    const link = document.createElement("a");
    link.download = `${siswa.name}-profile.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleShowMore = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!siswa) return <p className="text-center mt-5">Data siswa tidak ditemukan.</p>;

  return (
    <div className="container py-5">
      <div
        className="card border-0 rounded-4 p-4"
        id="profile-section"
        style={{ color: "#12294A" }}
      >
        <div className="row align-items-center mb-4 border rounded-3 p-3 gx-3 gy-4">
          <div className="col-md-8 col-12">
            <h3 className="fw-bold text-dark">{siswa.name}</h3>
            <p className="text-dark">
              {siswa.posisi} - {siswa.instansi}
            </p>
            <div className="d-flex flex-wrap gap-2">
              <button onClick={downloadPDF} className="btn btn-dark">
                <i className="bi bi-file-earmark-pdf"></i> PDF
              </button>
              <button onClick={downloadPNG} className="btn btn-dark">
                Portofolio <i className="bi bi-box-arrow-up-right"></i>
              </button>
            </div>
            <div className="d-flex flex-column gap-2 mt-3">
              {siswa.email && (
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-envelope-fill text-primary"></i>
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${siswa.email}`}
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
          <div className="col-md-4 col-12 text-center">
            <img
              src={`${baseImageUrl}${siswa.foto}`}
              alt="profil"
              className="rounded-circle img-fluid"
              style={{ width: "200px", height: "200px", objectFit: "cover" }}
            />
          </div>
        </div>

        <div className="mb-4 border row p-4 rounded-3 gx-3">
          <h5 className="fw-bold mb-3">Tentang Saya</h5>
          <p style={{ whiteSpace: "pre-line" }}>{siswa.deskripsi}</p>
        </div>

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

        <div className="mb-5">
          <h3 className="fw-bold mb-4 text-black">Proyek</h3>
          <Carousel
            responsive={{
              superLargeDesktop: { breakpoint: { max: 4000, min: 1200 }, items: 3 },
              desktop: { breakpoint: { max: 1200, min: 992 }, items: 2 },
              tablet: { breakpoint: { max: 992, min: 768 }, items: 1 },
              mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
            }}
            itemClass="px-2"
            containerClass="px-0 py-3"
            arrows
            infinite={false}
            autoPlay={false}
            keyBoardControl
          >
            {projects.map((p) => {
              const shortDesc = p.deskripsi.length > 80 ? p.deskripsi.substring(0, 80) + "..." : p.deskripsi;
              return (
                <div key={p.id} className="h-100">
                  <div className="card shadow-sm border-0 rounded overflow-hidden h-100">
                    {p.foto && (
                      <div className="overflow-hidden" style={{ height: "200px" }}>
                        <img
                          src={`http://localhost:3006/uploads/${p.foto}`}
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
                            <span className="text-primary ms-1" role="button" onClick={() => handleShowMore(p)}>
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
                        <a href={p.link_web} className="btn btn-dark mt-2" target="_blank" rel="noreferrer">
                          Lihat Project <i className="bi bi-box-arrow-up-right"></i>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </Carousel>
        </div>

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
                    : e.deskripsi.slice(0, 100) + (e.deskripsi.length > 100 ? "..." : "")}
                  {e.deskripsi.length > 100 && (
                    <span
                      role="button"
                      className="ms-2 text-primary"
                      onClick={() => toggleExperience(e.id)}
                    >
                      {expandedExperiences[e.id] ? "Show Less" : "Show More"}
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

      {showModal && selectedProject && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedProject.name_project}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <img
                  src={`${baseImageUrl}${selectedProject.foto}`}
                  className="img-fluid mb-3"
                  alt="project"
                />
                <p>{selectedProject.deskripsi}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
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
