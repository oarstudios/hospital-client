import "./BlogsSection.css";
import { useNavigate } from "react-router-dom";
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

const BlogsSection = () => {
  const navigate = useNavigate();
  const blogs = Object.values(blogData);

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
          {blogs.map((blog) => (
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
      <div className="pagination">
        <button>←</button>
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>4</button>
        <button>→</button>
      </div>
    </section>
  );
};

export default BlogsSection;
