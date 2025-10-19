"use client";

import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { track } from "@/lib/analytics";
import { hasAnalyticsConsent } from "@/app/consent/ConsentBanner";

const DOWNLOAD_PATH = "/assets/icarius-hr-ai-whitepaper.pdf";
const TRACKING_STORAGE_KEY = "icarius:lead-tracking";

type Status = "idle" | "submitting" | "success" | "error";

type TrackingMetadata = {
  utm?: Record<string, string>;
  referrer?: string;
  landingPage?: string;
  source?: string;
};

const parseHostname = (value?: string) => {
  if (!value) return undefined;
  try {
    return new URL(value).hostname;
  } catch (error) {
    console.warn("Unable to parse hostname", error);
    return value;
  }
};

export default function WhitePaperPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [tracking, setTracking] = useState<TrackingMetadata>({});

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let stored: TrackingMetadata | undefined;
    try {
      const raw = window.sessionStorage.getItem(TRACKING_STORAGE_KEY);
      if (raw) {
        stored = JSON.parse(raw) as TrackingMetadata;
      }
    } catch (error) {
      console.warn("Unable to read lead tracking metadata", error);
    }

    const searchParams = new URLSearchParams(window.location.search);
    const utmEntries = Array.from(searchParams.entries()).reduce<Record<string, string>>((acc, [key, value]) => {
      if (!key || !value) {
        return acc;
      }
      const trimmedKey = key.trim();
      const trimmedValue = value.trim();
      if (!trimmedKey || !trimmedValue) {
        return acc;
      }
      if (trimmedKey.startsWith("utm_")) {
        acc[trimmedKey] = trimmedValue;
      }
      if (trimmedKey === "source" && !acc.utm_source) {
        acc.utm_source = trimmedValue;
      }
      return acc;
    }, {});

    const documentReferrer = typeof document !== "undefined" ? document.referrer : "";
    const normalizedReferrer =
      stored?.referrer && stored.referrer !== "direct"
        ? stored.referrer
        : documentReferrer && !documentReferrer.startsWith(window.location.origin)
          ? documentReferrer
          : undefined;

    const landingPage = stored?.landingPage ?? window.location.href;
    const utm = { ...(stored?.utm ?? {}), ...utmEntries };
    const sourceFromUtm = utm.utm_source || utm.source;
    const derivedSource =
      stored?.source ||
      sourceFromUtm ||
      parseHostname(normalizedReferrer) ||
      (normalizedReferrer ? normalizedReferrer : "direct");

    const nextTracking: TrackingMetadata = {
      utm: Object.keys(utm).length > 0 ? utm : stored?.utm,
      referrer: normalizedReferrer ?? stored?.referrer ?? "direct",
      landingPage,
      source: derivedSource,
    };

    setTracking(nextTracking);

    try {
      window.sessionStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(nextTracking));
    } catch (error) {
      console.warn("Unable to persist lead tracking metadata", error);
    }
  }, []);

  const analyticsPayload = useMemo(() => {
    const base = {
      source: tracking.source ?? "direct",
      referrer: tracking.referrer,
      landingPage: tracking.landingPage,
    };

    if (!tracking.utm) {
      return base;
    }

    return {
      ...base,
      ...tracking.utm,
    };
  }, [tracking]);

  const dispatchClientAnalytics = (payload: Record<string, unknown>) => {
    if (typeof window === "undefined") {
      return;
    }

    if (!hasAnalyticsConsent()) {
      return;
    }

    track("LeadMagnetSubmit", payload);

    const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
    const plausible = (window as typeof window & { plausible?: (event: string, options?: Record<string, unknown>) => void })
      .plausible;
    if (plausibleDomain && typeof plausible === "function") {
      plausible("LeadMagnetSubmit", { props: payload });
    }

    const cloudflareToken = process.env.NEXT_PUBLIC_CLOUDFLARE_BEACON_TOKEN;
    if (cloudflareToken) {
      const cfBeacon = (window as typeof window & { __cfBeacon?: { push?: (record: unknown) => void } }).__cfBeacon;
      if (cfBeacon && typeof cfBeacon.push === "function") {
        cfBeacon.push({ event: "LeadMagnetSubmit", metadata: payload });
      } else if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        const beaconUrl = `https://cloudflareinsights.com/cdn-cgi/beacon/rum?token=${encodeURIComponent(cloudflareToken)}`;
        try {
          navigator.sendBeacon(beaconUrl, JSON.stringify({ event: "LeadMagnetSubmit", metadata: payload }));
        } catch (error) {
          console.warn("Cloudflare beacon send failed", error);
        }
      }
    }

    const ga4MeasurementId =
      process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (ga4MeasurementId && typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        event_label: "LeadMagnetSubmit",
        value: 1,
        ...payload,
      });
    }
  };

  const submit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (status === "submitting") {
      return;
    }

    setStatus("submitting");
    setError("");

    try {
      const response = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          consent,
          utm: tracking.utm,
          referrer: tracking.referrer,
          source: tracking.source,
          landingPage: tracking.landingPage,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error((payload && payload.error) || "Unable to submit");
      }

      const payload: { ok: boolean; downloadUrl?: string } = await response.json();

      if (!payload.ok || !payload.downloadUrl) {
        throw new Error("Unexpected response");
      }

      setDownloadUrl(payload.downloadUrl);
      setStatus("success");
      dispatchClientAnalytics({ ...analyticsPayload, form: "whitepaper_page" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <>
      <Head>
        <title>HR AI White Paper | Icarius Consulting</title>
        <meta
          name="description"
          content="Get the Icarius HR AI readiness white paper with practical steps to de-risk HRIS change management."
        />
      </Head>
      <main className="bg-gradient-to-b from-slate-950 via-[#0a132a] to-[#0e172d] px-6 py-16 text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-12 lg:flex-row lg:items-stretch">
          <section className="lg:w-1/2">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300">White paper</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              De-risk HRIS change and activate AI in HR
            </h1>
            <p className="mt-6 text-lg text-white/70">
              Learn the Icarius framework for stabilising payroll, hardening integrations, and piloting AI safely across your HR
              stack.
            </p>
            <ul className="mt-8 space-y-3 text-white/70">
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-1 inline-block h-2 w-2 rounded-full bg-sky-300" />
                <span>Quick wins to close data quality gaps and prepare for AI copilots.</span>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-1 inline-block h-2 w-2 rounded-full bg-sky-300" />
                <span>Blueprint for running a rapid HRIS diagnostic with measurable ROI.</span>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-1 inline-block h-2 w-2 rounded-full bg-sky-300" />
                <span>Checklist to secure leadership buy-in and govern AI pilots responsibly.</span>
              </li>
            </ul>
          </section>
          <section className="lg:w-1/2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur">
              {status === "success" ? (
                <div>
                  <h2 className="text-2xl font-semibold">Check your inbox</h2>
                  <p className="mt-2 text-white/70">
                    We sent the download link to {email}. You can also grab it directly here:
                  </p>
                  <a
                    href={downloadUrl ?? DOWNLOAD_PATH}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 font-medium text-slate-950 transition hover:bg-sky-300"
                  >
                    Download the white paper
                  </a>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-white">Work email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1b38] px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none"
                      placeholder="you@company.com"
                    />
                  </div>
                  <label className="flex items-start gap-3 text-sm text-white/70">
                    <input
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(event) => setConsent(event.target.checked)}
                      className="mt-1 size-4 rounded border-white/40 bg-transparent text-sky-400 focus:ring-sky-400"
                    />
                    <span>
                      I agree to receive the white paper and occasional Icarius updates. You can unsubscribe at any time.
                    </span>
                  </label>
                  {error && <p className="text-sm text-rose-400">{error}</p>}
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full rounded-full bg-sky-400 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {status === "submitting" ? "Sending..." : "Email me the playbook"}
                  </button>
                </form>
              )}
            </div>
            <p className="mt-4 text-xs text-white/40">
              Prefer to control downloads? Host the PDF on a private bucket and update the API response to return your signed URL.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
