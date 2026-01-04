import "./BlogPost.css";
import { useParams } from "react-router-dom";
import blogData from "../../data/blogData";

import userIcon from "../../assets/solar_user-bold.png";
import shareIcon from "../../assets/ri_share-line.png";
import ictcLogo from "../../assets/ICTC_Logo(long).png";
import doctorImg from "../../assets/High res images 1.png";

const BlogPost = () => {
  const { slug } = useParams();
  const blog = blogData[slug];

  if (!blog || !blog.content) return null;

  const similarBlogs = Object.values(blogData).filter(
    (b) => b.slug !== slug
  );

  /* ===================================== */
  /* 🔹 SHARE HANDLER (MOBILE + DESKTOP) */
  /* ===================================== */
  const handleShare = async () => {
    const shareUrl = window.location.href;

    try {
      /* ✅ MOBILE / MODERN BROWSERS */
      if (navigator.share) {
        await navigator.share({
          title: blog.title,
          text: blog.title,
          url: shareUrl,
        });
      } 
      /* ✅ DESKTOP FALLBACK */
      else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied! You can now share it anywhere.");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  return (
    <>
      <main className="ictc-blogpost-layout">
        {/* LEFT CONTENT */}
        <article className="ictc-blogpost-article">
          <div className="blg">
            <img
              src={blog.image}
              alt={blog.title}
              className="ictc-blogpost-hero"
            />

            <div className="ictc-blg-padd">
              <div className="ictc-blogpost-meta-row">
                <div className="ictc-blogpost-meta-tags">
                  <span className="tag blog">{blog.type}</span>

                  {blog.tags?.map((tag) => (
                    <span key={tag} className="tag childhood-cancer">
                      {tag}
                    </span>
                  ))}

                  <span className="date">{blog.date}</span>
                </div>
              </div>

              <h1 className="ictc-blogpost-title">{blog.title}</h1>

              <div className="ictc-bp-flex">
                <div className="ictc-blogpost-author">
                  <img src={userIcon} alt="Author" />
                  <span>by {blog.author}</span>
                </div>

                {/* ✅ WORKING SHARE BUTTON */}
                <button
                  className="ictc-blogpost-share-btn"
                  onClick={handleShare}
                >
                  <img src={shareIcon} alt="Share blog" />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* BODY */}
          <section className="ictc-blogpost-body">
            {blog.content.map((block, index) => {
              if (block.type === "paragraph")
                return <p key={index}>{block.text}</p>;

              if (block.type === "heading")
                return <h2 key={index}>{block.text}</h2>;

              if (block.type === "list")
                return (
                  <ul key={index}>
                    {block.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                );

              if (block.type === "image")
                return (
                  <img
                    key={index}
                    src={block.src}
                    alt=""
                    className="ictc-blogpost-inline-img"
                  />
                );

              return null;
            })}
          </section>
        </article>

        {/* RIGHT SIDEBAR */}
        <aside className="ictc-blogpost-sidebar">
          <h3 className="ictc-blogpost-sidebar-title">
            Similar Blogs
          </h3>

          {similarBlogs.slice(0, 3).map((item) => (
            <div
              className="ictc-blogpost-similar-card"
              key={item.slug}
            >
              <img src={item.image} alt={item.title} />

              <div className="ictc-blogpost-meta-tags">
                <span className="tag blog">{item.type}</span>
                <span className="date">{item.date}</span>
              </div>

              <p className="ictc-blg-text">{item.title}</p>
            </div>
          ))}

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

            <button className="book-btn ictc-blogpost-cta-btn">
              Book a Consultation
            </button>
          </div>
        </aside>
      </main>

      {/* TAGS */}
      <section className="ictc-blogpost-tags-section">
        <h3 className="ictc-blogpost-tags-title">Tags</h3>

        <div className="ictc-blogpost-tags-list">
          {blog.tags?.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </section>
    </>
  );
};

export default BlogPost;
