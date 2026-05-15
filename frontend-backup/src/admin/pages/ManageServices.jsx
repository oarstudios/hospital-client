// // import { useState, useEffect } from "react";
// // import slugify from "slugify";
// // import { useDropzone } from "react-dropzone";

// // import { EditorContent, useEditor } from "@tiptap/react";

// // import StarterKit from "@tiptap/starter-kit";
// // import Image from "@tiptap/extension-image";
// // import Placeholder from "@tiptap/extension-placeholder";
// // import Highlight from "@tiptap/extension-highlight";
// // import Typography from "@tiptap/extension-typography";
// // import Link from "@tiptap/extension-link";
// // import Underline from "@tiptap/extension-underline";
// // import TextAlign from "@tiptap/extension-text-align";
// // import Dropcursor from "@tiptap/extension-dropcursor";

// // import "./ManageServices.css";

// // const emptyService = {
// //   title: "",
// //   slug: "",
// //   image: null,
// //   altText: "",
// //   metaTitle: "",
// //   metaDescription: "",
// //   faqs: []
// // };

// // const ManageServices = () => {

// //   const [services, setServices] = useState([]);

// //   const [service, setService] = useState(emptyService);

// //   const [faq, setFaq] = useState({
// //     question: "",
// //     answer: ""
// //   });

// //   const [showModal, setShowModal] = useState(false);

// //   const [editId, setEditId] = useState(null);

// //   const [previewOpen, setPreviewOpen] = useState(false);

// //   const [previewHTML, setPreviewHTML] = useState("");

// //   /* ================= IMAGE ================= */

// //   const onDrop = (files) => {
// //     setService({
// //       ...service,
// //       image: files[0]
// //     });
// //   };

// //   const { getRootProps, getInputProps } = useDropzone({
// //     accept: { "image/*": [] },
// //     onDrop
// //   });

// //   /* ================= EDITOR ================= */

// //   const editor = useEditor({

// //     extensions: [
// //       StarterKit,
// //       Image,
// //       Highlight,
// //       Typography,
// //       Underline,
// //       Dropcursor,
// //       Link.configure({ openOnClick: false }),
// //       TextAlign.configure({
// //         types: ["heading", "paragraph"]
// //       }),
// //       Placeholder.configure({
// //         placeholder: "Start writing your service..."
// //       })
// //     ],

// //     content: "",

// //     onUpdate({ editor }) {

// //       const html = editor.getHTML();

// //       setPreviewHTML(html);

// //       localStorage.setItem(
// //         "serviceDraft",
// //         JSON.stringify(editor.getJSON())
// //       );

// //     }

// //   });

// //   useEffect(() => {

// //     if (editor) {

// //       const saved =
// //         localStorage.getItem("serviceDraft");

// //       if (saved) {
// //         editor.commands.setContent(
// //           JSON.parse(saved)
// //         );
// //       }

// //     }

// //   }, [editor]);

// //   if (!editor) return null;

// //   /* ================= ADD IMAGE ================= */

// //   const addImage = () => {

// //     const input = document.createElement("input");

// //     input.type = "file";

// //     input.accept = "image/*";

// //     input.onchange = () => {

// //       const file = input.files[0];

// //       const reader = new FileReader();

// //       reader.onload = () => {

// //         editor
// //           .chain()
// //           .focus()
// //           .setImage({
// //             src: reader.result
// //           })
// //           .run();

// //       };

// //       reader.readAsDataURL(file);

// //     };

// //     input.click();

// //   };

// //   /* ================= FAQ ================= */

// //   const addFAQ = () => {

// //     if (!faq.question || !faq.answer) return;

// //     setService({
// //       ...service,
// //       faqs: [...service.faqs, faq]
// //     });

// //     setFaq({
// //       question: "",
// //       answer: ""
// //     });

// //   };

// //   const deleteFAQ = (index) => {

// //     const updated =
// //       service.faqs.filter((_, i) => i !== index);

// //     setService({
// //       ...service,
// //       faqs: updated
// //     });

// //   };

// //   /* ================= SAVE SERVICE ================= */

// //   const saveService = () => {

// //     const payload = {
// //       id: editId || Date.now(),
// //       ...service,
// //       slug:
// //         service.slug ||
// //         slugify(service.title, {
// //           lower: true
// //         }),
// //       content: editor.getJSON()
// //     };

// //     if (editId) {

// //       setServices(
// //         services.map((s) =>
// //           s.id === editId ? payload : s
// //         )
// //       );

// //     } else {

// //       setServices([...services, payload]);

// //     }

// //     setService(emptyService);

// //     setEditId(null);

// //     editor.commands.clearContent();

// //     setShowModal(false);

// //   };

// //   /* ================= EDIT ================= */

