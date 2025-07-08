//import useContext


//import react router dom
import { Routes, Route } from "react-router-dom";

//import view home
import Home from "../components/Home";
import SiswaByAngkatan from "../components/Siswa";
import SiswaDetail from "../components/SiswaDetail";

import Admin from "../components/admin/AdminDashboard"
import AddSiswa from "../components/admin/AddSiswa";
import AddPengalaman from "../components/admin/AddPengalaman";
import AddProject from "../components/admin/AddProject";
import Loading from "../components/loading";
import Team from "../components/Team";
import FormProject from "../components/FormProject"
import Pending from "../components/admin/ProjectPending"
import Form from "../components/SeluruhForm"
import FormSiswa from "../components/SiswaPending"
import SiswaPending from "../components/admin/SiswaSetuju"
import FormPengalaman from "../components/FormPengalaman";
import PengalamanPending from "../components/admin/PengalamanPending";
import EditSiswa from "../components/EditSiswa";
export default function AppRoutes() {

    //destructure context "isAuthenticated"


    return (
        <Routes>
            {/* route "/" */}
            <Route path="/" element={<Loading />} />
            <Route path="/home" element={<Home />} />
            <Route path="/angkatan" element={<SiswaByAngkatan />} />
            <Route path="/siswa/:id" element={<SiswaDetail />} />
            <Route path="/team" element={<Team />} />
            <Route path="/form" element={<Form/>}/>
            <Route path="/formproject" element={<FormProject />} />
            <Route path="/formsiswa" element={<FormSiswa />} />
            <Route path="/formpengalaman" element={<FormPengalaman />} />
            <Route path="/edit-siswa/:id" element={<EditSiswa />} />

            {/* Admin Routes */}

            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/add-siswa" element={<AddSiswa />} />
            <Route path="/admin/add-pengalaman" element={<AddPengalaman />} />

            <Route path="/admin/add-project" element={<AddProject />} />
            <Route path="/admin/project-pending" element={<Pending />}/>
            <Route path="/admin/siswa-pending" element={<SiswaPending />}/>
            <Route path="/admin/pengalaman-pending" element={<PengalamanPending />}/>


            {/* Tambahkan route lainnya sesuai kebutuhan */}

        </Routes>
        
    );
}