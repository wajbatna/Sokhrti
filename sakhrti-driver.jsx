import React, { useState } from "react";
import {
  Bike, Wallet, Package, Clock, MapPin, Star, Phone, Navigation,
  CheckCircle2, Power, TrendingUp, ChevronRight, X, User
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
/* MOCK DATA — services/driver.ts سيربطها بجداول drivers + deliveries   */
/* الطلبات المتاحة تُجلب عبر RPC يقارن current_location بمواقع المحلات  */
/* داخل delivery_radius_km (PostGIS ST_DWithin) بدل التصفية اليدوية     */
/* ------------------------------------------------------------------ */
const DRIVER = { name: "يوسف العلوي", rating: 4.9, vehicle: "دراجة نارية · 4521-A", photo: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=60" };

const AVAILABLE_ORDERS = [
  { id: "SKH-102940", store: "Burger Boss", storeAddr: "شارع محمد الخامس، برشيد", customerAddr: "حي السلام، برشيد", distance: 2.4, payout: 22, items: 3 },
  { id: "SKH-102941", store: "بيتزا الأصالة", storeAddr: "شارع الحسن الثاني، برشيد", customerAddr: "حي النهضة، برشيد", distance: 3.1, payout: 28, items: 1 },
  { id: "SKH-102942", store: "حلويات فاس", storeAddr: "المدينة القديمة، برشيد", customerAddr: "حي الفتح، برشيد", distance: 1.6, payout: 18, items: 2 },
];

const HISTORY = [
  { id: "SKH-102930", store: "شواء الدار", date: "اليوم 11:40", earnings: 24, distance: 3.2 },
  { id: "SKH-102918", store: "مطعم الأطلس", date: "اليوم 10:15", earnings: 19, distance: 2.1 },
  { id: "SKH-102900", store: "Burger Boss", date: "أمس 21:05", earnings: 26, distance: 4.0 },
];

const EARNINGS_SUMMARY = { today: 96, week: 612, deliveries: 18, avgPerDelivery: 22 };

const STATUS_CONFIG = {
  available: { label: "متاح", color: C.success },
  busy: { label: "مشغول", color: C.primary },
  offline: { label: "غير متصل", color: "#9CA3AF" },
};

/* ------------------------------------------------------------------ */
/* STATUS TOGGLE                                                       */
/* ------------------------------------------------------------------ */
function StatusBar({ status, setStatus }) {
  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-20" style={{ borderBottom: "1px solid #F0F0F0" }}>
      <div className="flex items-center gap-2.5">
        <img src={DRIVER.photo} className="w-9 h-9 rounded-full object-cover" alt={DRIVER.name} />
        <div>
          <p className="font-extrabold text-sm" style={{ color: C.dark }}>{DRIVER.name}</p>
          <p className="text-[11px] flex items-center gap-1" style={{ color: "#9CA3AF" }}>
            <Star size={10} fill={C.primary} color={C.primary} /> {DRIVER.rating}
          </p>
        </div>
      </div>
      <div className="flex gap-1.5 bg-gray-50 rounded-full p-1" style={{ background: C.bg }}>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setStatus(key)}
            className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1"
            style={{ background: status === key ? cfg.color : "transparent", color: status === key ? "#fff" : "#9CA3AF" }}
          >
            {key === "offline" && <Power size={11} />} {cfg.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EARNINGS STRIP                                                      */
/* ------------------------------------------------------------------ */
function EarningsStrip() {
  const items = [
    { label: "أرباح اليوم", value: `${EARNINGS_SUMMARY.today} DH`, icon: Wallet },
    { label: "أرباح الأسبوع", value: `${EARNINGS_SUMMARY.week} DH`, icon: TrendingUp },
    { label: "توصيلات اليوم", value: EARNINGS_SUMMARY.deliveries, icon: Package },
  ];
  return (
    <div className="grid grid-cols-3 gap-3 p-4">
      {items.map((it) => (
        <div key={it.label} className="bg-white rounded-2xl p-3 text-center">
          <it.icon size={17} color={C.primary} className="mx-auto mb-1.5" />
          <p className="font-extrabold text-sm" style={{ color: C.dark }}>{it.value}</p>
          <p className="text-[10px] mt-0.5" style={{ color: "#9CA3AF" }}>{it.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* AVAILABLE ORDER CARD                                                 */
/* ------------------------------------------------------------------ */
function AvailableOrderCard({ order, onAccept }) {
  return (
    <div className="bg-white rounded-2xl p-4 mb-3">
      <div className="flex items-center justify-between mb-3">
        <span className="font-extrabold text-sm" style={{ color: C.dark }}>{order.id}</span>
        <span className="font-extrabold text-sm" style={{ color: C.success }}>+{order.payout} DH</span>
      </div>
      <div className="flex flex-col gap-2 mb-3">
        <div className="flex items-start gap-2">
          <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#FFF1EA" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.primary }} />
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: C.dark }}>{order.store}</p>
            <p className="text-[11px]" style={{ color: "#9CA3AF" }}>{order.storeAddr}</p>
          </div>
        </div>
        <div className="w-px h-3 mr-2.5" style={{ background: "#E5E7EB" }} />
        <div className="flex items-start gap-2">
          <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#DCFCE7" }}>
            <MapPin size={11} color={C.success} />
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: C.dark }}>توصيل للزبون</p>
            <p className="text-[11px]" style={{ color: "#9CA3AF" }}>{order.customerAddr}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between text-[11px] font-semibold mb-3" style={{ color: "#6B7280" }}>
        <span>{order.distance} كم</span>
        <span>{order.items} منتجات</span>
      </div>
      <button onClick={() => onAccept(order)} className="w-full rounded-2xl py-2.5 font-bold text-white text-sm" style={{ background: C.primary }}>
        قبول الطلب
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CURRENT DELIVERY                                                     */
/* ------------------------------------------------------------------ */
function CurrentDelivery({ order, onAdvance, onCancel }) {
  const stages = [
    { id: "accepted", label: "توجه لاستلام الطلب", action: "تم الوصول للمحل" },
    { id: "picked_up", label: "الطلب معاك، وجّه للزبون", action: "تم التوصيل" },
  ];
  const stage = stages[order.stage] || stages[0];

  return (
    <div className="p-4">
      <div className="rounded-2xl p-4 mb-3" style={{ background: "#FFF1EA" }}>
        <div className="flex items-center gap-2 mb-1">
          <Bike size={16} color={C.primary} />
          <span className="font-bold text-sm" style={{ color: C.primary }}>توصيلة جارية</span>
        </div>
        <p className="font-extrabold text-lg" style={{ color: C.dark }}>{order.id}</p>
      </div>

      <div className="bg-white rounded-2xl p-4 mb-3">
        <p className="font-bold text-sm mb-1" style={{ color: C.dark }}>{stage.label}</p>
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={14} color={C.primary} />
          <p className="text-xs" style={{ color: "#6B7280" }}>
            {order.stage === 0 ? order.storeAddr : order.customerAddr}
          </p>
        </div>
        <button className="w-full rounded-2xl py-2.5 font-bold text-sm mb-2 flex items-center justify-center gap-2" style={{ background: C.bg, color: C.dark }}>
          <Navigation size={14} /> فتح المسار
        </button>
        <div className="flex gap-2">
          <button className="flex-1 rounded-2xl py-2.5 flex items-center justify-center gap-1 text-xs font-bold" style={{ background: C.bg, color: C.dark }}>
            <Phone size={13} /> اتصال بالمحل
          </button>
          <button className="flex-1 rounded-2xl py-2.5 flex items-center justify-center gap-1 text-xs font-bold" style={{ background: C.bg, color: C.dark }}>
            <Phone size={13} /> اتصال بالزبون
          </button>
        </div>
      </div>

      <button onClick={onAdvance} className="w-full rounded-2xl py-3.5 font-bold text-white flex items-center justify-center gap-2 mb-2" style={{ background: C.primary }}>
        <CheckCircle2 size={17} /> {stage.action}
      </button>
      <button onClick={onCancel} className="w-full rounded-2xl py-3 font-bold text-sm" style={{ color: "#EF4444" }}>
        الإبلاغ عن مشكلة
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* HISTORY                                                              */
/* ------------------------------------------------------------------ */
function HistoryList() {
  return (
    <div className="p-4">
      <div className="bg-white rounded-2xl p-4 mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs" style={{ color: "#9CA3AF" }}>متوسط الربح لكل توصيلة</p>
          <p className="font-extrabold text-lg" style={{ color: C.dark }}>{EARNINGS_SUMMARY.avgPerDelivery} DH</p>
        </div>
        <TrendingUp size={24} color={C.success} />
      </div>
      <h3 className="font-bold text-sm mb-2" style={{ color: C.dark }}>سجل التوصيلات</h3>
      <div className="flex flex-col gap-2">
        {HISTORY.map((h) => (
          <div key={h.id} className="bg-white rounded-2xl p-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-sm" style={{ color: C.dark }}>{h.store}</p>
              <p className="text-[11px]" style={{ color: "#9CA3AF" }}>{h.id} · {h.date} · {h.distance} كم</p>
            </div>
            <span className="font-bold text-sm" style={{ color: C.success }}>+{h.earnings} DH</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* BOTTOM TABS                                                          */
/* ------------------------------------------------------------------ */
function BottomTabs({ tab, setTab, hasCurrent }) {
  const tabs = [
    { id: "available", label: "طلبات متاحة", icon: Package },
    { id: "current", label: "التوصيلة الحالية", icon: Bike, badge: hasCurrent },
    { id: "history", label: "السجل", icon: Clock },
  ];
  return (
    <div className="bg-white flex sticky bottom-0" style={{ borderTop: "1px solid #F0F0F0" }}>
      {tabs.map((t) => (
        <button key={t.id} onClick={() => setTab(t.id)} className="flex-1 flex flex-col items-center gap-1 py-2.5 relative">
          <t.icon size={19} color={tab === t.id ? C.primary : "#9CA3AF"} />
          {t.badge && <span className="absolute top-1.5 left-1/2 translate-x-3 w-2 h-2 rounded-full" style={{ background: C.primary }} />}
          <span className="text-[10px] font-bold" style={{ color: tab === t.id ? C.primary : "#9CA3AF" }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PAGE                                                                 */
/* ------------------------------------------------------------------ */
export default function SakhrtiDriverDashboard() {
  const [status, setStatus] = useState("available");
  const [tab, setTab] = useState("available");
  const [currentOrder, setCurrentOrder] = useState(null);
  const [toast, setToast] = useState("");

  const acceptOrder = (order) => {
    setCurrentOrder({ ...order, stage: 0 });
    setStatus("busy");
    setTab("current");
  };

  const advanceOrder = () => {
    if (currentOrder.stage === 0) {
      setCurrentOrder((o) => ({ ...o, stage: 1 }));
    } else {
      setToast("تم تسليم الطلب بنجاح ✅ +" + currentOrder.payout + " DH");
      setCurrentOrder(null);
      setStatus("available");
      setTab("available");
      setTimeout(() => setToast(""), 3000);
    }
  };

  return (
    <div dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif", background: C.bg, minHeight: "100vh" }} className="flex flex-col">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');`}</style>

      <StatusBar status={status} setStatus={(s) => { if (!currentOrder) setStatus(s); }} />

      {toast && (
        <div className="fixed top-16 inset-x-4 z-50 bg-white rounded-2xl p-3 shadow-lg flex items-center gap-2" style={{ border: `1px solid ${C.success}` }}>
          <CheckCircle2 size={18} color={C.success} />
          <span className="text-sm font-bold" style={{ color: C.dark }}>{toast}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pb-2">
        {status === "offline" ? (
          <div className="flex flex-col items-center justify-center h-full py-20 text-center px-6">
            <Power size={40} color="#D1D5DB" />
            <p className="font-bold mt-3" style={{ color: "#9CA3AF" }}>أنت غير متصل حالياً</p>
            <p className="text-xs mt-1" style={{ color: "#C1C5CC" }}>بدّل حالتك لـ «متاح» باش تبدا تقبل طلبات</p>
          </div>
        ) : (
          <>
            <EarningsStrip />
            {tab === "available" && (
              <div className="px-4">
                {currentOrder ? (
                  <div className="bg-white rounded-2xl p-6 text-center">
                    <Bike size={32} color={C.primary} className="mx-auto mb-2" />
                    <p className="font-bold text-sm" style={{ color: C.dark }}>عندك توصيلة جارية</p>
                    <button onClick={() => setTab("current")} className="text-xs font-bold mt-1" style={{ color: C.primary }}>عرض التوصيلة الحالية</button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-sm mb-2" style={{ color: C.dark }}>طلبات متاحة قريبة منك ({AVAILABLE_ORDERS.length})</h3>
                    {AVAILABLE_ORDERS.map((o) => <AvailableOrderCard key={o.id} order={o} onAccept={acceptOrder} />)}
                  </>
                )}
              </div>
            )}
            {tab === "current" && (
              currentOrder ? (
                <CurrentDelivery order={currentOrder} onAdvance={advanceOrder} onCancel={() => { setCurrentOrder(null); setStatus("available"); setTab("available"); }} />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                  <Package size={36} color="#D1D5DB" />
                  <p className="font-bold mt-3" style={{ color: "#9CA3AF" }}>ماعندكش توصيلة جارية</p>
                </div>
              )
            )}
            {tab === "history" && <HistoryList />}
          </>
        )}
      </div>

      <BottomTabs tab={tab} setTab={setTab} hasCurrent={!!currentOrder} />
    </div>
  );
}
