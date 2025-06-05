
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.scss';
import { comparePathname } from '@/utils/uri';


type Route = {
  title: string;
  link: string;
  icon: string;
  roles: string[];
  children?: Route[];
};

type SubRoutesState = {
  [key: string]: boolean;
};

const Sidebar: React.FC = () => {
  const [currentPath, setCurrentPath] = useState("");
  const [openSubRoutes, setOpenSubRoutes] = useState<SubRoutesState>({});
  const location = useLocation();

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  const role = localStorage.getItem('role');

  
  let routes: Route[] = [];

  if (role === "ROLE_ADMIN"){
      routes = [
        {title: "THỐNG KÊ", link: "/admin/dashboard", icon: "fa-solid fa-chart-line", roles: ["ROLE_ADMIN"]},
        {title: "DANH SÁCH CHI NHÁNH", link: "/admin/branchlist", icon: "fa-solid fa-building", roles: ["ROLE_ADMIN"]},
        {title: "DANH SÁCH NGUYÊN LIỆU", link: "/admin/materiallist", icon: "fa-solid fa-boxes-stacked", roles: ["ROLE_ADMIN"]},
        {title: "DANH SÁCH SẢN PHẨM", link: "/admin/productlist", icon: "fa-solid fa-box", roles: ["ROLE_ADMIN"]},
        {title: "DANH SÁCH ĐƠN HÀNG", link: "/admin/orderlist", icon: "fa-solid fa-receipt", roles: ["ROLE_ADMIN"]},
        {title: "DANH SÁCH NHÂN VIÊN", link: "/admin/stafflist", icon: "fa-solid fa-users", roles: ["ROLE_ADMIN"]},
        {title: "DANH SÁCH KHÁCH HÀNG", link: "/admin/customerlist", icon: "fa-solid fa-user", roles: ["ROLE_ADMIN"]},
        {title: "DANH SÁCH KHUYẾN MÃI", link: "/admin/promote", icon: "fa-solid fa-ticket", roles: ["ROLE_ADMIN"]},
        {title: "ĐÁNH GIÁ", link: "/admin/rating", icon: "fa-solid fa-star", roles: ["ROLE_ADMIN"]},
      ];
    } else if (role === "ROLE_MANAGER") {
    routes = [
      { title: "Thống kê", link: "/manager/dashboard", icon: "fa-solid fa-chart-line", roles: ["ROLE_MANAGER"] },
      { title: "Nguyên liệu", link: "/manager/materiallist", icon: "fa-solid fa-boxes-stacked", roles: ["ROLE_MANAGER"] },
      { title: "Sản phẩm", link: "/manager/productlist", icon: "fa-solid fa-box", roles: ["ROLE_MANAGER"] },
      { title: "Đơn hàng", link: "/manager/orderlist", icon: "fa-solid fa-receipt", roles: ["ROLE_MANAGER"] },
      { title: "Nhân viên", link: "/manager/stafflist", icon: "fa-solid fa-users", roles: ["ROLE_MANAGER"] },
      { title: "Khách hàng", link: "/manager/customerlist", icon: "fa-solid fa-user", roles: ["ROLE_MANAGER"] },
      { title: "Khuyến mãi", link: "/manager/promote", icon: "fa-solid fa-ticket", roles: ["ROLE_MANAGER"] },
      { title: "Đánh giá", link: "/manager/rating", icon: "fa-solid fa-star", roles: ["ROLE_MANAGER"] },
      { title: "Thông tin quán", link: "/manager/info", icon: "fa-solid fa-building", roles: ["ROLE_MANAGER"] },
    ];
  } else if (role === "ROLE_STAFF") {
      routes = [
        {title: "ĐẶT HÀNG", link: "/staff/order", icon: "fa-solid fa-cart-plus", roles: ["ROLE_STAFF"], 
          children: [
            {title: "Chọn bàn", link: "choose-table", icon: "fa-solid fa-mug-saucer", roles: ["ROLE_STAFF"]},
            {title: "Gọi món", link: "place-order", icon: "fa-solid fa-cart-plus", roles: ["ROLE_STAFF"]},
            {title: "Danh sách đơn hàng", link: "order-list", icon: "fa-solid fa-receipt", roles: ["ROLE_STAFF"]},
        ]},
        {title: "Danh sách khách hàng", link: "/staff/customer-list", icon: "fa-solid fa-users", roles: ["ROLE_STAFF"]},
        {title: "Thông tin nhân viên", link: "/staff/info", icon: "fa-solid fa-user", roles: ["ROLE_STAFF"]},
      ];
    } else if (role === "ROLE_CUSTOMER") {
        routes = [
          { title: "Trang chủ", link: "/", icon: "fa-solid fa-house", roles: ["ROLE_CUSTOMER"] },
          { title: "Giới thiệu", link: "/about-us", icon: "fa-solid fa-circle-info", roles: ["ROLE_CUSTOMER"] },
          { title: "Liên hệ", link: "/contact-us", icon: "fa-solid fa-phone", roles: ["ROLE_CUSTOMER"] },
          { title: "Đặt phòng", link: "/booking", icon: "fa-solid fa-calendar", roles: ["ROLE_CUSTOMER"] },
          { title: "Lịch sử", link: "/history", icon: "fa-solid fa-clock-rotate-left", roles: ["ROLE_CUSTOMER"] },
          { title: "Thông tin cá nhân", link: "/profile-user", icon: "fa-solid fa-user", roles: ["ROLE_CUSTOMER"] },
        ];
      }


  const toggleSubRoutes = (path: string) => {
    setOpenSubRoutes((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

const handleLogout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('isBrand');
  window.location.href = '/login';
};


  const renderNavigationList = () => {
    return routes.map((route, index) => {
      if (!route.roles) return null;
      if (localStorage.getItem("role") && !route.roles.includes(localStorage.getItem("role") || "")) return null;

      const hasChildren = route.children && route.children.length > 0;
      const isActive = comparePathname(route.link ?? "", currentPath);
      const isOpen = openSubRoutes[route.link ?? ""];

      return (
        <li key={index} className={`nav-item ${hasChildren ? "dropdown" : ""}`}>
          <Link
            to={hasChildren ? "#" : route.link ?? "#"}
            className={`nav-link ${isActive ? "nav-link-active" : ""}`}
            onClick={
              hasChildren
                ? (e) => {
                  e.preventDefault();
                  if (route.link) {
                    toggleSubRoutes(route.link);
                  }
                }
                : undefined
            }
          >
            <span className="icon">
              <i className={route.icon}></i>
            </span>
            <span className={`title ${isActive ? "title-active" : ""}`}>
              {route.title}
            </span>
            {hasChildren && (
              <span className={`arrow ${isOpen ? "up" : "down"}`}>
                <i className={`fas fa-chevron-${isOpen ? "up" : "down"}`}></i>
              </span>
            )}
          </Link>
          {hasChildren && isOpen && (
            <ul className="nav-children nav nav-pills">
              {route.children?.map((subRoute, subIndex) => {
                if (!subRoute.roles) return null;
                if (localStorage.getItem("role") && !subRoute.roles.includes(localStorage.getItem("role") || "")) return null;
                return (
                  <li key={subIndex} className="nav-item">
                    <Link
                      to={`${route.link}/${subRoute.link}`}
                      className={`nav-link ${comparePathname(
                        `${route.link}/${subRoute.link}`,
                        currentPath
                      )
                          ? "nav-link-active"
                          : ""
                        }`}
                    >
                      <span className="icon">
                        <i className={subRoute.icon}></i>
                      </span>
                      <span className={`title ${comparePathname(
                        `${route.link}/${subRoute.link}`,
                        currentPath
                      )
                          ? "title-active"
                          : ""
                        }`}>
                        {subRoute.title}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </li>
      );
    });
  };

  return (
    <>
      <div className="d-flex sidebar menulist">
        <ul className="side side-pills">
        <h1 className="logo">
          <svg width="90" height="50" viewBox="0 0 100 61" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_1_4813)">
              <path d="M85.7065 5.92603H22.6784C15.2321 5.92603 9.17236 11.465 9.17236 18.2714V29.9214C9.17236 34.2546 10.8921 38.1928 13.6744 41.2215V79.9984C13.6744 81.0898 14.1487 82.1365 14.993 82.9082C15.8373 83.68 16.9824 84.1135 18.1764 84.1135H54.1924C55.3864 84.1135 56.5315 83.68 57.3758 82.9082C58.2201 82.1365 58.6944 81.0898 58.6944 79.9984V59.4227H76.7025V79.9984C76.7025 81.0898 77.1768 82.1365 78.0211 82.9082C78.8654 83.68 80.0105 84.1135 81.2045 84.1135H90.2085C91.4025 84.1135 92.5476 83.68 93.3919 82.9082C94.2362 82.1365 94.7105 81.0898 94.7105 79.9984V41.2174C97.4927 38.1928 99.2125 34.2546 99.2125 29.9172V18.2714C99.2125 11.465 93.1528 5.92603 85.7065 5.92603ZM90.2085 18.2714V29.9214C90.2085 34.6126 86.3863 38.6125 81.6952 38.8388L81.2045 38.8471C76.2388 38.8471 72.2005 35.1558 72.2005 30.6168V14.1563H85.7065C88.1916 14.1563 90.2085 16.004 90.2085 18.2714ZM45.1884 30.6168V14.1563H63.1964V30.6168C63.1964 35.1558 59.1581 38.8471 54.1924 38.8471C49.2267 38.8471 45.1884 35.1558 45.1884 30.6168ZM18.1764 18.2714C18.1764 16.004 20.1933 14.1563 22.6784 14.1563H36.1844V30.6168C36.1844 35.1558 32.1461 38.8471 27.1804 38.8471L26.6897 38.8347C21.9986 38.6125 18.1764 34.6126 18.1764 29.9214V18.2714ZM45.1884 63.5379H27.1804V51.1925H45.1884V63.5379Z" fill="url(#paint0_linear_1_4813)" />
              <path d="M85.7065 5.92603H22.6784C15.2321 5.92603 9.17236 11.465 9.17236 18.2714V29.9214C9.17236 34.2546 10.8921 38.1928 13.6744 41.2215V79.9984C13.6744 81.0898 14.1487 82.1365 14.993 82.9082C15.8373 83.68 16.9824 84.1135 18.1764 84.1135H54.1924C55.3864 84.1135 56.5315 83.68 57.3758 82.9082C58.2201 82.1365 58.6944 81.0898 58.6944 79.9984V59.4227H76.7025V79.9984C76.7025 81.0898 77.1768 82.1365 78.0211 82.9082C78.8654 83.68 80.0105 84.1135 81.2045 84.1135H90.2085C91.4025 84.1135 92.5476 83.68 93.3919 82.9082C94.2362 82.1365 94.7105 81.0898 94.7105 79.9984V41.2174C97.4927 38.1928 99.2125 34.2546 99.2125 29.9172V18.2714C99.2125 11.465 93.1528 5.92603 85.7065 5.92603ZM90.2085 18.2714V29.9214C90.2085 34.6126 86.3863 38.6125 81.6952 38.8388L81.2045 38.8471C76.2388 38.8471 72.2005 35.1558 72.2005 30.6168V14.1563H85.7065C88.1916 14.1563 90.2085 16.004 90.2085 18.2714ZM45.1884 30.6168V14.1563H63.1964V30.6168C63.1964 35.1558 59.1581 38.8471 54.1924 38.8471C49.2267 38.8471 45.1884 35.1558 45.1884 30.6168ZM18.1764 18.2714C18.1764 16.004 20.1933 14.1563 22.6784 14.1563H36.1844V30.6168C36.1844 35.1558 32.1461 38.8471 27.1804 38.8471L26.6897 38.8347C21.9986 38.6125 18.1764 34.6126 18.1764 29.9214V18.2714ZM45.1884 63.5379H27.1804V51.1925H45.1884V63.5379Z" fill="url(#paint0_linear_1_4813)" />
            </g>
            <defs>
              <linearGradient id="paint0_linear_1_4813" x1="54.1924" y1="5.92603" x2="54.1924" y2="84.1135" gradientUnits="userSpaceOnUse">
                <stop stop-color="#557C8D" />
                <stop offset="1" stop-color="#2F4156" />
              </linearGradient>
              <clipPath id="clip0_1_4813">
                <rect width="98.6741" height="60" fill="white" transform="translate(0.538574 0.82251)" />
              </clipPath>
            </defs>
          </svg>
        </h1>
        {renderNavigationList()}
        <button className="logout-box" onClick={handleLogout}>
          <i className="fa-solid fa-sign-out"></i>
          LOG OUT
        </button>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
