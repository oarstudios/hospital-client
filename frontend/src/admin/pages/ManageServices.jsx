import { useState, useEffect } from "react";
import slugify from "slugify";
import { useDropzone } from "react-dropzone";

import { EditorContent, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Dropcursor from "@tiptap/extension-dropcursor";

import "./ManageServices.css";

const ManageServices = () => {

  const [service, setService] = useState({
    title: "",
    slug: "",
    image: null,
    altText: "",
    metaTitle: "",
    metaDescription: "",
    faqs: []
  });

  const [faq, setFaq] = useState({ question: "", answer: "" });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHTML, setPreviewHTML] = useState("");

  /* ================= IMAGE ================= */

  const onDrop = (files) => {
    setService({ ...service, image: files[0] });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop
  });

  /* ================= EDITOR ================= */

  const editor = useEditor({

    extensions: [
      StarterKit,
      Image,
      Highlight,
      Typography,
      Underline,
      Dropcursor,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: "Start writing your service..."
      })
    ],

    content: "",

    onUpdate({ editor }) {
      const html = editor.getHTML();
      setPreviewHTML(html);

      localStorage.setItem(
        "serviceDraft",
        JSON.stringify(editor.getJSON())
      );
    }

  });

  /* LOAD DRAFT */

  useEffect(() => {
    if (editor) {
      const saved = localStorage.getItem("serviceDraft");
      if (saved) editor.commands.setContent(JSON.parse(saved));
    }
  }, [editor]);

  if (!editor) return null;

  /* ================= ADD IMAGE ================= */

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result }).run();
      };

      reader.readAsDataURL(file);
    };

    input.click();
  };

  /* ================= FAQ ================= */

  const addFAQ = () => {
    if (!faq.question || !faq.answer) return;

    setService({
      ...service,
      faqs: [...service.faqs, faq]
    });

    setFaq({ question: "", answer: "" });
  };

  const deleteFAQ = (index) => {
    const updated = service.faqs.filter((_, i) => i !== index);
    setService({ ...service, faqs: updated });
  };

  /* ================= SAVE ================= */

  const saveService = () => {
    const payload = {
      ...service,
      slug: slugify(service.title, { lower: true }),
      content: editor.getJSON()
    };

    console.log("SERVICE:", payload);
  };

  /* ================= UI ================= */

  return (
    <>
      <div className="blog-admin">

        {/* TITLE */}
        <label>Service Title</label>
        <input
          className="blog-title"
          placeholder="Add service title here"
          value={service.title}
          onChange={(e) =>
            setService({ ...service, title: e.target.value })
          }
        />

        {/* COVER IMAGE */}
        <label>Cover Image (1200x180 px)</label>
        <div {...getRootProps()} className="hero-upload">
          <input {...getInputProps()} />
          Upload Image
        </div>

        {service.image && (
          <img
            src={URL.createObjectURL(service.image)}
            className="hero-preview"
            alt=""
          />
        )}

        {/* ALT */}
        <label>Alt Text</label>
        <input
          placeholder="Add image Alt Text here"
          value={service.altText}
          onChange={(e) =>
            setService({ ...service, altText: e.target.value })
          }
        />

        {/* SEO */}
        <label>SEO Title (60 chars)</label>
        <input
          placeholder="Add title tag here"
          value={service.metaTitle}
          onChange={(e) =>
            setService({ ...service, metaTitle: e.target.value })
          }
        />

        <label>Meta Description (155–160 chars)</label>
        <textarea
          placeholder="Add meta description here"
          value={service.metaDescription}
          onChange={(e) =>
            setService({ ...service, metaDescription: e.target.value })
          }
        />

        {/* SLUG */}
        <label>Slug</label>
        <input
          placeholder="add-your-page-slug-here"
          value={service.slug}
          onChange={(e) =>
            setService({ ...service, slug: e.target.value })
          }
        />

        {/* TOOLBAR (IDENTICAL) */}
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
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
          >
            Link
          </button>

          <button onClick={addImage}>Image</button>
        </div>

        {/* EDITOR */}
        <EditorContent editor={editor} className="notion-editor" />

        {/* FAQ */}
        <h3 style={{ marginTop: "40px" }}>FAQS</h3>

        <input
          placeholder="Write your question here"
          value={faq.question}
          onChange={(e) =>
            setFaq({ ...faq, question: e.target.value })
          }
        />

        <textarea
          placeholder="Write your answer here"
          value={faq.answer}
          onChange={(e) =>
            setFaq({ ...faq, answer: e.target.value })
          }
        />

        <button className="publish-btn" onClick={addFAQ}>
          Add +
        </button>

        {/* FAQ LIST */}
        {service.faqs.map((f, i) => (
          <div key={i} className="faq-item">
            <div>
              <strong>{f.question}</strong>
              <p>{f.answer}</p>
            </div>
            <button onClick={() => deleteFAQ(i)}>❌</button>
          </div>
        ))}

        {/* BUTTONS */}
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <button className="publish-btn" onClick={() => setPreviewOpen(true)}>
            Preview Changes
          </button>

          <button className="publish-btn" onClick={saveService}>
            Commit Changes
          </button>
        </div>

      </div>

      {/* PREVIEW */}
      {previewOpen && (
        <div className="blog-preview-modal">
          <div className="blog-preview-container">

            <button className="preview-close" onClick={() => setPreviewOpen(false)}>
              Close Preview
            </button>

            {service.image && (
              <img
                src={URL.createObjectURL(service.image)}
                className="preview-hero"
                alt=""
              />
            )}

            <h1 className="preview-title">
              {service.title || "Service Title"}
            </h1>

            <div
              className="preview-body"
              dangerouslySetInnerHTML={{ __html: previewHTML }}
            />

          </div>
        </div>
      )}
    </>
  );
};

export default ManageServices;