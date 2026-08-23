import { Link } from "react-router-dom";
import "./MobileQuickCTA.css";

const MobileQuickCTA = ({ attached = false, floating = false }) => {
  const className = [
    "mobile-quick-cta",
    attached ? "mobile-quick-cta--attached" : "",
    floating ? "mobile-quick-cta--floating" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <nav className={className} aria-label="Quick actions">
      <Link to="/allCenters" className="mobile-quick-cta__btn mobile-quick-cta__btn--locate">
        Locate Centre
      </Link>
      <Link to="/BookAppoinment" className="mobile-quick-cta__btn mobile-quick-cta__btn--book">
        Book an
        <br />
        Appointment
      </Link>
      <Link
        to="/BookSecondOpinion"
        className="mobile-quick-cta__btn mobile-quick-cta__btn--opinion"
      >
        Get Second
        <br />
        Opinion
      </Link>
    </nav>
  );
};

export default MobileQuickCTA;
