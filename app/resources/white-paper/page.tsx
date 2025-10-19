import type { Metadata } from "next";
import WhitePaperForm from "./WhitePaperForm";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.icarius-consulting.com";
const canonicalUrl = `${baseUrl}/resources/white-paper`;

export const metadata: Metadata = {
  title: "HR AI Readiness White Paper | Icarius Consulting",
  description: "Stabilise HR data foundations, govern AI responsibly, and deliver ROI on your next HRIS transformation with Icarius Consulting.",
  alternates: { canonical: "/resources/white-paper" },
  openGraph: {
    title: "The HR leader's field guide to AI-ready systems",
    description: "Stabilise HR data foundations, govern AI responsibly, and deliver ROI on your next HRIS transformation with Icarius Consulting.",
    url: canonicalUrl,
    images: [{ url: `${baseUrl}/hero.svg`, width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

export default function WhitePaperPage() {
  return <WhitePaperForm />;
}
