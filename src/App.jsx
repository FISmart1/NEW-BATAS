import React, { useState, useContext, useEffect } from "react";
import AppRoutes from "./routes/index";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import bazmaLogo from "../src/assets/logo-bazma.png";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function App() {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const { showLayout } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [nis, setNis] = useState("");
  const [password, setPassword] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    // Efek Bintang
    const handleMouseMove = (e) => {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = `${e.pageX}px`;
      star.style.top = `${e.pageY}px`;
      document.body.appendChild(star);
      setTimeout(() => {
        star.remove();
      }, 500);
    };

    // Efek Scroll Progress
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrollPercent = (scrollTop / scrollHeight) * 100;

      const progressBar = document.getElementById("scrollProgress");
      if (progressBar) {
        progressBar.style.width = `${scrollPercent}%`;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3006/api/login", {
        nis,
        password,
      });

      if (res.data.success) {
        setShowModal(false);

        if (res.data.role === "admin") {
          navigate("/admin");
        } else if (res.data.role === "siswa") {
          // Redirect ke halaman edit siswa berdasarkan ID
          navigate(`/edit-siswa/${res.data.data.id}`);
        }
      } else {
        alert(res.data.message || "Login gagal");
      }
    } catch (err) {
      console.error("Login gagal:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Terjadi kesalahan saat login");
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      {showLayout && (
        <>
          <nav
            className="navbar navbar-expand-lg fixed-top border-bottom py-3"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)", // transparansi
              backdropFilter: "blur(5px)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              zIndex: 999,
            }}
          >
            <div className="container d-flex justify-content-between align-items-center">
              {/* Logo & Title */}
              <div
                className="d-flex flex-column align-items-start"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/home")}
              >
                <span
                  className="fw-bold"
                  style={{ color: "#12294A", fontSize: "28px" }}
                >
                  BATAS
                </span>
                <span className="text-muted" style={{ fontSize: "13px" }}>
                  Bazma Talent Showcase
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="collapse navbar-collapse justify-content-end d-none d-lg-flex">
                <div className="navbar-nav d-flex gap-4 align-items-center">
                  <Link to="/home" className="nav-link text-dark">
                    Home
                  </Link>
                  <Link to="/angkatan" className="nav-link text-dark">
                    Student
                  </Link>
                  <button
                    className="btn"
                    style={{ backgroundColor: "#12294A", color: "white" }}
                    onClick={() => setShowModal(true)}
                  >
                    Login
                  </button>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="d-lg-none">
                <button
                  className="btn btn-outline-primary"
                  style={{ borderRadius: "8px" }}
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                  <i className="bi bi-three-dots-vertical fs-4"></i>
                </button>
              </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {showMobileMenu && (
              <div
                className="position-absolute bg-white shadow rounded p-3 mt-2"
                style={{
                  right: 15,
                  top: "100%",
                  zIndex: 1050,
                  backgroundColor: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(6px)",
                  width: "200px",
                }}
              >
                <Link
                  to="/home"
                  className="btn d-block mb-2"
                  style={{ backgroundColor: "#12294A", color: "white" }}
                  onClick={() => setShowMobileMenu(false)}
                >
                  Home
                </Link>
                <Link
                  to="/angkatan"
                  className="btn d-block mb-2"
                  style={{ backgroundColor: "#12294A", color: "white" }}
                  onClick={() => setShowMobileMenu(false)}
                >
                  Student
                </Link>
                <button
                  className="btn btn-ouline-custom w-100"
                  style={{ border: "1px solid #12294A", color: "black" }}
                  onClick={() => {
                    setShowModal(true);
                    setShowMobileMenu(false);
                  }}
                >
                  Login
                </button>
              </div>
            )}
          </nav>

          {/* Scroll Progress Line */}
          <div className="scroll-progress" id="scrollProgress"></div>
        </>
      )}

      {/* Modal Login */}
      {showModal && (
        <div
          className="modal d-flex justify-content-center align-items-center"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1050,
          }}
        >
          <div
            className="modal-content p-4 rounded bg-white"
            style={{ width: "90%", maxWidth: "400px" }}
          >
            <h2 className="mb-3">Login Admin</h2>
            <input
              type="text"
              placeholder="NIS"
              className="form-control mb-3"
              value={nis}
              onChange={(e) => setNis(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="form-control mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="btn btn-primary w-100 mb-2"
              onClick={handleLogin}
            >
              Login
            </button>
            <button
              className="btn btn-secondary w-100"
              onClick={() => setShowModal(false)}
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Halaman Konten */}
      <div style={{ flex: 1, marginTop: showLayout ? "80px" : "0" }}>
        <AppRoutes />
      </div>

      {/* Footer */}
      {showLayout && (
        <footer className="navbar-custom text-white pt-4">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-2 mb-4">
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={bazmaLogo}
                    alt="Logo"
                    style={{ width: "80px", marginRight: "10px" }}
                  />
                  <h5 className="mb-0">SMK TI BAZMA</h5>
                </div>
                <p className="fw-bold">ENERGI MASA DEPAN INDONESIA</p>
              </div>
              <div className="col-12 col-md-4"></div>
              <div className="col-12 col-md-6 d-flex justify-content-between flex-end">
                <div className="mb-3">
                  <h6 className="fw-bold">Beranda</h6>
                  <p className="mb-1">Siswa</p>
                  <p className="mb-0">Team Dev</p>
                </div>
                <div className="mb-3">
                  <h6 className="fw-bold">Portofolio</h6>
                  <p className="mb-1">SISMAKO</p>
                  <p className="mb-1">SAS</p>
                  <p className="mb-0">Buka Porto</p>
                </div>
                <div className="mb-3">
                  <h6 className="fw-bold">Hubungi Kami</h6>
                  <a
                    href="https://smktibazma.com"
                    className="text-white text-decoration-underline"
                  >
                    smktibazma.com
                  </a>
                </div>
              </div>
            </div>
            <hr className="border-white my-3" />
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <p className="mb-0">EST 2025 From SMK TI BAZMA</p>
              <div>
                <a href="#" className="text-white me-3 fs-5">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="text-white fs-5">
                  <i className="bi bi-youtube"></i>
                </a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
