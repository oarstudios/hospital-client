import { useEffect, useRef, useState } from "react";
import "./PatientTestimonials.css";

import quoteIcon from "../../../assets/quote.png";
import googleIcon from "../../../assets/flat-color-icons_google (1).png";
import locationIcon from "../../../assets/weui_location-filled.png";

const testimonials = [
  {
    name: "Ganeshprasad Gawand",
    text:
      "My wife is a breast cancer patient. She has been coming to Dr. Salil Patkar at ICTC vashi for almost 4 years. She is completely cured.",
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
];

const AUTO_SLIDE_INTERVAL = 5000;

const PatientTestimonials = () => {
  const trackRef = useRef(null);
  const timerRef = useRef(null);
  const startX = useRef(0);
  const endX = useRef(0);

  const [index, setIndex] = useState(0);

  /* ---------- SLIDE ---------- */
  const goNext = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goPrev = () => {
    setIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  /* ---------- AUTOPLAY ---------- */
  const startAutoSlide = () => {
    stopAutoSlide();
    timerRef.current = setInterval(goNext, AUTO_SLIDE_INTERVAL);
  };

  const stopAutoSlide = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    startAutoSlide();
    return stopAutoSlide;
  }, []);

  /* ---------- MOVE TRACK (NO CUT ISSUE) ---------- */
  useEffect(() => {
    if (!trackRef.current) return;

    const slide = trackRef.current.children[index];
    if (!slide) return;

    trackRef.current.style.transform = `translateX(-${slide.offsetLeft}px)`;
  }, [index]);

  /* ---------- SWIPE ---------- */
  const onTouchStart = (e) => {
    stopAutoSlide();
    startX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e) => {
    endX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    const diff = startX.current - endX.current;
    if (Math.abs(diff) > 60) {
      diff > 0 ? goNext() : goPrev();
    }
    startAutoSlide();
  };

  return (
    <section className="pt-wrapper">
      {/* LEFT */}
      <div className="pt-left">
        <img src={quoteIcon} alt="quote" />
      </div>

      {/* RIGHT */}
      <div
        className="pt-right"
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="pt-track" ref={trackRef}>
          {testimonials.map((item, i) => (
            <div className="pt-slide" key={i}>
              <div className="pt-card-wrapper">
                <div className="pt-card">
                  <p className="pt-text">{item.text}</p>
                  <p className="pt-name">{item.name}</p>
                </div>

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
