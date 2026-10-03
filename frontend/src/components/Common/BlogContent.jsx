import { createElement, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CtaSlider from "./CtaSlider";
import { useGlobalCtas, pickCtas } from "./globalCtas";

const CTA_SLOT_SELECTOR = 'div[data-type="cta-slider"]';

/**
 * Renders blog HTML (from TipTap generateHTML / getHTML) and mounts a live
 * <CtaSlider> into every CTA placeholder, resolving ids against the
 * site-wide CTA list. Deleted CTAs are skipped; empty slots render nothing.
 */
const BlogContent = ({ html, className, as = "section", preview = false }) => {
  const ref = useRef(null);
  const [slots, setSlots] = useState([]);
  const { ctas } = useGlobalCtas();
  // React 19 compares this prop by identity — a new object every render would
  // rewrite innerHTML and wipe out the sliders mounted into it.
  const innerHTML = useMemo(() => ({ __html: html }), [html]);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    setSlots(
      Array.from(root.querySelectorAll(CTA_SLOT_SELECTOR)).map((el) => ({
        el,
        ids: String(el.dataset.ctaIds || "")
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean),
      })),
    );
  }, [html]);

  return (
    <>
      {createElement(as, {
        ref,
        className,
        dangerouslySetInnerHTML: innerHTML,
      })}
      {slots.map(({ el, ids }, i) => {
        const items = pickCtas(ctas, ids);
        return items.length
          ? createPortal(<CtaSlider ctas={items} preview={preview} />, el, `cta-slot-${i}`)
          : null;
      })}
    </>
  );
};

export default BlogContent;
