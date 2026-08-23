import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "../../app/axiosinstance";
import { showToast } from "../../redux/toast/toastSlice";
import useConfirmDialog from "../../components/Common/useConfirmDialog";
import { getApiErrorMessage } from "../../components/Common/formFeedback";
import "./ManageOthers.css";

const LAST_SLIDE_MESSAGE = "You can't delete the last carousel slide.";

const EMPTY_SLIDE_FILES = { desktop: null, tablet: null, mobile: null };

const normalizeSlides = (raw) => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (typeof item === "string" && item.trim()) {
        return { desktop: item, tablet: item, mobile: item };
      }
      if (item && typeof item === "object") {
        const desktop = String(item.desktop || "").trim();
        const tablet = String(item.tablet || desktop).trim();
        const mobile = String(item.mobile || tablet || desktop).trim();
        if (!desktop && !tablet && !mobile) return null;
        return {
          desktop: desktop || tablet || mobile,
          tablet: tablet || desktop || mobile,
          mobile: mobile || tablet || desktop,
        };
      }
      return null;
    })
    .filter(Boolean);
};

const ManageOthers = () => {
  const dispatch = useDispatch();
  const [sheetLink, setSheetLink] = useState("");
  const [carousel, setCarousel] = useState([]);
  const [newSlideFiles, setNewSlideFiles] = useState(EMPTY_SLIDE_FILES);
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
        setCarousel(normalizeSlides(payload.carousel));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveSlideOrder = async (nextSlides) => {
    try {
      await axios.put("/others/carousel/slides/order", { carousel: nextSlides });
      setCarousel(nextSlides);
      return true;
    } catch (err) {
      console.error(err);
      dispatch(showToast.error("Could not save slide order."));
      return false;
    }
  };

  const handleNewSlideFile = (variant, file) => {
    if (!file) return;
    setNewSlideFiles((prev) => ({ ...prev, [variant]: file }));
  };

  const clearNewSlideForm = () => {
    setNewSlideFiles(EMPTY_SLIDE_FILES);
  };

  const hasNewSlideImage =
    Boolean(newSlideFiles.desktop) ||
    Boolean(newSlideFiles.tablet) ||
    Boolean(newSlideFiles.mobile);

  const uploadNewSlide = async () => {
    if (!hasNewSlideImage) {
      dispatch(
        showToast.error(
          "Upload at least one image for the slide (desktop, tablet, or mobile).",
        ),
      );
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      if (newSlideFiles.desktop) form.append("desktop", newSlideFiles.desktop);
      if (newSlideFiles.tablet) form.append("tablet", newSlideFiles.tablet);
      if (newSlideFiles.mobile) form.append("mobile", newSlideFiles.mobile);

      await axios.post("/others/carousel/slide", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearNewSlideForm();
      await fetchData();
      dispatch(showToast.success("Carousel slide added."));
    } catch (err) {
      console.error(err);
      dispatch(showToast.error("Upload failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const replaceSlideVariant = async (slideIndex, variant, file) => {
    if (!file) return;
    const form = new FormData();
    form.append(variant, file);

    try {
      await axios.put(
        `/others/carousel/slide/${slideIndex}/${variant}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      await fetchData();
      dispatch(showToast.success(`${variant} image updated.`));
    } catch (err) {
      console.error(err);
      dispatch(showToast.error("Replace failed. Please try again."));
    }
  };

  const deleteSlide = async (slideIndex) => {
    if (carousel.length <= 1) {
      dispatch(showToast.error(LAST_SLIDE_MESSAGE));
      return;
    }

    const ok = await confirm({
      title: "Delete this slide?",
      message: "Desktop, tablet, and mobile images for this slide will be removed.",
      confirmLabel: "Delete",
    });
    if (!ok) return;

    if (carousel.length <= 1) {
      dispatch(showToast.error(LAST_SLIDE_MESSAGE));
      return;
    }

    try {
      await axios.delete(`/others/carousel/slide/${slideIndex}`);
      await fetchData();
      dispatch(showToast.success("Slide deleted."));
    } catch (err) {
      console.error(err);
      const apiMessage = getApiErrorMessage(err, "");
      const isLastSlideError =
        /last carousel slide|at least one carousel slide/i.test(apiMessage);

      dispatch(
        showToast.error(isLastSlideError ? LAST_SLIDE_MESSAGE : apiMessage || "Delete failed. Please try again."),
      );
    }
  };

  const moveSlide = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= carousel.length) return;
    const nextSlides = [...carousel];
    [nextSlides[index], nextSlides[target]] = [nextSlides[target], nextSlides[index]];
    await saveSlideOrder(nextSlides);
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

  const renderVariantSlot = (slideIndex, variant, filename, label) => {
    const src = buildImageUrl(filename);
    return (
      <div className="carousel-variant" key={`${slideIndex}-${variant}`}>
        <span className="carousel-variant__label">{label}</span>
        {src ? (
          <img src={src} alt={`${label} slide ${slideIndex + 1}`} />
        ) : (
          <div className="carousel-variant__empty">No image</div>
        )}
        <label className="replace-btn">
          Replace
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              replaceSlideVariant(slideIndex, variant, e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
      </div>
    );
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
        <h3>Hero Carousel</h3>
        <p className="carousel-help">
          Upload separate images for desktop, tablet, and mobile when you can.
          Each slide needs at least one image, and the carousel must always keep
          at least one slide.
        </p>

        <div className="carousel-add">
          <h4>Add New Slide</h4>
          <div className="carousel-add-grid">
            {[
              { key: "desktop", label: "Desktop" },
              { key: "tablet", label: "Tablet" },
              { key: "mobile", label: "Mobile" },
            ].map(({ key, label }) => (
              <div className="carousel-add-field" key={key}>
                <label htmlFor={`new-slide-${key}`}>{label}</label>
                <input
                  id={`new-slide-${key}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleNewSlideFile(key, e.target.files?.[0] || null)}
                />
                {newSlideFiles[key] && (
                  <img
                    src={URL.createObjectURL(newSlideFiles[key])}
                    alt={`${label} preview`}
                    className="carousel-add-preview"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="actions">
            <button
              type="button"
              onClick={uploadNewSlide}
              disabled={loading || !hasNewSlideImage}
            >
              {loading ? "Uploading..." : "Add Slide"}
            </button>
          </div>
        </div>

        <div className="existing">
          <h4>Existing Slides</h4>
          {carousel.length === 0 ? (
            <p className="carousel-empty">No carousel slides yet.</p>
          ) : (
            carousel.map((slide, slideIndex) => (
              <div className="carousel-slide-card" key={`slide-${slideIndex}`}>
                <div className="carousel-slide-header">
                  <strong>Slide {slideIndex + 1}</strong>
                  <div className="carousel-slide-actions">
                    <button
                      type="button"
                      className="move-btn"
                      onClick={() => moveSlide(slideIndex, -1)}
                      disabled={slideIndex === 0}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="move-btn"
                      onClick={() => moveSlide(slideIndex, 1)}
                      disabled={slideIndex === carousel.length - 1}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className={`delete-slide-btn${carousel.length <= 1 ? " is-disabled" : ""}`}
                      onClick={() => deleteSlide(slideIndex)}
                      title={
                        carousel.length <= 1
                          ? LAST_SLIDE_MESSAGE
                          : "Delete slide"
                      }
                    >
                      Delete Slide
                    </button>
                  </div>
                </div>

                <div className="carousel-slide-grid">
                  {renderVariantSlot(slideIndex, "desktop", slide.desktop, "Desktop")}
                  {renderVariantSlot(slideIndex, "tablet", slide.tablet, "Tablet")}
                  {renderVariantSlot(slideIndex, "mobile", slide.mobile, "Mobile")}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      {confirmDialog}
    </div>
  );
};

export default ManageOthers;
