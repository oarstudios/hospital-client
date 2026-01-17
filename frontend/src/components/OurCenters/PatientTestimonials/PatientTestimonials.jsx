import { useEffect, useRef, useState } from "react";
import "./PatientTestimonials.css";

import quoteIcon from "../../../assets/quote.png";
import googleIcon from "../../../assets/flat-color-icons_google (1).png";
import locationIcon from "../../../assets/weui_location-filled.png";

const testimonials = [
  {
    name: "Renish Nair",
    text:
      "The best doctor for Cancer treatment. What else do you want from a doctor - a ready ear to listen, a quick prognosis of the problem and a calm and assured approach of the line of treatment. His staff is equally courteous, caring and always approachable.",
    location: "ICTC Vashi",
  },
  {
    name: "Rahul Amberkar",
    text:
      "My brother is receiving lung cancer treatment at ICTC and we couldn't be happier with the care. The best oncologist in Vashi has guided us through his 3rd chemotherapy cycle with exceptional expertise.",
    location: "ICTC Vashi",
  },
  {
    name: "Rahul Patil",
    text:
      "Dr. Ghanekar’s empathetic nature and commitment to his patients truly stand out. His guidance and encouragement made a difficult journey much easier to navigate. I highly recommend him to anyone seeking expert oncology care combined with genuine compassion.",
    location: "ICTC Kalyan",
  },
  {
    name: "Viraj Patil",
    text:
      "I myself was taking treatment here from past 1 year. Dr Ghanekar helped me go through all the details of procedure and gave me confidence to get away from fears and myths. With the proper treatment I am feeling more healthy now and able to live my normal life through daily tasks.",
    location: "ICTC Dombivli",
  },
  {
    name: "Vinay Pandey",
    text:
      "Dr. Rohit Pai is one of the best oncologists I have come across. He is not only highly knowledgeable in his field but also deeply compassionate toward his patients. He always takes the time to listen, explain treatment options clearly, and provide continuous support throughout the journey.",
    location: "ICTC Sion",
  },
  {
    name: "Jyoti Naidu",
    text:
      "One of the best oncologist in Mumbai. Dr. Rohit Pai sir is incredibly professional, compassionate and always approachable. Highly recommend to anyone seeking expert cancer care.",
    location: "ICTC Sion",
  },
  {
    name: "Siddhaved Menjrekar",
    text:
      "For cancer treatment, Dr. Viraj Nevrekar's Cancer Centre is a fantastic location. The clinic is orderly, spotless, and runs smoothly. The doctors' and staff's helpfulness and kindness were the most notable aspects.",
    location: "ICTC Dadar",
  },
  {
    name: "Shoheb Shaikh",
    text:
      "The Dr Viraj Nevrekar is best doctor ever we had experience and his exceptional care and for always putting his patients first. Special thanks for Dadar clinic and staff really appreciate for the service.",
    location: "ICTC Dadar",
  },
  {
    name: "Basit Sayyed",
    text:
      "Throughout the treatment, Dr. Vora was approachable, reassuring, and extremely professional. His calm guidance and positive attitude made a big difference not only to my mother’s recovery but also to our family’s peace of mind.",
    location: "ICTC Ghatkopar",
  },
  {
    name: "Mehul Gala",
    text:
      "Dr. Deep Vora is the best cancer doctor I have found. The entire staff was warm and welcoming. The medical assistant was great with my mother, and Dr. Deep was easy to talk to, answered all my questions, and was gentle and kind.",
    location: "ICTC Ghatkopar",
  },
  {
    name: "Shekhar Kale",
    text:
      "I am truly grateful to Dr. Kunal Goyal for his guidance and support. He patiently explained everything to me in detail, making sure I understood each and every aspect clearly.",
    location: "ICTC Vashi",
  },
  {
    name: "Seb Farla",
    text:
      "Dr. Kunal Goyal is an exceptional physician. His profound knowledge and skillful expertise are immediately apparent. What truly sets him apart, however, is his genuine compassion, humanity, and his remarkable accessibility.",
    location: "ICTC Vashi",
  },
  {
    name: "Dimpesh Solanki",
    text:
      "I have been getting my dad chemotherapy in this centre. Dr. Shreya has been supportive and also informative to us. She has explained all the basic requirements and challenges while dealing with cancer.",
    location: "ICTC Santacruz",
  },
  {
    name: "Yasha Kottian",
    text:
      "Dr. Shreya patiently addressed all our questions and concerns, explaining recent developments in oncology and helping to remove the social stigma often associated with cancer.",
    location: "ICTC Santacruz",
  },
];

const AUTO_SLIDE_INTERVAL = 5000;

const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const PatientTestimonials = () => {
  const trackRef = useRef(null);
  const timerRef = useRef(null);
  const startX = useRef(0);
  const endX = useRef(0);

  const [index, setIndex] = useState(0);
  const [shuffledTestimonials, setShuffledTestimonials] = useState([]);

  /* ---------- SHUFFLE ONCE ---------- */
  useEffect(() => {
    const shuffled = shuffleArray(testimonials);
    setShuffledTestimonials(shuffled);
    setIndex(0);
  }, []);

  /* ---------- SLIDE ---------- */
  const goNext = () => {
    setIndex((prev) =>
      shuffledTestimonials.length
        ? (prev + 1) % shuffledTestimonials.length
        : 0
    );
  };

  const goPrev = () => {
    setIndex((prev) =>
      shuffledTestimonials.length
        ? prev === 0
          ? shuffledTestimonials.length - 1
          : prev - 1
        : 0
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
    if (shuffledTestimonials.length) {
      startAutoSlide();
    }
    return stopAutoSlide;
  }, [shuffledTestimonials]);

  /* ---------- MOVE TRACK ---------- */
  useEffect(() => {
    if (!trackRef.current) return;
    const slide = trackRef.current.children[index];
    if (!slide) return;
    trackRef.current.style.transform = `translateX(-${slide.offsetLeft}px)`;
  }, [index, shuffledTestimonials]);

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
      <div className="pt-left">
        <img src={quoteIcon} alt="quote" />
      </div>

      <div
        className="pt-right"
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="pt-track" ref={trackRef}>
          {shuffledTestimonials.map((item, i) => (
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
