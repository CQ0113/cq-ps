import { useEffect, useRef } from "react";

const TAIL_COUNT = 10;

function MouseFollower() {
  const layerRef = useRef(null);
  const orbRef = useRef(null);
  const ringRef = useRef(null);
  const sparkRef = useRef(null);
  const tailRefs = useRef([]);

  useEffect(() => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

    if (isReducedMotion || isCoarsePointer) {
      return;
    }

    const orb = orbRef.current;
    const ring = ringRef.current;
    const spark = sparkRef.current;
    const layer = layerRef.current;

    if (!orb || !ring || !spark || !layer) {
      return;
    }

    let rafId = 0;
    let visible = false;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let orbX = targetX;
    let orbY = targetY;
    let ringX = targetX;
    let ringY = targetY;
    const tailPositions = Array.from({ length: TAIL_COUNT }, () => ({
      x: targetX,
      y: targetY
    }));

    const animate = () => {
      orbX += (targetX - orbX) * 0.16;
      orbY += (targetY - orbY) * 0.16;
      ringX += (targetX - ringX) * 0.1;
      ringY += (targetY - ringY) * 0.1;

      orb.style.transform = `translate3d(${orbX}px, ${orbY}px, 0)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      spark.style.transform = `translate3d(${orbX + 16}px, ${orbY - 20}px, 0)`;

      for (let i = 0; i < tailPositions.length; i += 1) {
        const followX = i === 0 ? orbX : tailPositions[i - 1].x;
        const followY = i === 0 ? orbY : tailPositions[i - 1].y;
        const drag = Math.max(0.06, 0.2 - i * 0.012);

        tailPositions[i].x += (followX - tailPositions[i].x) * drag;
        tailPositions[i].y += (followY - tailPositions[i].y) * drag;

        const tail = tailRefs.current[i];
        if (tail) {
          tail.style.transform = `translate3d(${tailPositions[i].x}px, ${tailPositions[i].y}px, 0)`;
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    const handleMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;

      if (!visible) {
        visible = true;
        layer.classList.add("is-visible");
      }

      const interactiveTarget = event.target instanceof Element
        ? event.target.closest("button, a, .project-flip-card")
        : null;

      layer.classList.toggle("is-interactive", Boolean(interactiveTarget));
    };

    const handleLeave = () => {
      visible = false;
      layer.classList.remove("is-visible", "is-interactive");
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerleave", handleLeave, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", handleLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={layerRef} className="mouse-follow-layer" aria-hidden="true">
      {Array.from({ length: TAIL_COUNT }).map((_, index) => {
        const size = 12 - index * 0.9;
        const alpha = 0.38 - index * 0.03;
        return (
          <span
            key={index}
            ref={(element) => {
              tailRefs.current[index] = element;
            }}
            className="mouse-tail"
            style={{
              "--tail-size": `${Math.max(3, size)}px`,
              "--tail-alpha": `${Math.max(0.05, alpha)}`
            }}
          />
        );
      })}
      <span ref={ringRef} className="mouse-ring" />
      <span ref={orbRef} className="mouse-orb" />
      <span ref={sparkRef} className="mouse-spark" />
    </div>
  );
}

export default MouseFollower;
