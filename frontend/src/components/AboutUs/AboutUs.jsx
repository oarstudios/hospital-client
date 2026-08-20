import { useEffect } from "react";
import "./AboutUs.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

/* ICONS */
import arrowDefault from "../../assets/tabler_arrow-up.png";

import OurDoctorTeam from "../OurDoctorTeam/OurDoctorTeam";

import { fetchCenters } from "../../redux/centers/centersSlice";
import { fetchServices } from "../../redux/services/servicesSlice";
import SeoHead from "../Common/SeoHead";
import { getAboutSeo } from "../../seo/pageSeo";
import usePublicSeoEnv from "../../seo/usePublicSeoEnv";

const AboutUs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { list: centersData = [] } = useSelector((state) => state.centers || {});
  const { list: servicesData = [] } = useSelector((state) => state.services || {});
  const { siteUrl } = usePublicSeoEnv();

  useEffect(() => {
    if (!centersData.length) dispatch(fetchCenters());
    if (!servicesData.length) dispatch(fetchServices());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const stats = [
    {
      value: "55000+",
      title: "Patients Treated",
      desc: "Largest Cancer Care Chain in Mumbai",
      showArrow: false,
    },
    {
      // Live count of centres, e.g. "11"
      value: `${centersData.length}`,
      title: "Centres & Growing",
      desc: "Largest Cancer Care Chain in Mumbai",
      showArrow: true,
      link: "/allCenters",
    },
    {
      value: "25000+",
      title: "Chemotherapies an year",
      desc: "Largest Cancer Care Chain in Mumbai",
      showArrow: false,
    },
    {
      // Live count of services, e.g. "15+"
      value: `${servicesData.length}+`,
      title: "Cancer Care Services",
      desc: "Largest Cancer Care Chain in Mumbai",
      showArrow: true,
      link: "/AllService",
    },
  ];

  return (
    <>
      <SeoHead {...getAboutSeo({ siteUrl })} />
      <section className="ictc-about">
        {/* CONTENT */}
        <h2 className="ictc-about-title">About ICTC</h2>

        <div className="ictc-about-content">
          <p>
            At ICTC, we are dedicated to providing{" "}
            <span>compassionate, high-quality cancer treatment</span> that
            remains <span>affordable</span> for everyone.
          </p>

          <p>
            Founded by a team of expert doctors from renowned institutions such
            as <span>TATA</span>, <span>AIIMS Delhi</span>, and{" "}
            <span>GCRI</span>, ensuring every patient receives care guided by
            world-class medical expertise and unwavering support.
          </p>
        </div>

        {/* STATS */}
        <div className="ictc-about-stats">
          {stats.map((item, index) => (
            <div
              className="ictc-stat-card"
              key={index}
              onClick={() => item.link && navigate(item.link)}
              style={{ cursor: item.link ? "pointer" : "default" }}
            >
              <div className="ictc-stat-top">
                <span className="ictc-stat-value">{item.value}</span>

                {item.showArrow && (
                  <div className="ictc-arrow">
                    <img src={arrowDefault} alt="arrow" />
                  </div>
                )}
              </div>

              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <OurDoctorTeam />
    </>
  );
};

export default AboutUs;