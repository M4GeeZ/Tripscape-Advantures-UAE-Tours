import { memo, useEffect, useRef } from "react";
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
import CallFloat from '../../components/CallFloat/CallFloat'
import ExperienceCardActions from '../../components/ExperienceCardActions/ExperienceCardActions'
import { useLuxuryReveal } from "../../hooks/useLuxuryReveal";
import { tourCatalog } from "../../data";
import { getTourDetailHref } from "../../tourDetails";
import { getCardPoints } from "../../utils/cardContent";

import "./Services.css";

const featuredServices = [
  {
    title: "VIP Premium Desert Safari with BBQ",
    category: "Desert Safari",
    icon: Crown,
    image: "/images/services/01-vip-premium-safari.webp",
  },
  {
    title: "Sunrise Camel Trekking",
    category: "Desert Safari",
    icon: Sun,
    image: "/images/services/02-sunrise-camel-trekking.webp",
  },
  {
    title: "Morning Safari with Quad Bike",
    category: "Desert Safari",
    icon: Bike,
    image: "/images/services/03-morning-quad-bike.webp",
  },
  {
    title: "Evening Desert Safari with BBQ Dinner",
    category: "Desert Safari",
    icon: Utensils,
    image: "/images/services/04-evening-safari-bbq.webp",
  },
  {
    title: "Royal Desert Safari with Dinner at Desert Fortress",
    category: "Desert Safari",
    icon: Crown,
    image: "/images/services/05-royal-desert-fortress.webp",
  },
  {
    title: "Sunrise View Safari with Camel Ride",
    category: "Desert Safari",
    icon: Sun,
    image: "/images/services/06-sunrise-camel-ride.webp",
  },
  {
    title: "VIP Desert Safari with BBQ (Table Service)",
    category: "Desert Safari",
    icon: Sparkles,
    image: "/images/services/07-vip-table-service.webp",
  },
  {
    title: "Desert Safari with Dinner at Caravanserai",
    category: "Desert Safari",
    icon: Utensils,
    image: "/images/services/08-caravanserai-dinner.webp",
  },
  {
    title: "Single and Double Quad bike",
    category: "Desert Adventures",
    icon: Bike,
    image: "/images/services/09-single-double-quad.webp",
  },
  {
    title: "Dune Buggy Tour",
    category: "Desert Adventures",
    icon: Mountain,
    image: "/images/services/10-dune-buggy.webp",
  },
  {
    title: "Dhow Cruise Marina with Dinner",
    category: "Cruises",
    icon: Ship,
    image: "/images/services/11-dhow-cruise.webp",
  },
  {
    title: "Dubai Marina Cruise with Royal Dinner",
    category: "Cruises",
    icon: Ship,
    image: "/images/services/12-marina-royal-cruise.webp",
  },
  {
    title: "City Tours",
    category: "City Tours",
    icon: Building2,
    image: "/images/services/13-city-tours.webp",
  },
  {
    title: "Helicopter Sightseeing Tour",
    category: "Aerial Experiences",
    icon: Plane,
    image: "/images/services/14-helicopter-sightseeing.webp",
  },
  {
    title: "Extreme Hot Air Balloon Ride",
    category: "Aerial Experiences",
    icon: Compass,
    image: "/images/services/15-hot-air-balloon-landscape.webp",
  },
  {
    title: "Luxury Yacht",
    category: "Water Activities",
    icon: Waves,
    image: "/images/services/16-luxury-yacht.webp",
  },
  {
    title: "Scuba Diving Experience",
    category: "Water Activities",
    icon: Waves,
    image: "/images/services/17-scuba-diving.webp",
  },
  {
    title: "Private Airport Transfer",
    category: "Packages",
    icon: Car,
    image: "/images/services/18-airport-transfer.webp",
  },
  {
    title: "Attraction and Excursion Tickets and many more...",
    category: "Attractions",
    icon: Ticket,
    image: "/images/services/19-attraction-tickets.webp",
  },
];

const extraServiceIds = [
  1, 3, 4, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
  21, 22, 23, 24, 26, 27, 28, 29, 30, 31, 32, 33, 34,
  35, 36, 37, 41, 42,
];

