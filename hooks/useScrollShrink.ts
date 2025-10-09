"use client";
import { useEffect, useRef, useState } from "react";

export function useScrollShrink({ threshold = 12, paused = false } = {}) {
  const [shrunk, setShrunk] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    if (paused) return;
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setShrunk((window.scrollY || 0) > threshold);
        ticking.current = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold, paused]);

  return shrunk;
}
