import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { fadeInUp } from "./utils/animations";

import kong from "../assets/kong.png";
import firman from "../assets/firman.png";
import azan from "../assets/azan.png";
import ibrahim from "../assets/ibrahim.png";
import faray from "../assets/faray.png";
import rehan from "../assets/rehan.png";
import sahrul from "../assets/sahrul.png";
import mado from "../assets/mado.png";
import pertalife from "../assets/pertalife.png";
import yakes from "../assets/logo-yakes.png";
import ptn from "../assets/ptn.png";
import hulurokan from "../assets/hulu-rokan.png";
import bareng from "../assets/bareng.png";
import sekolah from "../assets/sekolah.png";
import sas from "../assets/sas.png";
import absensi from "../assets/absensi.png";
import orang from "../assets/orang.png";

function Home() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const truncateText = (text, maxLength = 120) =>
    text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  const greetings = [
    "Welcome To",
    "Selamat Datang",
    "ようこそ",
    "환영합니다",
    "Bienvenue",
  ];

  const [text, setText] = useState("");
  const [greetIndex, setGreetIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const [projects, setProjects] = useState([]);
  const [nonPelajar, setNonPelajar] = useState([]);
  const [allSiswa, setAllSiswa] = useState([]);
  const [filteredSiswa, setFilteredSiswa] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showFilter, setShowFilter] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [skillList, setSkillList] = useState([]);
  const [keahlianList, setKeahlianList] = useState([]);
  const [AsalList, setAsalList] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedKeahlian, setSelectedKeahlian] = useState("");
  const [selectedAsal, setSelectedAsal] = useState("");

  const nonPelajarScrollRef = useRef(null);
  const mitraRef = useRef(null);
  const imageBaseUrl = "http://localhost:3006/uploads/";
  const logos = [pertalife, yakes, ptn, hulurokan];

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

  useEffect(() => {
    axios.get("http://localhost:3006/api/getsiswa").then((res) => {
      const data = res.data;

      // 🔍 Filter hanya siswa yang status-nya 'alumni'
      const alumniOnly = data.filter((s) => s.status === "alumni");

      // 🔍 Filter siswa non-pelajar (untuk slider/tampilan khusus)
      const nonPelajarData = alumniOnly.filter((s) => s.posisi !== "Pelajar");
      setNonPelajar(nonPelajarData);

      // 🔍 Simpan semua alumni ke allSiswa (untuk keperluan filter selanjutnya)
      setAllSiswa(alumniOnly);
      setFilteredSiswa(alumniOnly); // tampilkan awal semua alumni

      // 🔍 Buat daftar unik keahlian, asal, skill dari alumniOnly
      const keahlianSet = new Set(
        alumniOnly.map((s) => s.keahlian).filter(Boolean)
      );
      const asalSet = new Set(alumniOnly.map((s) => s.alamat).filter(Boolean));
      const allSkills = alumniOnly.flatMap((s) =>
        s.skill ? s.skill.split(",").map((sk) => sk.trim()) : []
      );

      setKeahlianList([...keahlianSet]);
      setAsalList([...asalSet]);
      setSkillList([...new Set(allSkills)]);
    });

    axios
      .get("http://localhost:3006/api/projects")
      .then((res) => setProjects(res.data));
  }, []);

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

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };
  const [direction, setDirection] = useState(0); // -1 untuk kiri, 1 untuk kanan
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

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
        if (delta > 0) scrollRight();
        else scrollLeft();
      }
    };

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
      {/* Hero */}
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
            {/* TEKS */}
            <div className="col-12 col-md-6 text-white mb-4 mb-md-0 text-center text-md-start">
              <h3 className="fw-semibold" style={{ minHeight: "2.5rem" }}>
                {text}
                <span className="blinking-cursor">|</span>
              </h3>

              <h1 className="display-4 fw-bold">BEST</h1>

              {/* Subheadline */}
              <p className="fst-italic text-light">
                Temukan talenta terbaik dari SMK TI Bazma dan lihat karya nyata
                mereka.
              </p>

              <p className="text-justify">
                BEST adalah platform untuk menampilkan portofolio siswa SMK.
                Siswa dapat membagikan proyek mereka secara online dan
                masyarakat bisa mengakses informasi tersebut dengan mudah.
              </p>

              {/* Badge Keahlian */}
              <div className="d-flex flex-wrap gap-2 mt-3">
                <span className="badge bg-light text-dark">Web Developer</span>
                <span className="badge bg-light text-dark">UI/UX Design</span>
                <span className="badge bg-light text-dark">Networking</span>
              </div>

              {/* Tombol CTA */}
              <a
                href="cari-siswa"
                className="btn text-black mt-4"
                style={{ backgroundColor: "white" }}
              >
                Lihat Siswa
              </a>
            </div>

            {/* GAMBAR */}
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
      {/* Tentang */}
      {/* Non Pelajar */}
      <motion.div
        className="container-fluid p-4  mt-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}

      >
        <h2 className="text-center fw-bold display-6 mb-3 text-black">
          🌟 Siswa Berposisi Khusus
        </h2>
        <p className="text-center mb-4 text-black fs-5">
          Alumni yang telah bekerja di berbagai perusahaan ternama
        </p>

        <div className="d-flex align-items-center justify-content-center container">
          {/* Tombol kiri */}
          {/* Tombol kiri */}
          <button
            className="btn btn-outline-light rounded-circle shadow d-none d-md-block"
            style={{
              backgroundColor: "#12294A",
              width: "50px",
              height: "50px",
            }}
            onClick={scrollLeft}
          >
            ←
          </button>

          {/* Kontainer scroll */}
          <div
            ref={nonPelajarScrollRef}
            className="d-flex align-items-center justify-content-center px-4 mb-3"
            style={{
              maxWidth: "90%",
              overflowX: "hidden", // tetap hidden
              touchAction: "pan-y", // biar vertical scroll tetap bisa
            }}
          >
            {nonPelajar.length > 0 && (
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={currentIndex} // supaya Framer tahu ini konten baru
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="row w-100 align-items-center flex-column flex-md-row"
                >
                  {/* ROW RESPONSIF */}
                  <div className="row w-100 align-items-center flex-column flex-md-row">
                    {/* Gambar */}
                    <div className="col-12 col-md-6 text-center p-3">
                      <img
                        src={`${imageBaseUrl}${nonPelajar[currentIndex].foto}`}
                        className="img-fluid rounded-4"
                        alt={nonPelajar[currentIndex].name}
                        style={{
                          height: "320px",
                          objectFit: "cover",
                          width: "100%",
                          boxShadow: "0 0 12px 0px #12294A",
                        }}
                      />
                    </div>
                    {/* Informasi */}
                    <div className="col-md-6 text-black text-justify text-md-start px-3 px-md-5 py-3 align-self-start">
                      <h3 className="fw-bold">
                        {nonPelajar[currentIndex].name}
                      </h3>
                      <p className="ml-3">
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

          {/* Tombol kanan */}
          {/* Tombol kanan */}
          <button
            className="btn btn-outline-light rounded-circle shadow d-none d-md-block"
            style={{
              backgroundColor: "#12294A",
              width: "50px",
              height: "50px",
            }}
            onClick={scrollRight}
          >
            →
          </button>
        </div>
      </motion.div>
      {/* Cari semua siswa */}
      ...
      <motion.div
        id="cari-siswa"
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
                <h5 className="fw-bold mb-1 text-white">{filteredSiswa.length}+ Alumni</h5>
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
                <h5 className="fw-bold mb-1 text-white">{skillList.length}+ Skill</h5>
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
                <h5 className="fw-bold mb-1 text-white">{AsalList.length}+ Asal daerah</h5>
                <p className="text-white small">Asal daerah talenta kita</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Cari semua siswa */}
      <motion.div
        id="cari-siswa"
        className="container my-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="container-fluid my-5">
          <h2 style={{ color: "#12294A", textAlign: "center" }}>
            Temukan Talenta Terbaik
          </h2>
          <p className="text-muted text-center">
            Jelajahi profil siswa berbakat dari SMK TI Bazma dan temukan
            kolaborator terbaik untuk proyek Anda.
          </p>
        </div>

        {/* Filter Siswa */}
        {/* Filter Siswa */}
        <div className="container mb-5">
          <div className="bg-white shadow-sm rounded-4 px-3 px-md-5 py-4 mb-4 d-flex flex-column flex-lg-row align-items-stretch justify-content-between gap-3">
            {/* Input Pencarian Nama/Keahlian */}
            <input
              type="text"
              className="form-control rounded-3 px-4"
              style={{ flex: 1, minWidth: "340px" }}
              placeholder="🔍 Cari nama atau keahlian..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Select Keahlian */}
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

            {/* Select Skill */}
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

            {/* Select Asal/Daerah */}
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
              <div className="col-12 col-md-6 col-lg-4 mb-4" key={s.id}>
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={`${imageBaseUrl}${s.foto}`}
                        alt={s.name}
                        className="rounded-circle me-3"
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <h5 className="mb-0">{s.name}</h5>
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
                      className=" mb-3"
                      style={{
                        fontSize: "0.9rem",
                        backgroundColor: "#12294A",
                        color: "white",
                        padding: "5px",
                        borderRadius: "5px",
                        width: "fit-content",
                      }}
                    >
                      <strong>{s.keahlian}</strong>
                    </p>

                    <p className="mb-1">
                      <i className="bi bi-building me-1"></i>
                      {s.instansi || "-"}, {s.posisi || "-"}
                    </p>
                    <p className="small mb-3">
                      <i className="bi bi-lightning-fill me-1"></i>
                      {s.skill || "-"}
                    </p>

                    <div className="mt-auto">
                      <button
                        className="btn w-100"
                        style={{ backgroundColor: "#12294A", color: "white" }}
                        onClick={() => navigate(`/siswa/${s.id}`)}
                      >
                        Lihat Profile
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
      {/* Project */}
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
              <h1 className="jua-regular">Project Siswa</h1>
              <p>
                Di balik setiap proyek, ada semangat belajar, kerja keras, dan
                inovasi. Proyek-proyek ini adalah bukti bahwa siswa SMK TIBAZMA
                mampu menciptakan teknologi yang bermanfaat dan siap bersaing di
                dunia industri maupun masyarakat.
              </p>
              <ul>
                <li>SISMAKO (Sistem Managament Sekolah)</li>

                <li>Webite Sekolah</li>

                <li>Sistem Absensi</li>
              </ul>
            </div>
            <div className="col-md-7 ml-5">
              <div className="d-flex flex-wrap justify-content-center gap-3">
                {/* Project 1 */}
                <motion.div
                  className="card border-0 rounded p-0"
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
                  />
                  <div className="p-3 bg-white">
                    <h5 className="text-dark">Absensi</h5>
                  </div>
                </motion.div>

                {/* Project 2 */}
                <motion.div
                  className="card border-0 rounded p-0"
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
                    className=""
                    style={{
                      height: "360px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />
                  <div className="p-3 bg-white">
                    <h5 className="text-dark">Sismako</h5>
                  </div>
                </motion.div>

                {/* Project 3 - di tengah bawah */}
                <motion.div
                  className="card border-0 rounded p-0 mt-4"
                  style={{
                    width: "600px",
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
                    src={sekolah} // Ganti jika ada gambar lain untuk project ke-3
                    className="w-100"
                    style={{ height: "220px", objectFit: "cover" }}
                  />
                  <div className="p-3 bg-white">
                    <h5 className="text-dark">Website Sekolah</h5>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Mitra */}
      <motion.div
        className="my-5 py-5 container"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h1 className="text-center mb-4">Mitra Kami</h1>

        {/* BAGIAN SCROLL: TARO DI LUAR CONTAINER */}
        <div className="px-2">
          <div
            ref={mitraRef}
            className="slider overflow-hidden w-100"
            style={{
              width: "100vw", // benar-benar sepanjang layar
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
      {/* Modal */}
      {selectedProject && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 bg-white">
              <div className="modal-header">
                <h5>{selectedProject.name_project}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <img
                  src={`${imageBaseUrl}${selectedProject.foto}`}
                  className="img-fluid mb-3"
                  alt={selectedProject.name_project}
                />
                <p>{selectedProject.deskripsi}</p>
              </div>
              <div className="modal-footer">
                <Link
                  to={`/project/${selectedProject.link_web}`}
                  className="btn btn-primary"
                >
                  Lihat Project
                </Link>
                <button
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
