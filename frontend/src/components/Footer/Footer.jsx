import "./Footer.css";
import logo from "../../assets/ICTC_Logo(long).png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* LOGO */}
        <div className="footer-logo">
          <img src={logo} alt="Indian Cancer Treatment Centre" />
        </div>

        {/* COLUMNS */}
        <div className="footer-columns">
          {/* ABOUT */}
          <div className="footer-col">
            <h4>About Us</h4>
            <ul>
              <li>About ICTC</li>
              <li>Our Team</li>
            </ul>

            <h4 className="mt">Services</h4>
            <ul>
              <li>Chemotherapy</li>
              <li>Immunotherapy</li>
              <li>Cancer Surgery</li>
              <li>Radiation Therapy</li>
              <li>Targeted Therapy</li>
              <li>Bone Marrow Transplant</li>
              <li>CAR-T Cellular Therapy</li>
            </ul>
          </div>

          {/* CENTRES */}
          <div className="footer-col">
            <h4>Centres</h4>
            <ul className="centres-list">
              <li><span className="sp" >Vashi</span> 92345 12345</li>
              <li><span className="sp" >Panvel</span> 92345 12345</li>
              <li><span className="sp" >Kalyan</span> 92345 12345</li>
              <li><span className="sp" >Dombivali</span> 92345 12345</li>
              <li><span className="sp" >Sion</span> 92345 12345</li>
              <li><span className="sp" >Dadar</span> 92345 12345</li>
              <li><span className="sp" >Santacruz</span> 92345 12345</li>
              <li><span className="sp" >Goregaon</span> 92345 12345</li>
              <li><span className="sp" >Ghatkopar</span> 92345 12345</li>
              <li><span className="sp" >Chembur</span> 92345 12345</li>
            </ul>
          </div>

          {/* CANCERS */}
          <div className="footer-col">
            <h4>Cancers We Treat</h4>
            <ul>
              <li>Breast Cancers</li>
              <li>Blood Cancers</li>
            </ul>
          </div>

          {/* USEFUL LINKS */}
          <div className="footer-col">
            <h4>Useful Link</h4>
            <ul>
              <li>ICTC Blogs</li>
              <li>ICTC Newsletter</li>
              <li>Privacy Policy</li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
