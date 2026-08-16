import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Pin, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Megaphone,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { Announcement, AnnouncementCategory } from '../../types';

interface AnnouncementsManagerProps {
  announcements: Announcement[];
  onSave: (ann: Announcement) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

const CATEGORIES: AnnouncementCategory[] = [
  'Ward Activities',
  'Stake Activities',
  'Relief Society',
  'Elders Quorum',
  'Youth (YM/YW)',
  'Primary',
  'Service & Welfare',
  'Temple & Family History',
  'Missionary'
];

export const AnnouncementsManager: React.FC<AnnouncementsManagerProps> = ({
  announcements,
  onSave,
  onDelete,
  onTogglePin
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form State with Specific Structured Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('Ward Activities');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [actionText, setActionText] = useState('');
  const [actionUrl, setActionUrl] = useState('');

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const openCreateModal = () => {
    setCurrentId(null);
    setTitle('');
    setCategory('Ward Activities');
    setDate('');
    setTime('');
    setLocation('Masagana Chapel');
    setDescription('');
    setContactPerson('');
    setContactEmail('');
    setIsPinned(false);
    setActionText('');
    setActionUrl('');
    setIsEditing(true);
  };

  const openEditModal = (ann: Announcement) => {
    setCurrentId(ann.id);
    setTitle(ann.title);
    setCategory(ann.category);
    setDate(ann.date);
    setTime(ann.time || '');
    setLocation(ann.location || '');
    setDescription(ann.description);
    setContactPerson(ann.contactPerson || '');
    setContactEmail(ann.contactEmail || '');
    setIsPinned(!!ann.isPinned);
    setActionText(ann.actionText || '');
    setActionUrl(ann.actionUrl || '');
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !date.trim()) return;

    const announcement: Announcement = {
      id: currentId || `ann-${Date.now()}`,
      title: title.trim(),
      category,
      date: date.trim(),
      time: time.trim() || undefined,
      location: location.trim() || undefined,
      description: description.trim(),
      contactPerson: contactPerson.trim() || undefined,
      contactEmail: contactEmail.trim() || undefined,
      isPinned,
      actionText: actionText.trim() || undefined,
      actionUrl: actionUrl.trim() || undefined,
      createdAt: currentId ? undefined : new Date().toISOString(),
    };

    onSave(announcement);
    setIsEditing(false);
  };

  const filteredAnnouncements = announcements.filter((item) => {
    const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Action & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#FAF8F5] p-4 sm:p-5 rounded-3xl border border-[#E6E1D8] shadow-xs">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8C97A4] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="admin-search-announcements"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search announcements, dates, places..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D9D2C4] text-[#1E232A] text-xs placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228]"
            />
          </div>

          <select
            id="admin-category-filter-announcements"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-[#D9D2C4] text-[#1E232A] text-xs focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228] cursor-pointer"
          >
            <option value="All">All Categories ({announcements.length})</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button
          onClick={openCreateModal}
          id="admin-create-announcement-button"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1C2026] hover:bg-black text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-[#DFC8A4]" />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Announcements List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAnnouncements.map((ann) => (
          <div
            key={ann.id}
            id={`admin-announcement-card-${ann.id}`}
            className={`bg-[#FAF8F5] border rounded-3xl p-5 sm:p-6 transition-all flex flex-col justify-between shadow-xs ${
              ann.isPinned ? 'border-[#DFC8A4] bg-[#FAF6EE] ring-1 ring-[#DFC8A4]/40' : 'border-[#E6E1D8] hover:border-[#D9D2C4]'
            }`}
          >
            <div>
              {/* Header: Category, Pin Badge & Action Controls */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FAF4E8] text-[#554228] border border-[#EADFCB]">
                    {ann.category}
                  </span>
                  {ann.isPinned && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#554228] text-white">
                      <Pin className="w-3 h-3 fill-white" />
                      <span>Pinned to Top</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onTogglePin(ann.id)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      ann.isPinned 
                        ? 'bg-[#554228] border-[#554228] text-white' 
                        : 'border-[#D9D2C4] text-[#6C7785] hover:text-[#1E232A] hover:bg-white'
                    }`}
                    title={ann.isPinned ? 'Unpin' : 'Pin to Top of Bulletin'}
                  >
                    <Pin className={`w-3.5 h-3.5 ${ann.isPinned ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => openEditModal(ann)}
                    className="p-1.5 rounded-lg border border-[#D9D2C4] text-[#5C6672] hover:text-[#1E232A] hover:bg-white transition-colors cursor-pointer"
                    title="Edit Announcement"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(ann.id)}
                    className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-[#1E232A] font-serif mb-2.5 leading-snug">
                {ann.title}
              </h3>

              {/* Metadata Badges */}
              <div className="space-y-1.5 mb-3 text-xs text-[#5C6672]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#8C6D40] shrink-0" />
                  <span>{ann.date}</span>
                  {ann.time && (
                    <>
                      <span className="text-[#B0B9C2]">•</span>
                      <Clock className="w-3.5 h-3.5 text-[#8C6D40] shrink-0" />
                      <span>{ann.time}</span>
                    </>
                  )}
                </div>

                {ann.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#8C6D40] shrink-0" />
                    <span>{ann.location}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-[#4A5568] line-clamp-3 leading-relaxed mb-4">
                {ann.description}
              </p>
            </div>

            {/* Footer info: Contact Person & Action Link */}
            <div className="pt-3 border-t border-[#ECE7DE] flex items-center justify-between text-xs text-[#717E8C]">
              {ann.contactPerson ? (
                <div className="flex items-center gap-1.5 truncate">
                  <User className="w-3 h-3 text-[#8C6D40]" />
                  <span className="truncate">{ann.contactPerson}</span>
                </div>
              ) : (
                <span className="italic">Masagana 2nd Ward</span>
              )}

              {ann.actionText && (
                <span className="px-2 py-0.5 rounded-md bg-[#FAF4E8] text-[#554228] border border-[#EADFCB] text-[10px] font-semibold">
                  CTA: {ann.actionText}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAnnouncements.length === 0 && (
        <div className="text-center py-16 bg-[#FAF8F5] rounded-3xl border border-[#E6E1D8] p-8 shadow-xs">
          <Megaphone className="w-12 h-12 text-[#C4BCB0] mx-auto mb-3" />
          <p className="text-[#1E232A] font-semibold text-sm">No announcements found</p>
          <p className="text-xs text-[#717E8C] mt-1">Try clearing your search or create a new bulletin notice.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border border-[#E6E1D8] rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in duration-200">
            <h4 className="text-[#1E232A] font-serif font-bold text-base mb-2">Delete Announcement?</h4>
            <p className="text-xs text-[#5C6672] mb-5 leading-relaxed">
              Are you sure you want to permanently remove this announcement from the public bulletin?
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
                Delete Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF8F5] border border-[#E6E1D8] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl animate-in fade-in duration-200 my-8">
            <div className="flex items-center justify-between border-b border-[#ECE7DE] pb-4 mb-6">
              <div>
                <h3 className="text-[#1E232A] font-serif font-bold text-lg">
                  {currentId ? 'Edit Announcement' : 'Create New Announcement'}
                </h3>
                <p className="text-xs text-[#8C6D40] font-medium mt-0.5">
                  Fill in the specific structured fields for the ward bulletin
                </p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg text-[#6C7785] hover:text-[#1E232A] bg-white border border-[#D9D2C4] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#4A5568] mb-1.5">
                    Announcement Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Ward Fellowship Salu-Salo & Games"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9D2C4] text-[#1E232A] text-xs placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A5568] mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AnnouncementCategory)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#D9D2C4] text-[#1E232A] text-xs focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228] cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date, Time & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A5568] mb-1.5">
                    Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. Saturday, Aug 29, 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9D2C4] text-[#1E232A] text-xs placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A5568] mb-1.5">
                    Time (Optional)
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 6:30 AM – 10:30 AM"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9D2C4] text-[#1E232A] text-xs placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A5568] mb-1.5">
                    Location / Venue
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Masagana Chapel Cultural Hall"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9D2C4] text-[#1E232A] text-xs placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228]"
                  />
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1.5">
                  Detailed Description & Agenda *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide complete details, what families should bring, agenda, and instructions..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9D2C4] text-[#1E232A] text-xs placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228] resize-y leading-relaxed"
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A5568] mb-1.5">
                    Contact Leader / Coordinator
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Brother Mateo Dela Cruz"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9D2C4] text-[#1E232A] text-xs placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A5568] mb-1.5">
                    Contact Phone or Email (Optional)
                  </label>
                  <input
                    type="text"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g. 0917-xxx-xxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9D2C4] text-[#1E232A] text-xs placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228]"
                  />
                </div>
              </div>

              {/* Pin Status & Action Link */}
              <div className="p-4 rounded-2xl bg-[#F3EFEA] border border-[#E6E1D8] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pin className="w-4 h-4 text-[#8C6D40]" />
                    <span className="text-xs font-semibold text-[#1E232A]">Pin to Top of Bulletin</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="w-4 h-4 rounded text-[#554228] focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#D9D2C4]">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#4A5568] mb-1">
                      Action Button Text (Optional)
                    </label>
                    <input
                      type="text"
                      value={actionText}
                      onChange={(e) => setActionText(e.target.value)}
                      placeholder="e.g. View Volunteer List"
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#D9D2C4] text-[#1E232A] text-xs placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#4A5568] mb-1">
                      Action URL / Form Link (Optional)
                    </label>
                    <input
                      type="text"
                      value={actionUrl}
                      onChange={(e) => setActionUrl(e.target.value)}
                      placeholder="e.g. #volunteer-form"
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#D9D2C4] text-[#1E232A] text-xs placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ECE7DE]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#5C6672] bg-white hover:bg-[#F3EFEA] border border-[#D9D2C4] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1C2026] hover:bg-black shadow-md cursor-pointer transition-colors"
                >
                  {currentId ? 'Save Changes' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
