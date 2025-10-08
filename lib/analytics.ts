"use client";

import { hasAnalyticsConsent } from "@/app/consent/ConsentBanner";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export type TrackEventName = "BookCallClick" | "LeadMagnetSubmit" | "ContactSubmit";

export type TrackEventPayload = Record<string, unknown>;

export const track = (eventName: TrackEventName, payload: TrackEventPayload = {}) => {
  if (typeof window === "undefined") {
    return;
  }

  if (!hasAnalyticsConsent()) {
    return;
  }

  const eventPayload = { event: eventName, ...payload };

  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = [];
  }

  window.dataLayer.push(eventPayload);

  const gtag = window.gtag;
  if (typeof gtag === "function") {
    gtag("event", eventName, {
      event_category: "engagement",
      ...payload,
    });
  }
};
