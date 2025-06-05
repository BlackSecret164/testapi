import "@/App.scss";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import PageNotFound from "@/layouts/PageNotFound";

// Pages
import Register from "@/pages/customer/Register/Register";
import Home from "@/pages/customer/Home/Home";
import About from "@/pages/customer/About/About";
import Contact from "@/pages/customer/Contact/Contact";
import Booking from "@/pages/customer/Booking/Booking";
import HistoryBooking from "@/pages/customer/HistoryBooking/HistoryBooking";
import Payment from "@/pages/customer/Payment/Payment";

import TableOrder from "@/pages/brands/staff/TableOrder/TableOrder";
import Statistic from "@/pages/brands/Statistic/Statistic";


import { Rating } from "@mui/material";
import AdminStaffList from "@/pages/admin/AdminStaffList/AdminStaffList";
import AdminCustomerList from "@/pages/admin/AdminCustomerList/AdminCustomerList";
import AdminPromotion from "@/pages/admin/AdminPromotion/AdminPromotion";
import AdminOrderList from "@/pages/admin/AdminOrderList/AdminOrderList";
import AdminProductList from "@/pages/admin/AdminProduct/AdminProduct";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import AdminBranchList from "@/pages/admin/AdminBranchList/AdminBranchList";
import ManagerMaterialList from "@/pages/brands/ManagerMaterialList/ManagerMaterialList";
import ManagerStaffList from "@/pages/brands/ManagerStaffList/ManagerStaffList";
import ManagerOrderList from "@/pages/brands/ManagerOrderList/ManagerOrderList";
import ManagerCustomerList from "@/pages/brands/ManagerCustomerList/ManagerCustomerList";
import ManagerProductList from "@/pages/brands/ManagerProduct/ManagerProduct";
import ManagerPromotion from "@/pages/brands/ManagerPromotion/ManagerPromotion";
import AdminLogin from "@/pages/AdminLogin/AdminLogin";
import Layout from "@/layouts/Layout/Layout";
import AdminMaterialList from "@/pages/admin/AdminMaterialList/AdminMaterialList";

export default function MainRoutes() {
  const location = useLocation();
  const isAuthPage = ["/register", "/admin-login"].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith("/admin");
  const isManagerPage = location.pathname.startsWith("/manager");

  return (
    <>
      {/* Hiện Header/Footer ở các trang public */}
      {!isAuthPage && !isAdminPage && !isManagerPage && <Header />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="about-us" element={<About />} />
        <Route path="contact-us" element={<Contact />} />
        {/* <Route path="login" element={<Login />} /> */}
        <Route path="register" element={<Register />} />

        {/* Redirect from /admin to /admin/dashboard */}
        <Route path="admin-login" element={<AdminLogin />} />

        {/* Admin System routes */}
        <Route path="/admin" element={<Layout/>}>
          <Route path="dashboard" element={<Statistic />} />
          <Route path="branchlist" element={<AdminBranchList />} />
          <Route path="orderlist" element={<AdminOrderList />} />
          <Route path="stafflist" element={<AdminStaffList />} />
          <Route path="customerlist" element={<AdminCustomerList />} />
          <Route path="promote" element={<AdminPromotion />} />
          <Route path="materiallist" element={<AdminMaterialList />} />
          <Route path="productlist" element={<AdminProductList />} />
          <Route path="rating" element={<Rating />} />
        </Route>

        {/* Admin Branch routes */}
        <Route path="/manager" element={<Layout />}>
          {/* <Route path="dashboard" element={<Statistic />} /> */}
          <Route path="materiallist" element={<ManagerMaterialList />} />
          <Route path="productlist" element={<ManagerProductList />} />
          <Route path="orderlist" element={<ManagerOrderList />} />
          <Route path="stafflist" element={<ManagerStaffList />} />
          <Route path="customerlist" element={<ManagerCustomerList />} />
          <Route path="promote" element={<ManagerPromotion />} />
          <Route path="rating" element={<Rating />} />
        </Route>

        {/* Staff Brand routes */}
        <Route path="staff/order/choose-table" element={<TableOrder />} />


        {/* Customer routes */}
        <Route path="booking" element={<Booking />} />
        <Route path="history" element={<HistoryBooking />} />
        <Route path="payment" element={<Payment />} />


        <Route path="*" element={<PageNotFound />} />
      </Routes>

      {!isAuthPage && !isAdminPage &&!isManagerPage && <Footer />}
    </>
  );
}
