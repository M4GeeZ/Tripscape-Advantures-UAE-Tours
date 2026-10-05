# Tripscape Admin CMS Setup

## Local

1. Create `server/.env` from `server/.env.example`.
2. Keep the admin credentials server-side only. Never put them in `client/.env` or React code.
3. Generate the password hash:

```bash
cd server
node scripts/hash-admin-password.mjs "YOUR_ADMIN_PASSWORD"
```

Copy the output into `ADMIN_PASSWORD_HASH`.

4. Set a long random value for `ADMIN_SESSION_SECRET`.
5. Set `MONGO_URI` to the MongoDB database used by the website.
6. Start the API and frontend as usual.
7. Open `/admin`.

## Hostinger

Put the real values in the server runtime environment / `server/.env` on the VPS. Do not upload that file to GitHub.

Required CMS variables:

```env
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD_HASH=scrypt$...
ADMIN_SESSION_SECRET=long-random-secret
MONGO_URI=mongodb://...
CLIENT_URL=https://tripscapetourism.com
```

The admin password is stored as an scrypt hash, not plain text. Authentication uses an HttpOnly signed session cookie. Login attempts are rate-limited and admin CRUD/upload endpoints require authentication.

## Features

- `/admin` secure login
- Dashboard statistics
- Tours & Packages CRUD
- Category and destination dropdowns
- Main image upload
- Inclusions, exclusions and FAQs
- Publish / draft and featured controls
- SEO title, meta description and canonical fields
- Blog / Article CRUD
- Rich article editor with headings, lists, links and inline image upload
- Existing public tour card UI is reused for database tours
- Existing booking form is reused on database tour detail pages
- Blog cards keep the existing visual design; article detail pages use an editorial article layout
- Existing static tours and blogs remain as fallback content if MongoDB is temporarily unavailable
