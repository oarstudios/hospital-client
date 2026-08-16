import { useEffect, useState } from "react";
import axios from "../../app/axiosinstance";
import "./ManageOthers.css";

const ManageOthers = () => {
  const [sheetLink, setSheetLink] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [carousel, setCarousel] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const buildImageUrl = (name) => {
    if (!name) return "";
    if (name.startsWith("http://") || name.startsWith("https://")) return name;
    const base = (axios.defaults.baseURL || "").replace(/\/$/, "");
    const path = name.startsWith("/uploads/") ? name : `/uploads/${name}`;
    return `${base}${path}`;
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("/others");
      const payload = res?.data?.data ?? res?.data ?? {};
      if (payload) {
        setSheetLink(payload.sheetLink || "");
        setCarousel(Array.isArray(payload.carousel) ? payload.carousel : []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFiles = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles(list);
    setPreviews(list.map((file) => ({ id: `${file.name}-${file.lastModified}-${file.size}`, file, src: URL.createObjectURL(file) })));
  };

  const removeSelectedPreview = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const reorderCarouselImages = async (nextOrder) => {
    try {
      await axios.put("/others/carousel/order", { carousel: nextOrder });
      await fetchData();
      return true;
    } catch (err) {
      console.error(err);
      alert("Could not save image order");
      return false;
    }
  };

  const uploadImages = async () => {
    if (!files.length) return;
    setLoading(true);
    try {
      const form = new FormData();
      files.forEach((file) => form.append("carousel", file));
      await axios.post("/others/carousel", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFiles([]);
      setPreviews([]);
      await fetchData();
      alert("Uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (name) => {
    if (!confirm("Delete this image?")) return;
    try {
      await axios.delete(`/others/carousel/${encodeURIComponent(name)}`);
      setCarousel((prev) => prev.filter((item) => item !== name));
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const replaceImage = async (oldName, file) => {
    if (!file) return;
    const form = new FormData();
    form.append("carousel", file);
    try {
      await axios.put(`/others/carousel/${encodeURIComponent(oldName)}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchData();
      alert("Replaced");
    } catch (err) {
      console.error(err);
      alert("Replace failed");
    }
  };

  const saveSheetLink = async () => {
    try {
      await axios.put("/others/sheet-link", { sheetLink });
      alert("Saved");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  return (
    <div className="manage-others">
      <h2>Others</h2>

      <section className="card">
        <h3>Booking Sheet Link</h3>
        <div className="row">
          <input
            type="text"
            value={sheetLink}
            onChange={(e) => setSheetLink(e.target.value)}
            placeholder="Paste sheet link for booking"
          />
          <button type="button" onClick={saveSheetLink}>Save</button>
        </div>
      </section>

      <section className="card">
        <h3>Carousel Images</h3>
        <input type="file" multiple accept="image/*" onChange={handleFiles} />

        {previews.length > 0 && (
          <div className="previews">
            {previews.map((item, i) => (
              <div className="preview-item" key={item.id || `${item.src}-${i}`}>
                <button type="button" className="remove-btn" onClick={() => removeSelectedPreview(i)} aria-label="Remove selected image">×</button>
                <img src={item.src} alt={`preview-${i}`} />
              </div>
            ))}
          </div>
        )}

        <div className="existing">
          <h4>Existing Images</h4>
          <div className="previews">
            {carousel.map((name, index) => {
              const src = buildImageUrl(name);
              return (
                <div
                  className="existing-item"
                  key={`${name}-${index}`}
                >
                  <button type="button" className="remove-btn" onClick={() => deleteImage(name)} aria-label={`Remove ${name}`}>×</button>
                  <img src={src} alt={name} />
                  <div className="meta">
                    <span className="fname">{name}</span>
                    <div className="btns">
                      <label className="replace-btn">
                        Replace
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => replaceImage(name, e.target.files?.[0])} />
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="actions">
          <button type="button" onClick={uploadImages} disabled={loading || !files.length}>
            {loading ? "Uploading..." : "Upload Images"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default ManageOthers;
