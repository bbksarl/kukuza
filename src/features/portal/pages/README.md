# Portal Home Page Components

This folder contains the new, maintainable components for the portal home page.

Components:
- `Header.tsx` — top navigation, logo and action buttons.
- `Banner.tsx` — hero area for promo banner.
- `Boutiques.tsx` — boutiques carousel / logos.

Usage:
- `Home.tsx` composes these components and is designed to be clean and extendable.
- Styles are componentized and split under `src/features/portal/components/portal/` where each component imports its own CSS:
	- `portal-base.css` (global variables & layout) — loaded by `src/design-system/app.css`
	- `header.css` (header and nav styles)
	- `banner.css` (banner/video/hero styles)
	- `animations.css` (active underline and interaction animations)
	 - `boutiques.css` (boutique logos carousel)

- Extending:
- Add more boutique logos to `Boutiques` by updating `public/assets/boutiques` or by passing a `logos` prop to `Boutiques` to supply a custom list of image paths.
- For real images, use `banner.css` background or add an MP4 to `public/assets/MEET.mp4` and the banner will use it automatically.
 - Add boutique logos to `public/assets/boutiques` and update `Boutiques.jsx` if you want to change the default set; you can also pass a `logos` prop to the `Boutiques` component to supply a custom list of image paths.
- Replace emoji icons with SVG components to improve visual fidelity.

Testing:
- Start the unified dev server from the repository root with `npm run dev`.
- Navigate to `localhost:3000` (or appropriate port) and verify the header, banner and categories show correctly.
