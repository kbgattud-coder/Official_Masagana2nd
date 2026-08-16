import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Images, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Loader2, 
  Image as ImageIcon
} from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useAdminData } from '../data/adminStore';
import { Language, translations } from '../data/translations';
import { GoogleDriveService, DrivePhotoItem } from '../services/googleDriveService';
import { GalleryItem } from '../types';

interface AlbumPageProps {
  albumId: string;
  onBack: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenAdmin?: () => void;
  onNavigateHomeSection: (sectionId: string) => void;
}

export const AlbumPage: React.FC<AlbumPageProps> = ({
  albumId,
  onBack,
  lang,
  setLang,
  onOpenAdmin,
  onNavigateHomeSection,
}) => {
  const { albums, galleryItems } = useAdminData();
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [drivePhotos, setDrivePhotos] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const t = translations[lang];
  const gallery = t.gallery;

  const currentAlbum = albums.find((a) => a.id === albumId);

  // Scroll to top when opening album page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [albumId]);

  // Fetch photos for the selected album
  useEffect(() => {
    if (!currentAlbum) {
      setIsLoading(false);
      return;
    }

    const folderId = currentAlbum.driveFolderId || 
      (currentAlbum.driveFolderUrl ? GoogleDriveService.extractFolderId(currentAlbum.driveFolderUrl) : null);

    if (folderId) {
      setIsLoading(true);
      GoogleDriveService.fetchPhotosFromFolder(folderId)
        .then((photos: DrivePhotoItem[]) => {
          if (photos && photos.length > 0) {
            const mappedItems: GalleryItem[] = photos.map((p, idx) => ({
              id: `photo-${p.id || idx}`,
              albumId: albumId,
              title: p.name || `${currentAlbum.title} Photo ${idx + 1}`,
              category: currentAlbum.category,
              imageUrl: p.directImageUrl,
              thumbnailUrl: p.thumbnailUrl,
              date: p.date || currentAlbum.date,
              caption: p.caption || currentAlbum.title,
              location: currentAlbum.location || 'Masagana Chapel',
            }));
            setDrivePhotos(mappedItems);
          } else {
            const localFallback = galleryItems.filter(
              (item) => item.albumId === albumId || item.category === currentAlbum.category
            );
            setDrivePhotos(localFallback);
          }
        })
        .catch((err) => {
          console.warn('Failed to fetch album photos:', err);
          const localFallback = galleryItems.filter(
            (item) => item.albumId === albumId || item.category === currentAlbum.category
          );
          setDrivePhotos(localFallback);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      const localItems = galleryItems.filter(
        (item) => item.albumId === albumId || item.category === currentAlbum.category
      );
      setDrivePhotos(localItems);
      setIsLoading(false);
    }
  }, [albumId, currentAlbum, galleryItems]);

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const showNextImage = () => {
    if (activeLightboxIndex !== null && drivePhotos.length > 0) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % drivePhotos.length);
    }
  };

  const showPrevImage = () => {
    if (activeLightboxIndex !== null && drivePhotos.length > 0) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + drivePhotos.length) % drivePhotos.length);
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNextImage();
      if (e.key === 'ArrowLeft') showPrevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, drivePhotos.length]);

  const currentItem = activeLightboxIndex !== null ? drivePhotos[activeLightboxIndex] : null;

  if (!currentAlbum) {
    return (
      <div className="min-h-screen bg-[#EDEBE8] text-[#1E232A] flex flex-col font-sans">
        <Header
          activeTab="gallery"
          setActiveTab={onNavigateHomeSection}
          lang={lang}
          setLang={setLang}
          onOpenAdmin={onOpenAdmin}
        />
        <main className="flex-grow max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-3xl p-12 border border-[#E6E1D8] shadow-xs">
            <h2 className="text-2xl font-serif font-semibold text-[#1C2026] mb-3">Album Not Found</h2>
            <p className="text-sm text-[#616B77] mb-6">The requested album could not be found or has been moved.</p>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#554228] text-white text-xs font-semibold hover:bg-[#3D2F1D] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{gallery.backToAlbums}</span>
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
        activeTab="gallery"
        setActiveTab={onNavigateHomeSection}
        lang={lang}
        setLang={setLang}
        onOpenAdmin={onOpenAdmin}
      />

      {/* Main Dedicated Album Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        
        {/* Album Header Banner */}
        <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#E6E1D8] shadow-xs mb-8">
          {/* Top Bar with Back Button & Meta Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#F0EBE1]">
            <button
              onClick={onBack}
              id="album-page-back-button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF8F5] hover:bg-[#EAE4D8] text-[#1C2026] hover:text-[#554228] border border-[#E6E1D8] text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{gallery.backToAlbums}</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FAF4E8] border border-[#EADFCB] text-[#554228]">
                {currentAlbum.category}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF8F5] border border-[#E6E1D8] text-[#616B77]">
                <Calendar className="w-3.5 h-3.5 text-[#554228]" />
                <span>{currentAlbum.date}</span>
              </span>
              {currentAlbum.location && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF8F5] border border-[#E6E1D8] text-[#616B77]">
                  <MapPin className="w-3.5 h-3.5 text-[#554228]" />
                  <span>{currentAlbum.location}</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF8F5] border border-[#E6E1D8] text-[#616B77]">
                <Images className="w-3.5 h-3.5 text-[#554228]" />
                <span>{drivePhotos.length} {gallery.photosCount}</span>
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="mt-5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold text-[#1C2026] leading-tight">
              {currentAlbum.title}
            </h1>
            {currentAlbum.description && (
              <p className="text-sm sm:text-base text-[#616B77] mt-2.5 max-w-3xl leading-relaxed">
                {currentAlbum.description}
              </p>
            )}
          </div>
        </div>

        {/* Photos Grid - Pure Images */}
        {isLoading ? (
          <div className="p-20 text-center bg-white rounded-3xl border border-[#E6E1D8] shadow-xs">
            <Loader2 className="w-9 h-9 text-[#8C6D40] animate-spin mx-auto mb-3" />
            <h3 className="text-base font-semibold text-[#1E232A]">
              Loading Album Photos...
            </h3>
            <p className="text-xs text-[#616B77] mt-1">
              Rendering high-resolution gallery images.
            </p>
          </div>
        ) : drivePhotos.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {drivePhotos.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => openLightbox(index)}
                  className="relative aspect-4/3 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs group cursor-pointer bg-[#FAF8F5] border border-[#E4DFD5] transition-all hover:shadow-md hover:border-[#D0C8BB]"
                >
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Clean subtle hover maximize indicator */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center text-[#1C2026] shadow-sm transform scale-90 group-hover:scale-100 transition-transform">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Return Button */}
            <div className="text-center pt-6">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFFFFF] hover:bg-[#FAF8F5] text-[#1C2026] border border-[#E6E1D8] text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs hover:shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 text-[#554228]" />
                <span>{gallery.backToAlbums}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#FFFFFF] rounded-3xl p-16 text-center border border-[#E6E1D8] shadow-xs space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF8F5] border border-[#E6E1D8] flex items-center justify-center text-[#554228]">
              <ImageIcon className="w-8 h-8 text-[#8C6D40]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#1C2026]">
                {gallery.emptyAlbum}
              </h3>
              <p className="text-xs sm:text-sm text-[#616B77] mt-1 max-w-md mx-auto">
                No photos found in this album.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={onBack}
                className="px-5 py-2.5 rounded-full bg-[#554228] hover:bg-[#3D2F1D] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                {gallery.backToAlbums}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* LIGHTBOX MODAL - Pure High-Res Photo Viewer */}
      {currentItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            aria-label="Close Lightbox"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Button */}
          {drivePhotos.length > 1 && (
            <button
              onClick={showPrevImage}
              aria-label="Previous Image"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
          )}

          {/* Next Button */}
          {drivePhotos.length > 1 && (
            <button
              onClick={showNextImage}
              aria-label="Next Image"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          )}

          {/* Centered Image Container */}
          <div className="relative flex flex-col items-center justify-center max-w-[94vw] max-h-[92vh]">
            <img
              src={currentItem.imageUrl}
              alt=""
              className="max-h-[86vh] max-w-[92vw] w-auto h-auto object-contain rounded-2xl shadow-2xl select-none"
            />

            {/* Image Counter Pill */}
            {drivePhotos.length > 1 && (
              <div className="mt-3 px-4 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/80 text-xs font-medium tracking-wide">
                {activeLightboxIndex! + 1} / {drivePhotos.length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer
        onNavigate={onNavigateHomeSection}
        onOpenAdmin={onOpenAdmin}
        lang={lang}
      />
    </div>
  );
};
