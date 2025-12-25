import "./CenterGallery.css";

/* 👉 IMPORT ALL IMAGES HERE */
import vashi1 from "../../../assets/Rectangle 6.png";
import vashi2 from "../../../assets/Rectangle 6.png";
import vashi3 from "../../../assets/Rectangle 6.png";
import vashi4 from "../../../assets/Rectangle 6.png";
import vashi5 from "../../../assets/Rectangle 6.png";



/* 👉 CENTRE → GALLERY MAP */
const GALLERY_DATA = {
  vashi: [
    vashi1,
    vashi2,
    vashi3,
    vashi4,
    vashi5,
  ],
 
  // add more centres here
};

const CenterGallery = ({ center = "vashi" }) => {
  const images = GALLERY_DATA[center.toLowerCase()] || [];

  return (
    <section className="center-gallery">
      <h2 className="center-gallery__title">Gallery</h2>

      <div className="center-gallery__grid">
        {images.map((img, index) => (
          <div className="center-gallery__item" key={index}>
            <img src={img} alt={`gallery-${index}`} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CenterGallery;
