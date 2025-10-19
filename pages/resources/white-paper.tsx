"use client";

import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { track } from "@/lib/analytics";
import { hasAnalyticsConsent } from "@/app/consent/ConsentBanner";

const WHITEPAPER_TITLE = "HR AI Readiness White Paper | Icarius Consulting";
const WHITEPAPER_HEADING = "The HR leader's field guide to AI-ready systems";
const WHITEPAPER_DESCRIPTION =
  "Proven plays from Icarius Consulting to stabilise HR data foundations, govern AI responsibly, and deliver ROI on your next HRIS investment.";
const WHITEPAPER_CANONICAL = "https://www.icarius-consulting.com/resources/white-paper";
const WHITEPAPER_IMAGE = "https://www.icarius-consulting.com/hero.svg";
const WHITEPAPER_LOGO = "https://www.icarius-consulting.com/brand/icarius_interlock_badge_dark.svg";
const WHITEPAPER_PUBLISHED = "2024-03-20";
const DOWNLOAD_PATH = "/assets/icarius-hr-ai-whitepaper.pdf";
const TRACKING_STORAGE_KEY = "icarius:lead-tracking";

const WHITEPAPER_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "HR AI Readiness White Paper",
  description: WHITEPAPER_DESCRIPTION,
  datePublished: WHITEPAPER_PUBLISHED,
  dateModified: WHITEPAPER_PUBLISHED,
  url: WHITEPAPER_CANONICAL,
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": WHITEPAPER_CANONICAL,
  },
  publisher: {
    "@type": "Organization",
    name: "Icarius Consulting",
    logo: {
      "@type": "ImageObject",
      url: WHITEPAPER_LOGO,
    },
  },
  author: {
    "@type": "Organization",
    name: "Icarius Consulting",
  },
  image: WHITEPAPER_IMAGE,
  keywords: [
    "HRIS",
    "AI readiness",
    "HR transformation",
    "change management",
    "payroll data quality",
  ],
};

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

const benefits = [
  "Stabilise payroll and time data so AI copilots can trust every calculation.",
  "Hardening steps to shield HRIS integrations from outages during transformation.",
  "Governance model and templates to secure leadership support for AI pilots.",
  "Roadmap to measure adoption and ROI within the first 90 days of rollout.",
];

const proofPoints = [
  { label: "Global workforce stabilised", value: "38k employees" },
  { label: "Payroll accuracy uplift", value: "+27% in 60 days" },
  { label: "AI pilots launched", value: "5 cross-functional squads" },
];