// //   const handleEdit = (item) => {

// //     setEditId(item.id);

// //     setService(item);

// //     setShowModal(true);

// //     if (item.content) {
// //       editor.commands.setContent(item.content);
// //     }

// //   };

// //   /* ================= DELETE ================= */

// //   const handleDelete = (id) => {

// //     if (!window.confirm("Delete service?")) return;

// //     setServices(
// //       services.filter((s) => s.id !== id)
// //     );

// //   };

// //   return (
// //     <>
// //       <div className="admin-centers-page">

// //         {/* HEADER */}

// //         <div className="admin-centers-header">

// //           <h2>Manage Services</h2>

// //           <button
// //             className="admin-add-btn"
// //             onClick={() => {

// //               setService(emptyService);

// //               setEditId(null);

// //               editor.commands.clearContent();

// //               setShowModal(true);

// //             }}
// //           >
// //             + Add Service
// //           </button>

// //         </div>

// //         {/* TABLE */}

// //         <div className="admin-centers-table-wrapper">

// //           <table className="admin-centers-table">

// //             <thead>

// //               <tr>
// //                 <th>Image</th>
// //                 <th>Title</th>
// //                 <th>Slug</th>
// //                 <th>Meta Title</th>
// //                 <th>Actions</th>
// //               </tr>

// //             </thead>

// //             <tbody>

// //               {services.map((item) => (

// //                 <tr key={item.id}>

// //                   <td>

// //                     {item.image && (

// //                       <img
// //                         src={
// //                           typeof item.image === "string"
// //                             ? item.image
// //                             : URL.createObjectURL(item.image)
// //                         }
// //                         className="admin-table-img"
// //                         alt=""
// //                       />

// //                     )}

// //                   </td>

// //                   <td>{item.title}</td>

// //                   <td>{item.slug}</td>

// //                   <td>{item.metaTitle}</td>

// //                   <td className="admin-actions">

// //                     <button
// //                       className="admin-edit-btn"
// //                       onClick={() => handleEdit(item)}
// //                     >
// //                       Edit
// //                     </button>

// //                     <button
// //                       className="admin-delete-btn"
// //                       onClick={() =>
// //                         handleDelete(item.id)
// //                       }
// //                     >
// //                       Delete
// //                     </button>

// //                   </td>

// //                 </tr>

// //               ))}

// //             </tbody>

// //           </table>

// //         </div>

// //       </div>

// //       {/* MODAL */}

// //       {showModal && (

// //         <div className="admin-modal-overlay">

// //           <div className="admin-modal">

// //             <h3>
// //               {editId
// //                 ? "Edit Service"
// //                 : "Add Service"}
// //             </h3>

// //             {/* TITLE */}
// //             <label>Service Title</label>

// //             <input
// //               className="blog-title"
// //               placeholder="Add service title here"
// //               value={service.title}
// //               onChange={(e) =>
// //                 setService({
// //                   ...service,
// //                   title: e.target.value
// //                 })
// //               }
// //             />

// //             {/* COVER IMAGE */}

// //             <label>
// //               Cover Image (1200x180 px)
// //             </label>

// //             <div
// //               {...getRootProps()}
// //               className="hero-upload"
// //             >
// //               <input {...getInputProps()} />
// //               Upload Image
// //             </div>

// //             {service.image && (

// //               <img
// //                 src={
// //                   typeof service.image === "string"
// //                     ? service.image
// //                     : URL.createObjectURL(service.image)
// //                 }
// //                 className="hero-preview"
// //                 alt=""
// //               />

// //             )}

// //             {/* ALT */}

// //             <label>Alt Text</label>

// //             <input
// //               placeholder="Add image Alt Text here"
// //               value={service.altText}
// //               onChange={(e) =>
// //                 setService({
// //                   ...service,
// //                   altText: e.target.value
// //                 })
// //               }
// //             />

// //             {/* SEO */}

// //             <label>SEO Title</label>

// //             <input
// //               placeholder="Add title tag here"
// //               value={service.metaTitle}
// //               onChange={(e) =>
// //                 setService({
// //                   ...service,
// //                   metaTitle: e.target.value
// //                 })
// //               }
// //             />

// //             <label>Meta Description</label>

// //             <textarea
// //               placeholder="Add meta description here"
// //               value={service.metaDescription}
// //               onChange={(e) =>
// //                 setService({
// //                   ...service,
// //                   metaDescription: e.target.value
// //                 })
// //               }
// //             />

// //             {/* SLUG */}

// //             <label>Slug</label>

// //             <input
// //               placeholder="add-your-page-slug-here"
// //               value={service.slug}
// //               onChange={(e) =>
// //                 setService({
// //                   ...service,
// //                   slug: e.target.value
// //                 })
// //               }
// //             />

