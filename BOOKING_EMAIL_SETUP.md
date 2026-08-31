# Booking Enquiry + Email / WhatsApp Confirmation Setup

## Final behaviour

- Primary form button text: **Book Enquiry Now**.
- Company booking email: **info@tripscapeadventures.com**.
- Company WhatsApp / call number: **+971 54 993 0684**.
- Every successful booking enquiry sends the full booking details to the company email.
- The customer always receives an email confirmation at the email entered in the booking form.
- A unique booking reference is generated and included in both emails.
- If **This phone number has WhatsApp** is not checked, the booking completes by email only and no WhatsApp tab is opened.
- If the checkbox is checked, the frontend opens a pre-filled WhatsApp message to Tripscape after the backend confirms the emails were sent.
- Automatic WhatsApp confirmation **to the customer's own WhatsApp number** is supported by the backend when Meta WhatsApp Cloud API credentials and an approved template are configured.
- WhatsApp API failure does not lose the booking: company + customer email confirmation remains the primary confirmation path.

## SMTP configuration

Copy `.env.example` to `.env` on the VPS and set the real mailbox SMTP settings:

```env
PORT=5000
CLIENT_URL=https://tripscapetourism.com

SMTP_HOST=YOUR_MAIL_PROVIDER_SMTP_HOST
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@tripscapeadventures.com
SMTP_PASS=YOUR_EMAIL_PASSWORD_OR_APP_PASSWORD
SMTP_FROM_NAME=Tripscape Adventures
SMTP_FROM_EMAIL=info@tripscapeadventures.com
BOOKING_TO_EMAIL=info@tripscapeadventures.com
```

The mailbox/provider must allow SMTP sending from `info@tripscapeadventures.com`.

## Optional automatic customer WhatsApp confirmation

A website cannot silently send a WhatsApp message from the company's WhatsApp number using only a `wa.me` link. For a fully automatic confirmation to the customer's WhatsApp number, configure Meta WhatsApp Cloud API.

Add these values to the server `.env`:

```env
WHATSAPP_ACCESS_TOKEN=YOUR_META_ACCESS_TOKEN
WHATSAPP_PHONE_NUMBER_ID=YOUR_META_PHONE_NUMBER_ID
WHATSAPP_CONFIRMATION_TEMPLATE=YOUR_APPROVED_TEMPLATE_NAME
WHATSAPP_TEMPLATE_LANGUAGE=en_US
WHATSAPP_GRAPH_VERSION=v23.0
```

The approved WhatsApp template used by this project should accept these body variables in this order:

1. Customer name
2. Booking reference
3. Tour / experience title
4. Travel date

Example template wording:

`Hi {{1}}, we received your Tripscape booking enquiry {{2}} for {{3}} on {{4}}. Our team will confirm availability shortly.`

If the WhatsApp API is not configured, the booking still works by email and the customer can send the pre-filled WhatsApp enquiry to **+971 54 993 0684**.

## Install / run backend

```bash
npm install --prefix server
npm run start --prefix server
```

Health test:

```bash
curl http://127.0.0.1:5000/api/health
```

## Nginx / CloudPanel

The live frontend is static, so proxy `/api` to Node:

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

Then:

```bash
nginx -t
systemctl reload nginx
```

Use PM2 or systemd to keep the Node backend running after SSH closes.
