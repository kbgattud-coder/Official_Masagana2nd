import { Announcement, GalleryItem, HistoryMilestone, BlogPost, ComeFollowMeLesson } from '../types';

export const WARD_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Ward Fellowship Salu-Salo & Family Sports Day',
    category: 'Ward Activities',
    date: 'Saturday, August 22, 2026',
    time: '3:00 PM – 7:00 PM',
    location: 'Masagana Chapel Cultural Hall & Grounds',
    description: 'Join our ward family for an afternoon of friendly basketball and volleyball games, traditional Pinoy parlor games for the Primary children, and a potluck salu-salo dinner. Families please coordinate food assignments with your Relief Society or Elders Quorum leaders.',
    contactPerson: 'Brother Ramon & Sister Joy Santos',
    isPinned: true,
    actionText: 'View Food Assignments',
    actionUrl: '#salu-salo',
  },
  {
    id: 'ann-2',
    title: 'Antipolo Community Tree Planting & River Clean-Up',
    category: 'Service & Welfare',
    date: 'Saturday, August 29, 2026',
    time: '6:30 AM – 10:30 AM',
    location: 'Hinulugang Taktak Protected Landscape & Watershed',
    description: 'All members, youth, and friends are invited to wear Helping Hands vests and bring gardening gloves. We will plant 200 fruit-bearing saplings to help preserve our local Antipolo watershed and clear pathway debris.',
    contactPerson: 'Brother Mateo Dela Cruz',
    isPinned: true,
    actionText: 'Join Volunteer List',
    actionUrl: '#clean-up',
  },
  {
    id: 'ann-3',
    title: 'Antipolo Stake Youth Conference & Devotional',
    category: 'Stake Activities',
    date: 'Friday – Saturday, September 4–5, 2026',
    time: 'Starts 7:00 AM Friday',
    location: 'Antipolo Stake Center, Sumulong Highway',
    description: 'Youth ages 11 to 18 across all wards in Antipolo Stake will gather for workshops, outdoor service, testimony meeting, and a cultural talent showcase. Registration forms must be submitted to ward youth advisors.',
    contactPerson: 'Brother Sam Navarro (YM) & Sister Camille Reyes (YW)',
    isPinned: false,
  },
  {
    id: 'ann-4',
    title: 'Relief Society Livelihood & Self-Reliance Workshop',
    category: 'Relief Society',
    date: 'Thursday, September 10, 2026',
    time: '6:30 PM',
    location: 'Relief Society Room, Masagana Chapel',
    description: 'An interactive workshop on home food preservation, basic home budgeting, and micro-enterprise skills. Come learn together and share family tips.',
    contactPerson: 'President Grace Bautista',
    isPinned: false,
  },
  {
    id: 'ann-5',
    title: 'Primary Children’s Musical Rehearsal & Activity',
    category: 'Primary',
    date: 'Sunday, September 13, 2026',
    time: '10:15 AM (During 2nd Hour)',
    location: 'Primary Room',
    description: 'Practice for the upcoming Annual Primary Sacrament Meeting Presentation. Parents please help children review the song verses at home.',
    contactPerson: 'Sister Maria Alcantara (Primary President)',
    isPinned: false,
  },
  {
    id: 'ann-6',
    title: 'Elders Quorum Emergency Preparedness Drill',
    category: 'Elders Quorum',
    date: 'Saturday, September 19, 2026',
    time: '8:00 AM – 11:00 AM',
    location: 'Masagana Chapel Parking Area',
    description: 'Practical training on 72-hour family emergency kits, typhoon preparedness, first-aid basics, and ward communication tree verification.',
    contactPerson: 'President Carlo Mendoza',
    isPinned: false,
  },
  {
    id: 'ann-7',
    title: 'Ward Temple Day to the Manila / Antipolo Temple',
    category: 'Temple & Family History',
    date: 'Saturday, September 26, 2026',
    time: 'Depart Chapel 6:30 AM',
    location: 'Antipolo Philippines Temple / Manila Temple',
    description: 'Ward temple excursions are scheduled for youth baptisms and endowment sessions. Ward van transport is available from the chapel. Please confirm appointments with Brother Gregory Cruz.',
    contactPerson: 'Brother Gregory Cruz',
    isPinned: false,
  },
  {
    id: 'ann-8',
    title: 'Full-Time Missionaries Dinner & Teaching Appointments',
    category: 'Missionary',
    date: 'Weekly Calendar',
    time: '5:30 PM Dinners',
    location: 'Member Homes / Chapel',
    description: 'Elder Garcia and Elder Villanueva are grateful for dinner appointments and invitations to share messages of the restored gospel with families and friends in Masagana.',
    contactPerson: 'Ward Mission Leader: Brother Daniel Ocampo',
    isPinned: false,
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    albumId: 'alb-2',
    title: 'Antipolo Foothills Youth Trail & Fireside',
    category: 'Youth',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
    date: 'July 2026',
    caption: 'Our Masagana youth on an early morning hike in the scenic Rizal highlands for sunrise devotional.',
    location: 'Antipolo Mountain Trail',
    submittedBy: 'Brother Navarro',
  },
  {
    id: 'gal-2',
    albumId: 'alb-3',
    title: 'Elders Quorum Community Watershed Planting',
    category: 'Elders Quorum',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop',
    date: 'August 2026',
    caption: 'Elders Quorum brothers and families planting trees along the mountain slope in partnership with local barangay leaders.',
    location: 'Antipolo Rizal Greens',
    submittedBy: 'Elders Quorum Presidency',
  },
  {
    id: 'gal-3',
    albumId: 'alb-4',
    title: 'Primary Children’s Art & Scripture Showcase',
    category: 'Primary',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22510?q=80&w=800&auto=format&fit=crop',
    date: 'April 2026',
    caption: 'Children displaying their illustrated Book of Mormon stories and gratitude cards with Primary leaders.',
    location: 'Primary Classroom Wing',
    submittedBy: 'Primary Presidency',
  },
  {
    id: 'gal-4',
    albumId: 'alb-1',
    title: 'Annual Ward Salu-Salo & Volleyball Tourney',
    category: 'Ward Activities',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800&auto=format&fit=crop',
    date: 'June 2026',
    caption: 'Fellowship, hearty meals, and cheerful games among families in the cultural hall.',
    location: 'Cultural Hall Grounds',
    submittedBy: 'Activities Committee',
  },
  {
    id: 'gal-5',
    albumId: 'alb-5',
    title: 'Antipolo Stake Conference & Multi-Ward Choir',
    category: 'Stake',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    date: 'May 2026',
    caption: 'Antipolo Philippines Stake conference gathering with sacred musical numbers and inspiring messages.',
    location: 'Antipolo Stake Center',
    submittedBy: 'Stake Presidency',
  },
  {
    id: 'gal-6',
    albumId: 'alb-6',
    title: 'Relief Society Ministering & Homemaking Workshop',
    category: 'Relief Society',
    imageUrl: 'https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?q=80&w=800&auto=format&fit=crop',
    date: 'August 2026',
    caption: 'Relief Society sisters gathering for food preparation, emergency preparedness, and sisterhood fellowship.',
    location: 'Relief Society Room',
    submittedBy: 'Relief Society Presidency',
  }
];

