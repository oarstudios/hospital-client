import { useEffect, useState } from "react";
import "./OurNetworkOfCare.css";

const centres = [
  {
    name: "Vashi",
    phone: "91915 12345",
    lat: 19.073796452042792,
    lng: 72.99670582466513,
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3412.3515059166466!2d72.99670582466513!3d19.073796452042792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c12e366befd9%3A0x422a83b108bd2893!2sDr%20Salil%20Patkar%20%2C%20Cancer%20Specialist%20in%20Vashi%20Navi%20Mumbai%2C%20Best%20Oncologist%20in%20Vashi%2C%20Navi%20Mumbai%20Oncologist%20%7C%20ICTC%20Vashi!5e1!3m2!1sen!2sin!4v1767514911613!5m2!1sen!2sin",
  },
  {
    name: "Panvel",
    phone: "91915 23456",
    lat: 18.991160854631566,
    lng: 73.11214447466304,
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3414.0496613381006!2d73.11214447466304!3d18.991160854631566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7e94576a0d73b%3A0x36d856b6c2f8066a!2sDr%20Salil%20Patkar%2C%20Cancer%20Specialist%20Panvel%20Navi%20Mumbai%2C%20Oncologist%20in%20Navi%20Mumbai%20%7C%20ICTC!5e1!3m2!1sen!2sin!4v1767515000407!5m2!1sen!2sin",
  },
  {
    name: "Kalyan",
    phone: "91915 34567",
    lat: 19.245254470594404,
    lng: 73.11858564253039,
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13635.221670262083!2d73.11858564253039!3d19.245254470594404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be795d1b4ecdb4f%3A0x854c3b30dc3b1775!2sDr%20Amit%20Ghanekar%20%7C%20ICTC%2C%20Kalyan%20%7C%20Best%20Oncologist%20in%20Kalyan%2C%20Cancer%20Specialist%2C%20Hemat-Oncologist%20Kalyan!5e1!3m2!1sen!2sin!4v1767515047123!5m2!1sen!2sin",
  },
  {
    name: "Dombivli",
    phone: "91915 45678",
    lat: 19.21506470125195,
    lng: 73.08609417715512,
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3409.4320164288247!2d73.08609417715512!3d19.21506470125195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be79593301ee44f%3A0x820a319785e46b87!2sDr%20Amit%20Ghanekar%20Cancer%20Specialist%20in%20Dombivli%2C%20Best%20Oncologist%20in%20Dombivli%2C%20Top%20Cancer%20Treatment%2C%20Hemat-Oncologist%20%7C%20ICTC!5e1!3m2!1sen!2sin!4v1767515112368!5m2!1sen!2sin",
  },
  {
    name: "Sion",
    phone: "91915 56789",
    lat: 19.037544753179688,
    lng: 72.85946797466435,
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3413.097349783561!2d72.85946797466435!3d19.037544753179688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cf112e225555%3A0xe06806556362a1c1!2sDr.%20Rohit%20Pai%20%7C%20ICTC%2C%20Sion%20%7C%20Cancer%20Specialist%20in%20Sion%20Mumbai%2C%20Best%20Oncologist%20in%20Mumbai%2C%20Hematologist!5e1!3m2!1sen!2sin!4v1767515143953!5m2!1sen!2sin",
  },
  {
    name: "Dadar",
    phone: "91915 67890",
    lat: 19.0169588538245,
    lng: 72.82636857466377,
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3413.5202766536772!2d72.82636857466377!3d19.0169588538245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cf005a0bf0e3%3A0x1292cb1e39e131c5!2sDr%20Viraj%20Nevrekar%20-%20Best%20Cancer%20Specialist%20in%20Mumbai%2C%20Oncologist%20in%20Dadar%20%7C%20ICTC%20Dadar!5e1!3m2!1sen!2sin!4v1767515175555!5m2!1sen!2sin",
  },
  {
    name: "Goregaon",
    phone: "91915 90123",
    lat: 19.065515444445786,
    lng: 72.66141144915886,
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d218401.40800536098!2d72.66141144915886!3d19.065515444445786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b767bb650fe3%3A0x8be5e9f8d1667916!2sDr%20Viraj%20Nevrekar%20-%20Best%20Cancer%20Specialist%20in%20Goregaon%2C%20Oncologist%20in%20Goregaon%2C%20Cancer%20Hospital%20%26%20Treatment!5e1!3m2!1sen!2sin!4v1767515244982!5m2!1sen!2sin",
  },
  {
    name: "Ghatkopar",
    phone: "91915 78901",
    lat: 19.088993651565527,
    lng: 72.90438177466551,
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3412.038431756734!2d72.90438177466551!3d19.088993651565527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c707f2273c3f%3A0x31d18eff35f5fe0a!2sDr.%20Deep%20Vora%20%7C%20Cancer%20Specialist%20in%20Ghatkopar%2C%20Best%20Oncologist%20in%20Ghatkopar%2C%20Top%20Cancer%20Treatment%20%7C%20ICTC%20Ghatkopar!5e1!3m2!1sen!2sin!4v1767515322582!5m2!1sen!2sin",
  },
  {
    name: "Santacruz",
    phone: "91915 89012",
    lat: 19.08935665155413,
    lng: 72.83512587466552,
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3412.0309507385036!2d72.83512587466552!3d19.08935665155413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c98168ba27ad%3A0x3ba3b1b97d371202!2sDr%20Shreya%20Gattani%20%7C%20Cancer%20Specialist%20in%20Santacruz%2C%20Best%20Oncologist%20in%20Santacruz%20Mumbai%20-%20ICTC!5e1!3m2!1sen!2sin!4v1767515390936!5m2!1sen!2sin",
  },
  {
    name: "Chembur",
    phone: "91915 11223",
    lat: 19.073796452042792,
    lng: 72.99670582466513,
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3412.3515059166466!2d72.99670582466513!3d19.073796452042792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c12e366befd9%3A0x422a83b108bd2893!2sDr%20Salil%20Patkar%20%2C%20Cancer%20Specialist%20in%20Vashi%20Navi%20Mumbai%2C%20Best%20Oncologist%20in%20Vashi%2C%20Navi%20Mumbai%20Oncologist%20%7C%20ICTC%20Vashi!5e1!3m2!1sen!2sin!4v1767514911613!5m2!1sen!2sin",
  },
];

const toRad = (v) => (v * Math.PI) / 180;
const distanceKm = (a, b, c, d) => {
  const R = 6371;
  const dLat = toRad(c - a);
  const dLng = toRad(d - b);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a)) *
      Math.cos(toRad(c)) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};

const OurNetworkOfCare = () => {
  const [activeCentre, setActiveCentre] = useState(centres[0]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nearest = centres.reduce((p, c) =>
          distanceKm(coords.latitude, coords.longitude, c.lat, c.lng) <
          distanceKm(coords.latitude, coords.longitude, p.lat, p.lng)
            ? c
            : p
        );
        setActiveCentre(nearest);
      },
      () => {}
    );
  }, []);

  return (
    <section className="network-wrapper">
      <div className="network-container">
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

        <div className="network-map">
          <a
            href={`tel:+${activeCentre.phone}`}
            className="map-phone-badge"
          >
            📞 {activeCentre.name}: {activeCentre.phone}
          </a>

          <iframe
            title={`${activeCentre.name} Map`}
            src={activeCentre.mapEmbed}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

          <div className="map-actions">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${activeCentre.lat},${activeCentre.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="map-btn"
            >
              Open in Google Maps
            </a>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${activeCentre.lat},${activeCentre.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="map-btn dark"
            >
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurNetworkOfCare;
