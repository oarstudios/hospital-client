import { useState, useEffect } from "react";
import slugify from "slugify";
import Select from "react-select";
import { useDropzone } from "react-dropzone";

import { EditorContent, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Dropcursor from "@tiptap/extension-dropcursor";

import "./ManageBlogs.css";

const ManageBlogs = () => {

  /* =====================================================
     STATE
  ====================================================== */

  const [blog, setBlog] = useState({
    title: "",
    slug: "",
    type: "Blog",
    date: "",
    category: "",
    author: "",
    tags: [],
    image: null,
    metaTitle: "",
    metaDescription: "",
    keywords: "",
  });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHTML, setPreviewHTML] = useState("");

  /* =====================================================
     TAG OPTIONS
  ====================================================== */

  const tagOptions = [
    { value: "Breast Cancer", label: "Breast Cancer" },
    { value: "Cancer Awareness", label: "Cancer Awareness" },
    { value: "Cancer Treatment", label: "Cancer Treatment" },
    { value: "Chemotherapy", label: "Chemotherapy" },
  ];

  /* =====================================================
     IMAGE UPLOAD
  ====================================================== */

  const onDrop = (files) => {
    setBlog({ ...blog, image: files[0] });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop
  });

  /* =====================================================
     EDITOR
  ====================================================== */

  const editor = useEditor({

    extensions: [

      StarterKit,

      Image,

      Highlight,

      Typography,

      Underline,

      Dropcursor,

      Link.configure({
        openOnClick: false
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"]
      }),

      TaskList,

      TaskItem.configure({
        nested: true
      }),

      Placeholder.configure({
        placeholder: "Start writing your blog..."
      })

    ],

    content: "",

    onUpdate({ editor }) {

      const html = editor.getHTML();

      setPreviewHTML(html);

      localStorage.setItem(
        "blogDraft",
        JSON.stringify(editor.getJSON())
      );

    }

  });

  /* =====================================================
     LOAD DRAFT
  ====================================================== */

  useEffect(() => {

    if (editor) {

      const saved = localStorage.getItem("blogDraft");

      if (saved) {

        editor.commands.setContent(
          JSON.parse(saved)
        );

      }

    }

  }, [editor]);

  if (!editor) return null;

  /* =====================================================
     ADD IMAGE INSIDE EDITOR
  ====================================================== */

  const addImage = () => {

    const input = document.createElement("input");

    input.type = "file";

    input.accept = "image/*";

    input.onchange = () => {

      const file = input.files[0];

      if (!file) return;

      const reader = new FileReader();

      reader.onload = () => {

        editor
          .chain()
          .focus()
          .setImage({
            src: reader.result
          })
          .run();

      };

      reader.readAsDataURL(file);

    };

    input.click();

  };

  /* =====================================================
     SAVE BLOG
  ====================================================== */

  const saveBlog = () => {

    const payload = {

      ...blog,

      slug: slugify(blog.title, {
        lower: true
      }),

      tags: blog.tags.map(
        (t) => t.value
      ),

      content: editor.getJSON()

    };

    console.log("BLOG DATA:", payload);

  };

  /* =====================================================
     UI
  ====================================================== */

  return (

    <>

    <div className="blog-admin">

      {/* ===================================== */}
      {/* TITLE */}
      {/* ===================================== */}

      <input
        className="blog-title"
        placeholder="Untitled"
        value={blog.title}
        onChange={(e) =>
          setBlog({
            ...blog,
            title: e.target.value
          })
        }
      />

      {/* ===================================== */}
      {/* HERO IMAGE */}
      {/* ===================================== */}

      <div
        {...getRootProps()}
        className="hero-upload"
      >

        <input {...getInputProps()} />

        Upload Cover Image

      </div>

      {blog.image && (

        <img
          src={URL.createObjectURL(blog.image)}
          alt="Blog cover"
          className="hero-preview"
        />

      )}

      {/* ===================================== */}
      {/* META */}
      {/* ===================================== */}

      <div className="meta-grid">

        <div>

          <label>Author</label>

          <input
            onChange={(e) =>
              setBlog({
                ...blog,
                author: e.target.value
              })
            }
          />

        </div>

        <div>

          <label>Date</label>

          <input
            type="date"
            onChange={(e) =>
              setBlog({
                ...blog,
                date: e.target.value
              })
            }
          />

        </div>

        <div>

          <label>Category</label>

          <input
            onChange={(e) =>
              setBlog({
                ...blog,
                category: e.target.value
              })
            }
          />

        </div>

      </div>

      {/* ===================================== */}
      {/* TAGS */}
      {/* ===================================== */}

      <div className="tags-section">

        <label>Tags</label>

        <Select
          options={tagOptions}
          isMulti
          onChange={(val) =>
            setBlog({
              ...blog,
              tags: val
            })
          }
        />

      </div>

      {/* ===================================== */}
      {/* TOOLBAR */}
      {/* ===================================== */}

      <div className="editor-toolbar">

        <button onClick={() => editor.chain().focus().toggleBold().run()}>
          <b>B</b>
        </button>

        <button onClick={() => editor.chain().focus().toggleItalic().run()}>
          <i>I</i>
        </button>

        <button onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <u>U</u>
        </button>

        <button onClick={() => editor.chain().focus().toggleStrike().run()}>
          S
        </button>

        <button onClick={() => editor.chain().focus().toggleHighlight().run()}>
          Highlight
        </button>

        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          H1
        </button>

        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>

        <button onClick={() => editor.chain().focus().setParagraph().run()}>
          P
        </button>

        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • List
        </button>

        <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. List
        </button>

        <button onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          Left
        </button>

        <button onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          Center
        </button>

        <button onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          Right
        </button>

        <button
          onClick={() => {

            const url = prompt("Enter URL");

            if (url) {

              editor
                .chain()
                .focus()
                .setLink({
                  href: url
                })
                .run();

            }

          }}
        >
          Link
        </button>

        <button onClick={addImage}>
          Image
        </button>

      </div>

      {/* ===================================== */}
      {/* EDITOR */}
      {/* ===================================== */}

      <EditorContent
        editor={editor}
        className="notion-editor"
      />

      {/* ===================================== */}
      {/* SEO */}
      {/* ===================================== */}

      <div className="seo-box">

        <h3>SEO Settings</h3>

        <input
          placeholder="Meta Title"
          onChange={(e) =>
            setBlog({
              ...blog,
              metaTitle: e.target.value
            })
          }
        />

        <textarea
          placeholder="Meta Description"
          onChange={(e) =>
            setBlog({
              ...blog,
              metaDescription: e.target.value
            })
          }
        />

        <input
          placeholder="Keywords"
          onChange={(e) =>
            setBlog({
              ...blog,
              keywords: e.target.value
            })
          }
        />

      </div>

      {/* ===================================== */}
      {/* BUTTONS */}
      {/* ===================================== */}

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px"
        }}
      >

        <button
          className="publish-btn"
          onClick={() => setPreviewOpen(true)}
        >
          Preview
        </button>

        <button
          className="publish-btn"
          onClick={saveBlog}
        >
          Publish Blog
        </button>

      </div>

    </div>

    {/* ===================================== */}
    {/* PREVIEW MODAL */}
    {/* ===================================== */}

    {previewOpen && (

      <div className="blog-preview-modal">

        <div className="blog-preview-container">

          <button
            className="preview-close"
            onClick={() =>
              setPreviewOpen(false)
            }
          >
            Close Preview
          </button>

          {blog.image && (

            <img
              src={URL.createObjectURL(blog.image)}
              className="preview-hero"
              alt=""
            />

          )}

          <h1 className="preview-title">
            {blog.title || "Blog Title"}
          </h1>

          <div className="preview-meta">

            {blog.author && (
              <span>
                By {blog.author}
              </span>
            )}

            {blog.date && (
              <span>
                {blog.date}
              </span>
            )}

          </div>

          <div
            className="preview-body"
            dangerouslySetInnerHTML={{
              __html: previewHTML
            }}
          />

        </div>

      </div>

    )}

    </>

  );

};

export default ManageBlogs;