import { useEffect } from "react";

const MOBILE_MAX_WIDTH = 768;
const STACK_BOTTOM_VAR = "--mobile-stack-bottom";

function stackBottomOffset(defaultBottom, gap) {
  const viewportHeight = window.innerHeight;
  const section = document.querySelector(".appointment-wrapper");

  if (!section) return defaultBottom;

  const { top, bottom } = section.getBoundingClientRect();

  if (top >= viewportHeight) return defaultBottom;

  if (bottom <= 0) return viewportHeight + 200;

  return Math.max(defaultBottom, viewportHeight - top + gap);
}

export default function useMobileFloatStackBottom(defaultBottom = 8) {
  useEffect(() => {
    const update = () => {
      const root = document.documentElement;

      if (window.innerWidth > MOBILE_MAX_WIDTH) {
        root.style.removeProperty(STACK_BOTTOM_VAR);
        return;
      }

      root.style.setProperty(
        STACK_BOTTOM_VAR,
        `${stackBottomOffset(defaultBottom, 10)}px`,
      );
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      document.documentElement.style.removeProperty(STACK_BOTTOM_VAR);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [defaultBottom]);
}
