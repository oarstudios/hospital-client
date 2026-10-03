import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { safeHref, isInternalHref } from "./globalCtas";
import "./CtaSlider.css";

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 40;

const prefersReducedMotion = () =>
  typeof window !== "undefined"
  && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const CtaButton = ({ cta, preview }) => {
  if (preview) {
    return <span className="cta-slider__btn">{cta.buttonText}</span>;
  }
  const href = safeHref(cta.link);
  if (isInternalHref(href)) {
    return <Link className="cta-slider__btn" to={href}>{cta.buttonText}</Link>;
  }
  return (
    <a className="cta-slider__btn" href={href} target="_blank" rel="noopener noreferrer">
      {cta.buttonText}
    </a>
  );
};

/**
 * CTA banner — a single banner for one CTA, or an auto-rotating slider
 * (arrows, dots, swipe) when given several.
 *
 * `preview` renders the button as plain text so it can't navigate away
 * (used inside the admin editor and the Others page).
 */
const CtaSlider = ({ ctas = [], preview = false, autoPlay = true }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pointerStartX = useRef(null);
  const count = ctas.length;
  const isSlider = count > 1;
  const active = count ? Math.min(index, count - 1) : 0;

  const go = useCallback(
    (next) => setIndex(((next % count) + count) % count),
    [count],
  );

  useEffect(() => {
    if (!isSlider || !autoPlay || paused || prefersReducedMotion()) return undefined;
    const timer = setTimeout(() => go(active + 1), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [isSlider, autoPlay, paused, active, go]);

  if (!count) return null;

  const onPointerDown = (e) => {
    pointerStartX.current = e.clientX;
  };
  const onPointerUp = (e) => {
    if (pointerStartX.current == null) return;
    const delta = e.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(delta) > SWIPE_THRESHOLD) go(active + (delta < 0 ? 1 : -1));
  };

  return (
    <div
      className={`cta-slider${isSlider ? " cta-slider--multi" : ""}`}
      role={isSlider ? "region" : undefined}
      aria-roledescription={isSlider ? "carousel" : undefined}
      aria-label={isSlider ? "Call to action" : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="cta-slider__viewport" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        {/* Slides are stacked in one grid cell and shifted with transforms, so
            the slider is as wide as one slide (a flex row of N slides would
            report N× the width and stretch the page column). */}
        <div className="cta-slider__track">
          {ctas.map((cta, i) => (
            <div
              key={cta.id}
              className="cta-slider__slide"
              style={isSlider ? { transform: `translateX(${(i - active) * 100}%)` } : undefined}
              aria-hidden={i !== active}
              inert={i !== active}
              role={isSlider ? "group" : undefined}
              aria-roledescription={isSlider ? "slide" : undefined}
              aria-label={isSlider ? `${i + 1} of ${count}` : undefined}
            >
              <p className="cta-slider__text">{cta.text}</p>
              <CtaButton cta={cta} preview={preview} />
            </div>
          ))}
        </div>
      </div>

      {isSlider && (
        <>
          <button
            type="button"
            className="cta-slider__arrow cta-slider__arrow--prev"
            aria-label="Previous"
            onClick={() => go(active - 1)}
          >
            ‹
          </button>
          <button
            type="button"
            className="cta-slider__arrow cta-slider__arrow--next"
            aria-label="Next"
            onClick={() => go(active + 1)}
          >
            ›
          </button>
          <div className="cta-slider__dots">
            {ctas.map((cta, i) => (
              <button
                key={cta.id}
                type="button"
                className={`cta-slider__dot${i === active ? " is-active" : ""}`}
                aria-label={`Show ${i + 1} of ${count}`}
                aria-current={i === active}
                onClick={() => go(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CtaSlider;
