// pages/whitepaper.tsx
import { useState } from "react";

export default function Whitepaper() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "done" | "error"
  >("idle");
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    title: "",
    consent: false,
  });
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>(undefined);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Network");
      const data = await res.json();
      setDownloadUrl(data.signedUrl || "/whitepaper.pdf");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      console.error(err);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#071033] to-[#0f172a] text-white p-6">
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur rounded-2xl p-8 lg:p-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl lg:text-4xl font-semibold leading-snug">
              De-risk HRIS change — Enable AI in HR
            </h1>
            <p className="mt-4 text-slate-200">
              A practical playbook for HR leaders: stabilise payroll &
              integrations, run a fast HRIS diagnostic, and pilot safe AI.
            </p>
          </div>

          <div className="p-6 bg-slate-900/60 rounded-xl">
            {status === "done" ? (
              <div className="text-center">
                <h3 className="text-lg font-medium">
                  All set — check your inbox
                </h3>
                <p className="mt-2 text-slate-300">
                  If you don&rsquo;t see it, check Promotions or spam. Or
                  download directly:
                </p>
                {downloadUrl && (
                  <a
                    className="underline mt-4 inline-block"
                    href={downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download white paper
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-3">
                <div>
                  <label className="text-xs">
                    Full name
                    <input
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full mt-1 p-2 rounded bg-slate-800 text-white"
                    />
                  </label>
                </div>
                <div>
                  <label className="text-xs">
                    Company
                    <input
                      required
                      value={form.company}
                      onChange={(e) =>
                        setForm({ ...form, company: e.target.value })
                      }
                      className="w-full mt-1 p-2 rounded bg-slate-800 text-white"
                    />
                  </label>
                </div>
                <div>
                  <label className="text-xs">
                    Business email
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full mt-1 p-2 rounded bg-slate-800 text-white"
                    />
                  </label>
                </div>
                <div>
                  <label className="text-xs">
                    Job title (optional)
                    <input
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      className="w-full mt-1 p-2 rounded bg-slate-800 text-white"
                    />
                  </label>
                </div>
                <div className="text-xs">
                  <label className="inline-flex items-center gap-2 text-left">
                    <input
                      required
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) =>
                        setForm({ ...form, consent: e.target.checked })
                      }
                      className="mr-2"
                    />
                    <span>
                      I agree to receive the white paper and follow-up emails.
                    </span>
                  </label>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full py-2 rounded bg-gradient-to-r from-[#0ea5e9] to-[#7dd3fc] font-medium text-slate-900"
                  >
                    {status === "submitting"
                      ? "Submitting…"
                      : "Get the white paper"}
                  </button>
                </div>
                {status === "error" && (
                  <p className="text-xs text-rose-400">
                    There was an error — please try again or email
                    contact@icarius-consulting.com
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
