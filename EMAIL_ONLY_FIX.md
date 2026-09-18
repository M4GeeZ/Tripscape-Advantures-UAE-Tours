# Tripscape email-only booking fix

The red `Unable to send booking request right now` message is not caused by the WhatsApp checkbox.
When the checkbox is unchecked, WhatsApp is intentionally skipped.

That red message means the browser could not successfully reach `POST /api/bookings` (commonly because only the frontend is running, the VPS `/api` proxy is not active, or a Vercel preview is pointing at itself instead of the VPS API).

## What this patch changes

- Localhost keeps using the existing Vite `/api -> http://localhost:5000` proxy.
- `tripscapetourism.com` uses same-origin `/api`.
- `*.vercel.app` staging automatically sends booking API requests to `https://tripscapetourism.com`.
- Backend CORS allows Tripscape production, localhost development, and Tripscape Vercel preview origins.
- The form now shows a useful API/server error instead of the vague generic message.
- Email-only booking remains completely independent of WhatsApp.

## Email-only production requirements

The backend must be running on port 5000 (or the configured PORT), and Nginx must proxy `/api/` to it.
The real SMTP password/app-password must exist only in `server/.env` on the VPS. Do NOT put it in React, GitHub, or this ZIP.

Use:

```env
SMTP_HOST=smtp.zoho.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@tripscapetourism.com
SMTP_PASS=YOUR_REAL_ZOHO_PASSWORD_OR_APP_PASSWORD
SMTP_FROM_NAME=Tripscape Adventures
SMTP_FROM_EMAIL=info@tripscapetourism.com
BOOKING_TO_EMAIL=info@tripscapetourism.com
```

With the WhatsApp checkbox unchecked, a successful request sends:
1. customer confirmation email;
2. company booking email;
3. no WhatsApp messages.

## Local test

From the project root run:

```bash
npm run dev
```

Do not run only `npm run dev --prefix client`, because the form needs the Node/Express backend too.

Then open:

`http://localhost:5000/api/bookings/health`

or through the Vite proxy:

`http://localhost:5173/api/bookings/health`

The endpoint should return JSON and email should say `configured` after a real SMTP password is present.
