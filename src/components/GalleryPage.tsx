import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { GallerySection } from './GallerySection';
import { Language, translations } from '../data/translations';

interface GalleryPageProps {
  onBack: () => void;
  onOpenAlbum: (albumId: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenAdmin?: () => void;
  onNavigateHomeSection: (sectionId: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  onBack,
  onOpenAlbum,
  lang,
  setLang,
  onOpenAdmin,
  onNavigateHomeSection,
}) => {
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-[#EDEBE8] text-[#1E232A] flex flex-col font-sans selection:bg-[#E2D5C3] selection:text-[#1E232A]">
      <Header
        activeTab="gallery"
        setActiveTab={onNavigateHomeSection}
        lang={lang}
        setLang={setLang}
        onOpenAdmin={onOpenAdmin}
      />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <button
            onClick={onBack}
            id="gallery-page-back-button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF8F5] hover:bg-[#EAE4D8] text-[#1C2026] hover:text-[#554228] border border-[#E6E1D8] text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.nav.backHome}</span>
          </button>
        </div>

        {/* Full gallery: every album, with category filters */}
        <GallerySection lang={lang} onOpenAlbum={onOpenAlbum} />
      </main>

      <Footer onNavigate={onNavigateHomeSection} onOpenAdmin={onOpenAdmin} lang={lang} />
    </div>
  );
};
