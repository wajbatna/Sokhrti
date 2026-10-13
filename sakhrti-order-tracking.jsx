import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight, Phone, MessageCircle, Star, Clock, MapPin,
  CheckCircle2, Circle, ChefHat, Package, Bike, PartyPopper, Navigation
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
/* MOCK DATA — services/tracking.ts سيربطها لاحقاً بـ Supabase Realtime  */
/* على القناة orders:id بدل الاعتماد على polling                       */
/* ------------------------------------------------------------------ */
const ORDER = {
  number: "#SKH-102938",
  restaurant: { name: "Burger Boss", logo: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&q=60", phone: "0522334455" },
  items: [
    { name: "Cheese Burger", qty: 2 },
    { name: "Coca-Cola 33cl", qty: 2 },
  ],
  total: 94,
  address: "برشيد، المغرب — شارع الحسن الثاني، رقم 12",
  driver: { name: "يوسف العلوي", rating: 4.9, vehicle: "دراجة نارية · 4521-A", photo: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=60" },
};

const STEPS = [
  { id: "received", label: "تم استلام الطلب", icon: CheckCircle2, time: "12:01" },
  { id: "confirmed", label: "تم تأكيد الطلب", icon: CheckCircle2, time: "12:02" },
  { id: "preparing", label: "جاري التحضير", icon: ChefHat, time: "12:05" },
  { id: "ready", label: "الطلب جاهز", icon: Package, time: "12:20" },
  { id: "picked_up", label: "تم استلام الطلب من المطعم", icon: Bike, time: "12:23" },
  { id: "on_the_way", label: "فالطريق ليك", icon: Navigation, time: "12:25" },
  { id: "delivered", label: "تم التوصيل", icon: PartyPopper, time: null },
];

/* ------------------------------------------------------------------ */
/* MAP ABSTRACTION                                                     */
/* لا يوجد ربط بأي API خرائط هنا — هذا placeholder بصري فقط.            */
/* لاحقاً: <MapProvider driver kitchen dropoff /> سيغلف Google/Mapbox/OSM */
/* ------------------------------------------------------------------ */
function MapPlaceholder({ progress }) {
  return (
    <div className="relative h-52 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #FFF1EA, #F7F7F7)" }}>
      <svg viewBox="0 0 400 200" className="w-full h-full">
        <path d="M40,160 C120,60 260,180 360,50" fill="none" stroke="#FFD3BB" strokeWidth="4" strokeDasharray="2 10" strokeLinecap="round" />
        <path
          d="M40,160 C120,60 260,180 360,50"
          fill="none"
          stroke={C.primary}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="500"
          strokeDashoffset={500 - progress * 5}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <circle cx="40" cy="160" r="7" fill={C.dark} />
        <circle cx="360" cy="50" r="7" fill={C.success} />
      </svg>
      <span className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-1 rounded-full bg-white/90" style={{ color: "#9CA3AF" }}>
        خريطة توضيحية — سيتم ربطها بموفر خرائط حقيقي
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TIMELINE                                                             */
/* ------------------------------------------------------------------ */
function Timeline({ currentIndex }) {
  return (
    <div className="flex flex-col">
      {STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        const Icon = step.icon;
        return (
          <div key={step.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: done || active ? C.primary : "#F0F0F0",
                  color: done || active ? "#fff" : "#B5B9C2",
                }}
              >
                <Icon size={16} />
              </div>
              {i < STEPS.length - 1 && (
                <div className="w-0.5 flex-1 min-h-[28px]" style={{ background: done ? C.primary : "#F0F0F0" }} />
              )}
            </div>
            <div className="pb-7">
              <p className="font-bold text-sm" style={{ color: done || active ? C.dark : "#B5B9C2" }}>{step.label}</p>
              {active && <p className="text-xs font-semibold mt-0.5" style={{ color: C.primary }}>جاري الآن...</p>}
              {step.time && (done || active) && <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>{step.time}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PAGE                                                                 */
/* ------------------------------------------------------------------ */
export default function SakhrtiOrderTracking() {
  const [currentIndex, setCurrentIndex] = useState(2); // يبدأ من "جاري التحضير" للعرض
  const timerRef = useRef(null);

  // محاكاة لتحديثات الحالة الحية — لاحقاً يُستبدل بـ Supabase Realtime subscription
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentIndex((i) => (i < STEPS.length - 1 ? i + 1 : i));
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, []);

  const showDriver = currentIndex >= 4 && currentIndex < STEPS.length - 1;
  const delivered = currentIndex === STEPS.length - 1;
  const progress = (currentIndex / (STEPS.length - 1)) * 100;

  return (
    <div dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif", background: C.bg, minHeight: "100vh" }} className="pb-8">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');`}</style>

      <div className="sticky top-0 z-20 bg-white px-5 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid #F0F0F0" }}>
        <button><ArrowRight size={20} color={C.dark} /></button>
        <div className="flex-1">
          <h1 className="font-extrabold text-base" style={{ color: C.dark }}>تتبع الطلب</h1>
          <p className="text-xs" style={{ color: "#9CA3AF" }}>{ORDER.number}</p>
        </div>
        <button className="rounded-full px-3 py-1.5 text-xs font-bold" style={{ background: C.bg, color: C.dark }}>
          الدعم
        </button>
      </div>

      <div className="max-w-lg mx-auto p-5 flex flex-col gap-4">
        {/* ETA banner */}
        <div className="rounded-2xl p-4 flex items-center justify-between" style={{ background: delivered ? "#DCFCE7" : "#FFF1EA" }}>
          <div>
            <p className="text-xs font-semibold mb-0.5" style={{ color: delivered ? C.success : C.primary }}>
              {delivered ? "تم التوصيل بنجاح" : "الوصول المتوقع"}
            </p>
            <p className="font-extrabold text-lg" style={{ color: C.dark }}>
              {delivered ? "استمتع بوجبتك 🎉" : "30–40 دقيقة"}
            </p>
          </div>
          <Clock size={28} color={delivered ? C.success : C.primary} />
        </div>

        {/* Map */}
        <MapPlaceholder progress={progress} />

        {/* Driver card */}
        {showDriver && (
          <div className="bg-white rounded-2xl p-4 flex items-center gap-3">
            <img src={ORDER.driver.photo} className="w-14 h-14 rounded-full object-cover" alt={ORDER.driver.name} />
            <div className="flex-1">
              <p className="font-extrabold text-sm" style={{ color: C.dark }}>{ORDER.driver.name}</p>
              <p className="text-xs flex items-center gap-1" style={{ color: "#9CA3AF" }}>
                <Star size={11} fill={C.primary} color={C.primary} /> {ORDER.driver.rating} · {ORDER.driver.vehicle}
              </p>
            </div>
            <button className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: C.bg }}>
              <Phone size={16} color={C.dark} />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: C.bg }}>
              <MessageCircle size={16} color={C.dark} />
            </button>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-2xl p-5">
          <h3 className="font-extrabold text-sm mb-4" style={{ color: C.dark }}>حالة الطلب</h3>
          <Timeline currentIndex={currentIndex} />
        </div>

        {/* Restaurant + order details */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <img src={ORDER.restaurant.logo} className="w-11 h-11 rounded-xl object-cover" alt={ORDER.restaurant.name} />
            <div className="flex-1">
              <p className="font-bold text-sm" style={{ color: C.dark }}>{ORDER.restaurant.name}</p>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>{ORDER.restaurant.phone}</p>
            </div>
            <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.bg }}>
              <Phone size={15} color={C.dark} />
            </button>
          </div>
          <div style={{ borderTop: "1px solid #F0F0F0" }} className="pt-3 flex flex-col gap-1">
            {ORDER.items.map((it, i) => (
              <div key={i} className="flex justify-between text-sm" style={{ color: "#6B7280" }}>
                <span>{it.qty}× {it.name}</span>
              </div>
            ))}
            <div className="flex justify-between font-extrabold text-sm pt-2" style={{ color: C.dark }}>
              <span>الإجمالي</span><span>{ORDER.total} DH</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl p-4 flex items-center gap-2">
          <MapPin size={16} color={C.primary} className="shrink-0" />
          <p className="text-sm" style={{ color: "#6B7280" }}>{ORDER.address}</p>
        </div>

        <button className="w-full rounded-2xl py-3.5 font-bold" style={{ background: C.white, color: C.dark, border: "1px solid #EFEFEF" }}>
          تواصل مع الدعم
        </button>
      </div>
    </div>
  );
}
