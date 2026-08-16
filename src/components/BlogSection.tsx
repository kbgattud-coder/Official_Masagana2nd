import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  ChevronRight, 
  X, 
  Layers
} from 'lucide-react';
import { useAdminData } from '../data/adminStore';
import { BlogPost } from '../types';
import { Language, translations } from '../data/translations';

interface BlogSectionProps {
  lang: Language;
}

// Helper to get initial letter of first name
export const getAuthorInitial = (name?: string): string => {
  if (!name || !name.trim()) return 'A';
  // Remove common honorary titles if present to get the actual first name
  const clean = name.replace(/^(Bishop|Brother|Sister|President|Elder|Bro\.|Sis\.|Pres\.)\s+/i, '').trim();
  const target = clean || name;
  return target.charAt(0).toUpperCase();
};

export const AuthorAvatar: React.FC<{ 
  name: string; 
  avatarUrl?: string; 
  size?: 'sm' | 'md' | 'lg'; 
  className?: string; 
}> = ({
  name,
  avatarUrl,
  size = 'md',
  className = ''
}) => {
  const [imgError, setImgError] = useState(false);
  const initial = getAuthorInitial(name);
  
  const sizeMap = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-7 h-7 text-xs font-semibold',
    lg: 'w-10 h-10 text-base font-serif font-bold',
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  if (avatarUrl && avatarUrl.trim() && !imgError) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        onError={() => setImgError(true)}
        className={`${currentSize.split(' ')[0]} ${currentSize.split(' ')[1]} rounded-full object-cover border border-[#E0D5C2] ${className}`}
      />
    );
  }

  return (
    <div
      className={`${currentSize} rounded-full bg-[#554228] text-[#FAF8F5] flex items-center justify-center border border-[#DFC8A4] shadow-2xs shrink-0 select-none ${className}`}
      title={name}
    >
      {initial}
    </div>
  );
};

export const BlogSection: React.FC<BlogSectionProps> = ({ lang }) => {
  const { articles } = useAdminData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery] = useState<string>('');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const t = translations[lang];
  const blog = t.blog;

  const categories = [
    'All',
    'Bishopric Message',
    'Relief Society',
    'Youth Spotlight',
    'Spiritual Thought',
    'Family History',
    'Ward News'
  ];

  // Only show published articles to ward members
  const publishedArticles = articles.filter(a => a.status !== 'draft');

  const filteredPosts = publishedArticles.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || selectedCategory === blog.allCategory || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.richHtml && post.richHtml.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.content.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="blog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE4D9] text-[#554228] text-xs font-semibold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{blog.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#1C2026] tracking-tight">
            {blog.title}
          </h2>
          <p className="text-sm sm:text-base text-[#616B77] mt-1">
            {blog.subtitle}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1C2026] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#5A6470] hover:bg-[#EFEBE3] border border-[#EAE4D9]'
              }`}
            >
              {cat === 'All' ? blog.allCategory : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Talks & Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPosts.map((post) => {
          return (
            <div
              key={post.id}
              onClick={() => setActivePost(post)}
              className="bg-[#FFFFFF] border border-[#E4DFD5] rounded-3xl overflow-hidden shadow-xs hover:border-[#D0C8BB] transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Article Card Image */}
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Article Content Preview */}
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-[#7E8B99] mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readingTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-[#1C2026] group-hover:text-[#3B4D63] transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#525D6B] mt-2 line-clamp-2 leading-relaxed">
                    {post.subtitle}
                  </p>
                </div>
              </div>

              {/* Author Footer */}
              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-[#F2ECE3] mt-2">
                <div className="flex items-center gap-2.5">
                  <AuthorAvatar
                    name={post.author.name}
                    avatarUrl={post.author.avatarUrl}
                    size="md"
                  />
                  <div>
                    <p className="text-xs font-bold text-[#1C2026]">{post.author.name}</p>
                    <p className="text-[10px] text-[#7A8694]">{post.author.role}</p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-[#554228] group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  Read <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FULL ARTICLE READER MODAL */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#D5CEC2] flex flex-col">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#ECE7DE] flex items-center justify-between z-20">
              <span className="text-xs font-bold uppercase tracking-wider text-[#554228]">
                {activePost.category}
              </span>

              <button
                onClick={() => setActivePost(null)}
                aria-label="Close Article"
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Article Body */}
            <div className="p-6 sm:p-8">
              {activePost.imageUrl && (
                <div className="h-56 rounded-2xl overflow-hidden mb-6 shadow-xs">
                  <img
                    src={activePost.imageUrl}
                    alt={activePost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <h2 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#1C2026] leading-tight mb-3">
                {activePost.title}
              </h2>

              <p className="text-sm sm:text-base font-medium text-[#525D6B] mb-4 leading-relaxed">
                {activePost.subtitle}
              </p>

              {/* Scripture Anchor */}
              {activePost.scriptureReference && (
                <div className="p-3.5 rounded-xl bg-[#FAF4E8] border border-[#EADFCB] text-xs font-semibold text-[#554228] mb-6 inline-block">
                  📖 Scripture Study Anchor: {activePost.scriptureReference}
                </div>
              )}

              {/* Author Bar */}
              <div className="flex items-center gap-3 py-3 border-y border-[#ECE7DE] mb-6">
                <AuthorAvatar
                  name={activePost.author.name}
                  avatarUrl={activePost.author.avatarUrl}
                  size="lg"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#1C2026]">{activePost.author.name}</h4>
                  <p className="text-[11px] text-[#7A8694]">{activePost.author.role} • {activePost.date}</p>
                </div>
              </div>

              {/* Article Content Rendered with Rich HTML or Paragraph Fallback */}
              {activePost.richHtml ? (
                <div 
                  className="space-y-4 text-sm sm:text-base text-[#2C3540] leading-relaxed font-serif"
                  dangerouslySetInnerHTML={{ __html: activePost.richHtml }}
                />
              ) : (
                <div className="space-y-4 text-sm sm:text-base text-[#2C3540] leading-relaxed font-sans">
                  {activePost.content.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              )}

              {/* Additional Photo Gallery Images */}
              {activePost.galleryImages && activePost.galleryImages.length > 0 && (
                <div className="mt-8 pt-6 border-t border-[#ECE7DE]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#554228] mb-3 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Attached Photo Gallery</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {activePost.galleryImages.map((img, i) => (
                      <div key={i} className="rounded-2xl overflow-hidden border border-[#ECE7DE] aspect-4/3 bg-black">
                        <img src={img} alt={`Attached photo ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-[#FAF8F5] px-6 py-4 border-t border-[#ECE7DE] flex items-center justify-between text-xs text-[#7A8694]">
              <span>Masagana 2nd Ward • {activePost.category}</span>
              <button
                onClick={() => setActivePost(null)}
                className="px-4 py-1.5 rounded-full bg-[#1C2026] text-white font-semibold text-xs hover:bg-black transition-colors cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
