"use client";

import { useState } from "react";
import Head from "next/head";
import { track } from "@/lib/analytics";

const DOWNLOAD_PATH = "/assets/icarius-hr-ai-whitepaper.pdf";

type Status = "idle" | "submitting" | "success" | "error";

export default function WhitePaperPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

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
        body: JSON.stringify({ email, consent }),
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
      track("LeadMagnetSubmit", { source: "whitepaper_page" });
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
