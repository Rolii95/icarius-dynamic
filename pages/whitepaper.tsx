import { useState } from "react";
import Link from "next/link";
import styles from "./whitepaper.module.css";

const stats = [
  { value: "27%+", label: "Payroll accuracy lift in 60 days" },
  { value: "5 squads", label: "Cross-functional AI pilots launched" },
  { value: "70+ countries", label: "HR teams enabled worldwide" },
];

const whatsInside = [
  "Rapid HRIS diagnostic checklist to stabilise payroll and integrations.",
  "Executive-ready ROI storyboard to secure leadership funding.",
  "Governance guardrails for rolling out responsible HR AI copilots.",
  "Change management playbook to keep adoption on track post-launch.",
];

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
    if (status === "submitting") {
      return;
    }
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
    <main className={styles.page}>
      <div className={styles.wrapper}>
        <header className={styles.hero}>
          <div>
            <h1 className={styles.heroTitle}>
              De-risk HRIS change — Enable AI in HR
            </h1>
            <p className={styles.heroCopy}>
              A practical playbook for HR leaders navigating Workday or SAP rollouts — and preparing your HR function for agentic AI.
            </p>
          </div>

          <div className={styles.statsContainer}>
            {stats.map((stat, idx) => (
              <div key={idx} className={styles.statBox}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </header>

        <aside className={styles.sidebar}>
          {status === "done" && downloadUrl ? (
            <div className={styles.success}>
              <h2 className={styles.successTitle}>✓ Check your inbox!</h2>
              <p className={styles.successText}>
                We&apos;ve sent the white paper to {form.email}.
              </p>
              <a
                href={downloadUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.downloadButton}
              >
                Download now
              </a>
            </div>
          ) : (
            <>
              <h2 className={styles.sidebarTitle}>What&apos;s inside</h2>
              <ul className={styles.bulletList}>
                {whatsInside.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <form onSubmit={submit} className={styles.form}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="whitepaper-name">Full name</label>
                  <input
                    required
                    id="whitepaper-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label htmlFor="whitepaper-company">Company</label>
                  <input
                    required
                    id="whitepaper-company"
                    value={form.company}
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label htmlFor="whitepaper-email">Business email</label>
                  <input
                    required
                    type="email"
                    id="whitepaper-email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label htmlFor="whitepaper-title">Job title (optional)</label>
                  <input
                    id="whitepaper-title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <label className={styles.checkboxRow} htmlFor="whitepaper-consent">
                  <input
                    required
                    type="checkbox"
                    id="whitepaper-consent"
                    checked={form.consent}
                    onChange={(e) =>
                      setForm({ ...form, consent: e.target.checked })
                    }
                  />
                  <span className={styles.consentText}>
                    I agree to receive the white paper and follow-up emails.
                  </span>
                </label>
                {status === "error" && (
                  <p className={styles.errorMessage}>
                    There was an error — please try again or email
                    contact@icarius-consulting.com
                  </p>
                )}
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? "Submitting..." : "Get the white paper"}
                </button>
                <p className={styles.formFooter}>
                  We&apos;ll send the PDF and a short series of Icarius insights. Unsubscribe
                  anytime.
                </p>
              </form>
            </>
          )}
        </aside>
      </div>
    </main>
  );
}
