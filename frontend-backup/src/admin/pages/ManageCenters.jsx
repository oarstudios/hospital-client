import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCenters,
  createCenter,
  updateCenter,
  deleteCenter,
} from "../../redux/centers/centersSlice";

import "./ManageCenters.css";

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

  const [form, setForm]           = useState(emptyForm);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId]       = useState(null);
  const [dragIndex, setDragIndex] = useState(null);

  /* ================= FETCH CENTERS ================= */

  useEffect(() => {
    dispatch(fetchCenters());
  }, [dispatch]);

  /* ================= INPUT CHANGE ================= */

  const handleChange = (e) => {
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
      url: URL.createObjectURL(file),
    }));
    setForm({ ...form, gallery: [...form.gallery, ...images] });
  };

  const removeGalleryImage = (index) => {
    const newGallery = [...form.gallery];
    newGallery.splice(index, 1);
    setForm({ ...form, gallery: newGallery });
  };

  /* ================= CREATE / UPDATE ================= */

  const handleSubmit = async () => {
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
    formData.append("address",   form.address);

    // description is kept in sync via the textarea onChange below
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

    form.gallery.forEach((img) => {
      if (img.file) formData.append("gallery", img.file);
    });

    try {
      if (editId) {
        await dispatch(updateCenter({ id: editId, data: formData })).unwrap();
      } else {
        await dispatch(createCenter(formData)).unwrap();
      }

      setForm(emptyForm);
      setEditId(null);
      setShowModal(false);
      dispatch(fetchCenters());
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  /* ================= EDIT ================= */

  const handleEdit = (center) => {
    setEditId(center.id);
    setForm({
      ...center,
      heroBg: center.heroImage
        ? { url: `http://localhost:3001${center.heroImage}` }
        : null,
      image: center.centerImage
        ? { url: `http://localhost:3001${center.centerImage}` }
        : null,
      gallery: (center.gallery || []).map((img) => ({
        url: `http://localhost:3001${img}`,
      })),
      description: Array.isArray(center.description)
        ? center.description.join("\n")
        : (center.description || ""),
    });
    setShowModal(true);
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this center?")) return;
    await dispatch(deleteCenter(id));
    dispatch(fetchCenters());
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
                      src={`http://localhost:3001${center.heroImage}`}
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
              <input name="slug"      placeholder="Slug"             value={form.slug}      onChange={handleChange} />
              <input name="name"      placeholder="Name"             value={form.name}      onChange={handleChange} />
              <input name="fullName"  placeholder="Full Name"        value={form.fullName}  onChange={handleChange} />
              <input name="phone"     placeholder="Phone"            value={form.phone}     onChange={handleChange} />
              <input name="rating"    placeholder="Rating"           value={form.rating}    onChange={handleChange} />
              <input name="reviews"   placeholder="Reviews"          value={form.reviews}   onChange={handleChange} />
              <input name="timing"    placeholder="Timing"           value={form.timing}    onChange={handleChange} />
              <input name="lat"       placeholder="Latitude"         value={form.lat}       onChange={handleChange} />
              <input name="lng"       placeholder="Longitude"        value={form.lng}       onChange={handleChange} />
              <input name="mapQuery"  placeholder="Map Query"        value={form.mapQuery}  onChange={handleChange} />
              <input name="mapEmbed"  placeholder="Google Map Embed" value={form.mapEmbed}  onChange={handleChange} />
              <textarea name="address" placeholder="Address"         value={form.address}   onChange={handleChange} />
            </div>

            {/* HERO IMAGE */}
            <div className="admin-upload-section">
              <label>Hero Image</label>
              <input type="file" onChange={(e) => handleImageUpload(e, "heroBg")} />
              {form.heroBg && <img src={form.heroBg.url} className="admin-preview-img" alt="hero preview" />}
            </div>

            {/* CENTER IMAGE */}
            <div className="admin-upload-section">
              <label>Center Image</label>
              <input type="file" onChange={(e) => handleImageUpload(e, "image")} />
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
              <input type="file" multiple onChange={handleGalleryUpload} />
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
                    <button onClick={() => removeGalleryImage(index)} className="admin-remove-img">✕</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-modal-actions">
              <button className="admin-submit-btn" onClick={handleSubmit}>
                {editId ? "Update Center" : "Create Center"}
              </button>
              <button className="admin-cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ManageCenters;