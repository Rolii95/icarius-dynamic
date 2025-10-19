"use client";

import { useEffect, useMemo, useState } from "react";
import Head from "next/head";

const STORAGE_KEY = "icarius:leads-export-key";

type LeadRow = Record<string, string>;

const parseCsv = (csv: string): { headers: string[]; rows: LeadRow[] } => {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  let row: string[] = [];

  const pushCell = () => {
    row.push(current);
    current = "";
  };

  for (let i = 0; i < csv.length; i += 1) {
    const char = csv[i];

    if (char === '"') {
      if (inQuotes && csv[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      pushCell();
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && csv[i + 1] === "\n") {
        i += 1;
      }
      pushCell();
      if (row.length > 1 || row[0]) {
        rows.push(row);
      }
      row = [];
      continue;
    }

    current += char;
  }

  pushCell();
  if (row.length > 1 || row[0]) {
    rows.push(row);
  }

  if (rows.length === 0) {
    return { headers: [], rows: [] };
  }

  const [headerRow, ...dataRows] = rows;
  const headers = headerRow.map((cell) => cell.trim());
  const records = dataRows.map((cells) => {
    const record: LeadRow = {};
    headers.forEach((header, index) => {
      record[header] = cells[index] ?? "";
    });
    return record;
  });

  return { headers, rows: records };
};

const maskEmail = (email: string) => {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const maskedLocal = local.length <= 2 ? "*".repeat(local.length) : `${local[0]}***${local.slice(-1)}`;
  return `${maskedLocal}@${domain}`;
};

export default function LeadsAdminPage() {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<LeadRow[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      setApiKey(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!apiKey) {
      window.sessionStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.sessionStorage.setItem(STORAGE_KEY, apiKey);
  }, [apiKey]);

  const fetchLeads = async () => {
    if (!apiKey.trim()) {
      setError("Provide the LEADS_EXPORT_KEY to load data.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/leads-export", {
        headers: { Authorization: `Bearer ${apiKey.trim()}` },
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error((payload && payload.error) || "Unable to fetch leads");
      }

      const text = await response.text();
      const { headers: parsedHeaders, rows: parsedRows } = parseCsv(text);
      setHeaders(parsedHeaders);
      setRows(parsedRows);

      const blob = new Blob([text], { type: "text/csv" });
      setDownloadUrl((previous) => {
        if (previous) {
          window.URL.revokeObjectURL(previous);
        }
        return window.URL.createObjectURL(blob);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
      setHeaders([]);
      setRows([]);
      setDownloadUrl(null);
    } finally {
      setLoading(false);
    }
  };

  const maskedPreview = useMemo<LeadRow[]>(() => {
    return rows.map((row) => {
      const masked: LeadRow = {
        ...row,
        email: row.email ? maskEmail(row.email) : row.email,
      };
      return masked;
    });
  }, [rows]);

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        window.URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  return (
    <>
      <Head>
        <title>Lead exports | Icarius admin</title>
      </Head>
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-16">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Lead exports</h1>
          <p className="text-sm text-slate-500">
            Protect this route with Basic Auth, Vercel team access, or SSO. Rotate the LEADS_EXPORT_KEY regularly and
            avoid storing it in client-side code.
          </p>
        </header>
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="block text-sm font-medium text-slate-700">
            API key
            <input
              type="password"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm"
              placeholder="LEADS_EXPORT_KEY"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={fetchLeads}
              disabled={loading}
              className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Loading..." : "Fetch leads"}
            </button>
            {downloadUrl && (
              <a
                href={downloadUrl}
                download="leads-export.csv"
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400"
              >
                Download CSV
              </a>
            )}
          </div>
          {error && <p className="text-sm text-rose-500">{error}</p>}
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {headers.length === 0 ? (
            <p className="text-sm text-slate-500">No leads loaded yet. Provide an API key and fetch the latest export.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead>
                  <tr>
                    {headers.map((header) => (
                      <th key={header} className="px-3 py-2 font-semibold text-slate-600">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {maskedPreview.map((row, rowIndex) => (
                    <tr key={`${row.email}-${rowIndex}`} className="hover:bg-slate-50">
                      {headers.map((header) => (
                        <td key={header} className="px-3 py-2 text-slate-700">
                          {row[header] || "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
