import "./CancersWeTreat.css";

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
  { title: "Gastrointestinal Cancers", icon: cwt1 },
  { title: "Brain Cancers", icon: cwt2 },
  { title: "Lung Cancers", icon: cwt3 },
  { title: "Urological Cancers", icon: cwt4 },
  { title: "Blood Cancers", icon: cwt5 },
  { title: "Bone and Soft Tissue Cancers", icon: cwt6 },
  { title: "Breast Cancers", icon: cwt7 },
  { title: "Gynecological Cancers", icon: cwt8 },
];


const CancersWeTreat = () => {
  return (
    <section className="cancers-section">
      <h2 className="cancers-heading">Cancers We Treat</h2>

      <div className="cancers-grid">
        {cancerTypes.map((item, index) => (
          <div className="cancer-card" key={index}>
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
