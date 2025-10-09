let locks = 0;
let y = 0;

export function lockBodyScroll() {
  if (typeof window === "undefined") return;
  if (++locks > 1) return;
  y = window.scrollY;
  const b = document.body;
  b.style.position = "fixed";
  b.style.top = `-${y}px`;
  b.style.left = "0"; b.style.right = "0"; b.style.width = "100%";
}

export function unlockBodyScroll() {
  if (typeof window === "undefined") return;
  locks = Math.max(0, locks - 1);
  if (locks > 0) return;
  const b = document.body;
  b.style.position = ""; b.style.top = ""; b.style.left = ""; b.style.right = ""; b.style.width = "";
  window.scrollTo(0, y);
}
