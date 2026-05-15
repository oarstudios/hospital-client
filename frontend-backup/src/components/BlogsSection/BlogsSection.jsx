import "./BlogsSection.css";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import blogData from "../../data/blogData";

const categories = [
  "Cancer Treatment",
  "Cancer Prevention & Detection",
  "Cancer Awareness",
  "Cost of Care",
  "Diet & Nutrition",
  "Cancer Types",
  "ICTC Cares",
  "Childhood Cancer",
];

const POSTS_PER_PAGE = 6;

const BlogsSection = () => {
  const navigate = useNavigate();

  /* ✅ SAFELY NORMALIZE + DEDUPLICATE BLOG DATA */
  const blogs = useMemo(() => {
    const map = new Map();
    Object.values(blogData).forEach((blog) => {
      if (!map.has(blog.slug)) {
        map.set(blog.slug, blog);
      }
    });
    return Array.from(map.values());
  }, []);

  /* 🔹 PAGINATION STATE */
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(blogs.length / POSTS_PER_PAGE);

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentBlogs = blogs.slice(startIndex, endIndex);

  /* 🔹 PAGE CHANGE HANDLER */
  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="blogs-wrapper">
      <h2 className="blogs-heading">ICTC Blogs</h2>

      <div className="blogs-layout">
        {/* LEFT SIDEBAR */}
        <aside className="blogs-sidebar">
          <div className="sidebar-card">
            <h3>Categories</h3>
            <ul>
              {categories.map((cat, i) => (
                <li key={i}>{cat}</li>
              ))}
            </ul>
          </div>

          <div className="sidebar-card">
            <h3>Latest Posts</h3>
            <ol>
              {blogs.slice(0, 5).map((post, index) => (
                <li
                  key={post.slug}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  <span className="post-index">{index + 1}</span>

                  <div className="pip">
                    <p>{post.title}</p>

                    <div className="tag-row">
                      <span className={`tag ${post.type.toLowerCase()}`}>
                        {post.type}
                      </span>
                      <span className="date">{post.date}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        {/* BLOG GRID */}
        <div className="blogs-grid">
          {currentBlogs.map((blog) => (
            <div
              className="blog-card"
              key={blog.slug}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/blog/${blog.slug}`)}
            >
              <img src={blog.image} alt={blog.title} />

              <div className="blog-card-body">
                <div className="tag-row">
                  <span className="tag blog">{blog.type}</span>
                  <span className="date">{blog.date}</span>
                </div>

                <h4>{blog.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ←
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                className={currentPage === page ? "active" : ""}
                onClick={() => changePage(page)}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      )}
    </section>
  );
};

export default BlogsSection;
