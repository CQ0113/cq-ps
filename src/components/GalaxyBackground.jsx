import { useEffect, useRef } from "react";

function GalaxyBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReducedMotion || isCoarsePointer) {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const stars = [];
    const STAR_COUNT = 180;
    const mouse = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5,
      smoothX: window.innerWidth * 0.5,
      smoothY: window.innerHeight * 0.5
    };

    let width = window.innerWidth;
    let height = window.innerHeight;
    let frameId = 0;
    let time = 0;

    const random = (min, max) => Math.random() * (max - min) + min;

    const setupCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createStars = () => {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i += 1) {
        stars.push({
          x: random(0, width),
          y: random(0, height),
          size: random(0.7, 2.2),
          depth: random(0.3, 1),
          twinkle: random(0, Math.PI * 2),
          speed: random(0.001, 0.004)
        });
      }
    };

    const drawNebula = () => {
      const driftX = (mouse.smoothX / width - 0.5) * 80;
      const driftY = (mouse.smoothY / height - 0.5) * 80;

      const nebulaA = context.createRadialGradient(
        width * 0.2 + driftX,
        height * 0.3 + driftY,
        60,
        width * 0.2 + driftX,
        height * 0.3 + driftY,
        width * 0.7
      );
      nebulaA.addColorStop(0, "rgba(56, 189, 248, 0.12)");
      nebulaA.addColorStop(1, "rgba(56, 189, 248, 0)");

      const nebulaB = context.createRadialGradient(
        width * 0.8 - driftX,
        height * 0.75 - driftY,
        40,
        width * 0.8 - driftX,
        height * 0.75 - driftY,
        width * 0.55
      );
      nebulaB.addColorStop(0, "rgba(99, 102, 241, 0.1)");
      nebulaB.addColorStop(1, "rgba(99, 102, 241, 0)");

      context.fillStyle = nebulaA;
      context.fillRect(0, 0, width, height);
      context.fillStyle = nebulaB;
      context.fillRect(0, 0, width, height);
    };

    const drawStars = () => {
      for (let i = 0; i < stars.length; i += 1) {
        const star = stars[i];
        star.twinkle += star.speed;

        const parallaxX = (mouse.smoothX / width - 0.5) * (14 * star.depth);
        const parallaxY = (mouse.smoothY / height - 0.5) * (14 * star.depth);
        const drawX = star.x + parallaxX;
        const drawY = star.y + parallaxY;
        const dx = mouse.smoothX - drawX;
        const dy = mouse.smoothY - drawY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelStrength = Math.max(0, 1 - dist / 140) * 7 * star.depth;

        const finalX = drawX - (dx / (dist || 1)) * repelStrength;
        const finalY = drawY - (dy / (dist || 1)) * repelStrength;
        const alpha = 0.35 + Math.sin(star.twinkle + time * 0.0018) * 0.3;
        const glow = Math.max(0, 1 - dist / 170) * 0.45;

        context.beginPath();
        context.arc(finalX, finalY, star.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(186, 230, 253, ${Math.min(0.95, alpha + glow)})`;
        context.shadowBlur = 8 + glow * 18;
        context.shadowColor = "rgba(125, 211, 252, 0.8)";
        context.fill();
      }
    };

    const animate = () => {
      time += 1;
      mouse.smoothX += (mouse.x - mouse.smoothX) * 0.08;
      mouse.smoothY += (mouse.y - mouse.smoothY) * 0.08;

      context.clearRect(0, 0, width, height);
      drawNebula();
      drawStars();
      context.shadowBlur = 0;

      frameId = window.requestAnimationFrame(animate);
    };

    const handlePointerMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const handleResize = () => {
      setupCanvas();
      createStars();
    };

    setupCanvas();
    createStars();
    animate();

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="galaxy-bg-layer" aria-hidden="true">
      <canvas ref={canvasRef} className="galaxy-canvas" />
    </div>
  );
}

export default GalaxyBackground;