// //             {/* TOOLBAR */}

// //             <div className="editor-toolbar">

// //               <button onClick={() => editor.chain().focus().toggleBold().run()}>
// //                 <b>B</b>
// //               </button>

// //               <button onClick={() => editor.chain().focus().toggleItalic().run()}>
// //                 <i>I</i>
// //               </button>

// //               <button onClick={() => editor.chain().focus().toggleUnderline().run()}>
// //                 <u>U</u>
// //               </button>

// //               <button onClick={() => editor.chain().focus().toggleStrike().run()}>
// //                 S
// //               </button>

// //               <button onClick={() => editor.chain().focus().toggleHighlight().run()}>
// //                 Highlight
// //               </button>

// //               <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
// //                 H1
// //               </button>

// //               <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
// //                 H2
// //               </button>

// //               <button onClick={() => editor.chain().focus().setParagraph().run()}>
// //                 P
// //               </button>

// //               <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
// //                 • List
// //               </button>

// //               <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
// //                 1. List
// //               </button>

// //               <button onClick={() => editor.chain().focus().setTextAlign("left").run()}>
// //                 Left
// //               </button>

// //               <button onClick={() => editor.chain().focus().setTextAlign("center").run()}>
// //                 Center
// //               </button>

// //               <button onClick={() => editor.chain().focus().setTextAlign("right").run()}>
// //                 Right
// //               </button>

// //               <button
// //                 onClick={() => {

// //                   const url = prompt("Enter URL");

// //                   if (url) {

// //                     editor
// //                       .chain()
// //                       .focus()
// //                       .setLink({ href: url })
// //                       .run();

// //                   }

// //                 }}
// //               >
// //                 Link
// //               </button>

// //               <button onClick={addImage}>
// //                 Image
// //               </button>

// //             </div>

// //             {/* EDITOR */}

// //             <EditorContent
// //               editor={editor}
// //               className="notion-editor"
// //             />

// //             {/* FAQ */}

// //             <h3 style={{ marginTop: "40px" }}>
// //               FAQS
// //             </h3>

// //             <input
// //               placeholder="Write your question here"
// //               value={faq.question}
// //               onChange={(e) =>
// //                 setFaq({
// //                   ...faq,
// //                   question: e.target.value
// //                 })
// //               }
// //             />

// //             <textarea
// //               placeholder="Write your answer here"
// //               value={faq.answer}
// //               onChange={(e) =>
// //                 setFaq({
// //                   ...faq,
// //                   answer: e.target.value
// //                 })
// //               }
// //             />

// //             <button
// //               className="publish-btn"
// //               onClick={addFAQ}
// //             >
// //               Add +
// //             </button>

// //             {/* FAQ LIST */}

// //             {service.faqs.map((f, i) => (

// //               <div key={i} className="faq-item">

// //                 <div>
// //                   <strong>{f.question}</strong>
// //                   <p>{f.answer}</p>
// //                 </div>

// //                 <button onClick={() => deleteFAQ(i)}>
// //                   ❌
// //                 </button>

// //               </div>

// //             ))}

// //             {/* ACTIONS */}

// //             <div className="admin-modal-actions">

// //               <button
// //                 className="admin-submit-btn"
// //                 onClick={saveService}
// //               >
// //                 {editId
// //                   ? "Update Service"
// //                   : "Create Service"}
// //               </button>

// //               <button
// //                 className="admin-cancel-btn"
// //                 onClick={() =>
// //                   setShowModal(false)
// //                 }
// //               >
// //                 Cancel
// //               </button>

// //               <button
// //                 className="publish-btn"
// //                 onClick={() =>
// //                   setPreviewOpen(true)
// //                 }
// //               >
// //                 Preview
// //               </button>

// //             </div>

// //           </div>

// //         </div>

// //       )}

// //       {/* PREVIEW */}

// //       {previewOpen && (

// //         <div className="blog-preview-modal">

// //           <div className="blog-preview-container">

// //             <button
// //               className="preview-close"
// //               onClick={() =>
// //                 setPreviewOpen(false)
// //               }
// //             >
// //               Close Preview
// //             </button>

// //             {service.image && (

// //               <img
// //                 src={
// //                   typeof service.image === "string"
// //                     ? service.image
// //                     : URL.createObjectURL(service.image)
// //                 }
// //                 className="preview-hero"
// //                 alt=""
// //               />

// //             )}

// //             <h1 className="preview-title">
// //               {service.title || "Service Title"}
// //             </h1>

// //             <div
// //               className="preview-body"
// //               dangerouslySetInnerHTML={{
// //                 __html: previewHTML
// //               }}
// //             />

// //           </div>

