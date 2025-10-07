# Pending Tasks

## Go back button indentation adjustments

Ensure the "Go back" button keeps its original vertical placement above each page title while still nudging slightly to the left so its right edge sits just before the first letter of the heading.

- [x] Refactor `components/ConditionalGoBackButton.tsx` to provide an internal wrapper that adds a consistent left offset and vertical spacing without forcing consumers to rearrange their headings.
- [x] Update every page that renders the button (`app/about/page.tsx`, `app/accessibility/page.tsx`, `app/contact/page.tsx`, `app/packages/page.tsx`, `app/privacy/page.tsx`, `app/services/page.tsx`, `app/terms/page.tsx`, `app/work/page.tsx`, and `app/blog/blog-index.tsx`) so the button remains above the title, relying on the shared wrapper for indentation instead of placing the button and heading in the same row.
- [x] Verify on each updated page that the button preserves the stacked layout and that the indentation is consistent across viewports.

