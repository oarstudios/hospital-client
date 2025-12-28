import "./CenterGallery.css";
import { useParams } from "react-router-dom";
import centerData from "../../../data/centerData";

const CenterGallery = () => {
  const { slug } = useParams();
  const images = centerData[slug]?.gallery || [];

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
