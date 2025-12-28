const serviceData = {
  "chemotherapy": {
    name: "Chemotherapy",
    heroTitle: "Chemotherapy at ICTC",
    description: [
      "Chemotherapy employs drugs to eradicate cancer cells.",
      "It prevents cancer cells from multiplying and spreading."
    ],
    subtypes: [
      "Adjuvant therapy",
      "Curative therapy",
      "Neoadjuvant therapy",
      "Palliative therapy"
    ],
    benefits: [
      "Shrinks or eliminates tumors",
      "Helps prevent cancer recurrence",
      "Allows surgery to remove malignancy"
    ],
    downsides: [
      "Hair loss",
      "Nausea and vomiting",
      "Fatigue",
      "Weak immune system"
    ]
  },

  "immunotherapy": {
    name: "Immunotherapy",
    heroTitle: "Immunotherapy at ICTC",
    description: [
      "Immunotherapy boosts the body's immune system to fight cancer."
    ],
    subtypes: ["Checkpoint inhibitors", "Cancer vaccines"],
    benefits: ["Targets cancer cells precisely"],
    downsides: ["Autoimmune reactions"]
  },

  "radiation-therapy": {
    name: "Radiation Therapy",
    heroTitle: "Radiation Therapy at ICTC",
    description: [
      "Radiation therapy uses high-energy rays to destroy cancer cells."
    ],
    subtypes: ["External beam radiation", "Brachytherapy"],
    benefits: ["Local tumor control"],
    downsides: ["Skin irritation"]
  },

  "cancer-surgery": {
    name: "Cancer Surgery",
    heroTitle: "Cancer Surgery at ICTC",
    description: [
      "Surgery removes cancerous tumors physically."
    ],
    subtypes: ["Minimally invasive", "Open surgery"],
    benefits: ["Complete tumor removal"],
    downsides: ["Recovery time"]
  },

  "targeted-therapy": {
    name: "Targeted Therapy",
    heroTitle: "Targeted Therapy at ICTC",
    description: [
      "Targets specific cancer cell genes or proteins."
    ],
    subtypes: ["Monoclonal antibodies"],
    benefits: ["Less damage to normal cells"],
    downsides: ["Resistance development"]
  },

  "bone-marrow-transplant": {
    name: "Bone Marrow Transplant",
    heroTitle: "Bone Marrow Transplant at ICTC",
    description: [
      "Replaces damaged bone marrow with healthy stem cells."
    ],
    subtypes: ["Autologous", "Allogeneic"],
    benefits: ["Restores blood cell production"],
    downsides: ["Risk of infection"]
  },

  "car-t-therapy": {
    name: "CAR–T Cellular Therapy",
    heroTitle: "CAR–T Cellular Therapy at ICTC",
    description: [
      "Genetically modifies T-cells to attack cancer."
    ],
    subtypes: ["CAR-T cell infusion"],
    benefits: ["Highly personalized treatment"],
    downsides: ["Cytokine release syndrome"]
  }
};

export default serviceData;
