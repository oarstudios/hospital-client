import { useNavigate } from "react-router-dom";
import serviceData from "../../data/serviceData";
import "./AllServicePage.css";


function AllServicePage() {
  const navigate = useNavigate();

  // Group services by category
  const servicesByCategory = Object.entries(serviceData).reduce(
    (acc, [slug, service]) => {
      if (!acc[service.category]) {
        acc[service.category] = [];
      }
      acc[service.category].push({ slug, ...service });
      return acc;
    },
    {}
  );

  return (
   <section className="all-services-page">

      {Object.entries(servicesByCategory).map(([category, services]) => (
        <div key={category} style={{ marginBottom: "50px" }}>
          
          {/* CATEGORY TITLE */}
          <h2
            style={{
              fontSize: "26px",
              fontWeight: "700",
              marginBottom: "25px",
              color: "rgba(105, 60, 121, 1)",
              borderLeft: "6px solid rgba(105, 60, 121, 1)",
              paddingLeft: "12px",
            }}
          >
            {category}
          </h2>

          {/* SERVICES GRID */}
          <div className="services-grid">
            {services.map((service) => (
              <div
                key={service.slug}
                className="service-card"
                onClick={() => navigate(`/service/${service.slug}`)}
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
        </div>
      ))}
    </section>
  );
}

export default AllServicePage;
