import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CookieConsent.css";

const STORAGE_KEY = "ictc-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(STORAGE_KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <dialog className="ictc-cookie-banner" open aria-label="Cookie consent">
      <p>
        We use cookies to improve your experience and measure site traffic with
        Google Analytics. See our{" "}
        <Link to="/privacy-policy#cookies">Cookie Policy</Link> for details.
      </p>
      <div className="ictc-cookie-actions">
        <button type="button" className="ictc-cookie-reject" onClick={reject}>
          Reject
        </button>
        <button type="button" className="ictc-cookie-accept" onClick={accept}>
          Accept
        </button>
      </div>
    </dialog>
  );
}
