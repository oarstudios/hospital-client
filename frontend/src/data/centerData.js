import heroBg from "../assets/Frame 87.png";

/* REUSED IMAGES */
import defaultImg from "../assets/image 5.png";

/* GALLERY */
import g1 from "../assets/Rectangle 6.png";
import g2 from "../assets/Rectangle 6.png";
import g3 from "../assets/Rectangle 6.png";
import g4 from "../assets/Rectangle 6.png";
import g5 from "../assets/Rectangle 6.png";

const centerData = {
  /* ===================== VASHI ===================== */
  vashi: {
    slug: "vashi",
    name: "ICTC Vashi",
    fullName: "ICTC Vashi Centre",
    rating: "4.9",
    reviews: "150+ Ratings",
    phone: "+91 88588 55200",

    mapQuery: "ICTC Cancer Care Centre Vashi Navi Mumbai",
    mapEmbed:"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3412.3515059166466!2d72.99670582466513!3d19.073796452042792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c12e366befd9%3A0x422a83b108bd2893!2sDr%20Salil%20Patkar%20%2C%20Cancer%20Specialist%20in%20Vashi%20Navi%20Mumbai%2C%20Best%20Oncologist%20in%20Vashi%2C%20Navi%20Mumbai%20Oncologist%20%7C%20ICTC%20Vashi!5e1!3m2!1sen!2sin!4v1767514911613!5m2!1sen!2sin",
    address:
      "3rd Floor, Mahavir Center, Sector 17, Vashi, Navi Mumbai – 400703",
    timing: "Mon – Sat 9:00 a.m. to 7:00 p.m.",
    heroBg,

    description: [
      "Premier day care chemotherapy centre in Navi Mumbai.",
      "Modern infrastructure with experienced oncologists.",
      "Personalised and affordable cancer treatment."
    ],

    image: defaultImg,
    gallery: [g1, g2, g3, g4, g5]
  },

  /* ===================== PANVEL ===================== */
  panvel: {
    slug: "panvel",
    name: "ICTC Panvel",
    fullName: "ICTC Panvel Centre",
    rating: "4.8",
    reviews: "120+ Ratings",
    phone: "+91 83568 36498",

    mapQuery: "ICTC Cancer Care Centre Panvel Navi Mumbai",
    mapEmbed:"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3414.0496613381006!2d73.11214447466304!3d18.991160854631566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7e94576a0d73b%3A0x36d856b6c2f8066a!2sDr%20Salil%20Patkar%2C%20Cancer%20Specialist%20Panvel%20Navi%20Mumbai%2C%20Oncologist%20in%20Navi%20Mumbai%20%7C%20ICTC!5e1!3m2!1sen!2sin!4v1767515000407!5m2!1sen!2sin",
    address:
      "Yashodhara Building, Line Ali, Old Panvel – 410206",
    timing: "Mon – Sat 9:00 a.m. to 7:00 p.m.",
    heroBg,

    description: [
      "Comprehensive cancer care in Raigad district.",
      "Specialised chemotherapy and immunotherapy.",
      "Patient-first approach with expert doctors."
    ],

    image: defaultImg,
    gallery: [g1, g2, g3, g4]
  },

  /* ===================== KALYAN ===================== */
  kalyan: {
    slug: "kalyan",
    name: "ICTC Kalyan",
    fullName: "ICTC Kalyan Centre",
    rating: "4.8",
    reviews: "110+ Ratings",
    phone: "+91 99200 18399",

    mapQuery: "ICTC Cancer Care Centre Kalyan West",
    mapEmbed:"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13635.221670262083!2d73.11858564253039!3d19.245254470594404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be795d1b4ecdb4f%3A0x854c3b30dc3b1775!2sDr%20Amit%20Ghanekar%20%7C%20ICTC%2C%20Kalyan%20%7C%20Best%20Oncologist%20in%20Kalyan%2C%20Cancer%20Specialist%2C%20Hemat-Oncologist%20Kalyan!5e1!3m2!1sen!2sin!4v1767515047123!5m2!1sen!2sin",
    address:
      "G Business Park, Khadakpada, Kalyan West – 421301",
    timing: "Mon – Sat 9:00 a.m. to 7:00 p.m.",
    heroBg,

    description: [
      "Advanced oncology services in Thane district.",
      "Precision-driven cancer treatment.",
      "Trusted by patients across Kalyan region."
    ],

    image: defaultImg,
    gallery: [g1, g2, g3]
  },

  /* ===================== DOMBIVLI ===================== */
  dombivli: {
    slug: "dombivli",
    name: "ICTC Dombivli",
    fullName: "ICTC Dombivli Centre",
    rating: "4.7",
    reviews: "100+ Ratings",
    phone: "+91 99201 99490",

    mapQuery: "ICTC Cancer Care Centre Dombivli East",
    mapEmbed:"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3409.4320164288247!2d73.08609417715512!3d19.21506470125195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be79593301ee44f%3A0x820a319785e46b87!2sDr%20Amit%20Ghanekar%20Cancer%20Specialist%20in%20Dombivli%2C%20Best%20Oncologist%20in%20Dombivli%2C%20Top%20Cancer%20Treatment%2C%20Hemat-Oncologist%20%7C%20ICTC!5e1!3m2!1sen!2sin!4v1767515112368!5m2!1sen!2sin",
    address:
      "Vaibhav Building, Ramnagar, Dombivli East",
    timing: "Mon – Sat 9:00 a.m. to 7:00 p.m.",
    heroBg,

    description: [
      "Accessible cancer care in central suburbs.",
      "Focused on affordability and comfort.",
      "Strong follow-up and supportive care."
    ],

    image: defaultImg,
    gallery: [g1, g2, g3, g4]
  },

  /* ===================== SION ===================== */
  sion: {
    slug: "sion",
    name: "ICTC Sion",
    fullName: "ICTC Sion Centre",
    rating: "4.8",
    reviews: "130+ Ratings",
    phone: "+91 91915 56789",

    mapQuery: "ICTC Cancer Care Centre Sion Mumbai",
    mapEmbed:"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3413.097349783561!2d72.85946797466435!3d19.037544753179688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cf112e225555%3A0xe06806556362a1c1!2sDr.%20Rohit%20Pai%20%7C%20ICTC%2C%20Sion%20%7C%20Cancer%20Specialist%20in%20Sion%20Mumbai%2C%20Best%20Oncologist%20in%20Mumbai%2C%20Hematologist!5e1!3m2!1sen!2sin!4v1767515143953!5m2!1sen!2sin",
    address: "Sion, Mumbai",
    timing: "Mon – Sat 9:00 a.m. to 7:00 p.m.",
    heroBg,

    description: [
      "Expert oncology and hematology services.",
      "Trusted centre in central Mumbai."
    ],

    image: defaultImg,
    gallery: [g1, g2, g3]
  },

  /* ===================== DADAR ===================== */
  dadar: {
    slug: "dadar",
    name: "ICTC Dadar",
    fullName: "ICTC Dadar Centre",
    rating: "4.8",
    reviews: "140+ Ratings",
    phone: "+91 91915 67890",

    mapQuery: "ICTC Cancer Care Centre Dadar Mumbai",
    mapEmbed:"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3413.5202766536772!2d72.82636857466377!3d19.0169588538245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cf005a0bf0e3%3A0x1292cb1e39e131c5!2sDr%20Viraj%20Nevrekar%20-%20Best%20Cancer%20Specialist%20in%20Mumbai%2C%20Oncologist%20in%20Dadar%20%7C%20ICTC%20Dadar!5e1!3m2!1sen!2sin!4v1767515175555!5m2!1sen!2sin",
    address: "Dadar, Mumbai",
    timing: "Mon – Sat 9:00 a.m. to 7:00 p.m.",
    heroBg,

    description: [
      "Advanced cancer treatment in South Mumbai.",
      "Highly experienced oncologists."
    ],

    image: defaultImg,
    gallery: [g1, g2, g3]
  },

  /* ===================== GOREGAON ===================== */
  goregaon: {
    slug: "goregaon",
    name: "ICTC Goregaon",
    fullName: "ICTC Goregaon Centre",
    rating: "4.8",
    reviews: "135+ Ratings",
    phone: "+91 91915 90123",

    mapQuery: "ICTC Cancer Care Centre Goregaon Mumbai",
    mapEmbed:"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d218401.40800536098!2d72.66141144915886!3d19.065515444445786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b767bb650fe3%3A0x8be5e9f8d1667916!2sDr%20Viraj%20Nevrekar%20-%20Best%20Cancer%20Specialist%20in%20Goregaon%2C%20Oncologist%20in%20Goregaon%2C%20Cancer%20Hospital%20%26%20Treatment!5e1!3m2!1sen!2sin!4v1767515244982!5m2!1sen!2sin", 
    address: "Goregaon, Mumbai",
    timing: "Mon – Sat 9:00 a.m. to 7:00 p.m.",
    heroBg,

    description: [
      "Comprehensive cancer care in Western suburbs.",
      "Modern oncology infrastructure."
    ],

    image: defaultImg,
    gallery: [g1, g2, g3]
  },

  /* ===================== GHATKOPAR ===================== */
  ghatkopar: {
    slug: "ghatkopar",
    name: "ICTC Ghatkopar",
    fullName: "ICTC Ghatkopar Centre",
    rating: "4.8",
    reviews: "125+ Ratings",
    phone: "+91 91915 78901",

    mapQuery: "ICTC Cancer Care Centre Ghatkopar Mumbai",
    mapEmbed:"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3412.038431756734!2d72.90438177466551!3d19.088993651565527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c707f2273c3f%3A0x31d18eff35f5fe0a!2sDr.%20Deep%20Vora%20%7C%20Cancer%20Specialist%20in%20Ghatkopar%2C%20Best%20Oncologist%20in%20Ghatkopar%2C%20Top%20Cancer%20Treatment%20%7C%20ICTC%20Ghatkopar!5e1!3m2!1sen!2sin!4v1767515322582!5m2!1sen!2sin",
    address: "Ghatkopar, Mumbai",
    timing: "Mon – Sat 9:00 a.m. to 7:00 p.m.",
    heroBg,

    description: [
      "Trusted oncology services in Eastern suburbs.",
      "Focused on patient comfort and outcomes."
    ],

    image: defaultImg,
    gallery: [g1, g2, g3]
  },

  /* ===================== SANTACRUZ ===================== */
  santacruz: {
    slug: "santacruz",
    name: "ICTC Santacruz",
    fullName: "ICTC Santacruz Centre",
    rating: "4.8",
    reviews: "128+ Ratings",
    phone: "+91 91915 89012",

    mapQuery: "ICTC Cancer Care Centre Santacruz Mumbai",
    mapEmbed:"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3412.0309507385036!2d72.83512587466552!3d19.08935665155413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c98168ba27ad%3A0x3ba3b1b97d371202!2sDr%20Shreya%20Gattani%20%7C%20Cancer%20Specialist%20in%20Santacruz%2C%20Best%20Oncologist%20in%20Santacruz%20Mumbai%20-%20ICTC!5e1!3m2!1sen!2sin!4v1767515390936!5m2!1sen!2sin",
    address: "Santacruz, Mumbai",
    timing: "Mon – Sat 9:00 a.m. to 7:00 p.m.",
    heroBg,

    description: [
      "Modern cancer care centre in Western Mumbai.",
      "Expert oncologists and supportive care."
    ],

    image: defaultImg,
    gallery: [g1, g2, g3]
  },

  /* ===================== CHEMBUR ===================== */
  chembur: {
    slug: "chembur",
    name: "ICTC Chembur",
    fullName: "ICTC Chembur Centre",
    rating: "4.8",
    reviews: "120+ Ratings",
    phone: "+91 91915 11223",

    mapQuery: "ICTC Cancer Care Centre Chembur Mumbai",
    mapEmbed:"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3412.3515059166466!2d72.99670582466513!3d19.073796452042792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c12e366befd9%3A0x422a83b108bd2893!2sDr%20Salil%20Patkar%20%2C%20Cancer%20Specialist%20in%20Vashi%20Navi%20Mumbai%2C%20Best%20Oncologist%20in%20Vashi%2C%20Navi%20Mumbai%20Oncologist%20%7C%20ICTC%20Vashi!5e1!3m2!1sen!2sin!4v1767514911613!5m2!1sen!2sin",
    address: "Chembur, Mumbai",
    timing: "Mon – Sat 9:00 a.m. to 7:00 p.m.",
    heroBg,

    description: [
      "Comprehensive oncology services in Chembur.",
      "Patient-first and ethical cancer care."
    ],

    image: defaultImg,
    gallery: [g1, g2, g3]
  }
};

export default centerData;
