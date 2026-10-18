# Nalini K. — artist portfolio

A static portfolio for GitHub Pages, built with HTML, CSS, and JavaScript. No build or package installation is required.

## Run locally

From this directory, run `python3 -m http.server 8000 --bind 127.0.0.1`.

## Update content

- `portfolio-data.js` contains gallery entries and the four complete poems.
- `assets/` contains artwork extracted from the supplied portfolio PDF, converted to WebP. Replace these with higher-resolution originals when available.
- `index.html` contains the introduction, section copy, and inquiry form.
- `styles.css` contains the responsive layout and color palette.

The inquiry form validates required fields and opens a prepared email to kanthetidesigns@gmail.com. The visitor must send it from their email application. A download button provides the same inquiry as a text file. No submission backend or automatic booking confirmation is configured, and form data is not stored by the site.

Fonts are loaded from Google Fonts with local serif and sans-serif fallbacks. Artwork is hosted locally. The original `more-about-henna.html` page remains available at its existing path.

Before publishing, review artwork titles (carried over from the reference PDF), biographical copy, poems, and the contact address. Deployment follows this repository's GitHub Pages settings; local edits do not publish automatically until committed and deployed.
