import { useEffect, useState, useRef } from "react";
import "./CancerDetails.css";
import MeetOurExperts from "../Home/MeetOurExperts/MeetOurExperts";
import { useParams } from "react-router-dom";
import cancerData from "../../data/cancerData";

const TABS = [
  "Overview",
  "Risk Factors",
  "Symptoms",
  "Diagnosis",
  "Treatment",
  "Do’s & Don’ts",
  "FAQ’s",
];

/* ---------- HELPERS ---------- */

const formatTitle = (text) =>
  text.replace(/([A-Z])/g, " $1").trim();

const renderList = (items) => {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
};

const renderObjectSections = (obj) => {
  if (!obj || typeof obj !== "object") return null;

  return Object.entries(obj).map(([key, value]) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;

    return (
      <div key={key} className="ictc-section-block">
        <h3>{formatTitle(key)}</h3>

        {Array.isArray(value) && renderList(value)}

        {typeof value === "object" &&
          !Array.isArray(value) &&
          Object.entries(value).map(([subKey, subValue]) => {
            if (!subValue || subValue.length === 0) return null;

            return (
              <div key={subKey} className="ictc-sub-section">
                <h4>{formatTitle(subKey)}</h4>
                {renderList(subValue)}
              </div>
            );
          })}
      </div>
    );
  });
};

/* ---------- COMPONENT ---------- */

const CancerDetails = () => {
  const { slug } = useParams();
  const data = cancerData[slug];

  const tabsRef = useRef(null);

  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem("ictc-active-tab");
    return TABS.includes(savedTab) ? savedTab : "Overview";
  });

  const [isScrolled, setIsScrolled] = useState(false);

  /* Sticky bar shadow */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Reset tab on slug change */
  useEffect(() => {
    const savedTab = localStorage.getItem("ictc-active-tab");
    if (!TABS.includes(savedTab)) {
      localStorage.setItem("ictc-active-tab", "Overview");
    }
  }, [slug]);

  if (!data) {
    return (
      <section className="ictc-cancer-details">
        <h1 className="ictc-cancer-title">Cancer Details Not Found</h1>
        <p className="ictc-placeholder-text">
          The requested cancer information is not available.
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="ictc-cancer-details">
        {/* INTRO */}
        <div className="ictc-cancer-intro-block">
          <h1 className="ictc-cancer-title">{data.Name}</h1>
          {data.Introduction && (
            <p className="ictc-cancer-intro">{data.Introduction}</p>
          )}
        </div>

        {/* STICKY TABS */}
        <div
          ref={tabsRef}
          className={`ictc-cancer-sticky-bar ${
            isScrolled ? "scrolled" : ""
          }`}
        >
          <nav className="ictc-cancer-tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`ictc-cancer-tab ${
                  activeTab === tab ? "active" : ""
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  localStorage.setItem("ictc-active-tab", tab);

                  // ✅ Scroll ONLY on tab click
                  if (tabsRef.current) {
                    const offset = 100; // header height
                    const top =
                      tabsRef.current.getBoundingClientRect().top +
                      window.pageYOffset -
                      offset;

                    window.scrollTo({
                      top,
                      behavior: "smooth",
                    });
                  }
                }}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* TAB CONTENT */}
        <article className="ictc-cancer-content">
          {activeTab === "Overview" && (
            <>
              <h2>Overview</h2>
              {renderList(data.Overview)}
            </>
          )}

          {activeTab === "Risk Factors" && (
            <>
              <h2>Risk Factors</h2>
              {renderObjectSections(data.RiskFactors)}
            </>
          )}

          {activeTab === "Symptoms" && (
            <>
              <h2>Symptoms</h2>
              {renderObjectSections(data.Symptoms)}
            </>
          )}

          {activeTab === "Diagnosis" && (
            <>
              <h2>Diagnosis</h2>
              {renderObjectSections(data.Diagnosis)}
            </>
          )}

          {activeTab === "Treatment" && (
            <>
              <h2>Treatment</h2>
              {renderObjectSections(data.Treatment)}
            </>
          )}

          {activeTab === "Do’s & Don’ts" && (
            <>
              <h2>Do’s & Don’ts</h2>
              {renderObjectSections(data.DosAndDonts)}
            </>
          )}

          {activeTab === "FAQ’s" && (
            <>
              <h2>Frequently Asked Questions</h2>
              {data.FAQs?.map((faq, index) => (
                <div key={index} className="ictc-faq-item">
                  <h4>{faq.Question}</h4>
                  <p>{faq.Answer}</p>
                </div>
              ))}
            </>
          )}
        </article>
      </section>

      <MeetOurExperts />
    </>
  );
};

export default CancerDetails;
