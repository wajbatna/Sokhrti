import React, { useState, useEffect, useMemo } from "react";
import { Flame, Clock, Star, Truck, Heart, ArrowLeft } from "lucide-react";

/* ------------------------------------------------------------------ */
/* TOKENS                                                              */
/* ------------------------------------------------------------------ */
const C = {
  primary: "#FF6B35",
  primaryDark: "#E4551F",
  dark: "#111827",
  bg: "#F7F7F7",
  white: "#FFFFFF",
  success: "#22C55E",
};

/* ------------------------------------------------------------------ */
/* MOCK DATA — services/offers.ts سيربطها بجدول offers (join مع products */
/* و stores) مفلترة بـ is_active = true and now() between starts_at/ends_at */
/* ------------------------------------------------------------------ */
const now = Date.now();
const OFFERS = [
  {
    id: "o1", store: "Burger Boss", product: "Cheese Burger", oldPrice: 49, newPrice: 34,
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=60",
    rating: 4.8, fee: 0, expiresAt: now + 1000 * 60 * 60 * 5,
  },
  {
    id: "o2", store: "بيتزا الأصالة", product: "بيتزا عائلية مشكلة", oldPrice: 95, newPrice: 65,
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=60",
    rating: 4.6, fee: 10, expiresAt: now + 1000 * 60 * 60 * 26,
  },
  {
    id: "o3", store: "حلويات فاس", product: "صندوق حلويات مشكلة", oldPrice: 150, newPrice: 99,
    img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&q=60",
    rating: 4.9, fee: 5, expiresAt: now + 1000 * 60 * 60 * 3,
  },
  {
    id: "o4", store: "شواء الدار", product: "طبق مشاوي مشكلة", oldPrice: 180, newPrice: 135,
    img: "https://images.unsplash.com/photo-1598515213692-5f252f70a26e?w=500&q=60",
    rating: 4.7, fee: 0, expiresAt: now + 1000 * 60 * 60 * 48,
  },
  {
    id: "o5", store: "سوشي طوكيو", product: "طبق سوشي 20 قطعة", oldPrice: 140, newPrice: 99,
    img: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&q=60",
    rating: 4.5, fee: 15, expiresAt: now + 1000 * 60 * 60 * 10,
  },
  {
    id: "o6", store: "مطعم الأطلس", product: "طاجين لحم + سلطة", oldPrice: 90, newPrice: 68,
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=60",
    rating: 4.7, fee: 8, expiresAt: now + 1000 * 60 * 60 * 14,
  },
];

/* ------------------------------------------------------------------ */
/* COUNTDOWN HELPER                                                     */
/* ------------------------------------------------------------------ */
function useCountdown(expiresAt) {
  const [left, setLeft] = useState(expiresAt - Date.now());
  useEffect(() => {
    const t = setInterval(() => setLeft(expiresAt - Date.now()), 1000);
    return () => clearInterval(t);
  }, [expiresAt]);
  if (left <= 0) return "انتهى العرض";
  const h = Math.floor(left / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  if (h > 24) return `ينتهي بعد ${Math.floor(h / 24)} يوم`;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* ------------------------------------------------------------------ */
/* OFFER CARD                                                           */
/* ------------------------------------------------------------------ */
function OfferCard({ offer, favorite, onToggleFavorite }) {
  const countdown = useCountdown(offer.expiresAt);
  const discountPct = Math.round(100 - (offer.newPrice / offer.oldPrice) * 100);

  return (
    <div className="bg-white rounded-3xl overflow-hidden" style={{ border: "1px solid #F0F0F0" }}>
      <div className="relative h-40">
        <img src={offer.img} className="w-full h-full object-cover" alt={offer.product} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(0,0,0,.45), transparent 50%)" }} />
        <span className="absolute top-3 right-3 text-xs font-extrabold text-white rounded-full px-3 py-1 flex items-center gap-1" style={{ background: C.primary }}>
          <Flame size={12} /> -{discountPct}%
        </span>
        <button
          onClick={() => onToggleFavorite(offer.id)}
          className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center bg-white/90"
        >
          <Heart size={15} fill={favorite ? C.primary : "none"} color={favorite ? C.primary : C.dark} />
        </button>
        <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between">
          <span className="text-white text-xs font-bold">{offer.store}</span>
          <span className="flex items-center gap-1 text-xs font-bold text-white">
            <Clock size={12} /> {countdown}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-extrabold text-base mb-1" style={{ color: C.dark }}>{offer.product}</h3>
        <div className="flex items-center gap-3 text-xs font-semibold mb-3" style={{ color: "#6B7280" }}>
          <span className="flex items-center gap-1"><Star size={12} fill={C.primary} color={C.primary} /> {offer.rating}</span>
          <span className="flex items-center gap-1"><Truck size={12} /> {offer.fee === 0 ? "توصيل مجاني" : `${offer.fee} DH`}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-xl" style={{ color: C.primary }}>{offer.newPrice} DH</span>
            <span className="text-sm line-through" style={{ color: "#C1C5CC" }}>{offer.oldPrice} DH</span>
          </div>
          <button className="rounded-full px-4 py-2 text-xs font-bold text-white flex items-center gap-1" style={{ background: C.dark }}>
            اطلب الآن <ArrowLeft size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PAGE                                                                 */
/* ------------------------------------------------------------------ */
export default function SakhrtiOffers() {
  const [favorites, setFavorites] = useState(new Set());
  const toggleFavorite = (id) => setFavorites((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const sorted = useMemo(() => [...OFFERS].sort((a, b) => a.expiresAt - b.expiresAt), []);

  return (
    <div dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif", background: C.bg, minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');`}</style>

      <div className="relative overflow-hidden px-5 pt-8 pb-10" style={{ background: `linear-gradient(120deg, ${C.primary}, ${C.primaryDark})` }}>
        <span className="text-white/90 text-sm font-bold mb-1 block">🔥 عروض سخرتي</span>
        <h1 className="text-white font-extrabold text-2xl mb-1">أقوى العروض اليوم</h1>
        <p className="text-white/85 text-sm">خصومات حقيقية من أفضل المطاعم والمتاجر — لفترة محدودة</p>
      </div>

      <div className="max-w-5xl mx-auto p-4 -mt-5">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((o) => (
            <OfferCard key={o.id} offer={o} favorite={favorites.has(o.id)} onToggleFavorite={toggleFavorite} />
          ))}
        </div>
      </div>
    </div>
  );
}
