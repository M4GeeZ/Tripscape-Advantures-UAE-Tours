import {
  Facebook,
  Instagram,
  Youtube,
  ArrowUpRight,
} from "lucide-react";

import "./SideRails.css";

export default function SideRails() {
  return (
    <>
      {/* Left social rail */}
      <aside
        className="side-rail side-rail--social"
        aria-label="Social media links"
      >
        <span className="side-rail__line" aria-hidden="true" />

        <div className="side-rail__socials">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <Instagram size={19} strokeWidth={1.7} />
          </a>

          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <Facebook size={18} strokeWidth={1.7} />
          </a>

          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <Youtube size={20} strokeWidth={1.7} />
          </a>
        </div>

        <span className="side-rail__line" aria-hidden="true" />
      </aside>

      {/* Right enquiry rail */}
      <aside className="side-rail side-rail--enquire">
        <span className="side-rail__line" aria-hidden="true" />

        <a
          href="/contact"
          className="side-rail__enquire-link"
          aria-label="Enquire now"
        >
          <span>Enquire Now</span>

          <ArrowUpRight
            className="side-rail__enquire-icon"
            size={16}
            strokeWidth={1.8}
          />
        </a>

        <span className="side-rail__line" aria-hidden="true" />
      </aside>
    </>
  );
}