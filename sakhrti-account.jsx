import React, { useState } from "react";
import {
  User, Package, MapPin, Heart, CreditCard, Bell, Ticket, Settings,
  LogOut, ChevronLeft, Star, RotateCcw, Truck, Home, Briefcase,
  Plus, Edit2, Trash2, Camera, ChevronRight, X
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
/* MOCK DATA — services/account.ts سيربطها لاحقاً بجداول profiles/orders/addresses */
/* ------------------------------------------------------------------ */
const USER = {
  name: "سعيد بنعلي",
  phone: "+212 6 12 34 56 78",
  email: "said.benali@example.com",
  photo: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=60",
};

const ORDERS = {
  current: [
    { id: "SKH-102938", store: "Burger Boss", items: "2× Cheese Burger، 2× Coca-Cola", total: 94, status: "فالطريق ليك", date: "اليوم 12:25", cover: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=60" },
  ],
  previous: [
    { id: "SKH-102811", store: "بيتزا الأصالة", items: "1× بيتزا مارغريتا", total: 65, status: "تم التوصيل", date: "أمس 20:10", cover: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=60" },
    { id: "SKH-102790", store: "مطعم الأطلس", items: "طاجين + سلطة", total: 78, status: "تم التوصيل", date: "3 شتنبر", cover: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&q=60" },
    { id: "SKH-102765", store: "حلويات فاس", items: "صندوق حلويات مشكلة", total: 120, status: "تم التوصيل", date: "1 شتنبر", cover: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&q=60" },
  ],
  cancelled: [
    { id: "SKH-102700", store: "شواء الدار", items: "مشاوي مشكلة", total: 145, status: "ملغي", date: "28 غشت", cover: "https://images.unsplash.com/photo-1598515213692-5f252f70a26e?w=200&q=60" },
  ],
};

const FAVORITES = [
  { id: "f1", name: "Burger Boss", type: "مطعم", rating: 4.8, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=60" },
  { id: "f2", name: "بيتزا الأصالة", type: "مطعم", rating: 4.6, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&q=60" },
  { id: "f3", name: "بقالة الحي", type: "متجر", rating: 4.5, img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&q=60" },
];

const ADDRESSES_INIT = [
  { id: "a1", label: "المنزل", icon: Home, address: "برشيد، المغرب — شارع الحسن الثاني، رقم 12", default: true },
  { id: "a2", label: "العمل", icon: Briefcase, address: "الدار البيضاء — تقاطع بوليفار الزرقطوني", default: false },
];

const COUPONS = [
  { code: "SAKHRTI30", desc: "خصم 30% على أول طلب", expiry: "صالح حتى 30 شتنبر" },
  { code: "FREEDLV", desc: "توصيل مجاني فوق 100 DH", expiry: "صالح حتى 15 شتنبر" },
];

/* ------------------------------------------------------------------ */
/* NAV CONFIG                                                          */
/* ------------------------------------------------------------------ */
const NAV = [
  { id: "profile", label: "الملف الشخصي", icon: User },
  { id: "orders", label: "طلباتي", icon: Package },
  { id: "addresses", label: "العناوين", icon: MapPin },
  { id: "favorites", label: "المفضلة", icon: Heart },
  { id: "payments", label: "طرق الدفع", icon: CreditCard },
  { id: "notifications", label: "الإشعارات", icon: Bell },
  { id: "coupons", label: "الكوبونات", icon: Ticket },
  { id: "settings", label: "الإعدادات", icon: Settings },
];

/* ------------------------------------------------------------------ */
/* SHARED UI                                                           */
/* ------------------------------------------------------------------ */
function SectionCard({ children, className = "" }) {
  return <div className={`bg-white rounded-2xl p-5 ${className}`}>{children}</div>;
}
function Row({ label, value, onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between py-3" style={{ borderBottom: "1px solid #F5F5F5" }}>
      <span className="text-sm font-semibold" style={{ color: "#6B7280" }}>{label}</span>
      <span className="flex items-center gap-1 text-sm font-bold" style={{ color: C.dark }}>
        {value} <ChevronLeft size={15} color="#C1C5CC" />
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* PROFILE                                                             */
/* ------------------------------------------------------------------ */
function ProfileSection() {
  return (
    <div className="flex flex-col gap-4">
      <SectionCard className="flex items-center gap-4">
        <div className="relative">
          <img src={USER.photo} className="w-20 h-20 rounded-full object-cover" alt={USER.name} />
          <button className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full flex items-center justify-center text-white" style={{ background: C.primary }}>
            <Camera size={13} />
          </button>
        </div>
        <div>
          <h2 className="font-extrabold text-lg" style={{ color: C.dark }}>{USER.name}</h2>
          <p className="text-xs" style={{ color: "#9CA3AF" }}>عضو منذ يناير 2025</p>
        </div>
      </SectionCard>

      <SectionCard>
        <h3 className="font-bold text-sm mb-1" style={{ color: C.dark }}>المعلومات الشخصية</h3>
        <Row label="الاسم الكامل" value={USER.name} />
        <Row label="رقم الهاتف" value={USER.phone} />
        <Row label="البريد الإلكتروني" value={USER.email} />
        <Row label="كلمة المرور" value="تغيير" />
      </SectionCard>

      <button className="w-full rounded-2xl py-3.5 font-bold flex items-center justify-center gap-2" style={{ background: "#FEF2F2", color: "#EF4444" }}>
        <LogOut size={17} /> تسجيل الخروج
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ORDERS                                                               */
/* ------------------------------------------------------------------ */
function OrderCard({ o }) {
  const statusColor = o.status === "تم التوصيل" ? C.success : o.status === "ملغي" ? "#EF4444" : C.primary;
  return (
    <div className="bg-white rounded-2xl p-3 flex gap-3">
      <img src={o.cover} className="w-16 h-16 rounded-xl object-cover shrink-0" alt={o.store} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="font-extrabold text-sm truncate" style={{ color: C.dark }}>{o.store}</span>
          <span className="text-xs font-bold shrink-0" style={{ color: C.dark }}>{o.total} DH</span>
        </div>
        <p className="text-xs truncate mb-1" style={{ color: "#9CA3AF" }}>{o.items}</p>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${statusColor}1A`, color: statusColor }}>{o.status}</span>
          <span className="text-[11px]" style={{ color: "#C1C5CC" }}>{o.date}</span>
        </div>
        <div className="flex gap-2 mt-2">
          {o.status !== "ملغي" && (
            <button className="flex-1 flex items-center justify-center gap-1 rounded-full py-1.5 text-xs font-bold" style={{ background: C.bg, color: C.dark }}>
              <RotateCcw size={12} /> إعادة الطلب
            </button>
          )}
          {o.status === "فالطريق ليك" && (
            <button className="flex-1 flex items-center justify-center gap-1 rounded-full py-1.5 text-xs font-bold text-white" style={{ background: C.primary }}>
              <Truck size={12} /> تتبع الطلب
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function OrdersSection() {
  const [tab, setTab] = useState("current");
  const tabs = [
    { id: "current", label: "الحالية" },
    { id: "previous", label: "السابقة" },
    { id: "cancelled", label: "الملغاة" },
  ];
  const list = ORDERS[tab];
  return (
    <div>
      <div className="flex gap-2 mb-4 bg-white rounded-full p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
            style={{ background: tab === t.id ? C.primary : "transparent", color: tab === t.id ? "#fff" : "#9CA3AF" }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <SectionCard className="text-center py-10">
          <Package size={36} color="#D1D5DB" className="mx-auto mb-2" />
          <p className="font-bold" style={{ color: "#9CA3AF" }}>ماكاينش طلبات هنا</p>
        </SectionCard>
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((o) => <OrderCard key={o.id} o={o} />)}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ADDRESSES                                                            */
/* ------------------------------------------------------------------ */
function AddressForm({ onClose, onSave }) {
  const [label, setLabel] = useState("");
  const [address, setAddress] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(17,24,39,0.5)" }} onClick={onClose}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-extrabold text-lg" style={{ color: C.dark }}>عنوان جديد</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="اسم العنوان (مثال: المنزل)" className="w-full rounded-xl px-3 py-2.5 text-sm mb-3 outline-none" style={{ background: C.bg }} />
        <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="العنوان الكامل" className="w-full rounded-xl px-3 py-2.5 text-sm mb-3 outline-none" style={{ background: C.bg }} />
        <button
          onClick={() => { if (label && address) { onSave({ id: `a${Date.now()}`, label, icon: MapPin, address, default: false }); onClose(); } }}
          className="w-full rounded-2xl py-3 font-bold text-white"
          style={{ background: C.primary }}
        >
          حفظ العنوان
        </button>
      </div>
    </div>
  );
}

function AddressesSection() {
  const [addresses, setAddresses] = useState(ADDRESSES_INIT);
  const [showForm, setShowForm] = useState(false);

  const setDefault = (id) => setAddresses((prev) => prev.map((a) => ({ ...a, default: a.id === id })));
  const remove = (id) => setAddresses((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="flex flex-col gap-3">
      {addresses.map((a) => (
        <SectionCard key={a.id} className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: C.bg }}>
            <a.icon size={17} color={C.primary} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-sm" style={{ color: C.dark }}>{a.label}</span>
              {a.default && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "#DCFCE7", color: C.success }}>افتراضي</span>}
            </div>
            <p className="text-xs" style={{ color: "#9CA3AF" }}>{a.address}</p>
            <div className="flex gap-3 mt-2">
              {!a.default && <button onClick={() => setDefault(a.id)} className="text-xs font-bold" style={{ color: C.primary }}>جعله افتراضي</button>}
              <button className="text-xs font-bold flex items-center gap-1" style={{ color: "#6B7280" }}><Edit2 size={11} /> تعديل</button>
              <button onClick={() => remove(a.id)} className="text-xs font-bold flex items-center gap-1" style={{ color: "#EF4444" }}><Trash2 size={11} /> حذف</button>
            </div>
          </div>
        </SectionCard>
      ))}
      <button onClick={() => setShowForm(true)} className="w-full rounded-2xl py-3.5 font-bold flex items-center justify-center gap-2" style={{ background: C.white, color: C.primary, border: `1.5px dashed ${C.primary}` }}>
        <Plus size={17} /> إضافة عنوان جديد
      </button>
      {showForm && <AddressForm onClose={() => setShowForm(false)} onSave={(a) => setAddresses((prev) => [...prev, a])} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FAVORITES                                                            */
/* ------------------------------------------------------------------ */
function FavoritesSection() {
  const [favs, setFavs] = useState(FAVORITES);
  return favs.length === 0 ? (
    <SectionCard className="text-center py-10">
      <Heart size={36} color="#D1D5DB" className="mx-auto mb-2" />
      <p className="font-bold" style={{ color: "#9CA3AF" }}>مازال ماعندكش مفضلات</p>
    </SectionCard>
  ) : (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {favs.map((f) => (
        <div key={f.id} className="bg-white rounded-2xl overflow-hidden">
          <div className="relative h-24">
            <img src={f.img} className="w-full h-full object-cover" alt={f.name} />
            <button
              onClick={() => setFavs((prev) => prev.filter((x) => x.id !== f.id))}
              className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center"
            >
              <Heart size={12} fill={C.primary} color={C.primary} />
            </button>
          </div>
          <div className="p-2.5">
            <p className="font-bold text-xs truncate" style={{ color: C.dark }}>{f.name}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px]" style={{ color: "#9CA3AF" }}>{f.type}</span>
              <span className="flex items-center gap-0.5 text-[10px] font-bold" style={{ color: C.dark }}>
                <Star size={10} fill={C.primary} color={C.primary} /> {f.rating}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PAYMENTS                                                             */
/* ------------------------------------------------------------------ */
function PaymentsSection() {
  return (
    <div className="flex flex-col gap-3">
      <SectionCard className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: C.bg }}>
          <CreditCard size={18} color={C.dark} />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm" style={{ color: C.dark }}>الدفع عند الاستلام</p>
          <p className="text-xs" style={{ color: "#9CA3AF" }}>نقداً عند وصول الطلب</p>
        </div>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: "#DCFCE7", color: C.success }}>مفعّل</span>
      </SectionCard>
      <button className="w-full rounded-2xl py-3.5 font-bold flex items-center justify-center gap-2" style={{ background: C.white, color: C.primary, border: `1.5px dashed ${C.primary}` }}>
        <Plus size={17} /> إضافة بطاقة بنكية
      </button>
      <p className="text-xs text-center" style={{ color: "#9CA3AF" }}>بيانات البطاقات البنكية تُعالج عبر بوابة دفع آمنة ولا تُخزَّن داخل التطبيق مباشرة.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* NOTIFICATIONS                                                        */
/* ------------------------------------------------------------------ */
function NotificationsSection() {
  const [prefs, setPrefs] = useState({ orders: true, offers: true, coupons: false, news: false });
  const items = [
    { id: "orders", label: "تحديثات الطلبات" },
    { id: "offers", label: "العروض والتخفيضات" },
    { id: "coupons", label: "الكوبونات الجديدة" },
    { id: "news", label: "أخبار سخرتي" },
  ];
  return (
    <SectionCard>
      {items.map((it) => (
        <div key={it.id} className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid #F5F5F5" }}>
          <span className="text-sm font-semibold" style={{ color: C.dark }}>{it.label}</span>
          <button
            onClick={() => setPrefs((p) => ({ ...p, [it.id]: !p[it.id] }))}
            className="w-11 h-6 rounded-full relative transition-all"
            style={{ background: prefs[it.id] ? C.primary : "#E5E7EB" }}
          >
            <span
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
              style={{ [prefs[it.id] ? "right" : "left"]: 2 }}
            />
          </button>
        </div>
      ))}
    </SectionCard>
  );
}

/* ------------------------------------------------------------------ */
/* COUPONS                                                              */
/* ------------------------------------------------------------------ */
function CouponsSection() {
  return (
    <div className="flex flex-col gap-3">
      {COUPONS.map((c) => (
        <SectionCard key={c.code} className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#FFF1EA" }}>
            <Ticket size={18} color={C.primary} />
          </div>
          <div className="flex-1">
            <p className="font-extrabold text-sm" style={{ color: C.dark }}>{c.code}</p>
            <p className="text-xs" style={{ color: "#6B7280" }}>{c.desc}</p>
            <p className="text-[11px] mt-0.5" style={{ color: "#C1C5CC" }}>{c.expiry}</p>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SETTINGS                                                             */
/* ------------------------------------------------------------------ */
function SettingsSection() {
  return (
    <div className="flex flex-col gap-3">
      <SectionCard>
        <Row label="اللغة" value="العربية" />
        <Row label="العملة" value="MAD (DH)" />
        <Row label="سياسة الخصوصية" value="" />
        <Row label="الشروط والأحكام" value="" />
        <Row label="حذف الحساب" value="" />
      </SectionCard>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PAGE                                                                 */
/* ------------------------------------------------------------------ */
export default function SakhrtiAccount() {
  const [active, setActive] = useState("orders");

  const renderSection = () => {
    switch (active) {
      case "profile": return <ProfileSection />;
      case "orders": return <OrdersSection />;
      case "addresses": return <AddressesSection />;
      case "favorites": return <FavoritesSection />;
      case "payments": return <PaymentsSection />;
      case "notifications": return <NotificationsSection />;
      case "coupons": return <CouponsSection />;
      case "settings": return <SettingsSection />;
      default: return null;
    }
  };

  return (
    <div dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif", background: C.bg, minHeight: "100vh" }} className="pb-8">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');`}</style>

      <div className="bg-white px-5 py-3" style={{ borderBottom: "1px solid #F0F0F0" }}>
        <h1 className="font-extrabold text-lg" style={{ color: C.dark }}>حسابي</h1>
      </div>

      {/* Mobile horizontal nav */}
      <div className="md:hidden bg-white px-5 py-2 flex gap-4 overflow-x-auto no-scrollbar" style={{ borderBottom: "1px solid #F0F0F0" }}>
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => setActive(n.id)}
            className="flex flex-col items-center gap-1 shrink-0 py-1"
          >
            <n.icon size={18} color={active === n.id ? C.primary : "#9CA3AF"} />
            <span className="text-[10px] font-bold whitespace-nowrap" style={{ color: active === n.id ? C.primary : "#9CA3AF" }}>{n.label}</span>
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto flex gap-6 p-5">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-60 shrink-0">
          <div className="bg-white rounded-2xl p-3 flex flex-col gap-1 sticky top-5">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => setActive(n.id)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold"
                style={{ background: active === n.id ? "#FFF1EA" : "transparent", color: active === n.id ? C.primary : "#6B7280" }}
              >
                <span className="flex items-center gap-2"><n.icon size={17} /> {n.label}</span>
                <ChevronRight size={14} />
              </button>
            ))}
            <button className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold mt-2" style={{ color: "#EF4444" }}>
              <LogOut size={17} /> تسجيل الخروج
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">{renderSection()}</main>
      </div>
    </div>
  );
}
