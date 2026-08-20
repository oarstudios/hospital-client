import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../../redux/services/servicesSlice";
import { fetchServiceCategories } from "../../redux/serviceCategories/serviceCategoriesSlice";
import imgSrc from "../Common/ImgSrc";
import { encryptId } from "../Common/Idcrypto";
import { serviceAlt } from "../../seo/serviceSeo";
import useLandingCenter from "./useLandingCenter";
import "./ServicesAtICTC_LWSL.css";

const isHomeCategory = (name) => {
  const n = String(name || "").toLowerCase();
  if (n.includes("treatment") && n.includes("modalit")) return true;
  if (n.includes("diagnostic") && n.includes("support")) return true;
  return false;
};

const ServicesAtICTC_LWSL = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { center } = useLandingCenter();
  const { list: services = [] } = useSelector((s) => s.services || {});
  const { list: categoriesData = [] } = useSelector((s) => s.serviceCategories || {});

  useEffect(() => {
    if (!services.length) dispatch(fetchServices());
  }, [dispatch, services.length]);

  useEffect(() => {
    if (!categoriesData.length) dispatch(fetchServiceCategories());
  }, [dispatch, categoriesData.length]);

  const visibleServices = useMemo(() => {
    const categoryById = {};
    categoriesData.forEach((cat) => {
      categoryById[cat.id] = cat.name;
    });
    return (Array.isArray(services) ? services : []).filter((service) => {
      const categoryName = service.categoryName || categoryById[service.categoryId] || "";
      return isHomeCategory(categoryName);
    });
  }, [services, categoriesData]);

  if (!center) return null;

  return (
    <section className="services-ictc">
      <h2 className="services-title">Services at {center.name}</h2>

      <div className="services-grid">
        {visibleServices.map((service) => (
          <div
            key={service.id || service.slug}
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

      <button className="view-all all-services-btn" onClick={() => navigate("/AllService")}>
        View All <span>→</span>
      </button>
    </section>
  );
};

export default ServicesAtICTC_LWSL;
