import { useRef } from "react";
import {
  ArrowUpRight,
  Bike,
  Building2,
  Car,
  Compass,
  Crown,
  Map,
  Mountain,
  Plane,
  Ship,
  Sparkles,
  Sun,
  Ticket,
  Utensils,
  Waves,
} from "lucide-react";

import Navbar from "../../components/Navbar/Navbar";
import SupportCta from "../../components/SupportCta/SupportCta";
import Footer from "../../components/Footer/Footer";
import WhatsAppFloat from "../../components/WhatsAppFloat/WhatsAppFloat";

import { useLuxuryReveal } from "../../hooks/useLuxuryReveal";
import { images } from "../../generatedImages";

import "./Services.css";

const services = [
  {
    title: "VIP Premium Desert Safari with BBQ",
    icon: Crown,
    image: images.tourPrivate,
  },
  {
    title: "Sunrise Camel Trekking",
    icon: Sun,
    image: images.tourCamel,
  },
  {
    title: "Morning Safari with Quad Bike",
    icon: Bike,
    image: images.tourQuad,
  },
  {
    title: "Evening Desert Safari with BBQ Dinner",
    icon: Utensils,
    image: images.tourCamp,
  },
  {
    title: "Royal Desert Safari with Dinner at Desert Fortress",
    icon: Crown,
    image: images.tourGate,
  },
  {
    title: "Sunrise View Safari with Camel Ride",
    icon: Sun,
    image: images.heroCamel,
  },
  {
    title: "VIP Desert Safari with BBQ (Table Service)",
    icon: Sparkles,
    image: images.tourVip,
  },
  {
    title: "Desert Safari with Dinner at Caravanserai",
    icon: Utensils,
    image: images.tourCaravan,
  },
  {
    title: "Single and Double Quad bike",
    icon: Bike,
    image: images.adventureDouble,
  },
  {
    title: "Dune Buggy Tour",
    icon: Mountain,
    image: images.adventureBuggy,
  },
  {
    title: "Dhow Cruise Marina with Dinner",
    icon: Ship,
    image: images.heliMarina,
  },
  {
    title: "Dubai Marina Cruise with Royal Dinner",
    icon: Ship,
    image: images.cityDubai,
  },
  {
    title: "City Tours",
    icon: Building2,
    image: images.cityBurj,
  },
  {
    title: "Helicopter Sightseeing Tour",
    icon: Plane,
    image: images.heliPalm,
  },
  {
    title: "Extreme Hot Air Balloon Ride",
    icon: Compass,
    image: images.adventureDunes,
  },
  {
    title: "Luxury Yacht",
    icon: Waves,
    image: images.heliMarina,
  },
  {
    title: "Scuba Diving Experience",
    icon: Waves,
    image: images.attractionAquarium,
  },
  {
    title: "Private Airport Transfer",
    icon: Car,
    image: images.heroCity,
  },
  {
    title: "Attraction and Excursion Tickets and many more...",
    icon: Ticket,
    image: images.attractionMuseum,
  },
];

