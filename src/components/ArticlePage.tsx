import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Layers,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { AuthorAvatar } from './BlogSection';
import { useAdminData } from '../data/adminStore';
import { Language } from '../data/translations';

interface ArticlePageProps {
  articleId: string;
  onBack: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenAdmin?: () => void;
  onNavigateHomeSection: (sectionId: string) => void;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({
  articleId,
  onBack,
  lang,
  setLang,
  onOpenAdmin,
  onNavigateHomeSection,
}) => {
  const { articles } = useAdminData();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const article = articles.find((a) => a.id === articleId);
  const galleryImages = article?.galleryImages || [];

  // Scroll to top when opening the article page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [articleId]);

  // Keyboard navigation for the attached-photos lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null || galleryImages.length === 0) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex((lightboxIndex + 1) % galleryImages.length);
      if (e.key === 'ArrowLeft') setLightboxIndex((lightboxIndex - 1 + galleryImages.length) % galleryImages.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, galleryImages.length]);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#EDEBE8] text-[#1E232A] flex flex-col font-sans">
        <Header
          activeTab="blog"
          setActiveTab={onNavigateHomeSection}
          lang={lang}
          setLang={setLang}
          onOpenAdmin={onOpenAdmin}
        />
        <main className="flex-grow max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-3xl p-12 border border-[#E6E1D8] shadow-xs">
            <h2 className="text-2xl font-serif font-semibold text-[#1C2026] mb-3">Article Not Found</h2>
            <p className="text-sm text-[#616B77] mb-6">The requested article could not be found or has been removed.</p>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#554228] text-white text-xs font-semibold hover:bg-[#3D2F1D] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Articles</span>
            </button>
          </div>
        </main>
        <Footer onNavigate={onNavigateHomeSection} onOpenAdmin={onOpenAdmin} lang={lang} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDEBE8] text-[#1E232A] flex flex-col font-sans selection:bg-[#E2D5C3] selection:text-[#1E232A]">
      {/* Top Floating Header */}
      <Header
        activeTab="blog"
        setActiveTab={onNavigateHomeSection}
        lang={lang}
        setLang={setLang}
        onOpenAdmin={onOpenAdmin}
      />

      {/* Main Dedicated Article Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mb-20">

        {/* Article Header Banner */}
        <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#E6E1D8] shadow-xs mb-8">
          {/* Top Bar with Back Button & Meta Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#F0EBE1]">
            <button
              onClick={onBack}
              id="article-page-back-button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF8F5] hover:bg-[#EAE4D8] text-[#1C2026] hover:text-[#554228] border border-[#E6E1D8] text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Articles</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FAF4E8] border border-[#EADFCB] text-[#554228]">
                {article.category}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF8F5] border border-[#E6E1D8] text-[#616B77]">
                <Calendar className="w-3.5 h-3.5 text-[#554228]" />
                <span>{article.date}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF8F5] border border-[#E6E1D8] text-[#616B77]">
                <Clock className="w-3.5 h-3.5 text-[#554228]" />
                <span>{article.readingTime}</span>
              </span>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="mt-5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold text-[#1C2026] leading-tight">
              {article.title}
            </h1>
            <p className="text-sm sm:text-base text-[#616B77] mt-3 leading-relaxed">
              {article.subtitle}
            </p>
          </div>

          {/* Author Bar */}
          <div className="flex items-center gap-3 mt-6 pt-5 border-t border-[#F0EBE1]">
            <AuthorAvatar
              name={article.author.name}
              avatarUrl={article.author.avatarUrl}
              size="lg"
            />
            <div>
              <h4 className="text-sm font-bold text-[#1C2026]">{article.author.name}</h4>
              <p className="text-xs text-[#7A8694]">{article.author.role}</p>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        {article.imageUrl && (
          <div className="rounded-3xl overflow-hidden border border-[#E6E1D8] shadow-xs mb-8 max-h-[480px]">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Body */}
        <article className="bg-[#FFFFFF] p-6 sm:p-10 rounded-3xl border border-[#E6E1D8] shadow-xs">
          {/* Scripture Anchor */}
          {article.scriptureReference && (
            <div className="p-3.5 rounded-xl bg-[#FAF4E8] border border-[#EADFCB] text-xs font-semibold text-[#554228] mb-8 inline-block">
              📖 Scripture Study Anchor: {article.scriptureReference}
            </div>
          )}

          {/* Content Rendered with Rich HTML or Paragraph Fallback */}
          {article.richHtml ? (
            <div
              className="space-y-4 text-sm sm:text-base text-[#2C3540] leading-relaxed font-serif"
              dangerouslySetInnerHTML={{ __html: article.richHtml }}
            />
          ) : (
            <div className="space-y-4 text-sm sm:text-base text-[#2C3540] leading-relaxed font-sans">
              {article.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          )}

          {/* Attached Photo Gallery */}
          {galleryImages.length > 0 && (
            <div className="mt-10 pt-8 border-t border-[#ECE7DE]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#554228] mb-4 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Attached Photos ({galleryImages.length})</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className="rounded-2xl overflow-hidden border border-[#ECE7DE] aspect-4/3 bg-black cursor-pointer group p-0"
                  >
                    <img
                      src={img}
                      alt={`Attached photo ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      {/* Attached Photo Lightbox */}
      {lightboxIndex !== null && galleryImages[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            aria-label="Close photo"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {galleryImages.length > 1 && (
            <button
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((lightboxIndex - 1 + galleryImages.length) % galleryImages.length);
              }}
              className="absolute left-4 sm:left-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <img
            src={galleryImages[lightboxIndex]}
            alt={`Attached photo ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
          />

          {galleryImages.length > 1 && (
            <button
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((lightboxIndex + 1) % galleryImages.length);
              }}
              className="absolute right-4 sm:right-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-xs font-semibold">
            {lightboxIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}

      {/* Bento Footer */}
      <Footer onNavigate={onNavigateHomeSection} onOpenAdmin={onOpenAdmin} lang={lang} />
    </div>
  );
};
