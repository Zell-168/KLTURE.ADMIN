
import { TranslationData, Trainer, Course, FAQItem } from './types';

export const TRANSLATIONS: Record<'en' | 'kh', TranslationData> = {
  en: {
    nav: {
      home: "Dashboard",
      products: "KLTURE PRODUCTS",
      community: "All Users",
      topUp: "Top Up",
      about: "System Info",
      faq: "Admin Policy",
      contact: "Registration / Support",
      register: "New Registration",
      signIn: "Admin Login",
      signOut: "Logout",
      profile: "Admin Profile"
    },
    home: {
      heroTitle: "KLTURE ADMIN",
      heroSubtitle: "Administration Dashboard",
      ctaPrimary: "View Users",
      ctaSecondary: "Manage Team",
      introTitle: "System Overview",
      introText: "Monitor registrations, revenue, and system health.",
      focusTitle: "Active Programs",
      focusPrice: "Revenue",
      focusSeats: "Total Seats",
      reasonsTitle: "Quick Actions",
      reasons: [
        "View All Users",
        "Check Transactions",
        "Manage Trainers",
        "Review Content",
      ],
      seeMore: "View details"
    },
    products: {
      title: "Product Management",
      subtitle: "Overview of all active content and programs across the KLTURE ecosystem.",
      miniTitle: "Mini Programs",
      otherTitle: "Other Programs",
      onlineTitle: "Online Courses",
      freeTitle: "Free Courses",
      plusTitle: "Zell Plus Content",
      podcastTitle: "Zell Podcast",
      editBtn: "Manage",
      viewBtn: "View Content"
    },
    community: {
      title: "All Users",
      subtitle: "Database of all registered users and students.",
      follow: "Edit",
      unfollow: "Archive",
      members: "Registered"
    },
    topUp: {
      title: "Credit Top Up",
      subtitle: "Add funds to user wallets directly.",
      searchPlaceholder: "Search user by name or email...",
      selectUserLabel: "Select User",
      amountLabel: "Amount ($)",
      noteLabel: "Reference / Note",
      submitBtn: "Confirm Top Up",
      successMsg: "Credit added successfully.",
      recentHistory: "Recent Top Ups"
    },
    trainers: {
      title: "Team Management",
      subtitle: "Manage active trainers and staff permissions.",
      addBtn: "Add Trainer",
      formName: "Name",
      formRole: "Role",
      formImage: "Image",
      formDesc: "Description",
      delete: "Remove",
      managementTitle: "Staff List"
    },
    about: {
      title: "System Info",
      content: ["KLTURE.MEDIA Administration System v2.0"],
      mission: "Admin Restricted Area",
      visionTitle: "System Status",
      visionList: ["Database: Connected", "Storage: Healthy", "Auth: Secure"]
    },
    faq: {
      title: "Internal Guidelines",
      refundTitle: "Admin Policy",
      refundPolicy: ["Verify payments manually", "Check Telegram for slip"],
      refundNote: "Always confirm before approving.",
      refundContact: "Contact Zell"
    },
    contact: {
      title: "Support & Registration",
      priceLabel: "Price",
      formName: "Full Name",
      formPhone: "Phone",
      formTelegram: "Telegram",
      formEmail: "Email",
      formPassword: "Set Password",
      formProgram: "Program",
      formDate: "Date",
      formMsg: "Notes",
      btnSubmit: "Create Record",
      success: "Record created successfully."
    },
    footer: {
      summary: "KLTURE.ADMIN Internal Dashboard.",
      foundedBy: "System Access Restricted."
    }
  },
  kh: {
    nav: {
      home: "ផ្ទាំងគ្រប់គ្រង",
      products: "ផលិតផល KLTURE",
      community: "អ្នកប្រើប្រាស់ទាំងអស់",
      topUp: "បញ្ចូលលុយ",
      about: "ព័ត៌មានប្រព័ន្ធ",
      faq: "គោលការណ៍",
      contact: "ការចុះឈ្មោះ",
      register: "ចុះឈ្មោះថ្មី",
      signIn: "ចូលប្រព័ន្ធ",
      signOut: "ចាកចេញ",
      profile: "គណនី Admin"
    },
    home: {
      heroTitle: "KLTURE ADMIN",
      heroSubtitle: "ផ្ទាំងគ្រប់គ្រងប្រព័ន្ធ",
      ctaPrimary: "មើលអ្នកប្រើប្រាស់",
      ctaSecondary: "គ្រប់គ្រងក្រុម",
      introTitle: "ទិដ្ឋភាពទូទៅ",
      introText: "ត្រួតពិនិត្យការចុះឈ្មោះ និងចំណូល។",
      focusTitle: "កម្មវិធីសកម្ម",
      focusPrice: "ចំណូល",
      focusSeats: "កន្លែងសរុប",
      reasonsTitle: "សកម្មភាពរហ័ស",
      reasons: ["មើលអ្នកប្រើប្រាស់", "ពិនិត្យប្រតិបត្តិការ", "គ្រប់គ្រងគ្រូ", "ពិនិត្យមាតិកា"],
      seeMore: "មើលលម្អិត"
    },
    products: {
      title: "ការគ្រប់គ្រងផលិតផល",
      subtitle: "ទិដ្ឋភាពទូទៅនៃមាតិកា និងកម្មវិធីទាំងអស់។",
      miniTitle: "កម្មវិធី MINI",
      otherTitle: "កម្មវិធីផ្សេងៗ",
      onlineTitle: "វគ្គសិក្សាអនឡាញ",
      freeTitle: "វគ្គសិក្សាហ្វ្រី",
      plusTitle: "មាតិកា Zell Plus",
      podcastTitle: "Zell Podcast",
      editBtn: "គ្រប់គ្រង",
      viewBtn: "មើលមាតិកា"
    },
    community: {
      title: "អ្នកប្រើប្រាស់ទាំងអស់",
      subtitle: "ទិន្នន័យអ្នកចុះឈ្មោះទាំងអស់។",
      follow: "កែប្រែ",
      unfollow: "បណ្ណសារ",
      members: "បានចុះឈ្មោះ"
    },
    topUp: {
      title: "បញ្ចូលលុយ",
      subtitle: "បន្ថែមទឹកប្រាក់ទៅក្នុងគណនីអ្នកប្រើប្រាស់។",
      searchPlaceholder: "ស្វែងរកឈ្មោះ ឬអ៊ីមែល...",
      selectUserLabel: "ជ្រើសរើសអ្នកប្រើប្រាស់",
      amountLabel: "ចំនួនទឹកប្រាក់ ($)",
      noteLabel: "កំណត់ចំណាំ",
      submitBtn: "បញ្ជាក់ការបញ្ចូល",
      successMsg: "បានបញ្ចូលលុយដោយជោគជ័យ។",
      recentHistory: "ប្រវត្តិបញ្ចូលថ្មីៗ"
    },
    trainers: {
      title: "ការគ្រប់គ្រងក្រុម",
      subtitle: "គ្រប់គ្រងសិទ្ធិបុគ្គលិក។",
      addBtn: "បន្ថែម",
      formName: "ឈ្មោះ",
      formRole: "តួនាទី",
      formImage: "រូបភាព",
      formDesc: "ការពិពណ៌នា",
      delete: "លុប",
      managementTitle: "បញ្ជីបុគ្គលិក"
    },
    about: {
      title: "ព័ត៌មានប្រព័ន្ធ",
      content: ["ប្រព័ន្ធគ្រប់គ្រង KLTURE.MEDIA v2.0"],
      mission: "តំបន់កម្រិតសម្រាប់ Admin",
      visionTitle: "ស្ថានភាពប្រព័ន្ធ",
      visionList: ["ទិន្នន័យ៖ តភ្ជាប់", "សុវត្ថិភាព៖ ខ្ពស់"]
    },
    faq: {
      title: "គោលការណ៍ផ្ទៃក្នុង",
      refundTitle: "គោលការណ៍ Admin",
      refundPolicy: ["ផ្ទៀងផ្ទាត់ការទូទាត់ដោយដៃ"],
      refundNote: "បញ្ជាក់មុនពេលអនុម័ត។",
      refundContact: "ទាក់ទង Zell"
    },
    contact: {
      title: "ជំនួយ & ការចុះឈ្មោះ",
      priceLabel: "តម្លៃ",
      formName: "ឈ្មោះពេញ",
      formPhone: "លេខទូរស័ព្ទ",
      formTelegram: "តេឡេក្រាម",
      formEmail: "អ៊ីមែល",
      formPassword: "ពាក្យសម្ងាត់",
      formProgram: "កម្មវិធី",
      formDate: "កាលបរិច្ឆេទ",
      formMsg: "កំណត់ចំណាំ",
      btnSubmit: "បង្កើតទិន្នន័យ",
      success: "បានបង្កើតដោយជោគជ័យ។"
    },
    footer: {
      summary: "ប្រព័ន្ធគ្រប់គ្រងផ្ទៃក្នុង KLTURE.ADMIN",
      foundedBy: "រក្សាសិទ្ធិសម្រាប់តែ Admin ប៉ុណ្ណោះ។"
    }
  }
};

export const COURSES: Course[] = [
  { id: 'TCM01', title: 'TikTok Content Marketing', price: '$25', description: 'Self-paced TikTok content marketing fundamentals.' },
  { id: 'TAC01', title: 'TikTok Ads Course', price: '$25', description: 'How to run effective TikTok ads.' },
  { id: 'CAP01', title: 'CapCut: Zero to Pro', price: '$15', description: 'Full guide to editing with CapCut.' },
];

export const TRAINERS: Trainer[] = [
  { name: 'Sopheng', role: 'TikTok Marketing & Content', image: 'https://picsum.photos/seed/sopheng/200/200' },
  { name: 'Kimly', role: 'TikTok Marketing & Content', image: 'https://picsum.photos/seed/kimly/200/200' },
  { name: 'Visal', role: 'Creative Content & Trend Strategy', image: 'https://picsum.photos/seed/visal/200/200' },
  { name: 'Siengmeng', role: 'Sales, Closing & Business', image: 'https://picsum.photos/seed/siengmeng/200/200' },
];

export const FAQS: FAQItem[] = [
  { question: "How to reset user password?", answer: "Go to User Management, select user, click Reset Password." },
  { question: "How to add new program?", answer: "Contact developer to add new program types to database." },
];
