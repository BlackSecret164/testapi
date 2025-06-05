import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Navbar,
  Offcanvas,
  Nav,
  NavDropdown,
} from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import "./Header.scss";
import { useSystemContext } from "@/hooks/useSystemContext";
import { MainApiRequest } from "@/services/MainApiRequest";

const Header = () => {

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const context = useSystemContext();  // Get context for token or login state
  const { token } = context;  // You can use token or isLoggedIn from context
  const [userInfo, setUserInfo] = useState<any>(null);

  const toggleMenu = () => {
    setOpen(!open);
  };

  useEffect(() => {
    window.addEventListener("scroll", isSticky);
    return () => {
      window.removeEventListener("scroll", isSticky);
    };
  }, []);

  const isSticky = (e: any) => {
    const header = document.querySelector('.header-section');
    if (!header) return;
    const scrollTop = window.scrollY;
    scrollTop >= 120 ? header.classList.add('is-sticky') : header.classList.remove('is-sticky');
  };

  const closeMenu = () => {
    if (window.innerWidth <= 991) {
      setOpen(false);
    }
  };

  const handleLogout = () => {
    // Clear token or any session-related info
    context.setToken("");  // Reset token in context
    localStorage.removeItem("token");  // Remove token from localStorage
    navigate("/");  // Redirect to home page or login page
  };

  useEffect(() => {
    if (token) {
      fetchUserInfo();
    }
  }, [token]);

  const fetchUserInfo = async () => {
    try {
      const res = await MainApiRequest.get("/auth/callback", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserInfo(res.data.data); // Giả định API trả về thông tin người dùng
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      context.setToken(""); // Xóa token nếu không hợp lệ
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (

    <header className="header-section is-sticky">
      <Container>
        <Navbar expand="lg" className=" p-0 mt-2 justify-content-between w-100">
          {/* Logo Section  */}
          <Navbar.Brand className="logo d-flex">
            <NavLink to="/"> Café w Fen</NavLink>
          </Navbar.Brand>
          {/* End Logo Section  */}

          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-lg`}
            aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
            placement="start"
            show={open}
          >
            {/*mobile Logo Section  */}
            <Offcanvas.Header>
              <h1 className="logo space-x-2">Café w Fen</h1>
              <span className="navbar-toggler ms-auto" onClick={toggleMenu}>
                <i className="iconClose bi bi-x-lg"></i>
              </span>
            </Offcanvas.Header>
            {/*end mobile Logo Section  */}

            <Offcanvas.Body>
              <div className="d-flex align-items-center gap-3 space-x-8">
                <Nav className="d-non d-lg-flex gap-3">
                  <NavLink className="nav-link" to="/" onClick={closeMenu}>
                    Home
                  </NavLink>
                  <NavLink className="nav-link" to="/about-us" onClick={closeMenu}>
                    ABOUT US
                  </NavLink>
                  <NavLink className="nav-link" to="/rooms" onClick={closeMenu}>
                    MENU
                  </NavLink>
                  <NavLink className="nav-link" to="/contact-us" onClick={closeMenu}>
                    CONTACT
                  </NavLink>
                </Nav>
              </div>
            </Offcanvas.Body>
          </Navbar.Offcanvas>

          {/* Conditionally render Login or LogOut button */}
          <div className="ms-md-4 ms-2 mt-2 mt-lg-0 flex-row d-flex">
            <Nav>
              {userInfo ? (
                <>
                  <NavDropdown
                    title={userInfo?.name || "Perry Ặc Ặc"}
                    className="primaryBtn align-items-center"
                    id="collasible-nav-dropdown"
                  >
                    <NavDropdown.Item onClick={() => navigate("/profile-user")}>
                      My Profile
                    </NavDropdown.Item>

                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={() => navigate("/history")}>
                      mY Orders
                    </NavDropdown.Item>

                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <NavLink
                  //className="primaryBtn d-none d-sm-inline-block" 
                  className="primaryBtn align-items-center"
                  to="/login"
                >
                  Login
                </NavLink>
              )}
            </Nav>
            <li className="d-inline-block d-lg-none toggle_btn pt-1">
              <i className={open ? "bi bi-x-lg" : "bi bi-list"} onClick={toggleMenu}></i>
            </li>
          </div>
        </Navbar>

      </Container>
    </header>
  );
};

export default Header;
