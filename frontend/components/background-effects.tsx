"use client";

import { useEffect, useState, useCallback } from "react";

export function BackgroundEffects() {
  const [active, setActive] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const update = useCallback((cx: number, cy: number) => {
    const x = Math.round((cx / window.innerWidth) * 100);
    const y = Math.round((cy / window.innerHeight) * 100);
    setPos({ x, y });
    setActive(true);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => update(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      update(t.clientX, t.clientY);
    };
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      update(t.clientX, t.clientY);
    };
    const onLeave = () => setActive(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchstart", onTouchStart);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [update]);

  return (
    <div
      className={`background-effects ${active ? "active" : ""}`}
      style={
        active
          ? {
              maskImage: `radial-gradient(ellipse 180px 180px at ${pos.x}% ${pos.y}%, black 20%, transparent 70%)`,
              WebkitMaskImage: `radial-gradient(ellipse 180px 180px at ${pos.x}% ${pos.y}%, black 20%, transparent 70%)`,
            }
          : undefined
      }
    />
  );
}
