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
