export const overviewStats = [
  { icon: "users" as const, tone: "purple" as const, label: "Valideynlər", value: "12,450" },
  { icon: "smile" as const, tone: "blue" as const, label: "Uşaqlar", value: "21,830" },
  { icon: "crown" as const, tone: "gold" as const, label: "Premium", value: "4,821" },
  { icon: "flame" as const, tone: "orange" as const, label: "Bu gün aktiv", value: "8,921" },
];

export const revenueStats = [
  { icon: "dollar" as const, tone: "green" as const, label: "MRR", value: "$38,240" },
  { icon: "dollar" as const, tone: "green" as const, label: "ARR", value: "$458,880" },
  { icon: "trendingUp" as const, tone: "teal" as const, label: "Yeni abunəliklər", value: "312" },
  { icon: "trendingDown" as const, tone: "pink" as const, label: "Churn", value: "2.4%" },
  { icon: "refresh" as const, tone: "purple" as const, label: "Yenilənmələr", value: "1,204" },
];

export type Coupon = {
  id: string;
  code: string;
  name: string;
  logo: string;
  logoColor: string;
  category: "Əyləncə" | "Yemək";
  discount: string;
  maxDiscount: string;
  distributed: number;
  distributedDelta: string;
  used: number;
  usedPercent: number;
  active: boolean;
  expires: string;
};

export const coupons: Coupon[] = [
  {
    id: "joyland20",
    code: "JOYLAND20",
    name: "Joyland Əyləncə Mərkəzi",
    logo: "🎡",
    logoColor: "bg-orange-100",
    category: "Əyləncə",
    discount: "20%",
    maxDiscount: "Maks. 10 AZN",
    distributed: 1250,
    distributedDelta: "1,250",
    used: 320,
    usedPercent: 25.6,
    active: true,
    expires: "31 May 2024",
  },
  {
    id: "funzone15",
    code: "FUNZONE15",
    name: "Fun Zone Park",
    logo: "🎠",
    logoColor: "bg-purple-100",
    category: "Əyləncə",
    discount: "15%",
    maxDiscount: "Maks. 8 AZN",
    distributed: 980,
    distributedDelta: "980",
    used: 245,
    usedPercent: 25.0,
    active: true,
    expires: "31 May 2024",
  },
  {
    id: "mcdonalds10",
    code: "MCDONALDS10",
    name: "McDonald's Azərbaycan",
    logo: "🍔",
    logoColor: "bg-red-100",
    category: "Yemək",
    discount: "10%",
    maxDiscount: "Maks. 6 AZN",
    distributed: 2300,
    distributedDelta: "2,300",
    used: 890,
    usedPercent: 38.7,
    active: true,
    expires: "31 May 2024",
  },
  {
    id: "pizzamizza15",
    code: "PIZZAMIZZA15",
    name: "Pizza Mizza",
    logo: "🍕",
    logoColor: "bg-red-100",
    category: "Yemək",
    discount: "15%",
    maxDiscount: "Maks. 8 AZN",
    distributed: 1800,
    distributedDelta: "1,800",
    used: 630,
    usedPercent: 35.0,
    active: true,
    expires: "31 May 2024",
  },
  {
    id: "kfc10",
    code: "KFC10",
    name: "KFC Azərbaycan",
    logo: "🍗",
    logoColor: "bg-red-100",
    category: "Yemək",
    discount: "10%",
    maxDiscount: "Maks. 6 AZN",
    distributed: 1200,
    distributedDelta: "1,200",
    used: 233,
    usedPercent: 19.4,
    active: true,
    expires: "31 May 2024",
  },
];

export const couponSummary = [
  { icon: "tag" as const, tone: "purple" as const, label: "Aktiv kuponlar", value: "24", delta: "+4 bu həftə" },
  { icon: "link" as const, tone: "blue" as const, label: "Ümumi paylanılıb", value: "8,532", delta: "+1,245 bu həftə" },
  { icon: "check" as const, tone: "green" as const, label: "İstifadə edilib", value: "2,318", delta: "27.1% istifadə nisbəti" },
  { icon: "users" as const, tone: "orange" as const, label: "Fəal tərəfdaşlar", value: "56", delta: "+6 yeni tərəfdaş" },
];

