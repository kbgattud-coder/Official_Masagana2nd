/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BentoHero } from './components/BentoHero';
import { BulletinBoard } from './components/BulletinBoard';
import { ComeFollowMeSection } from './components/ComeFollowMeSection';
import { GallerySection } from './components/GallerySection';
import { AlbumPage } from './components/AlbumPage';
import { HistorySection } from './components/HistorySection';
import { BlogSection } from './components/BlogSection';
import { ArticlePage } from './components/ArticlePage';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminAuth } from './data/adminStore';
import { AdminUser } from './types';
import { Language } from './data/translations';

export default function App() {
  const [viewMode, setViewMode] = useState<'website' | 'admin-login' | 'admin-dashboard' | 'album-view' | 'article-view'>('website');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => AdminAuth.getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>('bulletin');
  const [lang, setLang] = useState<Language>('en'); // Default to English as requested

  // Auto-detect active section on scroll when on website view
  useEffect(() => {
    if (viewMode !== 'website') return;

    const handleScroll = () => {
      const sections = ['home', 'bulletin', 'curriculum', 'gallery', 'blog', 'history'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveTab(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [viewMode]);

  const handleNavigate = (sectionId: string) => {
    setActiveTab(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAlbum = (albumId: string) => {
    setSelectedAlbumId(albumId);
    setViewMode('album-view');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToGallery = () => {
    setSelectedAlbumId(null);
    setViewMode('website');
    setTimeout(() => {
      const element = document.getElementById('gallery');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  const handleNavigateFromAlbum = (sectionId: string) => {
    setSelectedAlbumId(null);
    setViewMode('website');
    setActiveTab(sectionId);
    setTimeout(() => {
      if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleOpenArticle = (articleId: string) => {
    setSelectedArticleId(articleId);
    setViewMode('article-view');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToBlog = () => {
    setSelectedArticleId(null);
    setViewMode('website');
    setTimeout(() => {
      const element = document.getElementById('blog');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  const handleNavigateFromArticle = (sectionId: string) => {
    setSelectedArticleId(null);
    setViewMode('website');
    setActiveTab(sectionId);
    setTimeout(() => {
      if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleOpenAdmin = () => {
    const user = AdminAuth.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setViewMode('admin-dashboard');
    } else {
      setViewMode('admin-login');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user: AdminUser) => {
    setCurrentUser(user);
    setViewMode('admin-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    AdminAuth.logout();
    setCurrentUser(null);
    setViewMode('website');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Admin Login View
  if (viewMode === 'admin-login') {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onBackToSite={() => {
          setViewMode('website');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  // 2. Admin Dashboard View
  if (viewMode === 'admin-dashboard' && currentUser) {
    return (
      <AdminDashboard
        currentUser={currentUser}
        onLogout={handleLogout}
        onViewWebsite={() => {
          setViewMode('website');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  // 3. Dedicated Album Full Page View
  if (viewMode === 'album-view' && selectedAlbumId) {
    return (
      <AlbumPage
        albumId={selectedAlbumId}
        onBack={handleBackToGallery}
        lang={lang}
        setLang={setLang}
        onOpenAdmin={handleOpenAdmin}
        onNavigateHomeSection={handleNavigateFromAlbum}
      />
    );
  }

  // 4. Dedicated Article Full Page View
  if (viewMode === 'article-view' && selectedArticleId) {
    return (
      <ArticlePage
        articleId={selectedArticleId}
        onBack={handleBackToBlog}
        lang={lang}
        setLang={setLang}
        onOpenAdmin={handleOpenAdmin}
        onNavigateHomeSection={handleNavigateFromArticle}
      />
    );
  }

  // 5. Public Ward Website Home View
  return (
    <div className="min-h-screen bg-[#EDEBE8] text-[#1E232A] flex flex-col font-sans selection:bg-[#E2D5C3] selection:text-[#1E232A]">
      {/* Top Floating Header with Simplified Navigation, Language Selector & Admin Link */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        lang={lang}
        setLang={setLang}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* Bento Hero Section (with Video Hero Player & Bento Tiles) */}
        <BentoHero
          onNavigate={handleNavigate}
          lang={lang}
        />

        {/* Streamlined Digital Bulletin Board & Upcoming Activities */}
        <BulletinBoard lang={lang} />

        {/* Dedicated Weekly Curriculum (Come, Follow Me) Section */}
        <ComeFollowMeSection lang={lang} />

        {/* Balanced Bento Community Gallery Section */}
        <GallerySection 
          lang={lang} 
          onOpenAlbum={handleOpenAlbum}
        />

        {/* Spiritual Blog & Articles Section */}
        <BlogSection lang={lang} onOpenArticle={handleOpenArticle} />

        {/* Ward History Section (1991–Present) */}
        <HistorySection lang={lang} />
      </main>

      {/* Bento Footer with Admin Portal Link */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAdmin={handleOpenAdmin}
        lang={lang}
      />
    </div>
  );
}
