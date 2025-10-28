"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { track } from "@/lib/analytics";

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
  "Benchmark your HR team's AI and data literacy skills against best practices. Discover the 48-point gap limiting your strategic success.",
  "Identify the top 3 high-impact opportunities for AI to drive immediate value. Avoid the costs of \"Random Acts of AI.\"",
  "Get a 3-Phase Action Plan for upskilling your teams and mitigating the Trust Deficit. Transform HR into a strategic driver.",
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
    <Section className="py-16 sm:py-20">
      <PageHeader
        title="The HR leader&apos;s field guide to AI-ready systems"
        headingClassName="text-4xl font-semibold tracking-tight text-white sm:text-5xl heading-underline"
        contentClassName="max-w-5xl space-y-8"
        showBack={false}
        eyebrow={
          <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--primary)]/30 bg-[color:var(--primary)]/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--primary-2)]">
            Resource
          </span>
        }
      >
        <p className="text-lg text-slate-300 sm:text-xl">{description}</p>
        <dl className="grid gap-4 sm:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 shadow-[0_10px_30px_rgba(15,22,36,0.4)]"
            >
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-300">{item.label}</dt>
              <dd className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{item.value}</dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      <div className="container mx-auto mt-12 grid items-start gap-12 px-4 md:px-6 lg:mt-16 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
        <div className="space-y-12">
          <section className="space-y-6 rounded-3xl border border-white/10 bg-slate-950/40 p-8 shadow-[0_14px_40px_rgba(12,18,30,0.35)] backdrop-blur-sm">
            <div className="space-y-2">
              <h2 id="whats-inside" className="text-2xl font-semibold text-white sm:text-3xl">
                What&apos;s inside
              </h2>
            </div>
            <ul role="list" aria-labelledby="whats-inside" className="grid gap-4 md:grid-cols-2">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-200 transition-colors hover:border-white/20 hover:bg-slate-900/80 sm:text-base"
                >
                  <span className="mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--primary)]/15 text-[color:var(--primary-2)]">
                    <svg aria-hidden="true" className="size-3.5" fill="none" viewBox="0 0 12 12">
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
          </section>

          <section className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/30 p-8 shadow-[0_14px_40px_rgba(12,18,30,0.25)] backdrop-blur-sm">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--primary-2)]">
              Trusted by leaders at
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {credibilityQuotes.map((testimonial) => (
                <blockquote
                  key={testimonial.name}
                  className="h-full rounded-2xl border border-white/10 bg-slate-900/50 p-6 text-sm text-slate-200 transition-colors hover:border-white/20 hover:bg-slate-900/70"
                >
                  <p className="text-slate-100 leading-relaxed">&quot;{testimonial.quote}&quot;</p>
                  <footer className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-400">
                    {testimonial.name}
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>
        </div>

        <aside className="w-full">
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-8 shadow-[0_18px_60px_rgba(10,16,28,0.45)] backdrop-blur-md">
            {status === "success" ? (
              <div className="flex flex-col gap-6" aria-live="polite">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--primary-2)]">
                    You&apos;re all set
                  </p>
                  <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                    {delivery?.sent ? "Check your inbox" : "Instant download ready"}
                  </h2>
                  <p className="text-sm text-slate-200 sm:text-base">
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
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
                  <p className="text-sm text-slate-300">Icarius HR AI Readiness White Paper (PDF)</p>
                  <a
                    href={downloadUrl || DOWNLOAD_PATH}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--primary-2)] px-6 py-3 text-base font-semibold text-slate-950 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary)]/60"
                  >
                    <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 3a1 1 0 1 1 2 0v6.586l1.293-1.293a1 1 0 0 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3A1 1 0 0 1 6.996 8.29L8.293 9.586V3Zm-7 9a2 2 0 0 1 2-2h2a1 1 0 1 1 0 2H4v3h12v-3h-2a1 1 0 1 1 0-2h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3Z" />
                    </svg>
                    Download the PDF
                  </a>
                </div>
                <p className="text-xs text-slate-400">
                  Need help activating the playbook? <Link href="/contact" className="text-[color:var(--primary-2)] underline underline-offset-4 hover:text-[color:var(--primary)] transition-colors">Talk with Icarius</Link> and we&apos;ll map the next sprint.
                </p>
              </div>
            ) : (
              <form className="flex flex-col gap-5" noValidate onSubmit={submit}>
                <div className="space-y-2">
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
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-base text-white placeholder:text-slate-400 transition focus:border-[color:var(--primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/40"
                    placeholder="you@company.com"
                    aria-describedby="whitepaper-email-helper"
                    aria-invalid={errorMessage ? true : undefined}
                  />
                  <p id="whitepaper-email-helper" className="text-xs text-slate-400">
                    We&apos;ll send the PDF and a short series of Icarius insights. Unsubscribe anytime.
                  </p>
                </div>
                <label className="flex items-start gap-3 text-sm text-slate-200">
                  <input
                    type="checkbox"
                    className="mt-1 size-4 rounded border-white/30 bg-transparent text-[color:var(--primary)] focus:ring-[color:var(--primary)]/40 transition-colors"
                    required
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                  />
                  <span>
                    I agree to receive the white paper and relevant Icarius updates. I understand I can opt out whenever I choose.
                  </span>
                </label>
                {errorMessage && (
                  <p role="alert" className="rounded-lg border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200" aria-live="assertive">
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
                      Download white paper now
                    </>
                  )}
                </button>
                <p className="text-xs text-slate-400">
                  We recommend using a company email. By submitting, you acknowledge Icarius&apos;s <Link href="/privacy" className="text-[color:var(--primary-2)] underline underline-offset-4 hover:text-[color:var(--primary)] transition-colors">privacy policy</Link>.
                </p>
              </form>
            )}
          </div>
        </aside>
      </div>
    </Section>
  );
}
