# 🛒 ShopKart

A free, Flipkart-style shopping app you **fully control** — add your own products, change the store name, colors, banners, categories, prices, and images. No backend, no servers, no fees. Everything runs in the browser and is stored locally, with one-click **Export / Import** so you can back up your catalog and commit it to GitHub.

![ShopKart](icon.svg)

## ✨ Features

- **Storefront** — banner, category bar, search, product grid, product detail pages
- **Cart** — slide-out drawer, quantity controls, live total, place order
- **Wishlist** — save favourites with a tap
- **Orders** — order history after checkout
- **Admin Panel** (⚙️ button, top-right) — change *everything*:
  - Store name, theme color, banner text, currency, footer
  - Add / edit / delete products (with image **URL or file upload**)
  - Add / delete categories
  - **Export** your whole catalog to a JSON file, **Import** it back
  - Reset to the demo catalog
- **Installable PWA** — "Add to Home screen" on Android for an app-like experience, works offline

## 🚀 Run locally

Just open `index.html` in a browser. (For the service worker / install feature, serve it over HTTP:)

```bash
# any one of these from the project folder:
python -m http.server 8000
# then visit http://localhost:8000
```

## 🌐 Publish free on GitHub Pages

1. Create a new GitHub repo (e.g. `shopkart`) and push these files:
   ```bash
   git init
   git add .
   git commit -m "ShopKart"
   git branch -M main
   git remote add origin https://github.com/<your-username>/shopkart.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, pick `main` / `root`, **Save**.
3. Your app is live at `https://<your-username>.github.io/shopkart/` in ~1 minute.

## 📱 Get it on Android

**Option A — Install as a PWA (instant, free):** open the GitHub Pages URL in Chrome on Android → menu → **Add to Home screen**. It launches full-screen like a native app.

**Option B — Build a real APK / Play Store bundle (free tools):** wrap the published URL with [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) or [PWABuilder](https://www.pwabuilder.com):
```bash
npm i -g @bubblewrap/cli
bubblewrap init --manifest https://<your-username>.github.io/shopkart/manifest.json
bubblewrap build   # produces an .aab/.apk you can upload to the Play Store
```
> Note: a Google Play **developer account** has a one-time $25 fee (that's Google's, not this app's). PWA install (Option A) is completely free.

## 💾 Backing up your catalog

All your changes live in the browser's `localStorage`. To keep them safe or move them to another device:
**Admin → Export** downloads `shopkart-catalog.json`. On the other device, **Admin → Import** that file.

## 📁 Project structure

```
shopkart/
├─ index.html        # app shell
├─ manifest.json     # PWA manifest
├─ sw.js             # offline service worker
├─ icon.svg          # app icon
├─ css/style.css     # all styles
└─ js/
   ├─ store.js       # state + localStorage
   ├─ data.js        # default seed catalog
   ├─ app.js         # storefront UI
   └─ admin.js       # admin panel
```

## 📄 License

MIT — do whatever you like.
