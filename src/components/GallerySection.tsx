import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  MapPin, 
  Calendar, 
  Folder, 
  Images, 
  ArrowRight
} from 'lucide-react';
import { useAdminData } from '../data/adminStore';
import { Language, translations } from '../data/translations';

interface GallerySectionProps {
  lang: Language;
  onOpenAlbum: (albumId: string) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ 
  lang,
  onOpenAlbum 
}) => {
  const { albums } = useAdminData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const t = translations[lang];
  const gallery = t.gallery;

  // Filter albums by category
  const filteredAlbums = albums.filter(
    (a) => selectedCategory === 'All' || a.category === selectedCategory
  );

  return (
    <section id="gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 scroll-mt-24">
      {/* Main Section Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE4D8] text-[#554228] text-xs font-semibold uppercase tracking-wider mb-3">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>{gallery.badge}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#1C2026] tracking-tight">
          {gallery.title}
        </h2>
        <p className="text-sm sm:text-base text-[#616B77] mt-1.5 max-w-2xl">
          {gallery.subtitle}
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {['All', 'Ward Activities', 'Stake', 'Youth', 'Relief Society', 'Elders Quorum', 'Primary', 'Community'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#554228] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#616B77] hover:bg-[#EAE4D8] hover:text-[#1C2026] border border-[#E6E1D8]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Albums Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlbums.map((album) => {
            const coverImage = album.coverImageUrl || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800&auto=format&fit=crop';
            const photoCount = album.itemCount || 1;

            return (
              <div
                key={album.id}
                onClick={() => onOpenAlbum(album.id)}
                className="group relative bg-[#FFFFFF] rounded-3xl overflow-hidden border border-[#E6E1D8] shadow-xs hover:shadow-lg hover:border-[#D0C8BB] transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Album Cover Image */}
                <div>
                  <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-[#F0EBE1]">
                    <img
                      src={coverImage}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/55 backdrop-blur-md border border-white/20 text-white">
                        {album.category}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-[#1C2026] shadow-xs">
                        <Images className="w-3.5 h-3.5 text-[#554228]" />
                        <span>
                          {photoCount} {gallery.photosCount}
                        </span>
                      </span>
                    </div>

                    {/* Date & Location on Cover bottom */}
                    <div className="absolute bottom-3 left-4 right-4 z-10 text-xs font-medium text-white/90 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#E8DCC8]" />
                        <span>{album.date}</span>
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-[#E8DCC8]">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{album.location || 'Masagana'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Album Card Body */}
                  <div className="p-5 sm:p-6 bg-[#FFFFFF]">
                    <h3 className="text-lg sm:text-xl font-serif font-semibold text-[#1C2026] group-hover:text-[#554228] transition-colors leading-snug line-clamp-2">
                      {album.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#616B77] mt-2 line-clamp-2 leading-relaxed">
                      {album.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 sm:px-6 pb-5 pt-0">
                  <div className="pt-4 border-t border-[#F0EBE1] flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#554228] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                      <span>{gallery.viewAlbum}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E6E1D8] flex items-center justify-center text-[#554228] group-hover:bg-[#554228] group-hover:text-white transition-colors">
                      <Folder className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
