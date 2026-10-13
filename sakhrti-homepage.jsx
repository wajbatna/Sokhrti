import React, { useState, useRef } from "react";
import {
  MapPin, Search, ShoppingCart, User, Star, Clock, Heart,
  ChevronLeft, ChevronRight, Home, Ticket, Bell, X, Plus, Minus,
  Truck, Flame, Percent
} from "lucide-react";

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
/* MOCK DATA — يجب استبدالها بـ services/*.ts متصلة بـ Supabase لاحقاً */
/* ------------------------------------------------------------------ */
const CATEGORIES = [
  { id: "c1", name: "المطاعم", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=60" },
  { id: "c2", name: "البرغر", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=60" },
  { id: "c3", name: "البيتزا", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=60" },
  { id: "c4", name: "Tacos", img: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=200&q=60" },
  { id: "c5", name: "الدجاج", img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&q=60" },
  { id: "c6", name: "السوشي", img: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&q=60" },
  { id: "c7", name: "المقاهي", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=60" },
  { id: "c8", name: "الحلويات", img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&q=60" },
  { id: "c9", name: "البقالة", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=60" },
  { id: "c10", name: "الصيدليات", img: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200&q=60" },
  { id: "c11", name: "المخابز", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=60" },
];

const BANNERS = [
  { id: "b1", title: "خصم حتى 30%", subtitle: "على أشهى المطاعم في مدينتك", cta: "اطلب الآن", color: "#FF6B35" },
  { id: "b2", title: "توصيل مجاني", subtitle: "على أول طلب فوق 100 درهم", cta: "اكتشف العروض", color: "#111827" },
  { id: "b3", title: "أفضل العروض اليوم", subtitle: "منتقاة خصيصاً لك", cta: "شوف العروض", color: "#22C55E" },
];

const makeRestaurants = (prefix, n) =>
  Array.from({ length: n }).map((_, i) => ({
    id: `${prefix}-${i}`,
    name: [
      "Burger Boss", "بيتزا الأصالة", "مطعم الأطلس", "Tacos Loco", "دجاج بريشو",
      "سوشي طوكيو", "مقهى الصباح", "حلويات فاس", "بركة البركة", "شواء الدار",
    ][i % 10],
    cover: [
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=60",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=60",
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=60",
      "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=500&q=60",
      "https://images.unsplash.com/photo-1598515213692-5f252f70a26e?w=500&q=60",
    ][i % 5],
    category: ["برغر", "بيتزا", "مغربي", "تاكوس", "دجاج"][i % 5],
    rating: (4.2 + (i % 8) * 0.1).toFixed(1),
    reviews: 80 + i * 13,
    time: `${20 + (i % 4) * 5}-${35 + (i % 4) * 5} د`,
    fee: i % 4 === 0 ? "توصيل مجاني" : `${5 + (i % 3) * 5} DH`,
    distance: `${(0.8 + i * 0.3).toFixed(1)} كم`,
    discount: i % 3 === 0 ? `-${10 + (i % 3) * 10}%` : null,
    open: i % 9 !== 0,
  }));

const SECTIONS = [
  { title: "الأكثر طلباً", icon: Flame, data: makeRestaurants("top", 8) },
  { title: "قريب منك", icon: MapPin, data: makeRestaurants("near", 8) },
  { title: "عروض اليوم", icon: Percent, data: makeRestaurants("offer", 8).map(r => ({ ...r, discount: `-${15 + (Math.random()*15|0)}%` })) },
  { title: "توصيل مجاني", icon: Truck, data: makeRestaurants("free", 6).map(r => ({ ...r, fee: "توصيل مجاني" })) },
];

/* ------------------------------------------------------------------ */
/* SUBCOMPONENTS                                                       */
/* ------------------------------------------------------------------ */

function TopBar({ address, onOpenLocation, cartCount, onOpenCart }) {
  return (
    <header style={{ background: C.white, borderBottom: "1px solid #EFEFEF" }} className="sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 pt-3 pb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white shrink-0"
            style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})` }}
          >
            س
          </div>
          <span className="font-extrabold text-lg" style={{ color: C.dark }}>سخرتي</span>
        </div>

        <button onClick={onOpenLocation} className="flex-1 max-w-[280px] flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: C.bg }}>
          <MapPin size={16} color={C.primary} className="shrink-0" />
          <span className="text-xs font-semibold truncate" style={{ color: C.dark }}>{address}</span>
        </button>

        <div className="flex items-center gap-1">
          <button className="w-9 h-9 rounded-full flex items-center justify-center relative" style={{ background: C.bg }}>
            <Bell size={17} color={C.dark} />
          </button>
          <button onClick={onOpenCart} className="w-9 h-9 rounded-full flex items-center justify-center relative" style={{ background: C.bg }}>
            <ShoppingCart size={17} color={C.dark} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -left-1 text-[10px] font-bold text-white rounded-full w-4 h-4 flex items-center justify-center" style={{ background: C.primary }}>
                {cartCount}
              </span>
            )}
          </button>
          <button className="w-9 h-9 rounded-full flex items-center justify-center hidden sm:flex" style={{ background: C.bg }}>
            <User size={17} color={C.dark} />
          </button>
        </div>
      </div>

      <nav className="max-w-6xl mx-auto px-4 pb-2 hidden md:flex items-center gap-6 text-sm font-semibold" style={{ color: "#6B7280" }}>
        <a className="hover:text-[--p]" style={{ color: C.dark }}>الرئيسية</a>
        <a>المطاعم</a>
        <a>المتاجر</a>
        <a>العروض</a>
        <a>تتبع الطلب</a>
      </nav>
    </header>
  );
}

function LocationModal({ open, onClose, onSelect }) {
  const [manual, setManual] = useState("");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(17,24,39,0.5)" }} onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-extrabold text-lg" style={{ color: C.dark }}>فين بغيتي نوصلو ليك؟</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <button
          onClick={() => onSelect("موقعي الحالي")}
          className="w-full flex items-center gap-2 justify-center rounded-2xl py-3 font-bold text-white mb-3"
          style={{ background: C.primary }}
        >
          <MapPin size={18} /> استخدم موقعي
        </button>
        <div className="flex items-center gap-2 my-3">
          <div className="h-px flex-1" style={{ background: "#EEE" }} />
          <span className="text-xs" style={{ color: "#9CA3AF" }}>أو</span>
          <div className="h-px flex-1" style={{ background: "#EEE" }} />
        </div>
        <input
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          placeholder="أدخل العنوان يدوياً"
          className="w-full rounded-2xl px-4 py-3 text-sm font-medium outline-none"
          style={{ background: C.bg, color: C.dark }}
        />
        <button
          onClick={() => manual.trim() && onSelect(manual.trim())}
          className="w-full rounded-2xl py-3 font-bold mt-3"
          style={{ background: C.dark, color: C.white }}
        >
          تأكيد العنوان
        </button>
      </div>
    </div>
  );
}

function Hero({ query, setQuery }) {
  return (
    <section className="max-w-6xl mx-auto px-4 pt-6 pb-4">
      <h1 className="font-extrabold leading-tight mb-1" style={{ color: C.dark, fontSize: "1.6rem" }}>
        شنو بغيتي نوصلك اليوم؟
      </h1>
      <p className="text-sm mb-4" style={{ color: "#6B7280" }}>أكل، مشروبات، بقالة وأكثر... كلشي لي بغيتي حتى لباب دارك</p>
      <div className="flex items-center gap-2 rounded-2xl px-4 py-3 shadow-sm" style={{ background: C.white, border: "1px solid #EFEFEF" }}>
        <Search size={19} color="#9CA3AF" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="شنو بغيتي اليوم؟"
          className="flex-1 outline-none text-sm font-medium bg-transparent"
          style={{ color: C.dark }}
        />
      </div>
    </section>
  );
}

function CategoryScroller() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-2">
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button key={cat.id} className="flex flex-col items-center gap-1.5 shrink-0 w-16">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm" style={{ border: "1px solid #F0F0F0" }}>
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-[11px] font-bold text-center" style={{ color: C.dark }}>{cat.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function BannerSlider() {
  const [idx, setIdx] = useState(0);
  const b = BANNERS[idx];
  return (
    <section className="max-w-6xl mx-auto px-4 py-3">
      <div
        className="relative rounded-3xl overflow-hidden px-6 py-7 flex flex-col justify-center"
        style={{ background: `linear-gradient(120deg, ${b.color}, ${b.color}CC)`, minHeight: 140 }}
      >
        <span className="text-white/90 text-xs font-bold mb-1">عروض سخرتي 🔥</span>
        <h3 className="text-white font-extrabold text-xl mb-1">{b.title}</h3>
        <p className="text-white/85 text-sm mb-3">{b.subtitle}</p>
        <button className="self-start bg-white rounded-full px-4 py-1.5 text-xs font-bold" style={{ color: b.color }}>
          {b.cta}
        </button>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className="h-1.5 rounded-full transition-all"
              style={{ width: i === idx ? 16 : 6, background: "rgba(255,255,255,.85)" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function RestaurantCard({ r, favorite, onToggleFavorite, onOpen }) {
  return (
    <button onClick={onOpen} className="w-[210px] shrink-0 text-right rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid #F0F0F0" }}>
      <div className="relative h-28">
        <img src={r.cover} alt={r.name} className="w-full h-full object-cover" />
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(r.id); }}
          className="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center bg-white/90"
        >
          <Heart size={14} fill={favorite ? C.primary : "none"} color={favorite ? C.primary : C.dark} />
        </button>
        {r.discount && (
          <span className="absolute bottom-2 right-2 text-[10px] font-extrabold text-white rounded-full px-2 py-0.5" style={{ background: C.primary }}>
            {r.discount}
          </span>
        )}
        {!r.open && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-xs font-bold">مغلق حالياً</span>
          </div>
        )}
      </div>
      <div className="p-2.5">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="font-extrabold text-sm truncate" style={{ color: C.dark }}>{r.name}</span>
          <span className="flex items-center gap-0.5 text-xs font-bold shrink-0" style={{ color: C.dark }}>
            <Star size={12} fill={C.primary} color={C.primary} /> {r.rating}
          </span>
        </div>
        <div className="text-[11px] mb-1.5" style={{ color: "#9CA3AF" }}>{r.category} · {r.distance}</div>
        <div className="flex items-center justify-between text-[11px] font-semibold" style={{ color: "#6B7280" }}>
          <span className="flex items-center gap-1"><Clock size={11} /> {r.time}</span>
          <span style={{ color: r.fee === "توصيل مجاني" ? C.success : "#6B7280" }}>{r.fee}</span>
        </div>
      </div>
    </button>
  );
}

function RestaurantSection({ title, icon: Icon, data, favorites, onToggleFavorite, onOpenRestaurant }) {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 240, behavior: "smooth" });
  return (
    <section className="max-w-6xl mx-auto px-4 py-3">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="flex items-center gap-1.5 font-extrabold text-base" style={{ color: C.dark }}>
          <Icon size={17} color={C.primary} /> {title}
        </h2>
        <div className="hidden sm:flex gap-1">
          <button onClick={() => scroll(1)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: C.bg }}><ChevronRight size={14} /></button>
          <button onClick={() => scroll(-1)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: C.bg }}><ChevronLeft size={14} /></button>
        </div>
      </div>
      <div ref={ref} className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {data.map((r) => (
          <RestaurantCard
            key={r.id}
            r={r}
            favorite={favorites.has(r.id)}
            onToggleFavorite={onToggleFavorite}
            onOpen={() => onOpenRestaurant(r)}
          />
        ))}
      </div>
    </section>
  );
}

function RestaurantPreview({ r, onClose }) {
  if (!r) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(17,24,39,0.5)" }} onClick={onClose}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="relative h-40">
          <img src={r.cover} className="w-full h-full object-cover" alt={r.name} />
          <button onClick={onClose} className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"><X size={16} /></button>
        </div>
        <div className="p-5">
          <h3 className="font-extrabold text-xl mb-1" style={{ color: C.dark }}>{r.name}</h3>
          <div className="flex items-center gap-3 text-xs font-semibold mb-3" style={{ color: "#6B7280" }}>
            <span className="flex items-center gap-1"><Star size={13} fill={C.primary} color={C.primary} /> {r.rating} ({r.reviews})</span>
            <span className="flex items-center gap-1"><Clock size={13} /> {r.time}</span>
            <span>{r.fee}</span>
          </div>
          <p className="text-sm mb-4" style={{ color: "#6B7280" }}>هاذي معاينة سريعة لصفحة المطعم — القائمة الكاملة والمنتجات غادي يتزادو فـ Phase 3.</p>
          <button className="w-full rounded-2xl py-3 font-bold text-white" style={{ background: C.primary }}>
            عرض القائمة الكاملة
          </button>
        </div>
      </div>
    </div>
  );
}

function BottomNav() {
  const items = [
    { icon: Home, label: "الرئيسية", active: true },
    { icon: Search, label: "بحث" },
    { icon: Ticket, label: "الطلبات" },
    { icon: Heart, label: "المفضلة" },
    { icon: User, label: "حسابي" },
  ];
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 bg-white md:hidden" style={{ borderTop: "1px solid #EFEFEF" }}>
      <div className="flex justify-around py-2">
        {items.map((it, i) => (
          <button key={i} className="flex flex-col items-center gap-0.5 px-2">
            <it.icon size={20} color={it.active ? C.primary : "#9CA3AF"} />
            <span className="text-[10px] font-bold" style={{ color: it.active ? C.primary : "#9CA3AF" }}>{it.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* PAGE                                                                 */
/* ------------------------------------------------------------------ */
export default function SakhrtiHomepage() {
  const [address, setAddress] = useState("برشيد، المغرب");
  const [locationOpen, setLocationOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState(new Set());
  const [activeRestaurant, setActiveRestaurant] = useState(null);
  const [cartCount] = useState(0);

  const toggleFavorite = (id) =>
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif", background: C.bg, minHeight: "100vh" }} className="pb-20 md:pb-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <TopBar address={address} onOpenLocation={() => setLocationOpen(true)} cartCount={cartCount} onOpenCart={() => {}} />
      <Hero query={query} setQuery={setQuery} />
      <CategoryScroller />
      <BannerSlider />

      {SECTIONS.map((s) => (
        <RestaurantSection
          key={s.title}
          title={s.title}
          icon={s.icon}
          data={s.data}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onOpenRestaurant={setActiveRestaurant}
        />
      ))}

      <footer className="max-w-6xl mx-auto px-4 py-8 mt-4 text-center hidden md:block" style={{ color: "#9CA3AF" }}>
        <div className="font-extrabold mb-1" style={{ color: C.dark }}>سخرتي — SAKHRTI</div>
        <p className="text-xs">كلشي لي بغيتي... حتى لباب دارك</p>
      </footer>

      <LocationModal open={locationOpen} onClose={() => setLocationOpen(false)} onSelect={(a) => { setAddress(a); setLocationOpen(false); }} />
      <RestaurantPreview r={activeRestaurant} onClose={() => setActiveRestaurant(null)} />
      <BottomNav />
    </div>
  );
}
