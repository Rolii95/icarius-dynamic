"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { track } from "@/lib/analytics";
import styles from "@/styles/resources/white-paper.module.css";

const STORAGE_KEY = "icarius:whitepaper:tracking";
const DOWNLOAD_PATH = "/assets/icarius-hr-ai-whitepaper.pdf";

const baseUrl = (
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.BASE_URL ||
  "https://www.icarius-consulting.com"
).replace(/\/$/, "");

const downloadUrlDefault = baseUrl ? `${baseUrl}${DOWNLOAD_PATH}` : DOWNLOAD_PATH;

const description =
  "Stabilise HR data foundations, govern AI responsibly, and deliver ROI on your next HRIS transformation with Icarius Consulting.";

const benefits = [
  "Blueprint your HRIS modernisation with proven sequencing and risk controls.",
  "Operational guardrails to keep payroll and time data trusted during AI rollout.",
  "Executive-ready frameworks to secure sponsorship and accelerate adoption.",
];

const highlights = [
  { label: "HR teams enabled", value: "70+ countries" },
  { label: "Data integrity uplift", value: "+27% in 60 days" },
  { label: "AI pilots launched", value: "5 cross-functional squads" },
];

const credibilityQuotes = [
  {
    quote:
      "Icarius untangled years of tech debt and gave us a reliable runway for AI copilots.",
    name: "VP People Systems, Fortune 500 Retailer",
  },
  {
    quote:
      "Within 8 weeks our payroll accuracy stabilised and leadership greenlit the automation backlog.",
    name: "Director of HR Ops, Global Manufacturing",
  },
];

type Status = "idle" | "submitting" | "success" | "error";

type DeliveryState = {
  sent: boolean;
  message?: string;
};

