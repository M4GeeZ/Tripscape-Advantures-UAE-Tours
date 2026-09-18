# Tripscape Booking Form - Live Email + WhatsApp Setup

## Final booking flow

The booking form design remains unchanged. The submit flow is now handled by the backend and is the same for every card/page that uses `BookingEnquiryForm`.

### When "This phone number has WhatsApp" is NOT checked

1. Booking is saved with a unique booking reference.
2. Customer receives confirmation by email.
3. Tripscape receives the complete booking details by company email.
4. No WhatsApp message is sent to the customer or company.

### When "This phone number has WhatsApp" IS checked

1. Booking is saved with a unique booking reference.
2. Customer receives confirmation by email.
3. Customer receives an automatic WhatsApp confirmation through the official Meta WhatsApp Cloud API.
4. Tripscape receives the complete booking details by company email.
5. Tripscape also receives an automatic WhatsApp booking alert on `BOOKING_WHATSAPP_TO`.

The frontend does not open a manual WhatsApp tab. Messages are sent server-side.

## Reliability included

- MongoDB stores the booking when available.
- If MongoDB is temporarily unavailable, the booking is also written to a local NDJSON fallback file instead of being lost.
- Failed notification deliveries are retried by the background worker.
- Fallback-file bookings also have a persistent notification queue, so a server restart does not erase pending notification jobs.
- A browser submission ID prevents duplicate MongoDB bookings when the user retries after a network timeout.
- SMTP and WhatsApp failures do not discard the booking request.

## 1. SMTP email configuration

Put the real values in `server/.env` on the VPS:

```env
SMTP_HOST=smtp.zoho.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@tripscapetourism.com
SMTP_PASS=YOUR_EMAIL_PASSWORD_OR_APP_PASSWORD
SMTP_FROM_NAME=Tripscape Adventures
SMTP_FROM_EMAIL=info@tripscapetourism.com
BOOKING_TO_EMAIL=info@tripscapetourism.com
```

If the final official Tripscape mailbox is different, change `SMTP_USER`, `SMTP_FROM_EMAIL`, and/or `BOOKING_TO_EMAIL` to the real mailbox. The mail provider must allow SMTP sending.

## 2. Meta WhatsApp Cloud API configuration

Automatic WhatsApp confirmations cannot be done reliably with only a `wa.me` link. The backend uses the official Meta WhatsApp Cloud API.

Add:

```env
WHATSAPP_ACCESS_TOKEN=YOUR_PERMANENT_META_SYSTEM_USER_TOKEN
WHATSAPP_PHONE_NUMBER_ID=YOUR_META_PHONE_NUMBER_ID
WHATSAPP_GRAPH_VERSION=v23.0
WHATSAPP_TEMPLATE_LANGUAGE=en_US
WHATSAPP_CUSTOMER_TEMPLATE=tripscape_booking_received
WHATSAPP_COMPANY_TEMPLATE=tripscape_new_booking_alert
BOOKING_WHATSAPP_TO=971549930684
```

Use a long-lived/permanent System User access token for production instead of a temporary test token.

`BOOKING_WHATSAPP_TO` is the staff/admin WhatsApp number that should receive booking alerts. If the Cloud API sender number and the recipient number are the same and your Meta setup does not permit self-delivery, use another Tripscape staff/admin WhatsApp number for this value.

## 3. Create two approved WhatsApp templates

### Customer template: `tripscape_booking_received`

Body variables in this exact order:

1. Customer name
2. Booking reference
3. Package/service
4. Travel date

Suggested body:

`Hi {{1}}, we received your Tripscape booking enquiry {{2}} for {{3}} on {{4}}. Our team will confirm availability shortly.`

### Company template: `tripscape_new_booking_alert`

Body variables in this exact order:

1. Booking reference
2. Customer name
3. Package/service
4. Travel date
5. Customer phone
6. Customer email

Suggested body:

`New Tripscape booking {{1}} from {{2}} for {{3}} on {{4}}. Phone: {{5}}. Email: {{6}}.`

Both template names in Meta must exactly match the `.env` values.

## 4. Production VPS settings

Recommended `.env` base:

```env
PORT=5000
CLIENT_URL=https://tripscapetourism.com
MONGO_URI=YOUR_PRODUCTION_MONGODB_URI

BOOKING_FALLBACK_FILE=data/bookings.ndjson
BOOKING_FALLBACK_QUEUE_DIR=data/booking-notification-queue
BOOKING_RETRY_INTERVAL_MS=600000
BOOKING_RETRY_AFTER_MS=600000
BOOKING_NOTIFICATION_MAX_ATTEMPTS=5
```

Keep the Node server running with PM2 or systemd. Proxy `/api/` from Nginx to the backend, for example:

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:5000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## 5. Health check

After deployment open/call:

```text
https://tripscapetourism.com/api/bookings/health
```

For a fully live setup it should report the database/email/customer WhatsApp/company WhatsApp channels as configured/connected.

## Important

The code is production-ready, but real automatic email/WhatsApp delivery only becomes live after valid SMTP credentials, Meta Cloud API credentials, and approved WhatsApp templates are configured on the server. Never commit the real `.env` file, SMTP password, or WhatsApp access token to GitHub.
