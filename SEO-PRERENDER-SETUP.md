# Tripscape SEO prerender patch

This patch makes the Vite/React site generate real HTML for the public routes at build time.
It also hydrates that generated HTML in the browser instead of replacing it.

## Apply

Copy these files into the matching paths in your latest project:

- `client/package.json`
- `client/src/main.jsx`
- `client/src/App.jsx`
- `client/scripts/prerender.mjs`

Do not replace your other source files.

## Build

From the project root:

```powershell
npm run build
```

The build now:
1. builds the React app with Vite;
2. starts a local Vite preview server;
3. uses installed Chrome/Chromium in headless mode to render the routes;
4. writes the rendered HTML into `client/dist/<route>/index.html`;
5. writes `client/dist/sitemap.xml` and `client/dist/robots.txt`.

The script looks for Chrome automatically. If Chrome is installed in a non-standard location, set `CHROME_PATH` to the executable before running the build.

## Test the generated source

After the build:

```powershell
npm run preview --prefix client
```

Then open `http://localhost:4173/` and use `view-source:`. The page source should contain the actual page headings, text, links and content inside `#root`, not only an empty `<div id="root"></div>`.

## Deploy

Upload the newly generated `client/dist` contents to the VPS frontend folder, replacing the old frontend build. No backend/PM2 change is required for this SEO change.
