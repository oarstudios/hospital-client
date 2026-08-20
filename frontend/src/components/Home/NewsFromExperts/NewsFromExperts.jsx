import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchBlogs } from "../../../redux/blogs/blogsSlice";
import imgSrc from "../../Common/ImgSrc";
import { encryptId } from "../../Common/Idcrypto";
import { displayPostType, isNewsPost, sortByDateDesc } from "../../Common/postType";
import { blogAlt } from "../../../seo/pageSeo";
import "./NewsFromExperts.css";

const NewsFromExperts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("blogs");

  const { list = [], loading } = useSelector((state) => state.blogs || {});

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const items = useMemo(() => {
    const all = Array.isArray(list) ? list : [];
    const filtered =
      activeTab === "news"
        ? all.filter(isNewsPost)
        : all.filter((item) => !isNewsPost(item));
    return sortByDateDesc(filtered).slice(0, 4);
  }, [list, activeTab]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleItemClick = (item) => {
    navigate(`/blog/${encryptId(item.id)}/${item.slug}`);
  };

  const emptyLabel = activeTab === "news" ? "news" : "blogs";

  return (
    <section className="news-section">
      <h2 className="news-heading">
        News & Information From Our Experts
      </h2>

      <p className="news-subtitle">
        Get the latest news, important information and updates from ICTC
        experts.
      </p>

      <div className="news-tabs">
        <button
          className={`tab-btn${activeTab === "blogs" ? " active" : ""}`}
          onClick={() => setActiveTab("blogs")}
        >
          From Our Blogs
        </button>
        <button
          className={`tab-btn${activeTab === "news" ? " active" : ""}`}
          onClick={() => setActiveTab("news")}
        >
          News
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#666" }}>
          Loading {emptyLabel}...
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="news-grid">
          {items.map((item) => (
            <div className="news-card" key={item.id}>
              <div className="news-img-wrapper">
                {item.image && (
                  <img src={imgSrc(item.image)} alt={blogAlt(item)} />
                )}

                <div className="news-badges">
                  {item.date && (
                    <span className="badge">{formatDate(item.date)}</span>
                  )}
                  <span className="badgeType">{displayPostType(item)}</span>
                </div>
              </div>

              <h3 className="news-title">{item.title}</h3>

              <button
                className="read-more"
                onClick={() => handleItemClick(item)}
              >
                Read More <span>→</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
          No {emptyLabel} available yet.
        </div>
      )}

      {items.length > 0 && (
        <button
          className="view-all"
          onClick={() => navigate(activeTab === "news" ? "/news" : "/blog")}
        >
          View All <span>→</span>
        </button>
      )}
    </section>
  );
};

export default NewsFromExperts;
