import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { fadeInUp } from "./utils/animations";

// Import assets
import yakes from "../assets/logo-yakes.png";
import ptn from "../assets/ptn.png";
import hulurokan from "../assets/hulu-rokan.png";
import elnusa from "../assets/elnusa.png";
import pertamina from "../assets/pertamina.png";
import pgn from "../assets/pgn.png";
import ptc from "../assets/ptc.png";
import pertaminageo from "../assets/pertaminageo.png";
import retail from "../assets/retail.png";
import ssc from "../assets/ssc.png";
import pertalife from "../assets/perta.png";
import sekolah from "../assets/sekolah.png";
import sas from "../assets/sas.png";
import absensi from "../assets/absensi.png";
import orang from "../assets/orang.png";
import webJurnal from "../assets/web-jurnal.png";

function Home() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [text, setText] = useState("");
  const [greetIndex, setGreetIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [projects, setProjects] = useState([]);
  const [nonPelajar, setNonPelajar] = useState([]);
  const [allSiswa, setAllSiswa] = useState([]);
  const [filteredSiswa, setFilteredSiswa] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [skillList, setSkillList] = useState([]);
  const [keahlianList, setKeahlianList] = useState([]);
  const [AsalList, setAsalList] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedKeahlian, setSelectedKeahlian] = useState("");
  const [selectedAsal, setSelectedAsal] = useState("");
  const [reverseAnimation, setReverseAnimation] = useState(false);

  const nonPelajarScrollRef = useRef(null);
  const mitraRef = useRef(null);
  const imageBaseUrl = "https://backend_best.smktibazma.com/uploads/";
  const logos = [
    yakes,
    ptn,
    hulurokan,
    elnusa,
    pertamina,
    pgn,
    ptc,
    pertaminageo,
    retail,
    ssc,
    pertalife,
  ];

  const greetings = [
    "Welcome To",
    "Selamat Datang",
    "ようこそ",
    "환영합니다",
    "Bienvenue",
  ];

  const truncateText = (text, maxLength = 120) =>
    text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

  const handleDoubleClick = () => {
    setReverseAnimation((prev) => !prev);
  };

  const scrollLeft = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const scrollRight = () => {
    if (currentIndex < nonPelajar.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  // Animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [siswaRes, projectsRes] = await Promise.all([
          axios.get("https://backend_best.smktibazma.com/api/getsiswa"),
          axios.get("https://backend_best.smktibazma.com/api/projects"),
        ]);

        const siswaData = siswaRes.data.filter((s) => s.status === "alumni");
        const nonPelajarData = siswaData.filter(
          (s) => s.posisi !== "Pelajar" && s.instansi?.trim()
        );

        setNonPelajar(nonPelajarData);
        setAllSiswa(siswaData);
        setFilteredSiswa(siswaData);
        setProjects(projectsRes.data);

        // Extract unique values
        const keahlianSet = new Set(
          siswaData.map((s) => s.keahlian).filter(Boolean)
        );
        const asalSet = new Set(siswaData.map((s) => s.alamat).filter(Boolean));
        const allSkills = siswaData.flatMap((s) =>
          s.skill ? s.skill.split(",").map((sk) => sk.trim()) : []
        );

        setKeahlianList([...keahlianSet]);
        setAsalList([...asalSet]);
        setSkillList([...new Set(allSkills)]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Greeting animation
  useEffect(() => {
    const currentGreeting = greetings[greetIndex];
    if (charIndex < currentGreeting.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + currentGreeting[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      const pause = setTimeout(() => {
        setCharIndex(0);
        setText("");
        setGreetIndex((prev) => (prev + 1) % greetings.length);
      }, 2500);
      return () => clearTimeout(pause);
    }
  }, [charIndex, greetIndex]);

  // Filter students
  useEffect(() => {
    const filtered = allSiswa.filter((s) => {
      const searchLower = searchTerm.toLowerCase();
      const matchSearch =
        s.name.toLowerCase().includes(searchLower) ||
        (s.keahlian && s.keahlian.toLowerCase().includes(searchLower)) ||
        (s.skill && s.skill.toLowerCase().includes(searchLower));

      const matchKeahlian =
        selectedKeahlian === "" || s.keahlian === selectedKeahlian;
      const matchAsal = selectedAsal === "" || s.alamat === selectedAsal;
      const matchSkill =
        selectedSkill === "" ||
        (s.skill &&
          s.skill
            .split(",")
            .map((sk) => sk.trim().toLowerCase())
            .includes(selectedSkill.toLowerCase()));

      return matchSearch && matchKeahlian && matchAsal && matchSkill;
    });

    setFilteredSiswa(filtered);
  }, [searchTerm, selectedKeahlian, selectedSkill, selectedAsal, allSiswa]);

  // Auto-scroll for partner logos
  useEffect(() => {
    const track = mitraRef.current;
    if (!track) return;

    let animationFrame;
    const speed = 0.5;
    const scroll = () => {
      track.scrollLeft += speed;
      if (track.scrollLeft >= track.scrollWidth / 2) {
        track.scrollLeft -= track.scrollWidth / 2;
      }
      animationFrame = requestAnimationFrame(scroll);
    };
    animationFrame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Touch events for alumni slider
  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const delta = touchStartX - touchEndX;
      if (Math.abs(delta) > 50) {
        delta > 0 ? scrollRight() : scrollLeft();
      }
    };

    let touchStartX = 0;
    let touchEndX = 0;
    const container = nonPelajarScrollRef.current;

    if (container) {
      container.addEventListener("touchstart", handleTouchStart);
      container.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [currentIndex]);

  return (
    <div className="flex-column flex-md-row">
      {/* Hero Section */}
      <motion.div
        className="py-5 position-relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        style={{ backgroundColor: "#12294A" }}
      >
        <div className="container my-5">
          <div className="row align-items-center p-3">
            <div className="col-12 col-md-6 text-white mb-4 mb-md-0 text-center text-md-start">
              <h3 className="fw-semibold" style={{ minHeight: "2.5rem" }}>
                {text}
                <span className="blinking-cursor">|</span>
              </h3>
              <h1 className="display-4 fw-bold">BEST</h1>
              <p className="fst-italic text-light">
                Temukan talenta terbaik dari SMK TI Bazma dan lihat karya nyata
                mereka.
              </p>
              <p className="text-justify">
                BEST adalah platform untuk menampilkan portofolio siswa SMK.
                Siswa dapat membagikan proyek mereka secara online dan
                masyarakat bisa mengakses informasi tersebut dengan mudah.
              </p>
              <div className="d-flex flex-wrap gap-2 mt-3">
                <span className="badge bg-light text-dark">Web Developer</span>
                <span className="badge bg-light text-dark">UI/UX Design</span>
                <span className="badge bg-light text-dark">Networking</span>
                <span className="badge bg-light text-dark">IoT Engineer</span>
              </div>
              <Link
                to="/angkatan"
                className="btn text-black mt-4"
                style={{ backgroundColor: "white" }}
              >
                Lihat Siswa
              </Link>
            </div>
            <div className="col-12 col-md-6 d-flex justify-content-center">
              <motion.img
                src={orang}
                alt="Ilustrasi Siswa"
                className="img-fluid"
                style={{ maxHeight: "600px", objectFit: "contain" }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Alumni Section */}
      <motion.div
        className="container-fluid p-4 mt-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="d-flex flex-column align-items-center justify-content-center mx-auto">
          <h2 className="text-center fw-bold mb-3 text-black col-12 col-md-8">
            Jejak Alumni, Cermin Keberhasilan dan Kebermanfaatan
          </h2>
          <p className="text-justify mb-4 text-black col-12 col-md-8 ">
            Dari ruang kelas menuju perusahaan terkemuka, alumni kami
            membuktikan bahwa mimpi besar bisa terwujud melalui kerja keras dan
            kompetensi.
          </p>
        </div>

        <div className="d-flex align-items-center justify-content-center container">
          <button
            className="btn btn-outline-light rounded-circle shadow d-none d-md-block"
            style={{
              backgroundColor: "#12294A",
              width: "50px",
              height: "50px",
            }}
            onClick={scrollLeft}
            aria-label="Previous alumni"
          >
            ←
          </button>

          <div
            ref={nonPelajarScrollRef}
            className="d-flex align-items-center justify-content-center px-4 mb-3 w-100"
            style={{
              overflowX: "hidden",
              position: "relative",
              minHeight: "420px",
            }}
          >
            {nonPelajar.length > 0 && (
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="row w-100 align-items-stretch flex-column flex-md-row"
                  style={{ minHeight: "420px", width: "100%" }}
                >
                  <div className="row w-100 align-items-center flex-column flex-md-row">
                    <div className="col-12 col-md-6 text-center">
                      <img
                        src={`${imageBaseUrl}${nonPelajar[currentIndex].foto}`}
                        className="img-fluid rounded-4"
                        alt={nonPelajar[currentIndex].name}
                        style={{
                          height: "320px",
                          objectFit: "cover",
                          maxWidth: "100%",
                          minWidth: "100%",
                          boxShadow: "0 0 12px 0px #12294A",
                        }}
                      />
                    </div>
                    <div
                      className="col-md-6 text-black text-justify text-md-start px-3 px-md-5 py-3"
                      style={{
                        minHeight: "320px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <h3 className="fw-bold">
                        {nonPelajar[currentIndex].name}
                      </h3>
                      <p className="ml-3" style={{ minHeight: "72px", maxWidth: "80%" }}>
                        {truncateText(
                          nonPelajar[currentIndex].deskripsi ||
                            "Tidak ada deskripsi",
                          150
                        )}
                      </p>
                      <p>
                        <i className="bi bi-building me-2"></i>
                        {nonPelajar[currentIndex].instansi} -{" "}
                        {nonPelajar[currentIndex].posisi}
                      </p>
                      <Link
                        to={`/siswa/${nonPelajar[currentIndex].id}`}
                        className="btn mt-3 d-inline-block"
                        style={{ color: "white", backgroundColor: "#12294A" }}
                      >
                        Lihat Detail!
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          <button
            className="btn btn-outline-light rounded-circle shadow d-none d-md-block"
            style={{
              backgroundColor: "#12294A",
              width: "50px",
              height: "50px",
            }}
            onClick={scrollRight}
            aria-label="Next alumni"
          >
            →
          </button>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        className="container-fluid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        style={{ backgroundColor: "#12294A" }}
      >
        <div className="container p-5">
          <div className="row text-center justify-content-center align-items-center">
            <div className="col-12 col-md-4">
              <div className="d-flex flex-column align-items-center">
                <div
                  className="bg-white bg-opacity-25 rounded-circle mb-3 d-flex align-items-center justify-content-center"
                  style={{ width: "60px", height: "60px" }}
                >
                  <i className="bi bi-people-fill fs-3 text-white"></i>
                </div>
                <h5 className="fw-bold mb-1 text-white">
                  {filteredSiswa.length}+ Alumni
                </h5>
                <p className="text-white small">
                  Talenta dari berbagai keahlian
                </p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="d-flex flex-column align-items-center">
                <div
                  className="bg-white bg-opacity-25 rounded-circle mb-3 d-flex align-items-center justify-content-center"
                  style={{ width: "60px", height: "60px" }}
                >
                  <i className="bi bi-award-fill fs-3 text-white"></i>
                </div>
                <h5 className="fw-bold mb-1 text-white">
                  {skillList.length}+ Skill
                </h5>
                <p className="text-white small">
                  Skill yang dibutuhkan didunia kerja
                </p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="d-flex flex-column align-items-center">
                <div
                  className="bg-white bg-opacity-25 rounded-circle mb-3 d-flex align-items-center justify-content-center"
                  style={{ width: "60px", height: "60px" }}
                >
                  <i className="bi bi-briefcase-fill fs-3 text-white"></i>
                </div>
                <h5 className="fw-bold mb-1 text-white">
                  {AsalList.length}+ Asal daerah
                </h5>
                <p className="text-white small">Asal daerah talenta kita</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Student Search Section */}
      <motion.div
        className="container my-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="container-fluid my-5">
          <h2
            className="fw-bold"
            style={{ color: "#12294A", textAlign: "center" }}
          >
            Temukan Talenta Terbaik
          </h2>
          <p className="text-muted text-center">
            Jelajahi profil siswa berbakat dari SMK TI Bazma dan temukan
            kolaborator terbaik untuk proyek anda.
          </p>
        </div>

        <div className="container mb-5">
          <div className="bg-white shadow-sm rounded-4 px-3 px-md-5 py-4 mb-4 d-flex flex-column flex-lg-row align-items-stretch justify-content-between gap-3">
            <input
              type="text"
              className="form-control rounded-3 px-4"
              style={{ flex: 1, minWidth: "340px" }}
              placeholder="🔍 Cari nama atau keahlian..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="form-select rounded-3"
              style={{ maxWidth: "200px" }}
              value={selectedKeahlian}
              onChange={(e) => setSelectedKeahlian(e.target.value)}
            >
              <option value="">Keahlian</option>
              {keahlianList.map((item, idx) => (
                <option key={idx} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              className="form-select rounded-3"
              style={{ maxWidth: "200px" }}
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
            >
              <option value="">Skill</option>
              {skillList.map((item, idx) => (
                <option key={idx} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              className="form-select rounded-3"
              style={{ maxWidth: "200px" }}
              value={selectedAsal}
              onChange={(e) => setSelectedAsal(e.target.value)}
            >
              <option value="">Daerah Asal</option>
              {AsalList.map((item, idx) => (
                <option key={idx} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row">
          {filteredSiswa.length > 0 ? (
            filteredSiswa.map((s) => (
              <div className="col-6 col-sm-6 col-lg-4 mb-4" key={s.id}>
                <div className="card h-100 shadow-custom border-0">
                  <div className="card-body d-flex flex-column">
                    <div
                      className="d-flex align-items-center mb-3"
                      style={{ gap: "0.75rem" }}
                    >
                      <img
                        src={`${imageBaseUrl}${s.foto}`}
                        alt={s.name}
                        className="rounded-circle"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <h5
                          className="mb-0 text-truncate"
                          style={{ maxWidth: "100%" }}
                        >
                          {s.name}
                        </h5>
                        <div className="d-flex flex-column">
                          <small className="text-muted">
                            Angkatan {s.angkatan}
                          </small>
                          <small className="text-muted">
                            Alamat {s.alamat}
                          </small>
                        </div>
                      </div>
                    </div>

                    <p
                      className="mb-3"
                      style={{
                        fontSize: "0.9rem",
                        backgroundColor: "#12294A",
                        color: "white",
                        padding: "5px",
                        borderRadius: "5px",
                        width: "fit-content",
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={s.keahlian}
                    >
                      <strong>{s.keahlian}</strong>
                    </p>

                    <p className="mb-1 text-truncate">
                      <i className="bi bi-building me-1"></i>
                      {s.instansi || "-"}, {s.posisi || "-"}
                    </p>

                    <p className="small mb-3 text-truncate">
                      <i className="bi bi-lightning-fill me-1"></i>
                      {s.skill || "-"}
                    </p>

                    <div className="mt-auto">
                      <button
                        className="btn w-100"
                        style={{ backgroundColor: "#12294A", color: "white" }}
                        onClick={() => navigate(`/siswa/${s.id}`)}
                      >
                        Lihat Profil
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted mt-4">
              <p>
                🔍 Gunakan filter di atas untuk mulai menelusuri data siswa.
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Projects Section */}
      <motion.div
        className="mt-5 mb-5 p-5"
        style={{ backgroundColor: "#12294A" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="container text-white">
          <div className="row align-items-center text-justify gap-">
            <div className="col-md-5">
              <h1 className="fw-bold mb-3">Project Siswa</h1>
              <p>
                Di balik setiap proyek, ada semangat belajar, kerja keras, dan
                inovasi. Proyek-proyek ini adalah bukti bahwa siswa SMK TI BAZMA
                mampu menciptakan teknologi yang bermanfaat dan siap bersaing di
                dunia industri maupun masyarakat.
              </p>
              <ul>
                <li>SISMAKO (Sistem Managament Sekolah)</li>
                <li>Webite Sekolah</li>
                <li>Sistem Absensi</li>
                <li>Jurnal PKL</li>
              </ul>
            </div>
            <div className="col-md-7 ml-5">
              <div className="row justify-content-center gap-3">
                <motion.div
                  className="col-3 col-md-6 card border-0 rounded p-0"
                  style={{
                    width: "300px",
                    height: "250px",
                    overflow: "hidden",
                    animation: "glowChange 4s infinite",
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <img
                    src={absensi}
                    className="w-100"
                    style={{ height: "360px", objectFit: "cover" }}
                    alt="Absensi Project"
                  />
                  <div className="p-3 bg-white">
                    <h5 className="text-dark">Sistem Absensi</h5>
                  </div>
                </motion.div>

                <motion.div
                  className="col-3 col-md-6 card border-0 rounded p-0"
                  style={{
                    width: "300px",
                    height: "250px",
                    overflow: "hidden",
                    animation: "glowChange 4s infinite",
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <img
                    src={sas}
                    className="w-100"
                    style={{ height: "360px", objectFit: "cover" }}
                    alt="Sismako Project"
                  />
                  <div className="p-3 bg-white">
                    <h5 className="text-dark">SISMAKO</h5>
                  </div>
                </motion.div>

                <motion.div
                  className="col-3 col-md-6 card border-0 rounded p-0 mt-4"
                  style={{
                    width: "300px",
                    height: "280px",
                    overflow: "hidden",
                    animation: "glowChange 4s infinite",
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <img
                    src={sekolah}
                    className="w-100"
                    style={{ height: "220px", objectFit: "cover" }}
                    alt="Website Sekolah Project"
                  />
                  <div className="p-3 bg-white">
                    <h5 className="text-dark">Website Sekolah</h5>
                  </div>
                </motion.div>
                <motion.div
                  className="col-3 col-md-6 card border-0 rounded p-0 mt-4"
                  style={{
                    width: "300px",
                    height: "280px",
                    overflow: "hidden",
                    animation: "glowChange 4s infinite",
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <img
                    src={webJurnal}
                    className="w-100"
                    style={{ height: "220px", objectFit: "cover" }}
                    alt="Website Sekolah Project"
                  />
                  <div className="p-3 bg-white">
                    <h5 className="text-dark">Jurnal PKL</h5>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Partners Section */}
      <motion.div
        className="my-5 py-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h1 className="text-center mb-4">Mitra Kami</h1>
        <div className="px-2">
          <div
            ref={mitraRef}
            className="slider overflow-hidden w-100"
            style={{
              width: "100vw",
              whiteSpace: "nowrap",
            }}
          >
            <div
              className="slide-track d-flex align-items-center gap-5 px-5"
              style={{
                width: `${logos.length * 2 * 220}px`,
              }}
            >
              {[...logos, ...logos].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`mitra-${i}`}
                  style={{
                    width: "200px",
                    height: "80px",
                    objectFit: "contain",
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Home;