type TrackingState = {
  utm?: Record<string, string>;
  referrer?: string;
  landingPage?: string;
  source?: string;
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const parseHostname = (value?: string | null) => {
  if (!value) return undefined;
  try {
    return new URL(value).hostname;
  } catch (error) {
    return undefined;
  }
};

const normaliseUtm = (entries: Record<string, string>) =>
  Object.entries(entries).reduce<Record<string, string>>((acc, [key, value]) => {
    if (!key || !value) return acc;
    const trimmedKey = key.trim().toLowerCase();
    if (!trimmedKey.startsWith("utm")) return acc;
    const trimmedValue = value.trim();
    if (!trimmedValue) return acc;
    acc[trimmedKey] = trimmedValue.slice(0, 150);
    return acc;
  }, {});

const deriveSource = (utm?: Record<string, string>, referrer?: string) => {
  if (utm?.utm_source) return utm.utm_source;
  if (referrer) {
    const hostname = parseHostname(referrer);
    if (hostname) return hostname;
    return referrer;
  }
  return "direct";
};

export default function WhitePaperForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>(downloadUrlDefault);
  const [delivery, setDelivery] = useState<DeliveryState | null>(null);
  const [tracking, setTracking] = useState<TrackingState>({});

  const analyticsPayload = useMemo(
    () => ({
      source: tracking.source,
      referrer: tracking.referrer,
      landingPage: tracking.landingPage,
      utm_campaign: tracking.utm?.utm_campaign,
      utm_medium: tracking.utm?.utm_medium,
      utm_source: tracking.utm?.utm_source,
      form: "whitepaper_page",
    }),
    [tracking],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let stored: TrackingState = {};
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        stored = JSON.parse(raw) as TrackingState;
      }
    } catch (storageError) {
      console.warn("Unable to read stored tracking metadata", storageError);
    }

    const searchParams = new URLSearchParams(window.location.search);
    const utmEntries = Array.from(searchParams.entries()).reduce<Record<string, string>>((acc, [key, value]) => {
      if (!key || !value) return acc;
      acc[key] = value;
      return acc;
    }, {});

    const utm = normaliseUtm(utmEntries);

    const documentReferrer = document.referrer && !document.referrer.startsWith(window.location.origin)
      ? document.referrer
      : undefined;

    const referrer = stored.referrer && stored.referrer !== "direct" ? stored.referrer : documentReferrer;
    const landingPage = stored.landingPage || window.location.href;
    const nextTracking: TrackingState = {
      utm: Object.keys(utm).length > 0 ? utm : stored.utm,
      referrer: referrer || stored.referrer || "direct",
      landingPage,
    };
    nextTracking.source = stored.source || deriveSource(nextTracking.utm, nextTracking.referrer);

    setTracking(nextTracking);

    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextTracking));
    } catch (storageError) {
      console.warn("Unable to persist tracking metadata", storageError);
    }
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") {
      return;
    }

    const trimmedEmail = email.trim();
    if (!isValidEmail(trimmedEmail)) {
      setErrorMessage("Enter a valid work email address.");
      return;
    }

    if (!consent) {
      setErrorMessage("Please provide consent so we can email you the white paper.");
      return;
    }

    setStatus("submitting");
    setErrorMessage(null);
    setDelivery(null);

    try {
      const response = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          consent: true,
          utm: tracking.utm,
          referrer: tracking.referrer,
          source: tracking.source,
          landingPage: tracking.landingPage,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error((payload as { error?: string })?.error || "Unable to submit the form right now.");
      }

      const payload = (await response.json()) as {
        ok: boolean;
        downloadUrl?: string;
        emailSent?: boolean;
        message?: string;
      };
      if (!payload.ok) {
        throw new Error("Unexpected response from the server.");
      }

      setDownloadUrl(payload.downloadUrl || downloadUrlDefault);
      setDelivery({
        sent: payload.emailSent ?? false,
        message: payload.message ?? undefined,
      });
      setStatus("success");

      track("LeadMagnetSubmit", analyticsPayload);

      const plausible = (window as typeof window & {
        plausible?: (event: string, options?: Record<string, unknown>) => void;
      }).plausible;
      if (typeof plausible === "function") {
        plausible("LeadMagnetSubmit", { props: analyticsPayload });
      }
    } catch (submissionError) {
      setStatus("error");
      setErrorMessage(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong. Please try again in a moment.",
      );
    }
  };

  return (
      <div className="relative isolate overflow-hidden py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(107,140,255,0.08),_transparent_60%)]"
        />
        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-20 pt-12 sm:gap-12 sm:pb-24 sm:pt-16 lg:flex-row lg:items-start lg:gap-16 lg:px-6 xl:gap-20">
          <section className="w-full max-w-3xl space-y-8 sm:space-y-10 lg:flex-1 lg:space-y-12 lg:min-w-0">
            <div className="space-y-5 sm:space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--primary)]/30 bg-[color:var(--primary)]/8 px-4 py-1.5 text-sm font-medium uppercase tracking-[0.18em] text-[color:var(--primary-2)] transition-colors hover:border-[color:var(--primary)]/40 hover:bg-[color:var(--primary)]/12">
                Resource
              </span>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1] text-balance">
                The HR leader&apos;s field guide to AI-ready systems
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-white/75 text-pretty sm:text-lg sm:leading-relaxed">{description}</p>
            </div>

            <dl className="grid grid-flow-col auto-cols-[minmax(12rem,1fr)] gap-4 overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-white/80 backdrop-blur-sm transition-all hover:border-white/15 hover:bg-white/[0.04] [scrollbar-width:none] sm:auto-cols-auto sm:grid-flow-row sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:p-8 [&::-webkit-scrollbar]:hidden">
              {highlights.map((item) => (
                <div key={item.label} className="space-y-1.5 min-w-0">
                  <dt className="text-xs uppercase tracking-[0.2em] text-white/60 text-pretty">{item.label}</dt>
                  <dd className="text-2xl font-semibold text-white sm:text-3xl text-balance">{item.value}</dd>
                </div>
              ))}
            </dl>

            <section
              className={`wp-whats-inside ${styles.wpWhatsInsideSection} space-y-8 sm:space-y-10 rounded-3xl border border-white/10 bg-[#0B1324]/60 p-8 sm:p-10 shadow-2xl backdrop-blur-sm transition-all hover:border-white/15`}
            >
              <div className="space-y-5 sm:space-y-6 w-full">
                <h2
                  id="whats-inside"
                  className="text-2xl font-semibold text-white sm:text-3xl"
                >
                  What&apos;s inside
                </h2>
                <ul
                  role="list"
                  aria-labelledby="whats-inside"
                  className={`wp-whats-inside__list ${styles.wpWhatsInsideList} grid gap-4 text-base text-white/75 sm:gap-6 sm:text-lg`}
                >
                  {benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className={`wp-whats-inside__item ${styles.wpWhatsInsideItem} group rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.05] sm:p-6`}
                    >
                      <span className="inline-flex size-10 items-center justify-center rounded-full bg-[color:var(--primary)]/12 text-[color:var(--primary-2)] shadow-[0_8px_18px_rgba(20,40,80,0.25)] transition-colors group-hover:bg-[color:var(--primary)]/18">
                        <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 12 12">
                          <path
                            d="M10.414 2.414a2 2 0 0 1 0 2.828l-4.95 4.95a2 2 0 0 1-2.828 0l-1.707-1.707a1 1 0 1 1 1.414-1.414l1.707 1.707a1 1 0 0 0 1.414 0l4.95-4.95a2 2 0 0 0 0-2.828 1 1 0 0 1 1.414 0Z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                      <span className="leading-relaxed text-pretty">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-5 sm:space-y-6 w-full">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--primary-2)]">Trusted by leaders at</h3>
                <div className="grid grid-flow-col auto-cols-[minmax(16rem,1fr)] gap-4 overflow-x-auto [scrollbar-width:none] sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-2 sm:gap-6 sm:overflow-visible [&::-webkit-scrollbar]:hidden">
                  {credibilityQuotes.map((testimonial) => (
                    <blockquote key={testimonial.name} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 text-sm text-white/80 backdrop-blur-sm transition-all hover:border-white/15 hover:bg-white/[0.05] hover:shadow-lg">
                      <p className="text-white/90 leading-relaxed text-pretty">&quot;{testimonial.quote}&quot;</p>
                      <footer className="mt-4 text-xs uppercase tracking-[0.2em] text-white/55 text-pretty">{testimonial.name}</footer>
                    </blockquote>
                  ))}
                </div>
              </div>
            </section>
          </section>

          <aside className="w-full max-w-xl lg:sticky lg:top-28 lg:min-w-[22rem] lg:flex-shrink-0">
            <div className="rounded-3xl border border-white/10 bg-[#0B1324]/70 p-8 sm:p-10 shadow-2xl backdrop-blur-sm transition-all hover:border-white/15">
              {status === "success" ? (
                <div className="space-y-6 sm:space-y-7" aria-live="polite">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--primary-2)]">You&apos;re all set</p>
                    <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                      {delivery?.sent ? "Check your inbox" : "Instant download ready"}
                    </h2>
                    <p className="text-base text-white/75 leading-relaxed">
                      {delivery?.sent ? (
                        <>
                          We&apos;ve emailed a copy to <span className="font-medium text-white break-words">{email}</span>. You can also access it directly below.
                        </>
                      ) : (
                        <>
                          Email delivery is pending, so use the instant download below. We&apos;ll follow up at <span className="font-medium text-white break-words">{email}</span> once it sends.
                        </>
                      )}
                    </p>
                    {delivery?.message && (
                      <p className="rounded-2xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                        {delivery.message}
                      </p>
                    )}
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all hover:border-white/15 hover:bg-white/[0.05]">
                    <p className="text-sm text-white/65">Icarius HR AI Readiness White Paper (PDF)</p>
                    <a
                      href={downloadUrl || DOWNLOAD_PATH}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--primary-2)] px-6 py-3 text-base font-semibold text-slate-950 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary)]/60"
                    >
                      <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 3a1 1 0 1 1 2 0v6.586l1.293-1.293a1 1 0 0 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3A1 1 0 0 1 6.996 8.29L8.293 9.586V3Zm-7 9a2 2 0 0 1 2-2h2a1 1 0 1 1 0 2H4v3h12v-3h-2a1 1 0 1 1 0-2h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3Z" />
                      </svg>
                      Download the PDF
                    </a>
                  </div>
                  <p className="text-xs text-white/45">
                    Need help activating the playbook? <Link href="/contact" className="text-[color:var(--primary-2)] underline underline-offset-4 hover:text-[color:var(--primary)] transition-colors">Talk with Icarius</Link> and we&apos;ll map the next sprint.
                  </p>
                </div>
              ) : (
                <form className="space-y-6 sm:space-y-7" noValidate onSubmit={submit}>
                  <div className="space-y-2.5">
                    <label htmlFor="whitepaper-email" className="text-sm font-semibold text-white">
                      Work email
                    </label>
                    <input
                      id="whitepaper-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-[#0F1A32]/80 px-4 py-3.5 text-base text-white placeholder:text-white/40 backdrop-blur-sm transition-all focus:border-[color:var(--primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/40 hover:border-white/15"
                      placeholder="you@company.com"
                      aria-describedby="whitepaper-email-helper"
                      aria-invalid={errorMessage ? true : undefined}
                    />
                    <p id="whitepaper-email-helper" className="text-xs text-white/55 leading-relaxed">
                      We&apos;ll send the PDF and a short series of Icarius insights. Unsubscribe anytime.
                    </p>
                  </div>
                  <label className="flex items-start gap-3 text-sm text-white/80 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="mt-1 size-4 rounded border-white/30 bg-transparent text-[color:var(--primary)] focus:ring-[color:var(--primary)]/40 transition-colors cursor-pointer"
                      required
                      checked={consent}
                      onChange={(event) => setConsent(event.target.checked)}
                    />
                    <span>
                      I agree to receive the white paper and relevant Icarius updates. I understand I can opt out whenever I choose.
                    </span>
                  </label>
                  {errorMessage && (
                    <p role="alert" className="rounded-lg bg-rose-500/10 border border-rose-400/20 px-4 py-3 text-sm text-rose-300" aria-live="assertive">
                      {errorMessage}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--primary-2)] px-6 py-3.5 text-base font-semibold text-slate-950 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary)]/60"
                    aria-busy={status === "submitting"}
                  >
                    {status === "submitting" ? (
                      <>
                        <svg aria-hidden="true" className="size-5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
                          <path
                            d="M4 4h16l-2.5 7.5L20 19l-8-4-8 4 2.5-7.5L4 4Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Send me the white paper
                      </>
                    )}
                  </button>
                  <p className="text-xs text-white/45 leading-relaxed">
                    We recommend using a company email. By submitting, you acknowledge Icarius&apos;s <Link href="/privacy" className="text-[color:var(--primary-2)] underline underline-offset-4 hover:text-[color:var(--primary)] transition-colors">privacy policy</Link>.
                  </p>
                </form>
              )}
            </div>
          </aside>
        </div>
      </div>
  );
}
