import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../app/axiosinstance";
import { showToast } from "../../redux/toast/toastSlice";
import { fetchBlogs } from "../../redux/blogs/blogsSlice";
import useConfirmDialog from "../../components/Common/useConfirmDialog";
import FieldError from "../../components/Common/FieldError";
import { getApiErrorMessage, clearField } from "../../components/Common/formFeedback";
import CtaSlider from "../../components/Common/CtaSlider";
import { normalizeCtas, setGlobalCtas } from "../../components/Common/globalCtas";
import "./ManageOthers.css";

const EMPTY_CTA_DRAFT = { text: "", buttonText: "", link: "" };

/** Number of posts whose content includes this CTA id. */
const countCtaUsage = (blogs, id) =>
  blogs.filter((b) => {
    try {
      const content = typeof b.content === "string" ? b.content : JSON.stringify(b.content || "");
      return content.includes(id);
    } catch {
      return false;
    }
  }).length;

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
  const [savedSheetLink, setSavedSheetLink] = useState("");
  const [carousel, setCarousel] = useState([]);
  const [newSlideFiles, setNewSlideFiles] = useState(EMPTY_SLIDE_FILES);
  const [loading, setLoading] = useState(false);
  const [confirm, confirmDialog] = useConfirmDialog();
  const [ctas, setCtas] = useState([]);
  const [ctaDraft, setCtaDraft] = useState(EMPTY_CTA_DRAFT);
  const [ctaEditingId, setCtaEditingId] = useState(null);
  const [ctaErrors, setCtaErrors] = useState({});
  const [ctaSaving, setCtaSaving] = useState(false);
  const { list: blogList = [] } = useSelector((state) => state.blogs || {});
  const blogs = Array.isArray(blogList) ? blogList : [];

  useEffect(() => {
    fetchData();
    dispatch(fetchBlogs());
  }, [dispatch]);

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
        setSavedSheetLink(payload.sheetLink || "");
        setCarousel(normalizeSlides(payload.carousel));
        applyCtas(payload.ctas);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ── CTAs ─────────────────────────────────────────────────────────────── */

  // Keep this page and the shared cache (used by the blog editor) in sync
  const applyCtas = (raw) => {
    const list = normalizeCtas(raw);
    setCtas(list);
    setGlobalCtas(list);
  };

  const resetCtaForm = () => {
    setCtaDraft(EMPTY_CTA_DRAFT);
    setCtaEditingId(null);
    setCtaErrors({});
  };

  const saveCta = async () => {
    const draft = {
      text: ctaDraft.text.trim(),
      buttonText: ctaDraft.buttonText.trim(),
      link: ctaDraft.link.trim(),
    };
    const nextErrors = {};
    if (!draft.text) nextErrors.text = "CTA text is required.";
    if (!draft.buttonText) nextErrors.buttonText = "Button text is required.";
    if (!draft.link) nextErrors.link = "Button link is required.";
    setCtaErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setCtaSaving(true);
    try {
      const res = ctaEditingId
        ? await axios.put(`/others/ctas/${ctaEditingId}`, draft)
        : await axios.post("/others/ctas", draft);
      const payload = res?.data?.data ?? res?.data ?? {};
      applyCtas(payload.ctas);
      dispatch(showToast.success(ctaEditingId ? "CTA updated." : "CTA added."));
      resetCtaForm();
    } catch (err) {
      console.error(err);
      dispatch(showToast.error(getApiErrorMessage(err, "Could not save the CTA.")));
    } finally {
      setCtaSaving(false);
    }
  };

  const editCta = (cta) => {
    setCtaEditingId(cta.id);
    setCtaDraft({ text: cta.text, buttonText: cta.buttonText, link: cta.link });
    setCtaErrors({});
  };

  const deleteCta = async (cta) => {
    const used = countCtaUsage(blogs, cta.id);
    const ok = await confirm({
      title: "Delete this CTA?",
      message: used
        ? `It is used in ${used} post${used > 1 ? "s" : ""} and will stop showing there.`
        : "It isn't used in any post.",
      confirmLabel: "Delete",
    });
    if (!ok) return;

    try {
      const res = await axios.delete(`/others/ctas/${cta.id}`);
      const payload = res?.data?.data ?? res?.data ?? {};
      applyCtas(payload.ctas);
      if (ctaEditingId === cta.id) resetCtaForm();
      dispatch(showToast.success("CTA deleted."));
    } catch (err) {
      console.error(err);
      dispatch(showToast.error(getApiErrorMessage(err, "Could not delete the CTA.")));
    }
  };

  const moveCta = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= ctas.length) return;
    const next = [...ctas];
    [next[index], next[target]] = [next[target], next[index]];
    setCtas(next);
    try {
      const res = await axios.put("/others/ctas/order", { ids: next.map((c) => c.id) });
      const payload = res?.data?.data ?? res?.data ?? {};
      applyCtas(payload.ctas);
    } catch (err) {
      console.error(err);
      dispatch(showToast.error("Could not save CTA order."));
      fetchData();
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
    if (sheetLink.trim() === savedSheetLink.trim()) {
      dispatch(showToast.info("No changes to save."));
      return;
    }
    const ok = await confirm({
      title: "Save booking sheet link?",
      message:
        "This will replace the current booking sheet link. Accidental changes can send bookings to the wrong sheet.",
      confirmLabel: "Save",
      cancelLabel: "Cancel",
      danger: true,
    });
    if (!ok) return;
    try {
      await axios.put("/others/sheet-link", { sheetLink });
      setSavedSheetLink(sheetLink);
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

      <section className="card cta-card">
        <h3>Call to Action (CTA)</h3>
        <p className="carousel-help">
          CTAs are shared by all blogs and news. In the blog editor use{" "}
          <strong>Insert CTA</strong> to place one — or pick several to show them
          as a slider. Editing a CTA here updates it everywhere it is used.
        </p>

        <div className="cta-form">
          <div className="cta-form-text">
            <label htmlFor="cta-text">CTA Text *</label>
            <textarea
              id="cta-text"
              rows={2}
              className={ctaErrors.text ? "input-invalid" : ""}
              value={ctaDraft.text}
              onChange={(e) => {
                clearField(setCtaErrors, "text");
                setCtaDraft((prev) => ({ ...prev, text: e.target.value }));
              }}
              placeholder="e.g. Have you noticed a persistent voice change, sore throat or swallowing difficulty?"
            />
            <FieldError message={ctaErrors.text} />
          </div>
          <div>
            <label htmlFor="cta-button-text">Button Text *</label>
            <input
              id="cta-button-text"
              type="text"
              className={ctaErrors.buttonText ? "input-invalid" : ""}
              value={ctaDraft.buttonText}
              onChange={(e) => {
                clearField(setCtaErrors, "buttonText");
                setCtaDraft((prev) => ({ ...prev, buttonText: e.target.value }));
              }}
              placeholder="e.g. Book a Consultation"
            />
            <FieldError message={ctaErrors.buttonText} />
          </div>
          <div>
            <label htmlFor="cta-link">Button Link *</label>
            <input
              id="cta-link"
              type="text"
              className={ctaErrors.link ? "input-invalid" : ""}
              value={ctaDraft.link}
              onChange={(e) => {
                clearField(setCtaErrors, "link");
                setCtaDraft((prev) => ({ ...prev, link: e.target.value }));
              }}
              placeholder="/BookAppoinment or https://..."
            />
            <FieldError message={ctaErrors.link} />
          </div>
        </div>

        {(ctaDraft.text.trim() || ctaDraft.buttonText.trim()) && (
          <div className="cta-draft-preview">
            <span className="cta-label">Preview</span>
            <CtaSlider
              preview
              ctas={[{
                id: "draft",
                text: ctaDraft.text || "CTA text",
                buttonText: ctaDraft.buttonText || "Button",
                link: ctaDraft.link,
              }]}
            />
          </div>
        )}

        <div className="actions cta-form-actions">
          <button type="button" onClick={saveCta} disabled={ctaSaving}>
            {ctaSaving ? "Saving…" : ctaEditingId ? "Update CTA" : "+ Add CTA"}
          </button>
          {ctaEditingId && (
            <button type="button" className="cta-cancel-btn" onClick={resetCtaForm}>
              Cancel
            </button>
          )}
        </div>

        <div className="existing">
          <h4>Existing CTAs</h4>
          {ctas.length === 0 ? (
            <p className="carousel-empty">No CTAs yet.</p>
          ) : (
            <ul className="cta-list">
              {ctas.map((cta, index) => {
                const used = countCtaUsage(blogs, cta.id);
                return (
                  <li
                    key={cta.id}
                    className={`cta-list-item${ctaEditingId === cta.id ? " is-editing" : ""}`}
                  >
                    <div className="cta-list-head">
                      <strong>CTA {index + 1}</strong>
                      <span className="cta-usage">
                        {used ? `Used in ${used} post${used > 1 ? "s" : ""}` : "Not used yet"}
                      </span>
                      <div className="carousel-slide-actions">
                        <button
                          type="button"
                          className="move-btn"
                          onClick={() => moveCta(index, -1)}
                          disabled={index === 0}
                          aria-label="Move up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="move-btn"
                          onClick={() => moveCta(index, 1)}
                          disabled={index === ctas.length - 1}
                          aria-label="Move down"
                        >
                          ↓
                        </button>
                        <button type="button" className="cta-edit-btn" onClick={() => editCta(cta)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="delete-slide-btn"
                          onClick={() => deleteCta(cta)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <CtaSlider ctas={[cta]} preview />
                    <span className="cta-link">→ {cta.link}</span>
                  </li>
                );
              })}
            </ul>
          )}
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
