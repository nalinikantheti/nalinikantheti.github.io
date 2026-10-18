# Nalini K. — artist portfolio

A static portfolio for GitHub Pages, built with HTML, CSS, and JavaScript. No build or package installation is required.

## Run locally

From this directory, run `python3 -m http.server 8000 --bind 127.0.0.1`.

## Update content

- `portfolio-data.js` contains gallery entries and the four complete poems.
- `assets/` contains artwork extracted from the supplied portfolio PDF, converted to WebP. Replace these with higher-resolution originals when available.
- `index.html` contains the introduction, section copy, and inquiry form.
- `styles.css` contains the responsive layout and color palette.

The inquiry form posts JSON to FormSubmit and shows success or error messages on the page. It forwards inquiries to kanthetidesigns@gmail.com after the recipient completes FormSubmit’s one-time email activation. The first live submission triggers an activation email; follow its confirmation link, then submit a fresh test inquiry to verify delivery. Activation and inbox delivery have not been verified from this workspace. Visitor details are processed by FormSubmit. Failed requests retain entered details and show a direct email alternative.

The Freestyle section embeds the artist-supplied Google Drive video. Set sharing to “Anyone with the link — Viewer” for public playback. Playback could not be verified in this workspace because its network proxy blocks Google Drive. Additional videos can be added when their links are supplied.

Fonts are loaded from Google Fonts with local serif and sans-serif fallbacks. Artwork is hosted locally.

Before publishing, review artwork titles (carried over from the reference PDF), biographical copy, poems, and the contact address. Deployment follows this repository's GitHub Pages settings; local edits do not publish automatically until committed and deployed.


The Henna section contains four artist-supplied Google Drive photographs, served using Google’s image URLs without visible Drive links. Each source file must allow “Anyone with the link — Viewer.” The workspace proxy blocks Google-hosted images, so live image loading has not been verified here. Images can be downloaded into `assets/` later for independent hosting when the originals become accessible.

## Portfolio layout

`index.html` is the selected interactive layout, using cream (#f1e7da), plum (#54303e), rose (#94505e), clay (#be907e), and antique gold (#bda174). The alternate design pages and version tabs have been removed.

`experiences.css` and `experiences.js` provide the medium navigation, featured-art viewer, botanical motion, direct hash links, and browser Back/Forward support. Motion respects `prefers-reduced-motion`; artwork tilt is enabled only for fine pointers. Gallery, poetry, booking and form behavior remain in `script.js`, with artwork entries and poems in `portfolio-data.js`.

The selected layout now uses cream as the primary background with plum typography and rose, clay, and gold details. All six homepage covers share the same locally hosted ornamental tile rather than mixing photographs and illustrations. The featured viewer continues to show the artist’s own work. Headings and artwork display labels use consistent title capitalization; poem text is preserved verbatim.

The current visual treatment is in `miniature.css`: warm ivory, olive, terracotta, and gold; three-column arched cards with matching floral frames. `assets/garden-frame.png` is generated decorative background scenery, not an artwork attributed to Nalini. Card artwork and jewelry photographs remain from the supplied portfolio; poetry is quoted from the supplied original. The henna cover uses the supplied Drive image and a decorative fallback if the external image cannot load.

Homepage card covers now use coordinated decorative lotus/paisley illustrations instead of portfolio images. The first featured artwork is Beetlejuice; all four carousel entries are digital animal illustrations. `assets/tiger-engraving.png` is a generated decorative footer ornament, not portfolio artwork.

The six category cards now use a coordinated generated fine-line editorial illustration sheet (`assets/category-fineline.png`) as decorative navigation covers; these are not the artist’s portfolio work. The Music section explicitly titles the featured video “I’m So Fucking Cool,” with the existing artist and sound-design credits retained. The paisley beside the homepage name has been removed.

Category covers use delicate outlined symbols on ivory: lotus, notebook, floral henna rosette, pendant, record, and flowering branch. They are representative navigation illustrations, not photographs or examples of Nalini’s work.

The category cards use cusped arch frames in a three-column layout (two columns on smaller tablets, one on phones). Their representative imagery uses fine olive and gold outlines with minimal terracotta accents.

Jewelry has no separate navigation entry or homepage card; its work is available through the Jewelry filter in Visual Art. Contact includes a clearly labeled lorem ipsum Artist Statement placeholder. The supplied chat headshot was not available as a filesystem attachment; a hidden portrait slot is prepared but no substitute image is published. Add the supplied original to that slot when an accessible file or link is provided.

The Contact portrait now uses the supplied headshot through a direct Google-hosted image source. There is no visible URL or clickable Drive link. The workspace proxy blocks downloading Google-hosted images, so the photo remains externally hosted and actual delivery cannot be verified here. Public Viewer sharing is required.

Headshot delivery is now fixed: `assets/nalini-headshot.jpg` is downloaded and committed locally. Contact uses that local path, with eager loading. The actual 2048×1365 image successfully decoded in a local browser, and the mobile layout passed. There is no Google dependency or Drive link for the portrait. The import workflow remains available for refreshing the source photograph.

## Writing

The main navigation uses Writing, with accessible Poetry and Short Stories views. Existing `#poetry` links resolve to Writing. `stories-data.js` stores the complete text of the two supplied documents, Runner Up! and Tigerlily. `writing.js` renders titles and story text with textContent, preserves paragraph breaks, and provides reading estimates plus previous/next story controls. `writing.css` styles the cards and reader. Google Docs links do not appear in the interface. The import workflow can refresh the supplied documents; imports preserve their content rather than editing the writing.

Short stories are paginated by their existing scene headings (9 chapters in Runner Up!, 11 in Tigerlily). The reader offers Previous/Next Chapter, a chapter selector, a full-screen toggle, Start Over, and an explicit Finish Story action. Progress is stored per story in localStorage using a chapter title and within-chapter scroll ratio. It resumes in the same browser on the same site origin; no account or cross-device sync is involved. Storage failures do not prevent reading and show an unavailable status. Bookmarks are flushed on chapter changes, closing, page hide, and after scrolling. Pagination was checked against the full original text, and reload/resume plus mobile behavior were tested.

## Mobile media and presentation

All three supplied videos are now hosted locally in `assets/media/` as 720×1280 H.264/AAC MP4s with fast-start metadata, actual-frame JPEG posters, native controls, and playsinline. They use `preload="none"` to avoid downloading the full videos until playback. `mobile.css` preserves the real media aspect ratios and fixes mobile tap targets, form font sizes (to avoid iOS input zoom), narrow reader controls, and viewport fitting. `media.js` provides a retry state, and navigating away from Music pauses playback. The manual import workflow can refresh the three source videos. Temporary diagnostic workflow/status files were removed after successful conversion.

Actual encoded files were decoded and played in Chromium touch emulation; site sections were checked at 320, 375, 390, 430, and 768 pixels. Scene pagination, saved reading positions, fullscreen, mobile form sizing, and layout checks passed. Physical iPhone/Safari playback has not been independently tested.
