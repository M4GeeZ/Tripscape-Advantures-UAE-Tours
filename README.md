# Tripscape Premium MERN

Premium responsive travel website built with React, Vite, Express, GSAP and Lenis.

## Run

```bash
npm install
npm run install:all
npm run dev
```

Frontend: `http://localhost:5173`  
API: `http://localhost:5000`

## New image files

Place the supplied `imgi_*` image files inside:

```text
client/public/images/
```

Do not worry about JPG, PNG or WEBP extensions. Before development/build, the project scans that directory and maps the image filenames automatically.

```bash
npm run prepare:images
```

This command also runs automatically as part of `npm run dev` and `npm run build`.
See `IMAGE_MAPPING.txt` for the exact section sequence.

## Component-based CSS architecture

The frontend now uses one folder per component, with that component's JSX and CSS kept together. See `COMPONENT_STRUCTURE.md`.
