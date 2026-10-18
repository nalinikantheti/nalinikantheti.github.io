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


The Henna section contains four artist-supplied Google Drive photographs, served using Google’s image URLs with direct Drive links as fallbacks. Each source file must allow “Anyone with the link — Viewer.” The workspace proxy blocks Google-hosted images, so live image loading has not been verified here. Images can be downloaded into `assets/` later for independent hosting when the originals become accessible.
