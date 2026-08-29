export const overviewStats = [
  { emoji: "👨‍👩‍👧", tone: "purple" as const, label: "Valideynlər", value: "12,450" },
  { emoji: "🧒", tone: "blue" as const, label: "Uşaqlar", value: "21,830" },
  { emoji: "💳", tone: "gold" as const, label: "Premium", value: "4,821" },
  { emoji: "🔥", tone: "orange" as const, label: "Bu gün aktiv", value: "8,921" },
];

export const revenueStats = [
  { emoji: "💰", tone: "green" as const, label: "MRR", value: "$38,240" },
  { emoji: "💰", tone: "green" as const, label: "ARR", value: "$458,880" },
  { emoji: "📈", tone: "teal" as const, label: "Yeni abunəliklər", value: "312" },
  { emoji: "📉", tone: "pink" as const, label: "Churn", value: "2.4%" },
  { emoji: "🔄", tone: "purple" as const, label: "Yenilənmələr", value: "1,204" },
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
  { emoji: "🏷️", tone: "purple" as const, label: "Aktiv kuponlar", value: "24", delta: "+4 bu həftə" },
  { emoji: "🔗", tone: "blue" as const, label: "Ümumi paylanılıb", value: "8,532", delta: "+1,245 bu həftə" },
  { emoji: "✅", tone: "green" as const, label: "İstifadə edilib", value: "2,318", delta: "27.1% istifadə nisbəti" },
  { emoji: "👥", tone: "orange" as const, label: "Fəal tərəfdaşlar", value: "56", delta: "+6 yeni tərəfdaş" },
];
