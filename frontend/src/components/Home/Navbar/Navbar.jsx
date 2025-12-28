import { useState } from "react";
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
  const navigate = useNavigate();

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  /* 🔹 CENTRES ARRAY FROM DATA */
  const centres = Object.values(centerData);

  return (
    <>
      {/* TOP BAR */}
      <div className="top-bar">
        <span>Mail Us at: info@ictconco.org</span>
        <span>
          ICTC Helpline: <span className="diffColor">885 885 5200</span>
        </span>
      </div>

      {/* NAVBAR */}
      <div className="navbar-wrapper">
        <nav className="navbar">
          {/* LOGO */}
          <div
            className="logo"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            <img src={logo} alt="ICTC Logo" />
          </div>

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
            <li onClick={() => navigate("/blog")}>BLOGS</li>
            <li onClick={() => navigate("/aboutUs")}>ABOUT US</li>
          </ul>

          <button
            className="appointment-btn"
            onClick={() => navigate("/BookAppoinment")}
          >
            Book an Appointment
          </button>
        </nav>

        {/* SERVICES DROPDOWN */}
        {activeMenu === "services" && (
          <MegaDropdown heading="SERVICES">
            <div className="column">
              {serviceMenu.slice(0, 4).map((item) => (
                <p
                  key={item.slug}
                  onClick={() => {
                    navigate(`/service/${item.slug}`);
                    setActiveMenu(null);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {item.label}
                </p>
              ))}
            </div>

            <div className="column">
              {serviceMenu.slice(4).map((item) => (
                <p
                  key={item.slug}
                  onClick={() => {
                    navigate(`/service/${item.slug}`);
                    setActiveMenu(null);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {item.label}
                </p>
              ))}
            </div>
          </MegaDropdown>
        )}

        {/* CENTRES DROPDOWN (DYNAMIC) */}
        {activeMenu === "centres" && (
          <MegaDropdown heading="OUR CENTRES">
            <div className="column">
              {centres.slice(0, 4).map((center) => (
                <p
                  key={center.slug}
                  onClick={() => {
                    navigate(`/centre/${center.slug}`);
                    setActiveMenu(null);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {center.name}
                </p>
              ))}
            </div>

            <div className="column">
              {centres.slice(4, 8).map((center) => (
                <p
                  key={center.slug}
                  onClick={() => {
                    navigate(`/centre/${center.slug}`);
                    setActiveMenu(null);
                  }}
                  style={{ cursor: "pointer" }}
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
                  onClick={() => {
                    navigate(`/cancer/${item.slug}`);
                    setActiveMenu(null);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {item.label}
                </p>
              ))}
            </div>

            <div className="column">
              {cancerMenu.slice(4).map((item) => (
                <p
                  key={item.slug}
                  onClick={() => {
                    navigate(`/cancer/${item.slug}`);
                    setActiveMenu(null);
                  }}
                  style={{ cursor: "pointer" }}
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
  <div className="mega-dropdown">
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
