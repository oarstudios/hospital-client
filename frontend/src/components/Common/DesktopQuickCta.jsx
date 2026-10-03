import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DesktopQuickCta.css";

const ACTIONS = [
  { key: "locate", label: "Locate Centre", to: "/allCenters" },
  { key: "book", label: "Book an Appointment", to: "/BookAppoinment" },
  { key: "opinion", label: "Get Second Opinion", to: "/BookSecondOpinion" },
];

/**
 * Floating CTA bar pinned to the bottom of the viewport on tablet/desktop
 * (phones use MobileQuickCTA). `hideLocate` drops the "Locate Centre" button,
 * e.g. on a centre's own landing page.
 */
const DesktopQuickCta = ({ hideLocate = false }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  if (!open) return null;

  const actions = hideLocate ? ACTIONS.filter((a) => a.key !== "locate") : ACTIONS;

  return (
    <div className="desktop-quick-cta">
      <div className="desktop-quick-cta__track">
        {actions.map((a) => (
          <button
            key={a.key}
            type="button"
            className={`desktop-quick-cta__btn desktop-quick-cta__btn--${a.key}`}
            onClick={() => navigate(a.to)}
          >
            {a.label}
            <span aria-hidden="true">→</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="desktop-quick-cta__close"
        aria-label="Close"
        onClick={() => setOpen(false)}
      >
        ✕
      </button>
    </div>
  );
};

export default DesktopQuickCta;
