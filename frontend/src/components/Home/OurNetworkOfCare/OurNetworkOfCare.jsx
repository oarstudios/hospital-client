import { useState } from "react";
import "./OurNetworkOfCare.css";
import callIcon from "../../../assets/fluent_call-16-filled.png";

import centerData from "../../../data/centerData";

const centres = Object.values(centerData);

const OurNetworkOfCare = () => {
  const [activeCentre, setActiveCentre] = useState(centres[0]);

  return (
    <section className="network-wrapper">
      <div className="network-container">
        
        {/* LEFT SIDE */}
        <div className="network-left">
          <h2>Our Network of Care</h2>

          <div className="location-grid">
            {centres.map((centre) => (
              <button
                key={centre.slug}
                className={`location-pill ${
                  activeCentre.slug === centre.slug ? "active" : ""
                }`}
                onClick={() => setActiveCentre(centre)}
              >
                {centre.name.replace("ICTC ", "")}
              </button>
            ))}
          </div>

          <div className="network-stats">
            <h1>{centres.length}</h1>
            <p>
              Centres throughout
              <br />
              Mumbai & Growing
            </p>
          </div>
        </div>

        {/* RIGHT SIDE MAP */}
        <div className="network-map">
          
          {/* PHONE BADGE */}
          <a
            href={`tel:${activeCentre.phone.replace(/\s/g, "")}`}
            className="map-phone-badge"
          >
            <img
              src={callIcon}
              alt="Call"
              className="call-icon"
            />
            <span>
              {activeCentre.name}: {activeCentre.phone}
            </span>
          </a>

          {/* MAP */}
          <iframe
            title={`${activeCentre.name} Map`}
            src={activeCentre.mapEmbed}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
};

export default OurNetworkOfCare;