// //         </div>

// //       )}
// //     </>
// //   );

// // };

// // export default ManageServices;











// import { useState, useEffect } from "react";
// import slugify from "slugify";
// import { useDropzone } from "react-dropzone";

// import { EditorContent, useEditor } from "@tiptap/react";

// import StarterKit from "@tiptap/starter-kit";
// import Image from "@tiptap/extension-image";
// import Placeholder from "@tiptap/extension-placeholder";
// import Highlight from "@tiptap/extension-highlight";
// import Typography from "@tiptap/extension-typography";
// import Link from "@tiptap/extension-link";
// import Underline from "@tiptap/extension-underline";
// import TextAlign from "@tiptap/extension-text-align";
// import Dropcursor from "@tiptap/extension-dropcursor";

// import "./ManageServices.css";

// // ✅ Change this to your actual backend base URL
// const API_BASE = "http://localhost:3001";

// const emptyService = {
//   title: "",
//   slug: "",
//   image: null,
//   altText: "",
//   metaTitle: "",
//   metaDescription: "",
//   faqs: []
// };

// const ManageServices = () => {

//   const [services, setServices] = useState([]);
//   const [service, setService] = useState(emptyService);
//   const [faq, setFaq] = useState({ question: "", answer: "" });
//   const [showModal, setShowModal] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewHTML, setPreviewHTML] = useState("");

//   // ✅ NEW: track uploading state so the toolbar button shows feedback
//   const [imageUploading, setImageUploading] = useState(false);

//   /* ================= IMAGE (cover) ================= */

//   const onDrop = (files) => {
//     setService({ ...service, image: files[0] });
//   };

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: { "image/*": [] },
//     onDrop
//   });

//   /* ================= EDITOR ================= */

//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Image,
//       Highlight,
//       Typography,
//       Underline,
//       Dropcursor,
//       Link.configure({ openOnClick: false }),
//       TextAlign.configure({ types: ["heading", "paragraph"] }),
//       Placeholder.configure({ placeholder: "Start writing your service..." })
//     ],
//     content: "",
//     onUpdate({ editor }) {
//       const html = editor.getHTML();
//       setPreviewHTML(html);
//       localStorage.setItem("serviceDraft", JSON.stringify(editor.getJSON()));
//     }
//   });

//   useEffect(() => {
//     if (editor) {
//       const saved = localStorage.getItem("serviceDraft");
//       if (saved) {
//         editor.commands.setContent(JSON.parse(saved));
//       }
//     }
//   }, [editor]);

//   if (!editor) return null;

//   /* ================= ADD IMAGE (inline editor) ================= */

//   // ✅ CHANGED: was using FileReader + base64. Now uploads to backend
//   //    and inserts the returned URL so the DB stores a small string
//   //    instead of a huge base64 blob.
//   const addImage = () => {

//     const input = document.createElement("input");
//     input.type = "file";
//     input.accept = "image/*";

//     input.onchange = async () => {

//       const file = input.files[0];
//       if (!file) return;

//       // Show loading state on the toolbar button
//       setImageUploading(true);

//       try {

//         const form = new FormData();
//         form.append("file", file);

//         const res = await fetch(`${API_BASE}/services/upload-content-image`, {
//           method: "POST",
//           body: form
//         });

//         if (!res.ok) throw new Error("Upload failed");

//         const data = await res.json();

//         // data.url = "http://localhost:3001/uploads/1234567-image.png"
//         editor.chain().focus().setImage({ src: data.url }).run();

//       } catch (err) {
//         console.error("Image upload failed:", err);
//         alert("Image upload failed. Please try again.");
//       } finally {
//         setImageUploading(false);
//       }

//     };

//     input.click();

//   };

//   /* ================= FAQ ================= */

//   const addFAQ = () => {
//     if (!faq.question || !faq.answer) return;
//     setService({ ...service, faqs: [...service.faqs, faq] });
//     setFaq({ question: "", answer: "" });
//   };

//   const deleteFAQ = (index) => {
//     setService({ ...service, faqs: service.faqs.filter((_, i) => i !== index) });
//   };

//   /* ================= SAVE SERVICE ================= */

//   const saveService = async () => {

//     try {

//       const form = new FormData();

//       form.append("slug", service.slug || slugify(service.title, { lower: true }));
//       form.append("title", service.title);
//       form.append("altText", service.altText || "");
//       form.append("seoTitle", service.metaTitle || "");
//       form.append("metaDescription", service.metaDescription || "");

//       // ✅ Send HTML string — images inside are already hosted URLs
//       form.append("content", editor.getHTML());

//       // ✅ Cover image — only append if it's a new File (not an existing URL string)
//       if (service.image instanceof File) {
//         form.append("coverImage", service.image);
//       }

