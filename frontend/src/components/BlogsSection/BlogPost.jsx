import "./BlogPost.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogById, fetchSimilarBlogs, clearSimilarBlogs } from "../../redux/blogs/blogsSlice";
import { encryptId, decryptId } from "../Common/Idcrypto";
import imgSrc from "../Common/ImgSrc";

import userIcon from "../../assets/solar_user-bold.png";
import shareIcon from "../../assets/ri_share-line.png";
import ictcLogo from "../../assets/ICTC_Logo(long).png";
import doctorImg from "../../assets/High res images 1.png";

// TipTap — used to convert stored JSON back to HTML for rendering
import { generateHTML } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Dropcursor from "@tiptap/extension-dropcursor";

// Extensions must match ManageBlogs.jsx exactly so every node type is recognised.
// StarterKit v3 bundles link, underline, dropcursor — disable those in StarterKit
// and register the standalone configured versions to avoid duplicate-extension warnings.
const BLOG_EXTENSIONS = [
  StarterKit.configure({
    dropcursor: false,
    underline: false,
    link: false,
  }),
  Image,
  Highlight,
  Typography,
  Underline,
  Dropcursor,
  Link.configure({ openOnClick: false }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  TaskList,
  TaskItem.configure({ nested: true }),
];

const BlogPost = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selected: blog, similar: similarBlogs, loading } = useSelector(
    (state) => state.blogs || {}
  );

  const numericId = decryptId(id) ?? Number(id);

  useEffect(() => {
    if (numericId) {
      dispatch(fetchBlogById(numericId));
      dispatch(fetchSimilarBlogs({ id: numericId, limit: 3 }));
    }
    return () => {
      dispatch(clearSimilarBlogs());
    };
  }, [id, dispatch]);

  if (loading) {
    return <p style={{ padding: "40px" }}>Loading blog...</p>;
  }

  if (!blog || !blog.content) {
    return (
      <div style={{ padding: "60px", textAlign: "center" }}>
        <h2>Blog not found</h2>
        <p style={{ color: "#64748b", marginTop: "8px" }}>
          The blog you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  const handleShare = async () => {
    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: blog.title, text: blog.title, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied! You can now share it.");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  const getHTML = (content) => {
    if (!content) return "";
    try {
      // Stored as JSON object (TipTap getJSON format)
      const json = typeof content === "string" ? JSON.parse(content) : content;
      if (json && json.type === "doc") {
        return generateHTML(json, BLOG_EXTENSIONS);
      }
    } catch {
      // fall through
    }
    // Fallback: already an HTML string (older blogs)
    if (typeof content === "string") return content;
    return "";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <main className="ictc-blogpost-layout">
        {/* LEFT CONTENT */}
        <article className="ictc-blogpost-article">
          <div className="blg">
            <img
              src={imgSrc(blog.image)}
              alt={blog.title}
              className="ictc-blogpost-hero"
            />

            <div className="ictc-blg-padd">
              <div className="ictc-blogpost-meta-row">
                <div className="ictc-blogpost-meta-tags">
                  <span className="tag blog">{blog.type || "Blog"}</span>

                  {blog.tags?.map((tag) => (
                    <span key={tag.id} className="tag childhood-cancer">
                      {tag.tag}
                    </span>
                  ))}

                  <span className="date">{formatDate(blog.date)}</span>
                </div>
              </div>

              <h1 className="ictc-blogpost-title">{blog.title}</h1>

              <div className="ictc-bp-flex">
                <div className="ictc-blogpost-author">
                  <img src={userIcon} alt="Author" />
                  <span>by {blog.author || "ICTC Team"}</span>
                </div>

                <button className="ictc-blogpost-share-btn" onClick={handleShare}>
                  <img src={shareIcon} alt="Share blog" />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* BODY */}
          <section
            className="ictc-blogpost-body"
            dangerouslySetInnerHTML={{ __html: getHTML(blog.content) }}
          />
        </article>

        {/* RIGHT SIDEBAR */}
        <aside className="ictc-blogpost-sidebar">
          <h3 className="ictc-blogpost-sidebar-title">Similar Blogs</h3>

          {Array.isArray(similarBlogs) && similarBlogs.length > 0 ? (
            similarBlogs.map((item) => (
              <div
                key={item.id}
                className="ictc-blogpost-similar-card"
                onClick={() =>
                  navigate(`/blog/${encryptId(item.id)}/${item.slug}`)
                }
                style={{ cursor: "pointer" }}
              >
                <img src={imgSrc(item.image)} alt={item.title} />

                <div className="ictc-blogpost-meta-tags">
                  <span className="tag blog">{item.type || "Blog"}</span>
                  <span className="date">{formatDate(item.date)}</span>
                </div>

                <p className="ictc-blg-text">{item.title}</p>
              </div>
            ))
          ) : (
            <p style={{ color: "#94a3b8", fontSize: "14px" }}>
              No similar blogs found.
            </p>
          )}

          {/* CTA */}
          <div className="ictc-blogpost-cta">
            <div className="ictc-blogpost-cta-content">
              <h3>Need Cancer Treatment or Guidance?</h3>
              <p>Book a Free Consultation or Second Opinion at</p>

              <img
                src={ictcLogo}
                alt="ICTC Logo"
                className="ictc-blogpost-cta-logo"
              />

              <h2>Mumbai's Largest Cancer Care Chain</h2>

              <button
                className="book-btn ictc-blogpost-cta-btn"
                onClick={() => navigate("/BookAppoinment")}
              >
                Book a Consultation
              </button>
            </div>

            <img
              src={doctorImg}
              alt="Doctor"
              className="ictc-blogpost-cta-doctor"
            />
          </div>
        </aside>
      </main>

      {/* TAGS */}
      <section className="ictc-blogpost-tags-section">
        <h3 className="ictc-blogpost-tags-title">Tags</h3>

        <div className="ictc-blogpost-tags-list">
          {blog.tags?.map((tag) => (
            <span key={tag.id}>{tag.tag}</span>
          ))}
        </div>
      </section>
    </>
  );
};

export default BlogPost;