const bulletIcon = (
  <svg aria-hidden="true" className="h-5 w-5 flex-none text-sky-300" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M16.704 5.29a1 1 0 0 1 0 1.414l-7.25 7.25a1 1 0 0 1-1.414 0l-3.25-3.25A1 1 0 0 1 6.504 9.29l2.543 2.543 6.543-6.543a1 1 0 0 1 1.414 0Z"
      clipRule="evenodd"
    />
  </svg>
);

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
    } catch (storageError) {
      console.warn("Unable to read lead tracking metadata", storageError);
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
    } catch (persistError) {
      console.warn("Unable to persist lead tracking metadata", persistError);
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

    const plausible = (window as typeof window & {
      plausible?: (event: string, options?: Record<string, unknown>) => void;
    }).plausible;
    if (typeof plausible === "function") {
      plausible("LeadMagnetSubmit", { props: payload });
    }

    const cloudflareToken = process.env.NEXT_PUBLIC_CLOUDFLARE_BEACON_TOKEN;
    if (cloudflareToken) {
      const cfBeacon = (window as typeof window & {
        __cfBeacon?: { push?: (record: unknown) => void };
      }).__cfBeacon;
      if (cfBeacon && typeof cfBeacon.push === "function") {
        cfBeacon.push({ event: "LeadMagnetSubmit", metadata: payload });
      } else if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        const beaconUrl = `https://cloudflareinsights.com/cdn-cgi/beacon/rum?token=${encodeURIComponent(cloudflareToken)}`;
        try {
          navigator.sendBeacon(beaconUrl, JSON.stringify({ event: "LeadMagnetSubmit", metadata: payload }));
        } catch (cloudflareError) {
          console.warn("Cloudflare beacon send failed", cloudflareError);
        }
      }
    }

    const gtag = (window as typeof window & {
      gtag?: (...args: unknown[]) => void;
    }).gtag;
    if (typeof gtag === "function") {
      gtag("event", "conversion", {
        send_to: "AW-ICARIUS/LeadMagnetSubmit",
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
        throw new Error((payload && payload.error) || "Unable to submit the form");
      }

      const payload: { ok: boolean; downloadUrl?: string } = await response.json();
      if (!payload.ok || !payload.downloadUrl) {
        throw new Error("Unexpected response");
      }

      setDownloadUrl(payload.downloadUrl || DOWNLOAD_PATH);
      setStatus("success");
      dispatchClientAnalytics({ ...analyticsPayload, form: "whitepaper_page" });
    } catch (submissionError) {
      setStatus("error");
      setError(submissionError instanceof Error ? submissionError.message : "Something went wrong");
    }
  };

  return (
    <>
      <Head>
        <title>{WHITEPAPER_TITLE}</title>
        <meta name="description" content={WHITEPAPER_DESCRIPTION} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={WHITEPAPER_CANONICAL} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={WHITEPAPER_HEADING} />
        <meta property="og:description" content={WHITEPAPER_DESCRIPTION} />
        <meta property="og:url" content={WHITEPAPER_CANONICAL} />
        <meta property="og:image" content={WHITEPAPER_IMAGE} />
        <meta property="article:section" content="Resources" />
        <meta property="article:published_time" content={`${WHITEPAPER_PUBLISHED}T00:00:00.000Z`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={WHITEPAPER_HEADING} />
        <meta name="twitter:description" content={WHITEPAPER_DESCRIPTION} />
        <meta name="twitter:image" content={WHITEPAPER_IMAGE} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WHITEPAPER_JSON_LD) }}
        />
      </Head>
      <main className="relative bg-gradient-to-b from-[#070E1B] via-[#0E1525] to-[#050A13] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_55%)]" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-24 pt-20 lg:flex-row lg:items-start lg:gap-24 lg:px-6">
          <section className="w-full max-w-3xl space-y-10 lg:max-w-none lg:flex-1">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-400/10 px-4 py-1 text-sm font-medium uppercase tracking-[0.18em] text-sky-200">
                Resource
              </span>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {WHITEPAPER_HEADING}
              </h1>
              <p className="max-w-2xl text-lg text-white/70 sm:text-xl">{WHITEPAPER_DESCRIPTION}</p>
            </div>

            <dl className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-white/80 sm:grid-cols-3">
              {proofPoints.map((item) => (
                <div key={item.label} className="space-y-1">
                  <dt className="text-xs uppercase tracking-[0.2em] text-slate-300/70">{item.label}</dt>
                  <dd className="text-2xl font-semibold text-white">{item.value}</dd>
                </div>
              ))}
            </dl>

            <div className="rounded-3xl border border-white/10 bg-[#0B1324]/70 p-8 shadow-2xl backdrop-blur">
              {status === "success" ? (
                <div className="space-y-6" aria-live="polite">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">You&apos;re in</p>
                    <h2 className="text-3xl font-semibold text-white">Download your copy</h2>
                    <p className="text-base text-white/70">
                      We sent a copy to <span className="font-medium text-white">{email}</span>. You can also download it directly below.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <p className="text-sm text-white/60">Icarius HR AI Readiness White Paper (PDF · 18 MB)</p>
                    <a
                      href={downloadUrl ?? DOWNLOAD_PATH}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-sky-300 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-200"
                    >
                      <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 3a1 1 0 1 1 2 0v6.586l1.293-1.293a1 1 0 0 1 1.414 1.414l-3.001 3a1 1 0 0 1-1.414 0l-3.001-3a1 1 0 0 1 1.414-1.414L9 9.586V3Zm-7 9a2 2 0 0 1 2-2h2a1 1 0 1 1 0 2H4v3h12v-3h-2a1 1 0 1 1 0-2h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3Z" />
                      </svg>
                      Download the PDF
                    </a>
                  </div>
                  <p className="text-xs text-white/40">
                    Need a different delivery method? Reach out at <Link href="/contact" className="text-sky-300 underline underline-offset-4">contact@icarius-consulting.com</Link> and we&apos;ll help.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-6" noValidate>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold text-white">
                      Work email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-[#0F1A32] px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400/60"
                      placeholder="you@company.com"
                      aria-describedby="whitepaper-email-description"
                    />
                    <p id="whitepaper-email-description" className="text-xs text-white/50">
                      We only use your email to share this resource and relevant Icarius updates.
                    </p>
                  </div>
                  <label className="flex items-start gap-3 text-sm text-white/80">
                    <input
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(event) => setConsent(event.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-white/50 bg-transparent text-sky-300 focus:ring-sky-400"
                    />
                    <span>
                      I agree to receive the white paper and understand Icarius may follow up with relevant insights. I can unsubscribe at any time.
                    </span>
                  </label>
                  {error && (
                    <p role="alert" className="text-sm text-rose-300">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-sky-300 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-70"
                    aria-busy={status === "submitting"}
                  >
                    {status === "submitting" ? (
                      <>
                        <svg aria-hidden="true" className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.94 2.94a1.5 1.5 0 0 1 1.58-.36l13 4.75a1.5 1.5 0 0 1 0 2.84l-13 4.75A1.5 1.5 0 0 1 3 13.52V6.48a1.5 1.5 0 0 1-.06-.18 1.5 1.5 0 0 1 .36-1.58l-.36.22Z" />
                        </svg>
                        Email me the playbook
                      </>
                    )}
                  </button>
                  <p className="text-xs text-white/40">
                    We recommend enabling MFA on shared inboxes and adding a download allow-list. Consider using a CAPTCHA and rate limiting to secure the form.
                  </p>
                </form>
              )}
            </div>
          </section>

          <aside className="w-full space-y-10 lg:w-96 lg:flex-none">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur">
                <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-sky-200">
                  <span className="inline-block h-2 w-2 rounded-full bg-sky-300" aria-hidden="true" />
                  What&apos;s inside
                </div>
              <ul className="mt-6 space-y-5 text-base text-white/80">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-4">
                    {bulletIcon}
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <figure className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-8 shadow-xl backdrop-blur">
              <blockquote className="space-y-4 text-lg text-white/80">
                <p>
                  “Icarius helped us harden payroll integrations and launch a compliant AI helpdesk in under a quarter. This playbook mirrors the sprint cadence we still use today.”
                </p>
              </blockquote>
              <figcaption className="mt-6 text-sm text-white/60">
                <div className="font-semibold text-white">Priya Desai</div>
                <div>VP People Systems, Series D Fintech</div>
              </figcaption>
            </figure>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl">
              <Image
                src="/hero.svg"
                alt="Illustration of Icarius team aligning HR and AI"
                width={800}
                height={600}
                className="h-56 w-full object-cover"
                priority
              />
              <div className="space-y-3 p-6 text-white/80">
                <h3 className="text-lg font-semibold text-white">Trusted HR transformation partners</h3>
                <p className="text-sm">
                  Icarius consultants have delivered global rollouts for Fortune 500 enterprises and high-growth scaleups across EMEA &amp; North America.
                </p>
                <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-sky-200">
                  <span className="rounded-full border border-sky-400/40 px-3 py-1">Workday</span>
                  <span className="rounded-full border border-sky-400/40 px-3 py-1">SuccessFactors</span>
                  <span className="rounded-full border border-sky-400/40 px-3 py-1">ServiceNow</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
