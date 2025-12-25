import { useEffect } from "react";
import "./PatientStoriesEmbed.css";

const posts = [
  "https://www.instagram.com/reel/DSajmWyjIRV/",
  "https://www.instagram.com/p/CxYabc123/",
  "https://www.instagram.com/p/CzZxyz789/"
];

const PatientStoriesEmbed = () => {
  useEffect(() => {
    // wait for script to be available
    const timer = setTimeout(() => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="ps-wrapper">
      <h2 className="ps-title">Patient Stories</h2>

      <div className="ps-grid">
        {posts.map((url, i) => (
          <blockquote
            key={i}
            className="instagram-media"
            data-instgrm-permalink={url}
            data-instgrm-version="14"
          />
        ))}
      </div>
    </section>
  );
};

export default PatientStoriesEmbed;
