import React from "react";
import { Outlet } from "react-router-dom";
import "./Layout.scss";
import Navbar from "../Sidebar/Sidebar";

const Layout = () => {
  return (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
