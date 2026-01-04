import heroBg from "../assets/Frame 87.png";

/* IMAGES */
import vashiImg from "../assets/image 5.png";
import panvelImg from "../assets/image 5.png";
import kalyanImg from "../assets/image 5.png";
import dombivliImg from "../assets/image 5.png";

/* GALLERY IMAGES (reuse for now) */
import g1 from "../assets/Rectangle 6.png";
import g2 from "../assets/Rectangle 6.png";
import g3 from "../assets/Rectangle 6.png";
import g4 from "../assets/Rectangle 6.png";
import g5 from "../assets/Rectangle 6.png";

const centerData = {
  vashi: {
    slug: "vashi",
    name: "ICTC Vashi",
    fullName: "ICTC Vashi Centre",
    rating: "4.9",
    reviews: "150+ Ratings",
    phone: "+91 88588 55200",

    /* ✅ OFFICIAL GOOGLE MAPS NAME */
    mapQuery: "ICTC Cancer Care Centre Vashi Navi Mumbai",

    address:
      "3rd floor, Mahavir Center, Office 47/48, above Golden Punjab Hotel, Sector 17, Vashi, Navi Mumbai, Maharashtra 400703",
    timing: "Mon – Sat 9:00 a.m. to 7:00 p.m.",
    heroBg,

    description: [
      "The ICTC Vashi Day Care Chemotherapy Centre is a premier cancer treatment facility in Navi Mumbai.",
      "The centre is equipped with state-of-the-art infrastructure and expert oncologists.",
      "ICTC Vashi is led by experienced oncologists delivering personalized cancer care."
    ],

    image: vashiImg,
    gallery: [g1, g2, g3, g4, g5]
  },

  panvel: {
    slug: "panvel",
    name: "ICTC Panvel",
    fullName: "ICTC Panvel Centre",
    rating: "4.8",
    reviews: "120+ Ratings",
    phone: "+91 83568 36498",

    /* ✅ OFFICIAL GOOGLE MAPS NAME */
    mapQuery: "ICTC Cancer Care Centre Panvel Navi Mumbai",

    address:
      "1st Floor, Yashodhara Building, near Kethi Hotel, Line Ali, Old Panvel, Navi Mumbai, Maharashtra 410206",
    timing: "Mon – Sat 9:00 a.m. to 7:00 p.m.",
    heroBg,

    description: [
      "ICTC Panvel provides comprehensive cancer care services to patients in Raigad and Navi Mumbai.",
      "The centre focuses on chemotherapy, immunotherapy, and supportive cancer care.",
      "ICTC Panvel ensures personalized treatment with expert oncologists."
    ],

    image: panvelImg,
    gallery: [g1, g2, g3, g4]
  },

  kalyan: {
    slug: "kalyan",
    name: "ICTC Kalyan",
    fullName: "ICTC Kalyan Centre",
    rating: "4.8",
    reviews: "110+ Ratings",
    phone: "+91 99200 18399",

    /* ✅ OFFICIAL GOOGLE MAPS NAME */
    mapQuery: "ICTC Cancer Care Centre Kalyan West",

    address:
      "4th Floor, G Business Park, Next to Aher Honda Showroom, Khadakpada, Kalyan West 421301",
    timing: "Mon – Sat 9:00 a.m. to 7:00 p.m.",
    heroBg,

    description: [
      "ICTC Kalyan is a modern oncology centre serving patients in Thane district.",
      "The centre provides advanced chemotherapy and targeted therapy services.",
      "Patient comfort and precision-driven treatment are the core focus."
    ],

    image: kalyanImg,
    gallery: [g1, g2, g3]
  },

  dombivli: {
    slug: "dombivli",
    name: "ICTC Dombivli",
    fullName: "ICTC Dombivli Centre",
    rating: "4.7",
    reviews: "100+ Ratings",
    phone: "+91 99201 99490",

    /* ✅ OFFICIAL GOOGLE MAPS NAME */
    mapQuery: "ICTC Cancer Care Centre Dombivli East",

    address:
      "1st Floor, C Wing, Vaibhav Building, Opp. Kasturi Plaza, Ramnagar, Dombivli East",
    timing: "Mon – Sat 9:00 a.m. to 7:00 p.m.",
    heroBg,

    description: [
      "ICTC Dombivli offers accessible cancer care for patients in the central suburbs.",
      "The centre specializes in chemotherapy, hormonal therapy, and follow-up care.",
      "Focused on affordability, comfort, and clinical excellence."
    ],

    image: dombivliImg,
    gallery: [g1, g2, g3, g4]
  }
};

export default centerData;
