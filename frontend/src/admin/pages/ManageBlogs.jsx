import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import slugify from "slugify";
import CreatableSelect from "react-select/creatable";
import { useDropzone } from "react-dropzone";
import axiosInstance from "../../app/axiosinstance";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Dropcursor from "@tiptap/extension-dropcursor";

import {
  fetchBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  fetchBlogCategories,
  createBlogCategory,
  deleteBlogCategory,
} from "../../redux/blogs/blogsSlice";

import { fetchTags, createTag, deleteTag } from "../../redux/tags/tagsSlice";
import { showToast } from "../../redux/toast/toastSlice";
import FieldError from "../../components/Common/FieldError";
import useConfirmDialog from "../../components/Common/useConfirmDialog";
import { notifyFirstError, clearField } from "../../components/Common/formFeedback";
import {
  EditorImage,
  insertContentImages,
  updateImageAltAtPos,
} from "../editor/contentImage";
import ContentImageAltModal from "../editor/ContentImageAltModal";

import "./ManageBlogs.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const imgSrc = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

const emptyBlog = {
  title:           "",
  slug:            "",
  type:            "Blog",
  date:            "",
  categories:      [],
  author:          "",
  tags:            [],
  image:           null,
  altText:         "",
  metaTitle:       "",
  metaDescription: "",
  keywords:        "",
};

const isPendingOption = (option) =>
  option?.isPending || String(option?.value ?? "").startsWith("new:");

const pendingValue = (label) => `new:${label.trim()}`;

