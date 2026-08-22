import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Clock, 
  MapPin, 
  Pin, 
  Search
} from 'lucide-react';
import { useAdminData } from '../data/adminStore';
import { Language, translations } from '../data/translations';

interface BulletinBoardProps {
  lang: Language;
}

export const BulletinBoard: React.FC<BulletinBoardProps> = ({ lang }) => {
  const { announcements } = useAdminData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const t = translations[lang];
  const bulletin = t.bulletin;

  const ALL_CATEGORIES = [
    'Ward Activities',
    'Stake Activities',
    'Youth (YM/YW)',
    'Relief Society',
    'Elders Quorum',
    'Primary',
    'Service & Welfare',
    'Temple & Family History',
    'Missionary'
  ];

  // Only offer filters for categories that currently have announcements
  const usedCategories = new Set(announcements.map((a) => a.category as string));
  const categories = ['All', ...ALL_CATEGORIES.filter((cat) => usedCategories.has(cat))];

  // If the selected category's last announcement was removed, fall back to All
  const activeCategory = categories.includes(selectedCategory) ? selectedCategory : 'All';

  // Filter announcements
  const filteredAnnouncements = announcements.filter((item) => {
    const matchesCategory = activeCategory === 'All' || activeCategory === bulletin.allCategory || item.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });


  return (
    <section id="bulletin" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE4D9] text-[#554228] text-xs font-semibold uppercase tracking-wider mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>{bulletin.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#1C2026] tracking-tight">
            {bulletin.title}
          </h2>
          <p className="text-sm sm:text-base text-[#616B77] mt-1">
            {bulletin.subtitle}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FFFFFF] border border-[#E4DFD5] rounded-3xl p-4 sm:p-6 shadow-xs mb-6">
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#828D9A]" />
          <input
            type="text"
            placeholder={bulletin.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] text-sm text-[#1C2026] placeholder:text-[#8E98A5] focus:outline-none focus:ring-2 focus:ring-[#C7B59D]"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#1C2026] text-white shadow-xs'
                  : 'bg-[#F2EEE7] text-[#5A6470] hover:bg-[#E7E2D8]'
              }`}
            >
              {cat === 'All' ? bulletin.allCategory : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className="bg-[#FFFFFF] border border-[#E4DFD5] rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:border-[#D0C8BB] transition-all group"
            >
              <div>
                {/* Category & Pin Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF4E8] text-[#554228] border border-[#EADFCB]">
                    {ann.category}
                  </span>
                  {ann.isPinned && (
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-[#B26A20]">
                      <Pin className="w-3 h-3 fill-current" />
                      <span>{bulletin.pinnedBadge}</span>
                    </div>
                  )}
                </div>

                <h4 className="text-base sm:text-lg font-semibold text-[#1C2026] leading-snug group-hover:text-[#3B4D63] transition-colors">
                  {ann.title}
                </h4>

                {/* Date, Time & Location */}
                <div className="mt-3 space-y-1 text-xs text-[#5D6774]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#8894A2]" />
                    <span>{ann.date}</span>
                  </div>
                  {ann.time && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#8894A2]" />
                      <span>{ann.time}</span>
                    </div>
                  )}
                  {ann.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#8894A2]" />
                      <span className="truncate">{ann.location}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[#4F5966] leading-relaxed mt-3">
                  {ann.description}
                </p>

                {ann.contactPerson && (
                  <p className="text-[11px] text-[#7A8694] mt-3 italic">
                    Contact: {ann.contactPerson}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-[#FFFFFF] border border-[#E4DFD5] rounded-3xl p-12 text-center">
            <Search className="w-8 h-8 text-[#8F9AA7] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#1C2026]">No announcements found</p>
            <p className="text-xs text-[#6B7683] mt-1">Try selecting 'All' or clearing your search.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 rounded-full bg-[#FAF4E8] text-xs font-bold text-[#554228] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
