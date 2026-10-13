import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search, SlidersHorizontal, Star, Clock, Heart, MapPin, X,
  ChevronDown, Check, TrendingUp, History, Percent, Truck,
  ShoppingBag, Store as StoreIcon, UtensilsCrossed, ArrowRight
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
/* MOCK DATA — services/discovery.ts سيربطها بجداول stores + full-text */
/* search (Postgres tsvector) بدل التصفية اليدوية هنا                  */
/* ------------------------------------------------------------------ */
const REST_CATEGORIES = ["الكل", "برغر", "بيتزا", "مغربي", "تاكوس", "دجاج", "سوشي"];
const STORE_CATEGORIES = ["الكل", "بقالة", "صيدلية", "مخبزة", "حلويات", "Electronics", "Beauty"];

function makeItems(prefix, n, cats) {
  return Array.from({ length: n }).map((_, i) => ({
    id: `${prefix}-${i}`,
    name: [
      "Burger Boss", "بيتزا الأصالة", "مطعم الأطلس", "Tacos Loco", "دجاج بريشو",
      "سوشي طوكيو", "بقالة الحي", "صيدلية النور", "مخبزة الصباح", "حلويات فاس",
    ][i % 10],
    cover: [
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=60",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=60",
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=60",
      "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=400&q=60",
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=60",
    ][i % 5],
    category: cats[(i % (cats.length - 1)) + 1],
    rating: +(3.8 + (i % 12) * 0.1).toFixed(1),
    reviews: 40 + i * 9,
    time: `${20 + (i % 4) * 5}-${35 + (i % 4) * 5} د`,
    fee: i % 4 === 0 ? 0 : 5 + (i % 3) * 5,
    distance: +(0.5 + i * 0.27).toFixed(1),
    discount: i % 3 === 0 ? 10 + (i % 3) * 10 : null,
    open: i % 8 !== 0,
  }));
}
const ALL_RESTAURANTS = makeItems("r", 24, REST_CATEGORIES);
const ALL_STORES = makeItems("s", 18, STORE_CATEGORIES);

const POPULAR_SEARCHES = ["برغر", "بيتزا", "سوشي", "توصيل مجاني", "حلويات"];
const RECENT_SEARCHES_INIT = ["Burger Boss", "طاجين"];

