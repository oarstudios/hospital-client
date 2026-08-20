import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HeroCarousel_LWSL.css";
import useLandingCenter, { centrePlaceName } from "./useLandingCenter";
import SeoHead from "../Common/SeoHead";
import { getLandingSeo } from "../../seo/pageSeo";
import usePublicSeoEnv from "../../seo/usePublicSeoEnv";

import slide1Desktop from "../../assets/Frame 5172.png";

const slides = [{ image: slide1Desktop }, { image: slide1Desktop }, { image: slide1Desktop }];

const HeroCarousel_LWSL = () => {
  const [current, setCurrent] = useState(0);
  const [showCTA, setShowCTA] = useState(true);
  const navigate = useNavigate();
  const { center, slug } = useLandingCenter();
  const locationName = centrePlaceName(center) || "Mumbai";
  const seoEnv = usePublicSeoEnv();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {center && <SeoHead {...getLandingSeo(center, slug, seoEnv)} />}
      <section className="hero-carousel">
        <div className="hero-wrapper">
          <div className="hero-content">
            <h1>Cancer Care & Oncology Services in {locationName}</h1>
            <p>
              Receive expert cancer diagnosis, treatment, chemotherapy,
              immunotherapy, and follow-up care from a multidisciplinary
              oncology team in {locationName}.
            </p>
          </div>

          <div className="hero-image-wrapper">
            <img
              src={slides[current].image}
              alt={`Cancer Care in ${locationName}`}
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {showCTA && (
        <div className="quick-cta">
          <button className="cta-close" onClick={() => setShowCTA(false)}>
            ✕
          </button>
          <button className="cta-btn white" onClick={() => navigate("/BookAppoinment")}>
            Book an Appointment <span>→</span>
          </button>
          <button className="cta-btn grey" onClick={() => navigate("/BookSecondOpinion")}>
            Get Second Opinion <span>→</span>
          </button>
        </div>
      )}
    </>
  );
};

export default HeroCarousel_LWSL;
