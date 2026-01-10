import { useEffect, useRef, useState } from "react";
import "./PatientStoriesEmbed.css";
import NewsFromExperts from "../../Home/NewsFromExperts/NewsFromExperts";

const posts = [
  "https://www.instagram.com/reel/DST-mcRDCC1/",
  "https://www.instagram.com/reel/DTHYcKMCnnA/",
  "https://www.instagram.com/reel/DRjo6xWDKOa/",
  "https://www.instagram.com/reel/DQ35e-LjETs/",
  "https://www.instagram.com/reel/DQbW9nTDIAu/",
  "https://www.instagram.com/reel/DP09jgBDGk-/",
  "https://www.instagram.com/reel/DGFk51sNhcK/"
];

const PatientStoriesEmbed = () => {
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const startX = useRef(0);

  /* Responsive visible slides */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else setVisibleCount(3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Instagram embed refresh */
  useEffect(() => {
    setTimeout(() => {
      if (window.instgrm) window.instgrm.Embeds.process();
    }, 400);
  }, [index]);

  const maxIndex = Math.max(posts.length - visibleCount, 0);

  const next = () => setIndex((i) => (i >= maxIndex ? 0 : i + 1));
  const prev = () => setIndex((i) => (i <= 0 ? maxIndex : i - 1));

  /* Touch swipe */
  const onTouchStart = (e) => (startX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    const diff = startX.current - e.changedTouches[0].clientX;
    if (diff > 50) next();
    if (diff < -50) prev();
  };

  return (
    <>
      <section className="ps-wrapper">
        <div className="ps-header">
          <h2 className="ps-title">Patient Stories</h2>
          <div className="ps-nav">
            <button onClick={prev}>←</button>
            <button onClick={next}>→</button>
          </div>
        </div>

        <div
          className="ps-slider"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="ps-track"
            style={{
              width: `${(posts.length * 100) / visibleCount}%`,
              transform: `translateX(-${index * (100 / posts.length)}%)`,
            }}
          >
            {posts.map((url, i) => (
              <div
                className="ps-slide"
                key={i}
                style={{ width: `${100 / posts.length}%` }}
              >
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

      <NewsFromExperts />
    </>
  );
};

export default PatientStoriesEmbed;
