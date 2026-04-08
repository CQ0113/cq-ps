const GLOW_SELECTOR = "button, .cta-glow";

export function initGlowButtons() {
  if (typeof window === "undefined" || window.__portfolioGlowInit) {
    return;
  }

  const updateGlowPosition = (event) => {
    const target = event.target instanceof Element
      ? event.target.closest(GLOW_SELECTOR)
      : null;

    if (!target) {
      return;
    }

    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    target.style.setProperty("--glow-x", `${x}px`);
    target.style.setProperty("--glow-y", `${y}px`);
  };

  const resetGlowPosition = (event) => {
    const target = event.target instanceof Element
      ? event.target.closest(GLOW_SELECTOR)
      : null;

    if (!target) {
      return;
    }

    target.style.removeProperty("--glow-x");
    target.style.removeProperty("--glow-y");
  };

  window.addEventListener("pointermove", updateGlowPosition, { passive: true });
  window.addEventListener("pointerout", resetGlowPosition, { passive: true });
  window.__portfolioGlowInit = true;
}
