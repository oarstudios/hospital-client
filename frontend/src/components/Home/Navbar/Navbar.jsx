import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "./Navbar.css";
import logo from "../../../assets/ICTC_Logo.png";
import arrow from "../../../assets/dropDownIcon.png";

/* 🔹 DATA */
import centerData from "../../../data/centerData";

/* CANCERS */
const cancerMenu = [
  { label: "Breast Cancer", slug: "breast-cancer" },
  { label: "Lung Cancer", slug: "lung-cancer" },
  { label: "Blood Cancer", slug: "blood-cancer" },
  { label: "Brain Cancer", slug: "brain-cancer" },
  { label: "Gastrointestinal Cancer", slug: "gastrointestinal-cancer" },
  { label: "Gynecological Cancer", slug: "gynecological-cancer" },
  { label: "Urological Cancer", slug: "urological-cancer" },
  { label: "Bone & Soft Tissue Cancer", slug: "bone-soft-tissue-cancer" },
];

/* SERVICES */
const serviceMenu = [
  { label: "Chemotherapy", slug: "chemotherapy" },
  { label: "Immunotherapy", slug: "immunotherapy" },
  { label: "Cancer Surgery", slug: "cancer-surgery" },
  { label: "Radiation Therapy", slug: "radiation-therapy" },
  { label: "Targeted Therapy", slug: "targeted-therapy" },
  { label: "Bone Marrow Transplant", slug: "bone-marrow-transplant" },
  { label: "CAR–T Cellular Therapy", slug: "car-t-therapy" },
];

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sticky, setSticky] = useState(false);

  const navigate = useNavigate();
  const navRef = useRef(null);

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  /* ✅ SINGLE PLACE NAVIGATION HANDLER */
  const handleNavigate = (path) => {
    navigate(path);
    setActiveMenu(null);
    setMobileOpen(false);
  };

  /* 🔹 CENTRES ARRAY FROM DATA */
  const centres = Object.values(centerData);

  /* 🔹 STICKY NAVBAR */
  useEffect(() => {
    const onScroll = () => {
      setSticky(window.scrollY > 80);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* 🔹 OUTSIDE CLICK CLOSE */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {(activeMenu || mobileOpen) && <div className="nav-overlay"></div>}

      {/* TOP BAR */}
      <div className="top-bar">
        <span>Mail Us at: info@ictconco.org</span>
        <span>
          ICTC Helpline: <span className="diffColor">885 885 5200</span>
        </span>
      </div>

      {/* NAVBAR */}
      <div
        className={`navbar-wrapper ${sticky ? "sticky" : ""}`}
        ref={navRef}
      >
        <nav className="navbar">
          {/* LOGO */}
          <div
            className="logo"
            onClick={() => handleNavigate("/")}
            style={{ cursor: "pointer" }}
          >
            <img src={logo} alt="ICTC Logo" />
          </div>

          {/* DESKTOP MENU */}
          <ul className="menu">
            <li onClick={() => toggleMenu("services")}>
              SERVICES <img src={arrow} />
            </li>
            <li onClick={() => toggleMenu("centres")}>
              OUR CENTRE <img src={arrow} />
            </li>
            <li onClick={() => toggleMenu("cancer")}>
              CANCER TYPES <img src={arrow} />
            </li>
            <li onClick={() => handleNavigate("/ourDoctors")}>
              DOCTORS
            </li>
            <li onClick={() => handleNavigate("/blog")}>BLOGS</li>
            <li onClick={() => handleNavigate("/aboutUs")}>ABOUT US</li>
          </ul>

          {/* DESKTOP BUTTON */}
          <button
            className="appointment-btn"
            onClick={() => handleNavigate("/BookAppoinment")}
          >
            Book an Appointment
          </button>

          {/* HAMBURGER */}
          <div
            className="hamburger"
            onClick={() => {
              setMobileOpen(!mobileOpen);
              setActiveMenu(null);
            }}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </nav>

        {/* MOBILE MENU */}
        <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
          <ul>
            <li onClick={() => handleNavigate("/")}>Home</li>
            <li onClick={() => toggleMenu("services")}>Services</li>
            <li onClick={() => toggleMenu("centres")}>Our Centre</li>
            <li onClick={() => toggleMenu("cancer")}>Cancer Types</li>
              <li onClick={() => handleNavigate("/ourDoctors")}>
              Doctors
            </li>
            <li onClick={() => handleNavigate("/blog")}>Blogs</li>
            <li onClick={() => handleNavigate("/aboutUs")}>About Us</li>

            <button
              className="appointment-btn mobile-btn"
              onClick={() => handleNavigate("/BookAppoinment")}
            >
              Book an Appointment
            </button>
          </ul>
        </div>

        {/* SERVICES DROPDOWN */}
        {activeMenu === "services" && (
          <MegaDropdown heading="SERVICES">
            <div className="column">
              {serviceMenu.slice(0, 4).map((item) => (
                <p
                  key={item.slug}
                  onClick={() => handleNavigate(`/service/${item.slug}`)}
                >
                  {item.label}
                </p>
              ))}
            </div>

            <div className="column">
              {serviceMenu.slice(4).map((item) => (
                <p
                  key={item.slug}
                  onClick={() => handleNavigate(`/service/${item.slug}`)}
                >
                  {item.label}
                </p>
              ))}
            </div>
          </MegaDropdown>
        )}

        {/* CENTRES DROPDOWN */}
        {activeMenu === "centres" && (
          <MegaDropdown heading="OUR CENTRES">
            <div className="column">
              {centres.slice(0, 4).map((center) => (
                <p
                  key={center.slug}
                  onClick={() => handleNavigate(`/centre/${center.slug}`)}
                >
                  {center.name}
                </p>
              ))}
            </div>

            <div className="column">
              {centres.slice(4, 8).map((center) => (
                <p
                  key={center.slug}
                  onClick={() => handleNavigate(`/centre/${center.slug}`)}
                >
                  {center.name}
                </p>
              ))}
            </div>
          </MegaDropdown>
        )}

        {/* CANCER DROPDOWN */}
        {activeMenu === "cancer" && (
          <MegaDropdown heading="CANCER TYPES">
            <div className="column">
              {cancerMenu.slice(0, 4).map((item) => (
                <p
                  key={item.slug}
                  onClick={() => handleNavigate(`/cancer/${item.slug}`)}
                >
                  {item.label}
                </p>
              ))}
            </div>

            <div className="column">
              {cancerMenu.slice(4).map((item) => (
                <p
                  key={item.slug}
                  onClick={() => handleNavigate(`/cancer/${item.slug}`)}
                >
                  {item.label}
                </p>
              ))}
            </div>
          </MegaDropdown>
        )}
      </div>
    </>
  );
};

/* MEGA DROPDOWN */
const MegaDropdown = ({ heading, children }) => (
  <div className="mega-dropdown slide-down">
    <div className="dropdown-grid">
      <div className="dropdown-left">
        <div className="dropdown-heading">{heading}</div>
        <div className="dropdown-content">{children}</div>
      </div>

      <QuickLinks />
    </div>
  </div>
);

/* QUICK LINKS */
const QuickLinks = () => (
  <div className="quick-links">
    <h4>Quick Links</h4>

    <div className="helpline-box">
      <span>ICTC Helpline</span>
      <strong>+91 885 885 5200</strong>
    </div>

    <button className="quick-btn purple">Book an Appointment</button>
    <button className="quick-btn dark">
      Our Centres <span>→</span>
    </button>
  </div>
);

export default Navbar;