const ManageBlogs = () => {
  const dispatch = useDispatch();

  const { list = [], loading } = useSelector((state) => state.blogs || {});
  const { list: tagList = [] }  = useSelector((state) => state.tags  || {});
  const { categories = [], categoriesLoading = false } = useSelector((state) => state.blogs || {});

  const blogs      = Array.isArray(list)    ? list    : [];
  const tagOptions = Array.isArray(tagList)
    ? tagList.map((t) => ({ value: t.id, label: t.tag }))
    : [];
  const categoryOptions = Array.isArray(categories)
    ? categories.map((c) => ({ value: c.id, label: c.category }))
    : [];

  const [blog, setBlog]               = useState(emptyBlog);
  const [showModal, setShowModal]     = useState(false);
  const [editId, setEditId]           = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHTML, setPreviewHTML] = useState("");
  const [pendingContentImages, setPendingContentImages] = useState([]);
  const [contentImageAltOpen, setContentImageAltOpen] = useState(false);
  const [contentImageAltMode, setContentImageAltMode] = useState("insert");
  const [contentImageSaving, setContentImageSaving] = useState(false);
  const openImageAltEditorRef = useRef(null);
  const editingImagePosRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [confirm, confirmDialog] = useConfirmDialog();

  useEffect(() => {
    dispatch(fetchBlogs());
    dispatch(fetchTags());
    dispatch(fetchBlogCategories());
  }, [dispatch]);

  const editor = useEditor({
    extensions: [
      // StarterKit v3 bundles link, underline, dropcursor — disable them here
      // so the standalone configured versions below are the only registered ones
      StarterKit.configure({
        dropcursor: false,
        underline: false,
        link: false,
      }),
      EditorImage,
      Highlight,
      Typography,
      Underline,
      Dropcursor,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder: "Start writing your blog..." }),
    ],
    content: "",
    onUpdate({ editor }) {
      setPreviewHTML(editor.getHTML());
    },
    editorProps: {
      handleClickOn(_view, _pos, node, nodePos) {
        if (node.type.name === "image" && openImageAltEditorRef.current) {
          openImageAltEditorRef.current({
            url: node.attrs.src,
            alt: node.attrs.alt || "",
            nodePos,
          });
        }
        return false;
      },
    },
  });

  useEffect(() => {
    openImageAltEditorRef.current = ({ url, alt, nodePos }) => {
      editingImagePosRef.current = nodePos;
      setContentImageAltMode("edit");
      setPendingContentImages([
        { url, alt, previewUrl: imgSrc(url) },
      ]);
      setContentImageAltOpen(true);
    };
  }, []);

  /* ── Cover image dropzone ─────────────────────────────────────────────── */
  const onDrop = (files) => {
    const file = files[0];
    if (!file) return;
    setBlog((prev) => ({
      ...prev,
      image: { file, url: URL.createObjectURL(file) },
    }));
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
  });

  if (!editor) return null;

  /* ── Inline content image upload ──────────────────────────────────────────
   * Same pattern as ManageServices / ManageCancers:
   * upload immediately to /blogs/upload-content-image → get a real server URL
   * → insert that URL into the editor.
   * This means the editor JSON always contains real /uploads/... URLs,
   * so the backend never needs to do any placeholder replacement for content images.
   * The image shows correctly on edit because the src IS already a persisted URL.
   * ─────────────────────────────────────────────────────────────────────────── */
  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;

    input.onchange = async () => {
      const files = Array.from(input.files || []);
      if (files.length === 0) return;

      setImageUploading(true);
      try {
        const uploaded = await Promise.all(
          files.map(async (file) => {
            const form = new FormData();
            form.append("file", file);
            const res = await axiosInstance.post(
              "/blogs/upload-content-image",
              form,
              { headers: { "Content-Type": "multipart/form-data" } },
            );
            const url = res.data?.data?.url || res.data?.url;
            if (!url) return null;
            return {
              url,
              alt: "",
              previewUrl: imgSrc(url),
            };
          }),
        );

        const ready = uploaded.filter(Boolean);
        if (ready.length === 0) return;

        setContentImageAltMode("insert");
        setPendingContentImages(ready);
        setContentImageAltOpen(true);
      } catch {
        dispatch(showToast.error("Image upload failed. Please try again."));
      } finally {
        setImageUploading(false);
      }
    };

    input.click();
  };

  const closeContentImageAltModal = () => {
    setContentImageAltOpen(false);
    setPendingContentImages([]);
    setContentImageSaving(false);
    setContentImageAltMode("insert");
    editingImagePosRef.current = null;
  };

  const confirmContentImageAlt = (images = pendingContentImages) => {
    setContentImageSaving(true);

    if (contentImageAltMode === "edit") {
      const saved = updateImageAltAtPos(
        editor,
        editingImagePosRef.current,
        images[0]?.alt || "",
        images[0]?.url,
      );
      if (!saved) {
        dispatch(showToast.error("Could not update image alt text. Click the image and try again."));
        setContentImageSaving(false);
        return;
      }
      closeContentImageAltModal();
      return;
    }

    insertContentImages(
      editor,
      images.map(({ url, alt }) => ({ url, alt: alt.trim() })),
    );
    closeContentImageAltModal();
  };

  /* ── Helpers ──────────────────────────────────────────────────────────── */
  const resetModal = () => {
    setBlog(emptyBlog);
    setEditId(null);
    setErrors({});
    editor.commands.clearContent();
  };

  const openCreate = () => {
    resetModal();
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditId(item.id);
    setErrors({});
    setBlog({
      title:           item.title           || "",
      slug:            item.slug            || "",
      type:            /^news(letter)?$/i.test(item.type || "") ? "News" : (item.type || "Blog"),
      date:            item.date            || "",
      categories: (item.categories || []).map((c) => ({ value: c.id, label: c.category })),
      author:          item.author          || "",
      tags: (item.tags || []).map((t) => ({ value: t.id, label: t.tag })),
      // Use API_BASE directly — same pattern as ManageCenters / ManageServices
      image: item.image ? { url: `${API_BASE}${item.image}` } : null,
      metaTitle:       item.metaTitle       || "",
      metaDescription: item.metaDescription || "",
      keywords:        item.keywords        || "",
    });

    if (item.content) {
      const content =
        typeof item.content === "string"
          ? (() => { try { return JSON.parse(item.content); } catch { return item.content; } })()
          : item.content;
      editor.commands.setContent(content);
    } else {
      editor.commands.clearContent();
    }

    setShowModal(true);
  };

  /* ── Save ─────────────────────────────────────────────────────────────── */
  const addLocalCategory = (inputValue) => {
    const label = inputValue.trim();
    if (!label) return;

    const existing = categories.find(
      (c) => c.category.toLowerCase() === label.toLowerCase(),
    );

    setBlog((prev) => {
      if (existing) {
        if (prev.categories.some((c) => c.value === existing.id)) return prev;
        return {
          ...prev,
          categories: [...prev.categories, { value: existing.id, label: existing.category }],
        };
      }

      const value = pendingValue(label);
      if (prev.categories.some((c) => c.label.toLowerCase() === label.toLowerCase())) {
        return prev;
      }

      return {
        ...prev,
        categories: [...prev.categories, { value, label, isPending: true }],
      };
    });
  };

  const addLocalTag = (inputValue) => {
    const label = inputValue.trim();
    if (!label) return;

    const existing = tagList.find(
      (t) => t.tag.toLowerCase() === label.toLowerCase(),
    );

    setBlog((prev) => {
      if (existing) {
        if (prev.tags.some((t) => t.value === existing.id)) return prev;
        return {
          ...prev,
          tags: [...prev.tags, { value: existing.id, label: existing.tag }],
        };
      }

      const value = pendingValue(label);
      if (prev.tags.some((t) => t.label.toLowerCase() === label.toLowerCase())) {
        return prev;
      }

      return {
        ...prev,
        tags: [...prev.tags, { value, label, isPending: true }],
      };
    });
  };

  const resolveCategoryIds = async () => {
    const ids = [];

    for (const category of blog.categories) {
      if (isPendingOption(category)) {
        const name = category.label.trim();
        const existing = categories.find(
          (c) => c.category.toLowerCase() === name.toLowerCase(),
        );

        if (existing) {
          ids.push(existing.id);
          continue;
        }

        const created = await dispatch(createBlogCategory(name)).unwrap();
        if (created?.id) ids.push(created.id);
      } else {
        ids.push(Number(category.value));
      }
    }

    return ids;
  };

  const resolveTagIds = async () => {
    const ids = [];

    for (const tag of blog.tags) {
      if (isPendingOption(tag)) {
        const name = tag.label.trim();
        const existing = tagList.find(
          (t) => t.tag.toLowerCase() === name.toLowerCase(),
        );

        if (existing) {
          ids.push(existing.id);
          continue;
        }

        const created = await dispatch(createTag(name)).unwrap();
        if (created?.id) ids.push(created.id);
      } else {
        ids.push(Number(tag.value));
      }
    }

    return ids;
  };

  const saveBlog = async () => {
    const nextErrors = {};
    if (!blog.title.trim()) nextErrors.title = `${blog.type || "Post"} title is required.`;
    const resolvedSlug =
      blog.slug.trim() || slugify(blog.title, { lower: true, strict: true });
    if (!resolvedSlug) nextErrors.slug = "Slug is required.";
    if (!blog.date) nextErrors.date = "Date is required.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      notifyFirstError(dispatch, nextErrors);
      return;
    }

    // Content images are already uploaded; getJSON() has real /uploads/... URLs.
    const content = editor.getJSON();

    const formData = new FormData();
    formData.append("title",           blog.title);
    formData.append("slug",            resolvedSlug);
    formData.append("type",            blog.type            || "Blog");
    formData.append("date",            blog.date            || "");
    formData.append("author",          blog.author          || "");
    formData.append("altText",         blog.altText         || "");
    formData.append("metaTitle",       blog.metaTitle       || "");
    formData.append("metaDescription", blog.metaDescription || "");
    formData.append("keywords",        blog.keywords        || "");
    formData.append("content",         JSON.stringify(content));

    try {
      const [categoryIds, tagIds] = await Promise.all([
        resolveCategoryIds(),
        resolveTagIds(),
      ]);

      categoryIds.forEach((id) => formData.append("categories", String(id)));
      tagIds.forEach((id) => formData.append("tags", String(id)));

      // Cover image — only if a new file was selected
      if (blog.image?.file) {
        formData.append("image", blog.image.file);
      }

      if (editId) {
        await dispatch(updateBlog({ id: editId, data: formData })).unwrap();
        dispatch(fetchBlogs());
      } else {
        await dispatch(createBlog(formData)).unwrap();
      }

      dispatch(fetchBlogCategories());
      dispatch(fetchTags());
      resetModal();
      setShowModal(false);
    } catch (err) {
      console.error("Blog save error:", err);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: "Delete this post?",
      message: "This will remove it from the website. You can restore it later from the database if needed.",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    await dispatch(deleteBlog(id));
  };

  const handleDeleteCategoryOption = async (option) => {
    if (isPendingOption(option)) {
      setBlog((prev) => ({
        ...prev,
        categories: prev.categories.filter((c) => c.value !== option.value),
      }));
      return;
    }

    const ok = await confirm({
      title: "Delete this category?",
      message: `"${option.label}" will be removed from all posts that use it.`,
      confirmLabel: "Delete",
    });
    if (!ok) return;

    try {
      await dispatch(deleteBlogCategory(option.value)).unwrap();
      setBlog((prev) => ({
        ...prev,
        categories: prev.categories.filter((c) => c.value !== option.value),
      }));
    } catch {
      dispatch(showToast.error("Failed to delete category. Please try again."));
    }
  };

  const handleDeleteTagOption = async (option) => {
    if (isPendingOption(option)) {
      setBlog((prev) => ({
        ...prev,
        tags: prev.tags.filter((t) => t.value !== option.value),
      }));
      return;
    }

    const ok = await confirm({
      title: "Delete this tag?",
      message: `"${option.label}" will be removed from all posts that use it.`,
      confirmLabel: "Delete",
    });
    if (!ok) return;

    try {
      await dispatch(deleteTag(option.value)).unwrap();
      setBlog((prev) => ({
        ...prev,
        tags: prev.tags.filter((t) => t.value !== option.value),
      }));
    } catch {
      dispatch(showToast.error("Failed to delete tag. Please try again."));
    }
  };

  const formatOptionWithRemove = (option, { context }, onRemove) => {
    if (context === "value") return option.label;

    return (
      <div className="tag-select-option-row">
        <span className="tag-select-option-label">{option.label}</span>
        <button
          type="button"
          className="tag-select-option-remove"
          aria-label={`Remove ${option.label}`}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(option);
          }}
        >
          ×
        </button>
      </div>
    );
  };

  const selectMenuPortalProps = {
    menuPortalTarget: typeof document !== "undefined" ? document.body : null,
    menuPosition: "fixed",
    styles: {
      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    },
  };

  /* ── Render ───────────────────────────────────────────────────────────── */
  return (
    <>
      <div className="admin-centers-page">
        <div className="admin-centers-header">
          <h2>Manage Blogs</h2>
          <button className="admin-add-btn" onClick={openCreate}>
            + Add Blog
          </button>
        </div>

        <div className="admin-centers-table-wrapper">
          <table className="admin-centers-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Type</th>
                <th>Author</th>
                <th>Categories</th>
                <th>Tags</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: 24 }}>
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && blogs.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: 24, color: "#94a3b8" }}>
                    No blogs found. Click "+ Add Blog" to create one.
                  </td>
                </tr>
              )}
              {!loading && blogs.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.image ? (
                      <img
                        src={imgSrc(item.image)}
                        className="admin-table-img"
                        alt=""
                      />
                    ) : (
                      <span style={{ color: "#cbd5e1", fontSize: 12 }}>No image</span>
                    )}
                  </td>
                  <td>{item.title}</td>
                  <td>{/^news(letter)?$/i.test(item.type || "") ? "News" : (item.type || "Blog")}</td>
                  <td>{item.author || "—"}</td>
                  <td>
                    {item.categories?.length > 0
                      ? item.categories.map((c) => c.category).join(", ")
                      : "—"}
                  </td>
                  <td>
                    {item.tags?.length > 0
                      ? item.tags.map((t) => t.tag).join(", ")
                      : "—"}
                  </td>
                  <td>{item.date || "—"}</td>
                  <td className="admin-actions">
                    <button className="admin-edit-btn"   onClick={() => openEdit(item)}>Edit</button>
                    <button className="admin-delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3>{editId ? `Edit ${blog.type}` : `Add ${blog.type}`}</h3>

            <label>{blog.type === 'News' ? 'News Title' : 'Blog Title'} *</label>
            <input
              className={`blog-title${errors.title ? " input-invalid" : ""}`}
              placeholder="Untitled"
              value={blog.title}
              onChange={(e) => {
                const title = e.target.value;
                clearField(setErrors, "title");
                setBlog((prev) => ({
                  ...prev,
                  title,
                  slug: editId ? prev.slug : slugify(title, { lower: true, strict: true }),
                }));
              }}
            />
            <FieldError message={errors.title} />

            <div {...getRootProps()} className="hero-upload">
              <input {...getInputProps()} />
              Upload Cover Image
            </div>

            {blog.image && (
              <img
                src={blog.image.url}
                alt={blog.altText || "Blog cover"}
                className="hero-preview"
              />
            )}

            {blog.image && (
              <div>
                <label>Alt Text (SEO)</label>
                <input
                  value={blog.altText}
                  onChange={(e) => setBlog((prev) => ({ ...prev, altText: e.target.value }))}
                  placeholder="Describe the image for accessibility and SEO"
                />
              </div>
            )}

            <div className="meta-grid">
              <div>
                <label>Slug *</label>
                <input
                  className={errors.slug ? "input-invalid" : ""}
                  value={blog.slug}
                  onChange={(e) => {
                    clearField(setErrors, "slug");
                    setBlog((prev) => ({ ...prev, slug: e.target.value }));
                  }}
                  placeholder="auto-generated from title"
                />
                <FieldError message={errors.slug} />
              </div>
              <div>
                <label>Type</label>
                <select
                  value={blog.type}
                  onChange={(e) => setBlog((prev) => ({ ...prev, type: e.target.value }))}
                >
                  <option value="Blog">Blog</option>
                  <option value="News">News</option>
                </select>
              </div>
              <div>
                <label>Author</label>
                <input
                  value={blog.author}
                  onChange={(e) => setBlog((prev) => ({ ...prev, author: e.target.value }))}
                  placeholder="Add author name here"
                />
              </div>
              <div>
                <label>Date *</label>
                <input
                  type="date"
                  className={errors.date ? "input-invalid" : ""}
                  value={blog.date}
                  onChange={(e) => {
                    clearField(setErrors, "date");
                    setBlog((prev) => ({ ...prev, date: e.target.value }));
                  }}
                />
                <FieldError message={errors.date} />
              </div>
            </div>

            <div className="tags-section">
              <label>Categories</label>
              <CreatableSelect
                classNamePrefix="tag-select"
                {...selectMenuPortalProps}
                options={categoryOptions}
                isMulti
                isLoading={categoriesLoading}
                value={blog.categories}
                onChange={(val) => setBlog((prev) => ({ ...prev, categories: val || [] }))}
                formatOptionLabel={(option, meta) =>
                  formatOptionWithRemove(option, meta, handleDeleteCategoryOption)
                }
                onCreateOption={addLocalCategory}
                placeholder="Select or type to add a new category..."
                formatCreateLabel={(inputValue) => (
                  <span style={{ color: "#2563eb", fontWeight: 600 }}>
                    + Add new category "{inputValue}"
                  </span>
                )}
                noOptionsMessage={() => categoryOptions.length === 0 ? "No categories available" : "No options"}
              />
            </div>

            <div className="tags-section">
              <label>Tags</label>
              <CreatableSelect
                classNamePrefix="tag-select"
                {...selectMenuPortalProps}
                options={tagOptions}
                isMulti
                value={blog.tags}
                onChange={(val) => setBlog((prev) => ({ ...prev, tags: val || [] }))}
                formatOptionLabel={(option, meta) =>
                  formatOptionWithRemove(option, meta, handleDeleteTagOption)
                }
                onCreateOption={addLocalTag}
                placeholder="Select or type to add a new tag..."
                formatCreateLabel={(inputValue) => (
                  <span style={{ color: "#2563eb", fontWeight: 600 }}>
                    + Add new tag "{inputValue}"
                  </span>
                )}
                noOptionsMessage={() => tagOptions.length === 0 ? "No tags available" : "No options"}
              />
            </div>

            <div className="editor-section">
              <div className="editor-toolbar">
                <button onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></button>
                <button onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
                <button onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></button>
                <button onClick={() => editor.chain().focus().toggleStrike().run()}>S</button>
                <button onClick={() => editor.chain().focus().toggleHighlight().run()}>Highlight</button>
                <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
                <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
                <button onClick={() => editor.chain().focus().setParagraph().run()}>P</button>
                <button onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
                <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
                <button onClick={() => editor.chain().focus().setTextAlign("left").run()}>Left</button>
                <button onClick={() => editor.chain().focus().setTextAlign("center").run()}>Center</button>
                <button onClick={() => editor.chain().focus().setTextAlign("right").run()}>Right</button>
                <button
                  onClick={() => {
                    const url = prompt("Enter URL");
                    if (url) editor.chain().focus().setLink({ href: url }).run();
                  }}
                >
                  Link
                </button>
                <button onClick={addImage} disabled={imageUploading}>
                  {imageUploading ? "Uploading…" : "Image"}
                </button>
              </div>

              <p className="editor-image-hint">
                <span className="editor-image-hint-icon" aria-hidden="true">ⓘ</span>
                Click any image in the editor to add or edit SEO alt text.
                Images without alt are highlighted in orange.
              </p>

              <EditorContent editor={editor} className="notion-editor" />
            </div>

            <div className="seo-box">
              <h3>SEO Settings</h3>
              <label>Meta Title</label>
              <input
                placeholder="Meta Title"
                value={blog.metaTitle}
                onChange={(e) => setBlog((prev) => ({ ...prev, metaTitle: e.target.value }))}
              />
              <label>Meta Description</label>
              <textarea
                placeholder="Meta Description"
                value={blog.metaDescription}
                onChange={(e) => setBlog((prev) => ({ ...prev, metaDescription: e.target.value }))}
              />
              <label>Keywords</label>
              <input
                placeholder="Keywords"
                value={blog.keywords}
                onChange={(e) => setBlog((prev) => ({ ...prev, keywords: e.target.value }))}
              />
            </div>

            <div className="admin-modal-actions">
              <button
                className="admin-submit-btn"
                onClick={saveBlog}
                disabled={loading || imageUploading}
              >
                {loading ? "Saving…" : editId ? `Update ${blog.type}` : `Publish ${blog.type}`}
              </button>
              <button
                className="admin-cancel-btn"
                onClick={() => { resetModal(); setShowModal(false); }}
              >
                Cancel
              </button>
              <button className="publish-btn" onClick={() => setPreviewOpen(true)}>
                Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {previewOpen && (
        <div className="blog-preview-modal">
          <div className="blog-preview-container">
            <button className="preview-close" onClick={() => setPreviewOpen(false)}>
              Close Preview
            </button>

            {blog.image && (
              <img src={blog.image.url} className="preview-hero" alt="" />
            )}

            <h1 className="preview-title">{blog.title || "Blog Title"}</h1>

            <div className="preview-meta">
              {blog.author && <span>By {blog.author}</span>}
              {blog.date   && <span>{blog.date}</span>}
            </div>

            <div
              className="preview-body"
              dangerouslySetInnerHTML={{ __html: previewHTML }}
            />
          </div>
        </div>
      )}
      {confirmDialog}

      <ContentImageAltModal
        open={contentImageAltOpen}
        mode={contentImageAltMode}
        images={pendingContentImages}
        onConfirm={confirmContentImageAlt}
        onCancel={closeContentImageAltModal}
        saving={contentImageSaving}
      />
    </>
  );
};

export default ManageBlogs;