/* ================= CHEMOTHERAPY ================= */
import chemoHero from "../assets/Chemotherapy.webp";
import chemo1 from "../assets/service1.png";
import chemo2 from "../assets/service2.png";

/* ================= IMMUNOTHERAPY ================= */
import immunoHero from "../assets/Immunotherapy.webp";
import immuno1 from "../assets/service1.png";
import immuno2 from "../assets/service2.png";

/* ================= CANCER SURGERY ================= */
import surgeryHero from "../assets/Cancer Surgery.webp";
import surgery1 from "../assets/service1.png";
import surgery2 from "../assets/service2.png";

/* ================= RADIATION THERAPY ================= */
import radiationHero from "../assets/Radiation Therapy.webp";
import radiation1 from "../assets/service1.png";
import radiation2 from "../assets/service2.png";

/* ================= TARGETED THERAPY ================= */
import targetedHero from "../assets/Targeted Therapy.webp";
import targeted1 from "../assets/service1.png";
import targeted2 from "../assets/service2.png";

/* ================= BONE MARROW TRANSPLANT ================= */
import bmtHero from "../assets/Bone Marrow Transplant.webp";
import bmt1 from "../assets/service1.png";
import bmt2 from "../assets/service2.png";

/* ================= CAR-T THERAPY ================= */
import cartHero from "../assets/CART Cell Therapy.webp";
import cart1 from "../assets/service1.png";
import cart2 from "../assets/service2.png";



