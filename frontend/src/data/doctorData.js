import doc1 from "../assets/doc1.png";
import doc2 from "../assets/doc2.png";
import doc3 from "../assets/doc3.png";

const doctorData = {
  
  "rohit-pai": {
    slug: "rohit-pai",
    name: "Dr. Rohit Pai",
    image: doc3,
    designation: "Medico Oncologist & Hemato Oncologist",
    qualification:
      "MD Medicine (AIIMS), DM Medical Oncology (AIIMS), MRCP (UK), DNB, ECMO",

    rating: "4.9",
    reviews: "50+ Ratings",
    phone: "+91-9820007628",

    centres: ["ICTC Sion", "ICTC Vashi"],
    languages: ["English", "Hindi"],

    summary: `Dr. Rohit Pai is an experienced Consultant Medical Oncologist known for
    his expertise in managing both solid tumors and blood cancers. He has
    extensive experience at Bombay Hospital and serves as an Honorary
    Visiting Consultant at Nair Charitable Hospital.`,

    philosophy: `My approach to patient care is centered on empathy,
    evidence-based medicine, and collaboration. I focus on delivering
    personalized, transparent, and evidence-driven cancer treatment.`,

    expertise: [
      "Chemotherapy",
      "Immunotherapy",
      "Targeted Therapy",
      "Hematological Malignancies",
    ],

    education: [
      { title: "DM Medical Oncology", place: "AIIMS, New Delhi", year: "2015" },
      { title: "MD Medicine", place: "AIIMS, New Delhi", year: "2012" },
      { title: "MBBS", place: "Grant Medical College, Mumbai", year: "2008" },
    ],

    experience: [
      { role: "Consultant Medical Oncologist", place: "Bombay Hospital" },
      { role: "Honorary Visiting Consultant", place: "Nair Charitable Hospital" },
    ],

    achievements: [
      "All India Rank 1 – AIIMS PG Entrance",
      "Member – European Society of Medical Oncology (ESMO)",
      "Member – Royal College of Physicians (UK)",
    ],
  },

  /* ===================================================== */
  /* ================= DR SALIL PATKAR =================== */
  /* ===================================================== */
  "salil-patkar": {
    slug: "salil-patkar",
    name: "Dr. Salil Patkar",
    image: doc1,
    designation: "Oncologist & Haematologist",
    qualification:
      "MBBS, MD, DM (Medical Oncology), Certified in Immuno-Oncology",

    rating: "4.9",
    reviews: "120+ Ratings",
    phone: "+91-8858855200",

    centres: ["ICTC Vashi", "ICTC Panvel"],
    languages: ["English", "Hindi", "Marathi"],

    summary: `Dr. Salil Patkar is a senior oncologist with vast experience in
    managing solid tumors and blood cancers. He is known for his
    patient-first approach and precision-based oncology care.`,

    philosophy: `I believe cancer treatment should be precise, compassionate,
    and evidence-based. My goal is to treat patients holistically, not just
    their disease.`,

    expertise: [
      "Breast Cancer",
      "Blood Cancers",
      "Immunotherapy",
      "Precision Oncology",
    ],

    education: [
      { title: "DM Medical Oncology", place: "Tata Memorial Hospital", year: "2010" },
      { title: "MD Medicine", place: "Mumbai University", year: "2006" },
      { title: "MBBS", place: "Mumbai University", year: "2002" },
    ],

    experience: [
      { role: "Director & Consultant Oncologist", place: "ICTC" },
      { role: "Consultant Oncologist", place: "Apollo Hospital" },
    ],

    achievements: [
      "Certified in Immuno-Oncology – Harvard Medical School",
      "Founder Director – ICTC",
    ],
  },

  /* ===================================================== */
  /* ================= DR AMIT GHANEKAR ================== */
  /* ===================================================== */
  "amit-ghanekar": {
    slug: "amit-ghanekar",
    name: "Dr. Amit Ghanekar",
    image: doc2,
    designation: "Cancer & Blood Specialist",
    qualification: "MD, DNB (Oncology), ESMO Certified",

    rating: "4.8",
    reviews: "80+ Ratings",
    phone: "+91-9000001234",

    centres: ["ICTC Kalyan", "ICTC Dombivli"],
    languages: ["English", "Hindi"],

    summary: `Dr. Amit Ghanekar specializes in blood cancers and bone marrow
    disorders. He has extensive experience in chemotherapy and BMT-related
    oncology care.`,

    philosophy: `Delivering honest, ethical, and affordable cancer care is at
    the heart of my practice.`,

    expertise: [
      "Blood Cancers",
      "Bone Marrow Disorders",
      "Chemotherapy",
      "Supportive Oncology",
    ],

    education: [
      { title: "DNB Oncology", place: "National Board of Examinations", year: "2014" },
      { title: "MD Medicine", place: "Pune University", year: "2010" },
      { title: "MBBS", place: "Pune University", year: "2006" },
    ],

    experience: [
      { role: "Consultant Hemato-Oncologist", place: "ICTC" },
      { role: "Senior Resident", place: "Government Cancer Hospital" },
    ],

    achievements: [
      "ESMO Certified Cancer Specialist",
      "Speaker at National Oncology Conferences",
    ],
  },

  /* ===================================================== */
  /* ================= DR KUNAL GOYAL ==================== */
  /* ===================================================== */
  "kunal-goyal": {
    slug: "kunal-goyal",
    name: "Dr. Kunal Goyal",
    image: doc3,
    designation: "Hematologist & BMT Specialist",
    qualification: "MD, DM Clinical Haematology",

    rating: "4.9",
    reviews: "70+ Ratings",
    phone: "+91-9012345678",

    centres: ["ICTC Vashi", "ICTC Panvel"],
    languages: ["English", "Hindi"],

    summary: `Dr. Kunal Goyal is a specialist in bone marrow transplantation and
    advanced cellular therapies including CAR-T cell therapy.`,

    philosophy: `I focus on delivering cutting-edge hematological treatments
    while ensuring patient comfort and safety.`,

    expertise: [
      "Bone Marrow Transplant",
      "CAR-T Cell Therapy",
      "Leukemia & Lymphoma",
    ],

    education: [
      { title: "DM Clinical Haematology", place: "Tata Memorial Hospital", year: "2016" },
      { title: "MD Medicine", place: "Delhi University", year: "2012" },
      { title: "MBBS", place: "Delhi University", year: "2008" },
    ],

    experience: [
      { role: "BMT & CAR-T Specialist", place: "ICTC" },
      { role: "Clinical Fellow", place: "Tata Memorial Centre" },
    ],

    achievements: [
      "Performed 200+ Bone Marrow Transplants",
      "Contributor to CAR-T Therapy Clinical Trials",
    ],
  },
};

export default doctorData;
