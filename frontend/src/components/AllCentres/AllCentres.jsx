import "./AllCentres.css";

/* ICONS */
import callIcon from "../../assets/fluent_call-12-filled.png";
import starIcon from "../../assets/RatingFill.png";
import starHalfIcon from "../../assets/RatingNotFill.png";

const centres = [
  {
    name: "ICTC Vashi Centre",
    phone: "+91 93249 85044",
    lat: 19.073,
    lng: 72.9986,
    address:
      "3rd floor, Mahavir Center, Office 47/48, above Golden Punjab Hotel, Sec-17 Road, Sector 17, Vashi, Navi Mumbai, Maharashtra 400703",
  },
  {
    name: "ICTC Panvel Centre",
    phone: "+91 83568 36498",
    lat: 18.9894,
    lng: 73.1175,
    address:
      "1st Floor, Yashodhara Building, near Kethi hotel, Line Ali, Old Panvel, Panvel, Navi Mumbai, Maharashtra 410206",
  },
  {
    name: "ICTC Kalyan Centre",
    phone: "+91 99200 18399",
    lat: 19.2403,
    lng: 73.1305,
    address:
      "4th floor, G Business Park, Next to Aher Honda showroom, Khadakpada, Kalyan West 421301",
  },
  {
    name: "ICTC Dombivli Centre",
    phone: "+91 99201 99490",
    lat: 19.2094,
    lng: 73.093,
    address:
      "1st Floor, C wing, Vaibhav Bldg, Opp. Kasturi Plaza, next to Modern Pride hotel, Ramnagar, Dombivli East",
  },
  {
    name: "ICTC Dadar Centre",
    phone: "+91 93725 30800",
    lat: 19.0186,
    lng: 72.8436,
    address:
      "Office 10, Prabhadevi Industrial Estate, Opp. Siddhivinayak Temple, Prabhadevi, Mumbai – 400025",
  },
  {
    name: "ICTC Sion Centre",
    phone: "+91 85918 94047",
    lat: 19.0465,
    lng: 72.8627,
    address:
      "Block-1, Ram Niwas, Plot-226/227, Sion East, Near GTB Station, Mumbai 400022",
  },
  {
    name: "ICTC Ghatkopar Centre",
    phone: "+91 90826 64622",
    lat: 19.0856,
    lng: 72.9081,
    address:
      "203A/205, Trimurti Arcade, 2nd Flr, Nr. Sarvodaya Hospital, LBS Marg, Ghatkopar (West), Mumbai – 400086",
  },
  {
    name: "ICTC Santacruz Centre",
    phone: "+91 91127 35218",
    lat: 19.081,
    lng: 72.8415,
    address:
      "Unit 102–103, A Wing, Rizvi Park, Near Milan Subway & Reliance Digital, S.V. Road, Santacruz West, Mumbai – 400054",
  },
  {
    name: "ICTC Goregaon Centre",
    phone: "+91 98712 50784",
    lat: 19.1663,
    lng: 72.8504,
    address:
      "2nd Floor, Allure 36, SV Road, Ram Mandir Rd, Goregaon West, Mumbai – 400104",
  },
  {
    name: "ICTC Chembur Centre",
    phone: "+91 99208 14622",
    lat: 19.055,
    lng: 72.9004,
    address:
      "2nd Floor, Mangal Anand Hospital, 48, Sion–Trombay Road, Swastik Park, Chembur – 400071",
  },
];

const AllCentres = () => {
  return (
    <section className="ictc-centres-page">
      <h2 className="ictc-centres-title">ICTC Cancer Care Centres</h2>

      <div className="ictc-centres-list">
        {centres.map((centre, index) => (
          <article className="ictc-centre-card" key={index}>
            {/* MAP INSIDE CARD */}
            <div className="ictc-centre-map">
              <iframe
                title={`${centre.name} map`}
                src={`https://www.google.com/maps?q=${centre.lat},${centre.lng}&z=16&output=embed`}
                loading="lazy"
              />
            </div>

            {/* INFO */}
            <div className="ictc-centre-info">
              <div className="ictc-centre-header">
                <h3>{centre.name}</h3>
                <button className="appointment-btn">BOOK APPOINTMENT</button>
              </div>

              <div className="ictc-centre-rating">
                <img src={starIcon} alt="rating" />
                <img src={starIcon} alt="rating" />
                <img src={starIcon} alt="rating" />
                <img src={starIcon} alt="rating" />
                <img src={starHalfIcon} alt="rating" />
                <span className="rating-score">4.9</span>
                <span className="rating-sep">|</span>
                <span className="rating-count">150+ Ratings</span>
              </div>

              <p className="ictc-centre-address">{centre.address}</p>

              <div className="ictc-centre-footer">
                <div className="ictc-centre-phone">
                  <img src={callIcon} alt="Call" />
                  <span>{centre.phone}</span>
                </div>

                <span className="ictc-centre-time">
                  Mon – Sat 9:00 a.m. to 7:00 p.m.
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AllCentres;
