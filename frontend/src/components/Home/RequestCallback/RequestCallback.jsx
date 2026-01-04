import { useState } from "react";
import "./RequestCallback.css";
import doctorImg from "../../../assets/High res images 1.png";
import phoneIcon from "../../../assets/fluent_call-16-filled.png";

const RequestCallback = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setError("");
    alert("Callback request submitted successfully");
  };

  return (
    <section className="callback-wrapper">
      {/* LEFT CARD */}
      <div className="callback-card">
        <div className="callback-form">
          <h2>Request a Call Back</h2>

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {error && <p className="error-text">{error}</p>}

          <button onClick={handleSubmit}>Submit Details</button>
        </div>

        {/* DOCTOR IMAGE */}
        <div className="callback-image">
          <img src={doctorImg} alt="Doctor" />
        </div>
      </div>

      {/* RIGHT SUPPORT CARD */}
      <div className="support-card">
        <h3>Need Support? <br /> We're Here:</h3>

        <p className="support-label">ICTC Helpline:</p>

        <div className="support-phone">
          <img src={phoneIcon} alt="phone" />
          <span>885 885 5200</span>
        </div>
      </div>
    </section>
  );
};

export default RequestCallback;
