import "./CenterDescription_LWSL.css";
import imgSrc from "../Common/ImgSrc";
import useLandingCenter from "./useLandingCenter";
import { centerImageAlt } from "../../seo/pageSeo";

const CenterDescription_LWSL = () => {
  const { center } = useLandingCenter();

  if (!center) return null;

  const paragraphs = Array.isArray(center.description)
    ? center.description
    : String(center.description || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

  return (
    <section className="center-desc-wrapper">
      <div className="center-desc-card">
        <div className="center-desc-content">
          <h2>{`Cancer Care at ${center.name}`}</h2>
          {paragraphs.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>

        <div className="center-desc-image">
          <img src={imgSrc(center.centerImage)} alt={centerImageAlt(center)} />
        </div>
      </div>
    </section>
  );
};

export default CenterDescription_LWSL;
