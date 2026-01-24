import "./ServicesAtICTC.css";
import { useNavigate } from "react-router-dom";

/* ICON IMAGES */
import service1 from "../../../assets/Ellipse 1.png";
import service2 from "../../../assets/Ellipse 1 (1).png";
import service3 from "../../../assets/Ellipse 1 (2).png";
import service4 from "../../../assets/Ellipse 1 (3).png";
import service5 from "../../../assets/Ellipse 1 (4).png";
import service6 from "../../../assets/Ellipse 1 (5).png";
import service7 from "../../../assets/Ellipse 1 (6).png";

const services = [
  { title: "Chemotherapy", slug: "chemotherapy", icon: service1 },
  { title: "Immunotherapy", slug: "immunotherapy", icon: service2 },
  { title: "Cancer Surgery", slug: "cancer-surgery", icon: service3 },
  { title: "Radiation Therapy", slug: "radiation-therapy", icon: service4 },
  { title: "Targeted Therapy", slug: "targeted-therapy", icon: service5 },
  { title: "Bone Marrow Transplant", slug: "bone-marrow-transplant", icon: service6 },
  { title: "CAR–T Cellular Therapy", slug: "car-t-therapy", icon: service7 },
];

const ServicesAtICTC = () => {
  const navigate = useNavigate();

  return (
    <section className="services-ictc">
      <h2 className="services-title">Services Offered at ICTC</h2>

      <div className="services-grid">
        {services.map((service, index) => (
          <div
            key={index}
            className="service-card"
            onClick={() => navigate(`/service/${service.slug}`)}
          >
            <div className="service-icon">
              <img src={service.icon} alt={service.title} />
            </div>

            <div className="service-content">
              <h3>{service.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesAtICTC;
