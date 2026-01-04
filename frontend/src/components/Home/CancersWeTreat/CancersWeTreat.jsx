import "./CancersWeTreat.css";
import { useNavigate } from "react-router-dom";


/* 
  Pass icon as image src.
  You can replace icons later without touching layout.
*/

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
  { title: "Bone and Soft Tissue Cancers", slug: "bone-soft-tissue-cancer", icon: cwt7 },
  { title: "Breast Cancers", slug: "breast-cancer", icon: cwt5 },
  { title: "Gynecological Cancers", slug: "gynecological-cancer", icon: cwt4 },
];



const CancersWeTreat = () => {

  const navigate = useNavigate();

const handleClick = (slug) => {
  navigate(`/cancer/${slug}`);
};


  return (
    <section className="cancers-section">
      <h2 className="cancers-heading">Cancers We Treat</h2>

      <div className="cancers-grid">
        {cancerTypes.map((item, index) => (
          <div className="cancer-card" key={index}    onClick={() => handleClick(item.slug)}>
            <div className="icon-wrapper">
              <img src={item.icon} alt={item.title} />
            </div>

            <div className="card-content">
              <h3>{item.title}</h3>
              <span className="learn-more">
                Learn more <span>→</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CancersWeTreat;
