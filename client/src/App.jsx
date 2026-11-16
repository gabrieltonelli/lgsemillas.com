import { useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import ProductCatalog from './components/ProductCatalog.jsx';
import AgroAdvisor from './components/AgroAdvisor.jsx';
import AboutSection from './components/AboutSection.jsx';
import RedLiderMap from './components/RedLiderMap.jsx';
import NewsSection from './components/NewsSection.jsx';
import ContactSection from './components/ContactSection.jsx';
import Footer from './components/Footer.jsx';
import { apiService } from './services/api.js';
import { FALLBACK_COMPANY } from './data/fallbackData.js';

export default function App() {
  const [company, setCompany] = useState(FALLBACK_COMPANY);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [prefilledInquiry, setPrefilledInquiry] = useState(null);

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

  const handleQuickSearch = (query) => {
    setSelectedCategory('all');
    setSearchTerm(query);
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
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectDistributor = (dist) => {
    setPrefilledInquiry({
      cropInterest: 'Red Líder LG',
      province: `${dist.city}, ${dist.province}`,
      message: `Quisiera ponerme en contacto con el distribuidor Red Líder LG "${dist.name}" (${dist.city}) por disponibilidad de semillas.`,
      stamp: Date.now(),
    });
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-slate-900 overflow-x-hidden">
      <Navbar onSelectCropShortcut={setSelectedCategory} />

      <main className="flex-1">
        <Hero
          company={company}
          onQuickSearch={handleQuickSearch}
          onSelectCrop={setSelectedCategory}
        />

        <ProductCatalog
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          regions={company.regions}
          onRequestQuote={handleRequestQuote}
        />

        <AgroAdvisor
          regions={company.regions}
          onSelectRecommended={handleRequestQuote}
        />

        <AboutSection company={company} />

        <RedLiderMap onSelectDistributor={handleSelectDistributor} />

        <NewsSection />

        <ContactSection
          prefilledInquiry={prefilledInquiry}
          careersAreas={company.careersAreas}
        />
      </main>

      <Footer onSelectCrop={setSelectedCategory} />
    </div>
  );
}

