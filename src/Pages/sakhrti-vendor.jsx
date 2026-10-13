import React, { useState, useRef } from "react";
import {
  ShoppingBag, Package, Users, Star, Clock, Settings, TrendingUp,
  DollarSign, Check, X, Plus, Pencil, Trash2, Upload, ChevronDown,
  Store, Bell, Menu
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
/* MOCK DATA — services/vendor.ts سيربطها بجداول orders/products المفلترة */
/* بـ RLS على store_id = current vendor's store فقط (Vendor Isolation)   */
/* ------------------------------------------------------------------ */
const STORE = { name: "Burger Boss", logo: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&q=60", isOpen: true };

const STATS = [
  { label: "طلبات اليوم", value: "28", icon: ShoppingBag },
  { label: "إيرادات اليوم", value: "1,940 DH", icon: DollarSign },
  { label: "تقييم المحل", value: "4.8", icon: Star },
  { label: "زبائن هاد الشهر", value: "312", icon: Users },
];

const INITIAL_ORDERS = [
  { id: "SKH-102950", customer: "سعيد بنعلي", items: "2× Cheese Burger", total: 78, status: "new", time: "منذ دقيقتين" },
  { id: "SKH-102949", customer: "مريم الفاسي", items: "1× وجبة Burger Boss", total: 55, status: "new", time: "منذ 5 دقائق" },
  { id: "SKH-102947", customer: "يوسف علوي", items: "3× Classic Burger", total: 105, status: "preparing", time: "منذ 12 دقيقة" },
  { id: "SKH-102944", customer: "أمين الطاهري", items: "1× Spicy Chicken", total: 37, status: "ready", time: "منذ 18 دقيقة" },
];

const INITIAL_PRODUCTS = [
  { id: "p1", name: "Cheese Burger", price: 39, available: true, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&q=60" },
  { id: "p2", name: "Classic Beef Burger", price: 35, available: true, img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=150&q=60" },
  { id: "p3", name: "Spicy Chicken Burger", price: 37, available: false, img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=150&q=60" },
];

const REVIEWS = [
  { customer: "سعيد بنعلي", rating: 5, comment: "طلب لذيذ وتوصيل سريع!", date: "اليوم" },
  { customer: "مريم الفاسي", rating: 4, comment: "زوينة بصح شوية غالية.", date: "أمس" },
];

const HOURS_INIT = {
  السبت: { open: "09:00", close: "23:00", closed: false },
  الأحد: { open: "09:00", close: "23:00", closed: false },
  الإثنين: { open: "09:00", close: "23:00", closed: false },
  الثلاثاء: { open: "09:00", close: "23:00", closed: false },
  الأربعاء: { open: "09:00", close: "23:00", closed: false },
  الخميس: { open: "09:00", close: "23:00", closed: false },
  الجمعة: { open: "14:00", close: "23:00", closed: false },
};

const STATUS_FLOW = {
  new: { label: "جديد", color: "#3B82F6", next: "preparing", nextLabel: "قبول وبدء التحضير" },
  preparing: { label: "قيد التحضير", color: C.primary, next: "ready", nextLabel: "الطلب جاهز" },
  ready: { label: "جاهز للتسليم", color: "#8B5CF6", next: null, nextLabel: "بانتظار السائق" },
};

/* ------------------------------------------------------------------ */
/* HEADER                                                               */
/* ------------------------------------------------------------------ */
function VendorHeader({ isOpen, setIsOpen, setMobileNav }) {
  return (
    <header className="sticky top-0 z-30 bg-white px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #F0F0F0" }}>
      <div className="flex items-center gap-3">
        <button className="md:hidden" onClick={() => setMobileNav(true)}><Menu size={20} /></button>
        <img src={STORE.logo} className="w-9 h-9 rounded-xl object-cover" alt={STORE.name} />
        <div>
          <p className="font-extrabold text-sm" style={{ color: C.dark }}>{STORE.name}</p>
          <p className="text-[10px]" style={{ color: "#9CA3AF" }}>/vendor</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-full flex items-center justify-center relative" style={{ background: C.bg }}>
          <Bell size={16} color={C.dark} />
          <span className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full" style={{ background: C.primary }} />
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-full px-3 py-1.5"
          style={{ background: isOpen ? "#DCFCE7" : "#FEF2F2" }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: isOpen ? C.success : "#EF4444" }} />
          <span className="text-xs font-bold" style={{ color: isOpen ? C.success : "#EF4444" }}>{isOpen ? "المحل مفتوح" : "المحل مغلق"}</span>
        </button>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* DASHBOARD OVERVIEW                                                   */
/* ------------------------------------------------------------------ */
function Overview({ orders }) {
  const newCount = orders.filter((o) => o.status === "new").length;
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: "#FFF1EA" }}>
              <s.icon size={16} color={C.primary} />
            </div>
            <p className="font-extrabold text-lg" style={{ color: C.dark }}>{s.value}</p>
            <p className="text-[11px] mt-0.5" style={{ color: "#9CA3AF" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {newCount > 0 && (
        <div className="rounded-2xl p-4 flex items-center justify-between" style={{ background: "#FFF1EA" }}>
          <span className="text-sm font-bold" style={{ color: C.primary }}>عندك {newCount} طلبات جديدة فانتظار القبول</span>
          <TrendingUp size={20} color={C.primary} />
        </div>
      )}

      <div className="bg-white rounded-2xl p-5">
        <h3 className="font-extrabold text-sm mb-3" style={{ color: C.dark }}>آخر الطلبات</h3>
        <div className="flex flex-col">
          {orders.slice(0, 4).map((o) => (
            <div key={o.id} className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid #F5F5F5" }}>
              <div>
                <p className="font-bold text-sm" style={{ color: C.dark }}>{o.id}</p>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>{o.customer} · {o.items}</p>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: `${STATUS_FLOW[o.status].color}1A`, color: STATUS_FLOW[o.status].color }}>
                {STATUS_FLOW[o.status].label}
              </span>
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
function VendorOrders({ orders, setOrders }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const advance = (id) => setOrders((prev) => prev.map((o) => (o.id === id && STATUS_FLOW[o.status].next ? { ...o, status: STATUS_FLOW[o.status].next } : o)));
  const reject = (id) => setOrders((prev) => prev.filter((o) => o.id !== id));

  return (
    <div>
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
        {["all", "new", "preparing", "ready"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className="px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0" style={{ background: filter === f ? C.dark : C.bg, color: filter === f ? "#fff" : "#6B7280" }}>
            {f === "all" ? "الكل" : STATUS_FLOW[f].label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <p className="text-center py-10 text-sm" style={{ color: "#9CA3AF" }}>ماكاينش طلبات هنا</p>
        ) : filtered.map((o) => (
          <div key={o.id} className="bg-white rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-sm" style={{ color: C.dark }}>{o.id}</span>
              <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: `${STATUS_FLOW[o.status].color}1A`, color: STATUS_FLOW[o.status].color }}>{STATUS_FLOW[o.status].label}</span>
            </div>
            <p className="text-sm font-semibold mb-0.5" style={{ color: C.dark }}>{o.customer}</p>
            <p className="text-xs mb-2" style={{ color: "#9CA3AF" }}>{o.items} · {o.time}</p>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm" style={{ color: C.dark }}>{o.total} DH</span>
            </div>
            <div className="flex gap-2">
              {o.status === "new" && (
                <button onClick={() => reject(o.id)} className="flex-1 rounded-xl py-2.5 text-xs font-bold" style={{ background: "#FEF2F2", color: "#EF4444" }}>رفض الطلب</button>
              )}
              {STATUS_FLOW[o.status].next ? (
                <button onClick={() => advance(o.id)} className="flex-1 rounded-xl py-2.5 text-xs font-bold text-white" style={{ background: C.primary }}>{STATUS_FLOW[o.status].nextLabel}</button>
              ) : (
                <span className="flex-1 rounded-xl py-2.5 text-xs font-bold text-center" style={{ background: C.bg, color: "#9CA3AF" }}>{STATUS_FLOW[o.status].nextLabel}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PRODUCTS                                                             */
/* ------------------------------------------------------------------ */
function VendorProducts({ products, setProducts }) {
  const [showForm, setShowForm] = useState(false);
  const toggleAvailable = (id) => setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, available: !p.available } : p)));
  const remove = (id) => setProducts((prev) => prev.filter((p) => p.id !== id));

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold text-white" style={{ background: C.primary }}>
          <Plus size={16} /> إضافة منتج
        </button>
      </div>
      <div className="bg-white rounded-2xl overflow-hidden">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-3 p-4" style={{ borderBottom: "1px solid #F5F5F5" }}>
            <img src={p.img} className="w-12 h-12 rounded-xl object-cover" alt={p.name} />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate" style={{ color: C.dark }}>{p.name}</p>
              <p className="text-xs font-bold" style={{ color: C.dark }}>{p.price} DH</p>
            </div>
            <button onClick={() => toggleAvailable(p.id)} className="w-11 h-6 rounded-full relative" style={{ background: p.available ? C.success : "#E5E7EB" }}>
              <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white" style={{ [p.available ? "right" : "left"]: 2 }} />
            </button>
            <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.bg }}><Pencil size={13} /></button>
            <button onClick={() => remove(p.id)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.bg }}><Trash2 size={13} color="#EF4444" /></button>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(17,24,39,0.5)" }} onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-3xl w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-lg" style={{ color: C.dark }}>منتج جديد</h3>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <p className="text-sm mb-4" style={{ color: "#9CA3AF" }}>نفس فورم إضافة المنتج المستخدم فلوحة الأدمن، بصلاحية محدودة على محلك فقط.</p>
            <button onClick={() => setShowForm(false)} className="w-full rounded-2xl py-3 font-bold text-white" style={{ background: C.primary }}>حسناً</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* HOURS                                                                */
/* ------------------------------------------------------------------ */
function VendorHours() {
  const [hours, setHours] = useState(HOURS_INIT);
  const update = (day, field, value) => setHours((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));

  return (
    <div className="bg-white rounded-2xl p-5">
      <h3 className="font-extrabold text-sm mb-4" style={{ color: C.dark }}>أوقات العمل</h3>
      <div className="flex flex-col gap-3">
        {Object.entries(hours).map(([day, h]) => (
          <div key={day} className="flex items-center gap-3">
            <span className="w-16 text-sm font-bold shrink-0" style={{ color: C.dark }}>{day}</span>
            {h.closed ? (
              <span className="flex-1 text-xs font-semibold" style={{ color: "#9CA3AF" }}>مغلق</span>
            ) : (
              <div className="flex-1 flex items-center gap-2">
                <input type="time" value={h.open} onChange={(e) => update(day, "open", e.target.value)} className="rounded-lg px-2 py-1.5 text-xs outline-none" style={{ background: C.bg }} />
                <span className="text-xs" style={{ color: "#9CA3AF" }}>—</span>
                <input type="time" value={h.close} onChange={(e) => update(day, "close", e.target.value)} className="rounded-lg px-2 py-1.5 text-xs outline-none" style={{ background: C.bg }} />
              </div>
            )}
            <button onClick={() => update(day, "closed", !h.closed)} className="w-9 h-5 rounded-full relative shrink-0" style={{ background: !h.closed ? C.success : "#E5E7EB" }}>
              <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white" style={{ [!h.closed ? "right" : "left"]: 2 }} />
            </button>
          </div>
        ))}
      </div>
      <button className="w-full rounded-2xl py-3 font-bold text-white mt-5" style={{ background: C.primary }}>حفظ التغييرات</button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* REVIEWS (vendor view — read only)                                    */
/* ------------------------------------------------------------------ */
function VendorReviews() {
  return (
    <div className="flex flex-col gap-3">
      {REVIEWS.map((r, i) => (
        <div key={i} className="bg-white rounded-2xl p-4">
          <div className="flex items-center justify-between mb-1.5">
            <p className="font-bold text-sm" style={{ color: C.dark }}>{r.customer}</p>
            <span className="flex items-center gap-1 font-bold text-sm" style={{ color: C.dark }}><Star size={13} fill={C.primary} color={C.primary} /> {r.rating}</span>
          </div>
          <p className="text-sm mb-1" style={{ color: "#6B7280" }}>{r.comment}</p>
          <p className="text-[11px]" style={{ color: "#C1C5CC" }}>{r.date}</p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* NAV                                                                  */
/* ------------------------------------------------------------------ */
const NAV = [
  { id: "overview", label: "نظرة عامة", icon: TrendingUp },
  { id: "orders", label: "الطلبات", icon: ShoppingBag },
  { id: "products", label: "المنتجات", icon: Package },
  { id: "reviews", label: "التقييمات", icon: Star },
  { id: "hours", label: "أوقات العمل", icon: Clock },
];

/* ------------------------------------------------------------------ */
/* PAGE                                                                 */
/* ------------------------------------------------------------------ */
export default function SakhrtiVendorDashboard() {
  const [active, setActive] = useState("overview");
  const [mobileNav, setMobileNav] = useState(false);
  const [isOpen, setIsOpen] = useState(STORE.isOpen);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  const titles = { overview: "نظرة عامة", orders: "إدارة الطلبات", products: "منتجاتي", reviews: "تقييمات الزبائن", hours: "أوقات العمل" };

  const renderContent = () => {
    switch (active) {
      case "overview": return <Overview orders={orders} />;
      case "orders": return <VendorOrders orders={orders} setOrders={setOrders} />;
      case "products": return <VendorProducts products={products} setProducts={setProducts} />;
      case "reviews": return <VendorReviews />;
      case "hours": return <VendorHours />;
      default: return null;
    }
  };

  return (
    <div dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif", background: C.bg, minHeight: "100vh" }} className="flex">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap'); .no-scrollbar::-webkit-scrollbar{display:none}`}</style>

      <aside className={`fixed md:static z-40 top-0 bottom-0 right-0 w-64 bg-white transition-transform ${mobileNav ? "translate-x-0" : "translate-x-full md:translate-x-0"}`} style={{ borderLeft: "1px solid #F0F0F0" }}>
        <div className="p-5 flex items-center gap-2" style={{ borderBottom: "1px solid #F0F0F0" }}>
          <img src={STORE.logo} className="w-9 h-9 rounded-xl object-cover" alt={STORE.name} />
          <div>
            <p className="font-extrabold text-sm" style={{ color: C.dark }}>{STORE.name}</p>
            <p className="text-[10px]" style={{ color: "#9CA3AF" }}>لوحة التاجر</p>
          </div>
        </div>
        <nav className="p-3 flex flex-col gap-1">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => { setActive(n.id); setMobileNav(false); }} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold" style={{ background: active === n.id ? "#FFF1EA" : "transparent", color: active === n.id ? C.primary : "#6B7280" }}>
              <n.icon size={17} /> {n.label}
              {n.id === "orders" && orders.filter((o) => o.status === "new").length > 0 && (
                <span className="mr-auto text-[10px] font-bold text-white rounded-full w-4 h-4 flex items-center justify-center" style={{ background: C.primary }}>
                  {orders.filter((o) => o.status === "new").length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-3 mt-auto text-[11px] px-6" style={{ color: "#C1C5CC" }}>
          لا يمكنك الوصول لإيرادات أو بيانات محلات أخرى — صلاحيتك محصورة بمحلك فقط.
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <VendorHeader isOpen={isOpen} setIsOpen={setIsOpen} setMobileNav={setMobileNav} />
        <div className="px-5 pt-3 md:hidden">
          <h1 className="font-extrabold text-lg" style={{ color: C.dark }}>{titles[active]}</h1>
        </div>
        <main className="p-5 max-w-4xl mx-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
