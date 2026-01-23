import { useState } from "react";
import "../Home/BookAppointment/BookAppointment.css";
import doctorImg from "../../assets/ICTC female doctor 1.png";
import tickIcon from "../../assets/Vector (8).png";

const centres = [
  "Vashi",
  "Panvel",
  "Kalyan",
  "Dombivli",
  "Sion",
  "Dadar",
  "Ghatkopar",
  "Santacruz",
  "Goregaon",
  "Chembur",
];

/* Centre → slug mapping */
const centreSlugMap = {
  Vashi: "vashi",
  Panvel: "panvel",
  Kalyan: "kalyan",
  Dombivli: "dombivli",
  Sion: "sion",
  Dadar: "dadar",
  Ghatkopar: "ghatkopar",
  Santacruz: "santacruz",
  Goregaon: "goregaon",
  Chembur: "chembur",
};

const BookSecondOp = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    date: "",
    selectedCentre: "",
    type: "Second Opinion",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSameDayNotice, setShowSameDayNotice] = useState(false);

  const selectedCentreSlug =
    centreSlugMap[formData.selectedCentre];

  const centrePageUrl = selectedCentreSlug
    ? `/centre/${selectedCentreSlug}`
    : null;

  /* INPUT CHANGE */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      const selectedDate = new Date(value);
      const today = new Date();

      const isSameDay =
        selectedDate.toDateString() === today.toDateString();

      // ❌ Sunday not allowed
      if (selectedDate.getDay() === 0) {
        setErrors((prev) => ({
          ...prev,
          date:
            "Second opinion consultations are not available on Sundays",
        }));
        return;
      }

      // ℹ️ Same-day info after 12 PM
      if (isSameDay && today.getHours() >= 12) {
        setShowSameDayNotice(true);
      } else {
        setShowSameDayNotice(false);
      }
    }

    setErrors({});
    setFormData({ ...formData, [name]: value });
  };

  /* SINGLE CENTRE SELECT */
  const handleCentreChange = (centre) => {
    setFormData((prev) => ({
      ...prev,
      selectedCentre: centre,
    }));
  };

  /* VALIDATION */
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.age || formData.age < 1 || formData.age > 120)
      newErrors.age = "Enter valid age";

    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Enter valid 10-digit phone number";

    if (!formData.selectedCentre)
      newErrors.centres = "Select one centre";

    if (!formData.date) {
      newErrors.date = "Please select appointment date";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();

      if (selectedDate.getDay() === 0) {
        newErrors.date =
          "Second opinion consultations are not available on Sundays";
      }

      const isSameDay =
        selectedDate.toDateString() === today.toDateString();

      // ❌ Final submit block
      if (isSameDay && today.getHours() >= 12) {
        newErrors.date =
          "Same-day consultation must be booked before 12 PM";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* SUBMIT */
  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    setIsSubmitted(false);

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycby_yIfLs8GlqAlgyqHtjPFcujoIfeiYqHzFNUUJckL4FAb1z-EkbqlBW1FpkVqXFA/exec",
        {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);

        setTimeout(() => {
          setFormData({
            name: "",
            age: "",
            phone: "",
            date: "",
            selectedCentre: "",
            type: formData.type,
          });
          setShowSameDayNotice(false);
          setIsSubmitted(false);
        }, 2500);
      } else {
        alert("Failed to save data");
      }
    } catch {
      alert("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="appointment-wrapper">
      <div className="appointment-card">
        <div className="appointment-form">
          <h2>Book a Second Opinion Consultation</h2>

          <p className="section-label">Patient Details</p>

          <div className="input-row">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
            />
          </div>

          {errors.name && <span className="error">{errors.name}</span>}
          {errors.age && <span className="error">{errors.age}</span>}

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <span className="error">{errors.phone}</span>}

          <p className="section-label">
            Select ICTC Centre and Date of Appointment
          </p>

          <div className="centres-grid">
            {centres.map((centre, index) => (
              <label key={index} className="centre-chip">
                <input
                  type="checkbox"
                  checked={formData.selectedCentre === centre}
                  onChange={() => handleCentreChange(centre)}
                />
                <span className="custom-checkbox">
                  <img src={tickIcon} alt="tick" />
                </span>
                <span className="centre-name">{centre}</span>
              </label>
            ))}
          </div>

          {errors.centres && (
            <span className="error">{errors.centres}</span>
          )}

          <p className="section-label">
            Please Click below to select Date
          </p>

          {/* ✅ DATE + NOTICE + BUTTON STACK */}
          <div className="date-section">
            <input
              type="date"
              name="date"
              className="date-input"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              onKeyDown={(e) => e.preventDefault()}
            />

            {errors.date && <span className="error">{errors.date}</span>}

            {showSameDayNotice && formData.selectedCentre && (
              <div className="info-notice">
                ⏰{" "}
                <strong>
                  Same-day second opinion consultations close at
                  12:00 PM.
                </strong>
                <br />
                You can still check today’s availability at{" "}
                <a href={centrePageUrl} className="centre-link-BA">
                  {formData.selectedCentre} ICTC Centre
                </a>
                .
              </div>
            )}

            <button
              className={`book-btn ${isSubmitting ? "loading" : ""} ${
                isSubmitted ? "success" : ""
              }`}
              onClick={handleSubmit}
              disabled={isSubmitting || isSubmitted}
            >
              {isSubmitting
                ? "Submitting..."
                : isSubmitted
                ? "Submitted ✓"
                : "Request Second Opinion"}
            </button>
          </div>
        </div>

        <div className="appointment-image">
          <img src={doctorImg} alt="Doctor" />
        </div>
      </div>
    </section>
  );
};

export default BookSecondOp;
