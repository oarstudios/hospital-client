import { useEffect, useRef, useState } from "react";
import "./PatientTestimonials.css";

import quoteIcon from "../../../assets/quote.png";
import googleIcon from "../../../assets/flat-color-icons_google (1).png";
import locationIcon from "../../../assets/weui_location-filled.png";

const testimonials = [
  {
    name: "Ganeshprasad Gawand",
    text:
      "My wife is a breast cancer patient. She has been coming to Dr. Salil Patkar at ICTC vashi for almost 4 years. She is completely cured. We are quite happy with the treatment.",
    location: "ICTC Vashi",
  },
  {
    name: "Ganeshprasad Gawand",
    text:
      "Excellent care and treatment. Doctors and staff are very supportive throughout the journey.",
    location: "ICTC Kalyan",
  },
  {
    name: "Ganeshprasad Gawand",
    text:
      "Excellent care and treatment. Doctors and staff are very supportive throughout the journey.",
    location: "ICTC Kalyan",
  },
  {
    name: "Ganeshprasad Gawand",
    text:
      "Excellent care and treatment. Doctors and staff are very supportive throughout the journey.",
    location: "ICTC Kalyan",
  },
];

const AUTO_SLIDE_INTERVAL = 5000;

const PatientTestimonials = () => {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  const goNext = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };



  /* 🔁 Auto slide */
  useEffect(() => {
    const timer = setInterval(goNext, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  /* 🎯 Move slider */
  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${index * 100}%)`;
    }
  }, [index]);

  return (
    <section className="pt-wrapper">
      {/* LEFT STATIC */}
      <div className="pt-left">
  <img src={quoteIcon} alt="quote" />
</div>

      {/* RIGHT SLIDER */}
      <div className="pt-right">
        <div className="pt-track" ref={trackRef}>
          {testimonials.map((item, i) => (
            <div className="pt-slide" key={i}>
              <div className="pt-card-wrapper">
  <div className="pt-card">
    <p className="pt-text">{item.text}</p>
    <p className="pt-name">{item.name}</p>
  </div>

  {/* BADGES ON BORDER */}
  <div className="pt-badges">
    <div className="pt-google">
      <img src={googleIcon} alt="google" />
    </div>

    <div className="pt-location">
      <img src={locationIcon} alt="location" />
      <span>{item.location}</span>
    </div>
  </div>
</div>

            </div>
          ))}
        </div>

    
      
      </div>
    </section>
  );
};

export default PatientTestimonials;