const SUGGEST_PRODUCTS = [
  { name: "Cheese Burger", store: "Burger Boss", price: 39, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&q=60" },
  { name: "بيتزا مارغريتا", store: "بيتزا الأصالة", price: 55, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&q=60" },
];

/* ------------------------------------------------------------------ */
/* SHARED CARD                                                          */
/* ------------------------------------------------------------------ */
function Card({ r, favorite, onToggleFavorite }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid #F0F0F0" }}>
      <div className="relative h-32">
        <img src={r.cover} className="w-full h-full object-cover" alt={r.name} />
        <button
          onClick={() => onToggleFavorite(r.id)}
          className="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center bg-white/90"
        >
          <Heart size={14} fill={favorite ? C.primary : "none"} color={favorite ? C.primary : C.dark} />
        </button>
        {r.discount && (
          <span className="absolute bottom-2 right-2 text-[10px] font-extrabold text-white rounded-full px-2 py-0.5" style={{ background: C.primary }}>
            -{r.discount}%
          </span>
        )}
        {!r.open && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-xs font-bold">مغلق حالياً</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="font-extrabold text-sm truncate" style={{ color: C.dark }}>{r.name}</span>
          <span className="flex items-center gap-0.5 text-xs font-bold shrink-0" style={{ color: C.dark }}>
            <Star size={12} fill={C.primary} color={C.primary} /> {r.rating}
          </span>
        </div>
        <div className="text-[11px] mb-1.5" style={{ color: "#9CA3AF" }}>{r.category} · {r.distance} كم</div>
        <div className="flex items-center justify-between text-[11px] font-semibold" style={{ color: "#6B7280" }}>
          <span className="flex items-center gap-1"><Clock size={11} /> {r.time}</span>
          <span style={{ color: r.fee === 0 ? C.success : "#6B7280" }}>{r.fee === 0 ? "توصيل مجاني" : `${r.fee} DH`}</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FILTERS SHEET                                                       */
/* ------------------------------------------------------------------ */
function FiltersSheet({ open, onClose, filters, setFilters }) {
  if (!open) return null;
  const toggle = (key) => setFilters((f) => ({ ...f, [key]: !f[key] }));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(17,24,39,0.5)" }} onClick={onClose}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-sm p-6 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-extrabold text-lg" style={{ color: C.dark }}>الفلاتر</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="flex flex-col gap-2 mb-5">
          {[
            { key: "openNow", label: "مفتوح الآن" },
            { key: "freeDelivery", label: "توصيل مجاني" },
            { key: "offers", label: "عروض وخصومات" },
            { key: "topRated", label: "تقييم 4.5+" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => toggle(f.key)}
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{ background: filters[f.key] ? "#FFF1EA" : C.bg, border: filters[f.key] ? `1px solid ${C.primary}` : "1px solid transparent" }}
            >
              <span className="text-sm font-semibold" style={{ color: C.dark }}>{f.label}</span>
              <span
                className="w-5 h-5 rounded-md flex items-center justify-center"
                style={{ background: filters[f.key] ? C.primary : "#fff", border: `1px solid ${filters[f.key] ? C.primary : "#D1D5DB"}` }}
              >
                {filters[f.key] && <Check size={13} color="#fff" />}
              </span>
            </button>
          ))}
        </div>

        <h4 className="font-bold text-sm mb-2" style={{ color: C.dark }}>المسافة القصوى: {filters.maxDistance} كم</h4>
        <input
          type="range" min="1" max="15" value={filters.maxDistance}
          onChange={(e) => setFilters((f) => ({ ...f, maxDistance: +e.target.value }))}
          className="w-full mb-5" style={{ accentColor: C.primary }}
        />

        <h4 className="font-bold text-sm mb-2" style={{ color: C.dark }}>وقت التوصيل الأقصى: {filters.maxTime} دقيقة</h4>
        <input
          type="range" min="15" max="60" step="5" value={filters.maxTime}
          onChange={(e) => setFilters((f) => ({ ...f, maxTime: +e.target.value }))}
          className="w-full mb-6" style={{ accentColor: C.primary }}
        />

        <div className="flex gap-3">
          <button
            onClick={() => setFilters({ openNow: false, freeDelivery: false, offers: false, topRated: false, maxDistance: 15, maxTime: 60 })}
            className="flex-1 rounded-2xl py-3 font-bold" style={{ background: C.bg, color: C.dark }}
          >
            إعادة تعيين
          </button>
          <button onClick={onClose} className="flex-1 rounded-2xl py-3 font-bold text-white" style={{ background: C.primary }}>
            عرض النتائج
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* LISTING PAGE (shared for Restaurants & Stores)                      */
/* ------------------------------------------------------------------ */
function ListingPage({ title, items, categories, favorites, onToggleFavorite }) {
  const [activeCat, setActiveCat] = useState("الكل");
  const [sort, setSort] = useState("recommended");
  const [sortOpen, setSortOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({ openNow: false, freeDelivery: false, offers: false, topRated: false, maxDistance: 15, maxTime: 60 });
  const [visibleCount, setVisibleCount] = useState(8);

  const filtered = useMemo(() => {
    let list = items.filter((r) => activeCat === "الكل" || r.category === activeCat);
    if (filters.openNow) list = list.filter((r) => r.open);
    if (filters.freeDelivery) list = list.filter((r) => r.fee === 0);
    if (filters.offers) list = list.filter((r) => r.discount);
    if (filters.topRated) list = list.filter((r) => r.rating >= 4.5);
    list = list.filter((r) => r.distance <= filters.maxDistance);
    list = list.filter((r) => parseInt(r.time) <= filters.maxTime);

    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "distance") list = [...list].sort((a, b) => a.distance - b.distance);
    if (sort === "time") list = [...list].sort((a, b) => parseInt(a.time) - parseInt(b.time));
    return list;
  }, [items, activeCat, sort, filters]);

  const activeFilterCount = Object.values(filters).filter((v) => v === true).length;

  const sortOptions = [
    { id: "recommended", label: "الأنسب" },
    { id: "rating", label: "الأعلى تقييماً" },
    { id: "distance", label: "الأقرب" },
    { id: "time", label: "الأسرع توصيلاً" },
  ];

  return (
    <div>
      <div className="sticky top-0 z-20 bg-white pt-3">
        <h1 className="font-extrabold text-lg px-4 mb-3" style={{ color: C.dark }}>{title}</h1>
        <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar pb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0"
              style={{ background: activeCat === cat ? C.primary : C.bg, color: activeCat === cat ? "#fff" : "#6B7280" }}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between px-4 pb-3" style={{ borderBottom: "1px solid #F0F0F0" }}>
          <span className="text-xs font-semibold" style={{ color: "#9CA3AF" }}>{filtered.length} نتيجة</span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setSortOpen(!sortOpen)} className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: C.bg, color: C.dark }}>
                {sortOptions.find((s) => s.id === sort).label} <ChevronDown size={12} />
              </button>
              {sortOpen && (
                <div className="absolute left-0 top-9 z-10 bg-white rounded-xl shadow-lg py-1 w-40" style={{ border: "1px solid #F0F0F0" }}>
                  {sortOptions.map((s) => (
                    <button key={s.id} onClick={() => { setSort(s.id); setSortOpen(false); }} className="w-full text-right px-3 py-2 text-xs font-semibold" style={{ color: sort === s.id ? C.primary : C.dark }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setFiltersOpen(true)} className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full relative" style={{ background: C.bg, color: C.dark }}>
              <SlidersHorizontal size={13} /> فلاتر
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center text-white" style={{ background: C.primary }}>{activeFilterCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 px-4">
          <UtensilsCrossed size={40} color="#D1D5DB" className="mx-auto mb-2" />
          <p className="font-bold" style={{ color: "#9CA3AF" }}>ماكاينش نتائج بهاد الفلاتر</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4">
            {filtered.slice(0, visibleCount).map((r) => (
              <Card key={r.id} r={r} favorite={favorites.has(r.id)} onToggleFavorite={onToggleFavorite} />
            ))}
          </div>
          {visibleCount < filtered.length && (
            <div className="flex justify-center pb-6">
              <button onClick={() => setVisibleCount((v) => v + 8)} className="rounded-full px-6 py-2.5 text-sm font-bold" style={{ background: C.bg, color: C.dark }}>
                عرض المزيد
              </button>
            </div>
          )}
        </>
      )}

      <FiltersSheet open={filtersOpen} onClose={() => setFiltersOpen(false)} filters={filters} setFilters={setFilters} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SEARCH PAGE                                                          */
/* ------------------------------------------------------------------ */
function SearchPage({ favorites, onToggleFavorite }) {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState(RECENT_SEARCHES_INIT);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const results = useMemo(() => {
    if (!query.trim()) return { restaurants: [], products: [] };
    const q = query.trim();
    return {
      restaurants: ALL_RESTAURANTS.filter((r) => r.name.includes(q) || r.category.includes(q)).slice(0, 8),
      products: SUGGEST_PRODUCTS.filter((p) => p.name.includes(q) || p.store.includes(q)),
    };
  }, [query]);

  const runSearch = (term) => {
    setQuery(term);
    setRecent((prev) => [term, ...prev.filter((t) => t !== term)].slice(0, 6));
  };

  const hasQuery = query.trim().length > 0;

  return (
    <div>
      <div className="sticky top-0 z-20 bg-white px-4 pt-3 pb-3" style={{ borderBottom: "1px solid #F0F0F0" }}>
        <div className="flex items-center gap-2 rounded-2xl px-4 py-3" style={{ background: C.bg }}>
          <Search size={18} color="#9CA3AF" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="شنو بغيتي اليوم؟"
            className="flex-1 bg-transparent outline-none text-sm font-medium"
            style={{ color: C.dark }}
          />
          {query && <button onClick={() => setQuery("")}><X size={16} color="#9CA3AF" /></button>}
        </div>
      </div>

      <div className="p-4">
        {!hasQuery && (
          <>
            {recent.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm flex items-center gap-1.5" style={{ color: C.dark }}><History size={14} /> عمليات بحث حديثة</h3>
                  <button onClick={() => setRecent([])} className="text-xs font-bold" style={{ color: C.primary }}>مسح</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recent.map((t) => (
                    <button key={t} onClick={() => runSearch(t)} className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: C.bg, color: C.dark }}>{t}</button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h3 className="font-bold text-sm flex items-center gap-1.5 mb-2" style={{ color: C.dark }}><TrendingUp size={14} /> الأكثر بحثاً</h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((t) => (
                  <button key={t} onClick={() => runSearch(t)} className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "#FFF1EA", color: C.primary }}>{t}</button>
                ))}
              </div>
            </div>
          </>
        )}

        {hasQuery && (
          <>
            {results.products.length > 0 && (
              <div className="mb-5">
                <h3 className="font-bold text-sm mb-2" style={{ color: C.dark }}>منتجات</h3>
                <div className="flex flex-col gap-2">
                  {results.products.map((p) => (
                    <div key={p.name} className="flex items-center gap-3 bg-white rounded-xl p-2" style={{ border: "1px solid #F0F0F0" }}>
                      <img src={p.img} className="w-12 h-12 rounded-lg object-cover" alt={p.name} />
                      <div className="flex-1">
                        <p className="font-bold text-sm" style={{ color: C.dark }}>{p.name}</p>
                        <p className="text-xs" style={{ color: "#9CA3AF" }}>{p.store}</p>
                      </div>
                      <span className="font-bold text-sm" style={{ color: C.dark }}>{p.price} DH</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h3 className="font-bold text-sm mb-2" style={{ color: C.dark }}>مطاعم ومتاجر ({results.restaurants.length})</h3>
            {results.restaurants.length === 0 ? (
              <p className="text-sm text-center py-10" style={{ color: "#9CA3AF" }}>ماكاينش نتائج لـ «{query}»</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {results.restaurants.map((r) => <Card key={r.id} r={r} favorite={favorites.has(r.id)} onToggleFavorite={onToggleFavorite} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ROOT — تنقل توضيحي بين الصفحات الثلاث                                */
/* ------------------------------------------------------------------ */
export default function SakhrtiDiscovery() {
  const [tab, setTab] = useState("restaurants");
  const [favorites, setFavorites] = useState(new Set());
  const toggleFavorite = (id) => setFavorites((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const tabs = [
    { id: "restaurants", label: "المطاعم", icon: UtensilsCrossed },
    { id: "stores", label: "المتاجر", icon: StoreIcon },
    { id: "search", label: "البحث", icon: Search },
  ];

  return (
    <div dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif", background: C.bg, minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap'); .no-scrollbar::-webkit-scrollbar{display:none}`}</style>

      <div className="bg-white flex justify-around sticky top-0 z-30" style={{ borderBottom: "1px solid #F0F0F0" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="flex-1 flex flex-col items-center gap-1 py-3" style={{ borderBottom: tab === t.id ? `2px solid ${C.primary}` : "2px solid transparent" }}>
            <t.icon size={17} color={tab === t.id ? C.primary : "#9CA3AF"} />
            <span className="text-[11px] font-bold" style={{ color: tab === t.id ? C.primary : "#9CA3AF" }}>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto">
        {tab === "restaurants" && <ListingPage title="المطاعم" items={ALL_RESTAURANTS} categories={REST_CATEGORIES} favorites={favorites} onToggleFavorite={toggleFavorite} />}
        {tab === "stores" && <ListingPage title="المتاجر" items={ALL_STORES} categories={STORE_CATEGORIES} favorites={favorites} onToggleFavorite={toggleFavorite} />}
        {tab === "search" && <SearchPage favorites={favorites} onToggleFavorite={toggleFavorite} />}
      </div>
    </div>
  );
}