export const HISTORY_MILESTONES: HistoryMilestone[] = [
  {
    id: 'milestone-1',
    date: '10 Mar 1991',
    year: '1991',
    title: 'Creation of Masagana 2nd Branch',
    category: 'Branch Era',
    description: 'Created from the division of Antipolo 2nd Branch with 153 members of record and an average attendance of 52 (34% activity).',
    leadership: {
      presidingRole: 'Branch President',
      leader: 'M. Mendez',
      counselor1: 'A. Santa Clara',
      counselor2: 'L. Campos Jr.',
    },
    statistics: {
      members: '153 Members of Record',
      attendance: '52 Average Attendance',
      activityRate: '34% Activity Rate'
    }
  },
  {
    id: 'milestone-2',
    date: '23 May 1993',
    year: '1993',
    title: 'Branch Reorganization',
    category: 'Branch Era',
    description: 'Reorganized following the transfer of M. Mendez to the province. President M. Mendez served 2 years (1991–1993) as the initial branch president. Membership grew to approximately 200 with an average attendance of 50 (25% activity).',
    leadership: {
      presidingRole: 'Branch President',
      leader: 'A. Ardon',
      counselor1: 'D. Madarang (later succeeded by L. Campos Jr.)',
      counselor2: 'L. Campos Jr. (later succeeded by Z. Mendez)',
      notes: 'President M. Mendez served 2 years (1991–1993) prior to this reorganization. Counselors were subsequently called in succession.'
    },
    statistics: {
      members: '~200 Members of Record',
      attendance: '50 Average Attendance',
      activityRate: '25% Activity Rate'
    }
  },
  {
    id: 'milestone-3',
    date: '30 Aug 1997',
    year: '1997',
    title: 'Transition to Ward Status',
    category: 'Ward Organization',
    description: 'Masagana 2nd Branch was designated as Masagana 2nd Ward in conjunction with the creation of the Antipolo Philippines Stake, operating under existing leadership pending official approval.',
    keyNote: 'Designated as a ward under existing leadership during the initial creation of the Antipolo Philippines Stake.'
  },
  {
    id: 'milestone-4',
    date: '14 Dec 1997',
    year: '1997',
    title: 'Official Ward Organization',
    category: 'Ward Organization',
    description: 'Official approval received to organize the ward. Unit record showed 292 members with attendance averaging 125 (42% activity).',
    leadership: {
      presidingRole: 'Bishop',
      leader: 'A. Ardon',
      counselor1: 'Z. Mendez',
      counselor2: 'E. Omadto',
    },
    statistics: {
      members: '292 Members of Record',
      attendance: '125 Average Attendance',
      activityRate: '42% Activity Rate'
    }
  },
  {
    id: 'milestone-5',
    date: '23 Feb 2003',
    year: '2003',
    title: 'Bishopric Reorganization',
    category: 'Bishopric',
    description: 'E. Omadto was released due to relocating to Sta. Cruz, Laguna.',
    leadership: {
      presidingRole: 'Bishop',
      leader: 'A. Ardon',
      counselor1: 'Z. Mendez',
      counselor2: 'D. Lao',
      notes: 'D. Lao sustained as 2nd Counselor following the relocation of Brother E. Omadto.'
    }
  },
  {
    id: 'milestone-6',
    date: '21 Dec 2003',
    year: '2003',
    title: 'Meetinghouse Renovation Relocation',
    category: 'Facility & Dedication',
    description: 'The ward temporarily moved meetings to the Antipolo Stake Center while the original S-120 meetinghouse underwent renovations and air conditioning installation. The congregation returned to the building in October 2004.',
    keyNote: 'Temporary relocation to Antipolo Stake Center during comprehensive facility upgrades and AC installation.'
  },
  {
    id: 'milestone-7',
    date: '12 Dec 2004',
    year: '2004',
    title: 'Meetinghouse Dedication',
    category: 'Facility & Dedication',
    description: 'Dedication service held for the renovated Masagana meetinghouse. Elder R. J. Maynes of the Area Presidency presided over the combined Masagana 1st and 2nd Ward sacrament meeting and offered the dedicatory prayer.',
    keyNote: 'Elder R. J. Maynes of the Area Presidency offered the dedicatory prayer in a combined sacrament meeting.'
  },
  {
    id: 'milestone-8',
    date: '18 Mar 2007',
    year: '2007',
    title: 'Departure of D. Lao',
    category: 'Milestone',
    description: 'D. Lao and his family observed their final Sunday prior to emigrating to the United States.',
    keyNote: 'Recognized for faithful service and dedication in the bishopric prior to relocating abroad.'
  },
  {
    id: 'milestone-9',
    date: '26 Aug 2007',
    year: '2007',
    title: 'Bishopric Reorganization (Bishop Z. Mendez)',
    category: 'Bishopric',
    description: 'A. Ardon was released after serving 14 consecutive years as branch president and bishop (1993–2007). Bishop Z. Mendez was sustained to preside over the ward.',
    leadership: {
      presidingRole: 'Bishop',
      leader: 'Z. Mendez',
      counselor1: 'A. R. Reyes',
      counselor2: 'R. Benedicto (later succeeded by G. Gattud)',
      notes: 'Previous Bishop A. Ardon completed 14 consecutive years of presiding service (1993–2007) before being released.'
    }
  },
  {
    id: 'milestone-10',
    date: '2012 – 2018',
    year: '2012',
    title: 'Bishopric Reorganization (Bishop E. A. Brillantes)',
    category: 'Bishopric',
    description: 'Bishopric reorganized with E. A. Brillantes called as Bishop. Previous Bishop Z. Mendez served for 5 years (2007–2012) prior to this reorganization.',
    leadership: {
      presidingRole: 'Bishop',
      leader: 'E. A. Brillantes',
      counselor1: 'I. Aguiton',
      counselor2: 'R. Castro / M. Jacob',
      notes: 'Previous Bishop Z. Mendez served for 5 years (2007–2012) before being released.'
    }
  },
  {
    id: 'milestone-11',
    date: '2019 – 2022',
    year: '2019',
    title: 'Bishopric Reorganization (Bishop J. Barong)',
    category: 'Bishopric',
    description: 'Bishopric reorganized with J. Barong called as Bishop. Previous Bishop E. A. Brillantes served for 6 years (2012–2018) prior to this reorganization.',
    leadership: {
      presidingRole: 'Bishop',
      leader: 'J. Barong',
      counselor1: 'J. Buenavista',
      counselor2: 'R. Pamittan',
      notes: 'Previous Bishop E. A. Brillantes served for 6 years (2012–2018) before being released.'
    }
  },
  {
    id: 'milestone-12',
    date: 'May 2022 – Present',
    year: '2022',
    title: 'Bishopric Reorganization (Bishop F. Reyes)',
    category: 'Bishopric',
    description: 'Current bishopric reorganized in May 2022 with F. Reyes called as Bishop. Previous Bishop J. Barong served for 3 years (2019–2022) prior to this reorganization.',
    leadership: {
      presidingRole: 'Bishop',
      leader: 'F. Reyes',
      counselor1: 'J. Albos',
      counselor2: 'A. Ardon',
      notes: 'Previous Bishop J. Barong served for 3 years (2019–2022) before being released. Bishop F. Reyes currently presides over Masagana 2nd Ward.'
    }
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Finding Peace and Direction in Daily Scripture Study',
    subtitle: 'Practical guidance on keeping Christ at the center of our homes amidst busy daily schedules in Rizal.',
    author: {
      name: 'Bishop Francisco Reyes',
      role: 'Bishop, Masagana 2nd Ward',
      avatarUrl: '',
    },
    date: 'August 12, 2026',
    readingTime: '4 min read',
    category: 'Messages from the Bishopric',
    imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=1200&auto=format&fit=crop',
    scriptureReference: '2 Nephi 32:3 & D&C 88:119',
    featured: true,
    content: [
      'In the midst of long daily commutes, school obligations, and family responsibilities, it can be easy to let spiritual stillness slip away. Yet the scriptures remind us: "Feast upon the words of Christ; for behold, the words of Christ will tell you all things what ye should do."',
      'The Bishopric invites every family and individual in Masagana 2nd Ward to establish a 10-minute daily devotion. Open the Come, Follow Me guide, read a few verses together, and offer a prayer of gratitude.',
      'As we bring the Savior’s teachings into our everyday conversations, our homes become sanctuaries of protection, guidance, and abiding peace.'
    ]
  },
  {
    id: 'post-2',
    title: 'Bayanihan in Christ: Ministering with Sincere Love',
    subtitle: 'How simple check-ins and shared meals reflect the pure love of Christ in our neighborhood.',
    author: {
      name: 'Sister Grace Bautista',
      role: 'Relief Society President',
      avatarUrl: '',
    },
    date: 'August 6, 2026',
    readingTime: '3 min read',
    category: 'Relief Society',
    imageUrl: 'https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?q=80&w=1200&auto=format&fit=crop',
    scriptureReference: 'Mosiah 18:8-9',
    featured: false,
    content: [
      'The Filipino spirit of bayanihan is naturally aligned with the gospel principle of ministering. When we mourn with those that mourn and comfort those that stand in need of comfort, we are doing the work of the Savior.',
      'Ministering does not need to be complicated. A kind text message, sending warm food to a sick neighbor, or offering a ride to church makes an eternal difference. Let us be sensitive to the Spirit’s promptings to reach out.'
    ]
  },
  {
    id: 'post-3',
    title: 'Youth Reflections: Preparing for Temple & Missionary Service',
    subtitle: 'Masagana youth share their experiences preparing to serve full-time missions across the globe.',
    author: {
      name: 'Brother Joshua & Sister Leah',
      role: 'Ward Youth Representatives',
      avatarUrl: '',
    },
    date: 'July 30, 2026',
    readingTime: '4 min read',
    category: 'Youth',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop',
    scriptureReference: 'Alma 37:37',
    featured: false,
    content: [
      'Preparing to serve a mission starts right here in our ward. When we attend seminary early in the morning, participate in Sunday classes, and go out with the full-time missionaries, our testimonies grow strong.',
      'We invite all youth in Masagana 2nd Ward to set spiritual goals, visit the temple regularly, and share the joy of the gospel with our school friends.'
    ]
  }
];

