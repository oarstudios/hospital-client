import "./CenterDescription.css";
import vashiImg from "../../../assets/image 5.png";
// import panvelImg from "../../../assets/panvel.png"; // later
// import kalyanImg from "../../../assets/kalyan.png"; // later

const CENTER_DATA = {
  vashi: {
    title: "Cancer Care at ICTC Vashi",
    image: vashiImg,
    description: [
      "The ICTC Vashi Day Care Chemotherapy Centre is a premier cancer treatment facility in the heart of Navi Mumbai, dedicated to offering world-class cancer care with a patient-first approach.",
      "The centre is well-equipped with state-of-the-art medical infrastructure, enabling precise and effective cancer treatments tailored to individual patient needs.",
      "Heading the centre is Dr. Salil Patkar, a highly respected oncologist known for his expertise in cancer treatment and commitment to patient welfare. Alongside him, Dr. Kunal Goyal, a renowned haematologist specializing in CAR-T therapy and bone marrow transplants, plays a pivotal role in pioneering cutting-edge treatments for blood-related cancers."
    ]
  },

  // panvel: {
  //   title: "Cancer Care at ICTC Panvel",
  //   image: panvelImg,
  //   description: [
  //     "Panvel centre description paragraph 1...",
  //     "Panvel centre description paragraph 2..."
  //   ]
  // }
};

const CenterDescription = () => {
  // 🔁 Change this key to load different center
  const activeCenterKey = "vashi";

  const center = CENTER_DATA[activeCenterKey];

  return (
    <section className="center-desc-wrapper">
      <div className="center-desc-card">
        {/* LEFT TEXT */}
        <div className="center-desc-content">
          <h2>{center.title}</h2>

          {center.description.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>

        {/* RIGHT IMAGE */}
        <div className="center-desc-image">
          <img src={center.image} alt={center.title} />
        </div>
      </div>
    </section>
  );
};

export default CenterDescription;
