import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function SiswaByAngkatan() {
  const { angkatan } = useParams();
  const navigate = useNavigate();
  const [siswa, setSiswa] = useState([]);
  const [filteredSiswa, setFilteredSiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [keahlianList, setKeahlianList] = useState([]);
  const [selectedKeahlian, setSelectedKeahlian] = useState("");
  const [skillList, setSkillList] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [showFilter, setShowFilter] = useState(true);
  const [selectedAngkatan, setSelectedAngkatan] = useState(angkatan || "all");

  const [daerahList, setDaerahList] = useState([]);
  const [posisiList, setPosisiList] = useState([]);
  const [instansiList, setInstansiList] = useState([]);
  const [selectedPosisi, setSelectedPosisi] = useState("");
  const [selectedInstansi, setSelectedInstansi] = useState("");
  const [selectedDaerah, setSelectedDaerah] = useState("");

  const baseImageUrl = "http://localhost:3006/uploads/";
  const angkatanList = Array.from({ length: 5 }, (_, i) => i + 1);

  const cardRefs = useRef([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3006/api/getsiswa")
      .then((res) => {
        const sorted = res.data.sort((a, b) => {
          if (a.angkatan !== b.angkatan) return a.angkatan - b.angkatan;
          return a.name.localeCompare(b.name, "id", { sensitivity: "base" });
        });
        setSiswa(sorted);
        setFilteredSiswa(sorted);
        setKeahlianList([
          ...new Set(sorted.map((s) => s.keahlian).filter(Boolean)),
        ]);
        setDaerahList([
          ...new Set(sorted.map((s) => s.alamat).filter(Boolean)),
        ]);
        setPosisiList([
          ...new Set(sorted.map((s) => s.posisi).filter(Boolean)),
        ]);
        setInstansiList([
          ...new Set(sorted.map((s) => s.instansi).filter(Boolean)),
        ]);
        const allSkills = sorted.flatMap((s) =>
          s.skill ? s.skill.split(",").map((sk) => sk.trim()) : []
        );
        setSkillList([...new Set(allSkills)]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data siswa:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = [...siswa];
    result = result.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedAngkatan !== "all" && selectedAngkatan !== "") {
      result = result.filter(
        (s) => String(s.angkatan) === String(selectedAngkatan)
      );
    }

    if (selectedKeahlian !== "") {
      result = result.filter((s) => s.keahlian === selectedKeahlian);
    }
    if (selectedSkill !== "") {
      result = result.filter((s) =>
        s.skill?.toLowerCase().includes(selectedSkill.toLowerCase())
      );
    }
    if (selectedDaerah !== "") {
      result = result.filter((s) =>
        s.alamat?.toLowerCase().includes(selectedDaerah.toLowerCase())
      );
    }
    if (selectedPosisi !== "") {
      result = result.filter((s) =>
        s.posisi?.toLowerCase().includes(selectedPosisi.toLowerCase())
      );
    }
    if (selectedInstansi !== "") {
      result = result.filter((s) =>
        s.instansi?.toLowerCase().includes(selectedInstansi.toLowerCase())
      );
    }

    setFilteredSiswa(result);
  }, [
    searchTerm,
    selectedKeahlian,
    selectedSkill,
    selectedDaerah,
    selectedAngkatan,
    selectedPosisi,
    selectedInstansi,
    siswa,
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.1 }
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      cardRefs.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, [filteredSiswa]);

  return (
    <div className="container my-5 pt-5">
      <div
        className="text-center p-5 text-white rounded-4 mb-4"
        style={{ backgroundColor: "#12294A" }}
      >
        <h1 className="display-5 fw-bold">Temukan Portofolio Siswa</h1>
        <p className="lead">
          Filter berdasarkan keahlian, angkatan, instansi, dan lebih banyak
          lagi.
        </p>
      </div>

      <div className="container pt-2 mb-3">
        <div className="d-flex justify-content-center align-items-center gap-2">
          <input
            type="text"
            className="form-control mb-3 text-center"
            style={{ maxWidth: "800px" }}
            placeholder="Cari berdasarkan nama siswa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="mb-3">
            <button
              className="btn"
              style={{ border: "1px solid #12294A" }}
              onClick={() => setShowFilter(!showFilter)}
            >
              {showFilter ? "Sembunyikan Filter" : "Tampilkan Filter"}
            </button>
          </div>
        </div>
        <p className="text-center text-muted">
          Ditemukan <strong>{filteredSiswa.length}</strong> siswa
        </p>
      </div>

      <div className={`filter-container ${showFilter ? "show" : ""} mb-4`}>
        <div className="bg-light p-3 rounded shadow-sm">
          <h5 className="fw-bold mb-3">Filter</h5>
          <div className="row">
            {[
              {
                label: "Angkatan",
                value: selectedAngkatan,
                list: angkatanList,
                onChange: setSelectedAngkatan,
                display: (v) => `Angkatan ${v}`,
              },
              {
                label: "Keahlian",
                value: selectedKeahlian,
                list: keahlianList,
                onChange: setSelectedKeahlian,
              },
              {
                label: "Skill",
                value: selectedSkill,
                list: skillList,
                onChange: setSelectedSkill,
              },
              {
                label: "Asal Daerah",
                value: selectedDaerah,
                list: daerahList,
                onChange: setSelectedDaerah,
              },
              {
                label: "Posisi",
                value: selectedPosisi,
                list: posisiList,
                onChange: setSelectedPosisi,
              },
              {
                label: "Instansi",
                value: selectedInstansi,
                list: instansiList,
                onChange: setSelectedInstansi,
              },
            ].map((filter, i) => (
              <div className="col-md-4 mb-3" key={i}>
                <label className="form-label fw-semibold">{filter.label}</label>
                <select
                  className="form-select"
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                >
                  <option value="">{`Semua ${filter.label}`}</option>
                  {filter.list.map((item, idx) => (
                    <option key={idx} value={item}>
                      {filter.display ? filter.display(item) : item}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : filteredSiswa.length > 0 ? (
            <div className="row">
              {filteredSiswa.map((s, index) => (
                <div
                  key={s.id}
                  className="col-6 col-md-4 mb-4 fade-in"
                  ref={(el) => (cardRefs.current[index] = el)}
                >
                  <div
                    className="position-relative overflow-hidden rounded-4"
                    style={{
                      height: "450px",
                      cursor: "crosshair",
                      animation: "rainbowShadow 5s infinite ease-in-out",
                    }}
                  >
                    <img
                      src={`${baseImageUrl}${s.foto}`}
                      alt={s.name}
                      className="w-100 h-100"
                      style={{
                        objectFit: "cover",
                        filter: "brightness(70%)",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 1,
                      }}
                    />
                    <div
                      className="position-relative text-white d-flex flex-column justify-content-end p-4"
                      style={{ height: "100%", zIndex: 2 }}
                    >
                      <div>
                        <h5 className="fw-bold mb-1">{s.name}</h5>
                        <div className="d-flex justify-content-between small text-white">
                          <span>{s.keahlian}</span>
                          <span>{s.sekolah || "SMK TI BAZMA"}</span>
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
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted text-center mt-4">
              Tidak ada siswa ditemukan.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SiswaByAngkatan;