export const COME_FOLLOW_ME_CURRICULUM: ComeFollowMeLesson = {
  week: 'Agosto 10–16, 2026',
  dateRange: 'Lumang Tipan 2026 (Old Testament)',
  title: '“Nalalaman Ko na ang Aking Manunubos ay Nabubuhay”',
  scriptures: 'Job 1–3; 12–14; 19; 21–24; 38–40; 42',
  readingSnippet: '“Sapagkat nalalaman ko na ang aking Manunubos ay nabubuhay, at sa kahulihan ay tatayo siya sa ibabaw ng lupa: At pagkatapos na mawasak ang aking balat, gayon ma’y makikita ko ang Dios sa aking laman.” (Job 19:25–26)',
  familyPrompt: 'Paano natin mapapanatili ang ating pananampalataya kay Jesucristo at magtiwala sa Kanya sa panahon ng matitinding pagsubok, tulad ng ginawa ni Job? Pag-usapan bilang pamilya kung paano nagdudulot ng kapayapaan at pag-asa ang patotoo na ang ating Tagapagligtas ay buhay.'
};

export const VIDEO_HERO_PLAYLIST = [
  {
    id: 'sanctuary-morning',
    title: 'Masagana Chapel & Morning Light',
    subtitle: 'A place of sacred worship and peaceful prayer in Antipolo',
    src: 'https://pub-5497f73b6290403fb534fbb3f47ef636.r2.dev/root/Clouds_drifting_behind_church_st%E2%80%A6_202608161412.mp4',
    poster: '/masagana_chapel_sunset.svg',
  },
  {
    id: 'antipolo-hills',
    title: 'Antipolo Hills & Sunrise',
    subtitle: 'Morning golden rays touching the lush Rizal valley',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    fallbackSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    poster: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'community-joy',
    title: 'Fellowship & Community Unity',
    subtitle: 'Families gathering and sharing faith in Masagana',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    fallbackSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    poster: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1600&auto=format&fit=crop',
  }
];
