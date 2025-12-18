import "./NewsFromExperts.css";

/* Replace images later */
import blog1 from "../../assets/Rectangle 4.png";
import blog2 from "../../assets/Rectangle 4 (2).png";
const blogs = [
  {
    img: blog1,
    date: "28/10/2025",
    type: "Blog",
    title:
      "A Doctors’ Day Tribute to Our Oncologists and Cancer Specialists",
  },
  {
    img: blog2,
    date: "28/10/2025",
    type: "News",
    title:
      "A Doctors’ Day Tribute to Our Oncologists and Cancer Specialists",
  },
  {
    img: blog1,
    date: "28/10/2025",
    type: "Blog",
    title:
      "A Doctors’ Day Tribute to Our Oncologists and Cancer Specialists",
  },
  {
    img: blog2,
    date: "28/10/2025",
    type: "News",
    title:
      "A Doctors’ Day Tribute to Our Oncologists and Cancer Specialists",
  },
];


const NewsFromExperts = () => {
  return (
    <section className="news-section">
      {/* HEADER */}
      <h2 className="news-heading">
        News & Information From Our Experts
      </h2>

      <p className="news-subtitle">
        Get the latest news, important information and updates from ICTC
        experts.
      </p>

      {/* TOGGLE BUTTONS */}
      <div className="news-tabs">
        <button className="tab-btn active">From Our Blogs</button>
        <button className="tab-btn">Newsletter</button>
      </div>

      {/* BLOG CARDS */}
      <div className="news-grid">
        {blogs.map((item, index) => (
          <div className="news-card" key={index}>
            <div className="news-img-wrapper">
              <img src={item.img} alt={item.title} />

              <div className="news-badges">
                <span className="badge">{item.date}</span>
                <span className="badgeType">{item.type}</span>
              </div>
            </div>

            <h3 className="news-title">{item.title}</h3>

            <button className="read-more">
              Read More <span>→</span>
            </button>
          </div>
        ))}
      </div>

      {/* VIEW ALL */}
      <button className="view-all">
        View All <span>→</span>
      </button>
    </section>
  );
};

export default NewsFromExperts;
