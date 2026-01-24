import "./CancersWeTreat.css";
import { useNavigate } from "react-router-dom";

/* ICON IMAGES */
import cwt1 from "../../../assets/cwt1.png";
import cwt2 from "../../../assets/cwt2.png";
import cwt3 from "../../../assets/cwt3.png";
import cwt4 from "../../../assets/cwt4.png";
import cwt5 from "../../../assets/cwt5.png";
import cwt6 from "../../../assets/cwt6.png";
import cwt7 from "../../../assets/cwt7.png";
import cwt8 from "../../../assets/cwt8.png";

const cancerTypes = [
  { title: "Gastrointestinal Cancers", slug: "gastrointestinal-cancer", icon: cwt1 },
  { title: "Brain Cancers", slug: "brain-cancer", icon: cwt2 },
  { title: "Lung Cancers", slug: "lung-cancer", icon: cwt8 },
  { title: "Urological Cancers", slug: "urological-cancer", icon: cwt3 },
  { title: "Blood Cancers", slug: "blood-cancer", icon: cwt6 },
  { title: "Bone & Soft Tissue Cancers", slug: "bone-soft-tissue-cancer", icon: cwt7 },
  { title: "Breast Cancers", slug: "breast-cancer", icon: cwt5 },
  { title: "Gynecological Cancers", slug: "gynecological-cancer", icon: cwt4 },
];

const CancersWeTreat = () => {
  const navigate = useNavigate();

  return (
    <section className="cancers-ictc">
      <h2 className="cancers-title">Cancers We Treat</h2>

      <div className="cancers-grid">
        {cancerTypes.map((cancer, index) => (
          <div
            key={index}
            className="cancer-card"
            onClick={() => navigate(`/cancer/${cancer.slug}`)}
          >
            <div className="cancer-icon">
              <img src={cancer.icon} alt={cancer.title} />
            </div>

            <div className="cancer-content">
              <h3>{cancer.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CancersWeTreat;
