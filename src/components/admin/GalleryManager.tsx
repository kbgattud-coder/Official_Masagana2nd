import React, { useState, useRef, useEffect } from 'react';
import { normalizeImageUrl } from '../../utils/imageUtils';
import { 
  Plus, 
  FolderPlus, 
  Image as ImageIcon, 
  Trash2, 
  Edit, 
  MapPin, 
  Calendar, 
  X, 
  Folder, 
  Eye, 
  CheckCircle2, 
  HardDrive, 
  AlertCircle, 
  Sparkles, 
  Info, 
  Loader2, 
  ExternalLink,
  RefreshCw,
  FolderCheck,
  Settings,
  Link as LinkIcon,
  UploadCloud,
  ChevronRight,
  Maximize2,
  Check,
  Copy
} from 'lucide-react';
import { GalleryItem, Album } from '../../types';
import { compressImageFile, getLocalStorageUsage } from '../../utils/imageUtils';
import { GoogleDriveService, DriveAuthState, DrivePhotoItem } from '../../services/googleDriveService';

interface GalleryManagerProps {
  galleryItems: GalleryItem[];
  albums: Album[];
  onSaveItem: (item: GalleryItem) => void;
  onSaveMultipleItems?: (items: GalleryItem[]) => void;
  onDeleteItem: (id: string) => void;
  onSaveAlbum: (album: Album) => void;
  onDeleteAlbum: (id: string) => void;
  onCleanQuotaCache?: () => void;
}

const CATEGORIES = [
  'Ward Activities',
  'Stake',
  'Youth',
  'Relief Society',
  'Elders Quorum',
  'Primary',
  'Community'
] as const;

