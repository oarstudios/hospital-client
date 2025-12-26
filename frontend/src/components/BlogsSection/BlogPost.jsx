import "./BlogPost.css";

import userIcon from "../../assets/solar_user-bold.png";
import shareIcon from "../../assets/ri_share-line.png";

import heroImg from "../../assets/hero.png";
import inlineImg from "../../assets/inline.png";
import doctorImg from "../../assets/High res images 1.png";
import ictcLogo from "../../assets/ICTC_Logo(long).png";

import blog1 from "../../assets/blog1.png";


const BlogPost = () => {
  return (
    <>
    <main className="ictc-blogpost-layout">


      {/* LEFT CONTENT */}
      <article className="ictc-blogpost-article">
        <div className="blg">
          <img
            src={heroImg}
            alt="Parenting With Cancer"
            className="ictc-blogpost-hero"
          />

          <div className="ictc-blg-padd">
            <div className="ictc-blogpost-meta-row">
              <div className="ictc-blogpost-meta-tags">
                <span className="tag blog">Blog</span>
                <span className="tag childhood-cancer">Childhood Cancer</span>
                <span className="date">28/10/2025</span>
              </div>
            </div>

            <h1 className="ictc-blogpost-title">
              Parenting With Cancer: What Do We Tell the Kids?
            </h1>

            <div className="ictc-bp-flex">
              <div className="ictc-blogpost-author">
                <img src={userIcon} alt="Author" />
                <span>by Dr. Salli Patkar</span>
              </div>
              <button className="ictc-blogpost-share-btn">
                <img src={shareIcon} alt="Share blog" />
                Share
              </button>
            </div>
          </div>
        </div>

        <section className="ictc-blogpost-body">
          <p>
            Winter can be challenging for cancer patients—cold weather, lower
            immunity, and treatment-related fatigue often make nutrition even
            more important.
          </p>

          <h2>Fresh Winter Veggies: Nature’s Cancer-Fighting Superfoods</h2>

          <h2>Spinach & Other Leafy Greens</h2>
          <p>
            Rich in iron, folate, and immune-boosting antioxidants. Leafy
            vegetables help improve haemoglobin levels—especially important for
            chemotherapy patients.
          </p>

          <ul>
            <li>
              🥕 Carrots{" "}
              <p>
                Loaded with beta-carotene, which supports cell repair and may
                help the body fight abnormal cell growth.
              </p>
            </li>
            <li>
              🟣 Beets{" "}
              <p>
                Packed with antioxidants and nitrates that improve blood
                flow—helpful for cancer fatigue and weakness.
              </p>
            </li>
            <li>
              🥦 Cauliflower{" "}
              <p>
                A winter vegetable rich in sulforaphane, a compound known for
                its cancer-fighting properties.
              </p>
            </li>
          </ul>

          <img
            src={inlineImg}
            alt="ICTC Breast Cancer Awareness Event"
            className="ictc-blogpost-inline-img"
          />

          <h2>Seasonal Fruits for Immunity & Healing</h2>
          <ul>
            <li>🍊 Oranges – Vitamin C powerhouse</li>
            <li>🟢 Amla – Boosts immunity</li>
            <li>🍎 Pomegranate – Supports digestion</li>
          </ul>

          <h2>How ICTC Supports Patients With Nutrition & Wellness</h2>
          <p>
            At the Indian Cancer Treatment Centre (ICTC), we understand that
            cancer care goes far beyond medicines and treatment
            protocols. Nutrition plays a powerful role in helping patients stay
            strong, maintain immunity, and cope better with chemotherapy or
            radiation—especially during the winter months when infections and
            fatigue are more common. ICTC’s team of oncologists, clinical
            nutritionists, and supportive care specialists guide patients on: ✔
            What to eat during treatment- Personalized diet plans using seasonal
            winter foods like soups, fruits, whole grains, and immunity-boosting
            herbs. ✔ Managing treatment side effects through diet- Tailored
            nutrition to help with: nausea low immunity digestive issues weight
            loss or weakness mouth sores dehydration ✔ Building a strong
            immunity routine- Patients receive easy home-based recommendations
            such as: turmeric and ginger teas high-protein soups fiber-rich warm
            winter meals Vitamin D guidance for winter months ✔ Holistic,
            patient-first cancer care- ICTC’s approach focuses on comprehensive
            cancer wellness, ensuring every patient receives emotional,
            nutritional, and clinical support under one roof. Winter can be
            difficult for cancer patients, but with expert dietary guidance and
            personalized care at ICTC, patients can stay nourished, warm, and
            strong throughout their treatment journey.
          </p>
        </section>
      </article>

      {/* RIGHT SIDEBAR */}
      <aside className="ictc-blogpost-sidebar">
        <h3 className="ictc-blogpost-sidebar-title">Similar Blogs</h3>

        <div className="ictc-blogpost-similar-card">
          <img src={blog1} alt="Yoga session" />
          <div className="ictc-blogpost-meta-tags">
            <span className="tag blog">Blog</span>
            <span className="date">28/10/2025</span>
            
          </div>
          <p className="ictc-blg-text">
              Yoga session for patients and family members at ICTC Ghatkopar
            </p>
        </div>

        <div className="ictc-blogpost-similar-card">
          <img src={blog1} alt="Yoga session" />
          <div className="ictc-blogpost-meta-tags">
            <span className="tag blog">Blog</span>
            <span className="date">28/10/2025</span>
            
          </div>
          <p className="ictc-blg-text">
              Yoga session for patients and family members at ICTC Ghatkopar
            </p>
        </div>

        <div className="ictc-blogpost-similar-card">
          <img src={blog1} alt="Yoga session" />
          <div className="ictc-blogpost-meta-tags">
            <span className="tag blog">Blog</span>
            <span className="date">28/10/2025</span>
            
          </div>
          <p className="ictc-blg-text">
              Yoga session for patients and family members at ICTC Ghatkopar
            </p>
        </div>

       

        {/* CTA */}
        <div className="ictc-blogpost-cta">
          <h3>Need Cancer Treatment or Guidance?</h3>
          <p>Book a Free Consultation or Second Opinion at</p>

          <img
            src={ictcLogo}
            alt="ICTC Logo"
            className="ictc-blogpost-cta-logo"
          />

          <h2>Mumbai’s Largest Cancer Care Chain</h2>

          <img
            src={doctorImg}
            alt="Doctor"
            className="ictc-blogpost-cta-doctor"
          />

          <button className="book-btn ictc-blogpost-cta-btn">Book a Consultation</button>
        </div>
      </aside>


      
    </main>
<section className="ictc-blogpost-tags-section">
  <h3 className="ictc-blogpost-tags-title">Tags</h3>

  <div className="ictc-blogpost-tags-list">
    <span>Childhood Cancer</span>
    <span>Childhood Cancer Treatment at ICTC Vashi</span>
    <span>Childhood Cancer Treatment at ICTC Panvel</span>
    <span>Childhood Cancer Treatment at ICTC Sion</span>
    <span>Childhood Cancer Treatment at ICTC Dadar</span>
  </div>
</section>
    </>
    
  );
};

export default BlogPost;
