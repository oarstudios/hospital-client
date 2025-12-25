import "./BlogsSection.css";
import blogImage1 from "../../assets/blog.png";



const blogCards = [
  {
    id: 1,
    title:
      "Hodgkin’s Lymphoma Explained – All You Need to Know with Hematologist Dr Kunal Goyal | ICTC",
    image: blogImage1,
    type: "Blog",
    date: "28/10/2025",
  },
  {
    id: 2,
    title: "ICTC Oncology Weekly Roundup",
    image: blogImage1,
    type: "Blog",
    date: "28/10/2025",
  },
  {
    id: 3,
    title: "Yoga session for patients and family members at ICTC Ghatkopar",
    image: blogImage1,
    type: "Blog",
    date: "28/10/2025",
  },
  {
    id: 4,
    title: "Parenting With Cancer: What Do We Tell the Kids?",
    image: blogImage1,
    type: "Blog",
    date: "28/10/2025",
  },
  {
    id: 5,
    title: "ICTC Oncology Weekly Roundup",
    image: blogImage1,
    type: "Blog",
    date: "28/10/2025",
  },
  {
    id: 6,
    title:
      "Hodgkin’s Lymphoma Explained – All You Need to Know with Hematologist Dr Kunal Goyal | ICTC",
    image: blogImage1,
    type: "Blog",
    date: "28/10/2025",
  },
];

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

const latestPosts = [
  { id: 1, title: "Debunking Mammography myths", type: "Blog" },
  {
    id: 2,
    title:
      "Pancreatic Cancer Awareness Month: Fight the Silence with ICTC Cancer Centre",
    type: "News",
  },
  {
    id: 3,
    title: "How Early Diagnosis of Blood Cancer Improves Survival",
    type: "News",
  },
  {
    id: 4,
    title:
      "Stay Warm, Stay Nourished: Best Winter Foods for Cancer Patients",
    type: "Blog",
  },
  { id: 5, title: "ICTC Oncology Weekly Roundup", type: "Blog" },
];

const BlogsSection = () => {
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
              {latestPosts.map((post) => (
                <li key={post.id}>
                  <span className="post-index">{post.id}</span>
                  <div className="pip">
                    <p>{post.title}</p>
                    <div className="tag-row">
                      <span className={`tag ${post.type.toLowerCase()}`}>
                        {post.type}
                      </span>
                      <span className="date">28/10/2025</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        {/* BLOG GRID */}
        <div className="blogs-grid">
          {blogCards.map((blog) => (
            <div className="blog-card" key={blog.id}>
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
