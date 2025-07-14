//import useContext

//import react router dom
import { Routes, Route } from "react-router-dom";

//import view home
import Home from "../components/Home";
import SiswaByAngkatan from "../components/Siswa";
import SiswaDetail from "../components/SiswaDetail";

import Admin from "../components/admin/AdminDashboard";
import AddSiswa from "../components/admin/AddSiswa";
import AddPengalaman from "../components/admin/AddPengalaman";
import AddProject from "../components/admin/AddProject";
import Loading from "../components/loading";


import EditSiswa from "../components/EditSiswa";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";
export default function AppRoutes() {
  const { user } = useAuth(); // gunakan context

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Loading />} />
      <Route path="/home" element={<Home />} />
      <Route path="/angkatan" element={<SiswaByAngkatan />} />
      <Route path="/siswa/:id" element={<SiswaDetail />} />


      <Route
        path="/edit-siswa/:id"
        element={
          <ProtectedRoute role="siswa">
            <EditSiswa />
          </ProtectedRoute>
        }
      />
      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-siswa"
        element={
          <ProtectedRoute role="admin">
            <AddSiswa />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-pengalaman"
        element={
          <ProtectedRoute role="admin">
            <AddPengalaman />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-project"
        element={
          <ProtectedRoute role="admin">
            <AddProject />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}