//       // ✅ FAQs as JSON string (backend parseFaqs handles this)
//       form.append("faqs", JSON.stringify(service.faqs));

//       const url = editId
//         ? `${API_BASE}/services/${editId}`
//         : `${API_BASE}/services`;

//       const method = editId ? "PUT" : "POST";

//       const res = await fetch(url, { method, body: form });

//       if (!res.ok) throw new Error("Save failed");

//       const data = await res.json();

//       // Update local list
//       if (editId) {
//         setServices(services.map((s) => s.id === editId ? data.data : s));
//       } else {
//         setServices([...services, data.data]);
//       }

//       // Reset
//       setService(emptyService);
//       setEditId(null);
//       editor.commands.clearContent();
//       localStorage.removeItem("serviceDraft");
//       setShowModal(false);

//     } catch (err) {
//       console.error("Save service failed:", err);
//       alert("Failed to save service. Please try again.");
//     }

//   };

//   /* ================= EDIT ================= */

//   const handleEdit = (item) => {
//     setEditId(item.id);
//     setService({
//       ...item,
//       // coverImage from backend is a URL string — keep it as-is
//       image: item.coverImage || null,
//       metaTitle: item.seoTitle || ""
//     });
//     setShowModal(true);
//     if (item.content) {
//       // content is HTML string from backend
//       editor.commands.setContent(item.content);
//     }
//   };

//   /* ================= DELETE ================= */

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete service?")) return;
//     try {
//       await fetch(`${API_BASE}/services/${id}`, { method: "DELETE" });
//       setServices(services.filter((s) => s.id !== id));
//     } catch (err) {
//       alert("Failed to delete service.");
//     }
//   };

//   /* ================= FETCH ON MOUNT ================= */

//   useEffect(() => {
//     fetch(`${API_BASE}/services`)
//       .then((r) => r.json())
//       .then((data) => setServices(data.data || []))
//       .catch(console.error);
//   }, []);

//   return (
//     <>
//       <div className="admin-centers-page">

//         {/* HEADER */}
//         <div className="admin-centers-header">
//           <h2>Manage Services</h2>
//           <button
//             className="admin-add-btn"
//             onClick={() => {
//               setService(emptyService);
//               setEditId(null);
//               editor.commands.clearContent();
//               setShowModal(true);
//             }}
//           >
//             + Add Service
//           </button>
//         </div>

//         {/* TABLE */}
//         <div className="admin-centers-table-wrapper">
//           <table className="admin-centers-table">
//             <thead>
//               <tr>
//                 <th>Image</th>
//                 <th>Title</th>
//                 <th>Slug</th>
//                 <th>Meta Title</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {services.map((item) => (
//                 <tr key={item.id}>
//                   <td>
//                     {item.coverImage && (
//                       <img
//                         src={
//                           item.coverImage.startsWith("/")
//                             ? `${API_BASE}${item.coverImage}`
//                             : item.coverImage
//                         }
//                         className="admin-table-img"
//                         alt=""
//                       />
//                     )}
//                   </td>
//                   <td>{item.title}</td>
//                   <td>{item.slug}</td>
//                   <td>{item.seoTitle}</td>
//                   <td className="admin-actions">
//                     <button className="admin-edit-btn" onClick={() => handleEdit(item)}>
//                       Edit
//                     </button>
//                     <button className="admin-delete-btn" onClick={() => handleDelete(item.id)}>
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//       </div>

//       {/* MODAL */}
//       {showModal && (
//         <div className="admin-modal-overlay">
//           <div className="admin-modal">

//             <h3>{editId ? "Edit Service" : "Add Service"}</h3>

//             {/* TITLE */}
//             <label>Service Title</label>
//             <input
//               className="blog-title"
//               placeholder="Add service title here"
//               value={service.title}
//               onChange={(e) => setService({ ...service, title: e.target.value })}
//             />

//             {/* COVER IMAGE */}
//             <label>Cover Image (1200x180 px)</label>
//             <div {...getRootProps()} className="hero-upload">
//               <input {...getInputProps()} />
//               Upload Image
//             </div>
//             {service.image && (
//               <img
//                 src={
//                   service.image instanceof File
//                     ? URL.createObjectURL(service.image)
//                     : service.image.startsWith("/")
//                       ? `${API_BASE}${service.image}`
//                       : service.image
//                 }
//                 className="hero-preview"
//                 alt=""
//               />
//             )}

//             {/* ALT */}
//             <label>Alt Text</label>
//             <input
//               placeholder="Add image Alt Text here"
//               value={service.altText}
//               onChange={(e) => setService({ ...service, altText: e.target.value })}
//             />

