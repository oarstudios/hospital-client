import { useState } from "react";
import { useDispatch } from "react-redux";
import { createAppointment } from "../../../redux/appointments/appointmentsSlice";
import "./BookAppointmentCenter.css";

const BookAppointmentCenter = ({ center }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    date: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.age || !form.phone || !form.date) {
      alert("Please fill all details");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      alert("Enter valid 10-digit phone number");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await dispatch(
        createAppointment({
          patientName: form.name,
          age: Number(form.age),
          phone: form.phone,
          area: center?.area,
          center: center?.name,
          centerId: center?.id,
          appointmentDate: form.date,
          source: "Center_Page",
        })
      );

      if (createAppointment.fulfilled.match(result)) {
        alert(`Appointment booked at ${center?.name}`);
        setForm({ name: "", age: "", phone: "", date: "" });
      } else {
        alert("Failed to book appointment. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!center) return null;

  return (
    <section className="ictc-book-wrapper">
      <h2 className="ictc-book-heading">
        Book an Appointment at {center.name}
      </h2>

      <p className="ictc-book-section-title">Patient Details</p>

      <div className="ictc-book-row">
        <input
          className="ictc-book-input"
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          className="ictc-book-input"
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
        />
      </div>

      <input
        className="ictc-book-input ictc-book-full"
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
      />

      <p className="ictc-book-section-title">Appointment Details</p>

      <input
        className="ictc-book-input ictc-book-full"
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
      />

      <div className="ictc-book-btn-row">
        <button className="ictc-book-btn" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Booking..." : "Book Appointment"}
        </button>
      </div>
    </section>
  );
};

export default BookAppointmentCenter;