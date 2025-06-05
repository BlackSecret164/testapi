import Sidebar from "@/layouts/Sidebar/Sidebar";
import Navbar from "@/layouts/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const AdminPage = () => {
  return (
    <div className="layout">
      <div className="navbar">
        <Sidebar />
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;
