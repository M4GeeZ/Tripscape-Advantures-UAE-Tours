import { lazy, Suspense, useState } from "react";
import { useSmoothScroll } from "./hooks/useSmoothScroll";

import Home from "./pages/Home/Home";
import Tours from "./pages/Tours/Tours";
import TourCategory from "./pages/TourCategory/TourCategory";
import TourDetail from "./pages/TourDetail/TourDetail";
import DynamicTourDetail from "./pages/TourDetail/DynamicTourDetail";
import CampaignLanding from "./pages/CampaignLanding/CampaignLanding";
import DesertEJet from "./pages/DesertEJet/DesertEJet";
import PrivateDesertEvents from "./pages/PrivateDesertEvents/PrivateDesertEvents";
import Services from "./pages/Services/Services";
import About from "./pages/About/About";
import Blog from "./pages/Blog/Blog";
import BlogDetail from "./pages/Blog/BlogDetail";
import Contact from "./pages/Contact/Contact";
// The admin panel is only needed on its private URL, so it is loaded on demand and kept out of the public bundle.
const AdminApp = lazy(() => import('./pages/Admin/AdminApp'));
import SeoHead from './SeoHead';

import SideRails from "./components/SideRails/SideRails";
import LiveNotifications from "./components/LiveNotifications/LiveNotifications";
import { tourCategoryPages } from "./tourCategoryPages";
import { getTourDetail } from "./tourDetails";

export default function App() {
  useSmoothScroll();

  const [menuOpen, setMenuOpen] = useState(false);

  const normalizedPath =
    window.location.pathname.replace(/\/+$/, "") || "/";

  // Private CMS route. The old /admin path is intentionally NOT an admin entry point.
  const ADMIN_PANEL_PATH = '/admin-panel-tripscape-tourism-993';

  if (normalizedPath === ADMIN_PANEL_PATH) {
    return <Suspense fallback={null}><AdminApp /></Suspense>;
  }

  const pageProps = {
    menuOpen,
    setMenuOpen,
  };

  const renderPage = () => {
    const campaignRoutes = {
      "/tours/desert-safari": "desert-safari",
      "/tours/evening-desert-safari": "evening-desert-safari",
      "/tours/quad-bike": "quad-bike",
      "/tours/dune-buggy": "dune-buggy",
      "/tours/private-desert-setup": "private-desert-setup",
      "/tours/desert-safari/private-desert-safari-packages": "private-desert-safari-packages",
    };

    if (campaignRoutes[normalizedPath]) {
      return <CampaignLanding {...pageProps} slug={campaignRoutes[normalizedPath]} />;
    }

    if (normalizedPath === "/tours/desert-adventures/desert-e-jet-water-go-kart-dubai") {
      return <DesertEJet {...pageProps} />;
    }

    if (normalizedPath === "/tours/desert-safari/vip-private-desert-safari-family-package") {
      return <PrivateDesertEvents {...pageProps} />;
    }

    const blogDetailMatch = normalizedPath.match(/^\/blog\/([^/]+)$/);

    if (blogDetailMatch) {
      return <BlogDetail {...pageProps} slug={blogDetailMatch[1]} />;
    }

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
      return <DynamicTourDetail {...pageProps} categorySlug={categorySlug} tourSlug={tourSlug} />;
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
      <SeoHead />
      <SideRails />
      <LiveNotifications />

      {renderPage()}
    </>
  );
}