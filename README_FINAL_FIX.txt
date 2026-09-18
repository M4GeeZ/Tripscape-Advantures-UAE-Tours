TRIPSCAPE BOOKING - FINAL STABLE SELECTED FILES

WHY THE ECONNREFUSED ERROR WAS HAPPENING
The old root "npm run dev" started Vite and the API at the same time. Vite could become ready first while the API was still waiting for MongoDB, so /api/bookings sometimes hit port 5000 before anything was listening.

WHAT THIS FIX DOES
1. The Express API listens on port 5000 immediately. MongoDB connects in the background.
2. If local MongoDB is off, bookings use file fallback storage instead of failing.
3. Nodemon watches only source JS files and ignores generated booking data, preventing mid-request restarts.
4. Root npm run dev now starts the backend first, waits for /api/bookings/health, then starts Vite. This removes the startup race.
5. Email-only and WhatsApp-checked logic remains intact.
6. Do NOT replace/delete your real server/.env. Only compare it with server/.env.example.

INSTALL / REPLACE
Copy these files into the SAME relative paths in your project.
Then from project root run:
  npm install --prefix server
  npm run dev

EXPECTED STARTUP ORDER
  [Tripscape] Starting booking API first...
  Tripscape API running on http://localhost:5000
  [Tripscape] Booking API is healthy. Starting Vite frontend...
  Local: http://localhost:5173/

TEST
Open:
  http://localhost:5173/api/bookings/health

IMPORTANT ABOUT SMTP
A 535 Authentication Failed response is not a code/startup error. It means Zoho rejected the SMTP credentials/server for that mailbox. The booking is still safely stored, but email cannot be sent until the real mailbox settings authenticate.
This project's Zoho mailbox has been verified with smtp.zoho.com:465 SSL. Use info@tripscapetourism.com as SMTP_USER/FROM/BOOKING_TO and an app-specific password if MFA is enabled.
