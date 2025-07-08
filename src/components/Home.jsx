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
      const nonPelajarData = data.filter((s) => s.posisi !== "Pelajar");

      setNonPelajar(nonPelajarData);
      setAllSiswa(data);

      const keahlianSet = new Set(data.map((s) => s.keahlian).filter(Boolean));
      setKeahlianList([...keahlianSet]);
      const asalSet = new Set(data.map((s) => s.alamat).filter(Boolean));
      setAsalList([...asalSet]);
      const allSkills = data.flatMap((s) =>
        s.skill ? s.skill.split(",").map((sk) => sk.trim()) : []
      );
      setSkillList([...new Set(allSkills)]);
      setFilteredSiswa(data);
    });

    axios
      .get("http://localhost:3006/api/projects")
      .then((res) => setProjects(res.data));
  }, []);

  useEffect(() => {
    let result = [...allSiswa];
    result = result.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selectedKeahlian !== "") {
      result = result.filter((s) => s.keahlian === selectedKeahlian);
    }
    if (selectedAsal !== "") {
      result = result.filter((s) => s.alamat === selectedAsal);
    }
    if (selectedSkill !== "") {
      result = result.filter((s) =>
        s.skill?.toLowerCase().includes(selectedSkill.toLowerCase())
      );
    }
    setFilteredSiswa(result);
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

            <h1 className="display-4 fw-bold">BaTas</h1>

            {/* Subheadline */}
            <p className="fst-italic text-light">
              Temukan talenta terbaik dari SMK TI Bazma dan lihat karya nyata mereka.
            </p>

            <p className="text-justify">
              BaTas adalah platform untuk menampilkan portofolio siswa SMK.
              Siswa dapat membagikan proyek mereka secara online dan masyarakat
              bisa mengakses informasi tersebut dengan mudah.
            </p>

            {/* Badge Keahlian */}
            <div className="d-flex flex-wrap gap-2 mt-3">
              <span className="badge bg-light text-dark">Web Developer</span>
              <span className="badge bg-light text-dark">UI/UX Design</span>
              <span className="badge bg-light text-dark">Networking</span>
            </div>

            {/* Divider */}
            <div
              style={{
                width: "60px",
                height: "5px",
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                marginTop: "1.5rem",
                marginBottom: "1rem",
              }}
            ></div>

            {/* Tombol CTA */}
            <a
              href="cari-siswa"
              className="btn text-black"
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
      <motion.div
        className="container-fluid py-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="row container mx-auto w-75 p-3 gap-5">
          <div className="col-12 col-md-5 mb-4 text-center  align-items-center ">
            <img
              src={bareng}
              alt="Buka Porto"
              className="img-fluid rounded-4"
              style={{ width: "100%", height: "300px", objectFit: "cover" }}
            />
          </div>
          <div className="col-12 col-md-6 text-justify d-flex flex-column justify-content-center align-items-start  ">
            <h1 className="mb-4">SMK TI Bazma</h1>
            <p>
              SMK TI BAZMA menyelenggarakan program pembelajaran yang ditempuh
              selama 4 tahun dengan siswa-siswa terbaik yang berasal dari
              berbagai daerah di seluruh Indonesia. SMK TI Bazma
              menyelenggarakan pendidikan dengan jurusan SIJA (Sistem
              Informatika, Jaringan & Aplikasi) dengan kombinasi kurikulum
              berbasis asrama.
            </p>
          </div>
        </div>
      </motion.div>
      {/* Non Pelajar */}
      <motion.div
        className="container-fluid mb-5 p-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        style={{ backgroundColor: "#12294A" }}
      >
        <h2 className="text-center fw-bold display-6 mb-3 text-white">
          🌟 Siswa Berposisi Khusus
        </h2>
        <p className="text-center mb-5 text-white fs-5">
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
                          animation: "rainbowShadow 5s infinite ease-in-out",
                        }}
                      />
                    </div>
                    {/* Informasi */}
                    <div className="col-md-6 text-white text-justify text-md-start px-3 px-md-5">
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
                        className="btn-custom mt-3 d-inline-block"
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
      <motion.div
        id="cari-siswa"
        className="container my-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="text-center my-5">
          <h2 style={{ color: "#12294A" }}>Cari Siswa</h2>
          <p className="text-muted">
            Telusuri dan temukan siswa terbaik berdasarkan daerah asal,
            keahlian, atau skill mereka.
          </p>
        </div>
        <div className="text-center mb-3">
          <button
            className="btn-custom-nooutline fw-semibold"
            onClick={() => setShowFilter((prev) => !prev)}
          >
            {showFilter ? "Sembunyikan Filter" : "Tampilkan Filter"}
          </button>
        </div>

        {showFilter && (
          <div className="mb-3 d-flex flex-column flex-md-row align-items-center gap-3 justify-content-center">
            <select
              className="form-select"
              style={{ maxWidth: "200px" }}
              value={selectedKeahlian}
              onChange={(e) => setSelectedKeahlian(e.target.value)}
            >
              <option value="">Tutup Keahlian</option>
              {keahlianList.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              className="form-select"
              style={{ maxWidth: "200px" }}
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
            >
              <option value="">Tutup Skill</option>
              {skillList.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              className="form-select"
              style={{ maxWidth: "200px" }}
              value={selectedAsal}
              onChange={(e) => setSelectedAsal(e.target.value)}
            >
              <option value="">Tutup Asal</option>
              {AsalList.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="row mt-4">
          {selectedKeahlian || selectedSkill || selectedAsal ? (
            filteredSiswa.length > 0 ? (
              filteredSiswa.map((s) => (
                <div className="col-6 col-md-4 mb-4" key={s.id}>
                  <motion.div
                    className="position-relative overflow-hidden rounded-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    style={{
                      height: "450px",
                      cursor: "crosshair",
                      boxShadow: "0 4px 15px rgb(33, 33, 90)",
                    }}
                  >
                    <img
                      src={`${imageBaseUrl}${s.foto}`}
                      className="w-100 h-100"
                      style={{
                        objectFit: "cover",
                        filter: "brightness(70%)",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 1,
                      }}
                      alt={s.name}
                    />
                    <div
                      className="position-relative text-white d-flex flex-column justify-content-end p-4"
                      style={{ height: "100%", zIndex: 2 }}
                    >
                      <div>
                        <h5 className="fw-bold mb-1">{s.name}</h5>
                        <div className="d-flex justify-content-between small text-white">
                          <span>{s.keahlian}</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <button
                          className="btn btn-light w-100 fw-semibold"
                          onClick={() => {
                            navigate(`/siswa/${s.id}`);
                          }}
                        >
                          Lihat Siswa
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted">
                Tidak ada siswa ditemukan.
              </p>
            )
          ) : (
            <div>
              <p className="text-center text-muted">Mau cari siswa berbakat?</p>
              <p className="text-center text-muted">
                🔍Gunakan filter di atas untuk mulai menelusuri data siswa.
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
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged.
              </p>
              <ul>
                <li>SISMAKO</li>
                <p>Sistem Manajemen Sekolah</p>
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
                    style={{ height: "360px", objectFit: "cover", width: "100%" }}
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