export default function Services({ menuOpen, setMenuOpen }) {
  const pageRef = useRef(null);

  useLuxuryReveal(pageRef);

  const handleCardMove = (event) => {
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();

    const pointerX = (event.clientX - bounds.left) / bounds.width;
    const pointerY = (event.clientY - bounds.top) / bounds.height;

    const rotateX = (0.5 - pointerY) * 4;
    const rotateY = (pointerX - 0.5) * 6;

    card.style.setProperty("--rotate-x", `${rotateX}deg`);
    card.style.setProperty("--rotate-y", `${rotateY}deg`);
    card.style.setProperty("--mouse-x", `${pointerX * 100}%`);
    card.style.setProperty("--mouse-y", `${pointerY * 100}%`);
  };

  const handleCardLeave = (event) => {
    const card = event.currentTarget;

    card.style.setProperty("--rotate-x", "0deg");
    card.style.setProperty("--rotate-y", "0deg");
    card.style.setProperty("--mouse-x", "50%");
    card.style.setProperty("--mouse-y", "50%");
  };

  return (
    <div ref={pageRef} className="services-page">
      <Navbar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        variant="overlay"
      />

      <main>
        <section
          className="services-hero"
          style={{
            "--services-hero-image": `url("${images.tourCamp}")`,
          }}
        >
          <div className="services-hero__image" aria-hidden="true" />
          <div className="services-hero__overlay" aria-hidden="true" />
          <div className="services-hero__texture" aria-hidden="true" />

          <div className="services-hero__container">
            <div className="services-hero__content">
              <div
                className="services-hero__eyebrow"
                data-hero-reveal
              >
                <span />
                Our services
              </div>

              <h1 className="services-hero__title">
                <span data-hero-reveal>Travel experiences</span>

                <span
                  className="services-hero__gold-title"
                  data-hero-reveal
                >
                  across the UAE.
                </span>
              </h1>

              <p
                className="services-hero__description"
                data-hero-reveal
              >
                Tailor-made travel, adventure tourism, cultural immersion,
                group tours, luxury travel and transportation services.
              </p>

              <a
                href="#services-list"
                className="services-hero__button"
                data-hero-reveal
              >
                <span>Explore services</span>
                <ArrowUpRight size={18} />
              </a>
            </div>

            <div
              className="services-hero__side-label"
              aria-hidden="true"
            >
              <span>Curated journeys</span>
              <i />
              <span>UAE</span>
            </div>
          </div>

          <div
            className="services-hero__scroll"
            aria-hidden="true"
          >
            <span>Scroll to explore</span>

            <div className="services-hero__scroll-line">
              <i />
            </div>
          </div>
        </section>

        <section
          id="services-list"
          className="services-catalogue"
        >
          <div
            className="services-catalogue__glow services-catalogue__glow--one"
            aria-hidden="true"
          />

          <div
            className="services-catalogue__glow services-catalogue__glow--two"
            aria-hidden="true"
          />

          <div className="services-container">
            <header
              className="services-catalogue__header"
              data-lux-reveal
            >
              <div>
                <p className="services-section-label">
                  Explore the UAE
                </p>

                <h2>
                  Every journey,
                  <span> beautifully considered.</span>
                </h2>
              </div>

              <p className="services-catalogue__intro">
                Tailor-made travel, adventure tourism, cultural
                immersion, group tours, luxury travel and
                transportation services.
              </p>
            </header>

            <div className="services-grid">
              {services.map((service, index) => {
                const Icon = service.icon;

                return (
                  <a
                    href="/contact"
                    key={service.title}
                    className="service-premium-card"
                    data-lux-reveal
                    data-reveal-delay={(index % 6) * 0.06}
                    onMouseMove={handleCardMove}
                    onMouseLeave={handleCardLeave}
                  >
                    <img
                      className="service-premium-card__image"
                      src={service.image}
                      alt=""
                      loading="lazy"
                      aria-hidden="true"
                    />

                    <span
                      className="service-premium-card__wash"
                      aria-hidden="true"
                    />

                    <span
                      className="service-premium-card__pointer-light"
                      aria-hidden="true"
                    />

                    <div className="service-premium-card__top">
                      <span className="service-premium-card__number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="service-premium-card__icon">
                        <Icon size={21} strokeWidth={1.7} />
                      </span>
                    </div>

                    <div className="service-premium-card__content">
                      <h3>{service.title}</h3>

                      <div className="service-premium-card__bottom">
                        <span>Discover experience</span>

                        <span className="service-premium-card__arrow">
                          <ArrowUpRight size={18} />
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section className="services-ending">
          <div
            className="services-ending__inner"
            data-lux-reveal
          >
            <div className="services-ending__icon">
              <Plane size={24} strokeWidth={1.6} />
            </div>

            <div className="services-ending__content">
              <span className="services-section-label">
                Tripscape Adventures
              </span>

              <h2>Your UAE experience starts here.</h2>
            </div>

            <a
              href="/contact"
              className="services-ending__button"
            >
              <span>Plan your journey</span>
              <ArrowUpRight size={18} />
            </a>
          </div>
        </section>

        <div
          className="services-support-wrap"
          data-lux-reveal
        >
          <SupportCta />
        </div>
      </main>

      <Footer />

      <WhatsAppFloat />
    </div>
  );
}