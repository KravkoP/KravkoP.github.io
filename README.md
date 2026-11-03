# BebraSoftAI site

Public site served by GitHub Pages at https://kravkop.github.io: the developer page, privacy policies for each app, and later `app-ads.txt` at the root.

- `index.html`: developer page (the "Website" in Play Console).
- `broken-screen/privacy/`: privacy policy of Broken Screen Prank. Its source text is `docs/PRIVACY_POLICY.md` in the private `broken-screen` repository; keep both in sync.
- `danger-radar/privacy/`: privacy policy of Danger Radar. Its source text is `docs/PRIVACY_POLICY.md` in the private `danger-radar` repository; keep both in sync.
- `gps-toolkit/privacy/`: privacy policy of GPS Toolkit. Its source text is `docs/PRIVACY_POLICY.md` in the private `gps-toolkit` repository; keep both in sync.
- `romantic-novels/privacy/` and `romantic-novels/terms/`: privacy policy and terms of service of Romantic Novels. Their source texts live in `docs/privacy/` and `docs/terms/` in the private `novels` repository; keep both in sync.
- `style.css`, `site.js`: shared design system and progressive enhancement for all pages. No external requests: no web fonts, CDNs or trackers.
- `assets/icons/<slug>.webp|svg`: 192 px app icons built from each app's launcher art.

## Rules

- Never move or rename a policy page: these URLs are registered in Play Console. The same goes for `app-ads.txt`.
- Copy on the home page must be backed by the app's own policy. No invented stats, ratings or testimonials.

## Adding an app

1. Add `assets/icons/<slug>.webp` (or `.svg`).
2. Copy an existing `<li class="reveal" data-cat="...">` card in `index.html`. `site.js` builds the hero icon wall and the app and document counts from the catalog cards, so every document needs a link in its card. Then update the numbers in the HTML (the no-JS fallback), in the `description` and `og:description` meta tags, and in `assets/og.png`: these are read without running scripts.
3. Copy `broken-screen/privacy/index.html` to `<slug>/privacy/index.html` and replace the content of `<main>`, the title, the icon and the contents list. Each `<h2>` needs an `id` that matches its contents link. A page that only links `style.css` also renders correctly, without the top bar.
