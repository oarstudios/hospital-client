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

const emptyService = {
  title: "",
  slug: "",
  image: null,
  altText: "",
  metaTitle: "",
  metaDescription: "",
  faqs: []
};

const ManageServices = () => {

  const [services, setServices] = useState([]);

  const [service, setService] = useState(emptyService);

  const [faq, setFaq] = useState({
    question: "",
    answer: ""
  });

  const [showModal, setShowModal] = useState(false);

  const [editId, setEditId] = useState(null);

  const [previewOpen, setPreviewOpen] = useState(false);

  const [previewHTML, setPreviewHTML] = useState("");

  /* ================= IMAGE ================= */

  const onDrop = (files) => {
    setService({
      ...service,
      image: files[0]
    });
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
      TextAlign.configure({
        types: ["heading", "paragraph"]
      }),
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

  useEffect(() => {

    if (editor) {

      const saved =
        localStorage.getItem("serviceDraft");

      if (saved) {
        editor.commands.setContent(
          JSON.parse(saved)
        );
      }

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

  /* ================= FAQ ================= */

  const addFAQ = () => {

    if (!faq.question || !faq.answer) return;

    setService({
      ...service,
      faqs: [...service.faqs, faq]
    });

    setFaq({
      question: "",
      answer: ""
    });

  };

  const deleteFAQ = (index) => {

    const updated =
      service.faqs.filter((_, i) => i !== index);

    setService({
      ...service,
      faqs: updated
    });

  };

  /* ================= SAVE SERVICE ================= */

  const saveService = () => {

    const payload = {
      id: editId || Date.now(),
      ...service,
      slug:
        service.slug ||
        slugify(service.title, {
          lower: true
        }),
      content: editor.getJSON()
    };

    if (editId) {

      setServices(
        services.map((s) =>
          s.id === editId ? payload : s
        )
      );

    } else {

      setServices([...services, payload]);

    }

    setService(emptyService);

    setEditId(null);

    editor.commands.clearContent();

    setShowModal(false);

  };

  /* ================= EDIT ================= */

  const handleEdit = (item) => {

    setEditId(item.id);

    setService(item);

    setShowModal(true);

    if (item.content) {
      editor.commands.setContent(item.content);
    }

  };

  /* ================= DELETE ================= */

  const handleDelete = (id) => {

    if (!window.confirm("Delete service?")) return;

    setServices(
      services.filter((s) => s.id !== id)
    );

  };

  return (
    <>
      <div className="admin-centers-page">

        {/* HEADER */}

        <div className="admin-centers-header">

          <h2>Manage Services</h2>

          <button
            className="admin-add-btn"
            onClick={() => {

              setService(emptyService);

              setEditId(null);

              editor.commands.clearContent();

              setShowModal(true);

            }}
          >
            + Add Service
          </button>

        </div>

        {/* TABLE */}

        <div className="admin-centers-table-wrapper">

          <table className="admin-centers-table">

            <thead>

              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Slug</th>
                <th>Meta Title</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {services.map((item) => (

                <tr key={item.id}>

                  <td>

                    {item.image && (

                      <img
                        src={
                          typeof item.image === "string"
                            ? item.image
                            : URL.createObjectURL(item.image)
                        }
                        className="admin-table-img"
                        alt=""
                      />

                    )}

                  </td>

                  <td>{item.title}</td>

                  <td>{item.slug}</td>

                  <td>{item.metaTitle}</td>

                  <td className="admin-actions">

                    <button
                      className="admin-edit-btn"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="admin-delete-btn"
                      onClick={() =>
                        handleDelete(item.id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* MODAL */}

      {showModal && (

        <div className="admin-modal-overlay">

          <div className="admin-modal">

            <h3>
              {editId
                ? "Edit Service"
                : "Add Service"}
            </h3>

            {/* TITLE */}
            <label>Service Title</label>

            <input
              className="blog-title"
              placeholder="Add service title here"
              value={service.title}
              onChange={(e) =>
                setService({
                  ...service,
                  title: e.target.value
                })
              }
            />

            {/* COVER IMAGE */}

            <label>
              Cover Image (1200x180 px)
            </label>

            <div
              {...getRootProps()}
              className="hero-upload"
            >
              <input {...getInputProps()} />
              Upload Image
            </div>

            {service.image && (

              <img
                src={
                  typeof service.image === "string"
                    ? service.image
                    : URL.createObjectURL(service.image)
                }
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
                setService({
                  ...service,
                  altText: e.target.value
                })
              }
            />

            {/* SEO */}

            <label>SEO Title</label>

            <input
              placeholder="Add title tag here"
              value={service.metaTitle}
              onChange={(e) =>
                setService({
                  ...service,
                  metaTitle: e.target.value
                })
              }
            />

            <label>Meta Description</label>

            <textarea
              placeholder="Add meta description here"
              value={service.metaDescription}
              onChange={(e) =>
                setService({
                  ...service,
                  metaDescription: e.target.value
                })
              }
            />

            {/* SLUG */}

            <label>Slug</label>

            <input
              placeholder="add-your-page-slug-here"
              value={service.slug}
              onChange={(e) =>
                setService({
                  ...service,
                  slug: e.target.value
                })
              }
            />

            {/* TOOLBAR */}

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
                      .setLink({ href: url })
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

            {/* EDITOR */}

            <EditorContent
              editor={editor}
              className="notion-editor"
            />

            {/* FAQ */}

            <h3 style={{ marginTop: "40px" }}>
              FAQS
            </h3>

            <input
              placeholder="Write your question here"
              value={faq.question}
              onChange={(e) =>
                setFaq({
                  ...faq,
                  question: e.target.value
                })
              }
            />

            <textarea
              placeholder="Write your answer here"
              value={faq.answer}
              onChange={(e) =>
                setFaq({
                  ...faq,
                  answer: e.target.value
                })
              }
            />

            <button
              className="publish-btn"
              onClick={addFAQ}
            >
              Add +
            </button>

            {/* FAQ LIST */}

            {service.faqs.map((f, i) => (

              <div key={i} className="faq-item">

                <div>
                  <strong>{f.question}</strong>
                  <p>{f.answer}</p>
                </div>

                <button onClick={() => deleteFAQ(i)}>
                  ❌
                </button>

              </div>

            ))}

            {/* ACTIONS */}

            <div className="admin-modal-actions">

              <button
                className="admin-submit-btn"
                onClick={saveService}
              >
                {editId
                  ? "Update Service"
                  : "Create Service"}
              </button>

              <button
                className="admin-cancel-btn"
                onClick={() =>
                  setShowModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="publish-btn"
                onClick={() =>
                  setPreviewOpen(true)
                }
              >
                Preview
              </button>

            </div>

          </div>

        </div>

      )}

      {/* PREVIEW */}

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

            {service.image && (

              <img
                src={
                  typeof service.image === "string"
                    ? service.image
                    : URL.createObjectURL(service.image)
                }
                className="preview-hero"
                alt=""
              />

            )}

            <h1 className="preview-title">
              {service.title || "Service Title"}
            </h1>

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

export default ManageServices;