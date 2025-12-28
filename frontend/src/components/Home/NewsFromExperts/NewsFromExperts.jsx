import "./NewsFromExperts.css";
import { useNavigate } from "react-router-dom";
import blogData from "../../../data/blogData";

const NewsFromExperts = () => {
  const navigate = useNavigate();

  const blogs = Object.values(blogData).slice(0, 4);

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

      {/* TOGGLE BUTTONS (UI ONLY) */}
      <div className="news-tabs">
        <button className="tab-btn active">From Our Blogs</button>
        <button className="tab-btn">Newsletter</button>
      </div>

      {/* BLOG CARDS */}
      <div className="news-grid">
        {blogs.map((item) => (
          <div className="news-card" key={item.slug}>
            <div className="news-img-wrapper">
              <img src={item.image} alt={item.title} />

              <div className="news-badges">
                <span className="badge">{item.date}</span>
                <span className="badgeType">{item.type}</span>
              </div>
            </div>

            <h3 className="news-title">{item.title}</h3>

            <button
              className="read-more"
              onClick={() => navigate(`/blog/${item.slug}`)}
            >
              Read More <span>→</span>
            </button>
          </div>
        ))}
      </div>

      {/* VIEW ALL */}
      <button
        className="view-all"
        onClick={() => navigate("/blog")}
      >
        View All <span>→</span>
      </button>
    </section>
  );
};

export default NewsFromExperts;
