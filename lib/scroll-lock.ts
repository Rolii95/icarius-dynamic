// Shared body scroll lock utility
// Uses iOS-friendly fixed-position technique and supports nested locks via a counter.

let lockCount = 0;
let previousScrollY = 0;
let previousStyles: {
  position: string;
  top: string;
  width: string;
  left: string;
  right: string;
} | null = null;

export function lockBodyScroll(): void {
  if (typeof window === "undefined") return;

  lockCount += 1;
  if (lockCount > 1) {
    // Already locked by another overlay
    return;
  }

  previousScrollY = window.scrollY;
  const body = document.body;
  previousStyles = {
    position: body.style.position,
    top: body.style.top,
    width: body.style.width,
    left: body.style.left,
    right: body.style.right,
  };

  body.style.position = "fixed";
  body.style.top = `-${previousScrollY}px`;
  body.style.width = "100%";
  body.style.left = "0";
  body.style.right = "0";
}

export function unlockBodyScroll(): void {
  if (typeof window === "undefined") return;

  if (lockCount === 0) {
    return;
  }

  lockCount -= 1;
  if (lockCount > 0) {
    // Other overlays still active
    return;
  }

  const body = document.body;
  const top = body.style.top;

  if (previousStyles) {
    body.style.position = previousStyles.position;
    body.style.top = previousStyles.top;
    body.style.width = previousStyles.width;
    body.style.left = previousStyles.left;
    body.style.right = previousStyles.right;
  } else {
    body.style.position = "";
    body.style.top = "";
    body.style.width = "";
    body.style.left = "";
    body.style.right = "";
  }

  previousStyles = null;

  const y = Math.abs(parseInt(top || "0", 10)) || 0;
  window.scrollTo(0, y);
}
