export interface PersonInfo {
  fullName: string;
  shortName: string;
  photoUrl: string;
  fatherName: string;
  motherName: string;
  instagram?: string;
  bio?: string;
}

export interface EventDetail {
  title: string;
  dateStr: string; // e.g., "Sabtu, 14 November 2026"
  timeStr: string; // e.g., "08:00 - 10:00 WIB"
  locationName: string;
  locationAddress: string;
  mapsUrl: string;
  mapsEmbedUrl?: string;
  notes?: string;
}

export interface LoveStoryItem {
  year: string;
  title: string;
  description: string;
  icon: string;
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  logo?: string;
}

export interface RsvpItem {
  id: string;
  name: string;
  attendance: 'hadir' | 'tidak_hadir';
  guestCount: number;
  message: string;
  createdAt: string;
}

export interface GalleryPhoto {
  src: string;
  caption: string;
  category?: string;
}

export interface InvitationConfig {
  groom: PersonInfo;
  bride: PersonInfo;
  eventDate: Date;
  akad: EventDetail;
  reception: EventDetail;
  loveStory: LoveStoryItem[];
  bankAccounts: BankAccount[];
  qrisImageUrl: string;
  gallery: GalleryPhoto[];
  quranVerse?: {
    arabic: string;
    translation: string;
    surah: string;
  };
}