//             {/* SEO */}
//             <label>SEO Title</label>
//             <input
//               placeholder="Add title tag here"
//               value={service.metaTitle}
//               onChange={(e) => setService({ ...service, metaTitle: e.target.value })}
//             />

//             <label>Meta Description</label>
//             <textarea
//               placeholder="Add meta description here"
//               value={service.metaDescription}
//               onChange={(e) => setService({ ...service, metaDescription: e.target.value })}
//             />

//             {/* SLUG */}
//             <label>Slug</label>
//             <input
//               placeholder="add-your-page-slug-here"
//               value={service.slug}
//               onChange={(e) => setService({ ...service, slug: e.target.value })}
//             />

//             {/* TOOLBAR */}
//             <div className="editor-toolbar">
//               <button onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></button>
//               <button onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
//               <button onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></button>
//               <button onClick={() => editor.chain().focus().toggleStrike().run()}>S</button>
//               <button onClick={() => editor.chain().focus().toggleHighlight().run()}>Highlight</button>
//               <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
//               <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
//               <button onClick={() => editor.chain().focus().setParagraph().run()}>P</button>
//               <button onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
//               <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
//               <button onClick={() => editor.chain().focus().setTextAlign("left").run()}>Left</button>
//               <button onClick={() => editor.chain().focus().setTextAlign("center").run()}>Center</button>
//               <button onClick={() => editor.chain().focus().setTextAlign("right").run()}>Right</button>
//               <button
//                 onClick={() => {
//                   const url = prompt("Enter URL");
//                   if (url) editor.chain().focus().setLink({ href: url }).run();
//                 }}
//               >
//                 Link
//               </button>

//               {/* ✅ CHANGED: shows uploading state */}
//               <button onClick={addImage} disabled={imageUploading}>
//                 {imageUploading ? "Uploading..." : "Image"}
//               </button>
//             </div>

//             {/* EDITOR */}
//             <EditorContent editor={editor} className="notion-editor" />

//             {/* FAQ */}
//             <h3 style={{ marginTop: "40px" }}>FAQS</h3>
//             <input
//               placeholder="Write your question here"
//               value={faq.question}
//               onChange={(e) => setFaq({ ...faq, question: e.target.value })}
//             />
//             <textarea
//               placeholder="Write your answer here"
//               value={faq.answer}
//               onChange={(e) => setFaq({ ...faq, answer: e.target.value })}
//             />
//             <button className="publish-btn" onClick={addFAQ}>Add +</button>

//             {/* FAQ LIST */}
//             {service.faqs.map((f, i) => (
//               <div key={i} className="faq-item">
//                 <div>
//                   <strong>{f.question}</strong>
//                   <p>{f.answer}</p>
//                 </div>
//                 <button onClick={() => deleteFAQ(i)}>❌</button>
//               </div>
//             ))}

//             {/* ACTIONS */}
//             <div className="admin-modal-actions">
//               <button className="admin-submit-btn" onClick={saveService}>
//                 {editId ? "Update Service" : "Create Service"}
//               </button>
//               <button className="admin-cancel-btn" onClick={() => setShowModal(false)}>
//                 Cancel
//               </button>
//               <button className="publish-btn" onClick={() => setPreviewOpen(true)}>
//                 Preview
//               </button>
//             </div>

//           </div>
//         </div>
//       )}

//       {/* PREVIEW */}
//       {previewOpen && (
//         <div className="blog-preview-modal">
//           <div className="blog-preview-container">
//             <button className="preview-close" onClick={() => setPreviewOpen(false)}>
//               Close Preview
//             </button>
//             {service.image && (
//               <img
//                 src={
//                   service.image instanceof File
//                     ? URL.createObjectURL(service.image)
//                     : service.image.startsWith("/")
//                       ? `${API_BASE}${service.image}`
//                       : service.image
//                 }
//                 className="preview-hero"
//                 alt=""
//               />
//             )}
//             <h1 className="preview-title">{service.title || "Service Title"}</h1>
//             <div className="preview-body" dangerouslySetInnerHTML={{ __html: previewHTML }} />
//           </div>
//         </div>
//       )}
//     </>
//   );

// };

// export default ManageServices;










import { useState, useEffect } from "react";
import slugify from "slugify";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";

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

import {
  fetchServices,
  createService,
  updateService,
  deleteService,
} from "../../redux/services/servicesSlice";

import axiosInstance from "../../app/axiosinstance";

// ── Toast ──────────────────────────────────────────────────────────────────────
import { showToast } from "../../redux/toast/toastSlice";
// withToast wraps dispatch so thunks can carry toast config inline
import { withToast } from "../../middleware/Toastmiddleware";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const emptyService = {
  title: "",
  slug: "",
  image: null,
  altText: "",
  metaTitle: "",
  metaDescription: "",
  faqs: [],
};

