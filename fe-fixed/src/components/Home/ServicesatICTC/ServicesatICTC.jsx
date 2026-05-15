import "./ServicesAtICTC.css";
import { useNavigate } from "react-router-dom";
import serviceData from "../../../data/serviceData";

const ALLOWED_CATEGORIES = [
  "Treatment Modalities",
  "Diagnostic & Support Services",
];

const ServicesAtICTC = () => {
  const navigate = useNavigate();

  const filteredServices = Object.entries(serviceData).filter(
    ([, service]) => ALLOWED_CATEGORIES.includes(service.category)
  );

  return (
    <section className="services-ictc">
      <h2 className="services-title">Services Offered at ICTC</h2>

      <div className="services-grid">
        {filteredServices.map(([slug, service]) => (
          <div
            key={slug}
            className="service-card"
            onClick={() => navigate(`/service/${slug}`)}
          >
            <div className="service-icon">
              <img src={service.icon} alt={service.name} />
            </div>

            <div className="service-content">
              <h3>{service.name}</h3>
            </div>
          </div>
        ))}
      </div>

      <button
        className="view-all all-services-btn"
        onClick={() => navigate("/AllService")}
      >
        View All <span>→</span>
      </button>
    </section>
  );
};

export default ServicesAtICTC;
