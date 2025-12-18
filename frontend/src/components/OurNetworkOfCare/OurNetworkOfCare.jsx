import { useState } from "react";
import "./OurNetworkOfCare.css";

const centres = [
  {
    name: "Vashi",
    phone: "91915 12345",
    lat: 19.0707,
    lng: 72.9986,
  },
  {
    name: "Panvel",
    phone: "91915 23456",
    lat: 18.9894,
    lng: 73.1175,
  },
  {
    name: "Kalyan",
    phone: "91915 34567",
    lat: 19.2403,
    lng: 73.1305,
  },
  {
    name: "Dombivli",
    phone: "91915 45678",
    lat: 19.2183,
    lng: 73.0867,
  },
  {
    name: "Sion",
    phone: "91915 56789",
    lat: 19.0467,
    lng: 72.8649,
  },
  {
    name: "Dadar",
    phone: "91915 67890",
    lat: 19.0176,
    lng: 72.8562,
  },
  {
    name: "Ghatkopar",
    phone: "91915 78901",
    lat: 19.0864,
    lng: 72.9081,
  },
  {
    name: "Santacruz",
    phone: "91915 89012",
    lat: 19.0896,
    lng: 72.8656,
  },
  {
    name: "Goregaon",
    phone: "91915 90123",
    lat: 19.1663,
    lng: 72.8526,
  },
  {
    name: "Chembur",
    phone: "91915 11223",
    lat: 19.0625,
    lng: 72.9006,
  },
];

const OurNetworkOfCare = () => {
  const [activeCentre, setActiveCentre] = useState(centres[0]);

  return (
    <section className="network-wrapper">
      <div className="network-container">
        {/* LEFT */}
        <div className="network-left">
          <h2>Our Network of Care</h2>

          <div className="location-grid">
            {centres.map((centre) => (
              <button
                key={centre.name}
                className={`location-pill ${
                  activeCentre.name === centre.name ? "active" : ""
                }`}
                onClick={() => setActiveCentre(centre)}
              >
                {centre.name}
              </button>
            ))}
          </div>

          <div className="network-stats">
            <h1>10</h1>
            <p>
              Centres throughout
              <br />
              Mumbai & Growing
            </p>
          </div>
        </div>

        {/* RIGHT MAP */}
        <div className="network-map">
          <div className="map-phone-badge">
            📞 {activeCentre.name}: {activeCentre.phone}
          </div>

          <iframe
            title="ICTC Location Map"
            src={`https://www.google.com/maps?q=${activeCentre.lat},${activeCentre.lng}&z=15&output=embed`}
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default OurNetworkOfCare;