/* ─── Main Component ──────────────────────────────────────────────────────── */

const ManageServices = () => {
  const rawDispatch = useDispatch();
  // toastDispatch is drop-in for dispatch — adds optional toast config support
  const dispatch = withToast(rawDispatch);

  const { list: services = [], loading, error } = useSelector((s) => s.services);

  const [service, setService] = useState(emptyService);
  const [faq, setFaq] = useState({ question: "", answer: "" });
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHTML, setPreviewHTML] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  /* ── Fetch on mount ─────────────────────────────────────────────────────── */

  useEffect(() => {
    // fetch is silent — no toast needed for initial load
    dispatch(fetchServices());
  }, []);                          // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Cover image dropzone ───────────────────────────────────────────────── */

  const onDrop = (files) => {
    setService((prev) => ({ ...prev, image: files[0] }));
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
  });

  /* ── TipTap editor ──────────────────────────────────────────────────────── */

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
      Placeholder.configure({ placeholder: "Start writing your service..." }),
    ],
    content: "",
    onUpdate({ editor }) {
      const html = editor.getHTML();
      setPreviewHTML(html);
    },
  });

  /* ── Inline image upload (inside editor) ────────────────────────────────── */

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      setImageUploading(true);
      try {
        const form = new FormData();
        form.append("file", file);
        const res = await axiosInstance.post("/services/upload-content-image", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const url = res.data?.data?.url || res.data?.url;
        if (url) editor.chain().focus().setImage({ src: url }).run();
      } catch {
        // Image upload is a direct axios call (not a thunk) — dispatch toast manually
        rawDispatch(showToast.error("Image upload failed. Please try again."));
      } finally {
        setImageUploading(false);
      }
    };

    input.click();
  };

  /* ── FAQ ────────────────────────────────────────────────────────────────── */

  const addFAQ = () => {
    if (!faq.question || !faq.answer) return;
    setService((prev) => ({ ...prev, faqs: [...prev.faqs, faq] }));
    setFaq({ question: "", answer: "" });
  };

  const deleteFAQ = (index) => {
    setService((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  /* ── Save (create or update) ────────────────────────────────────────────── */

  const saveService = async () => {
    if (!service.title) {
      rawDispatch(showToast.warning("Title is required."));
      return;
    }

    try {
      const formData = new FormData();

      formData.append("slug", service.slug || slugify(service.title, { lower: true, strict: true }));
      formData.append("title", service.title);
      formData.append("altText", service.altText || "");
      formData.append("seoTitle", service.metaTitle || "");
      formData.append("metaDescription", service.metaDescription || "");
      formData.append("content", editor ? editor.getHTML() : "");
      formData.append("faqs", JSON.stringify(service.faqs));

      if (service.image instanceof File) {
        formData.append("coverImage", service.image);
      }

      if (editId) {
        // Toast opt-in: success message + auto-use rejected payload on error
        await dispatch(
          updateService({ id: editId, formData }),
          { toast: { success: "Service updated successfully!", error: true } },
        ).unwrap();
      } else {
        await dispatch(
          createService(formData),
          { toast: { success: "Service created successfully!", error: true } },
        ).unwrap();
      }

      // Reset form
      setService(emptyService);
      setEditId(null);
      if (editor) editor.commands.clearContent();
      setShowModal(false);
    } catch {
      // Error toast already fired by the middleware via error: true above.
      // Nothing extra needed here — swallow the thrown rejection silently.
    }
  };

  /* ── Edit ───────────────────────────────────────────────────────────────── */

  const handleEdit = (item) => {
    setEditId(item.id);
    setService({
      ...item,
      image: item.coverImage || null,
      metaTitle: item.seoTitle || "",
    });
    setShowModal(true);
    if (editor && item.content) {
      editor.commands.setContent(item.content);
    }
  };

  /* ── Delete ─────────────────────────────────────────────────────────────── */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete service?")) return;
    try {
      await dispatch(
        deleteService(id),
        { toast: { success: "Service deleted.", error: true } },
      ).unwrap();
    } catch {
      // Error toast fired by middleware via error: true above.
    }
  };

  /* ── Image src helper ───────────────────────────────────────────────────── */

  const imgSrc = (path) => {
    if (!path) return null;
    if (path instanceof File) return URL.createObjectURL(path);
    return path.startsWith("http") ? path : `${API_BASE}${path}`;
  };

  /* ── Render ─────────────────────────────────────────────────────────────── */

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
              if (editor) editor.commands.clearContent();
              setShowModal(true);
            }}
          >
            + Add Service
          </button>
        </div>

        {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}

        {/* TABLE */}
        <div className="admin-centers-table-wrapper">
          <table className="admin-centers-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Slug</th>
                <th>SEO Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>Loading...</td>
                </tr>
              )}
              {!loading && Array.isArray(services) && services.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.coverImage && (
                      <img
                        src={imgSrc(item.coverImage)}
                        className="admin-table-img"
                        alt=""
                      />
                    )}
                  </td>
                  <td>{item.title}</td>
                  <td>{item.slug}</td>
                  <td>{item.seoTitle}</td>
                  <td className="admin-actions">
                    <button className="admin-edit-btn" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                    <button className="admin-delete-btn" onClick={() => handleDelete(item.id)}>
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
            <h3>{editId ? "Edit Service" : "Add Service"}</h3>

            {/* TITLE */}
            <label>Service Title</label>
            <input
              className="blog-title"
              placeholder="Add service title here"
              value={service.title}
              onChange={(e) => setService((p) => ({ ...p, title: e.target.value }))}
            />

            {/* COVER IMAGE */}
            <label>Cover Image</label>
            <div {...getRootProps()} className="hero-upload">
              <input {...getInputProps()} />
              Upload Image
            </div>
            {service.image && (
              <img src={imgSrc(service.image)} className="hero-preview" alt="" />
            )}

            {/* ALT */}
            <label>Alt Text</label>
            <input
              placeholder="Add image alt text here"
              value={service.altText}
              onChange={(e) => setService((p) => ({ ...p, altText: e.target.value }))}
            />

            {/* SEO */}
            <label>SEO Title</label>
            <input
              placeholder="Add title tag here"
              value={service.metaTitle}
              onChange={(e) => setService((p) => ({ ...p, metaTitle: e.target.value }))}
            />

            <label>Meta Description</label>
            <textarea
              placeholder="Add meta description here"
              value={service.metaDescription}
              onChange={(e) => setService((p) => ({ ...p, metaDescription: e.target.value }))}
            />

            {/* SLUG */}
            <label>Slug</label>
            <input
              placeholder="add-your-page-slug-here"
              value={service.slug}
              onChange={(e) => setService((p) => ({ ...p, slug: e.target.value }))}
            />

            {/* TOOLBAR */}
            {editor && (
              <div className="editor-toolbar">
                <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></button>
                <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
                <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></button>
                <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()}>S</button>
                <button type="button" onClick={() => editor.chain().focus().toggleHighlight().run()}>Highlight</button>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
                <button type="button" onClick={() => editor.chain().focus().setParagraph().run()}>P</button>
                <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
                <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
                <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()}>Left</button>
                <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()}>Center</button>
                <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()}>Right</button>
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt("Enter URL");
                    if (url) editor.chain().focus().setLink({ href: url }).run();
                  }}
                >
                  Link
                </button>
                <button type="button" onClick={addImage} disabled={imageUploading}>
                  {imageUploading ? "Uploading..." : "Image"}
                </button>
              </div>
            )}

            {/* EDITOR */}
            <EditorContent editor={editor} className="notion-editor" />

            {/* FAQ */}
            <h3 style={{ marginTop: "40px" }}>FAQs</h3>
            <input
              placeholder="Write your question here"
              value={faq.question}
              onChange={(e) => setFaq((p) => ({ ...p, question: e.target.value }))}
            />
            <textarea
              placeholder="Write your answer here"
              value={faq.answer}
              onChange={(e) => setFaq((p) => ({ ...p, answer: e.target.value }))}
            />
            <button className="publish-btn" type="button" onClick={addFAQ}>Add +</button>

            {service.faqs.map((f, i) => (
              <div key={i} className="faq-item">
                <div>
                  <strong>{f.question}</strong>
                  <p>{f.answer}</p>
                </div>
                <button type="button" onClick={() => deleteFAQ(i)}>❌</button>
              </div>
            ))}

            {/* ACTIONS */}
            <div className="admin-modal-actions">
              <button
                className="admin-submit-btn"
                type="button"
                onClick={saveService}
                disabled={loading}
              >
                {loading ? "Saving..." : editId ? "Update Service" : "Create Service"}
              </button>
              <button
                className="admin-cancel-btn"
                type="button"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="publish-btn"
                type="button"
                onClick={() => setPreviewOpen(true)}
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
              type="button"
              onClick={() => setPreviewOpen(false)}
            >
              Close Preview
            </button>
            {service.image && (
              <img src={imgSrc(service.image)} className="preview-hero" alt="" />
            )}
            <h1 className="preview-title">{service.title || "Service Title"}</h1>
            <div className="preview-body" dangerouslySetInnerHTML={{ __html: previewHTML }} />
          </div>
        </div>
      )}
    </>
  );
};

export default ManageServices;