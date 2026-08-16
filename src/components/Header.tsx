import React, { useState } from 'react';
import {
  Menu,
  X
} from 'lucide-react';
import { Language, translations } from '../data/translations';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang];

  const navItems = [
    { id: 'bulletin', label: t.nav.bulletin },
    { id: 'curriculum', label: t.nav.curriculum },
    { id: 'gallery', label: t.nav.gallery },
    { id: 'blog', label: t.nav.blog },
    { id: 'history', label: t.nav.history },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-4 z-40 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto mb-6">
      <div className="w-full bg-[#FFFFFF]/95 backdrop-blur-md border border-[#E4DFD5] shadow-xs rounded-2xl sm:rounded-full px-5 sm:px-8 py-3 flex items-center justify-between transition-all">
        {/* Brand & Logo - Clickable to return to Home */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer text-left group bg-transparent border-0 p-0 focus:outline-none"
          id="header-brand-home-link"
          aria-label="Masagana 2nd Ward - Back to Home"
        >
          <div className="w-10 h-10 rounded-full bg-[#FAF4E8] border border-[#EADFCB] flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
            <img src="/masagana_logo.svg" alt="Masagana 2nd Ward logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base sm:text-lg tracking-tight text-[#1E232A] group-hover:text-[#554228] transition-colors">
                Masagana 2nd Ward
              </span>
            </div>
            <p className="text-[11px] text-[#717A84] hidden sm:block">
              {t.nav.brandSubtitle}
            </p>
          </div>
        </button>

        {/* Desktop Navigation & Language Switcher (Visible on Large Desktop Only) */}
        <div className="hidden lg:flex items-center gap-3">
          <nav className="flex items-center gap-1 bg-[#F5F2EC] p-1 rounded-full border border-[#E9E4DB]">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FFFFFF] text-[#1E232A] shadow-xs font-semibold'
                      : 'text-[#626C77] hover:text-[#1E232A] hover:bg-[#EFEBE3]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Language Selector Pill */}
          <div className="flex items-center bg-[#FAF4E8] border border-[#EADFCB] rounded-full p-1 shadow-2xs">
            <button
              onClick={() => setLang('tl')}
              id="lang-selector-tagalog"
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                lang === 'tl'
                  ? 'bg-[#554228] text-white shadow-xs'
                  : 'text-[#6B5738] hover:text-[#2E2211]'
              }`}
              title="Tagalog"
            >
              TL
            </button>
            <button
              onClick={() => setLang('en')}
              id="lang-selector-english"
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-[#554228] text-white shadow-xs'
                  : 'text-[#6B5738] hover:text-[#2E2211]'
              }`}
              title="English"
            >
              EN
            </button>
          </div>

        </div>

        {/* Tablet & Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            id="header-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-[#4A5562] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Tablet & Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 bg-[#FFFFFF] border border-[#E4DFD5] rounded-3xl p-4 sm:p-5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-4 py-3 rounded-2xl text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-[#FAF4E8] text-[#554228] font-semibold'
                    : 'text-[#4A5562] hover:bg-[#F7F4EE]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
