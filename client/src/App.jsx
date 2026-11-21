import { useCallback, useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import AboutSection from './components/AboutSection.jsx';
import ProductCatalog from './components/ProductCatalog.jsx';
import AgroAdvisor from './components/AgroAdvisor.jsx';
import NewsSection from './components/NewsSection.jsx';
import RedLiderMap from './components/RedLiderMap.jsx';
import ContactSection from './components/ContactSection.jsx';
import Footer from './components/Footer.jsx';
import WhatsAppChatbot from './components/WhatsAppChatbot.jsx';
import { apiService } from './services/api.js';
import { FALLBACK_COMPANY } from './data/fallbackData.js';

const VALID_PATHS = ['/', '/catalogo', '/agro-point', '/informes', '/red-lider'];

const normalizePath = (rawPath) => {
  const cleaned = (rawPath || '/').replace(/\/+$/, '') || '/';
  return VALID_PATHS.includes(cleaned) ? cleaned : '/';
};

export default function App() {
  const [company, setCompany] = useState(FALLBACK_COMPANY);
  const [currentPath, setCurrentPath] = useState(() => normalizePath(window.location.pathname));
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [prefilledInquiry, setPrefilledInquiry] = useState(null);
  const [compareCount, setCompareCount] = useState(0);

  useEffect(() => {
    let active = true;
    apiService.getCompany().then(({ company: loadedCompany }) => {
      if (active && loadedCompany) {
        setCompany(loadedCompany);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigateTo = useCallback((rawPath, hash = null) => {
    const targetPath = normalizePath(rawPath);
    const nextUrl = hash ? `${targetPath}#${hash}` : targetPath;
    if (window.location.pathname !== targetPath || (hash && window.location.hash !== `#${hash}`)) {
      window.history.pushState({}, '', nextUrl);
    }
    setCurrentPath(targetPath);

    if (hash) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleQuickSearch = (query) => {
    setSelectedCategory('all');
    setSearchTerm(query);
    navigateTo('/catalogo');
  };

  const handleHeroSelectCrop = (cropId) => {
    setSelectedCategory(cropId);
    navigateTo('/catalogo');
  };

  const handleNavigateSection = (sectionId) => {
    if (sectionId === 'catalogo') {
      navigateTo('/catalogo');
      return;
    }
    if (sectionId === 'recomendador' || sectionId === 'agro-point') {
      navigateTo('/agro-point');
      return;
    }
    if (sectionId === 'informes') {
      navigateTo('/informes');
      return;
    }
    if (sectionId === 'red-lider') {
      navigateTo('/red-lider');
      return;
    }
    navigateTo('/', sectionId);
  };

  const handleRequestQuote = (product) => {
    const categoryNameMap = {
      maiz: 'Maíz Grano',
      silo: 'Maíz Silo',
      girasol: 'Girasol',
      trigo: 'Trigo',
      soja: 'Soja',
    };

    setPrefilledInquiry({
      cropInterest: categoryNameMap[product.category] || 'Maíz Grano',
      message: `Quisiera recibir asesoramiento técnico y disponibilidad comercial sobre ${product.name} (${product.technology}).`,
      stamp: Date.now(),
    });
    navigateTo('/', 'contacto');
  };

  const handleSelectDistributor = (dist) => {
    setPrefilledInquiry({
      cropInterest: 'Red Líder LG',
      province: `${dist.city}, ${dist.province}`,
      message: `Quisiera ponerme en contacto con el distribuidor Red Líder LG "${dist.name}" (${dist.city}) por disponibilidad de semillas.`,
      stamp: Date.now(),
    });
    navigateTo('/', 'contacto');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-brand-navy">
      <Navbar
        currentPath={currentPath}
        onNavigate={navigateTo}
        onSelectCropShortcut={setSelectedCategory}
      />

      <main className="flex-1 overflow-x-clip">
        {currentPath === '/' && (
          <>
            <Hero
              company={company}
              onQuickSearch={handleQuickSearch}
              onSelectCrop={handleHeroSelectCrop}
            />

            <AboutSection company={company} />

            <ProductCatalog
              mode="home"
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              regions={company.regions}
              onRequestQuote={handleRequestQuote}
              compareCountChange={setCompareCount}
              onOpenCatalogPage={(cropId) => {
                if (cropId) setSelectedCategory(cropId);
                navigateTo('/catalogo');
              }}
              onNavigate={navigateTo}
            />

            <NewsSection mode="home" onNavigate={navigateTo} />

            <ContactSection
              prefilledInquiry={prefilledInquiry}
              careersAreas={company.careersAreas}
            />
          </>
        )}

        {currentPath === '/catalogo' && (
          <ProductCatalog
            mode="page"
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            regions={company.regions}
            onRequestQuote={handleRequestQuote}
            compareCountChange={setCompareCount}
            onNavigate={navigateTo}
          />
        )}

        {currentPath === '/agro-point' && (
          <AgroAdvisor
            regions={company.regions}
            onSelectRecommended={handleRequestQuote}
          />
        )}

        {currentPath === '/informes' && (
          <NewsSection mode="reports" onNavigate={navigateTo} />
        )}

        {currentPath === '/red-lider' && (
          <RedLiderMap onSelectDistributor={handleSelectDistributor} />
        )}
      </main>

      <Footer
        onSelectCrop={setSelectedCategory}
        onNavigate={navigateTo}
      />

      <WhatsAppChatbot
        hasCompareBar={compareCount > 0 && currentPath === '/catalogo'}
        onSelectCrop={setSelectedCategory}
        onNavigateSection={handleNavigateSection}
      />
    </div>
  );
}
