import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Megaphone, 
  Image as ImageIcon, 
  BookOpen, 
  Globe, 
  LogOut, 
  Sparkles, 
  Layers, 
  Clock, 
  CheckCircle2, 
  RefreshCw,
  Folder
} from 'lucide-react';
import { AdminUser } from '../../types';
import { useAdminData } from '../../data/adminStore';
import { AnnouncementsManager } from './AnnouncementsManager';
import { GalleryManager } from './GalleryManager';
import { ArticlesManager } from './ArticlesManager';

interface AdminDashboardProps {
  currentUser: AdminUser;
  onLogout: () => void;
  onViewWebsite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onLogout,
  onViewWebsite,
}) => {
  const [activeTab, setActiveTab] = useState<'announcements' | 'gallery' | 'articles'>('announcements');
  const [resetToast, setResetToast] = useState(false);

  const {
    announcements,
    galleryItems,
    albums,
    articles,
    saveAnnouncement,
    deleteAnnouncement,
    togglePinAnnouncement,
    saveAlbum,
    deleteAlbum,
    saveGalleryItem,
    saveMultipleGalleryItems,
    deleteGalleryItem,
    saveArticle,
    deleteArticle,
    toggleFeaturedArticle,
    cleanLocalQuotaCache,
    resetToDefaults,
  } = useAdminData();

  const handleResetData = () => {
    if (window.confirm('Reset all ward announcements, gallery items, and articles to original sample data?')) {
      resetToDefaults();
      setResetToast(true);
      setTimeout(() => setResetToast(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#EDEBE8] text-[#1E232A] selection:bg-[#E2D5C3] selection:text-[#1E232A] pb-20">
      
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E6E1D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Brand & Role */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF4E8] border border-[#EADFCB] text-[#554228] flex items-center justify-center font-serif font-bold text-base shadow-xs">
              M2
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-[#1E232A] text-base sm:text-lg tracking-tight">
                  Masagana 2nd Ward
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FAF4E8] text-[#554228] border border-[#EADFCB] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#8C6D40]" />
                  <span>{currentUser.role === 'superadmin' ? 'Super Admin' : 'Ward Admin'}</span>
                </span>
              </div>
              <p className="text-[11px] text-[#717E8C]">
                Logged in as <strong className="text-[#1E232A] font-semibold">{currentUser.name}</strong> ({currentUser.email})
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onViewWebsite}
              id="admin-dashboard-view-website"
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-white hover:bg-[#F3EFEA] border border-[#D9D2C4] text-[#1E232A] text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="Open the Public Ward Website"
            >
              <Globe className="w-3.5 h-3.5 text-[#8C6D40]" />
              <span className="hidden sm:inline">View Public Website</span>
            </button>

            <button
              onClick={onLogout}
              id="admin-dashboard-signout"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold transition-all cursor-pointer"
              title="Sign Out of Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Reset Notification Toast */}
        {resetToast && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Ward data has been reset to defaults successfully.</span>
          </div>
        )}

        {/* Dashboard Quick Stats Bento */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div 
            onClick={() => setActiveTab('announcements')}
            className={`p-5 rounded-3xl border transition-all cursor-pointer ${
              activeTab === 'announcements'
                ? 'bg-[#FAF8F5] border-[#554228] shadow-md ring-1 ring-[#554228]/20'
                : 'bg-[#FAF8F5] border-[#E6E1D8] hover:border-[#D9D2C4] hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#5C6672]">Announcements</span>
              <div className="w-8 h-8 rounded-xl bg-[#FAF4E8] text-[#554228] flex items-center justify-center">
                <Megaphone className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold font-serif text-[#1E232A]">{announcements.length}</div>
            <p className="text-[11px] text-[#717E8C] mt-1">
              {announcements.filter(a => a.isPinned).length} pinned notices
            </p>
          </div>

          <div 
            onClick={() => setActiveTab('gallery')}
            className={`p-5 rounded-3xl border transition-all cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-[#FAF8F5] border-[#554228] shadow-md ring-1 ring-[#554228]/20'
                : 'bg-[#FAF8F5] border-[#E6E1D8] hover:border-[#D9D2C4] hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#5C6672]">Photo Gallery</span>
              <div className="w-8 h-8 rounded-xl bg-[#FAF4E8] text-[#554228] flex items-center justify-center">
                <ImageIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold font-serif text-[#1E232A]">{galleryItems.length}</div>
            <p className="text-[11px] text-[#717E8C] mt-1">
              Across all categories
            </p>
          </div>

          <div 
            onClick={() => setActiveTab('gallery')}
            className={`p-5 rounded-3xl border transition-all cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-[#FAF8F5] border-[#554228] shadow-md ring-1 ring-[#554228]/20'
                : 'bg-[#FAF8F5] border-[#E6E1D8] hover:border-[#D9D2C4] hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#5C6672]">Photo Albums</span>
              <div className="w-8 h-8 rounded-xl bg-[#FAF4E8] text-[#554228] flex items-center justify-center">
                <Folder className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold font-serif text-[#1E232A]">{albums.length}</div>
            <p className="text-[11px] text-[#717E8C] mt-1">
              Curated collections
            </p>
          </div>

          <div 
            onClick={() => setActiveTab('articles')}
            className={`p-5 rounded-3xl border transition-all cursor-pointer ${
              activeTab === 'articles'
                ? 'bg-[#FAF8F5] border-[#554228] shadow-md ring-1 ring-[#554228]/20'
                : 'bg-[#FAF8F5] border-[#E6E1D8] hover:border-[#D9D2C4] hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#5C6672]">Talks & Articles</span>
              <div className="w-8 h-8 rounded-xl bg-[#FAF4E8] text-[#554228] flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold font-serif text-[#1E232A]">{articles.length}</div>
            <p className="text-[11px] text-[#717E8C] mt-1">
              {articles.filter(a => a.featured).length} featured articles
            </p>
          </div>
        </div>

        {/* Section Tabs Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D9D2C4] pb-4 mb-8">
          <div className="flex items-center gap-2 bg-[#EFEAE1] p-1.5 rounded-2xl border border-[#D9D2C4]">
            <button
              onClick={() => setActiveTab('announcements')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'announcements'
                  ? 'bg-white text-[#1E232A] shadow-xs'
                  : 'text-[#6C7785] hover:text-[#1E232A]'
              }`}
            >
              <Megaphone className="w-4 h-4 text-[#8C6D40]" />
              <span>Announcements</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-white text-[#1E232A] shadow-xs'
                  : 'text-[#6C7785] hover:text-[#1E232A]'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-[#8C6D40]" />
              <span>Photo Gallery & Albums</span>
            </button>

            <button
              onClick={() => setActiveTab('articles')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'articles'
                  ? 'bg-white text-[#1E232A] shadow-xs'
                  : 'text-[#6C7785] hover:text-[#1E232A]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#8C6D40]" />
              <span>Talks & Articles (Full Editor)</span>
            </button>
          </div>

          {/* Quick Helper / Reset Data Option */}
          <button
            onClick={handleResetData}
            className="inline-flex items-center gap-1.5 text-xs text-[#717E8C] hover:text-[#554228] transition-colors cursor-pointer"
            title="Reset data to initial sample values"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {/* Tab Subcomponents */}
        {activeTab === 'announcements' && (
          <AnnouncementsManager
            announcements={announcements}
            onSave={saveAnnouncement}
            onDelete={deleteAnnouncement}
            onTogglePin={togglePinAnnouncement}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryManager
            galleryItems={galleryItems}
            albums={albums}
            onSaveItem={saveGalleryItem}
            onSaveMultipleItems={saveMultipleGalleryItems}
            onDeleteItem={deleteGalleryItem}
            onSaveAlbum={saveAlbum}
            onDeleteAlbum={deleteAlbum}
            onCleanQuotaCache={cleanLocalQuotaCache}
          />
        )}

        {activeTab === 'articles' && (
          <ArticlesManager
            articles={articles}
            onSave={saveArticle}
            onDelete={deleteArticle}
            onToggleFeatured={toggleFeaturedArticle}
          />
        )}

      </main>

    </div>
  );
};
