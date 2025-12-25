import { useEffect, useRef, useState } from "react";
import "./PatientStoriesEmbed.css";

const posts = [
  "https://www.instagram.com/reel/DSajmWyjIRV/",
  "https://www.instagram.com/reel/DSajmWyjIRV/",
  "https://www.instagram.com/reel/DSajmWyjIRV/",
  "https://www.instagram.com/reel/DSajmWyjIRV/",
  "https://www.instagram.com/reel/DSajmWyjIRV/",
  "https://www.instagram.com/reel/DSajmWyjIRV/",
];

const VISIBLE_COUNT = 3;

const PatientStoriesEmbed = () => {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  /* Instagram embed processing */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const maxIndex = Math.max(posts.length - VISIBLE_COUNT, 0);

  const next = () => {
    setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prev = () => {
    setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section className="ps-wrapper">
      <div className="ps-header">
        <h2 className="ps-title">Patient Stories</h2>

        <div className="ps-nav">
          <button onClick={prev}>←</button>
          <button onClick={next}>→</button>
        </div>
      </div>

      <div className="ps-slider">
        <div
          className="ps-track"
          ref={trackRef}
          style={{
            transform: `translateX(-${index * (100 / VISIBLE_COUNT)}%)`,
          }}
        >
          {posts.map((url, i) => (
            <div className="ps-slide" key={i}>
              <div className="ps-embed-card">
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={url}
                  data-instgrm-version="14"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PatientStoriesEmbed;