const getServiceIcon = ({ category = "", title = "" }) => {
  const value = `${category} ${title}`.toLowerCase();

  if (value.includes("quad") || value.includes("bike")) return Bike;
  if (value.includes("buggy")) return Mountain;
  if (value.includes("camel") || value.includes("sunrise")) return Sun;
  if (value.includes("dinner") || value.includes("bbq") || value.includes("bedouin")) return Utensils;
  if (value.includes("city tour") || value.includes("emirates tour")) return Map;
  if (value.includes("burj") || value.includes("frame") || value.includes("museum")) return Building2;
  if (value.includes("aquarium") || value.includes("water") || value.includes("dolphin")) return Waves;
  if (value.includes("ferrari") || value.includes("warner") || value.includes("img") || value.includes("aya") || value.includes("garden") || value.includes("village")) return Ticket;
  if (value.includes("vip") || value.includes("premium") || value.includes("royal")) return Crown;

  return Compass;
};

const extraServices = tourCatalog
  .filter((tour) => extraServiceIds.includes(tour.id))
  .map((tour) => ({
    title: tour.title,
    category: tour.category,
    icon: getServiceIcon(tour),
    image: tour.image,
  }));

const services = [...featuredServices, ...extraServices];

const ServiceCard = memo(function ServiceCard({ service, index }) {
  const Icon = service.icon;
  const category = service.category || "Packages";
  const detailHref = getTourDetailHref(category, service.title);
  const points = getCardPoints(category, service.title, '', 5);

  return (
    <div
      className="service-premium-card-reveal"
      data-service-card-reveal
      style={{ "--reveal-delay": `${(index % 6) * 60}ms` }}
    >
      <article className="service-premium-card">
        <a href={detailHref} className="service-premium-card__image-link" aria-label={`View ${service.title}`}>
          <img
            className="service-premium-card__image"
            src={service.image}
            alt={service.title}
            loading="lazy"
            decoding="async"
            fetchPriority={index < 3 ? "auto" : "low"}
            draggable="false"
          />
        </a>

        <span className="service-premium-card__wash" aria-hidden="true" />
        <span className="service-premium-card__pointer-light" aria-hidden="true" />

        <div className="service-premium-card__top">
          <span className="service-premium-card__number">{String(index + 1).padStart(2, "0")}</span>
          <span className="service-premium-card__icon"><Icon size={21} strokeWidth={1.7} /></span>
        </div>

        <div className="service-premium-card__content">
          <h3><a href={detailHref}>{service.title}</a></h3>
          <ul className="experience-card-points experience-card-points--light">
            {points.map((point) => <li key={point}>{point}</li>)}
          </ul>
          <ExperienceCardActions title={service.title} detailHref={detailHref} />
        </div>
      </article>
    </div>
  );
});

export default function Services({ menuOpen, setMenuOpen }) {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const cardsGridRef = useRef(null);

  useLuxuryReveal(pageRef);

  useEffect(() => {
    const grid = cardsGridRef.current;
    if (!grid) return undefined;

    const cards = Array.from(
      grid.querySelectorAll("[data-service-card-reveal]")
    );

    if (!cards.length) return undefined;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      cards.forEach((card) => card.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const triggerLine =
            entry.rootBounds?.bottom ?? window.innerHeight * 0.88;

          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            return;
          }

          // Keep cards visible after scrolling past them. Only reset when
          // scrolling back above the same 88% reveal line used previously.
          if (entry.boundingClientRect.top >= triggerLine) {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.01,
      }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        hero.classList.toggle("services-hero--paused", !entry.isIntersecting);
      },
      { rootMargin: "160px 0px", threshold: 0 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={pageRef} className="services-page">
      <Navbar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        variant="overlay"
      />

      <main>
        <section
          ref={heroRef}
          className="services-hero"
          style={{
            "--services-hero-image": 'url("/images/services/services-hero-dubai-camels.webp")',
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

            <div ref={cardsGridRef} className="services-grid">
              {services.map((service, index) => (
                <ServiceCard
                  key={`${service.title}-${index}`}
                  service={service}
                  index={index}
                />
              ))}
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
      <CallFloat />
      <WhatsAppFloat />
    </div>
  );
}