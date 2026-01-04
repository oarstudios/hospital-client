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

const BookSecondOp = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    date: "",
    selectedCentres: [],
  });

  const [errors, setErrors] = useState({});

  /* INPUT CHANGE */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /* CHECKBOX */
  const handleCentreChange = (centre) => {
    setFormData((prev) => {
      const exists = prev.selectedCentres.includes(centre);
      return {
        ...prev,
        selectedCentres: exists
          ? prev.selectedCentres.filter((c) => c !== centre)
          : [...prev.selectedCentres, centre],
      };
    });
  };

  /* VALIDATION */
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.age || formData.age < 1 || formData.age > 120)
      newErrors.age = "Enter valid age";

    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Enter valid 10-digit phone number";

    if (formData.selectedCentres.length === 0)
      newErrors.centres = "Select at least one centre";

    if (!formData.date) newErrors.date = "Please select appointment date";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* SUBMIT */
  const handleSubmit = () => {
    if (!validate()) return;

    console.log("Second Opinion Data:", formData);
    alert("Second opinion request submitted successfully!");
  };

  return (
    <section className="appointment-wrapper">
      <div className="appointment-card">
        {/* LEFT FORM */}
        <div className="appointment-form">
          <h2>Book a Second Opinion Consultation</h2>
        
          <p className="section-label">Patient Details</p>

          <div className="input-row">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div>
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
              />
              {errors.age && <span className="error">{errors.age}</span>}
            </div>
          </div>

          <div>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          <p className="section-label">
            Select ICTC Centre and Date of Appointment
          </p>

          <div className="centres-grid">
            {centres.map((centre, index) => (
              <label key={index} className="centre-chip">
                <input
                  type="checkbox"
                  checked={formData.selectedCentres.includes(centre)}
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

          <div>
             <p className="section-label">Please Click below to select Date</p>
            <input
              type="date"
              name="date"
              className="date-input"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
            />
            {errors.date && <span className="error">{errors.date}</span>}
          </div>

          <button className="book-btn" onClick={handleSubmit}>
            Request Second Opinion
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="appointment-image">
          <img src={doctorImg} alt="Doctor" />
        </div>
      </div>
    </section>
  );
};

export default BookSecondOp;
