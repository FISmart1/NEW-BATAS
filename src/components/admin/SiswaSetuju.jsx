import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminApproveUpdateSiswa() {
  const [pendingUpdates, setPendingUpdates] = useState([]);

  useEffect(() => {
    fetchPendingUpdates();
  }, []);

  const fetchPendingUpdates = async () => {
    try {
      const res = await axios.get("http://localhost:3006/api/getsiswa_pending");
      setPendingUpdates(res.data.filter((siswa) => siswa.status === 0));
    } catch (err) {
      console.error("Gagal mengambil data pending siswa:", err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:3006/api/approve_siswa/${id}`);
      alert("Data siswa berhasil disetujui dan diperbarui.");
      fetchPendingUpdates();
    } catch (err) {
      console.error("Gagal menyetujui data:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus pengalaman ini?")) {
      try {
        await axios.delete(`http://localhost:3006/api/delsiswa-pending/${id}`);
        alert("🗑️ Siswa berhasil dihapus.");
        fetchPendingUpdates();
      } catch (err) {
        console.error(err);
        alert("❌ Gagal menghapus pengalaman.");
      }
    }
  };

  return (
    <div className="container my-5">
      <h2>Persetujuan Perubahan Data Siswa</h2>
      {pendingUpdates.length === 0 ? (
        <p>Tidak ada data siswa yang menunggu persetujuan.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered mt-3">
            <thead className="table-dark">
              <tr>
                <th>Nama</th>
                <th>Angkatan</th>
                <th>Alamat</th>
                <th>Keahlian</th>
                <th>Skill</th>
                <th>Instansi</th>
                <th>Posisi</th>
                <th>Setuju</th>
                <th>Hapus</th>
              </tr>
            </thead>
            <tbody>
              {pendingUpdates.map((siswa) => (
                <tr key={siswa.id}>
                  <td>{siswa.name}</td>
                  <td>{siswa.angkatan}</td>
                  <td>{siswa.alamat}</td>
                  <td>{siswa.keahlian}</td>
                  <td>{siswa.skill}</td>
                  <td>{siswa.instansi}</td>
                  <td>{siswa.posisi}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleApprove(siswa.id)}
                    >
                      Setujui
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(siswa.id)}
                      className="btn btn-outline-danger w-100"
                    >
                      <i className="bi bi-trash3 me-1"></i> Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminApproveUpdateSiswa;