const serviceData = {
"chemotherapy": {
  name: "Chemotherapy",
  heroTitle: "Chemotherapy At ICTC",

    heroImage: chemoHero,

      contentImages: [chemo1, chemo2],

  introduction:
    "Chemotherapy is a cancer treatment that employs powerful drugs to eradicate cancer cells. It works by preventing cancer cells from multiplying, dividing, and generating new cells. Chemotherapy may also be referred to as conventional chemotherapy or cytotoxic chemotherapy.",

  overview: [
    "Chemotherapy has a body-wide effect, meaning it circulates throughout the body via the bloodstream.",
    "It targets rapidly dividing cells, which is a key characteristic of cancer cells.",
    "Cancer cells progress through the cell cycle faster than normal cells, making them more susceptible to chemotherapy drugs.",
    "Chemotherapy drugs are strong chemicals designed to destroy malignant cells at specific stages of the cell cycle.",
    "Many types of cancer can be treated using chemotherapy, either alone or in combination with surgery and radiation therapy."
  ],

  subtypesOfTherapy: {
    AdjuvantTherapy: [
      "Chemotherapy is used after surgery or radiation therapy to eliminate remaining cancer cells."
    ],
    CurativeTherapy: [
      "Chemotherapy is used to completely eradicate cancer and prevent recurrence.",
      "It may be combined with surgery and/or radiation therapy."
    ],
    NeoadjuvantTherapy: [
      "Chemotherapy is given before surgery or radiation therapy to shrink tumors."
    ],
    PalliativeTherapy: [
      "Chemotherapy cannot cure cancer in this setting but helps shrink tumors and relieve symptoms."
    ]
  },

  cancersTreated: {
    PrimaryCancer: [
      "Cancer that has not spread to other parts of the body."
    ],
    MetastasizedCancer: [
      "Cancer that has spread to other organs or body parts."
    ],
    AdditionalNotes: [
      "Response to chemotherapy depends on cancer type, stage, and individual patient factors."
    ]
  },

  benefits: [
    "Chemotherapy can reduce tumor size or stop cancer growth.",
    "It can extend survival and improve quality of life.",
    "Chemotherapy may shrink tumors enough to make surgical removal possible.",
    "After surgery, chemotherapy can reduce the risk of cancer recurrence."
  ],

  downsides: [
    "Chemotherapy can cause both short-term and long-term side effects.",
    "Frequent hospital visits for treatment, tests, and follow-ups may be tiring.",
    "Chemotherapy affects each individual differently.",
    "Some cancers may not respond effectively to chemotherapy."
  ],

  methodsOfAdministration: {
    IntravenousInfusion: [
      "Most commonly administered through a vein using an IV line.",
      "A tube with a needle may be placed in a vein in the arm or chest."
    ],
    OralChemotherapy: [
      "Some chemotherapy drugs are available as tablets or capsules."
    ],
    Injections: [
      "Chemotherapy can be given as injections similar to a shot."
    ],
    TopicalChemotherapy: [
      "Creams or gels containing chemotherapy drugs are used for certain skin cancers."
    ],
    RegionalChemotherapy: [
      "Chemotherapy drugs can be delivered directly to a specific body part.",
      "This includes intraperitoneal (abdomen), intrapleural (chest cavity), and intrathecal (central nervous system) chemotherapy."
    ],
    DirectTumorAdministration: [
      "Chemotherapy may be administered directly to the tumor or surgical site."
    ]
  },

  sideEffects: {
    CommonSideEffects: [
      "Hair Loss",
      "Loss Of Appetite",
      "Nausea And Vomiting",
      "Fatigue",
      "Constipation Or Diarrhea"
    ],
    SeriousSideEffects: [
      "Excessive Bleeding",
      "Breathing Issues",
      "Mouth Sores",
      "Hypersensitivity Reactions",
      "Weak Immune System"
    ],
    AdditionalNotes: [
      "Side effects vary depending on the drug or drug combination used."
    ]
  },

  chemotherapyDrugs: {
    Overview: [
      "More than 100 chemotherapy drugs are used in cancer treatment.",
      "All chemotherapy drugs cause cell death but act at different stages of the cell cycle.",
      "Combining multiple drugs can improve treatment effectiveness."
    ],
    DrugCategories: [
      "Alkylating Agents",
      "Antimetabolites",
      "Anti-Tumor Antibiotics",
      "Topoisomerase Inhibitors",
      "Mitotic Inhibitors",
      "Plant Alkaloids"
    ]
  },

  precautions: [
    "Avoid contact with bodily fluids after therapy.",
    "Do not exceed physical limits during treatment.",
    "Take measures to prevent infections.",
    "Use a separate toilet or sit while using the toilet to prevent splashing.",
    "Wash clothes, bedding, and fabrics separately using a washing machine and detergent.",
    "Wash hands thoroughly with warm water and soap, then dry with paper towels."
  ],

  postTreatmentCare: [
    "Follow-up care is essential after chemotherapy.",
    "Regular physical examinations and diagnostic tests help detect late or new side effects.",
    "Your medical team will monitor long-term recovery and overall health."
  ],

  dosAndDonts: {
    Dos: [
      "Keep Yourself Hydrated",
      "Maintain Proper Hygiene",
      "Apply Sunscreen While Going Outside"
    ],
    Donts: [
      "Avoid Large Meals",
      "Avoid Contact With People Who Have Infections",
      "Avoid Eating Raw Or Undercooked Food"
    ]
  },

  faqs: [
    {
      question: "Can Chemotherapy Be Used To Treat Cancer?",
      answer:
        "Yes. Chemotherapy can completely cure certain types of cancer that are highly sensitive to it."
    },
    {
      question: "Does Receiving Chemotherapy Hurt?",
      answer:
        "Chemotherapy itself is usually not painful, but side effects may cause discomfort depending on the drugs used."
    },
    {
      question: "At What Stage Of Cancer Is Chemotherapy Given?",
      answer:
        "Chemotherapy can be used at any stage of cancer, depending on treatment goals such as cure, control, or symptom relief."
    }
  ]
},

"immunotherapy": {
  name: "Immunotherapy",
  heroTitle: "Immunotherapy At ICTC",

    heroImage: immunoHero,

  contentImages: [immuno1, immuno2],

  introduction:
    "Immunotherapy is a broad term used for a class of cancer treatments that activate the body’s immune system to fight cancer cells. While healthy cells naturally die off, cancer cells continue to grow uncontrollably. Immunotherapy helps the immune system recognize and destroy these abnormal cells.",

  overview: [
    "Cancer cells often escape immune detection by mutating or altering their structure.",
    "The immune system normally protects the body from infections and disease but may fail to recognize cancer cells.",
    "Immunotherapy drugs are designed to alert the immune system to the presence of cancer cells.",
    "Once activated, the immune system can identify and destroy these altered cells.",
    "Immunotherapy can be used alone or combined with treatments such as chemotherapy."
  ],

  subtypesOfTherapy: {
    CheckpointInhibitors: [
      "Checkpoint proteins control signals that tell T-cells when to turn on and off.",
      "T-cells attack cancer cells when activated and switch off to protect healthy cells.",
      "Checkpoint inhibitors remove these brakes, allowing T-cells to eliminate malignant cells."
    ],
    AdoptiveCellTherapy: [
      "Also known as T-cell transfer therapy.",
      "Patient’s T-cells are modified to become more effective cancer-fighting cells.",
      "CAR T-cell therapy is a specialized form of adoptive cell therapy."
    ],
    CancerVaccines: [
      "Vaccines help protect the body against infections.",
      "The same concept is used to help the immune system target certain cancers such as prostate cancer."
    ],
    ImmuneSystemModulators: [
      "Also called biologic response modifiers.",
      "These drugs adjust immune responses to help destroy specific cancer cells."
    ]
  },

  benefits: [
    "Immunotherapy is increasingly becoming an important treatment option for certain cancers.",
    "It uses the body’s natural ability to fight cancer.",
    "It may be more effective and less harmful compared to chemotherapy or surgery for selected cancers.",
    "Immunotherapy can provide long-term cancer control in some patients."
  ],

  downsides: [
    "It may take several treatment cycles before a response is seen.",
    "Side effects may sometimes be serious due to immune activation against normal cells.",
    "Not all patients respond to immunotherapy."
  ],

  methodsOfAdministration: {
    Intravenous: [
      "Immunotherapy is delivered directly into a vein."
    ],
    Oral: [
      "Immunotherapy drugs may be taken as pills or capsules."
    ],
    Topical: [
      "Immunotherapy creams or ointments are applied directly to the skin.",
      "Used mainly for early-stage skin cancers."
    ],
    Intravesical: [
      "Immunotherapy is infused directly into the bladder."
    ]
  },

  sideEffects: {
    Overview: [
      "Immunotherapy can cause side effects due to immune activation against normal body cells.",
      "Supportive care services are provided during treatment to manage side effects and improve quality of life."
    ],
    CommonSideEffects: [
      "Fatigue",
      "Vomiting Or Diarrhea",
      "Oral Sores",
      "Cough And Breathlessness",
      "Elevated Blood Pressure",
      "Fluid Accumulation, Especially In The Legs",
      "Cold Or Fever",
      "Headaches",
      "Itching Or Skin Rashes",
      "High Blood Sugar"
    ]
  },

  immunotherapyMedications: {
    Overview: [
      "Most current immunotherapy drugs target immune checkpoint receptors.",
      "PD-1 and CTLA-4 receptors are common targets.",
      "Development of newer immunotherapy drugs is ongoing."
    ],
    CommonDrugs: [
      "Ipilimumab (Yervoy)",
      "Pembrolizumab (Keytruda)",
      "Nivolumab (Opdivo)",
      "Atezolizumab (Tecentriq)"
    ]
  },

  postTreatmentCare: [
    "Follow-up care is essential after immunotherapy treatment.",
    "Doctors monitor long-term side effects and detect new symptoms early.",
    "Follow-up care may include physical examinations, blood tests, and imaging studies."
  ],

  dosAndDonts: {
    Dos: [
      "Rest Well",
      "Eat Wisely",
      "Stay Active As Advised",
      "Reduce Stress"
    ],
    Donts: [
      "Skip Large Meals",
      "Smoke Or Drink Alcohol"
    ]
  },

  faqs: [
    {
      question: "Can Cancer Be Cured By Immunotherapy?",
      answer:
        "Immunotherapy may not cure cancer, but it can control disease, slow cancer growth, and extend life."
    },
    {
      question: "What Advantages Does Immunotherapy Have?",
      answer:
        "Immunotherapy uses the body’s immune system to fight cancer and may provide longer-lasting responses with fewer long-term side effects."
    },
    {
      question: "What Are The Dangers Or Risks Of Immunotherapy?",
      answer:
        "Risks include immune-related side effects where the immune system may attack healthy organs, requiring close medical monitoring."
    }
  ]
},

"cancer-surgery": {
  name: "Cancer Surgery",
  heroTitle: "Cancer Surgery At ICTC",

  heroImage: surgeryHero,
contentImages: [surgery1, surgery2],


  introduction:
    "Cancer surgery is a treatment in which a surgeon removes cancerous tissue from the body. It is one of the oldest and most effective methods of treating cancer, especially when the disease is localized. Surgery may be used alone or in combination with chemotherapy, radiation therapy, targeted therapy, or immunotherapy depending on the type and stage of cancer.",

  overview: [
    "Cancer surgery aims to remove the tumor along with a margin of healthy tissue.",
    "It is most effective for cancers that have not spread extensively.",
    "Surgery can be used for diagnosis, treatment, staging, or symptom relief.",
    "Advances in surgical techniques have improved precision, safety, and recovery.",
    "A multidisciplinary cancer care team determines the role of surgery in treatment."
  ],

  typesOfSurgery: {
    CurativeSurgery: [
      "Performed to completely remove cancer from the body.",
      "Most effective when cancer is detected early."
    ],
    DiagnosticSurgery: [
      "Used to obtain tissue for biopsy and confirm cancer diagnosis."
    ],
    StagingSurgery: [
      "Helps determine the extent or spread of cancer.",
      "May involve checking lymph nodes or nearby organs."
    ],
    DebulkingSurgery: [
      "Removes as much of the tumor as possible when complete removal is not feasible.",
      "Often followed by chemotherapy or radiation therapy."
    ],
    PalliativeSurgery: [
      "Used to relieve symptoms such as pain, bleeding, or obstruction.",
      "Improves quality of life in advanced cancer."
    ],
    ReconstructiveSurgery: [
      "Restores appearance or function after cancer removal.",
      "Commonly used after breast, head and neck, or limb surgeries."
    ]
  },

  cancersTreated: [
    "Breast Cancer",
    "Lung Cancer",
    "Gastrointestinal Cancers",
    "Head And Neck Cancer",
    "Gynecological Cancers",
    "Urological Cancers",
    "Brain Tumors",
    "Bone And Soft Tissue Tumors"
  ],

  benefits: [
    "Can completely remove cancer in early stages.",
    "Provides accurate staging and diagnosis.",
    "Relieves symptoms caused by tumor pressure or obstruction.",
    "Can improve survival when combined with other therapies.",
    "Advances in minimally invasive surgery reduce recovery time."
  ],

  downsides: [
    "Not suitable for cancers that have widely spread.",
    "Carries risks associated with anesthesia and surgery.",
    "Recovery time may vary depending on surgery type.",
    "May require additional treatments after surgery."
  ],

  surgicalApproaches: {
    OpenSurgery: [
      "Traditional surgery involving a larger incision.",
      "Used when wide access is required."
    ],
    MinimallyInvasiveSurgery: [
      "Includes laparoscopic and thoracoscopic surgery.",
      "Uses smaller incisions with faster recovery."
    ],
    RoboticSurgery: [
      "Uses robotic-assisted systems for greater precision.",
      "Allows better visualization and control during surgery."
    ],
    EndoscopicSurgery: [
      "Uses flexible scopes inserted through natural openings.",
      "Commonly used in gastrointestinal and airway cancers."
    ]
  },

  preSurgeryPreparation: [
    "Detailed evaluation including blood tests and imaging studies.",
    "Assessment of fitness for anesthesia and surgery.",
    "Discussion of risks, benefits, and alternatives.",
    "Instructions regarding fasting and medications.",
    "Psychological counseling and patient education when required."
  ],

  sideEffectsAndRisks: {
    CommonRisks: [
      "Pain Or Discomfort At Surgical Site",
      "Bleeding",
      "Infection",
      "Delayed Wound Healing"
    ],
    OrganSpecificRisks: [
      "Changes In Organ Function Depending On Surgery Location",
      "Temporary Or Permanent Functional Limitations"
    ],
    AdditionalNotes: [
      "Most surgical risks are manageable with modern care and monitoring."
    ]
  },

  postSurgeryCare: [
    "Pain management and wound care.",
    "Early mobilization to prevent complications.",
    "Physiotherapy or rehabilitation as required.",
    "Nutritional support for recovery.",
    "Regular follow-up to monitor healing and detect recurrence."
  ],

  dosAndDonts: {
    Dos: [
      "Follow Post-Operative Instructions Carefully",
      "Keep Surgical Wound Clean And Dry",
      "Attend All Follow-Up Appointments",
      "Maintain A Healthy Diet To Support Healing"
    ],
    Donts: [
      "Do Not Ignore Fever Or Signs Of Infection",
      "Avoid Heavy Lifting Without Medical Approval",
      "Do Not Resume Smoking Or Alcohol Early After Surgery",
      "Do Not Skip Recommended Rehabilitation"
    ]
  },

  faqs: [
    {
      question: "Can Surgery Cure Cancer?",
      answer:
        "Yes. Surgery can cure many cancers when detected early and completely removed."
    },
    {
      question: "Is Surgery Always Required For Cancer?",
      answer:
        "No. The need for surgery depends on cancer type, stage, and treatment goals."
    },
    {
      question: "Will I Need Chemotherapy Or Radiation After Surgery?",
      answer:
        "Some patients require additional treatment to reduce recurrence risk."
    },
    {
      question: "How Long Is Recovery After Cancer Surgery?",
      answer:
        "Recovery varies depending on surgery type and individual health, ranging from weeks to months."
    }
  ]
},

"radiation-therapy": {
  name: "Radiation Therapy",
  heroTitle: "Radiation Therapy At ICTC",

  heroImage: radiationHero,
contentImages: [radiation1, radiation2],


  introduction:
    "Radiation therapy is a cancer treatment that uses high-energy radiation to destroy cancer cells or slow their growth. It works by damaging the DNA of cancer cells, preventing them from multiplying and causing them to die over time. Radiation therapy is commonly used alone or in combination with surgery, chemotherapy, targeted therapy, or immunotherapy.",

  overview: [
    "Radiation therapy targets cancer cells in a specific area of the body.",
    "Unlike chemotherapy, radiation therapy is usually a localized treatment.",
    "It damages the genetic material of cancer cells, stopping them from dividing.",
    "Healthy cells in the treated area may also be affected but usually recover.",
    "Radiation therapy can be used for curative, adjuvant, neoadjuvant, or palliative purposes."
  ],

  subtypesOfTherapy: {
    ExternalBeamRadiation: [
      "Radiation is delivered from a machine outside the body.",
      "Most commonly used form of radiation therapy.",
      "Includes advanced techniques such as IMRT, IGRT, and VMAT."
    ],
    InternalRadiation: [
      "Also known as brachytherapy.",
      "Radiation sources are placed inside or near the tumor.",
      "Commonly used for cervical, prostate, and head and neck cancers."
    ],
    SystemicRadiation: [
      "Radiation is given through the bloodstream.",
      "Used for certain cancers such as thyroid cancer or bone metastases."
    ]
  },

  treatmentIntent: {
    CurativeTherapy: [
      "Used to completely eliminate cancer.",
      "Often combined with surgery or chemotherapy."
    ],
    AdjuvantTherapy: [
      "Used after surgery to destroy remaining cancer cells."
    ],
    NeoadjuvantTherapy: [
      "Used before surgery to shrink tumors."
    ],
    PalliativeTherapy: [
      "Used to relieve symptoms such as pain, bleeding, or obstruction.",
      "Improves quality of life in advanced cancer."
    ]
  },

  cancersTreated: [
    "Breast Cancer",
    "Head And Neck Cancer",
    "Lung Cancer",
    "Cervical Cancer",
    "Prostate Cancer",
    "Brain Tumors",
    "Gastrointestinal Cancers",
    "Bone Metastases And Soft Tissue Tumors"
  ],

  benefits: [
    "Effectively kills or controls cancer cells in a targeted area.",
    "Can preserve organs and avoid major surgery in some cases.",
    "Relieves pain and other symptoms caused by tumors.",
    "Can be safely combined with other cancer treatments.",
    "Non-invasive and usually painless during treatment."
  ],

  downsides: [
    "May cause side effects in nearby healthy tissues.",
    "Requires multiple hospital visits over several weeks.",
    "Side effects may appear gradually during treatment.",
    "Not suitable for all cancers or all stages."
  ],

  methodsOfAdministration: {
    ExternalRadiation: [
      "Delivered using linear accelerator machines.",
      "Each session lasts only a few minutes.",
      "Treatment is usually given five days a week over several weeks."
    ],
    Brachytherapy: [
      "Radiation sources placed temporarily or permanently inside the body.",
      "Allows high doses of radiation directly to the tumor with minimal exposure to nearby tissues."
    ],
    SystemicRadiation: [
      "Radioactive substances given orally or intravenously.",
      "Used in specific cancers such as thyroid cancer."
    ]
  },

  sideEffects: {
    CommonSideEffects: [
      "Fatigue",
      "Skin Redness Or Irritation In Treated Area",
      "Hair Loss In The Treated Area",
      "Loss Of Appetite",
      "Nausea"
    ],
    SiteSpecificSideEffects: [
      "Mouth Sores And Difficulty Swallowing (Head And Neck Radiation)",
      "Diarrhea Or Abdominal Cramps (Abdominal Radiation)",
      "Breathlessness Or Cough (Chest Radiation)",
      "Urinary Or Bowel Changes (Pelvic Radiation)"
    ],
    AdditionalNotes: [
      "Side effects depend on the treatment area and radiation dose.",
      "Most side effects are temporary and improve after treatment."
    ]
  },

  precautions: [
    "Follow skin care instructions provided by the radiation team.",
    "Avoid applying creams or powders on the treated area without medical advice.",
    "Protect treated skin from sun exposure.",
    "Maintain good nutrition and hydration.",
    "Inform the care team about any discomfort or new symptoms."
  ],

  postTreatmentCare: [
    "Regular follow-up visits to monitor recovery and response.",
    "Skin and tissue healing may continue for weeks after treatment.",
    "Long-term monitoring for late side effects is important.",
    "Rehabilitation and supportive care may be advised based on treatment area."
  ],

  dosAndDonts: {
    Dos: [
      "Get Adequate Rest",
      "Eat A Balanced And Nutritious Diet",
      "Drink Plenty Of Fluids",
      "Attend All Scheduled Radiation Sessions"
    ],
    Donts: [
      "Do Not Skip Treatment Sessions Without Informing Your Doctor",
      "Avoid Scratching Or Rubbing Treated Skin",
      "Avoid Smoking And Alcohol During Treatment",
      "Do Not Use Unapproved Skin Products On Treated Areas"
    ]
  },

  faqs: [
    {
      question: "Is Radiation Therapy Painful?",
      answer:
        "No. Radiation therapy itself is painless, similar to getting an X-ray, though side effects may develop over time."
    },
    {
      question: "How Long Does Radiation Treatment Take?",
      answer:
        "Each session usually lasts a few minutes, but the full course may take several weeks depending on the treatment plan."
    },
    {
      question: "Can Radiation Therapy Cure Cancer?",
      answer:
        "Yes. Radiation therapy can cure certain cancers, especially when detected early or combined with other treatments."
    },
    {
      question: "Will I Become Radioactive After Treatment?",
      answer:
        "External beam radiation does not make you radioactive. Some internal treatments may require temporary precautions."
    }
  ]
},

"targeted-therapy": {
  name: "Targeted Therapy",
  heroTitle: "Targeted Therapy At ICTC",

  heroImage: targetedHero,
contentImages: [targeted1, targeted2],


  introduction:
    "Targeted therapy is a form of cancer treatment that identifies and attacks specific cancer cell types while minimizing damage to normal cells. It focuses on particular proteins or genetic changes that control cancer cell growth, division, and spread. Targeted therapy may be used alone or in combination with surgery, radiation therapy, chemotherapy, or immunotherapy.",

  overview: [
    "Targeted therapy is based on the principles of precision medicine.",
    "It targets specific DNA mutations or proteins that drive cancer growth.",
    "Unlike chemotherapy, targeted therapy is designed to affect cancer cells more selectively.",
    "As knowledge about cancer genetics advances, newer targeted treatments continue to be developed.",
    "Understanding how targeted therapy works helps patients prepare for treatment and make informed decisions."
  ],

  subtypesOfTherapy: {
    MonoclonalAntibodies: [
      "Monoclonal antibodies are laboratory-made proteins that attach to specific targets on cancer cells.",
      "They can block cancer cell signals, mark cancer cells for immune destruction, or deliver drugs directly to cancer cells.",
      "Some monoclonal antibodies also function as immunotherapies."
    ],
    SmallMoleculeDrugs: [
      "Small-molecule drugs enter cancer cells and interfere with internal signaling pathways.",
      "They block growth, division, and survival of cancer cells.",
      "Angiogenesis inhibitors are a subtype that prevent new blood vessel formation.",
      "By cutting off blood supply, these drugs limit tumor growth."
    ]
  },

  cancersTreated: {
    Overview: [
      "Targeted therapy is used for many cancers with known genetic or protein alterations.",
      "Ongoing clinical trials continue to expand its applications."
    ],
    Examples: [
      "Breast Cancer – HER2-positive tumors respond well to targeted therapies",
      "Chronic Myeloid Leukemia – Caused by the BCR-ABL gene mutation",
      "Non-Small Cell Lung Cancer",
      "Colorectal Cancer",
      "Kidney Cancer",
      "Hepatocellular Cancer",
      "Uterine Cancer",
      "Thyroid Cancer"
    ]
  },

  benefits: [
    "Helps the immune system eliminate cancer cells.",
    "Blocks signals that cause uncontrolled cancer cell growth.",
    "Prevents formation of blood vessels that supply tumors.",
    "Delivers cancer-killing agents directly to cancer cells.",
    "Often causes fewer side effects than conventional chemotherapy."
  ],

  downsides: [
    "Cancer cells may develop resistance over time.",
    "Resistance can occur if the target protein changes or cancer cells find alternative growth pathways.",
    "Targeted therapy is often more effective when combined with other treatments.",
    "Drug development can be challenging due to complex cellular targets."
  ],

  methodsOfAdministration: {
    IntravenousInfusion: [
      "Targeted therapy drugs may be administered through IV infusion.",
      "Infusions may last from a few minutes to several hours.",
      "An IV pump is commonly used to control the drug flow."
    ],
    OralTherapy: [
      "Targeted therapy may be taken as tablets, capsules, or liquid.",
      "Oral therapy is usually taken at home.",
      "Strict adherence to dosage instructions is essential for effectiveness."
    ]
  },

  sideEffects: {
    CommonSideEffects: [
      "Skin Rashes Or Flaky Skin",
      "Sensitive Skin Patches",
      "Inflamed Or Damaged Fingernails And Cuticles",
      "Diarrhea Or Gastrointestinal Problems",
      "Delayed Wound Healing",
      "Blood Clotting Issues",
      "Elevated Blood Pressure"
    ],
    AdditionalNotes: [
      "Side effects vary depending on the drug and target protein."
    ]
  },

  targetedTherapyMedications: {
    Overview: [
      "Targeted therapy includes monoclonal antibodies and small-molecule inhibitors.",
      "Many newer drugs are under development."
    ],
    Examples: [
      "Trastuzumab",
      "Rituximab",
      "Sunitinib",
      "Axitinib",
      "Lenvatinib",
      "Cabozantinib",
      "Enfortumab Vedotin",
      "Erdafitinib",
      "Sacituzumab Govitecan"
    ]
  },

  postTreatmentCare: [
    "Follow-up care is essential after targeted therapy.",
    "Doctors monitor long-term side effects and treatment response.",
    "Care may include physical exams, blood tests, and imaging studies."
  ],

  dosAndDonts: {
    Dos: [
      "Maintain Proper Hydration",
      "Practice Good Hygiene",
      "Use Sunscreen When Going Outdoors"
    ],
    Donts: [
      "Do Not Skip Meals",
      "Avoid Contact With Sick Or Infected Individuals",
      "Avoid Large Gatherings"
    ]
  },

  faqs: [
    {
      question: "How Does Individualized Treatment Impact Me?",
      answer:
        "Each patient responds differently to targeted therapy based on cancer type, stage, specific drug used, and dosage."
    },
    {
      question: "How Will I Know If Targeted Therapy Is Effective?",
      answer:
        "Effectiveness is monitored through scans, blood tests, symptom improvement, and regular medical evaluations."
    }
  ]
},

"bone-marrow-transplant": {
  name: "Bone Marrow Transplant",
  heroTitle: "Bone Marrow Transplant At ICTC",

  heroImage: bmtHero,
contentImages: [bmt1, bmt2],


  introduction:
    "Bone marrow transplant, also known as stem cell transplant, is a specialized cancer treatment used to replace damaged or diseased bone marrow with healthy stem cells. It is most commonly used in blood cancers and certain immune or genetic disorders. The procedure allows patients to receive high-dose chemotherapy or radiation to destroy cancer cells, followed by restoration of healthy blood-forming cells.",

  overview: [
    "Bone marrow is the soft tissue inside bones responsible for producing blood cells.",
    "Blood cancers and some treatments damage bone marrow’s ability to function normally.",
    "Bone marrow transplant replaces unhealthy marrow with healthy stem cells.",
    "The transplanted stem cells grow and restore normal blood and immune function.",
    "This treatment requires highly specialized care and close monitoring."
  ],

  typesOfTransplant: {
    AutologousTransplant: [
      "Uses the patient’s own stem cells.",
      "Stem cells are collected before high-dose chemotherapy.",
      "Lower risk of immune rejection.",
      "Commonly used for multiple myeloma and some lymphomas."
    ],
    AllogeneicTransplant: [
      "Uses stem cells from a matched donor.",
      "Donor may be a sibling, family member, or unrelated matched donor.",
      "Provides a graft-versus-cancer effect where donor cells attack cancer cells.",
      "Higher risk of immune-related complications."
    ],
    SyngeneicTransplant: [
      "Uses stem cells from an identical twin.",
      "Very rare and has minimal risk of rejection."
    ],
    HaploidenticalTransplant: [
      "Uses a partially matched family donor.",
      "Expands transplant options when full match is unavailable."
    ]
  },

  conditionsTreated: [
    "Leukemia",
    "Lymphoma",
    "Multiple Myeloma",
    "Myelodysplastic Syndromes",
    "Aplastic Anemia",
    "Certain Genetic And Immune Disorders"
  ],

  benefits: [
    "Allows use of high-dose chemotherapy or radiation to destroy cancer cells.",
    "Restores normal blood cell production.",
    "Offers potential cure for certain blood cancers.",
    "Provides long-term disease control in selected patients.",
    "Improves survival and quality of life for eligible patients."
  ],

  downsides: [
    "Complex procedure requiring prolonged hospital stay.",
    "Risk of infections due to weakened immunity.",
    "Possibility of graft-versus-host disease in donor transplants.",
    "Recovery may take months to years.",
    "Not suitable for all patients due to age or health conditions."
  ],

  transplantProcess: {
    PreTransplantEvaluation: [
      "Detailed medical evaluation and testing.",
      "Donor matching for allogeneic transplant.",
      "Patient counseling and consent.",
      "Central line placement for treatment delivery."
    ],
    ConditioningTherapy: [
      "High-dose chemotherapy with or without radiation therapy.",
      "Destroys cancer cells and existing bone marrow.",
      "Suppresses immune system to allow stem cell engraftment."
    ],
    StemCellInfusion: [
      "Healthy stem cells are infused through a vein.",
      "Procedure is similar to a blood transfusion.",
      "Stem cells travel to bone marrow and begin producing blood cells."
    ],
    EngraftmentAndRecovery: [
      "Stem cells start making new blood cells.",
      "Blood counts gradually recover over weeks.",
      "Close monitoring for complications is required."
    ]
  },

  sideEffectsAndRisks: {
    EarlyComplications: [
      "Infections",
      "Bleeding",
      "Nausea And Vomiting",
      "Mouth Sores",
      "Fatigue"
    ],
    LateComplications: [
      "Graft-Versus-Host Disease",
      "Organ Damage",
      "Hormonal Changes",
      "Fertility Issues",
      "Secondary Cancers"
    ],
    AdditionalNotes: [
      "Risks depend on transplant type and patient condition."
    ]
  },

  precautions: [
    "Strict infection control measures must be followed.",
    "Avoid crowded places and sick contacts.",
    "Follow dietary restrictions as advised.",
    "Take all prescribed medications on time.",
    "Report fever or unusual symptoms immediately."
  ],

  postTransplantCare: [
    "Regular follow-up visits and blood tests.",
    "Monitoring for graft-versus-host disease.",
    "Vaccinations may be repeated after recovery.",
    "Nutritional and physical rehabilitation support.",
    "Long-term monitoring for late effects."
  ],

  dosAndDonts: {
    Dos: [
      "Maintain Strict Personal Hygiene",
      "Follow Infection Prevention Guidelines",
      "Eat A Balanced And Safe Diet",
      "Attend All Follow-Up Appointments"
    ],
    Donts: [
      "Do Not Miss Medications Or Appointments",
      "Avoid Raw Or Undercooked Foods",
      "Avoid Crowded Places Initially",
      "Do Not Ignore Fever Or Infections"
    ]
  },

  faqs: [
    {
      question: "Is Bone Marrow Transplant A Cure?",
      answer:
        "Bone marrow transplant can cure or provide long-term control for certain blood cancers and disorders."
    },
    {
      question: "Is The Procedure Painful?",
      answer:
        "The stem cell infusion itself is painless, but side effects may occur during recovery."
    },
    {
      question: "How Long Does Recovery Take?",
      answer:
        "Initial recovery takes a few weeks, but full recovery may take several months or longer."
    },
    {
      question: "Can Everyone Undergo Bone Marrow Transplant?",
      answer:
        "Not all patients are eligible; suitability depends on age, health, and disease status."
    }
  ]
},

"car-t-therapy": {
  name: "CAR-T Cell Therapy",
  heroTitle: "CAR-T Cell Therapy At ICTC",

  heroImage: cartHero,
contentImages: [cart1, cart2],


  introduction:
    "CAR-T cell therapy, or Chimeric Antigen Receptor T-cell therapy, is an advanced form of immunotherapy that uses a patient’s own immune cells to fight cancer. In this treatment, T-cells are genetically modified in a laboratory to better recognize and destroy cancer cells, then infused back into the patient. CAR-T therapy has shown remarkable success in certain blood cancers.",

  overview: [
    "CAR-T therapy is a personalized and highly targeted cancer treatment.",
    "It involves collecting a patient’s T-cells, modifying them, and reinfusing them.",
    "The modified T-cells are trained to recognize specific proteins on cancer cells.",
    "Once infused, CAR-T cells multiply in the body and attack cancer cells.",
    "This therapy is mainly used for relapsed or treatment-resistant blood cancers."
  ],

  howCarTWorks: [
    "T-cells are collected from the patient through a procedure called leukapheresis.",
    "In the laboratory, T-cells are genetically engineered to express chimeric antigen receptors.",
    "These receptors allow T-cells to recognize cancer-specific antigens.",
    "The modified cells are multiplied and then infused back into the patient.",
    "CAR-T cells seek out and destroy cancer cells in the body."
  ],

  cancersTreated: [
    "Acute Lymphoblastic Leukemia (ALL)",
    "Diffuse Large B-Cell Lymphoma (DLBCL)",
    "Other Aggressive B-Cell Lymphomas",
    "Multiple Myeloma (Selected Cases)"
  ],

  benefits: [
    "Highly targeted treatment that spares most normal cells.",
    "Uses the patient’s own immune system to fight cancer.",
    "Can be effective when other treatments have failed.",
    "May provide long-lasting remission in some patients.",
    "Single infusion may lead to prolonged cancer control."
  ],

  downsides: [
    "Available only at specialized cancer centers.",
    "May cause serious immune-related side effects.",
    "Requires hospitalization and close monitoring.",
    "Not suitable for all patients or cancer types.",
    "Treatment preparation may take several weeks."
  ],

  treatmentProcess: {
    CellCollection: [
      "T-cells are collected from the patient’s blood.",
      "Procedure is similar to blood donation."
    ],
    CellEngineering: [
      "T-cells are modified in a laboratory to express CAR receptors.",
      "This process takes several weeks."
    ],
    ConditioningTherapy: [
      "Low-dose chemotherapy is given before infusion.",
      "Helps prepare the body to receive CAR-T cells."
    ],
    CARInfusion: [
      "CAR-T cells are infused through a vein.",
      "Infusion is usually completed in one session."
    ],
    MonitoringAndRecovery: [
      "Patients are closely monitored for side effects.",
      "Hospital stay may be required for early detection of complications."
    ]
  },

  sideEffectsAndRisks: {
    CommonSideEffects: [
      "Fever",
      "Fatigue",
      "Low Blood Pressure",
      "Nausea",
      "Loss Of Appetite"
    ],
    SeriousSideEffects: [
      "Cytokine Release Syndrome (CRS)",
      "Neurological Symptoms Such As Confusion Or Seizures",
      "Severe Infections Due To Low Immunity"
    ],
    AdditionalNotes: [
      "Most side effects are manageable with early medical intervention."
    ]
  },

  precautions: [
    "Patients must remain under close medical supervision after infusion.",
    "Report fever or neurological symptoms immediately.",
    "Avoid driving or operating machinery during early recovery.",
    "Follow infection prevention guidelines strictly."
  ],

  postTreatmentCare: [
    "Regular follow-up visits and blood tests.",
    "Monitoring for delayed side effects.",
    "Vaccination schedule may be repeated after immune recovery.",
    "Psychological and rehabilitation support when required."
  ],

  dosAndDonts: {
    Dos: [
      "Attend All Follow-Up Appointments",
      "Maintain Strict Hygiene",
      "Stay Hydrated And Eat Nutritious Food",
      "Report Symptoms Early"
    ],
    Donts: [
      "Do Not Ignore Fever Or Confusion",
      "Avoid Crowded Places Initially",
      "Do Not Skip Prescribed Medications",
      "Avoid Alcohol During Recovery"
    ]
  },

  faqs: [
    {
      question: "Is CAR-T Therapy A Cure?",
      answer:
        "CAR-T therapy can lead to long-term remission and potential cure in some patients with specific blood cancers."
    },
    {
      question: "Is CAR-T Therapy Painful?",
      answer:
        "The infusion itself is painless, but side effects may occur during the recovery phase."
    },
    {
      question: "How Long Does CAR-T Therapy Take?",
      answer:
        "The preparation phase may take several weeks, while the infusion is usually completed in one day."
    },
    {
      question: "Who Is Eligible For CAR-T Therapy?",
      answer:
        "Eligibility depends on cancer type, prior treatments, overall health, and specialist evaluation."
    }
  ]
},

};

export default serviceData;
