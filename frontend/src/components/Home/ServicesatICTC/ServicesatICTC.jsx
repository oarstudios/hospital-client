
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchServices } from "../../../redux/services/servicesSlice";
// import imgSrc from "../../Common/ImgSrc";
// import "./ServicesAtICTC.css";

// const ServicesAtICTC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { list: services, loading } = useSelector((state) => state.services);

//   useEffect(() => {
//     if (!services.length) dispatch(fetchServices());
//   }, [dispatch, services.length]);

//   return (
//     <section className="services-ictc">
//       <h2 className="services-title">Services Offered at ICTC</h2>

//       <div className="services-grid">
//         {services.map((service) => (
//           <div
//             key={service.slug}
//             className="service-card"
//             onClick={() => navigate(`/service/${service.slug}`)}
//           >
//             <div className="service-icon">
//               <img src={imgSrc(service.coverImage)} alt={service.title} />
//             </div>

//             <div className="service-content">
//               <h3>{service.title}</h3>
//             </div>
//           </div>
//         ))}
//       </div>

//       <button
//         className="view-all all-services-btn"
//         onClick={() => navigate("/AllService")}
//       >
//         View All <span>→</span>
//       </button>
//     </section>
//   );
// };

// export default ServicesAtICTC;



import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../../../redux/services/servicesSlice";
import { fetchServiceCategories } from "../../../redux/serviceCategories/serviceCategoriesSlice";
import imgSrc from "../../Common/ImgSrc";
import { encryptId } from "../../Common/Idcrypto";
import { serviceAlt } from "../../../seo/serviceSeo";
import "./ServicesAtICTC.css";

const isHomeCategory = (name) => {
  const n = String(name || "").toLowerCase();
  if (n.includes("treatment") && n.includes("modalit")) return true;
  if (n.includes("diagnostic") && n.includes("support")) return true;
  return false;
};

const ServicesAtICTC = ({ featuredOnly = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: services = [] } = useSelector((state) => state.services);
  const { list: categoriesData = [] } = useSelector((state) => state.serviceCategories);

  useEffect(() => {
    if (!services.length) dispatch(fetchServices());
  }, [dispatch, services.length]);

  useEffect(() => {
    if (featuredOnly && !categoriesData.length) dispatch(fetchServiceCategories());
  }, [dispatch, featuredOnly, categoriesData.length]);

  const visibleServices = useMemo(() => {
    const list = Array.isArray(services) ? services : [];
    if (!featuredOnly) return list;

    const categoryById = {};
    categoriesData.forEach((cat) => {
      categoryById[cat.id] = cat.name;
    });

    return list.filter((service) => {
      const categoryName =
        service.categoryName || categoryById[service.categoryId] || "";
      return isHomeCategory(categoryName);
    });
  }, [services, categoriesData, featuredOnly]);

  return (
    <section className="services-ictc">
      <h2 className="services-title">Services Offered at ICTC</h2>

      <div className="services-grid">
        {visibleServices.map((service) => (
          <div
            key={service.slug}
            className="service-card"
            onClick={() => navigate(`/service/${service.slug}/${encryptId(service.id)}`)}
          >
            <div className="service-icon">
              <img src={imgSrc(service.coverImage)} alt={serviceAlt(service)} />
            </div>

            <div className="service-content">
              <h3>{service.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <button
        className="view-all all-services-btn"
        onClick={() => navigate("/AllService")}
      >
        {featuredOnly ? "Read More" : "View All"} <span>→</span>
      </button>
    </section>
  );
};

export default ServicesAtICTC;