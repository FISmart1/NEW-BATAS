import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EditSiswa = () => {
  const { id } = useParams();
  const [siswa, setSiswa] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

 const [projects, setProjects] = useState([]);
const [pengalaman, setPengalaman] = useState([]);

useEffect(() => {
  axios.get(`http://localhost:3006/api/siswa/${id}`)
    .then((res) => {
      setSiswa(res.data.siswa);
      setProjects(res.data.projects);
      setPengalaman(res.data.pengalaman);
    })
    .catch((err) => console.error(err));
}, [id]);




  const handleChange = (e) => {
    setSiswa({ ...siswa, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:3006/api/siswa/update/${id}`, siswa);
      setMessage("✅ Data berhasil diperbarui.");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setMessage("❌ Gagal memperbarui data.");
    }
  };

  if (!siswa) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Profil Data Siswa</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <table className="table table-bordered table-striped">
        <tbody>
          <tr>
            <th>ID</th>
            <td>{siswa.id}</td>
          </tr>
          <tr>
            <th>Nama</th>
            <td>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={siswa.name}
                  onChange={handleChange}
                />
              ) : (
                siswa.name
              )}
            </td>
          </tr>
          <tr>
            <th>Alamat</th>
            <td>
              {isEditing ? (
                <input
                  type="text"
                  name="alamat"
                  className="form-control"
                  value={siswa.alamat || ""}
                  onChange={handleChange}
                />
              ) : (
                siswa.alamat || "-"
              )}
            </td>
          </tr>
          <tr>
            <th>Keahlian</th>
            <td>
              {isEditing ? (
                <input
                  type="text"
                  name="keahlian"
                  className="form-control"
                  value={siswa.keahlian || ""}
                  onChange={handleChange}
                />
              ) : (
                siswa.keahlian || "-"
              )}
            </td>
          </tr>
          <tr>
            <th>Skill</th>
            <td>
              {isEditing ? (
                <input
                  type="text"
                  name="skill"
                  className="form-control"
                  value={siswa.skill || ""}
                  onChange={handleChange}
                />
              ) : (
                siswa.skill || "-"
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {isEditing ? (
        <div className="d-flex gap-2">
          <button className="btn btn-success" onClick={handleSave}>
            Simpan
          </button>
          <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
            Batal
          </button>
        </div>
      ) : (
        <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
          Edit Data
        </button>
      )}
    </div>
  );
};

export default EditSiswa;
