import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./CookieConsent.css";

const STORAGE_KEY = "ictc-cookie-consent";
const OFFSET_VAR = "--cookie-banner-offset";
const VISIBLE_CLASS = "cookie-banner-visible";

function clearCookieOffset() {
  document.documentElement.style.setProperty(OFFSET_VAR, "0px");
  document.documentElement.classList.remove(VISIBLE_CLASS);
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const bannerRef = useRef(null);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) {
      clearCookieOffset();
      return;
    }

    const el = bannerRef.current;
    if (!el) return;

    const update = () => {
      const height = Math.ceil(el.getBoundingClientRect().height);
      document.documentElement.style.setProperty(OFFSET_VAR, `${height + 12}px`);
      document.documentElement.classList.add(VISIBLE_CLASS);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      clearCookieOffset();
    };
  }, [visible]);

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
    <div
      ref={bannerRef}
      className="ictc-cookie-banner"
      role="dialog"
      aria-label="Cookie consent"
    >
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
    </div>
  );
}
