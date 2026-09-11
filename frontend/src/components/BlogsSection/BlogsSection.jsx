import "./BlogsSection.css";
import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs, fetchBlogCategories } from "../../redux/blogs/blogsSlice";
import { encryptId } from "../Common/Idcrypto";
import imgSrc from "../Common/ImgSrc";
import {
  displayPostType,
  sortByDateDesc,
  matchesPostTypeFilter,
} from "../Common/postType";
import SeoHead from "../Common/SeoHead";
import { getAllBlogsSeo, blogAlt } from "../../seo/pageSeo";
import usePublicSeoEnv from "../../seo/usePublicSeoEnv";

const POSTS_PER_PAGE = 10;
const CATEGORIES_COLLAPSED_COUNT = 6;

const filterItemStyle = (active) => ({
  cursor: "pointer",
  fontWeight: active ? "600" : "400",
  color: active ? "#0f172a" : undefined,
});

const BlogsSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { siteUrl } = usePublicSeoEnv();
  const listingSeo = getAllBlogsSeo({ siteUrl });

  const {
    list = [],
    loading,
    categories = [],
    categoriesLoading,
  } = useSelector((state) => state.blogs || {});

  const [selectedType, setSelectedType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllCategories, setShowAllCategories] = useState(false);

  useEffect(() => {
    dispatch(fetchBlogs());
    dispatch(fetchBlogCategories());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType, selectedCategory]);

  const sortedBlogs = useMemo(() => {
    const all = Array.isArray(list) ? list : [];
    return sortByDateDesc(all);
  }, [list]);

  const filteredBlogs = useMemo(() => {
    return sortedBlogs.filter((post) => {
      if (!matchesPostTypeFilter(post, selectedType)) return false;

      if (!selectedCategory) return true;

      if (!Array.isArray(post.categories)) return false;
      return post.categories.some((cat) => cat.id === selectedCategory);
    });
  }, [sortedBlogs, selectedType, selectedCategory]);

  const totalPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentBlogs = filteredBlogs.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const visibleCategories = useMemo(() => {
    if (showAllCategories) return categories;
    const collapsed = categories.slice(0, CATEGORIES_COLLAPSED_COUNT);
    if (!selectedCategory) return collapsed;
    if (collapsed.some((c) => c.id === selectedCategory)) return collapsed;
    const selected = categories.find((c) => c.id === selectedCategory);
    return selected ? [...collapsed, selected] : collapsed;
  }, [categories, showAllCategories, selectedCategory]);
  const hasHiddenCategories = categories.length > CATEGORIES_COLLAPSED_COUNT;

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const emptyMessage = (() => {
    if (selectedType && selectedCategory) {
      return "No posts found for this type and category.";
    }
    if (selectedType) return "No posts found for this type.";
    if (selectedCategory) return "No posts found in this category.";
    return "No posts available yet.";
  })();

  if (loading) {
    return (
      <section className="blogs-wrapper">
        <SeoHead {...listingSeo} />
        <p style={{ textAlign: "center", padding: "60px 0" }}>
          Loading posts...
        </p>
      </section>
    );
  }

  return (
    <section className="blogs-wrapper">
      <SeoHead {...listingSeo} />
      <div className="blogs-header-row">
        <h2 className="blogs-heading">ICTC Blogs/News</h2>

        <div className="blogs-type-toggle" role="group" aria-label="Filter by post type">
          <button
            type="button"
            className={!selectedType ? "active" : ""}
            onClick={() => setSelectedType(null)}
          >
            All
          </button>
          <button
            type="button"
            className={selectedType === "Blog" ? "active" : ""}
            onClick={() => setSelectedType("Blog")}
          >
            Blogs
          </button>
          <button
            type="button"
            className={selectedType === "News" ? "active" : ""}
            onClick={() => setSelectedType("News")}
          >
            News
          </button>
        </div>
      </div>

      <div className="blogs-layout">
        <aside className="blogs-sidebar">
          <div className="sidebar-card">
            <h3>Categories</h3>

            {categoriesLoading ? (
              <p style={{ color: "#94a3b8", fontSize: "14px" }}>Loading...</p>
            ) : categories.length > 0 ? (
              <ul>
                <li
                  style={filterItemStyle(!selectedCategory)}
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </li>
                {visibleCategories.map((cat) => (
                  <li
                    key={cat.id}
                    style={filterItemStyle(selectedCategory === cat.id)}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === cat.id ? null : cat.id,
                      )
                    }
                  >
                    {cat.category}
                    {typeof cat.count === "number" ? ` (${cat.count})` : ""}
                  </li>
                ))}
                {hasHiddenCategories && (
                  <li className="categories-toggle-item">
                    <button
                      type="button"
                      className="categories-toggle"
                      onClick={() => setShowAllCategories((open) => !open)}
                    >
                      {showAllCategories
                        ? "Show less"
                        : `View all (${categories.length})`}
                    </button>
                  </li>
                )}
              </ul>
            ) : (
              <p style={{ color: "#94a3b8", fontSize: "14px" }}>
                No categories yet.
              </p>
            )}
          </div>

          <div className="sidebar-card">
            <h3>Latest Posts</h3>
            {sortedBlogs.length > 0 ? (
              <ol>
                {sortedBlogs.slice(0, 5).map((post, index) => (
                  <li
                    key={post.id}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(`/blog/${encryptId(post.id)}/${post.slug}`)
                    }
                  >
                    <span className="post-index">{index + 1}</span>

                    <div className="pip">
                      <p>{post.title}</p>

                      <div className="tag-row">
                        <span className={`tag ${displayPostType(post).toLowerCase()}`}>
                          {displayPostType(post)}
                        </span>
                        <span className="date">{formatDate(post.date)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p style={{ color: "#94a3b8", fontSize: "14px" }}>No posts yet.</p>
            )}
          </div>
        </aside>

        <div className="blogs-grid">
          {currentBlogs.length > 0 ? (
            currentBlogs.map((blog) => (
              <div
                className="blog-card"
                key={blog.id}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(`/blog/${encryptId(blog.id)}/${blog.slug}`)
                }
              >
                {blog.image && (
                  <img src={imgSrc(blog.image)} alt={blogAlt(blog)} />
                )}

                <div className="blog-card-body">
                  <div className="tag-row">
                    <span className={`tag ${displayPostType(blog).toLowerCase()}`}>
                      {displayPostType(blog)}
                    </span>
                    <span className="date">{formatDate(blog.date)}</span>
                  </div>

                  <h4>{blog.title}</h4>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: "40px 0", color: "#64748b" }}>
              {emptyMessage}
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ←
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={currentPage === page ? "active" : ""}
              onClick={() => changePage(page)}
            >
              {page}
            </button>
          ))}

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
