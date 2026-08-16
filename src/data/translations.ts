export type Language = 'en' | 'tl';

export interface Translations {
  nav: {
    brandSubtitle: string;
    bulletin: string;
    curriculum: string;
    gallery: string;
    blog: string;
    history: string;
    language: string;
  };
  hero: {
    stakeBadge: string;
    title: string;
    description: string;
    viewBulletin: string;
    exploreGallery: string;
    blinkingSacrament: string;
    yearsHeritage: string;
    heritageSub: string;
    aboutTitle: string;
    aboutText: string;
    aboutAction: string;
    scheduleTitle: string;
    sacramentTime: string;
    sundaySchoolTime: string;
    chapelLocation: string;
    weeklyAnnouncementsBtn: string;
  };
  bulletin: {
    badge: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    pinnedBadge: string;
    downloadIcs: string;
    allCategory: string;
  };
  cfm: {
    badge: string;
    title: string;
    subtitle: string;
    openManualBtn: string;
    manualUrl: string;
    lessonUrl: string;
    focusBadge: string;
    scripturesLabel: string;
    familyDiscussionTitle: string;
    availableBadge: string;
    readFullLessonBtn: string;
    portalCardBadge: string;
    portalCardTitle: string;
    portalCardDesc: string;
    portalCardLinkText: string;
    appCardBadge: string;
    appCardTitle: string;
    appCardDesc: string;
    scripturesCardBadge: string;
    scripturesCardTitle: string;
    scripturesCardDesc: string;
    scripturesCardLinkText: string;
    week: string;
    dateRange: string;
    lessonTitle: string;
    scriptures: string;
    readingSnippet: string;
    familyPrompt: string;
    familyPromptGeneric: string;
  };
  gallery: {
    badge: string;
    title: string;
    subtitle: string;
    allCategory: string;
    photoLabel: string;
    viewFullBtn: string;
    close: string;
    backToAlbums: string;
    viewAlbum: string;
    photosCount: string;
    albumsCount: string;
    emptyAlbum: string;
  };
  blog: {
    badge: string;
    title: string;
    subtitle: string;
    allCategory: string;
    readArticle: string;
    readAloud: string;
    stopReading: string;
    reflectionAndComments: string;
    leaveComment: string;
    commentPlaceholder: string;
    postComment: string;
    close: string;
  };
  history: {
    badge: string;
    title: string;
    subtitle: string;
    yearsPill: string;
    establishedYear: string;
    filterAll: string;
    filterBranch: string;
    filterWard: string;
    filterBishopric: string;
    filterFacility: string;
    filterMilestones: string;
    bishopsWallTitle: string;
    bishopsWallSubtitle: string;
    servingYears: string;
    currentBishopBadge: string;
    leadershipLabel: string;
    presidingLeader: string;
    firstCounselor: string;
    secondCounselor: string;
    keyNoteLabel: string;
    milestoneCount: string;
    milestoneFocus: string;
    fullTimeline: string;
  };
  footer: {
    invitationText: string;
    sacramentSchedule: string;
    visitorsWelcome: string;
    navigationHeading: string;
    links: {
      home: string;
      bulletin: string;
      curriculum: string;
      gallery: string;
      blog: string;
      history: string;
    };
    meetinghouseHeading: string;
    chapelName: string;
    chapelAddress: string;
    genealogyLabel: string;
    disclaimer: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      brandSubtitle: 'Antipolo Philippines Stake',
      bulletin: 'Bulletin',
      curriculum: 'Come, Follow Me',
      gallery: 'Gallery',
      blog: 'Talks & Articles',
      history: 'Our History',
      language: 'Language',
    },
    hero: {
      stakeBadge: 'Antipolo Philippines Stake',
      title: 'Masagana 2nd Ward',
      description: 'A Christ-centered congregation dedicated to worship, sincere fellowship, and loving community service in Antipolo, Rizal.',
      viewBulletin: 'View Bulletin & Updates',
      exploreGallery: 'Explore Gallery',
      blinkingSacrament: 'Sacrament Meeting • Sunday 9:00 AM',
      yearsHeritage: 'Years in Antipolo',
      heritageSub: 'Faithful heritage est. 1991 in Rizal',
      aboutTitle: 'About Our Ward',
      aboutText: 'We gather each Sabbath in Antipolo to renew covenants, worship Jesus Christ, and strengthen families in joyful unity and faith.',
      aboutAction: 'Read our 1991–Present history',
      scheduleTitle: 'Sunday Schedule',
      sacramentTime: '9:00 AM Sacrament Meeting',
      sundaySchoolTime: '10:00 AM Sunday School / Classes',
      chapelLocation: 'Masagana Chapel, Antipolo, Rizal',
      weeklyAnnouncementsBtn: 'Weekly Announcements',
    },
    bulletin: {
      badge: 'Weekly Updates & Calendar',
      title: 'Ward Bulletin Board',
      subtitle: 'Stay informed on upcoming activities, service projects, youth conferences, and Sunday meetings.',
      searchPlaceholder: 'Search announcements, youth activities, service projects, or locations...',
      pinnedBadge: 'Pinned',
      downloadIcs: 'Save to Calendar (.ics)',
      allCategory: 'All',
    },
    cfm: {
      badge: 'Spiritual Study & Family Curriculum',
      title: 'Weekly Curriculum: Come, Follow Me',
      subtitle: 'Home-centered, Church-supported gospel study for individuals and families in Masagana 2nd Ward.',
      openManualBtn: 'Open Old Testament 2026 Manual',
      manualUrl: 'https://www.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026?lang=eng',
      lessonUrl: 'https://www.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026/34?lang=eng',
      focusBadge: 'Old Testament 2026 • Come, Follow Me',
      scripturesLabel: 'Scriptures',
      familyDiscussionTitle: 'Family Discussion & Reflection in Masagana',
      availableBadge: 'Available in English and Tagalog on ChurchofJesusChrist.org',
      readFullLessonBtn: 'Read Full Lesson in English',
      portalCardBadge: 'Old Testament 2026',
      portalCardTitle: 'Old Testament 2026 (English Manual)',
      portalCardDesc: 'Come, Follow Me study manual for Home and Church: For Individuals and Families, Sunday School, Primary, and Aaronic Priesthood / Young Women.',
      portalCardLinkText: 'ChurchofJesusChrist.org',
      appCardBadge: 'Mobile App',
      appCardTitle: 'Download Gospel Library App',
      appCardDesc: 'Highlight scriptures, write notes, listen to audio narration, and sync study progress across devices.',
      scripturesCardBadge: 'Church Scripture Tools',
      scripturesCardTitle: 'Standard Works & Study Aids',
      scripturesCardDesc: 'Read the Holy Bible, Book of Mormon, Doctrine and Covenants, and Pearl of Great Price with footnotes and topical guides.',
      scripturesCardLinkText: 'Explore Scriptures',
      week: 'August 17–23, 2026',
      dateRange: 'Old Testament 2026 (Psalms)',
      lessonTitle: '“The Lord Is My Shepherd”',
      scriptures: 'Psalms 1–2; 8; 19–33; 40; 46',
      readingSnippet: '“The Lord is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul.” (Psalm 23:1–3)',
      familyPrompt: 'When have we felt the Savior watching over our family the way a shepherd watches over his sheep? Discuss as a family what it means to follow Him with trust, and how the peace described in Psalm 23 can fill our home this week.',
      familyPromptGeneric: 'Read this week\'s chapters together as a family and share what stands out to each of you. Discuss how these passages point us to the Savior and what you feel invited to do this week.'
    },
    gallery: {
      badge: 'Fellowship & Moments',
      title: 'Community Photo Gallery',
      subtitle: 'Capturing moments of worship, youth service, family fellowship, and stake gatherings in Rizal.',
      allCategory: 'All',
      photoLabel: 'Photo',
      viewFullBtn: 'View High-Res Photo',
      close: 'Close',
      backToAlbums: 'Back to Albums',
      viewAlbum: 'View Album',
      photosCount: 'Photos',
      albumsCount: 'Albums',
      emptyAlbum: 'No photos uploaded to this album yet.',
    },
    blog: {
      badge: 'Gospel Messages & Insights',
      title: 'Talks & Articles',
      subtitle: 'Inspiring messages, sacrament talks, Relief Society lessons, and member reflections.',
      allCategory: 'All',
      readArticle: 'Read Full Article',
      readAloud: 'Listen (Audio Narration)',
      stopReading: 'Stop Audio',
      reflectionAndComments: 'Member Reflections & Notes',
      leaveComment: 'Share a spiritual takeaway or testimony...',
      commentPlaceholder: 'Write an encouraging thought or reflection for the ward...',
      postComment: 'Post Reflection',
      close: 'Close',
    },
    history: {
      badge: 'Preserving Sacred History',
      title: 'Masagana 2nd Ward History',
      subtitle: 'Chronicle of growth, faith, and leadership succession from 1991 to the present day in Antipolo, Rizal.',
      yearsPill: '1991 – Present',
      establishedYear: '35+ Years of Faith in Rizal',
      filterAll: 'All Milestones',
      filterBranch: 'Branch Era',
      filterWard: 'Ward Organization',
      filterBishopric: 'Bishoprics',
      filterFacility: 'Facility & Chapel',
      filterMilestones: 'Key Milestones',
      bishopsWallTitle: 'Presiding Leadership Succession',
      bishopsWallSubtitle: 'Honoring the faithful servants who have presided over Masagana 2nd Branch & Ward since 1991.',
      servingYears: 'Serving Period',
      currentBishopBadge: 'Current Presiding Bishop',
      leadershipLabel: 'Presidency & Counselors',
      presidingLeader: 'Presiding Leader',
      firstCounselor: '1st Counselor',
      secondCounselor: '2nd Counselor',
      keyNoteLabel: 'Historical Record',
      milestoneCount: 'Milestones Documented',
      milestoneFocus: 'Milestone Focus',
      fullTimeline: 'Full Chronicle View',
    },
    footer: {
      invitationText: 'We warmly invite you, your family, and neighbors to worship with us every Sunday in Antipolo. Experience the peace and friendship of a community centered in Jesus Christ.',
      sacramentSchedule: 'Sunday Sacrament: 9:00 AM',
      visitorsWelcome: 'Visitors Always Welcome',
      navigationHeading: 'Navigation',
      links: {
        home: 'Masagana 2nd Ward Home',
        bulletin: 'Ward Bulletin & Calendar',
        curriculum: 'Weekly Curriculum (Come, Follow Me)',
        gallery: 'Community Gallery',
        blog: 'Talks & Articles',
        history: 'Ward History (1991–Present)',
      },
      meetinghouseHeading: 'Meetinghouse Location',
      chapelName: 'Masagana Chapel',
      chapelAddress: 'Antipolo City, Rizal, Philippines',
      genealogyLabel: 'Genealogy',
      disclaimer: 'This website serves as an informational digital hub for members and friends of the local Masagana 2nd Ward, Antipolo Philippines Stake.',
    }
  },
  tl: {
    nav: {
      brandSubtitle: 'Antipolo Philippines Stake',
      bulletin: 'Pahayagan',
      curriculum: 'Pumarito Ka, Sumunod Ka',
      gallery: 'Galerya',
      blog: 'Mga Mensahe at Artikulo',
      history: 'Kasaysayan',
      language: 'Wika',
    },
    hero: {
      stakeBadge: 'Antipolo Philippines Stake',
      title: 'Masagana 2nd Ward',
      description: 'Isang kongregasyong nakasentro kay Jesucristo na tapat sa pagsamba, taos-pusong samahan, at mapagmahal na paglilingkod sa Antipolo, Rizal.',
      viewBulletin: 'Tingnan ang Pahayagan at Balita',
      exploreGallery: 'Tingnan ang Galerya',
      blinkingSacrament: 'Sacrament Meeting • Linggo 9:00 AM',
      yearsHeritage: 'Taon sa Antipolo',
      heritageSub: 'Banal na pamana mula noong 1991 sa Rizal',
      aboutTitle: 'Tungkol sa Ating Ward',
      aboutText: 'Nagtitipon tayo tuwing Sabbath sa Antipolo upang magpanibago ng mga tipan, sumamba kay Jesucristo, at magpatatag ng mga pamilya.',
      aboutAction: 'Basahin ang aming kasaysayan (1991–Kasalukuyan)',
      scheduleTitle: 'Iskedyul sa Linggo',
      sacramentTime: '9:00 AM Sacrament Meeting',
      sundaySchoolTime: '10:00 AM Sunday School / Mga Klase',
      chapelLocation: 'Masagana Chapel, Antipolo, Rizal',
      weeklyAnnouncementsBtn: 'Lingguhang mga Anunsyo',
    },
    bulletin: {
      badge: 'Lingguhang Balita at Kalendaryo',
      title: 'Pahayagan ng Ward (Bulletin)',
      subtitle: 'Manatiling may alam sa mga darating na aktibidad, proyektong pangserbisyo, youth conference, at mga pulong sa Linggo.',
      searchPlaceholder: 'Maghanap ng anunsyo, aktibidad ng kabataan, serbisyo, o lokasyon...',
      pinnedBadge: 'Naka-pin',
      downloadIcs: 'I-save sa Kalendaryo (.ics)',
      allCategory: 'Lahat',
    },
    cfm: {
      badge: 'Espirituwal na Pag-aaral at Gabay ng Pamilya',
      title: 'Lingguhang Kurikulum: Pumarito Ka, Sumunod Ka sa Akin',
      subtitle: 'Nakasentro sa tahanan at sinusuportahan ng Simbahan na pag-aaral ng ebanghelyo para sa mga indibiduwal at pamilya sa Masagana 2nd Ward.',
      openManualBtn: 'Buksan ang Lumang Tipan 2026 Manual',
      manualUrl: 'https://www.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026?lang=tgl',
      lessonUrl: 'https://www.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026/34?lang=tgl',
      focusBadge: 'Lumang Tipan 2026 • Pumarito Ka, Sumunod Ka sa Akin',
      scripturesLabel: 'Mga Banal na Kasulatan',
      familyDiscussionTitle: 'Talakayan at Pagninilay ng Pamilya sa Masagana',
      availableBadge: 'Available sa Tagalog at English sa ChurchofJesusChrist.org',
      readFullLessonBtn: 'Basahin ang Buong Aralin sa Tagalog',
      portalCardBadge: 'Lumang Tipan 2026',
      portalCardTitle: 'Lumang Tipan 2026 (Tagalog Manual)',
      portalCardDesc: 'Manwal sa pag-aaral ng Lumang Tipan para sa Tahanan at Simbahan: Para sa mga Indibiduwal at Pamilya, Sunday School, Primary, at Aaronic Priesthood / Young Women.',
      portalCardLinkText: 'ChurchofJesusChrist.org',
      appCardBadge: 'Mobile App',
      appCardTitle: 'I-download ang Gospel Library App',
      appCardDesc: 'I-highlight ang mga kasulatan, magtala, makinig sa audio narration, at i-sync ang pag-aaral sa lahat ng device.',
      scripturesCardBadge: 'Kagamitan sa Kasulatan',
      scripturesCardTitle: 'Mga Karaniwang Tuntunin at Gabay sa Pag-aaral',
      scripturesCardDesc: 'Basahin ang Banal na Biblia, Aklat ni Mormon, Doktrina at mga Tipan, at Mahalagang Hiyas na may mga talababa at gabay sa paksa.',
      scripturesCardLinkText: 'Tuklasin ang mga Kasulatan',
      week: 'Agosto 17–23, 2026',
      dateRange: 'Lumang Tipan 2026 (Mga Awit)',
      lessonTitle: '“Ang Panginoon ay Aking Pastol”',
      scriptures: 'Mga Awit 1–2; 8; 19–33; 40; 46',
      readingSnippet: '“Ang Panginoon ay aking pastor; hindi ako mangangailangan. Kaniyang pinahihiga ako sa sariwang pastulan: pinapatnubayan niya ako sa siping ng mga tubig na pahingahan. Kaniyang pinapananauli ang aking kaluluwa.” (Mga Awit 23:1–3)',
      familyPrompt: 'Kailan natin naramdaman na binabantayan ng Tagapagligtas ang ating pamilya tulad ng isang pastol sa kanyang mga tupa? Pag-usapan bilang pamilya kung ano ang kahulugan ng pagsunod sa Kanya nang may pagtitiwala, at kung paano mapupuno ng kapayapaan ng Mga Awit 23 ang ating tahanan ngayong linggo.',
      familyPromptGeneric: 'Basahin nang sama-sama bilang pamilya ang mga kabanata ngayong linggo at ibahagi kung ano ang tumatak sa bawat isa. Pag-usapan kung paano tayo itinuturo ng mga talatang ito sa Tagapagligtas at kung ano ang nais ninyong gawin ngayong linggo.'
    },
    gallery: {
      badge: 'Samahan at mga Alaala',
      title: 'Galerya ng Komunidad',
      subtitle: 'Mga sandali ng pagsamba, paglilingkod ng kabataan, salu-salo ng pamilya, at pagtitipon ng stake sa Rizal.',
      allCategory: 'Lahat',
      photoLabel: 'Larawan',
      viewFullBtn: 'Tingnan ang Larawan',
      close: 'Isara',
      backToAlbums: 'Bumalik sa mga Album',
      viewAlbum: 'Tingnan ang Album',
      photosCount: 'Mga Larawan',
      albumsCount: 'Mga Album',
      emptyAlbum: 'Wala pang mga larawang na-upload sa album na ito.',
    },
    blog: {
      badge: 'Mga Mensahe at Aral',
      title: 'Mga Mensahe at Artikulo',
      subtitle: 'Buwanang mensahe mula sa Bishopric, mga pananaw mula sa Relief Society, at pagninilay ng mga miyembro.',
      allCategory: 'Lahat',
      readArticle: 'Basahin ang Buong Artikulo',
      readAloud: 'Pakinggan (Audio Narration)',
      stopReading: 'Ihinto ang Audio',
      reflectionAndComments: 'Pagninilay at Tala ng mga Miyembro',
      leaveComment: 'Magbahagi ng espirituwal na aral o patotoo...',
      commentPlaceholder: 'Sumulat ng nakapagpapatibay na kaisipan para sa ward...',
      postComment: 'I-post ang Pagninilay',
      close: 'Isara',
    },
    history: {
      badge: 'Pag-iingat sa Banal na Kasaysayan',
      title: 'Kasaysayan ng Masagana 2nd Ward',
      subtitle: 'Talaan ng paglago, pananampalataya, at pamunuan mula 1991 hanggang sa kasalukuyan sa Antipolo, Rizal.',
      yearsPill: '1991 – Kasalukuyan',
      establishedYear: '35+ Taon ng Pananampalataya sa Rizal',
      filterAll: 'Lahat ng Tala',
      filterBranch: 'Panahon ng Branch',
      filterWard: 'Organisasyon ng Ward',
      filterBishopric: 'Mga Bishopric',
      filterFacility: 'Gusali at Kapilya',
      filterMilestones: 'Mahahalagang Pangyayari',
      bishopsWallTitle: 'Pangulong Pamunuan at Paghalili',
      bishopsWallSubtitle: 'Pagkilala sa mga tapat na lingkod na namuno sa Masagana 2nd Branch at Ward mula noong 1991.',
      servingYears: 'Panahon ng Paglilingkod',
      currentBishopBadge: 'Kasalukuyang Presiding Bishop',
      leadershipLabel: 'Presidency at mga Counselor',
      presidingLeader: 'Presiding Leader',
      firstCounselor: 'Unang Tagapayo (1st Counselor)',
      secondCounselor: 'Ikalawang Tagapayo (2nd Counselor)',
      keyNoteLabel: 'Makasaysayang Tala',
      milestoneCount: 'Nai-record na Kaganapan',
      milestoneFocus: 'Pokus sa Mahahalagang Kaganapan',
      fullTimeline: 'Buong Kronolohiya',
    },
    footer: {
      invitationText: 'Malugod naming inaanyayahan kayo, ang inyong pamilya, at mga kapitbahay na sumamba kasama namin tuwing Linggo sa Antipolo. Damhin ang kapayapaan at pagkakapatiran na nakasentro kay Jesucristo.',
      sacramentSchedule: 'Sacrament sa Linggo: 9:00 AM',
      visitorsWelcome: 'Laging Malugod na Tinatanggap ang mga Bisita',
      navigationHeading: 'Nabigasyon',
      links: {
        home: 'Masagana 2nd Ward Home',
        bulletin: 'Pahayagan at Kalendaryo',
        curriculum: 'Lingguhang Kurikulum (Pumarito Ka, Sumunod Ka)',
        gallery: 'Galerya ng Komunidad',
        blog: 'Mga Mensahe at Artikulo',
        history: 'Kasaysayan ng Ward (1991–Kasalukuyan)',
      },
      meetinghouseHeading: 'Lokasyon ng Kapilya',
      chapelName: 'Masagana Chapel',
      chapelAddress: 'Antipolo City, Rizal, Philippines',
      genealogyLabel: 'Genealogy',
      disclaimer: 'Ang website na ito ay nagsisilbing impormasyong digital hub para sa mga miyembro at kaibigan ng lokal na Masagana 2nd Ward, Antipolo Philippines Stake.',
    }
  }
};
