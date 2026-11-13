// Small brand marks for the review source tabs (drawn as inline SVG, no extra requests).

export function GoogleLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

// Simplified Tripadvisor owl. To use the official artwork, replace this SVG.
export function TripadvisorLogo({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <circle cx="24" cy="24" r="24" fill="#00AA6C" />
      <circle cx="15.5" cy="26" r="8.5" fill="#fff" />
      <circle cx="32.5" cy="26" r="8.5" fill="#fff" />
      <circle cx="15.5" cy="26" r="4.6" fill="#101b2b" />
      <circle cx="32.5" cy="26" r="4.6" fill="#101b2b" />
      <path d="M8.2 18.6c4.6-4.6 27.1-4.6 31.6 0" fill="none" stroke="#101b2b" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M21.4 27.4h5.2l-2.6 3.6z" fill="#101b2b" />
    </svg>
  )
}
