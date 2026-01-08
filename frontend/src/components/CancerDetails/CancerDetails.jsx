import { useState } from "react";
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

        {/* Array */}
        {Array.isArray(value) && renderList(value)}

        {/* Nested Object */}
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
  const [activeTab, setActiveTab] = useState("Overview");
  const { slug } = useParams();
  const data = cancerData[slug];

  /* SAFETY CHECK */
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
        {/* TITLE */}
        <h1 className="ictc-cancer-title">{data.Name}</h1>

        {/* INTRODUCTION */}
        {data.Introduction && (
          <p className="ictc-cancer-intro">{data.Introduction}</p>
        )}

        {/* TABS */}
        <nav className="ictc-cancer-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`ictc-cancer-tab ${
                activeTab === tab ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* CONTENT */}
        <article className="ictc-cancer-content">
          {/* OVERVIEW */}
          {activeTab === "Overview" && (
            <>
              <h2>Overview</h2>
              {renderList(data.Overview)}
            </>
          )}

          {/* RISK FACTORS */}
          {activeTab === "Risk Factors" && (
            <>
              <h2>Risk Factors</h2>
              {renderObjectSections(data.RiskFactors)}
            </>
          )}

          {/* SYMPTOMS */}
          {activeTab === "Symptoms" && (
            <>
              <h2>Symptoms</h2>
              {renderObjectSections(data.Symptoms)}
            </>
          )}

          {/* DIAGNOSIS */}
          {activeTab === "Diagnosis" && (
            <>
              <h2>Diagnosis</h2>
              {renderObjectSections(data.Diagnosis)}
            </>
          )}

          {/* TREATMENT */}
          {activeTab === "Treatment" && (
            <>
              <h2>Treatment</h2>
              {renderObjectSections(data.Treatment)}
            </>
          )}

          {/* DO'S & DON'TS */}
          {activeTab === "Do’s & Don’ts" && (
            <>
              <h2>Do’s & Don’ts</h2>
              {renderObjectSections(data.DosAndDonts)}
            </>
          )}

          {/* FAQ */}
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
