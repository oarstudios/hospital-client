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
        {/* PAGE TITLE */}
        <h1 className="ictc-cancer-title">{data.name}</h1>

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
          {activeTab === "Overview" && (
            <>
              <h2>
                How Indian Cancer Treatment Centre (ICTC) Supports Patients
              </h2>
              <ul>
                {data.overview?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {activeTab === "Risk Factors" && (
            <>
              <h2>Risk Factors</h2>
              <ul>
                {data.riskFactors?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {activeTab === "Symptoms" && (
            <>
              <h2>Symptoms</h2>
              <ul>
                {data.symptoms?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {activeTab !== "Overview" &&
            activeTab !== "Risk Factors" &&
            activeTab !== "Symptoms" && (
              <p className="ictc-placeholder-text">
                Content for <strong>{activeTab}</strong> will be added here.
              </p>
            )}
        </article>
      </section>

      <MeetOurExperts />
    </>
  );
};

export default CancerDetails;
