import "./CallFloat.css";

export default function CallFloat() {
  const whatsappMessage = encodeURIComponent(
    "Hello Tripscape Adventures, I would like to get more information."
  );

  return (
    <a
      className="call-float"
      href={`https://wa.me/971549930684?text=${whatsappMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact Tripscape Adventures on WhatsApp"
      title="Contact on WhatsApp"
    >
      <svg
        className="call-float__icon"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M22 16.92v3a2 2 0 0 1-2.18 2
             19.79 19.79 0 0 1-8.63-3.07
             19.5 19.5 0 0 1-6-6
             19.79 19.79 0 0 1-3.07-8.67
             A2 2 0 0 1 4.11 2h3
             a2 2 0 0 1 2 1.72
             12.84 12.84 0 0 0 .7 2.81
             2 2 0 0 1-.45 2.11L8.09 9.91
             a16 16 0 0 0 6 6l1.27-1.27
             a2 2 0 0 1 2.11-.45
             12.84 12.84 0 0 0 2.81.7
             A2 2 0 0 1 22 16.92z"
        />
      </svg>
    </a>
  );
}