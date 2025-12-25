import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Navbar.css";
import logo from "../../../assets/ICTC_Logo.png";
import arrow from "../../../assets/dropDownIcon.png";

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  const navigate = useNavigate(); // ✅ ADD THIS

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <>
      {/* ================= TOP BAR ================= */}
      <div className="top-bar">
        <span>Mail Us at: info@ictconco.org</span>
        <span>
          ICTC Helpline: <span className="diffColor">885 885 5200</span>
        </span>
      </div>

      {/* ================= NAVBAR ================= */}
      <div className="navbar-wrapper">
        <nav className="navbar">
          <div className="logo">
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
            <li onClick={() => navigate("/doctor")}>
  BLOGS
</li>
            <li>ABOUT US</li>
          </ul>

          <button className="appointment-btn">Book an Appointment</button>
        </nav>

        {/* ================= DROPDOWNS ================= */}
        {activeMenu === "services" && (
          <MegaDropdown heading="SERVICES">
            <div className="column">
              <p>Chemotherapy</p>
              <p>Immunotherapy</p>
              <p>Radiation Therapy</p>
              <p>Cancer Surgery</p>
            </div>

            <div className="column">
              <p>Targeted Therapy</p>
              <p>Bone Marrow Transplant</p>
              <p>CAR-T Cellular Therapy</p>
            </div>

            <div className="column">
              <p>Scalp Cooling</p>
              <p>BM Testing – Aspiration & Biopsy</p>
              <p>Palliative Care</p>
              <p>Hormonal Therapies</p>
            </div>

            <div className="column">
              <p>Chemotherapy Port Insertion & Handling</p>
              <p>Oral Metronomic Chemotherapy</p>
            </div>
          </MegaDropdown>
        )}

        {activeMenu === "centres" && (
          <MegaDropdown heading="OUR CENTRES">
            <div className="column">
              <p>Vashi</p>
              <p>Panvel</p>
              <p>Kalyan</p>
              <p>Dombivli</p>
            </div>

            <div className="column">
              <p>Sion</p>
              <p>Dadar</p>
              <p>Ghatkopar</p>
              <p>Goregaon</p>
            </div>

            <div className="column">
              <p>Santacruz</p>
              <p>Chembur</p>
            </div>
          </MegaDropdown>
        )}

        {activeMenu === "cancer" && (
          <MegaDropdown heading="CANCER TYPES">
            <div className="column">
              <p>Breast Cancer</p>
              <p>Lung Cancer</p>
              <p>Blood Cancer</p>
              <p>Head & Neck Cancer</p>
            </div>

            <div className="column">
              <p>Gastrointestinal Cancer</p>
              <p>Gynecological Cancer</p>
              <p>Prostate Cancer</p>
            </div>
          </MegaDropdown>
        )}
      </div>
    </>
  );
};

/* ================= MEGA DROPDOWN COMPONENT ================= */
const MegaDropdown = ({ heading, children }) => (
  <div className="mega-dropdown">
    <div className="dropdown-grid">
      {/* LEFT SIDE */}
      <div className="dropdown-left">
        <div className="dropdown-heading">{heading}</div>
        <div className="dropdown-content">{children}</div>
      </div>

      {/* RIGHT SIDE */}
      <QuickLinks />
    </div>
  </div>
);

/* ================= QUICK LINKS ================= */
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
