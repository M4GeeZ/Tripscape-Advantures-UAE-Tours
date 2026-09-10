TRIPSCAPE BOOKING SYSTEM — FINAL LONG-TERM SETUP
================================================

WHAT THIS VERSION FIXES
-----------------------
1. Booking submission no longer depends on SMTP being available.
2. Every valid booking is stored first:
   - Primary: MongoDB
   - Fallback: server/data/bookings.ndjson if MongoDB is temporarily unavailable
3. Company email and customer confirmation email are sent automatically when SMTP is configured.
4. If the customer checks "This phone number has WhatsApp", a WhatsApp confirmation is also attempted through Meta WhatsApp Cloud API.
5. If WhatsApp is not checked, only email confirmation is sent to the customer.
6. Company notification email is attempted for every booking.
7. Failed notifications stored in MongoDB are retried automatically by the server (default: every 10 minutes, max 5 attempts).
8. Email/WhatsApp failure does NOT erase or reject an already stored booking.
9. The booking reference, package/service, add-ons, pickup, travel date, adults, children, phone and email are stored and included in company notifications.
10. A safe health endpoint is available at: /api/bookings/health
    It reports only connected/configured states, never passwords or tokens.

REQUIRED PRODUCTION SETUP
-------------------------
A. MongoDB
   Set MONGO_URI in server/.env to your production MongoDB connection string.
   MongoDB is recommended as the primary booking record.

B. Email
   Put the real SMTP details in server/.env:
   SMTP_HOST=
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=
   SMTP_PASS=
   SMTP_FROM_NAME=Tripscape Adventures
   SMTP_FROM_EMAIL=
   BOOKING_TO_EMAIL=

   For long-term deliverability, enable SPF and DKIM on the sending domain.
   DMARC is also recommended.

C. WhatsApp
   Create/use a Meta WhatsApp Cloud API app and approved message template.
   Then set:
   WHATSAPP_ACCESS_TOKEN=
   WHATSAPP_PHONE_NUMBER_ID=
   WHATSAPP_CONFIRMATION_TEMPLATE=tripscape_booking_confirmation
   WHATSAPP_TEMPLATE_LANGUAGE=en_US

   The template parameters used by code are:
   1 = Customer name
   2 = Booking reference
   3 = Selected service/package
   4 = Travel date

DEPLOYMENT
----------
1. Copy/overwrite the files from this ZIP into the same project paths.
2. Create server/.env from server/.env.example and add REAL credentials.
3. Never commit server/.env to GitHub.
4. From server folder run: npm install
5. Restart the Node server / PM2 process.
6. Open /api/bookings/health and confirm:
   database: connected
   email: configured
   whatsapp: configured   (only if WhatsApp automation is required)
7. Submit one real test booking using an email and WhatsApp number you control.
8. Confirm:
   - company email receives complete booking details
   - customer receives acknowledgement email
   - WhatsApp arrives only when checkbox is checked

IMPORTANT
---------
No code can send real email or WhatsApp messages without valid provider credentials.
The code in this ZIP makes the booking itself reliable and prevents SMTP/WhatsApp outages from losing reservations, but real automatic notifications still require SMTP and Meta WhatsApp Cloud API credentials.
