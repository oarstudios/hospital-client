import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "../../app/axiosinstance";
import { showToast } from "../../redux/toast/toastSlice";
import useConfirmDialog from "../../components/Common/useConfirmDialog";
import "./ManageOthers.css";

const ManageOthers = () => {
  const dispatch = useDispatch();
  const [sheetLink, setSheetLink] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [carousel, setCarousel] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirm, confirmDialog] = useConfirmDialog();

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
      dispatch(showToast.error("Could not save image order."));
      return false;
    }
  };

  const uploadImages = async () => {
    if (!files.length) {
      dispatch(showToast.error("Please select at least one image."));
      return;
    }
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
      dispatch(showToast.success("Images uploaded successfully."));
    } catch (err) {
      console.error(err);
      dispatch(showToast.error("Upload failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (name) => {
    const ok = await confirm({
      title: "Delete this image?",
      message: "It will be removed from the carousel.",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    try {
      await axios.delete(`/others/carousel/${encodeURIComponent(name)}`);
      setCarousel((prev) => prev.filter((item) => item !== name));
      await fetchData();
      dispatch(showToast.success("Image deleted."));
    } catch (err) {
      console.error(err);
      dispatch(showToast.error("Delete failed. Please try again."));
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
      dispatch(showToast.success("Image replaced."));
    } catch (err) {
      console.error(err);
      dispatch(showToast.error("Replace failed. Please try again."));
    }
  };

  const saveSheetLink = async () => {
    if (sheetLink.trim() && !/^https?:\/\//i.test(sheetLink.trim())) {
      dispatch(showToast.error("Please enter a valid URL starting with http or https."));
      return;
    }
    try {
      await axios.put("/others/sheet-link", { sheetLink });
      dispatch(showToast.success("Sheet link saved."));
    } catch (err) {
      console.error(err);
      dispatch(showToast.error("Could not save the sheet link."));
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
      {confirmDialog}
    </div>
  );
};

export default ManageOthers;
