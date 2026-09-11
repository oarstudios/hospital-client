import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCenters,
  createCenter,
  updateCenter,
  deleteCenter,
} from "../../redux/centers/centersSlice";
import FieldError from "../../components/Common/FieldError";
import useConfirmDialog from "../../components/Common/useConfirmDialog";
import { notifyFirstError, clearField, CENTER_AREAS, getSelectError } from "../../components/Common/formFeedback";

import "./ManageCenters.css";

// ✅ Fix 1: No more hardcoded localhost — reads from env at build time
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const emptyForm = {
  slug: "",
  name: "",
  fullName: "",
  rating: "",
  reviews: "",
  phone: "",
  lat: "",
  lng: "",
  mapEmbed: "",
  mapQuery: "",
  mapLink: "",
  area: "",
  address: "",
  timing: "",
  heroBg: null,
  image: null,
  description: "",
  gallery: [],
};

const ManageCenters = () => {
  const dispatch = useDispatch();

  const { list = [], loading } = useSelector((state) => state.centers || {});
  const centers = Array.isArray(list) ? list : [];

  const [form, setForm]             = useState(emptyForm);
  const [showModal, setShowModal]   = useState(false);
  const [editId, setEditId]         = useState(null);
  const [dragIndex, setDragIndex]   = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [confirm, confirmDialog] = useConfirmDialog();

  /* ================= FETCH CENTERS ================= */

  useEffect(() => {
    dispatch(fetchCenters());
  }, [dispatch]);

  /* ================= INPUT CHANGE ================= */

  const handleChange = (e) => {
    clearField(setErrors, e.target.name);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= IMAGE UPLOAD ================= */

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, [field]: { file, url: URL.createObjectURL(file) } });
  };

  /* ================= GALLERY ================= */

  const handleGalleryUpload = (e) => {
    const images = Array.from(e.target.files).map((file) => ({
      file,
      // Store the File object reference — the blob URL is only used for preview
      // inside this render cycle. When we submit we read from .file, so even if
      // the blob URL were revoked the upload still works.
      url: URL.createObjectURL(file),
    }));
    setForm((prev) => ({ ...prev, gallery: [...prev.gallery, ...images] }));
    // Reset the input so the same file can be re-selected if needed
    e.target.value = "";
  };

  const removeGalleryImage = (index) => {
    const newGallery = [...form.gallery];
    newGallery.splice(index, 1);
    setForm({ ...form, gallery: newGallery });
  };

  /* ================= CREATE / UPDATE ================= */

  const handleSubmit = async () => {
    const nextErrors = {};
    if (!form.slug.trim()) nextErrors.slug = "Slug is required.";
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (form.rating && (Number(form.rating) < 0 || Number(form.rating) > 5)) {
      nextErrors.rating = "Rating must be between 0 and 5.";
    }
    const areaError = getSelectError(form.area, {
      label: "an area",
      allowedValues: CENTER_AREAS,
    });
    if (areaError) nextErrors.area = areaError;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      notifyFirstError(dispatch, nextErrors);
      return;
    }

    const formData = new FormData();

    formData.append("slug",      form.slug);
    formData.append("name",      form.name);
    formData.append("fullName",  form.fullName);
    formData.append("phone",     form.phone);
    formData.append("rating",    form.rating);
    formData.append("reviews",   form.reviews);
    formData.append("timing",    form.timing);
    formData.append("lat",       form.lat);
    formData.append("lng",       form.lng);
    formData.append("mapEmbed",  form.mapEmbed);
    formData.append("mapQuery",  form.mapQuery);
    formData.append("mapLink",   form.mapLink);
    formData.append("area",      form.area);
    formData.append("address",   form.address);

    form.description
      .split("\n")
      .filter((d) => d.trim())
      .forEach((desc) => formData.append("description", desc));

    /* ── Files ── */

    if (form.heroBg?.file) {
      formData.append("heroImage", form.heroBg.file);
    }

    if (form.image?.file) {
      formData.append("centerImage", form.image.file);
    }

    /*
     * Gallery — split into two groups:
     *   1. existingGallery: images already on the server (url only, no .file)
     *      → send server-relative path so backend knows to keep them
     *   2. New uploads (.file present) → append as multipart files
     */
    form.gallery.forEach((img) => {
      if (img.file) {
        formData.append("gallery", img.file);
      } else {
        // Existing server image — prefer the stored serverPath, fall back to parsing the URL
        const path = img.serverPath || (() => {
          try {
            return new URL(img.url).pathname;
          } catch {
            return img.url;
          }
        })();
        formData.append("existingGallery", path);
      }
    });

    // ✅ Fix 2: disable button while request is in flight
    setIsSubmitting(true);

    try {
      if (editId) {
        await dispatch(updateCenter({ id: editId, data: formData })).unwrap();
        // toast.success("Center updated successfully!");
      } else {
        await dispatch(createCenter(formData)).unwrap();
        // toast.success("Center created successfully!");
      }

      setForm(emptyForm);
      setEditId(null);
      setShowModal(false);
      dispatch(fetchCenters());
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= EDIT ================= */

  const handleEdit = (center) => {
    setEditId(center.id);
    setErrors({});
    setForm({
      ...center,
      area: center.area || "",
      // ✅ Fix 1: use API_BASE instead of hardcoded localhost
      heroBg: center.heroImage
        ? { url: `${API_BASE}${center.heroImage}` }
        : null,
      image: center.centerImage
        ? { url: `${API_BASE}${center.centerImage}` }
        : null,
      // Existing server images: url is full URL, no .file → backend keeps them via existingGallery
      gallery: (center.gallery || []).map((img) => ({
        url: `${API_BASE}${img}`,
        serverPath: img, // keep original server-relative path for existingGallery submission
      })),
      description: Array.isArray(center.description)
        ? center.description.join("\n")
        : (center.description || ""),
    });
    setShowModal(true);
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: "Delete this centre?",
      message: "It will be removed from the website.",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    try {
      await dispatch(deleteCenter(id)).unwrap();
      dispatch(fetchCenters());
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  /* ================= DRAG ================= */

  const dragStart = (index) => setDragIndex(index);

  const dragOver = (index) => {
    const newGallery = [...form.gallery];
    const dragged = newGallery[dragIndex];
    newGallery.splice(dragIndex, 1);
    newGallery.splice(index, 0, dragged);
    setDragIndex(index);
    setForm({ ...form, gallery: newGallery });
  };

  /* ================= RENDER ================= */

  return (
    <div className="admin-centers-page">

      <div className="admin-centers-header">
        <h2>Manage ICTC Centers</h2>
        <button
          className="admin-add-btn"
          onClick={() => {
            setForm(emptyForm);
            setEditId(null);
            setErrors({});
            setShowModal(true);
          }}
        >
          + Add Center
        </button>
      </div>

      {/* TABLE */}
      <div className="admin-centers-table-wrapper">
        <table className="admin-centers-table">
          <thead>
            <tr>
              <th>Hero</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Slug</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {centers.map((center) => (
              <tr key={center.id}>
                <td>
                  {center.heroImage && (
                    <img
                      // ✅ Fix 1: use API_BASE
                      src={`${API_BASE}${center.heroImage}`}
                      className="admin-table-img"
                      alt={center.name}
                    />
                  )}
                </td>
                <td>{center.name}</td>
                <td>{center.phone}</td>
                <td>{center.slug}</td>
                <td>{center.rating}</td>
                <td className="admin-actions">
                  <button className="admin-edit-btn"   onClick={() => handleEdit(center)}>Edit</button>
                  <button className="admin-delete-btn" onClick={() => handleDelete(center.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM */}
      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">

            <h3>{editId ? "Edit Center" : "Add Center"}</h3>

            <div className="admin-form-grid">
              <div className="admin-form-field">
                <label className="admin-field-label">Slug *</label>
                <input name="slug" className={errors.slug ? "input-invalid" : ""} placeholder="Slug" value={form.slug} onChange={handleChange} />
                <FieldError message={errors.slug} />
              </div>
              <div className="admin-form-field">
                <label className="admin-field-label">Name *</label>
                <input name="name" className={errors.name ? "input-invalid" : ""} placeholder="Name" value={form.name} onChange={handleChange} />
                <FieldError message={errors.name} />
              </div>
              <div className="admin-form-field">
                <label className="admin-field-label">Full Name *</label>
                <input name="fullName" className={errors.fullName ? "input-invalid" : ""} placeholder="Full Name" value={form.fullName} onChange={handleChange} />
                <FieldError message={errors.fullName} />
              </div>
              <div className="admin-form-field">
                <label className="admin-field-label">Phone</label>
                <input name="phone" placeholder="Phone numbers" value={form.phone} onChange={handleChange} />
              </div>
              <div className="admin-form-field">
                <label className="admin-field-label">Rating</label>
                <input name="rating" className={errors.rating ? "input-invalid" : ""} placeholder="Rating (0–5)" value={form.rating} onChange={handleChange} />
                <FieldError message={errors.rating} />
              </div>
              <div className="admin-form-field">
                <label className="admin-field-label">Reviews</label>
                <input name="reviews" placeholder="Reviews" value={form.reviews} onChange={handleChange} />
              </div>
              <div className="admin-form-field">
                <label className="admin-field-label">Timing</label>
                <input name="timing" placeholder="Timing" value={form.timing} onChange={handleChange} />
              </div>
              <div className="admin-form-field">
                <label className="admin-field-label">Latitude</label>
                <input name="lat" placeholder="Latitude" value={form.lat} onChange={handleChange} />
              </div>
              <div className="admin-form-field">
                <label className="admin-field-label">Longitude</label>
                <input name="lng" placeholder="Longitude" value={form.lng} onChange={handleChange} />
              </div>
              <div className="admin-form-field">
                <label className="admin-field-label">Map Query</label>
                <input name="mapQuery" placeholder="Map Query" value={form.mapQuery} onChange={handleChange} />
              </div>
              <div className="admin-form-field">
                <label className="admin-field-label">Google Map Embed</label>
                <input name="mapEmbed" placeholder="Google Map Embed" value={form.mapEmbed} onChange={handleChange} />
              </div>
              <div className="admin-form-field">
                <label className="admin-field-label">Map Link</label>
                <input name="mapLink" placeholder="https://maps.app.goo.gl/..." value={form.mapLink} onChange={handleChange} />
              </div>
              <div className="admin-form-field">
                <label className="admin-field-label">Area *</label>
                <select name="area" className={errors.area ? "input-invalid" : ""} value={form.area} onChange={handleChange}>
                  <option value="" disabled hidden>
                    Select Area
                  </option>
                  {CENTER_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.area} />
              </div>
              <div className="admin-form-field admin-form-field--full">
                <label className="admin-field-label">Address</label>
                <textarea name="address" placeholder="Address" value={form.address} onChange={handleChange} />
              </div>
            </div>

            {/* HERO IMAGE */}
            <div className="admin-upload-section">
              <label>Hero Image</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "heroBg")} />
              {form.heroBg && <img src={form.heroBg.url} className="admin-preview-img" alt="hero preview" />}
            </div>

            {/* CENTER IMAGE */}
            <div className="admin-upload-section">
              <label>Center Image</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "image")} />
              {form.image && <img src={form.image.url} className="admin-preview-img" alt="center preview" />}
            </div>

            {/* DESCRIPTION */}
            <div className="admin-upload-section">
              <label>Description</label>
              <textarea
                name="description"
                className="admin-rich-editor"
                placeholder="Enter description (one paragraph per line)"
                value={form.description}
                onChange={handleChange}
                rows={6}
              />
            </div>

            {/* GALLERY */}
            <div className="admin-upload-section">
              <label>Gallery Upload</label>
              <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} />
              <div className="admin-gallery-grid">
                {form.gallery.map((img, index) => (
                  <div
                    key={index}
                    className="admin-gallery-item"
                    draggable
                    onDragStart={() => dragStart(index)}
                    onDragOver={() => dragOver(index)}
                  >
                    <img src={img.url} alt={`gallery-${index}`} />
                    <button
                      onClick={() => removeGalleryImage(index)}
                      className="admin-remove-img"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-modal-actions">
              {/* ✅ Fix 2: disabled + label change while submitting */}
              <button
                className="admin-submit-btn"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : editId ? "Update Center" : "Create Center"}
              </button>
              <button
                className="admin-cancel-btn"
                onClick={() => setShowModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
      {confirmDialog}
    </div>
  );
};

export default ManageCenters;