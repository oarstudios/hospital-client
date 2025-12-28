import blogImage1 from "../assets/blog.png";
import inlineImg from "../assets/inline.png";

const blogData = {
  "hodgkins-lymphoma-explained": {
    slug: "hodgkins-lymphoma-explained",
    title:
      "Hodgkin’s Lymphoma Explained – All You Need to Know with Hematologist Dr Kunal Goyal | ICTC",
    image: blogImage1,
    type: "Blog",
    date: "28/10/2025",
    category: "Cancer Types",
    author: "Dr. Kunal Goyal",

    tags: ["Blood Cancer", "Hodgkin’s Lymphoma"],

    content: [
      {
        type: "paragraph",
        text:
          "Hodgkin’s lymphoma is a type of blood cancer that affects the lymphatic system. Early diagnosis and modern treatment options have significantly improved survival rates."
      },
      {
        type: "heading",
        text: "What is Hodgkin’s Lymphoma?"
      },
      {
        type: "paragraph",
        text:
          "It is a cancer of the lymphocytes, a type of white blood cell that helps fight infection."
      },
      {
        type: "list",
        items: [
          "Painless swelling of lymph nodes",
          "Persistent fatigue",
          "Unexplained weight loss",
          "Night sweats"
        ]
      },
      {
        type: "image",
        src: inlineImg
      },
      {
        type: "heading",
        text: "Treatment Options at ICTC"
      },
      {
        type: "paragraph",
        text:
          "ICTC offers chemotherapy, immunotherapy, and advanced hematological care for Hodgkin’s lymphoma patients."
      }
    ]
  },

  "ictc-oncology-weekly-roundup": {
    slug: "ictc-oncology-weekly-roundup",
    title: "ICTC Oncology Weekly Roundup",
    image: blogImage1,
    type: "Blog",
    date: "28/10/2025",
    category: "ICTC Cares",
    author: "ICTC Editorial Team",
    tags: ["ICTC", "Oncology News"],

    content: [
      {
        type: "paragraph",
        text:
          "This week at ICTC, our oncology experts discussed the latest advancements in cancer treatment and patient care."
      }
    ]
  },

  "yoga-session-ictc-ghatkopar": {
    slug: "yoga-session-ictc-ghatkopar",
    title:
      "Yoga session for patients and family members at ICTC Ghatkopar",
    image: blogImage1,
    type: "Blog",
    date: "28/10/2025",
    category: "Wellness",
    author: "ICTC Wellness Team",
    tags: ["Wellness", "Yoga"],

    content: [
      {
        type: "paragraph",
        text:
          "Yoga helps cancer patients manage stress, fatigue, and improve overall well-being."
      }
    ]
  },

  "parenting-with-cancer": {
    slug: "parenting-with-cancer",
    title: "Parenting With Cancer: What Do We Tell the Kids?",
    image: blogImage1,
    type: "Blog",
    date: "28/10/2025",
    category: "Childhood Cancer",
    author: "Dr. Salil Patkar",
    tags: ["Childhood Cancer", "Parenting"],

    content: [
      {
        type: "paragraph",
        text:
          "Talking to children about cancer can be challenging. Honest and age-appropriate communication is key."
      }
    ]
  }
};

export default blogData;
