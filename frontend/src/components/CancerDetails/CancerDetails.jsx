import { useState } from "react";
import "./CancerDetails.css";
import MeetOurExperts from "../Home/MeetOurExperts/MeetOurExperts";

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

  return (
    <>
    <section className="ictc-cancer-details">
      {/* PAGE TITLE */}
      <h1 className="ictc-cancer-title">Breast Cancer</h1>

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
              How Indian Cancer Treatment Centre (ICTC) Supports Patients With
              Nutrition & Winter Wellness
            </h2>
            <ul>
              <li>
                Breast cancer happens when cells in the breast start growing in
                an uncontrolled way and form a lump or tumour.
              </li>
              <li>
                It can start in the milk ducts (most common), the lobules
                (milk-producing glands), or more rarely in other breast tissue,
                and it can sometimes spread to lymph nodes and other organs.
              </li>
            </ul>
          </>
        )}

        {activeTab === "Risk Factors" && (
          <>
            <h2>
              How Indian Cancer Treatment Centre (ICTC) Supports Patients With
              Nutrition & Winter Wellness
            </h2>
            <ul>
              <li>
                Fixed risk factors include being female, increasing age,
                personal or family history of breast/ovarian cancer, BRCA1/BRCA2
                gene mutations, early first period, late menopause, and prior
                chest radiation.
              </li>
              <li>
                Lifestyle-related risks include being overweight after
                menopause, low physical activity, alcohol intake, smoking,
                hormone replacement therapy, and late pregnancy.
              </li>
            </ul>
          </>
        )}

        {activeTab === "Symptoms" && (
          <>
            <h2>Common Early Symptoms</h2>
            <ul>
              <li>
                A new lump or mass in the breast or underarm which may feel hard,
                painless, or tender.
              </li>
              <li>
                Thickening or swelling in part of the breast without a distinct
                lump.
              </li>
              <li>
                Changes in breast size, shape, or symmetry.
              </li>
            </ul>

            <h2>Skin and Nipple Changes</h2>
            <ul>
              <li>
                Dimpling or puckering of skin (orange-peel appearance).
              </li>
              <li>
                Redness, flaking, or thickening of the nipple or breast skin.
              </li>
              <li>
                Nipple retraction, pain, itching, or unusual discharge.
              </li>
            </ul>

            <h2>Other Warning Signs</h2>
            <ul>
              <li>Persistent breast or armpit pain.</li>
              <li>Swollen lymph nodes near collarbone or underarm.</li>
              <li>
                Advanced symptoms like bone pain, breathlessness, or jaundice.
              </li>
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

    <MeetOurExperts/>
    </>
  );
};

export default CancerDetails;
