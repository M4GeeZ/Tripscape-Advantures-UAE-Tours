import { useState } from "react";
import { useSmoothScroll } from "./hooks/useSmoothScroll";

import Home from "./pages/Home/Home";
import Tours from "./pages/Tours/Tours";
import TourCategory from "./pages/TourCategory/TourCategory";
import TourDetail from "./pages/TourDetail/TourDetail";
import Services from "./pages/Services/Services";
import About from "./pages/About/About";
import Blog from "./pages/Blog/Blog";
import Contact from "./pages/Contact/Contact";

import SideRails from "./components/SideRails/SideRails";
import { tourCategoryPages } from "./tourCategoryPages";
import { getTourDetail } from "./tourDetails";

export default function App() {
  useSmoothScroll();

  const [menuOpen, setMenuOpen] = useState(false);

  const normalizedPath =
    window.location.pathname.replace(/\/+$/, "") || "/";

  const pageProps = {
    menuOpen,
    setMenuOpen,
  };

  const renderPage = () => {
    const detailMatch = normalizedPath.match(/^\/tours\/([^/]+)\/([^/]+)$/);

    if (detailMatch) {
      const [, categorySlug, tourSlug] = detailMatch;
      if (getTourDetail(categorySlug, tourSlug)) {
        return (
          <TourDetail
            {...pageProps}
            categorySlug={categorySlug}
            tourSlug={tourSlug}
          />
        );
      }
    }

    if (normalizedPath.startsWith("/tours/")) {
      const slug = normalizedPath.slice("/tours/".length);
      if (tourCategoryPages[slug]) {
        return <TourCategory {...pageProps} slug={slug} />;
      }
    }

    switch (normalizedPath) {
      case "/tours":
        return <Tours {...pageProps} />;

      case "/services":
        return <Services {...pageProps} />;

      case "/about":
        return <About {...pageProps} />;

      case "/blog":
        return <Blog {...pageProps} />;

      case "/contact":
        return <Contact {...pageProps} />;

      default:
        return <Home {...pageProps} />;
    }
  };

  return (
    <>
      <SideRails />

      {renderPage()}
    </>
  );
}