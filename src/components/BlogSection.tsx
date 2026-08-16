import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { useAdminData } from '../data/adminStore';
import { Language, translations } from '../data/translations';

interface BlogSectionProps {
  lang: Language;
  onOpenArticle: (articleId: string) => void;
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

export const BlogSection: React.FC<BlogSectionProps> = ({ lang, onOpenArticle }) => {
  const { articles } = useAdminData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery] = useState<string>('');
  const t = translations[lang];
  const blog = t.blog;

  const categories = [
    'All',
    'Messages from the Bishopric',
    'Sacrament Talk Spotlight',
    'Missionary Letters',
    'Youth',
    'Primary',
    'Relief Society',
    'Elders Quorum',
    'Ward Activities',
    'Temple & Family History',
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
      <div className="flex flex-col mb-8 gap-4">
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
              onClick={() => onOpenArticle(post.id)}
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

    </section>
  );
};
