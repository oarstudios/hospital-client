import { useState } from "react";
import { useDispatch } from "react-redux";
import { createAppointment } from "../../../redux/appointments/appointmentsSlice";
import { showToast } from "../../../redux/toast/toastSlice";
import { notifyFirstError, clearField, INDIAN_PHONE } from "../../Common/formFeedback";
import { postToBookingSheet } from "../../Common/bookingSheet";
import "./BookAppointmentCenter.css";

const BookAppointmentCenter = ({ center }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    date: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    clearField(setErrors, e.target.name);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.age || Number(form.age) < 1 || Number(form.age) > 120) {
      nextErrors.age = "Enter a valid age.";
    }
    if (!form.phone) nextErrors.phone = "Phone number is required.";
    else if (!INDIAN_PHONE.test(form.phone)) nextErrors.phone = "Enter a valid 10-digit Indian number.";
    else if (/^(\d)\1{9}$/.test(form.phone)) nextErrors.phone = "Invalid phone number.";
    if (!form.date) nextErrors.date = "Please select an appointment date.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      notifyFirstError(dispatch, nextErrors);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const sheetPayload = {
        patientname: form.name,
        age: form.age,
        phone: form.phone,
        area: center?.area,
        center: center?.name,
        date: form.date,
        source: "Center_Page",
      };

      const savePromise = dispatch(
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

      let sheetOk = false;
      try {
        const sheetResult = await postToBookingSheet(sheetPayload);
        sheetOk = sheetResult?.status === "success";
      } catch {
        sheetOk = false;
      }

      const result = await savePromise;

      if (createAppointment.fulfilled.match(result) || sheetOk) {
        dispatch(showToast.success(`Appointment booked at ${center?.name}.`));
        setForm({ name: "", age: "", phone: "", date: "" });
        setErrors({});
      } else {
        dispatch(showToast.error("Failed to book appointment. Please try again."));
      }
    } catch {
      dispatch(showToast.error("Network error. Please try again."));
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
        <div style={{ flex: 1 }}>
          <input
            className={`ictc-book-input${errors.name ? " input-invalid" : ""}`}
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <p className="ictc-book-error">{errors.name}</p>}
        </div>
        <div style={{ flex: 1 }}>
          <input
            className={`ictc-book-input${errors.age ? " input-invalid" : ""}`}
            type="number"
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
          />
          {errors.age && <p className="ictc-book-error">{errors.age}</p>}
        </div>
      </div>

      <input
        className={`ictc-book-input ictc-book-full${errors.phone ? " input-invalid" : ""}`}
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
      />
      {errors.phone && <p className="ictc-book-error">{errors.phone}</p>}

      <p className="ictc-book-section-title">Appointment Details</p>

      <input
        className={`ictc-book-input ictc-book-full${errors.date ? " input-invalid" : ""}`}
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
      />
      {errors.date && <p className="ictc-book-error">{errors.date}</p>}

      <div className="ictc-book-btn-row">
        <button className="ictc-book-btn" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Booking..." : "Book Appointment"}
        </button>
      </div>
    </section>
  );
};

export default BookAppointmentCenter;
