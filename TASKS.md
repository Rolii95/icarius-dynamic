# Pending Tasks

## Go back button indentation adjustments

The "Go back" button currently relies on a negative left margin wrapper (e.g. `div` elements with the `-ml-2` class) on several pages, which causes the button to hang outside the container instead of sitting just to the left of the page title.

- [x] Refactor `components/ConditionalGoBackButton.tsx` so it exposes a stable indentation utility (for example, by giving the component an internal wrapper or a default left offset class) instead of expecting each page to offset it manually.
- [x] Update every page that renders the button (`app/about/page.tsx`, `app/accessibility/page.tsx`, `app/contact/page.tsx`, `app/packages/page.tsx`, `app/privacy/page.tsx`, `app/services/page.tsx`, `app/terms/page.tsx`, `app/work/page.tsx`, and `app/blog/blog-index.tsx`) to remove the `-ml-2` wrapper and instead place the button and heading in a flex row where the button's right edge sits slightly before the first character of the title (e.g. by using `flex`, `items-center`, and a small `gap`).
- [x] Verify on each updated page that the button remains aligned with the title baseline and that the indentation is consistent across viewports.

