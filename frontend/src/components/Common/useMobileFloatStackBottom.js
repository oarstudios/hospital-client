import { useEffect } from "react";

const MOBILE_MAX_WIDTH = 768;
const STACK_BOTTOM_VAR = "--mobile-stack-bottom";
const CTA_HEIGHT_VAR = "--mobile-cta-height";
const HIDDEN_CLASS = "mobile-floats-hidden";

export default function useMobileFloatStackBottom(defaultBottom = 8) {
  useEffect(() => {
    const root = document.documentElement;
    let resizeObserver;

    const clearDesktop = () => {
      root.style.removeProperty(STACK_BOTTOM_VAR);
      root.style.removeProperty(CTA_HEIGHT_VAR);
      root.classList.remove(HIDDEN_CLASS);
    };

    const update = () => {
      if (window.innerWidth > MOBILE_MAX_WIDTH) {
        clearDesktop();
        return;
      }

      root.style.setProperty(STACK_BOTTOM_VAR, `${defaultBottom}px`);

      const cta = document.querySelector(".mobile-quick-cta--floating");
      if (cta) {
        root.style.setProperty(CTA_HEIGHT_VAR, `${cta.offsetHeight}px`);
      }

      const footer = document.querySelector("footer.footer");
      if (!footer) {
        root.classList.remove(HIDDEN_CLASS);
        return;
      }

      const footerTop = footer.getBoundingClientRect().top;
      const hide = footerTop < window.innerHeight;
      root.classList.toggle(HIDDEN_CLASS, hide);
    };

    const observeCta = () => {
      resizeObserver?.disconnect();
      const cta = document.querySelector(".mobile-quick-cta--floating");
      if (!cta || typeof ResizeObserver === "undefined") return;
      resizeObserver = new ResizeObserver(update);
      resizeObserver.observe(cta);
    };

    update();
    observeCta();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      resizeObserver?.disconnect();
      clearDesktop();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [defaultBottom]);
}
