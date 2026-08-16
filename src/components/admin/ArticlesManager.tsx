import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Search, 
  BookOpen, 
  Star, 
  Calendar, 
  Clock, 
  User, 
  Image as ImageIcon, 
  Trash2, 
  Edit, 
  Eye, 
  X, 
  Upload, 
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { BlogPost } from '../../types';
import { RichTextEditor } from './RichTextEditor';
import { normalizeImageUrl } from '../../utils/imageUtils';
import { AuthorAvatar } from '../BlogSection';

interface ArticlesManagerProps {
  articles: BlogPost[];
  onSave: (article: BlogPost) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string) => void;
}

const CATEGORIES = [
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
] as const;

export const ArticlesManager: React.FC<ArticlesManagerProps> = ({
  articles,
  onSave,
  onDelete,
  onToggleFeatured
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [previewArticle, setPreviewArticle] = useState<BlogPost | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('Messages from the Bishopric');
  const [authorName, setAuthorName] = useState('Bishop Francisco Reyes');
  const [authorRole, setAuthorRole] = useState('Bishop, Masagana 2nd Ward');
  const [authorAvatar, setAuthorAvatar] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop');
  const [readingTime, setReadingTime] = useState('4 min read');
  const [scriptureRef, setScriptureRef] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [richHtml, setRichHtml] = useState('<p>Enter your spiritual article or ward message here...</p>');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newGalleryImg, setNewGalleryImg] = useState('');

  // File Inputs
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const galleryImgInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const openCreateModal = () => {
    setCurrentId(null);
    setTitle('');
    setSubtitle('');
    setCategory('Bishopric Message');
    setAuthorName('Bishop Francisco Reyes');
    setAuthorRole('Bishop, Masagana 2nd Ward');
    setAuthorAvatar('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop');
    setReadingTime('3 min read');
    setScriptureRef('');
    setThumbnailUrl('https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=1200&auto=format&fit=crop');
    setRichHtml('<p>Welcome to this spiritual reflection for the Masagana 2nd Ward family.</p><p>As we study the scriptures together this week, let us look for ways to minister to one another in Christlike love.</p>');
    setFeatured(false);
    setStatus('published');
    setGalleryImages([]);
    setIsEditing(true);
  };

  const openEditModal = (post: BlogPost) => {
    setCurrentId(post.id);
    setTitle(post.title);
    setSubtitle(post.subtitle);
    setCategory(post.category as typeof CATEGORIES[number]);
    setAuthorName(post.author.name);
    setAuthorRole(post.author.role);
    setAuthorAvatar(post.author.avatarUrl);
    setReadingTime(post.readingTime);
    setScriptureRef(post.scriptureReference || '');
    setThumbnailUrl(post.imageUrl);
    setRichHtml(post.richHtml || post.content.map(p => `<p>${p}</p>`).join(''));
    setFeatured(!!post.featured);
    setStatus(post.status || 'published');
    setGalleryImages(post.galleryImages || []);
    setIsEditing(true);
  };

  // Thumbnail upload
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setThumbnailUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Author avatar upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAuthorAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Additional Blog Images upload
  const handleGalleryImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setGalleryImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addGalleryUrl = () => {
    if (newGalleryImg.trim()) {
      setGalleryImages(prev => [...prev, normalizeImageUrl(newGalleryImg)]);
      setNewGalleryImg('');
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !richHtml.trim()) return;

    // Convert HTML to simple paragraphs for fallback
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = richHtml;
    const paragraphs = Array.from(tempDiv.querySelectorAll('p, blockquote, h2, h3, li'))
      .map(el => el.textContent?.trim() || '')
      .filter(Boolean);

    const post: BlogPost = {
      id: currentId || `post-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || title.trim(),
      category,
      author: {
        name: authorName.trim() || 'Ward Leader',
        role: authorRole.trim() || 'Masagana 2nd Ward',
        avatarUrl: normalizeImageUrl(authorAvatar),
      },
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readingTime: readingTime.trim() || '4 min read',
      imageUrl: normalizeImageUrl(thumbnailUrl) || 'https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=1200&auto=format&fit=crop',
      content: paragraphs.length > 0 ? paragraphs : [richHtml],
      richHtml: richHtml.trim(),
      galleryImages: galleryImages.length > 0 ? galleryImages : undefined,
      scriptureReference: scriptureRef.trim() || undefined,
      featured,
      status,
      createdAt: currentId ? undefined : new Date().toISOString(),
    };

    onSave(post);
    setIsEditing(false);
  };

  const filteredArticles = articles.filter(item => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Hidden File Inputs */}
      <input
        ref={thumbnailInputRef}
        type="file"
        accept="image/*"
        onChange={handleThumbnailUpload}
        className="hidden"
      />
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarUpload}
        className="hidden"
      />
      <input
        ref={galleryImgInputRef}
        type="file"
        accept="image/*"
        onChange={handleGalleryImgUpload}
        className="hidden"
      />

      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#FAF8F5] p-4 sm:p-5 rounded-3xl border border-[#E6E1D8] shadow-xs">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8C97A4] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="admin-search-articles-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, authors, topics..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D9D2C4] text-[#1E232A] text-xs placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228]"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-[#D9D2C4] text-[#1E232A] text-xs focus:outline-hidden focus:border-[#554228] cursor-pointer"
          >
            <option value="All">All Categories ({articles.length})</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <button
          onClick={openCreateModal}
          id="admin-write-article-btn"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1C2026] hover:bg-black text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-[#DFC8A4]" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            id={`admin-article-card-${article.id}`}
            className={`bg-[#FAF8F5] border rounded-3xl overflow-hidden transition-all flex flex-col justify-between group shadow-xs ${
              article.featured ? 'border-[#DFC8A4] bg-[#FCFBF8]' : 'border-[#E6E1D8]'
            }`}
          >
            {/* Card Image Cover */}
            <div className="relative aspect-16/9 overflow-hidden bg-[#EFEAE1]">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

              {/* Category & Status */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[11px] font-bold text-[#554228] border border-[#EADFCB] shadow-xs">
                  {article.category}
                </span>
                {article.featured && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FAF4E8] text-[#554228] border border-[#EADFCB] text-[10px] font-bold shadow-xs">
                    <Star className="w-3 h-3 fill-[#8C6D40] text-[#8C6D40]" />
                    <span>Featured</span>
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex items-center gap-1">
                <button
                  onClick={() => onToggleFeatured(article.id)}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    article.featured 
                      ? 'bg-[#FAF4E8] border-[#EADFCB] text-[#554228]' 
                      : 'bg-black/60 border-white/10 text-white/70 hover:text-white'
                  }`}
                  title={article.featured ? 'Remove from Featured' : 'Feature on Blog Top'}
                >
                  <Star className={`w-3.5 h-3.5 ${article.featured ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => setPreviewArticle(article)}
                  className="p-1.5 rounded-lg bg-black/60 border border-white/10 text-white hover:bg-black cursor-pointer"
                  title="Live Reader Preview"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => openEditModal(article)}
                  className="p-1.5 rounded-lg bg-black/60 border border-white/10 text-white hover:bg-black cursor-pointer"
                  title="Edit Article"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(article.id)}
                  className="p-1.5 rounded-lg bg-red-600/90 border border-red-500 text-white hover:bg-red-700 cursor-pointer"
                  title="Delete Article"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Multi-image count badge */}
              {article.galleryImages && article.galleryImages.length > 0 && (
                <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded-md bg-black/70 text-[10px] text-white/90 font-medium flex items-center gap-1">
                  <Layers className="w-3 h-3 text-[#DFC8A4]" />
                  <span>+{article.galleryImages.length} images</span>
                </div>
              )}
            </div>

            {/* Article Info */}
            <div className="p-5 flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-sm font-bold text-[#1E232A] font-serif mb-1.5 line-clamp-2 leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs text-[#5C6672] line-clamp-2 leading-relaxed mb-4">
                  {article.subtitle}
                </p>
              </div>

              {/* Author & Read Time */}
              <div className="pt-3 border-t border-[#ECE7DE] flex items-center justify-between text-xs text-[#717E8C]">
                <div className="flex items-center gap-2 truncate">
                  <AuthorAvatar
                    name={article.author.name}
                    avatarUrl={article.author.avatarUrl}
                    size="sm"
                  />
                  <span className="truncate text-[#1E232A] font-medium">{article.author.name}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0 text-[#717E8C] text-[11px]">
                  <Clock className="w-3 h-3 text-[#8C6D40]" />
                  <span>{article.readingTime}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-16 bg-[#FAF8F5] rounded-3xl border border-[#E6E1D8] p-8 shadow-xs">
          <BookOpen className="w-12 h-12 text-[#C4BCB0] mx-auto mb-3" />
          <p className="text-[#1E232A] font-semibold text-sm">No articles found</p>
          <p className="text-xs text-[#717E8C] mt-1">Write a new article using the full rich text editor.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border border-[#E6E1D8] rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in duration-200">
            <h4 className="text-[#1E232A] font-serif font-bold text-base mb-2">Delete Article?</h4>
            <p className="text-xs text-[#5C6672] mb-5 leading-relaxed">
              Are you sure you want to permanently delete this spiritual message/article from the blog?
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5C6672] bg-white hover:bg-[#F3EFEA] border border-[#D9D2C4] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 cursor-pointer shadow-xs"
              >
                Delete Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reader Preview Modal */}
      {previewArticle && (
        <div 
          onClick={() => setPreviewArticle(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl w-full bg-[#FAF8F5] border border-[#E6E1D8] rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8 cursor-default"
          >
            {/* Header Cover */}
            <div className="relative aspect-21/9 overflow-hidden bg-black">
              <img
                src={previewArticle.imageUrl}
                alt={previewArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <button
                onClick={() => setPreviewArticle(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FAF4E8] text-[#554228] border border-[#EADFCB]">
                  {previewArticle.category}
                </span>
                <span className="text-xs text-[#717E8C]">{previewArticle.date}</span>
                <span className="text-xs text-[#717E8C]">• {previewArticle.readingTime}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E232A] mb-2 leading-tight">
                {previewArticle.title}
              </h1>
              <p className="text-sm text-[#8C6D40] font-medium mb-6 leading-relaxed">
                {previewArticle.subtitle}
              </p>

              {/* Author Strip */}
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#D9D2C4] mb-6 shadow-2xs">
                <AuthorAvatar
                  name={previewArticle.author.name}
                  avatarUrl={previewArticle.author.avatarUrl}
                  size="lg"
                />
                <div>
                  <h4 className="text-sm font-bold text-[#1E232A] font-serif">{previewArticle.author.name}</h4>
                  <p className="text-xs text-[#5C6672]">{previewArticle.author.role}</p>
                </div>
              </div>

              {/* Article Content Rendered with Rich HTML */}
              <div 
                className="text-[#1E232A] font-serif text-[16px] leading-relaxed space-y-4 border-b border-[#ECE7DE] pb-8"
                dangerouslySetInnerHTML={{ 
                  __html: previewArticle.richHtml || previewArticle.content.map(p => `<p>${p}</p>`).join('') 
                }}
              />

              {/* Multi-image Gallery Attachments */}
              {previewArticle.galleryImages && previewArticle.galleryImages.length > 0 && (
                <div className="mt-6 pt-2">
                  <h4 className="text-xs font-bold text-[#8C6D40] uppercase tracking-wider mb-3">
                    Photo Attachments
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {previewArticle.galleryImages.map((img, i) => (
                      <div key={i} className="rounded-xl overflow-hidden border border-[#D9D2C4] aspect-4/3 bg-black">
                        <img src={img} alt={`Attached ${i}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal with Full Text Editor */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#FAF8F5] border border-[#E6E1D8] rounded-3xl p-5 sm:p-8 max-w-4xl w-full shadow-2xl animate-in fade-in duration-200 my-6 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#ECE7DE] pb-4 mb-6 sticky top-0 bg-[#FAF8F5] z-20">
              <div>
                <h3 className="text-[#1E232A] font-serif font-bold text-lg sm:text-xl">
                  {currentId ? 'Edit Article & Blog Post' : 'Compose New Spiritual Article'}
                </h3>
                <p className="text-xs text-[#8C6D40] font-medium mt-0.5">
                  Full WYSIWYG rich text editor with image attachments
                </p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg text-[#6C7785] hover:text-[#1E232A] bg-white border border-[#D9D2C4] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Title & Subtitle */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A5568] mb-1.5">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Finding Peace and Direction in Daily Scripture Study"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#D9D2C4] text-[#1E232A] text-sm font-semibold placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A5568] mb-1.5">
                    Subtitle / Summary *
                  </label>
                  <input
                    type="text"
                    required
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. Practical guidance on keeping Christ at the center of our homes..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D9D2C4] text-[#1E232A] text-xs placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228]"
                  />
                </div>
              </div>

              {/* Category, Scripture & Reading Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A5568] mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as typeof CATEGORIES[number])}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9D2C4] text-[#1E232A] text-xs focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228] cursor-pointer"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A5568] mb-1.5">
                    Scripture Reference (Optional)
                  </label>
                  <input
                    type="text"
                    value={scriptureRef}
                    onChange={(e) => setScriptureRef(e.target.value)}
                    placeholder="e.g. Alma 37:6-7 / 2 Nephi 31:20"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9D2C4] text-[#1E232A] text-xs placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A5568] mb-1.5">
                    Est. Reading Time
                  </label>
                  <input
                    type="text"
                    value={readingTime}
                    onChange={(e) => setReadingTime(e.target.value)}
                    placeholder="e.g. 4 min read"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9D2C4] text-[#1E232A] text-xs placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228]"
                  />
                </div>
              </div>

              {/* Author Details */}
              <div className="p-4 rounded-2xl bg-white border border-[#D9D2C4] shadow-2xs">
                <span className="text-xs font-bold text-[#8C6D40] block mb-3 font-serif">Author Details</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#4A5568] mb-1">Author Name *</label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Bishop Francisco Reyes"
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D9D2C4] text-[#1E232A] text-xs placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#4A5568] mb-1">Role / Calling *</label>
                    <input
                      type="text"
                      required
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value)}
                      placeholder="Bishop, Masagana 2nd Ward"
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D9D2C4] text-[#1E232A] text-xs placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#4A5568] mb-1">
                      Author Avatar <span className="font-normal text-[#8C97A4]">(Photo or Letter Initial)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <AuthorAvatar
                        name={authorName || 'Author'}
                        avatarUrl={authorAvatar}
                        size="md"
                      />
                      <input
                        type="url"
                        value={authorAvatar}
                        onChange={(e) => setAuthorAvatar(e.target.value)}
                        placeholder="Avatar photo URL (or leave empty for initial)"
                        className="flex-1 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D9D2C4] text-[#1E232A] text-xs placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228]"
                      />
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="p-2 rounded-xl bg-[#FAF4E8] text-[#554228] border border-[#EADFCB] text-xs hover:bg-[#F4ECE0] cursor-pointer"
                        title="Upload Avatar Photo"
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Thumbnail Image */}
              <div className="p-4 rounded-2xl bg-white border border-[#D9D2C4] shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#8C6D40] font-serif">
                    Article Cover Thumbnail Image *
                  </label>
                  <button
                    type="button"
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF4E8] hover:bg-[#F4ECE0] text-[#554228] border border-[#EADFCB] text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Local File</span>
                  </button>
                </div>

                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="Or enter image URL (https://images.unsplash.com/...)"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#D9D2C4] text-[#1E232A] text-xs placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228] mb-3"
                />

                {thumbnailUrl && (
                  <div className="relative rounded-xl overflow-hidden border border-[#D9D2C4] max-h-48 bg-black">
                    <img src={thumbnailUrl} alt="Thumbnail Preview" className="w-full h-48 object-cover" />
                  </div>
                )}
              </div>

              {/* Full WYSIWYG Rich Text Editor */}
              <div>
                <label className="block text-xs font-bold text-[#1E232A] font-serif mb-2">
                  Article Body & Message (Full Text Editor) *
                </label>
                <RichTextEditor
                  value={richHtml}
                  onChange={setRichHtml}
                  placeholder="Write the spiritual message, quotes, and insights for the ward members..."
                  minHeight="350px"
                />
              </div>

              {/* Additional Gallery Images for Blog Post */}
              <div className="p-4 rounded-2xl bg-white border border-[#D9D2C4] shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#8C6D40] font-serif">
                      Additional Blog Gallery Images
                    </h4>
                    <p className="text-[11px] text-[#717E8C]">
                      Attach photo albums or additional event photos to display alongside this article
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => galleryImgInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF4E8] hover:bg-[#F4ECE0] text-[#554228] border border-[#EADFCB] text-xs font-semibold cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                  </button>
                </div>

                <div className="flex gap-2 mb-3">
                  <input
                    type="url"
                    value={newGalleryImg}
                    onChange={(e) => setNewGalleryImg(e.target.value)}
                    placeholder="Or paste image URL to attach..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D9D2C4] text-[#1E232A] text-xs placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228]"
                  />
                  <button
                    type="button"
                    onClick={addGalleryUrl}
                    className="px-4 py-2 rounded-xl bg-[#FAF4E8] hover:bg-[#F4ECE0] text-[#554228] border border-[#EADFCB] text-xs font-bold cursor-pointer"
                  >
                    Add URL
                  </button>
                </div>

                {galleryImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-2">
                    {galleryImages.map((img, idx) => (
                      <div key={idx} className="relative rounded-lg overflow-hidden border border-[#D9D2C4] aspect-square group bg-black">
                        <img src={img} alt={`Attached ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-1 right-1 p-1 rounded-md bg-red-600/90 text-white hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status & Featured */}
              <div className="p-4 rounded-2xl bg-white border border-[#D9D2C4] flex flex-wrap items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#8C6D40]" />
                    <span className="text-xs font-semibold text-[#1E232A]">Feature at Top of Blog</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-[#554228] focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#5C6672] font-medium">Article Status:</span>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                    className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#D9D2C4] text-[#1E232A] text-xs focus:outline-hidden focus:border-[#554228] cursor-pointer"
                  >
                    <option value="published">Published (Live to Ward)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ECE7DE] sticky bottom-0 bg-[#FAF8F5] py-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#5C6672] bg-white hover:bg-[#F3EFEA] border border-[#D9D2C4] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim() || !richHtml.trim()}
                  className="px-7 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1C2026] hover:bg-black shadow-md cursor-pointer transition-colors disabled:opacity-50"
                >
                  {currentId ? 'Save & Update Article' : 'Publish Article to Ward Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
