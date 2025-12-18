import "../CancersWeTreat/CancersWeTreat.css";

/* 
  Pass icon as image src.
  You can replace icons later without touching layout.
*/

import cwt1 from "../../assets/Ellipse 1.png";
import cwt2 from "../../assets/Ellipse 1 (1).png";
import cwt3 from "../../assets/Ellipse 1 (2).png";
import cwt4 from "../../assets/Ellipse 1 (3).png";
import cwt5 from "../../assets/Ellipse 1 (4).png";
import cwt6 from "../../assets/Ellipse 1 (5).png";
import cwt7 from "../../assets/Ellipse 1 (6).png";


const services = [
  { title: "Chemotherapy", icon: cwt1 },
  { title: "Immunotherapy", icon: cwt2 },
  { title: "Cancer Surgery", icon: cwt3 },
  { title: "Radiation Therapy", icon: cwt4 },
  { title: "Targeted Therapy", icon: cwt5 },
  { title: "Bone Marrow Transplant", icon: cwt6 },
  { title: "CAR–T Cellular Therapy", icon: cwt7 },
];


const ServicesatICTC = () => {
  return (
    <section className="cancers-section">
      <h2 className="cancers-heading">Cancers We Treat</h2>

      <div className="cancers-grid">
        {services.map((item, index) => (
          <div className="cancer-card" key={index}>
            <div className="icon-wrapper">
           <img
  src={item.icon}
  alt={item.title}
  style={{ width: "84px", height: "84px" }}
/>

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

export default ServicesatICTC;
