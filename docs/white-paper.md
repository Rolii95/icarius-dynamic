# White paper asset management

The `/resources/white-paper` landing page serves a placeholder PDF from `public/assets/icarius-hr-ai-whitepaper.pdf`. Replace this file with the production-ready asset before launch:

1. Add the final PDF to `public/assets/icarius-hr-ai-whitepaper.pdf`. Keep the filename stable so cached links remain valid.
2. Commit the change if the file is lightweight enough for the repository. For larger files or versioned collateral, prefer hosting the PDF on a private bucket (for example, Amazon S3) and expose a short-lived, signed URL instead of a static asset.
3. Update environment variables in Vercel so `NEXT_PUBLIC_BASE_URL` (or `BASE_URL`) matches the canonical domain. The landing page and API use this value for SEO metadata and download links.

Operational hardening tips:

- Rotate signed URLs on a schedule if you host the PDF externally and store the latest link in a secure secret manager.
- Consider adding bot protection (rate limiting or CAPTCHA) to `/api/lead-magnet` before scaling paid campaigns.
