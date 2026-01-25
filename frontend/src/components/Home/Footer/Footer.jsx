import "./Footer.css";
import logo from "../../../assets/ICTC_Logo(long).png";
import { Link } from "react-router-dom";

/* DATA */
import centerData from "../../../data/centerData";
import serviceData from "../../../data/serviceData";
import cancerData from "../../../data/cancerData";

/* ICONS */
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";

const Footer = () => {
  /* 🔹 DYNAMIC SERVICES */
  const services = Object.entries(serviceData).map(([slug, service]) => ({
    slug,
    label: service.name,
  }));

  /* 🔹 DYNAMIC CANCERS */
  const cancers = Object.entries(cancerData).map(([slug, cancer]) => ({
    slug,
    label: cancer.Name || cancer.name,
  }));

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* LOGO */}
        <div className="footer-logo">
          <Link to="/">
            <img src={logo} alt="Indian Cancer Treatment Centre" />
          </Link>

          {/* SOCIAL MEDIA */}
          <div className="footer-social">
            <a
              href="https://www.instagram.com/ictcfightscancer/"
              target="_blank"
              rel="noreferrer"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com/ictcfightscancer"
              target="_blank"
              rel="noreferrer"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.linkedin.com/company/ictcfightscancer/"
              target="_blank"
              rel="noreferrer"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://www.youtube.com/@ictcfightscancer"
              target="_blank"
              rel="noreferrer"
            >
              <FaYoutube />
            </a>
            <a
              href="https://x.com/ictcfightcancer"
              target="_blank"
              rel="noreferrer"
            >
              <FaXTwitter />
            </a>
          </div>
        </div>

        {/* COLUMNS */}
        <div className="footer-columns">
          {/* ABOUT + SERVICES */}
          <div className="footer-col">
            <h4>About Us</h4>
            <ul>
              <li>
                <Link to="/aboutUs">About ICTC</Link>
              </li>
              <li>
                <Link to="/ourDoctors">Our Team</Link>
              </li>
            </ul>

            <h4 className="mt">Services</h4>
            <ul>
              {services.map((item) => (
                <li key={item.slug}>
                  <Link to={`/service/${item.slug}`}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CENTRES */}
          <div className="footer-col">
            <h4>Centres</h4>
            <ul className="centres-list-footer">
              {Object.values(centerData).map((centre) => (
                <li key={centre.slug}>
                  <Link to={`/centre/${centre.slug}`}>
                    <span className="sp">{centre.name}</span>
                  </Link>
                  {centre.phone}
                </li>
              ))}
            </ul>
          </div>

          {/* CANCERS */}
          <div className="footer-col">
            <h4>Cancers We Treat</h4>
            <ul>
              {cancers.map((item) => (
                <li key={item.slug}>
                  <Link to={`/cancer/${item.slug}`}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* USEFUL LINKS */}
          <div className="footer-col">
            <h4>Useful Link</h4>
            <ul>
              <li>
                <Link to="/blog">ICTC Blogs</Link>
              </li>
              <li>ICTC Newsletter</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
