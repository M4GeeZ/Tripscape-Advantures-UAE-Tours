# Dubai Packages Tour + Country Code Update

- Renamed the visible Tours category from **Packages** to **Dubai Packages Tour** while keeping the existing `/tours/packages` URL.
- Added a separate required **Country code** field to booking enquiry forms.
- Country code defaults to `+971` and accepts any international dialing code in `+NNN` format.
- Applied to tour detail booking forms, Google Ads campaign booking forms, and Desert E-Jet booking form.
- Booking email payload now stores the country code separately and sends the complete phone number.
