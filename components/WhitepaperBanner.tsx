"use client";

import React, { useEffect, useState } from "react";

type Props = {
  downloadUrl?: string;               // e.g. "/resources/white-paper.pdf"
  label?: string;
  ctaText?: string;
  localStorageKey?: string;
  // paths (or prefixes) where the banner should NOT show (exact or startsWith)
  excludedPaths?: string[];
  // how long (ms) to keep the banner hidden after dismiss (optional)
  hideDurationMs?: number | null;
};

export default function WhitepaperBanner({
  downloadUrl = "/resources/white-paper.pdf",
  label = "Free white paper — The Cost of HRIT Misalignment",
  ctaText = "Download the white paper",
  localStorageKey = "icarius_wp_banner_closed",
  excludedPaths = ["/resources/white-paper", "/resources/white-paper/"],
  hideDurationMs = null, // null = indefinite until localStorage cleared
}: Props) {
  const [closed, setClosed] = useState<boolean>(true);
  const [currentPath, setCurrentPath] = useState<string | null>(null);

  useEffect(() => {
    // determine current path in a framework-agnostic way (works in App & Pages router)
    const path = typeof window !== "undefined" ? window.location.pathname : null;
    setCurrentPath(path);
  }, []);

  useEffect(() => {
    if (currentPath === null) return;

    // hide on excluded paths (exact or prefix)
    const excluded = excludedPaths.some((p) =>
      p.endsWith("*") ? currentPath.startsWith(p.replace(/\*$/, "")) : currentPath === p
    );
    if (excluded) {
      setClosed(true);
      return;
    }

    // check localStorage for dismissal + optional expiry logic
    try {
      const raw = window.localStorage.getItem(localStorageKey);
      if (!raw) {
        setClosed(false); // nothing saved -> show banner
        return;
      }

      // support storing JSON with timestamp { closedAt }
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.closedAt) {
          if (hideDurationMs && Date.now() - parsed.closedAt > hideDurationMs) {
            // expired -> show again
            window.localStorage.removeItem(localStorageKey);
            setClosed(false);
            return;
          }
          setClosed(true);
          return;
        }
      } catch (e) {
        // not JSON; treat "1" as closed flag
        if (raw === "1") {
          setClosed(true);
          return;
        }
      }

      // fallback: if raw present, assume closed
      setClosed(true);
    } catch (e) {
      // localStorage not available -> show banner
      setClosed(false);
    }
  }, [currentPath, excludedPaths, localStorageKey, hideDurationMs]);

  const close = () => {
    try {
      if (hideDurationMs) {
        window.localStorage.setItem(localStorageKey, JSON.stringify({ closedAt: Date.now() }));
      } else {
        window.localStorage.setItem(localStorageKey, "1");
      }
    } catch (e) {
      // ignore
    }
    setClosed(true);
  };

  const trackDownload = () => {
    // Plausible event
    try {
      if ((window as any).plausible) (window as any).plausible("LeadMagnetDownload");
    } catch (e) {}

    // GTM / dataLayer
    try {
      if ((window as any).dataLayer) (window as any).dataLayer.push({ event: "LeadMagnetDownload", source: "banner" });
    } catch (e) {}
  };

  if (closed) return null;

  const url =
    downloadUrl.indexOf("?") > -1
      ? `${downloadUrl}&utm_source=site&utm_medium=banner&utm_campaign=whitepaper`
      : `${downloadUrl}?utm_source=site&utm_medium=banner&utm_campaign=whitepaper`;

  return (
    <div role="region" aria-label="White paper promotion" className="w-full fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between rounded-b-2xl shadow-md p-3 md:p-4 bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 text-white">
          <div className="flex items-center gap-3 min-w-0">
            <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="truncate">
              <p className="text-sm md:text-base font-semibold truncate">{label}</p>
              <p className="text-xs md:text-sm opacity-90 truncate">Instant PDF · Company email recommended · No credit card</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={url}
              onClick={trackDownload}
              className="inline-flex items-center px-3 py-2 rounded-full bg-white text-sky-700 font-semibold text-sm md:text-base shadow hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
              aria-label="Download the Icarius white paper (opens PDF)"
            >
              {ctaText}
            </a>

            <button
              onClick={close}
              aria-label="Dismiss white paper banner"
              className="p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span className="sr-only">Close</span>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Spacer so page content isn't hidden under the fixed banner */}
      <div style={{ height: 72 }} aria-hidden />
    </div>
  );
}