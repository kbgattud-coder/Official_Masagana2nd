export interface SacramentProgram {
  date: string;
  theme: string;
  presiding: string;
  conducting: string;
  organist: string;
  chorister: string;
  openingHymn: { number: number; title: string };
  invocation: string;
  wardBusiness: string;
  sacramentHymn: { number: number; title: string };
  youthSpeaker: { name: string; topic: string };
  speaker1: { name: string; topic: string };
  intermediateMusic?: { title: string; performer: string };
  closingSpeaker: { name: string; topic: string };
  closingHymn: { number: number; title: string };
  benediction: string;
}

export type AnnouncementCategory = 
  | 'Ward Activities'
  | 'Stake Activities'
  | 'Relief Society'
  | 'Elders Quorum'
  | 'Youth (YM/YW)'
  | 'Primary'
  | 'Service & Welfare'
  | 'Temple & Family History'
  | 'Missionary';

export interface Announcement {
  id: string;
  title: string;
  category: AnnouncementCategory;
  date: string;
  time?: string;
  location?: string;
  description: string;
  contactPerson?: string;
  contactEmail?: string;
  isPinned?: boolean;
  actionUrl?: string;
  actionText?: string;
  createdAt?: string;
}

export interface Album {
  id: string;
  title: string;
  category: 'Ward Activities' | 'Stake' | 'Youth' | 'Relief Society' | 'Elders Quorum' | 'Primary' | 'Community';
  description: string;
  coverImageUrl: string;
  date: string;
  location?: string;
  itemCount?: number;
  driveFolderId?: string;
  driveFolderUrl?: string;
  drivePhotos?: GalleryItem[];
  createdAt?: string;
}

export interface GalleryItem {
  id: string;
  albumId?: string;
  title: string;
  category: 'Ward Activities' | 'Stake' | 'Youth' | 'Relief Society' | 'Elders Quorum' | 'Primary' | 'Community';
  imageUrl: string;
  thumbnailUrl?: string;
  date: string;
  caption: string;
  location: string;
  submittedBy?: string;
  driveFileId?: string;
  driveFileUrl?: string;
  createdAt?: string;
}

export interface HistoryMilestone {
  id: string;
  date: string;
  year: string;
  title: string;
  category: 'Branch Era' | 'Ward Organization' | 'Bishopric' | 'Facility & Dedication' | 'Milestone';
  description: string;
  leadership?: {
    presidingRole: 'Branch President' | 'Bishop';
    leader: string;
    counselor1?: string;
    counselor2?: string;
    notes?: string;
  };
  statistics?: {
    members?: string;
    attendance?: string;
    activityRate?: string;
  };
  keyNote?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  author: {
    name: string;
    role: string;
    avatarUrl: string;
  };
  date: string;
  readingTime: string;
  category: 'Messages from the Bishopric' | 'Sacrament Talk Spotlight' | 'Missionary Letters' | 'Youth' | 'Primary' | 'Relief Society' | 'Elders Quorum' | 'Ward Activities' | 'Temple & Family History' | 'Ward News';
  imageUrl: string;
  content: string[];
  richHtml?: string;
  galleryImages?: string[];
  scriptureReference?: string;
  featured?: boolean;
  status?: 'published' | 'draft';
  tags?: string[];
  createdAt?: string;
}

export interface AdminUser {
  email: string;
  name: string;
  role: 'admin' | 'superadmin';
  avatarUrl?: string;
  lastLogin?: string;
}

export interface LeaderContact {
  role: string;
  name: string;
  phone: string;
  email: string;
  hours?: string;
  notes?: string;
}

export interface Hymn {
  number: number;
  title: string;
  author: string;
  tune: string;
  category: string;
  lyrics: string[];
}

export interface ComeFollowMeLesson {
  week: string;
  dateRange: string;
  title: string;
  scriptures: string;
  readingSnippet: string;
  familyPrompt: string;
}
