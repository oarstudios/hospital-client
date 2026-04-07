import "./ThankYouPopup.css";
import tickIcon from "../assets/Vector (8).png";

const ThankYouPopup = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="thankyou-overlay">
      <div className="thankyou-modal">

        {/* CLOSE */}
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        {/* ICON */}
        <div className="thankyou-icon">
          <div className="icon-bg">
            <img src={tickIcon} alt="success" className="tick-animate" />
          </div>
        </div>

        {/* TEXT */}
        <h3>Thank You!</h3>

        <p className="thankyou-text">
          We’ve received your <strong>appointment request.</strong>
          <br />
          Our team will reach out to you shortly with the details.
        </p>

        {/* BUTTON */}
        <button
          className="home-btn"
          onClick={() => (window.location.href = "/")}
        >
          Back to Homepage →
        </button>

        <p className="help-text">
          Need help? Please contact our{" "}
          <a href="tel:8858855200" className="link">customer care</a>.
        </p>
      </div>
    </div>
  );
};

export default ThankYouPopup;