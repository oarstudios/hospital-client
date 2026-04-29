import { useState, useRef } from "react";
import slugify from "slugify";
import { useDropzone } from "react-dropzone";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";

import "./ManageServices.css";
import "./ManageCancers.css";

const TABS = [
  "Overview",
  "Risk Factors",
  "Symptoms",
  "Diagnosis",
  "Treatment",
  "Do’s & Don’ts"
];

const ManageCancers = () => {

  const scrollRef = useRef();

  const [activeTab, setActiveTab] = useState("Overview");
  const [tabContent, setTabContent] = useState({});

  const [cancer, setCancer] = useState({
    name: "",
    slug: "",
    image: null,
    altText: "",
    metaTitle: "",
    metaDescription: "",
    faqs: []
  });

  const [faq, setFaq] = useState({ question: "", answer: "" });

  const [previewHTML, setPreviewHTML] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  /* ================= IMAGE ================= */

  const onDrop = (files) => {
    setCancer({ ...cancer, image: files[0] });
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
    Underline,
    Link.configure({ openOnClick: false }),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Placeholder.configure({
      placeholder: "Start writing your cancer content..."
    })
  ],
  content: "",
  onUpdate({ editor }) {
    setPreviewHTML(editor.getHTML());
  }
});

  /* TAB SWITCH SAVE */

  const handleTabChange = (tab) => {
    if (editor) {
      setTabContent(prev => ({
        ...prev,
        [activeTab]: editor.getJSON()
      }));

      editor.commands.setContent(tabContent[tab] || "");
    }
    setActiveTab(tab);
  };

  /* ================= FAQ ================= */

  const addFAQ = () => {
    if (!faq.question || !faq.answer) return;

    setCancer({
      ...cancer,
      faqs: [...cancer.faqs, faq]
    });

    setFaq({ question: "", answer: "" });
  };

  const deleteFAQ = (i) => {
    setCancer({
      ...cancer,
      faqs: cancer.faqs.filter((_, index) => index !== i)
    });
  };

  /* ================= SAVE ================= */

  const saveCancer = () => {

    setTabContent(prev => ({
      ...prev,
      [activeTab]: editor.getJSON()
    }));

    const payload = {
      ...cancer,
      slug: slugify(cancer.name, { lower: true }),
      content: tabContent
    };

    console.log("CANCER:", payload);
  };

  /* ================= UI ================= */

  return (
    <>
      <div className="blog-admin">

        <h1 style={{ color: "#7c3aed" }}>Add / Edit Cancer Type</h1>

        {/* TITLE */}
        <label>Cancer Name</label>
        <input
          className="blog-title"
          placeholder="Add cancer name here"
          value={cancer.name}
          onChange={(e) =>
            setCancer({ ...cancer, name: e.target.value })
          }
        />

        {/* IMAGE */}
        <label>Cover Image (1200x180 px)</label>
        <div {...getRootProps()} className="hero-upload">
          <input {...getInputProps()} />
          Upload Image
        </div>

        {/* SEO GRID */}
        <div className="seo-grid">
          <div>
            <label>Alt Text</label>
            <input
              placeholder="Add image alt text"
              value={cancer.altText}
              onChange={(e) =>
                setCancer({ ...cancer, altText: e.target.value })
              }
            />
          </div>

          <div>
            <label>SEO Title</label>
            <input
              placeholder="Add title tag here"
              value={cancer.metaTitle}
              onChange={(e) =>
                setCancer({ ...cancer, metaTitle: e.target.value })
              }
            />
          </div>
        </div>

        <div className="seo-grid-full">
          <label>Meta Description</label>
          <textarea
            placeholder="Add meta description"
            value={cancer.metaDescription}
            onChange={(e) =>
              setCancer({ ...cancer, metaDescription: e.target.value })
            }
          />
        </div>

        <label>Slug</label>
        <input
          placeholder="add-your-page-slug-here"
          value={cancer.slug}
          onChange={(e) =>
            setCancer({ ...cancer, slug: e.target.value })
          }
        />

        {/* TABS SLIDER */}
        <div className="tabs-wrapper">

          <button
            className="tab-arrow"
            onClick={() => scrollRef.current.scrollBy({ left: -200 })}
          >‹</button>

          <div className="cancer-tabs-admin" ref={scrollRef}>
            {TABS.map(tab => (
              <button
                key={tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            className="tab-arrow"
            onClick={() => scrollRef.current.scrollBy({ left: 200 })}
          >›</button>

        </div>

        {/* TOOLBAR */}
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

  <button onClick={() => {
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
  }}>
    Image
  </button>
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

        {cancer.faqs.map((f, i) => (
          <div key={i} className="faq-item">
            <div>
              <strong>{f.question}</strong>
              <p>{f.answer}</p>
            </div>
            <button onClick={() => deleteFAQ(i)}>✕</button>
          </div>
        ))}

        {/* BUTTONS */}
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <button className="publish-btn" onClick={() => setPreviewOpen(true)}>
            Preview Changes
          </button>

          <button className="publish-btn" onClick={saveCancer}>
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

            <h1 className="preview-title">{cancer.name}</h1>

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

export default ManageCancers;