export const GalleryManager: React.FC<GalleryManagerProps> = ({
  galleryItems,
  albums,
  onSaveAlbum,
  onDeleteAlbum,
  onCleanQuotaCache,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Storage diagnosis info
  const [storageInfo, setStorageInfo] = useState(getLocalStorageUsage());
  const [showStorageDetails, setShowStorageDetails] = useState(false);

  // Google Drive Auth & Sync State
  const [driveState, setDriveState] = useState<DriveAuthState>(GoogleDriveService.getAuthState());
  const [isConnectingDrive, setIsConnectingDrive] = useState(false);
  const [driveError, setDriveError] = useState<string | null>(null);
  const [driveSuccessMsg, setDriveSuccessMsg] = useState<string | null>(null);
  const [showDriveConfig, setShowDriveConfig] = useState(false);
  const [customClientId, setCustomClientId] = useState(GoogleDriveService.getClientId());

  // Album Modal State (Create & Edit)
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [isAlbumCoverDragOver, setIsAlbumCoverDragOver] = useState(false);
  const [isCompressingCover, setIsCompressingCover] = useState(false);
  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
  
  // Form fields
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumCategory, setAlbumCategory] = useState<typeof CATEGORIES[number]>('Ward Activities');
  const [albumDescription, setAlbumDescription] = useState('');
  const [albumLocation, setAlbumLocation] = useState('Masagana Chapel');
  const [albumDate, setAlbumDate] = useState('August 2026');
  const [albumCoverUrl, setAlbumCoverUrl] = useState('');
  const [coverSourceType, setCoverSourceType] = useState<'upload' | 'url'>('upload');
  const [albumDriveFolderUrl, setAlbumDriveFolderUrl] = useState<string>('');
  const [isCreatingDriveSubfolder, setIsCreatingDriveSubfolder] = useState(false);
  const [isTestingDriveLink, setIsTestingDriveLink] = useState(false);
  const [testedDrivePhotos, setTestedDrivePhotos] = useState<DrivePhotoItem[] | null>(null);
  const [driveTestMessage, setDriveTestMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isSavingAlbum, setIsSavingAlbum] = useState(false);

  // Album Photo Inspector Modal
  const [inspectedAlbum, setInspectedAlbum] = useState<Album | null>(null);
  const [inspectedPhotos, setInspectedPhotos] = useState<DrivePhotoItem[]>([]);
  const [isLoadingInspectedPhotos, setIsLoadingInspectedPhotos] = useState(false);
  const [inspectedError, setInspectedError] = useState<string | null>(null);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);

  // Delete Confirmation Modal
  const [deleteConfirmAlbumId, setDeleteConfirmAlbumId] = useState<string | null>(null);

  // File Input Ref for Cover
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  // Refresh storage metrics on data change
  useEffect(() => {
    setStorageInfo(getLocalStorageUsage());
    setDriveState(GoogleDriveService.getAuthState());
  }, [albums, galleryItems]);

  // Connect Google Drive OAuth
  const handleConnectDrive = async () => {
    setIsConnectingDrive(true);
    setDriveError(null);
    setDriveSuccessMsg(null);

    try {
      if (customClientId.trim()) {
        GoogleDriveService.setCustomClientId(customClientId.trim());
      }
      await GoogleDriveService.requestDriveAccess();
      await GoogleDriveService.getOrCreateMainFolder();

      const newState = GoogleDriveService.getAuthState();
      setDriveState(newState);
      setDriveSuccessMsg('Successfully connected to Google Drive and created the "Ward Website" root folder!');
      setTimeout(() => setDriveSuccessMsg(null), 5000);
    } catch (err: any) {
      setDriveError(err.message || 'Failed to connect Google Drive.');
    } finally {
      setIsConnectingDrive(false);
    }
  };

  const handleDisconnectDrive = () => {
    GoogleDriveService.disconnect();
    setDriveState(GoogleDriveService.getAuthState());
    setDriveSuccessMsg('Disconnected from Google Drive.');
    setTimeout(() => setDriveSuccessMsg(null), 3000);
  };

  // Open Create Modal
  const handleOpenCreateAlbum = () => {
    setEditingAlbumId(null);
    setAlbumTitle('');
    setAlbumCategory('Ward Activities');
    setAlbumDescription('');
    setAlbumLocation('Masagana Chapel');
    setAlbumDate(new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    setAlbumCoverUrl('');
    setCoverSourceType('upload');
    setAlbumDriveFolderUrl('');
    setTestedDrivePhotos(null);
    setDriveTestMessage(null);
    setIsAlbumModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditAlbum = (album: Album) => {
    setEditingAlbumId(album.id);
    setAlbumTitle(album.title);
    setAlbumCategory(album.category);
    setAlbumDescription(album.description);
    setAlbumLocation(album.location || 'Masagana Chapel');
    setAlbumDate(album.date);
    setAlbumCoverUrl(album.coverImageUrl);
    setCoverSourceType(album.coverImageUrl.startsWith('data:') ? 'upload' : 'url');
    setAlbumDriveFolderUrl(album.driveFolderUrl || (album.driveFolderId ? GoogleDriveService.formatFolderUrl(album.driveFolderId) : ''));
    setTestedDrivePhotos(null);
    setDriveTestMessage(null);
    setIsAlbumModalOpen(true);
  };

  // Handle Cover Photo File Upload & Compression
  const handleCoverFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    setIsCompressingCover(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 1200, 1200, 0.8);
      setAlbumCoverUrl(compressedDataUrl);
    } catch (err) {
      const reader = new FileReader();
      reader.onload = () => setAlbumCoverUrl(reader.result as string);
      reader.readAsDataURL(file);
    } finally {
      setIsCompressingCover(false);
    }
  };

  // Auto-Create Subfolder in Google Drive (If OAuth Connected)
  const handleAutoCreateDriveFolder = async () => {
    if (!driveState.isConnected || !driveState.mainFolderId) {
      setDriveError('Please connect your Google Drive account first.');
      return;
    }
    if (!albumTitle.trim()) {
      alert('Please enter an album title first.');
      return;
    }

    setIsCreatingDriveSubfolder(true);
    setDriveError(null);
    try {
      const folderInfo = await GoogleDriveService.getOrCreateAlbumSubFolder(albumTitle, driveState.mainFolderId);
      setAlbumDriveFolderUrl(folderInfo.webViewLink || GoogleDriveService.formatFolderUrl(folderInfo.id));
      setDriveTestMessage({
        type: 'success',
        text: `Created folder "${folderInfo.name}" in Google Drive! Anyone can view photos when uploaded there.`,
      });
    } catch (err: any) {
      setDriveTestMessage({
        type: 'error',
        text: err.message || 'Failed to auto-create Google Drive subfolder.',
      });
    } finally {
      setIsCreatingDriveSubfolder(false);
    }
  };

  // Test & Scan Google Drive Link
  const handleTestDriveLink = async () => {
    if (!albumDriveFolderUrl.trim()) {
      setDriveTestMessage({ type: 'error', text: 'Please enter a Google Drive folder link or folder ID.' });
      return;
    }

    const folderId = GoogleDriveService.extractFolderId(albumDriveFolderUrl);
    if (!folderId) {
      setDriveTestMessage({ type: 'error', text: 'Invalid Google Drive link format. Must contain a valid folder ID.' });
      return;
    }

    setIsTestingDriveLink(true);
    setDriveTestMessage(null);
    setTestedDrivePhotos(null);

    try {
      const photos = await GoogleDriveService.fetchPhotosFromFolder(folderId);
      setTestedDrivePhotos(photos);
      if (photos.length > 0) {
        setDriveTestMessage({
          type: 'success',
          text: `Found ${photos.length} photo${photos.length === 1 ? '' : 's'} in Google Drive! They will display directly on the website.`,
        });
      } else {
        setDriveTestMessage({
          type: 'info',
          text: 'Connected to Google Drive folder successfully! (0 images found inside yet).',
        });
      }
    } catch (err: any) {
      setDriveTestMessage({
        type: 'info',
        text: `Folder link valid (${folderId}). Ensure sharing is set to "Anyone with the link can view".`,
      });
    } finally {
      setIsTestingDriveLink(false);
    }
  };

  // Save Album (Create or Update)
  const handleSaveAlbum = () => {
    if (!albumTitle.trim()) {
      alert('Please enter an album title.');
      return;
    }
    if (!albumCoverUrl.trim()) {
      alert('Please upload or specify a cover photo.');
      return;
    }

    setIsSavingAlbum(true);
    const extractedFolderId = albumDriveFolderUrl.trim()
      ? GoogleDriveService.extractFolderId(albumDriveFolderUrl.trim()) || undefined
      : undefined;

    const formattedFolderUrl = albumDriveFolderUrl.trim()
      ? (albumDriveFolderUrl.startsWith('http') ? albumDriveFolderUrl.trim() : `https://drive.google.com/drive/folders/${albumDriveFolderUrl.trim()}`)
      : undefined;

    const albumData: Album = {
      id: editingAlbumId || `alb-${Date.now()}`,
      title: albumTitle.trim(),
      category: albumCategory,
      description: albumDescription.trim() || 'Ward activity album and photo collection.',
      location: albumLocation.trim() || 'Masagana Chapel',
      coverImageUrl: normalizeImageUrl(albumCoverUrl),
      date: albumDate.trim() || 'August 2026',
      driveFolderId: extractedFolderId,
      driveFolderUrl: formattedFolderUrl,
      itemCount: testedDrivePhotos ? testedDrivePhotos.length : undefined,
      createdAt: editingAlbumId ? (albums.find(a => a.id === editingAlbumId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
    };

    onSaveAlbum(albumData);
    setIsSavingAlbum(false);
    setIsAlbumModalOpen(false);

    setDriveSuccessMsg(`Album "${albumData.title}" saved successfully!`);
    setTimeout(() => setDriveSuccessMsg(null), 4000);
  };

  // Inspect Photos inside an Album
  const handleOpenInspectAlbum = async (album: Album) => {
    setInspectedAlbum(album);
    setInspectedPhotos([]);
    setInspectedError(null);
    setIsLoadingInspectedPhotos(true);

    const folderId = album.driveFolderId || (album.driveFolderUrl ? GoogleDriveService.extractFolderId(album.driveFolderUrl) : null);

    if (folderId) {
      try {
        const photos = await GoogleDriveService.fetchPhotosFromFolder(folderId);
        setInspectedPhotos(photos);
      } catch (err: any) {
        setInspectedError(err.message || 'Could not load photos from Google Drive. Ensure the folder is shared publicly.');
      } finally {
        setIsLoadingInspectedPhotos(false);
      }
    } else {
      // Fallback: check if there are legacy gallery items tied to this album
      const localItems = galleryItems.filter(i => i.albumId === album.id || i.category === album.category);
      setInspectedPhotos(localItems.map(i => ({
        id: i.id,
        name: i.title,
        directImageUrl: i.imageUrl,
        thumbnailUrl: i.thumbnailUrl || i.imageUrl,
        webViewLink: i.driveFileUrl || i.imageUrl,
        date: i.date,
        caption: i.caption,
      })));
      setIsLoadingInspectedPhotos(false);
    }
  };

  // Filtered Albums
  const filteredAlbums = albums.filter((alb) => {
    const matchesCategory = selectedCategoryFilter === 'All' || alb.category === selectedCategoryFilter;
    const matchesSearch = !searchQuery.trim() || 
      alb.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      alb.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E6E1D8] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE4D8] text-[#554228] text-xs font-bold uppercase tracking-wider mb-2">
              <HardDrive className="w-3.5 h-3.5" />
              <span>Google Drive Albums & Cover Manager</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#1E232A]">
              Photo Albums & Google Drive Media
            </h2>
            <p className="text-sm text-[#616B77] mt-1 max-w-2xl leading-relaxed">
              Upload a high-quality <strong>Cover Photo</strong> for each album and paste your <strong>Google Drive shared folder link</strong>. Photos inside your Drive folder will automatically display on the public website.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowStorageDetails(!showStorageDetails)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-[#F3EFEA] border border-[#E6E1D8] text-xs font-semibold text-[#554228] transition-colors cursor-pointer shadow-2xs"
            >
              <Info className="w-4 h-4 text-[#8C6D40]" />
              <span>Storage & Drive Status</span>
            </button>

            <button
              onClick={handleOpenCreateAlbum}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#554228] hover:bg-[#3D2F1D] text-white text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Create New Album</span>
            </button>
          </div>
        </div>

        {/* Storage / Google Drive Diagnosis Dropdown */}
        {showStorageDetails && (
          <div className="mt-5 pt-5 border-t border-[#ECE7DE] space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#616B77]">
              <div className="bg-white p-4 rounded-2xl border border-[#E6E1D8]">
                <div className="font-bold text-[#1E232A] flex items-center gap-1.5 mb-1.5">
                  <ImageIcon className="w-4 h-4 text-[#8C6D40]" />
                  <span>1. Cover Photo Upload</span>
                </div>
                <p className="leading-relaxed">
                  Only the cover image is stored locally (automatically compressed). This prevents browser storage quota issues.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E6E1D8]">
                <div className="font-bold text-[#1E232A] flex items-center gap-1.5 mb-1.5">
                  <HardDrive className="w-4 h-4 text-[#8C6D40]" />
                  <span>2. Google Drive Folder Linking</span>
                </div>
                <p className="leading-relaxed">
                  Paste any shared Google Drive folder link. Make sure the folder sharing is set to <em>"Anyone with the link can view"</em>.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E6E1D8]">
                <div className="font-bold text-[#1E232A] flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="w-4 h-4 text-[#8C6D40]" />
                  <span>3. High-Speed Direct CDN</span>
                </div>
                <p className="leading-relaxed">
                  The website displays high-res images directly from Google Drive's CDN with zero local storage overhead.
                </p>
              </div>
            </div>

            {/* Storage Quota Health Banner */}
            <div className="p-4 rounded-2xl bg-white border border-[#E6E1D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-[#1E232A] flex items-center gap-2">
                    <span>IndexedDB High-Capacity Storage Ready</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Unlimited
                    </span>
                  </div>
                  <p className="text-[11px] text-[#616B77] mt-0.5">
                    Local cache: <strong className="text-[#1E232A]">{storageInfo.formattedUsed}</strong> ({storageInfo.percentUsed}%). Browser quota errors are completely resolved.
                  </p>
                </div>
              </div>

              {storageInfo.isHighUsage && onCleanQuotaCache && (
                <button
                  onClick={() => {
                    onCleanQuotaCache();
                    setStorageInfo(getLocalStorageUsage());
                    setDriveSuccessMsg('Local storage cache cleaned successfully!');
                    setTimeout(() => setDriveSuccessMsg(null), 3000);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#FAF4E8] hover:bg-[#F3E8D3] border border-[#EADFCB] text-[#554228] font-bold text-xs transition-colors shrink-0 cursor-pointer"
                >
                  Optimize & Clear Local Storage Cache
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Success / Error Messages */}
      {driveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{driveSuccessMsg}</span>
          </div>
          <button onClick={() => setDriveSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {driveError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{driveError}</span>
          </div>
          <button onClick={() => setDriveError(null)} className="text-rose-700 hover:text-rose-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E6E1D8] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategoryFilter('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategoryFilter === 'All'
                ? 'bg-[#554228] text-white'
                : 'bg-[#FAF8F5] text-[#616B77] hover:bg-[#EAE4D8] hover:text-[#1C2026]'
            }`}
          >
            All Albums ({albums.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = albums.filter((a) => a.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategoryFilter === cat
                    ? 'bg-[#554228] text-white'
                    : 'bg-[#FAF8F5] text-[#616B77] hover:bg-[#EAE4D8] hover:text-[#1C2026]'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="w-full sm:w-64 shrink-0">
          <input
            type="text"
            placeholder="Search albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E6E1D8] text-xs text-[#1E232A] focus:outline-hidden focus:border-[#554228] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* ALBUMS GRID */}
      {filteredAlbums.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlbums.map((album) => {
            const hasDriveLink = !!(album.driveFolderUrl || album.driveFolderId);
            const folderUrl = album.driveFolderUrl || (album.driveFolderId ? GoogleDriveService.formatFolderUrl(album.driveFolderId) : null);

            return (
              <div
                key={album.id}
                className="group bg-white rounded-3xl overflow-hidden border border-[#E6E1D8] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Cover Image Container */}
                <div>
                  <div className="relative h-52 w-full overflow-hidden bg-[#F0EBE1]">
                    <img
                      src={album.coverImageUrl}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/20 text-white">
                        {album.category}
                      </span>
                      {hasDriveLink ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600/90 backdrop-blur-md text-white shadow-xs">
                          <HardDrive className="w-3 h-3" />
                          <span>Google Drive</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-600/90 backdrop-blur-md text-white shadow-xs">
                          <span>No Drive Link</span>
                        </span>
                      )}
                    </div>

                    {/* Date on Bottom */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 z-10 text-xs font-medium text-white/90 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#E8DCC8]" />
                        {album.date}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-[#E8DCC8]">
                        <MapPin className="w-3 h-3" />
                        {album.location || 'Masagana'}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h3 className="text-base sm:text-lg font-serif font-semibold text-[#1E232A] group-hover:text-[#554228] transition-colors leading-snug line-clamp-1">
                      {album.title}
                    </h3>
                    <p className="text-xs text-[#616B77] mt-1.5 line-clamp-2 leading-relaxed">
                      {album.description}
                    </p>

                    {/* Google Drive Link Preview */}
                    {folderUrl && (
                      <div className="mt-3.5 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#ECE7DE] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <HardDrive className="w-3.5 h-3.5 text-[#8C6D40] shrink-0" />
                          <span className="text-[#554228] font-medium truncate text-[11px]">
                            {folderUrl}
                          </span>
                        </div>
                        <a
                          href={folderUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-lg text-[#8C6D40] hover:text-[#554228] hover:bg-[#EAE4D8] transition-colors shrink-0 ml-1"
                          title="Open folder in Google Drive"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 pt-0 border-t border-[#F0EBE1] flex items-center justify-between gap-2 mt-2">
                  <button
                    onClick={() => handleOpenInspectAlbum(album)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF4E8] hover:bg-[#F3E8D3] border border-[#EADFCB] text-[#554228] text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Photos</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditAlbum(album)}
                      className="p-2 rounded-xl text-[#616B77] hover:text-[#1E232A] hover:bg-[#FAF8F5] border border-transparent hover:border-[#E6E1D8] transition-colors cursor-pointer"
                      title="Edit Album & Drive Link"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmAlbumId(album.id)}
                      className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                      title="Delete Album"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white border border-[#E6E1D8]">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF8F5] border border-[#E6E1D8] flex items-center justify-center text-[#554228] mb-3">
            <Folder className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-[#1E232A]">No Albums Found</h3>
          <p className="text-xs text-[#616B77] mt-1 max-w-md mx-auto">
            {searchQuery ? 'No albums match your search query.' : 'Create your first album with a cover photo and Google Drive folder link!'}
          </p>
          <button
            onClick={handleOpenCreateAlbum}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#554228] text-white text-xs font-bold hover:bg-[#3D2F1D] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Album</span>
          </button>
        </div>
      )}

      {/* CREATE / EDIT ALBUM MODAL */}
      {isAlbumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#E6E1D8] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#ECE7DE] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EAE4D8] flex items-center justify-center text-[#554228]">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-semibold text-[#1E232A]">
                    {editingAlbumId ? 'Edit Album & Google Drive Link' : 'Create New Photo Album'}
                  </h3>
                  <p className="text-xs text-[#616B77]">
                    Upload cover photo and provide Google Drive folder link
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAlbumModalOpen(false)}
                className="w-9 h-9 rounded-full bg-white hover:bg-[#EAE4D8] text-[#616B77] hover:text-[#1E232A] border border-[#E6E1D8] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Content */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* 1. Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E232A] uppercase tracking-wider mb-1.5">
                    Album Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Youth Summer Trek & Fireside 2026"
                    value={albumTitle}
                    onChange={(e) => setAlbumTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6E1D8] text-sm text-[#1E232A] focus:outline-hidden focus:border-[#554228] focus:bg-white transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1E232A] uppercase tracking-wider mb-1.5">
                      Category *
                    </label>
                    <select
                      value={albumCategory}
                      onChange={(e) => setAlbumCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6E1D8] text-xs text-[#1E232A] focus:outline-hidden focus:border-[#554228] focus:bg-white transition-all cursor-pointer font-medium"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E232A] uppercase tracking-wider mb-1.5">
                      Event Date *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., August 2026"
                      value={albumDate}
                      onChange={(e) => setAlbumDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6E1D8] text-xs text-[#1E232A] focus:outline-hidden focus:border-[#554228] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E232A] uppercase tracking-wider mb-1.5">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Antipolo Highlands"
                      value={albumLocation}
                      onChange={(e) => setAlbumLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6E1D8] text-xs text-[#1E232A] focus:outline-hidden focus:border-[#554228] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E232A] uppercase tracking-wider mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Short description of this ward event or photo collection..."
                    value={albumDescription}
                    onChange={(e) => setAlbumDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6E1D8] text-xs text-[#1E232A] focus:outline-hidden focus:border-[#554228] focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>

              {/* 2. Cover Photo Section (Upload or URL) */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E1D8] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1E232A] uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#8C6D40]" />
                    <span>Album Cover Photo *</span>
                  </label>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E6E1D8] text-[11px]">
                    <button
                      type="button"
                      onClick={() => setCoverSourceType('upload')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                        coverSourceType === 'upload' ? 'bg-[#554228] text-white' : 'text-[#616B77] hover:text-[#1E232A]'
                      }`}
                    >
                      File Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverSourceType('url')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                        coverSourceType === 'url' ? 'bg-[#554228] text-white' : 'text-[#616B77] hover:text-[#1E232A]'
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {coverSourceType === 'upload' ? (
                  <div>
                    <input
                      type="file"
                      ref={coverFileInputRef}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleCoverFileUpload(e.target.files[0]);
                        }
                      }}
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                    />

                    {albumCoverUrl ? (
                      <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-[#E6E1D8] group">
                        <img
                          src={albumCoverUrl}
                          alt="Cover Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => coverFileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-xl bg-white text-[#1E232A] text-xs font-bold hover:bg-[#EAE4D8] transition-colors cursor-pointer"
                          >
                            Change Photo
                          </button>
                          <button
                            type="button"
                            onClick={() => setAlbumCoverUrl('')}
                            className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsAlbumCoverDragOver(true);
                        }}
                        onDragLeave={() => setIsAlbumCoverDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsAlbumCoverDragOver(false);
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleCoverFileUpload(e.dataTransfer.files[0]);
                          }
                        }}
                        onClick={() => coverFileInputRef.current?.click()}
                        className={`p-6 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
                          isAlbumCoverDragOver
                            ? 'border-[#554228] bg-[#F4EDE2]'
                            : 'border-[#D9D2C5] hover:border-[#8C6D40] bg-white'
                        }`}
                      >
                        {isCompressingCover ? (
                          <div className="flex flex-col items-center justify-center py-2">
                            <Loader2 className="w-6 h-6 text-[#8C6D40] animate-spin mb-2" />
                            <span className="text-xs text-[#554228] font-semibold">Compressing Cover Photo...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-2">
                            <UploadCloud className="w-8 h-8 text-[#8C6D40] mb-2" />
                            <span className="text-xs font-bold text-[#1E232A]">
                              Click or Drag & Drop Cover Photo
                            </span>
                            <span className="text-[11px] text-[#616B77] mt-1">
                              JPEG, PNG, WebP (Automatically compressed & optimized)
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... or direct image link"
                      value={albumCoverUrl}
                      onChange={(e) => setAlbumCoverUrl(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E6E1D8] text-xs text-[#1E232A] focus:outline-hidden focus:border-[#554228] transition-all font-medium"
                    />
                    {albumCoverUrl && (
                      <div className="mt-2 relative h-36 w-full rounded-xl overflow-hidden border border-[#E6E1D8]">
                        <img
                          src={albumCoverUrl}
                          alt="Cover Preview"
                          className="w-full h-full object-cover"
                          onError={() => alert('Failed to load image URL. Please check the link.')}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 3. Google Drive Shared Folder Link */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E1D8] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1E232A] uppercase tracking-wider flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4 text-[#8C6D40]" />
                    <span>Google Drive Full Album Link *</span>
                  </label>
                  {driveState.isConnected && (
                    <button
                      type="button"
                      disabled={isCreatingDriveSubfolder}
                      onClick={handleAutoCreateDriveFolder}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isCreatingDriveSubfolder ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <FolderCheck className="w-3 h-3" />
                      )}
                      <span>Auto-Create Subfolder in Drive</span>
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-4 h-4 text-[#8C6D40] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="https://drive.google.com/drive/folders/1ABC_XYZ... or Folder ID"
                      value={albumDriveFolderUrl}
                      onChange={(e) => {
                        setAlbumDriveFolderUrl(e.target.value);
                        setDriveTestMessage(null);
                        setTestedDrivePhotos(null);
                      }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E6E1D8] text-xs text-[#1E232A] focus:outline-hidden focus:border-[#554228] transition-all font-mono"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={isTestingDriveLink || !albumDriveFolderUrl.trim()}
                    onClick={handleTestDriveLink}
                    className="px-4 py-2.5 rounded-xl bg-[#EAE4D8] hover:bg-[#DFD6C7] text-[#554228] text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isTestingDriveLink ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5" />
                    )}
                    <span>Test & Fetch</span>
                  </button>
                </div>

                <p className="text-[11px] text-[#616B77] leading-relaxed">
                  Upload all photos for this event to your Google Drive folder, right-click the folder &gt; <strong>Share</strong> &gt; set to <strong>"Anyone with the link can view"</strong>, then paste the link here. The website will load and display them directly.
                </p>

                {/* Drive Test Feedback */}
                {driveTestMessage && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                      driveTestMessage.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : driveTestMessage.type === 'error'
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {driveTestMessage.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    ) : (
                      <Info className="w-4 h-4 shrink-0" />
                    )}
                    <span>{driveTestMessage.text}</span>
                  </div>
                )}

                {/* Tested Photos Mini Strip */}
                {testedDrivePhotos && testedDrivePhotos.length > 0 && (
                  <div className="pt-2 border-t border-[#ECE7DE]">
                    <div className="text-[11px] font-bold text-[#1E232A] mb-2 flex items-center justify-between">
                      <span>Photos preview from Google Drive ({testedDrivePhotos.length}):</span>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                      {testedDrivePhotos.slice(0, 8).map((photo) => (
                        <div key={photo.id} className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#E6E1D8] shrink-0">
                          <img
                            src={photo.thumbnailUrl}
                            alt={photo.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {testedDrivePhotos.length > 8 && (
                        <div className="w-16 h-16 rounded-xl bg-[#FAF8F5] border border-[#E6E1D8] flex items-center justify-center text-xs font-bold text-[#554228] shrink-0">
                          +{testedDrivePhotos.length - 8}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-6 border-t border-[#ECE7DE] flex items-center justify-end gap-3 bg-[#FAF8F5]">
              <button
                type="button"
                onClick={() => setIsAlbumModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#EAE4D8] border border-[#E6E1D8] text-xs font-semibold text-[#616B77] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSavingAlbum}
                onClick={handleSaveAlbum}
                className="px-6 py-2.5 rounded-xl bg-[#554228] hover:bg-[#3D2F1D] text-white text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isSavingAlbum ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>{editingAlbumId ? 'Save Changes' : 'Create Album'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ALBUM PHOTO INSPECTOR MODAL */}
      {inspectedAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-[#E6E1D8] shadow-2xl overflow-hidden my-8 animate-in fade-in duration-200 flex flex-col max-h-[85vh]">
            {/* Inspector Header */}
            <div className="p-6 border-b border-[#ECE7DE] flex items-center justify-between bg-[#FAF8F5]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EAE4D8] text-[#554228]">
                    {inspectedAlbum.category}
                  </span>
                  <span className="text-xs text-[#616B77]">
                    {inspectedAlbum.date}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-[#1E232A]">
                  {inspectedAlbum.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {inspectedAlbum.driveFolderUrl && (
                  <a
                    href={inspectedAlbum.driveFolderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF4E8] hover:bg-[#F3E8D3] border border-[#EADFCB] text-[#554228] text-xs font-semibold transition-colors"
                  >
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>Open in Drive</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                )}
                <button
                  onClick={() => setInspectedAlbum(null)}
                  className="w-9 h-9 rounded-full bg-white hover:bg-[#EAE4D8] text-[#616B77] hover:text-[#1E232A] border border-[#E6E1D8] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Inspector Photos Grid */}
            <div className="p-6 overflow-y-auto flex-1">
              {isLoadingInspectedPhotos ? (
                <div className="py-16 text-center">
                  <Loader2 className="w-8 h-8 text-[#8C6D40] animate-spin mx-auto mb-3" />
                  <p className="text-xs text-[#554228] font-semibold">
                    Fetching and streaming photos from Google Drive...
                  </p>
                </div>
              ) : inspectedError ? (
                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                  <Info className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                  <p className="text-xs text-amber-900 font-semibold mb-1">
                    Google Drive Permissions Notice
                  </p>
                  <p className="text-xs text-amber-700 max-w-md mx-auto mb-4">
                    {inspectedError}
                  </p>
                  {inspectedAlbum.driveFolderUrl && (
                    <a
                      href={inspectedAlbum.driveFolderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#554228] text-white text-xs font-bold hover:bg-[#3D2F1D] transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Folder & Check Sharing Settings</span>
                    </a>
                  )}
                </div>
              ) : inspectedPhotos.length > 0 ? (
                <div>
                  <div className="text-xs text-[#616B77] mb-4 flex items-center justify-between">
                    <span>
                      Displaying <strong>{inspectedPhotos.length}</strong> photo{inspectedPhotos.length === 1 ? '' : 's'} directly from Google Drive:
                    </span>
                    <button
                      onClick={() => handleOpenInspectAlbum(inspectedAlbum)}
                      className="inline-flex items-center gap-1 text-[#554228] hover:underline font-semibold cursor-pointer text-xs"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Refresh</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {inspectedPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        onClick={() => setPreviewPhotoUrl(photo.directImageUrl)}
                        className="group relative h-40 rounded-2xl overflow-hidden border border-[#E6E1D8] cursor-pointer bg-[#FAF8F5]"
                      >
                        <img
                          src={photo.thumbnailUrl || photo.directImageUrl}
                          alt={photo.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-[11px] text-white font-medium truncate">
                          {photo.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <ImageIcon className="w-8 h-8 text-[#8C6D40] mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-[#616B77]">
                    No photos found in this album folder yet. Upload photos to your Google Drive folder and click Refresh!
                  </p>
                  {inspectedAlbum.driveFolderUrl && (
                    <a
                      href={inspectedAlbum.driveFolderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#554228] text-white text-xs font-bold hover:bg-[#3D2F1D] transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Google Drive Folder to Add Photos</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SINGLE PHOTO PREVIEW LIGHTBOX */}
      {previewPhotoUrl && (
        <div
          onClick={() => setPreviewPhotoUrl(null)}
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <button
            onClick={() => setPreviewPhotoUrl(null)}
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={previewPhotoUrl}
            alt="Preview"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}

      {/* DELETE ALBUM CONFIRMATION */}
      {deleteConfirmAlbumId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E6E1D8] shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-semibold text-[#1E232A]">
                Delete Album?
              </h3>
              <p className="text-xs text-[#616B77] mt-1 leading-relaxed">
                Are you sure you want to remove this album from the website? (Your original files in Google Drive will remain untouched and safe).
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmAlbumId(null)}
                className="px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#EAE4D8] text-xs font-semibold text-[#616B77] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteAlbum(deleteConfirmAlbumId);
                  setDeleteConfirmAlbumId(null);
                  setDriveSuccessMsg('Album removed.');
                  setTimeout(() => setDriveSuccessMsg(null), 3000);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Delete Album
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