// ---------- Users (Parents) ----------

export type Parent = {
  id: string;
  name: string;
  email: string;
  country: string;
  plan: "Free" | "Single Child" | "Family";
  children: number;
  devices: number;
  status: "Aktiv" | "Dayandırılıb" | "Sınaq";
  joined: string;
};

export const parents: Parent[] = [
  { id: "p1", name: "Ahmed Qasımov", email: "ahmed@example.com", country: "Azərbaycan", plan: "Family", children: 3, devices: 5, status: "Aktiv", joined: "12 Yan 2026" },
  { id: "p2", name: "Fatima Al-Rashid", email: "fatima@example.com", country: "BƏƏ", plan: "Single Child", children: 1, devices: 2, status: "Aktiv", joined: "3 Fev 2026" },
  { id: "p3", name: "Mehmet Yılmaz", email: "mehmet@example.com", country: "Türkiyə", plan: "Family", children: 2, devices: 3, status: "Aktiv", joined: "20 Fev 2026" },
  { id: "p4", name: "Sarah Ibrahim", email: "sarah@example.com", country: "UK", plan: "Free", children: 1, devices: 1, status: "Sınaq", joined: "5 Mar 2026" },
  { id: "p5", name: "Yusuf Rahman", email: "yusuf@example.com", country: "Malayziya", plan: "Family", children: 3, devices: 4, status: "Dayandırılıb", joined: "18 Mar 2026" },
  { id: "p6", name: "Amina Bello", email: "amina@example.com", country: "Nigeriya", plan: "Single Child", children: 1, devices: 2, status: "Aktiv", joined: "29 Mar 2026" },
];

// ---------- Children (admin view) ----------

export type AdminChild = {
  id: string;
  name: string;
  ageGroup: string;
  parent: string;
  xp: number;
  level: number;
  streak: number;
  accuracy: number;
  lastActive: string;
};

export const adminChildren: AdminChild[] = [
  { id: "c1", name: "Ali", ageGroup: "8-10", parent: "Ahmed Qasımov", xp: 850, level: 12, streak: 7, accuracy: 87, lastActive: "Bu gün" },
  { id: "c2", name: "Leyla", ageGroup: "5-7", parent: "Ahmed Qasımov", xp: 620, level: 9, streak: 12, accuracy: 92, lastActive: "Bu gün" },
  { id: "c3", name: "Murad", ageGroup: "11-13", parent: "Ahmed Qasımov", xp: 410, level: 7, streak: 3, accuracy: 75, lastActive: "2 gün əvvəl" },
  { id: "c4", name: "Zara", ageGroup: "5-7", parent: "Fatima Al-Rashid", xp: 300, level: 5, streak: 4, accuracy: 81, lastActive: "Bu gün" },
  { id: "c5", name: "Emre", ageGroup: "8-10", parent: "Mehmet Yılmaz", xp: 990, level: 14, streak: 21, accuracy: 90, lastActive: "Bu gün" },
];

// ---------- Subscriptions ----------

export const subscriptionStatusStats = [
  { icon: "check" as const, tone: "green" as const, label: "Aktiv", value: "4,821" },
  { icon: "ban" as const, tone: "pink" as const, label: "Ləğv edilib", value: "312" },
  { icon: "clock" as const, tone: "gold" as const, label: "Sınaq müddəti", value: "648" },
  { icon: "trendingDown" as const, tone: "orange" as const, label: "Bitib", value: "204" },
];

export const subscriptionPlans = [
  { id: "single", name: "Single Child", price: "$4.99/ay", subscribers: 1642, revenue: "$8,193" },
  { id: "family", name: "Family", price: "$7.99/ay", subscribers: 3179, revenue: "$25,400" },
];

// ---------- Partner venues ----------

export type Venue = {
  id: string;
  name: string;
  category: string;
  city: string;
  activeCoupons: number;
  status: "Aktiv" | "Gözləmədə";
};

export const entertainmentVenues: Venue[] = [
  { id: "v1", name: "Joyland Əyləncə Mərkəzi", category: "Əyləncə mərkəzi", city: "Bakı", activeCoupons: 3, status: "Aktiv" },
  { id: "v2", name: "Fun Zone Park", category: "Park", city: "Bakı", activeCoupons: 2, status: "Aktiv" },
  { id: "v3", name: "Kids Adventure World", category: "Oyun mərkəzi", city: "Sumqayıt", activeCoupons: 0, status: "Gözləmədə" },
];

