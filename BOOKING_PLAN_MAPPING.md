# Booking Plan Mapping

You can map specific booking plans to different Calendly event URLs using the environment variable `NEXT_PUBLIC_BOOKING_PLAN_MAP`.

## How to use

1. **Set the environment variable** in your `.env.local` (or Vercel/production env):

```
NEXT_PUBLIC_BOOKING_PLAN_MAP="audit-sprint:https://calendly.com/icarius-consulting/audit,delivery-jumpstart:https://calendly.com/icarius-consulting/delivery,ai-readiness:https://calendly.com/icarius-consulting/ai"
```

- Each entry is `plan-key:calendly-url`, separated by commas.
- Example above maps three plans to three different event types.

2. **How it works:**
   - When a CTA or modal uses a `plan` prop (e.g. `plan="audit-sprint"`), the booking logic will use the mapped URL if present, otherwise it falls back to the default account URL.
   - If no plan is provided, the default Calendly account URL is used.

3. **No code changes needed:**
   - Just update the env variable and redeploy/restart. All CTAs and modals will use the new mapping automatically.

## Example

- `plan="audit-sprint"` → `https://calendly.com/icarius-consulting/audit`
- `plan="delivery-jumpstart"` → `https://calendly.com/icarius-consulting/delivery`
- `plan="ai-readiness"` → `https://calendly.com/icarius-consulting/ai`
- Any other plan or no plan → `NEXT_PUBLIC_BOOKING_URL` or `NEXT_PUBLIC_CALENDLY_URL`

---

**To add or change mappings:**
- Edit `.env.local` and update `NEXT_PUBLIC_BOOKING_PLAN_MAP`.
- Save and restart your dev server or redeploy.

---

See `lib/booking.ts` for implementation details.
