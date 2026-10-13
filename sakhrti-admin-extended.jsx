import React, { useState, useRef } from "react";
import {
  Users, Bike, Ticket, Image as ImageIcon, Star, BarChart3,
  Plus, Search, MoreVertical, X, Upload, Check, TrendingUp,
  TrendingDown, Pencil, Trash2, Ban, PlayCircle, EyeOff, Eye,
  Calendar, Percent, DollarSign, ShoppingBag, Store
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
/* MOCK DATA — services/admin/*.ts سيربطها بجداول profiles/drivers/    */
/* coupons/banners/reviews عبر Supabase مع RLS is_admin()               */
/* ------------------------------------------------------------------ */
const INITIAL_VENDORS = [
  { id: "v1", name: "سعيد التازي", store: "Burger Boss", phone: "0661223344", orders: 342, revenue: 28900, status: "active", photo: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&q=60" },
  { id: "v2", name: "خديجة العلمي", store: "بيتزا الأصالة", phone: "0662334455", orders: 218, revenue: 19600, status: "active", photo: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&q=60" },
  { id: "v3", name: "حسن بنموسى", store: "مطعم الأطلس", phone: "0663445566", orders: 45, revenue: 3200, status: "pending", photo: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&q=60" },
];

const INITIAL_DRIVERS = [
  { id: "d1", name: "يوسف العلوي", phone: "0664556677", vehicle: "دراجة نارية · 4521-A", rating: 4.9, deliveries: 612, status: "available", verified: true, photo: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&q=60" },
  { id: "d2", name: "أمين الطاهري", phone: "0665667788", vehicle: "دراجة · 2210-B", rating: 4.7, deliveries: 340, status: "busy", verified: true, photo: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&q=60" },
  { id: "d3", name: "كريم الوردي", phone: "0666778899", vehicle: "دراجة نارية · 8890-C", rating: 4.5, deliveries: 12, status: "offline", verified: false, photo: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&q=60" },
];

const INITIAL_COUPONS = [
  { id: "cp1", code: "SAKHRTI30", type: "percentage", value: 30, minOrder: 50, usageLimit: 500, used: 212, expiry: "30 شتنبر 2026", active: true },
  { id: "cp2", code: "FREEDLV", type: "fixed", value: 10, minOrder: 100, usageLimit: 1000, used: 645, expiry: "15 شتنبر 2026", active: true },
  { id: "cp3", code: "WELCOME20", type: "percentage", value: 20, minOrder: 0, usageLimit: 2000, used: 1980, expiry: "1 غشت 2026", active: false },
];

const INITIAL_BANNERS = [
  { id: "b1", title: "خصم حتى 30%", subtitle: "على أشهى المطاعم", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=60", active: true, start: "01/09/2026", end: "30/09/2026" },
  { id: "b2", title: "توصيل مجاني", subtitle: "فوق 100 درهم", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=60", active: true, start: "01/09/2026", end: "15/09/2026" },
];

const INITIAL_REVIEWS = [
  { id: "rv1", customer: "سعيد بنعلي", store: "Burger Boss", rating: 5, comment: "طلب لذيذ وتوصيل سريع بزاف، شكراً سخرتي!", visible: true, date: "اليوم" },
  { id: "rv2", customer: "مريم الفاسي", store: "بيتزا الأصالة", rating: 2, comment: "الطلب توصل بارد ومتأخر شوية.", visible: true, date: "أمس" },
  { id: "rv3", customer: "زبون مجهول", store: "شواء الدار", rating: 1, comment: "كلام غير لائق تم حذفه من طرف الإدارة.", visible: false, date: "3 شتنبر" },
];

const ANALYTICS = {
  revenueByMonth: [
    { m: "أبريل", v: 42 }, { m: "ماي", v: 55 }, { m: "يونيو", v: 61 },
    { m: "يوليوز", v: 58 }, { m: "غشت", v: 73 }, { m: "شتنبر", v: 81 },
  ],
  topStores: [
    { name: "Burger Boss", revenue: 28900, orders: 342 },
    { name: "بيتزا الأصالة", revenue: 19600, orders: 218 },
    { name: "حلويات فاس", revenue: 15200, orders: 190 },
  ],
  kpis: [
    { label: "إجمالي الإيرادات (شتنبر)", value: "81,400 DH", trend: "+11%", up: true, icon: DollarSign },
    { label: "إجمالي الطلبات", value: "2,340", trend: "+6%", up: true, icon: ShoppingBag },
    { label: "متوسط قيمة الطلب", value: "62 DH", trend: "-2%", up: false, icon: TrendingUp },
    { label: "محلات نشطة", value: "186", trend: "+3", up: true, icon: Store },
  ],
};

/* ------------------------------------------------------------------ */
/* SHARED                                                              */
/* ------------------------------------------------------------------ */
function Badge({ color, children }) {
  return <span className="text-[11px] font-bold px-2 py-1 rounded-full" style={{ background: `${color}1A`, color }}>{children}</span>;
}
function Field({ label, ...props }) {
  return (
    <div>
      <label className="text-xs font-bold mb-1.5 block" style={{ color: C.dark }}>{label}</label>
      <input {...props} className="w-full rounded-xl px-3 py-2.5 text-sm outline-none" style={{ background: C.bg }} />
    </div>
  );
}
function ImageUploadBox({ label, value, onChange, height = "h-24" }) {
  const inputRef = useRef(null);
  return (
    <div>
      <label className="text-xs font-bold mb-1.5 block" style={{ color: C.dark }}>{label}</label>
      <div className={`relative ${height} rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer`} style={{ background: C.bg, border: "1.5px dashed #D1D5DB" }} onClick={() => inputRef.current?.click()}>
        {value ? (
          <>
            <img src={value} className="w-full h-full object-cover" alt={label} />
            <button onClick={(e) => { e.stopPropagation(); onChange(null); }} className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center"><X size={14} /></button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5"><Upload size={20} color="#9CA3AF" /><span className="text-xs font-semibold" style={{ color: "#9CA3AF" }}>اضغط لرفع صورة</span></div>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(URL.createObjectURL(f)); }} />
      </div>
    </div>
  );
}
function SearchBar({ q, setQ, placeholder }) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 flex-1 max-w-xs">
      <Search size={15} color="#9CA3AF" />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} className="flex-1 outline-none text-sm bg-transparent" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* VENDORS                                                              */
/* ------------------------------------------------------------------ */
const VENDOR_STATUS = { active: { label: "نشط", color: C.success }, pending: { label: "قيد المراجعة", color: "#F59E0B" }, suspended: { label: "موقوف", color: "#EF4444" } };

function VendorsAdmin() {
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const filtered = vendors.filter((v) => v.name.includes(q) || v.store.includes(q));
  const setStatus = (id, status) => setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <SearchBar q={q} setQ={setQ} placeholder="بحث عن تاجر..." />
      </div>
      <div className="bg-white rounded-2xl overflow-hidden">
        {filtered.map((v) => (
          <div key={v.id} className="flex items-center gap-3 p-4 relative" style={{ borderBottom: "1px solid #F5F5F5" }}>
            <img src={v.photo} className="w-11 h-11 rounded-full object-cover" alt={v.name} />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate" style={{ color: C.dark }}>{v.name}</p>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>{v.store} · {v.phone}</p>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold" style={{ color: C.dark }}>{v.revenue.toLocaleString()} DH</p>
              <p className="text-[11px]" style={{ color: "#9CA3AF" }}>{v.orders} طلب</p>
            </div>
            <Badge color={VENDOR_STATUS[v.status].color}>{VENDOR_STATUS[v.status].label}</Badge>
            <button onClick={() => setMenuOpen(menuOpen === v.id ? null : v.id)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.bg }}>
              <MoreVertical size={15} />
            </button>
            {menuOpen === v.id && (
              <div className="absolute left-4 top-14 z-10 bg-white rounded-xl shadow-lg py-1 w-44" style={{ border: "1px solid #F0F0F0" }}>
                {v.status === "pending" && (
                  <button onClick={() => { setStatus(v.id, "active"); setMenuOpen(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-right" style={{ color: C.success }}><Check size={13} /> قبول التاجر</button>
                )}
                {v.status !== "suspended" ? (
                  <button onClick={() => { setStatus(v.id, "suspended"); setMenuOpen(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-right" style={{ color: "#EF4444" }}><Ban size={13} /> إيقاف الحساب</button>
                ) : (
                  <button onClick={() => { setStatus(v.id, "active"); setMenuOpen(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-right" style={{ color: C.success }}><PlayCircle size={13} /> إعادة تفعيل</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DRIVERS                                                              */
/* ------------------------------------------------------------------ */
const DRIVER_STATUS = { available: { label: "متاح", color: C.success }, busy: { label: "مشغول", color: C.primary }, offline: { label: "غير متصل", color: "#9CA3AF" } };

function DriversAdmin() {
  const [drivers, setDrivers] = useState(INITIAL_DRIVERS);
  const [q, setQ] = useState("");
  const filtered = drivers.filter((d) => d.name.includes(q));
  const verify = (id) => setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, verified: true } : d)));

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <SearchBar q={q} setQ={setQ} placeholder="بحث عن سائق..." />
      </div>
      <div className="bg-white rounded-2xl overflow-hidden">
        {filtered.map((d) => (
          <div key={d.id} className="flex items-center gap-3 p-4" style={{ borderBottom: "1px solid #F5F5F5" }}>
            <img src={d.photo} className="w-11 h-11 rounded-full object-cover" alt={d.name} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-sm truncate" style={{ color: C.dark }}>{d.name}</p>
                {!d.verified && <Badge color="#F59E0B">غير موثّق</Badge>}
              </div>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>{d.vehicle} · {d.phone}</p>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold flex items-center gap-1" style={{ color: C.dark }}><Star size={11} fill={C.primary} color={C.primary} /> {d.rating}</p>
              <p className="text-[11px]" style={{ color: "#9CA3AF" }}>{d.deliveries} توصيلة</p>
            </div>
            <Badge color={DRIVER_STATUS[d.status].color}>{DRIVER_STATUS[d.status].label}</Badge>
            {!d.verified && (
              <button onClick={() => verify(d.id)} className="text-xs font-bold px-3 py-1.5 rounded-full text-white" style={{ background: C.primary }}>توثيق</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* COUPONS                                                              */
/* ------------------------------------------------------------------ */
function CouponForm({ onClose, onSave }) {
  const [form, setForm] = useState({ code: "", type: "percentage", value: "", minOrder: "", usageLimit: "", perUserLimit: "1", expiry: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(17,24,39,0.5)" }} onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 flex items-center justify-between sticky top-0 bg-white" style={{ borderBottom: "1px solid #F0F0F0" }}>
          <h3 className="font-extrabold text-lg" style={{ color: C.dark }}>كوبون جديد</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <Field label="كود الكوبون" placeholder="SAKHRTI30" value={form.code} onChange={set("code")} />
          <div>
            <label className="text-xs font-bold mb-1.5 block" style={{ color: C.dark }}>نوع الخصم</label>
            <div className="flex gap-2">
              <button onClick={() => setForm((f) => ({ ...f, type: "percentage" }))} className="flex-1 rounded-xl py-2.5 text-sm font-bold" style={{ background: form.type === "percentage" ? "#FFF1EA" : C.bg, color: form.type === "percentage" ? C.primary : "#6B7280" }}>نسبة %</button>
              <button onClick={() => setForm((f) => ({ ...f, type: "fixed" }))} className="flex-1 rounded-xl py-2.5 text-sm font-bold" style={{ background: form.type === "fixed" ? "#FFF1EA" : C.bg, color: form.type === "fixed" ? C.primary : "#6B7280" }}>مبلغ ثابت</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={form.type === "percentage" ? "النسبة %" : "المبلغ DH"} placeholder="30" value={form.value} onChange={set("value")} />
            <Field label="حد أدنى للطلب" placeholder="50" value={form.minOrder} onChange={set("minOrder")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="عدد مرات الاستخدام" placeholder="500" value={form.usageLimit} onChange={set("usageLimit")} />
            <Field label="لكل مستخدم" placeholder="1" value={form.perUserLimit} onChange={set("perUserLimit")} />
          </div>
          <Field label="تاريخ الانتهاء" type="date" value={form.expiry} onChange={set("expiry")} />
        </div>
        <div className="p-5 flex gap-3 sticky bottom-0 bg-white" style={{ borderTop: "1px solid #F0F0F0" }}>
          <button onClick={onClose} className="flex-1 rounded-2xl py-3 font-bold" style={{ background: C.bg, color: C.dark }}>إلغاء</button>
          <button onClick={() => { onSave(form); onClose(); }} className="flex-1 rounded-2xl py-3 font-bold text-white" style={{ background: C.primary }}>حفظ الكوبون</button>
        </div>
      </div>
    </div>
  );
}

function CouponsAdmin() {
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [showForm, setShowForm] = useState(false);
  const toggleActive = (id) => setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  const remove = (id) => setCoupons((prev) => prev.filter((c) => c.id !== id));
  const add = (form) => setCoupons((prev) => [{ id: `cp${Date.now()}`, code: form.code || "NEWCODE", type: form.type, value: Number(form.value) || 0, minOrder: Number(form.minOrder) || 0, usageLimit: Number(form.usageLimit) || 0, used: 0, expiry: form.expiry || "-", active: true }, ...prev]);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold text-white" style={{ background: C.primary }}><Plus size={16} /> إضافة كوبون</button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {coupons.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-sm" style={{ color: C.dark }}>{c.code}</span>
              <button onClick={() => toggleActive(c.id)}><Badge color={c.active ? C.success : "#9CA3AF"}>{c.active ? "مفعّل" : "معطّل"}</Badge></button>
            </div>
            <p className="text-xs mb-2" style={{ color: "#6B7280" }}>
              {c.type === "percentage" ? `خصم ${c.value}%` : `خصم ${c.value} DH`} · حد أدنى {c.minOrder} DH
            </p>
            <div className="w-full h-1.5 rounded-full mb-1.5" style={{ background: C.bg }}>
              <div className="h-full rounded-full" style={{ width: `${Math.min(100, (c.used / c.usageLimit) * 100)}%`, background: C.primary }} />
            </div>
            <div className="flex items-center justify-between text-[11px]" style={{ color: "#9CA3AF" }}>
              <span>{c.used}/{c.usageLimit} استُخدم</span>
              <span className="flex items-center gap-1"><Calendar size={11} /> {c.expiry}</span>
            </div>
            <button onClick={() => remove(c.id)} className="text-xs font-bold mt-2 flex items-center gap-1" style={{ color: "#EF4444" }}><Trash2 size={11} /> حذف</button>
          </div>
        ))}
      </div>
      {showForm && <CouponForm onClose={() => setShowForm(false)} onSave={add} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* BANNERS                                                              */
/* ------------------------------------------------------------------ */
function BannerForm({ onClose, onSave }) {
  const [form, setForm] = useState({ title: "", subtitle: "", link: "", start: "", end: "", img: null });
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(17,24,39,0.5)" }} onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 flex items-center justify-between sticky top-0 bg-white" style={{ borderBottom: "1px solid #F0F0F0" }}>
          <h3 className="font-extrabold text-lg" style={{ color: C.dark }}>بانر جديد</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <ImageUploadBox label="صورة البانر" value={form.img} onChange={set("img")} height="h-32" />
          <Field label="العنوان" placeholder="خصم حتى 30%" value={form.title} onChange={(e) => set("title")(e.target.value)} />
          <Field label="العنوان الفرعي" placeholder="على أشهى المطاعم" value={form.subtitle} onChange={(e) => set("subtitle")(e.target.value)} />
          <Field label="رابط عند الضغط" placeholder="/restaurants" value={form.link} onChange={(e) => set("link")(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="تاريخ البداية" type="date" value={form.start} onChange={(e) => set("start")(e.target.value)} />
            <Field label="تاريخ النهاية" type="date" value={form.end} onChange={(e) => set("end")(e.target.value)} />
          </div>
        </div>
        <div className="p-5 flex gap-3 sticky bottom-0 bg-white" style={{ borderTop: "1px solid #F0F0F0" }}>
          <button onClick={onClose} className="flex-1 rounded-2xl py-3 font-bold" style={{ background: C.bg, color: C.dark }}>إلغاء</button>
          <button onClick={() => { onSave(form); onClose(); }} className="flex-1 rounded-2xl py-3 font-bold text-white" style={{ background: C.primary }}>نشر البانر</button>
        </div>
      </div>
    </div>
  );
}

function BannersAdmin() {
  const [banners, setBanners] = useState(INITIAL_BANNERS);
  const [showForm, setShowForm] = useState(false);
  const toggleActive = (id) => setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b)));
  const remove = (id) => setBanners((prev) => prev.filter((b) => b.id !== id));
  const add = (form) => setBanners((prev) => [{ id: `b${Date.now()}`, title: form.title || "بانر جديد", subtitle: form.subtitle, img: form.img || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=60", active: true, start: form.start, end: form.end }, ...prev]);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold text-white" style={{ background: C.primary }}><Plus size={16} /> إضافة بانر</button>
      </div>
      <div className="flex flex-col gap-3">
        {banners.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl p-3 flex items-center gap-3">
            <img src={b.img} className="w-20 h-14 rounded-xl object-cover" alt={b.title} />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate" style={{ color: C.dark }}>{b.title}</p>
              <p className="text-xs truncate" style={{ color: "#9CA3AF" }}>{b.subtitle}</p>
              <p className="text-[11px]" style={{ color: "#C1C5CC" }}>{b.start} — {b.end}</p>
            </div>
            <button onClick={() => toggleActive(b.id)}><Badge color={b.active ? C.success : "#9CA3AF"}>{b.active ? "مفعّل" : "معطّل"}</Badge></button>
            <button onClick={() => remove(b.id)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.bg }}><Trash2 size={14} color="#EF4444" /></button>
          </div>
        ))}
      </div>
      {showForm && <BannerForm onClose={() => setShowForm(false)} onSave={add} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* REVIEWS                                                              */
/* ------------------------------------------------------------------ */
function ReviewsAdmin() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const toggleVisible = (id) => setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, visible: !r.visible } : r)));

  return (
    <div className="flex flex-col gap-3">
      {reviews.map((r) => (
        <div key={r.id} className="bg-white rounded-2xl p-4" style={{ opacity: r.visible ? 1 : 0.55 }}>
          <div className="flex items-center justify-between mb-1.5">
            <div>
              <p className="font-bold text-sm" style={{ color: C.dark }}>{r.customer}</p>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>{r.store} · {r.date}</p>
            </div>
            <span className="flex items-center gap-1 font-bold text-sm" style={{ color: C.dark }}>
              <Star size={13} fill={C.primary} color={C.primary} /> {r.rating}
            </span>
          </div>
          <p className="text-sm mb-3" style={{ color: "#6B7280" }}>{r.comment}</p>
          <button onClick={() => toggleVisible(r.id)} className="flex items-center gap-1.5 text-xs font-bold" style={{ color: r.visible ? "#EF4444" : C.success }}>
            {r.visible ? <><EyeOff size={13} /> إخفاء التقييم</> : <><Eye size={13} /> إظهار التقييم</>}
          </button>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ANALYTICS                                                            */
/* ------------------------------------------------------------------ */
function AnalyticsAdmin() {
  const maxRevenue = Math.max(...ANALYTICS.revenueByMonth.map((m) => m.v));
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {ANALYTICS.kpis.map((k) => (
          <div key={k.label} className="bg-white rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#FFF1EA" }}><k.icon size={15} color={C.primary} /></div>
              <span className="text-[11px] font-bold flex items-center gap-0.5" style={{ color: k.up ? C.success : "#EF4444" }}>
                {k.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {k.trend}
              </span>
            </div>
            <p className="font-extrabold text-lg" style={{ color: C.dark }}>{k.value}</p>
            <p className="text-[11px] mt-0.5" style={{ color: "#9CA3AF" }}>{k.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5">
        <h3 className="font-extrabold text-sm mb-4" style={{ color: C.dark }}>الإيرادات الشهرية (بالآلاف DH)</h3>
        <div className="flex items-end gap-3 h-40">
          {ANALYTICS.revenueByMonth.map((m) => (
            <div key={m.m} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-bold" style={{ color: C.dark }}>{m.v}k</span>
              <div className="w-full rounded-lg" style={{ height: `${(m.v / maxRevenue) * 100}%`, background: `linear-gradient(180deg, ${C.primary}, ${C.primaryDark})`, minHeight: 8 }} />
              <span className="text-[10px]" style={{ color: "#9CA3AF" }}>{m.m}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5">
        <h3 className="font-extrabold text-sm mb-3" style={{ color: C.dark }}>أفضل المحلات أداءً</h3>
        <div className="flex flex-col gap-3">
          {ANALYTICS.topStores.map((s, i) => (
            <div key={s.name} className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold" style={{ background: "#FFF1EA", color: C.primary }}>{i + 1}</span>
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ color: C.dark }}>{s.name}</p>
                <p className="text-[11px]" style={{ color: "#9CA3AF" }}>{s.orders} طلب</p>
              </div>
              <span className="font-bold text-sm" style={{ color: C.dark }}>{s.revenue.toLocaleString()} DH</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PAGE — تنقل توضيحي بين الأقسام الستة                                 */
/* ------------------------------------------------------------------ */
const SECTIONS = [
  { id: "vendors", label: "التجار", icon: Users, comp: VendorsAdmin },
  { id: "drivers", label: "السائقون", icon: Bike, comp: DriversAdmin },
  { id: "coupons", label: "الكوبونات", icon: Ticket, comp: CouponsAdmin },
  { id: "banners", label: "البانرات", icon: ImageIcon, comp: BannersAdmin },
  { id: "reviews", label: "التقييمات", icon: Star, comp: ReviewsAdmin },
  { id: "analytics", label: "Analytics", icon: BarChart3, comp: AnalyticsAdmin },
];

export default function SakhrtiAdminExtended() {
  const [active, setActive] = useState("vendors");
  const Current = SECTIONS.find((s) => s.id === active).comp;

  return (
    <div dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif", background: C.bg, minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap'); .no-scrollbar::-webkit-scrollbar{display:none}`}</style>

      <div className="bg-white sticky top-0 z-30" style={{ borderBottom: "1px solid #F0F0F0" }}>
        <div className="px-5 pt-4 pb-2">
          <h1 className="font-extrabold text-lg" style={{ color: C.dark }}>لوحة تحكم سخرتي — أقسام إضافية</h1>
        </div>
        <div className="flex gap-2 px-5 pb-3 overflow-x-auto no-scrollbar">
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => setActive(s.id)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold shrink-0" style={{ background: active === s.id ? C.primary : C.bg, color: active === s.id ? "#fff" : "#6B7280" }}>
              <s.icon size={14} /> {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-5">
        <Current />
      </div>
    </div>
  );
}