export const restaurantVenues: Venue[] = [
  { id: "r1", name: "McDonald's Azərbaycan", category: "Fast-food", city: "Bakı", activeCoupons: 4, status: "Aktiv" },
  { id: "r2", name: "Pizza Mizza", category: "Pizza", city: "Bakı", activeCoupons: 2, status: "Aktiv" },
  { id: "r3", name: "KFC Azərbaycan", category: "Fast-food", city: "Bakı", activeCoupons: 3, status: "Aktiv" },
  { id: "r4", name: "Sweet Corner", category: "Şirniyyat", city: "Gəncə", activeCoupons: 0, status: "Gözləmədə" },
];

// ---------- Events ----------

export type AdminEvent = {
  id: string;
  name: string;
  start: string;
  end: string;
  status: "Aktiv" | "Planlaşdırılıb" | "Bitib";
  missions: number;
};

export const events: AdminEvent[] = [
  { id: "e1", name: "Ramadan Event", start: "10 Mar 2026", end: "9 Apr 2026", status: "Planlaşdırılıb", missions: 30 },
  { id: "e2", name: "Eid al-Fitr Celebration", start: "10 Apr 2026", end: "13 Apr 2026", status: "Planlaşdırılıb", missions: 5 },
  { id: "e3", name: "Islamic New Year", start: "20 Iyun 2025", end: "22 Iyun 2025", status: "Bitib", missions: 3 },
  { id: "e4", name: "Hajj Season Specials", start: "1 İyun 2025", end: "10 İyun 2025", status: "Bitib", missions: 7 },
];

// ---------- Content management ----------

export type Question = {
  id: string;
  prompt: string;
  category: string;
  age: string;
  difficulty: "Asan" | "Orta" | "Çətin";
  status: "Yayımlanıb" | "Baxılır" | "Qaralama";
};

export const questions: Question[] = [
  { id: "q1", prompt: "Which one is a mosque?", category: "Islam Basics", age: "5-7", difficulty: "Asan", status: "Yayımlanıb" },
  { id: "q2", prompt: "How many times a day do Muslims pray?", category: "Salah", age: "8-10", difficulty: "Asan", status: "Yayımlanıb" },
  { id: "q3", prompt: "What is the holy book of Islam called?", category: "Quran", age: "8-10", difficulty: "Orta", status: "Yayımlanıb" },
  { id: "q4", prompt: "Name the last Prophet of Islam.", category: "Prophets", age: "11-13", difficulty: "Orta", status: "Baxılır" },
  { id: "q5", prompt: "What month is Ramadan in the Islamic calendar?", category: "Ramadan", age: "8-10", difficulty: "Çətin", status: "Qaralama" },
];

export type Lesson = {
  id: string;
  title: string;
  age: string;
  format: string;
  status: "Yayımlanıb" | "Baxılır" | "Qaralama";
};

export const lessons: Lesson[] = [
  { id: "l1", title: "The Five Pillars of Islam", age: "8-10", format: "Mətn + Video", status: "Yayımlanıb" },
  { id: "l2", title: "Stories of the Prophets", age: "5-7", format: "Mətn + Şəkil", status: "Yayımlanıb" },
  { id: "l3", title: "How to Perform Wudu", age: "8-10", format: "Video", status: "Baxılır" },
  { id: "l4", title: "Good Manners in Islam", age: "5-7", format: "Mətn + Audio", status: "Qaralama" },
];

export type WorldItem = {
  id: string;
  name: string;
  type: "Bina" | "Geyim" | "Bəzək";
  unlockLevel: number;
};

export const worldItems: WorldItem[] = [
  { id: "w1", name: "Golden Mosque", type: "Bina", unlockLevel: 15 },
  { id: "w2", name: "Blue Cap", type: "Geyim", unlockLevel: 12 },
  { id: "w3", name: "Ramadan Lanterns", type: "Bəzək", unlockLevel: 10 },
  { id: "w4", name: "Knowledge Tower", type: "Bina", unlockLevel: 20 },
];

// ---------- Notifications ----------

