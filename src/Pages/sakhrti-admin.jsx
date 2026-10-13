import React, { useState, useRef } from "react";
import {
  LayoutDashboard, ShoppingBag, Store, Package, Tag, Users, Percent,
  Image as ImageIcon, TrendingUp, DollarSign, Clock, Star, Plus,
  Search, MoreVertical, X, Upload, Check, ChevronDown, Eye, Pencil,
  Trash2, Ban, PlayCircle, Menu
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
/* MOCK DATA — services/admin/*.ts سيربطها بجداول stores/products/orders */
/* عبر Supabase مع RLS تمنع أي وصول غير مخوّل                          */
/* ------------------------------------------------------------------ */
const STATS = [
  { label: "الإيرادات اليوم", value: "12,480 DH", change: "+8.2%", icon: DollarSign },
  { label: "الطلبات اليوم", value: "342", change: "+4.1%", icon: ShoppingBag },
  { label: "محلات نشطة", value: "186", change: "+3", icon: Store },
  { label: "مستخدمون جدد", value: "57", change: "+12%", icon: Users },
];

const INITIAL_STORES = [
  { id: "s1", name: "Burger Boss", category: "برغر", city: "برشيد", phone: "0522334455", status: "active", cover: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=60", commission: 10 },
  { id: "s2", name: "بيتزا الأصالة", category: "بيتزا", city: "الدار البيضاء", phone: "0522445566", status: "active", cover: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=60", commission: 12 },
  { id: "s3", name: "مطعم الأطلس", category: "مغربي", city: "برشيد", phone: "0522556677", status: "pending", cover: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&q=60", commission: 10 },
  { id: "s4", name: "شواء الدار", category: "مشاوي", city: "سطات", phone: "0522667788", status: "suspended", cover: "https://images.unsplash.com/photo-1598515213692-5f252f70a26e?w=200&q=60", commission: 15 },
];

const INITIAL_PRODUCTS = [
  { id: "p1", name: "Cheese Burger", store: "Burger Boss", category: "برغر", price: 39, stock: true, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=60" },
  { id: "p2", name: "بيتزا مارغريتا", store: "بيتزا الأصالة", category: "بيتزا", price: 55, stock: true, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=60" },
  { id: "p3", name: "طاجين لحم", store: "مطعم الأطلس", category: "مغربي", price: 68, stock: false, img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&q=60" },
];

const INITIAL_CATEGORIES = [
  { id: "c1", name: "المطاعم", nameEn: "Restaurants", order: 1, active: true, img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&q=60" },
  { id: "c2", name: "البرغر", nameEn: "Burgers", order: 2, active: true, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&q=60" },
  { id: "c3", name: "البيتزا", nameEn: "Pizza", order: 3, active: true, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&q=60" },
  { id: "c4", name: "البقالة", nameEn: "Grocery", order: 4, active: false, img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&q=60" },
];

const LIVE_ORDERS = [
  { id: "SKH-102938", store: "Burger Boss", customer: "سعيد بنعلي", total: 94, status: "preparing", time: "12:25" },
  { id: "SKH-102937", store: "بيتزا الأصالة", customer: "مريم الفاسي", total: 65, status: "new", time: "12:22" },
  { id: "SKH-102935", store: "مطعم الأطلس", customer: "يوسف علوي", total: 120, status: "on_the_way", time: "12:10" },
  { id: "SKH-102930", store: "شواء الدار", customer: "أمين الطاهري", total: 78, status: "delivered", time: "11:50" },
];

const STATUS_LABELS = {
  new: { label: "جديد", color: "#3B82F6" },
  preparing: { label: "قيد التحضير", color: C.primary },
  ready: { label: "جاهز", color: "#8B5CF6" },
  on_the_way: { label: "فالطريق", color: "#F59E0B" },
  delivered: { label: "تم التوصيل", color: C.success },
  cancelled: { label: "ملغي", color: "#EF4444" },
};

const NAV = [
  { id: "dashboard", label: "لوحة القيادة", icon: LayoutDashboard },
  { id: "orders", label: "الطلبات", icon: ShoppingBag },
  { id: "stores", label: "المحلات", icon: Store },
  { id: "products", label: "المنتجات", icon: Package },
  { id: "categories", label: "التصنيفات", icon: Tag },
];
const NAV_SOON = [
  { id: "vendors", label: "التجار" }, { id: "drivers", label: "السائقون" },
  { id: "offers", label: "العروض" }, { id: "coupons", label: "الكوبونات" },
  { id: "banners", label: "البانرات" }, { id: "reviews", label: "التقييمات" },
];

/* ------------------------------------------------------------------ */
/* SHARED                                                              */
/* ------------------------------------------------------------------ */
function Badge({ color, children }) {
  return <span className="text-[11px] font-bold px-2 py-1 rounded-full" style={{ background: `${color}1A`, color }}>{children}</span>;
}

function ImageUploadBox({ label, value, onChange, height = "h-32" }) {
  const inputRef = useRef(null);
  return (
    <div>
      <label className="text-xs font-bold mb-1.5 block" style={{ color: C.dark }}>{label}</label>
      <div
        className={`relative ${height} rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer`}
        style={{ background: C.bg, border: "1.5px dashed #D1D5DB" }}
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <>
            <img src={value} className="w-full h-full object-cover" alt={label} />
            <button
              onClick={(e) => { e.stopPropagation(); onChange(null); }}
              className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-center px-4">
            <Upload size={22} color="#9CA3AF" />
            <span className="text-xs font-semibold" style={{ color: "#9CA3AF" }}>اضغط لرفع صورة</span>
          </div>
        )}
        {/* في التطبيق الحقيقي: رفع مباشر لـ Supabase Storage + ضغط الصورة قبل الحفظ */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onChange(URL.createObjectURL(file));
          }}
        />
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="text-xs font-bold mb-1.5 block" style={{ color: C.dark }}>{label}</label>
      <input {...props} className="w-full rounded-xl px-3 py-2.5 text-sm outline-none" style={{ background: C.bg }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DASHBOARD                                                           */
/* ------------------------------------------------------------------ */
function DashboardHome() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#FFF1EA" }}>
                <s.icon size={17} color={C.primary} />
              </div>
              <span className="text-xs font-bold flex items-center gap-0.5" style={{ color: C.success }}>
                <TrendingUp size={12} /> {s.change}
              </span>
            </div>
            <p className="font-extrabold text-xl" style={{ color: C.dark }}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-base" style={{ color: C.dark }}>الطلبات الحية</h3>
          <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color: C.success }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: C.success }} /> مباشر
          </span>
        </div>
        <div className="flex flex-col">
          {LIVE_ORDERS.map((o) => (
            <div key={o.id} className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid #F5F5F5" }}>
              <div>
                <p className="font-bold text-sm" style={{ color: C.dark }}>{o.id}</p>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>{o.store} · {o.customer}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge color={STATUS_LABELS[o.status].color}>{STATUS_LABELS[o.status].label}</Badge>
                <span className="text-sm font-bold w-16 text-left" style={{ color: C.dark }}>{o.total} DH</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ORDERS                                                               */
/* ------------------------------------------------------------------ */
function OrdersAdmin() {
  const [orders, setOrders] = useState(LIVE_ORDERS);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const updateStatus = (id, status) => setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

  return (
    <div className="bg-white rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar">
        {["all", ...Object.keys(STATUS_LABELS)].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-full text-xs font-bold shrink-0"
            style={{ background: filter === f ? C.dark : C.bg, color: filter === f ? "#fff" : "#6B7280" }}
          >
            {f === "all" ? "الكل" : STATUS_LABELS[f].label}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-right" style={{ color: "#9CA3AF" }}>
              <th className="font-semibold pb-2">رقم الطلب</th>
              <th className="font-semibold pb-2">المحل</th>
              <th className="font-semibold pb-2">الزبون</th>
              <th className="font-semibold pb-2">المبلغ</th>
              <th className="font-semibold pb-2">الحالة</th>
              <th className="font-semibold pb-2">الوقت</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} style={{ borderTop: "1px solid #F5F5F5" }}>
                <td className="py-3 font-bold" style={{ color: C.dark }}>{o.id}</td>
                <td className="py-3" style={{ color: "#6B7280" }}>{o.store}</td>
                <td className="py-3" style={{ color: "#6B7280" }}>{o.customer}</td>
                <td className="py-3 font-bold" style={{ color: C.dark }}>{o.total} DH</td>
                <td className="py-3">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="text-xs font-bold rounded-full px-2 py-1 outline-none"
                    style={{ background: `${STATUS_LABELS[o.status].color}1A`, color: STATUS_LABELS[o.status].color }}
                  >
                    {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </td>
                <td className="py-3" style={{ color: "#9CA3AF" }}>{o.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* STORE FORM (CREATE / EDIT)                                          */
/* ------------------------------------------------------------------ */
function StoreForm({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || {
    name: "", category: "", phone: "", city: "", address: "",
    deliveryFee: "", minOrder: "", commission: "10", cover: null, logo: null,
  });
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(17,24,39,0.5)" }} onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 flex items-center justify-between sticky top-0 bg-white z-10" style={{ borderBottom: "1px solid #F0F0F0" }}>
          <h3 className="font-extrabold text-lg" style={{ color: C.dark }}>{initial ? "تعديل المحل" : "إضافة محل جديد"}</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <ImageUploadBox label="شعار المحل" value={form.logo} onChange={set("logo")} height="h-24" />
            <ImageUploadBox label="صورة الغلاف" value={form.cover} onChange={set("cover")} height="h-24" />
          </div>
          <Field label="اسم المحل" placeholder="مثال: Burger Boss" value={form.name} onChange={(e) => set("name")(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="التصنيف" placeholder="برغر، بيتزا..." value={form.category} onChange={(e) => set("category")(e.target.value)} />
            <Field label="الهاتف" placeholder="05XXXXXXXX" value={form.phone} onChange={(e) => set("phone")(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="المدينة" placeholder="برشيد" value={form.city} onChange={(e) => set("city")(e.target.value)} />
            <Field label="العنوان الكامل" placeholder="الشارع، الرقم..." value={form.address} onChange={(e) => set("address")(e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="رسوم التوصيل" placeholder="10 DH" value={form.deliveryFee} onChange={(e) => set("deliveryFee")(e.target.value)} />
            <Field label="الحد الأدنى" placeholder="40 DH" value={form.minOrder} onChange={(e) => set("minOrder")(e.target.value)} />
            <Field label="العمولة %" placeholder="10" value={form.commission} onChange={(e) => set("commission")(e.target.value)} />
          </div>
        </div>
        <div className="p-5 flex gap-3 sticky bottom-0 bg-white" style={{ borderTop: "1px solid #F0F0F0" }}>
          <button onClick={onClose} className="flex-1 rounded-2xl py-3 font-bold" style={{ background: C.bg, color: C.dark }}>إلغاء</button>
          <button
            onClick={() => { onSave(form); onClose(); }}
            className="flex-1 rounded-2xl py-3 font-bold text-white"
            style={{ background: C.primary }}
          >
            حفظ ونشر
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* STORES LIST                                                         */
/* ------------------------------------------------------------------ */
const STORE_STATUS = {
  active: { label: "نشط", color: C.success },
  pending: { label: "قيد المراجعة", color: "#F59E0B" },
  suspended: { label: "موقوف", color: "#EF4444" },
};

function StoresAdmin() {
  const [stores, setStores] = useState(INITIAL_STORES);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);

  const filtered = stores.filter((s) => s.name.includes(q) || s.category.includes(q));

  const addStore = (form) =>
    setStores((prev) => [
      { id: `s${Date.now()}`, name: form.name || "محل جديد", category: form.category || "-", city: form.city || "-", phone: form.phone, status: "active", cover: form.cover || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=60", commission: Number(form.commission) || 10 },
      ...prev,
    ]);

  const setStatus = (id, status) => setStores((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 flex-1 max-w-xs">
          <Search size={15} color="#9CA3AF" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="بحث عن محل..." className="flex-1 outline-none text-sm bg-transparent" />
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold text-white" style={{ background: C.primary }}>
          <Plus size={16} /> إضافة محل
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden">
        {filtered.map((s) => (
          <div key={s.id} className="flex items-center gap-3 p-4 relative" style={{ borderBottom: "1px solid #F5F5F5" }}>
            <img src={s.cover} className="w-12 h-12 rounded-xl object-cover" alt={s.name} />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate" style={{ color: C.dark }}>{s.name}</p>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>{s.category} · {s.city} · عمولة {s.commission}%</p>
            </div>
            <Badge color={STORE_STATUS[s.status].color}>{STORE_STATUS[s.status].label}</Badge>
            <button onClick={() => setMenuOpen(menuOpen === s.id ? null : s.id)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.bg }}>
              <MoreVertical size={15} />
            </button>
            {menuOpen === s.id && (
              <div className="absolute left-4 top-14 z-10 bg-white rounded-xl shadow-lg py-1 w-44" style={{ border: "1px solid #F0F0F0" }}>
                <button onClick={() => { setEditing(s); setShowForm(true); setMenuOpen(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-right" style={{ color: C.dark }}>
                  <Pencil size={13} /> تعديل
                </button>
                {s.status !== "suspended" ? (
                  <button onClick={() => { setStatus(s.id, "suspended"); setMenuOpen(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-right" style={{ color: "#EF4444" }}>
                    <Ban size={13} /> إيقاف المحل
                  </button>
                ) : (
                  <button onClick={() => { setStatus(s.id, "active"); setMenuOpen(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-right" style={{ color: C.success }}>
                    <PlayCircle size={13} /> إعادة تفعيل
                  </button>
                )}
                {s.status === "pending" && (
                  <button onClick={() => { setStatus(s.id, "active"); setMenuOpen(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-right" style={{ color: C.success }}>
                    <Check size={13} /> قبول المحل
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center py-8 text-sm" style={{ color: "#9CA3AF" }}>ماكاينش نتائج</p>}
      </div>

      {showForm && (
        <StoreForm
          initial={editing}
          onClose={() => setShowForm(false)}
          onSave={(form) => (editing ? setStores((prev) => prev.map((s) => (s.id === editing.id ? { ...s, ...form } : s))) : addStore(form))}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PRODUCT FORM                                                        */
/* ------------------------------------------------------------------ */
function ProductForm({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || { name: "", store: "", category: "", price: "", oldPrice: "", desc: "", img: null, stock: true });
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(17,24,39,0.5)" }} onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 flex items-center justify-between sticky top-0 bg-white z-10" style={{ borderBottom: "1px solid #F0F0F0" }}>
          <h3 className="font-extrabold text-lg" style={{ color: C.dark }}>{initial ? "تعديل المنتج" : "إضافة منتج جديد"}</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <ImageUploadBox label="صورة المنتج" value={form.img} onChange={set("img")} />
          <Field label="اسم المنتج" placeholder="مثال: Cheese Burger" value={form.name} onChange={(e) => set("name")(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="المحل" placeholder="اختر المحل" value={form.store} onChange={(e) => set("store")(e.target.value)} />
            <Field label="التصنيف" placeholder="برغر، بيتزا..." value={form.category} onChange={(e) => set("category")(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="السعر (DH)" placeholder="39" value={form.price} onChange={(e) => set("price")(e.target.value)} />
            <Field label="السعر قبل الخصم" placeholder="49" value={form.oldPrice} onChange={(e) => set("oldPrice")(e.target.value)} />
          </div>
          <Field label="الوصف" placeholder="وصف قصير للمنتج" value={form.desc} onChange={(e) => set("desc")(e.target.value)} />
          <label className="flex items-center justify-between">
            <span className="text-xs font-bold" style={{ color: C.dark }}>متوفر فالمخزون</span>
            <button
              onClick={() => set("stock")(!form.stock)}
              className="w-11 h-6 rounded-full relative"
              style={{ background: form.stock ? C.success : "#E5E7EB" }}
            >
              <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white" style={{ [form.stock ? "right" : "left"]: 2 }} />
            </button>
          </label>
        </div>
        <div className="p-5 flex gap-3 sticky bottom-0 bg-white" style={{ borderTop: "1px solid #F0F0F0" }}>
          <button onClick={onClose} className="flex-1 rounded-2xl py-3 font-bold" style={{ background: C.bg, color: C.dark }}>إلغاء</button>
          <button onClick={() => { onSave(form); onClose(); }} className="flex-1 rounded-2xl py-3 font-bold text-white" style={{ background: C.primary }}>حفظ المنتج</button>
        </div>
      </div>
    </div>
  );
}

function ProductsAdmin() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [q, setQ] = useState("");

  const filtered = products.filter((p) => p.name.includes(q));

  const addProduct = (form) =>
    setProducts((prev) => [
      { id: `p${Date.now()}`, name: form.name || "منتج جديد", store: form.store || "-", category: form.category || "-", price: Number(form.price) || 0, stock: form.stock, img: form.img || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=60" },
      ...prev,
    ]);

  const remove = (id) => setProducts((prev) => prev.filter((p) => p.id !== id));

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 flex-1 max-w-xs">
          <Search size={15} color="#9CA3AF" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="بحث عن منتج..." className="flex-1 outline-none text-sm bg-transparent" />
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold text-white" style={{ background: C.primary }}>
          <Plus size={16} /> إضافة منتج
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden">
        {filtered.map((p) => (
          <div key={p.id} className="flex items-center gap-3 p-4" style={{ borderBottom: "1px solid #F5F5F5" }}>
            <img src={p.img} className="w-12 h-12 rounded-xl object-cover" alt={p.name} />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate" style={{ color: C.dark }}>{p.name}</p>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>{p.store} · {p.category}</p>
            </div>
            <span className="font-bold text-sm" style={{ color: C.dark }}>{p.price} DH</span>
            <Badge color={p.stock ? C.success : "#EF4444"}>{p.stock ? "متوفر" : "غير متوفر"}</Badge>
            <button onClick={() => { setEditing(p); setShowForm(true); }} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.bg }}>
              <Pencil size={14} />
            </button>
            <button onClick={() => remove(p.id)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.bg }}>
              <Trash2 size={14} color="#EF4444" />
            </button>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center py-8 text-sm" style={{ color: "#9CA3AF" }}>ماكاينش نتائج</p>}
      </div>

      {showForm && (
        <ProductForm
          initial={editing}
          onClose={() => setShowForm(false)}
          onSave={(form) => (editing ? setProducts((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...form, price: Number(form.price) } : p))) : addProduct(form))}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CATEGORIES                                                          */
/* ------------------------------------------------------------------ */
function CategoriesAdmin() {
  const [cats, setCats] = useState(INITIAL_CATEGORIES);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [img, setImg] = useState(null);

  const toggleActive = (id) => setCats((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  const remove = (id) => setCats((prev) => prev.filter((c) => c.id !== id));
  const add = () => {
    if (!name.trim()) return;
    setCats((prev) => [...prev, { id: `c${Date.now()}`, name, nameEn: "", order: prev.length + 1, active: true, img: img || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&q=60" }]);
    setName(""); setImg(null); setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold text-white" style={{ background: C.primary }}>
          <Plus size={16} /> إضافة تصنيف
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cats.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl p-3 text-center">
            <img src={c.img} className="w-14 h-14 rounded-xl object-cover mx-auto mb-2" alt={c.name} />
            <p className="font-bold text-sm mb-1" style={{ color: C.dark }}>{c.name}</p>
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => toggleActive(c.id)}>
                <Badge color={c.active ? C.success : "#9CA3AF"}>{c.active ? "مفعّل" : "معطّل"}</Badge>
              </button>
              <button onClick={() => remove(c.id)}><Trash2 size={13} color="#EF4444" /></button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(17,24,39,0.5)" }} onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-3xl w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-lg" style={{ color: C.dark }}>تصنيف جديد</h3>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="flex flex-col gap-3">
              <ImageUploadBox label="صورة التصنيف" value={img} onChange={setImg} height="h-24" />
              <Field label="اسم التصنيف" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: الحلويات" />
              <button onClick={add} className="w-full rounded-2xl py-3 font-bold text-white mt-1" style={{ background: C.primary }}>حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PAGE                                                                 */
/* ------------------------------------------------------------------ */
export default function SakhrtiAdmin() {
  const [active, setActive] = useState("dashboard");
  const [mobileNav, setMobileNav] = useState(false);

  const titles = { dashboard: "لوحة القيادة", orders: "إدارة الطلبات", stores: "إدارة المحلات", products: "إدارة المنتجات", categories: "إدارة التصنيفات" };

  const renderContent = () => {
    switch (active) {
      case "dashboard": return <DashboardHome />;
      case "orders": return <OrdersAdmin />;
      case "stores": return <StoresAdmin />;
      case "products": return <ProductsAdmin />;
      case "categories": return <CategoriesAdmin />;
      default: return null;
    }
  };

  return (
    <div dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif", background: C.bg, minHeight: "100vh" }} className="flex">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap'); .no-scrollbar::-webkit-scrollbar{display:none}`}</style>

      {/* Sidebar */}
      <aside className={`fixed md:static z-40 top-0 bottom-0 right-0 w-64 bg-white transition-transform ${mobileNav ? "translate-x-0" : "translate-x-full md:translate-x-0"}`} style={{ borderLeft: "1px solid #F0F0F0" }}>
        <div className="p-5 flex items-center gap-2" style={{ borderBottom: "1px solid #F0F0F0" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})` }}>س</div>
          <div>
            <p className="font-extrabold text-sm" style={{ color: C.dark }}>سخرتي Admin</p>
            <p className="text-[10px]" style={{ color: "#9CA3AF" }}>/admin</p>
          </div>
        </div>
        <nav className="p-3 flex flex-col gap-1">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => { setActive(n.id); setMobileNav(false); }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold"
              style={{ background: active === n.id ? "#FFF1EA" : "transparent", color: active === n.id ? C.primary : "#6B7280" }}
            >
              <n.icon size={17} /> {n.label}
            </button>
          ))}
          <div className="mt-3 pt-3" style={{ borderTop: "1px solid #F0F0F0" }}>
            <p className="text-[10px] font-bold px-3 mb-1" style={{ color: "#C1C5CC" }}>قريباً — مراحل قادمة</p>
            {NAV_SOON.map((n) => (
              <div key={n.id} className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold" style={{ color: "#D1D5DB" }}>
                {n.label}
              </div>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-white px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #F0F0F0" }}>
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setMobileNav(!mobileNav)}><Menu size={20} /></button>
            <h1 className="font-extrabold text-lg" style={{ color: C.dark }}>{titles[active]}</h1>
          </div>
          <div className="w-9 h-9 rounded-full overflow-hidden">
            <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&q=60" className="w-full h-full object-cover" alt="admin" />
          </div>
        </header>
        <main className="p-5 max-w-6xl mx-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