export type SentNotification = {
  id: string;
  title: string;
  audience: string;
  sentAt: string;
  status: "Göndərilib" | "Planlaşdırılıb";
};

export const sentNotifications: SentNotification[] = [
  { id: "n1", title: "New Daily Challenge! 🔥", audience: "Bütün istifadəçilər", sentAt: "Bu gün, 09:00", status: "Göndərilib" },
  { id: "n2", title: "Ramadan Village açılır!", audience: "Premium istifadəçilər", sentAt: "Sabah, 08:00", status: "Planlaşdırılıb" },
  { id: "n3", title: "Ali hasn't completed today's lesson yet.", audience: "Xüsusi valideyn", sentAt: "Dünən, 19:30", status: "Göndərilib" },
];

// ---------- Support ----------

export type SupportTicket = {
  id: string;
  subject: string;
  user: string;
  priority: "Aşağı" | "Orta" | "Yüksək";
  status: "Açıq" | "Cavablandırılıb" | "Bağlanıb";
  updatedAt: string;
};

export const supportTickets: SupportTicket[] = [
  { id: "t1", subject: "Uşaq kodu işləmir", user: "Ahmed Qasımov", priority: "Yüksək", status: "Açıq", updatedAt: "10 dəq əvvəl" },
  { id: "t2", subject: "Abunəlik bərpası", user: "Sarah Ibrahim", priority: "Orta", status: "Cavablandırılıb", updatedAt: "2 saat əvvəl" },
  { id: "t3", subject: "Cihaz təsdiqi gəlmir", user: "Yusuf Rahman", priority: "Aşağı", status: "Bağlanıb", updatedAt: "1 gün əvvəl" },
];

// ---------- Admin roles ----------

export const adminRoles = [
  { id: "super", name: "Super Admin", access: "Hər şey" },
  { id: "content", name: "Content Manager", access: "Quiz + Dərslər" },
  { id: "support", name: "Support", access: "İstifadəçilər + Abunəliklər" },
  { id: "analyst", name: "Analyst", access: "Yalnız Statistika" },
  { id: "moderator", name: "Moderator", access: "Məzmun yoxlanışı" },
];

// ---------- Statistics ----------

export const engagementStats = [
  { icon: "flame" as const, tone: "orange" as const, label: "DAU", value: "8,921" },
  { icon: "users" as const, tone: "blue" as const, label: "WAU", value: "31,204" },
  { icon: "globe" as const, tone: "purple" as const, label: "MAU", value: "62,450" },
];

export const learningStats = [
  { icon: "quiz" as const, tone: "purple" as const, label: "Sual/gün", value: "48,300" },
  { icon: "check" as const, tone: "green" as const, label: "Tamamlama nisbəti", value: "78%" },
  { icon: "star" as const, tone: "gold" as const, label: "Orta bal", value: "84%" },
];

export const retention = [
  { label: "Day 1", value: 62 },
  { label: "Day 7", value: 38 },
  { label: "Day 30", value: 21 },
];

export const subscriptionFunnel = [
  { label: "Conversion", value: 14 },
  { label: "Churn", value: 4 },
  { label: "Renewal", value: 82 },
];

export const mostPopular = [
  { icon: "book" as const, tone: "teal" as const, label: "The Five Pillars of Islam", meta: "12,400 baxış" },
  { icon: "quiz" as const, tone: "purple" as const, label: "Which one is a mosque?", meta: "9,850 cavab" },
  { icon: "controller" as const, tone: "orange" as const, label: "Good Deeds Garden", meta: "7,220 oyun" },
  { icon: "gift" as const, tone: "pink" as const, label: "Blue Cap", meta: "5,140 unlock" },
];

// ---------- Languages ----------

export const languages = [
  { flag: "🇬🇧", name: "English", status: "🟢", questions: 1240, lessons: 180 },
  { flag: "🇸🇦", name: "Arabic", status: "🟢", questions: 1240, lessons: 180 },
  { flag: "🇹🇷", name: "Turkish", status: "🟢", questions: 1100, lessons: 165 },
  { flag: "🇦🇿", name: "Azerbaijani", status: "🟢", questions: 800, lessons: 120 },
  { flag: "🇩🇪", name: "German", status: "🟡", questions: 400, lessons: 60 },
];
