import React, { useState, useRef, useMemo } from "react";
import {
  ArrowRight, Star, Clock, Heart, Share2, ChevronLeft, ChevronRight,
  X, Plus, Minus, ShoppingCart, MapPin, Phone, CreditCard, Wallet,
  Ticket, Check, Truck, Receipt, MessageSquare
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
/* MOCK DATA — يجب استبدالها بـ services/menu.ts متصلة بـ Supabase لاحقاً */
/* ------------------------------------------------------------------ */
const RESTAURANT = {
  name: "Burger Boss",
  cover: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&q=60",
  logo: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&q=60",
  rating: 4.8,
  reviews: 612,
  time: "25-35 د",
  fee: "10 DH",
  min: "40 DH",
  hours: "مفتوح · يسد الساعة 23:00",
};

const MENU_SECTIONS = [
  {
    id: "popular",
    name: "الأكثر طلباً",
    items: [
      {
        id: "p1", name: "Cheese Burger", desc: "برغر لحم بقري، جبن شيدر، خس، طماطم، صلصة خاصة",
        price: 39, oldPrice: 49, popular: true,
        img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=60",
        extras: [
          { id: "e1", name: "Extra Cheese", price: 5 },
          { id: "e2", name: "Double Meat", price: 15 },
          { id: "e3", name: "Extra Sauce", price: 3 },
        ],
      },
      {
        id: "p2", name: "Classic Beef Burger", desc: "برغر لحم بقري كلاسيكي مع خضار طازجة",
        price: 35, popular: true,
        img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&q=60",
        extras: [
          { id: "e1", name: "Extra Cheese", price: 5 },
          { id: "e3", name: "Extra Sauce", price: 3 },
        ],
      },
    ],
  },
  {
    id: "burgers",
    name: "البرغر",
    items: [
      {
        id: "p3", name: "Spicy Chicken Burger", desc: "برغر دجاج مقرمش حار مع مايونيز الثوم",
        price: 37,
        img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300&q=60",
        extras: [{ id: "e4", name: "Extra Spicy", price: 0 }],
      },
      {
        id: "p4", name: "Veggie Burger", desc: "برغر نباتي بالخضار والفطر",
        price: 33,
        img: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=300&q=60",
        extras: [],
      },
    ],
  },
  {
    id: "meals",
    name: "الوجبات",
    items: [
      {
        id: "p5", name: "وجبة Burger Boss", desc: "برغر + بطاطا مقلية + مشروب غازي",
        price: 55, oldPrice: 65,
        img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&q=60",
        extras: [{ id: "e5", name: "Upsize بطاطا", price: 8 }],
      },
    ],
  },
  {
    id: "drinks",
    name: "المشروبات",
    items: [
      { id: "p6", name: "Coca-Cola 33cl", desc: "بارد ومنعش", price: 8, img: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&q=60", extras: [] },
      { id: "p7", name: "عصير برتقال طازج", desc: "معصور طازج", price: 15, img: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300&q=60", extras: [] },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* HELPERS                                                              */
/* ------------------------------------------------------------------ */
const dh = (n) => `${n} DH`;

/* ------------------------------------------------------------------ */
/* RESTAURANT HEADER                                                    */
/* ------------------------------------------------------------------ */
function RestaurantHeader({ onBack }) {
  const [fav, setFav] = useState(false);
  return (
    <div>
      <div className="relative h-48 sm:h-60">
        <img src={RESTAURANT.cover} className="w-full h-full object-cover" alt={RESTAURANT.name} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,.35), transparent 40%)" }} />
        <button onClick={onBack} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center">
          <ArrowRight size={18} color={C.dark} />
        </button>
        <div className="absolute top-3 left-3 flex gap-2">
          <button onClick={() => setFav(!fav)} className="w-9 h-9 rounded-full bg-white/95 flex items-center justify-center">
            <Heart size={16} fill={fav ? C.primary : "none"} color={fav ? C.primary : C.dark} />
          </button>
          <button className="w-9 h-9 rounded-full bg-white/95 flex items-center justify-center">
            <Share2 size={16} color={C.dark} />
          </button>
        </div>
        <img src={RESTAURANT.logo} className="absolute -bottom-7 right-5 w-16 h-16 rounded-2xl border-4 border-white object-cover" alt="logo" />
      </div>
      <div className="pt-9 px-5 pb-3" style={{ background: C.white }}>
        <h1 className="font-extrabold text-xl mb-1" style={{ color: C.dark }}>{RESTAURANT.name}</h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold mb-2" style={{ color: "#6B7280" }}>
          <span className="flex items-center gap-1"><Star size={13} fill={C.primary} color={C.primary} /> {RESTAURANT.rating} ({RESTAURANT.reviews})</span>
          <span className="flex items-center gap-1"><Clock size={13} /> {RESTAURANT.time}</span>
          <span>توصيل {RESTAURANT.fee}</span>
          <span>حد أدنى {RESTAURANT.min}</span>
        </div>
        <span className="inline-block text-xs font-bold px-2 py-1 rounded-full" style={{ background: "#DCFCE7", color: C.success }}>
          {RESTAURANT.hours}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* STICKY MENU NAV                                                     */
/* ------------------------------------------------------------------ */
function MenuNav({ active, onSelect }) {
  const ref = useRef(null);
  return (
    <div ref={ref} className="sticky top-0 z-20 bg-white flex gap-5 px-5 overflow-x-auto no-scrollbar" style={{ borderBottom: "1px solid #F0F0F0" }}>
      {MENU_SECTIONS.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className="py-3 text-sm font-bold whitespace-nowrap shrink-0"
          style={{
            color: active === s.id ? C.primary : "#9CA3AF",
            borderBottom: active === s.id ? `2px solid ${C.primary}` : "2px solid transparent",
          }}
        >
          {s.name}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PRODUCT CARD                                                        */
/* ------------------------------------------------------------------ */
function ProductCard({ item, onOpen }) {
  return (
    <button onClick={() => onOpen(item)} className="w-full flex gap-3 py-4 text-right" style={{ borderBottom: "1px solid #F5F5F5" }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          {item.popular && (
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded" style={{ background: "#FFF1EA", color: C.primary }}>الأكثر طلباً</span>
          )}
        </div>
        <h4 className="font-extrabold text-sm mb-1" style={{ color: C.dark }}>{item.name}</h4>
        <p className="text-xs mb-2 line-clamp-2" style={{ color: "#9CA3AF" }}>{item.desc}</p>
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-sm" style={{ color: C.dark }}>{dh(item.price)}</span>
          {item.oldPrice && <span className="text-xs line-through" style={{ color: "#C1C5CC" }}>{dh(item.oldPrice)}</span>}
        </div>
      </div>
      <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden">
        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
        <span className="absolute bottom-1.5 left-1.5 w-7 h-7 rounded-full flex items-center justify-center text-white" style={{ background: C.primary }}>
          <Plus size={15} />
        </span>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* PRODUCT DETAILS SHEET                                               */
/* ------------------------------------------------------------------ */
function ProductSheet({ item, onClose, onAdd }) {
  const [qty, setQty] = useState(1);
  const [chosenExtras, setChosenExtras] = useState([]);
  const [notes, setNotes] = useState("");

  if (!item) return null;

  const toggleExtra = (extra) =>
    setChosenExtras((prev) =>
      prev.find((e) => e.id === extra.id) ? prev.filter((e) => e.id !== extra.id) : [...prev, extra]
    );

  const total = (item.price + chosenExtras.reduce((s, e) => s + e.price, 0)) * qty;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(17,24,39,0.5)" }} onClick={onClose}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="relative h-48">
          <img src={item.img} className="w-full h-full object-cover" alt={item.name} />
          <button onClick={onClose} className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center"><X size={16} /></button>
        </div>
        <div className="p-5">
          <h3 className="font-extrabold text-xl mb-1" style={{ color: C.dark }}>{item.name}</h3>
          <p className="text-sm mb-3" style={{ color: "#6B7280" }}>{item.desc}</p>
          <div className="font-extrabold text-lg mb-4" style={{ color: C.primary }}>{dh(item.price)}</div>

          {item.extras.length > 0 && (
            <div className="mb-4">
              <h4 className="font-bold text-sm mb-2" style={{ color: C.dark }}>الإضافات</h4>
              <div className="flex flex-col gap-2">
                {item.extras.map((ex) => {
                  const checked = !!chosenExtras.find((e) => e.id === ex.id);
                  return (
                    <button
                      key={ex.id}
                      onClick={() => toggleExtra(ex)}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5"
                      style={{ background: checked ? "#FFF1EA" : C.bg, border: checked ? `1px solid ${C.primary}` : "1px solid transparent" }}
                    >
                      <span className="text-sm font-semibold" style={{ color: C.dark }}>{ex.name}</span>
                      <span className="flex items-center gap-2">
                        <span className="text-xs font-bold" style={{ color: "#6B7280" }}>{ex.price > 0 ? `+${ex.price} DH` : "مجاناً"}</span>
                        <span
                          className="w-5 h-5 rounded-md flex items-center justify-center"
                          style={{ background: checked ? C.primary : "#fff", border: `1px solid ${checked ? C.primary : "#D1D5DB"}` }}
                        >
                          {checked && <Check size={13} color="#fff" />}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mb-4">
            <h4 className="font-bold text-sm mb-2" style={{ color: C.dark }}>ملاحظات</h4>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: بدون بصل"
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={{ background: C.bg, color: C.dark }}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-sm" style={{ color: C.dark }}>الكمية</span>
            <div className="flex items-center gap-3 rounded-full px-2 py-1" style={{ background: C.bg }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-7 h-7 rounded-full bg-white flex items-center justify-center"><Minus size={14} /></button>
              <span className="font-bold w-4 text-center">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-7 h-7 rounded-full bg-white flex items-center justify-center"><Plus size={14} /></button>
            </div>
          </div>

          <button
            onClick={() => { onAdd({ item, qty, extras: chosenExtras, notes, total }); onClose(); }}
            className="w-full rounded-2xl py-3.5 font-bold text-white flex items-center justify-center gap-2"
            style={{ background: C.primary }}
          >
            أضف إلى السلة — {dh(total)}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CART DRAWER / SHEET                                                 */
/* ------------------------------------------------------------------ */
function CartPanel({ open, onClose, cart, setCart, onCheckout }) {
  const subtotal = cart.reduce((s, c) => s + c.total, 0);
  const deliveryFee = cart.length ? 10 : 0;
  const serviceFee = cart.length ? 3 : 0;
  const total = subtotal + deliveryFee + serviceFee;

  const removeLine = (idx) => setCart((prev) => prev.filter((_, i) => i !== idx));

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end" style={{ background: "rgba(17,24,39,0.5)" }} onClick={onClose}>
      <div className="bg-white w-full sm:w-[400px] sm:h-full rounded-t-3xl sm:rounded-none max-h-[85vh] sm:max-h-none overflow-y-auto flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: "1px solid #F0F0F0" }}>
          <h3 className="font-extrabold text-lg" style={{ color: C.dark }}>سلتك — {RESTAURANT.name}</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
            <ShoppingCart size={40} color="#D1D5DB" />
            <p className="mt-3 font-bold" style={{ color: "#9CA3AF" }}>السلة ديالك خاوية</p>
          </div>
        ) : (
          <>
            <div className="flex-1 p-5 flex flex-col gap-4">
              {cart.map((line, i) => (
                <div key={i} className="flex gap-3">
                  <img src={line.item.img} className="w-16 h-16 rounded-xl object-cover" alt={line.item.name} />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-sm" style={{ color: C.dark }}>{line.qty}× {line.item.name}</span>
                      <span className="font-bold text-sm" style={{ color: C.dark }}>{dh(line.total)}</span>
                    </div>
                    {line.extras.length > 0 && (
                      <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>{line.extras.map((e) => e.name).join("، ")}</p>
                    )}
                    {line.notes && <p className="text-xs mt-0.5 italic" style={{ color: "#9CA3AF" }}>"{line.notes}"</p>}
                    <button onClick={() => removeLine(i)} className="text-xs font-bold mt-1" style={{ color: C.primary }}>إزالة</button>
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: C.bg }}>
                <Ticket size={16} color={C.primary} />
                <input placeholder="أدخل كود الخصم" className="flex-1 bg-transparent outline-none text-sm font-medium" />
                <button className="text-xs font-bold" style={{ color: C.primary }}>تطبيق</button>
              </div>

              <div className="flex flex-col gap-1.5 text-sm pt-2" style={{ borderTop: "1px solid #F0F0F0" }}>
                <div className="flex justify-between" style={{ color: "#6B7280" }}><span>المجموع الفرعي</span><span>{dh(subtotal)}</span></div>
                <div className="flex justify-between" style={{ color: "#6B7280" }}><span>رسوم التوصيل</span><span>{dh(deliveryFee)}</span></div>
                <div className="flex justify-between" style={{ color: "#6B7280" }}><span>رسوم الخدمة</span><span>{dh(serviceFee)}</span></div>
                <div className="flex justify-between font-extrabold text-base pt-1" style={{ color: C.dark }}><span>الإجمالي</span><span>{dh(total)}</span></div>
              </div>
            </div>

            <div className="p-5" style={{ borderTop: "1px solid #F0F0F0" }}>
              <button onClick={onCheckout} className="w-full rounded-2xl py-3.5 font-bold text-white" style={{ background: C.primary }}>
                متابعة الطلب — {dh(total)}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CHECKOUT PAGE                                                       */
/* ------------------------------------------------------------------ */
function Checkout({ cart, onBack, onConfirm }) {
  const [payment, setPayment] = useState("cod");
  const subtotal = cart.reduce((s, c) => s + c.total, 0);
  const deliveryFee = 10, serviceFee = 3;
  const total = subtotal + deliveryFee + serviceFee;

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <div className="sticky top-0 z-20 bg-white px-5 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid #F0F0F0" }}>
        <button onClick={onBack}><ArrowRight size={20} color={C.dark} /></button>
        <h1 className="font-extrabold text-lg" style={{ color: C.dark }}>تأكيد الطلب</h1>
      </div>

      <div className="max-w-lg mx-auto p-5 flex flex-col gap-4 pb-32">
        {/* Address */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={16} color={C.primary} />
            <span className="font-bold text-sm" style={{ color: C.dark }}>عنوان التوصيل</span>
          </div>
          <p className="text-sm mb-2" style={{ color: "#6B7280" }}>برشيد، المغرب — شارع الحسن الثاني، رقم 12</p>
          <button className="text-xs font-bold" style={{ color: C.primary }}>تغيير العنوان</button>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Phone size={16} color={C.primary} />
            <span className="font-bold text-sm" style={{ color: C.dark }}>معلومات التواصل</span>
          </div>
          <input placeholder="الاسم الكامل" className="w-full rounded-xl px-3 py-2.5 text-sm mb-2 outline-none" style={{ background: C.bg }} />
          <input placeholder="رقم الهاتف" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none" style={{ background: C.bg }} />
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Receipt size={16} color={C.primary} />
            <span className="font-bold text-sm" style={{ color: C.dark }}>ملخص الطلب</span>
          </div>
          {cart.map((line, i) => (
            <div key={i} className="flex justify-between text-sm py-1" style={{ color: "#6B7280" }}>
              <span>{line.qty}× {line.item.name}</span>
              <span>{dh(line.total)}</span>
            </div>
          ))}
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={16} color={C.primary} />
            <span className="font-bold text-sm" style={{ color: C.dark }}>طريقة الدفع</span>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { id: "cod", label: "الدفع عند الاستلام", icon: Wallet },
              { id: "card", label: "بطاقة بنكية", icon: CreditCard },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setPayment(m.id)}
                className="flex items-center justify-between rounded-xl px-3 py-3"
                style={{ background: payment === m.id ? "#FFF1EA" : C.bg, border: payment === m.id ? `1px solid ${C.primary}` : "1px solid transparent" }}
              >
                <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: C.dark }}>
                  <m.icon size={16} /> {m.label}
                </span>
                <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ border: `1px solid ${payment === m.id ? C.primary : "#D1D5DB"}` }}>
                  {payment === m.id && <span className="w-2.5 h-2.5 rounded-full" style={{ background: C.primary }} />}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={16} color={C.primary} />
            <span className="font-bold text-sm" style={{ color: C.dark }}>تعليمات التوصيل</span>
          </div>
          <input placeholder="مثال: اتصل بي عند الوصول" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none" style={{ background: C.bg }} />
        </div>

        {/* Total */}
        <div className="bg-white rounded-2xl p-4 flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between" style={{ color: "#6B7280" }}><span>المجموع الفرعي</span><span>{dh(subtotal)}</span></div>
          <div className="flex justify-between" style={{ color: "#6B7280" }}><span>رسوم التوصيل</span><span>{dh(deliveryFee)}</span></div>
          <div className="flex justify-between" style={{ color: "#6B7280" }}><span>رسوم الخدمة</span><span>{dh(serviceFee)}</span></div>
          <div className="flex justify-between font-extrabold text-base pt-1" style={{ color: C.dark }}><span>الإجمالي</span><span>{dh(total)}</span></div>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-white p-4" style={{ borderTop: "1px solid #F0F0F0" }}>
        <div className="max-w-lg mx-auto">
          <button onClick={() => onConfirm(total)} className="w-full rounded-2xl py-3.5 font-bold text-white" style={{ background: C.primary }}>
            تأكيد الطلب — {dh(total)}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ORDER CONFIRMATION                                                   */
/* ------------------------------------------------------------------ */
function Confirmation({ total, onTrack, onNewOrder }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ background: C.bg }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: "#DCFCE7" }}>
        <Check size={36} color={C.success} />
      </div>
      <h1 className="font-extrabold text-2xl mb-1" style={{ color: C.dark }}>تم تأكيد طلبك 🎉</h1>
      <p className="text-sm mb-6" style={{ color: "#6B7280" }}>غادي يتم تحضير طلبك من {RESTAURANT.name}</p>

      <div className="bg-white rounded-2xl p-5 w-full max-w-sm flex flex-col gap-2 mb-6">
        <div className="flex justify-between text-sm"><span style={{ color: "#9CA3AF" }}>رقم الطلب</span><span className="font-bold" style={{ color: C.dark }}>#SKH-102938</span></div>
        <div className="flex justify-between text-sm"><span style={{ color: "#9CA3AF" }}>المطعم</span><span className="font-bold" style={{ color: C.dark }}>{RESTAURANT.name}</span></div>
        <div className="flex justify-between text-sm"><span style={{ color: "#9CA3AF" }}>الإجمالي</span><span className="font-bold" style={{ color: C.dark }}>{dh(total)}</span></div>
        <div className="flex justify-between text-sm"><span style={{ color: "#9CA3AF" }}>الوصول المتوقع</span><span className="font-bold" style={{ color: C.success }}>30-40 دقيقة</span></div>
      </div>

      <button onClick={onTrack} className="w-full max-w-sm rounded-2xl py-3.5 font-bold text-white mb-2 flex items-center justify-center gap-2" style={{ background: C.primary }}>
        <Truck size={17} /> تتبع الطلب
      </button>
      <button onClick={onNewOrder} className="w-full max-w-sm rounded-2xl py-3.5 font-bold" style={{ color: C.dark, background: "#fff" }}>
        العودة للرئيسية
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ROOT APP — يمثل التنقل بين Restaurant Page / Checkout / Confirmation */
/* ------------------------------------------------------------------ */
export default function SakhrtiRestaurantFlow() {
  const [view, setView] = useState("restaurant"); // restaurant | checkout | confirmation
  const [activeSection, setActiveSection] = useState(MENU_SECTIONS[0].id);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartTotal = cart.reduce((s, c) => s + c.total, 0);

  const addToCart = (line) => setCart((prev) => [...prev, line]);

  if (view === "checkout") {
    return (
      <div dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');`}</style>
        <Checkout cart={cart} onBack={() => setView("restaurant")} onConfirm={(total) => { setOrderTotal(total); setView("confirmation"); }} />
      </div>
    );
  }

  if (view === "confirmation") {
    return (
      <div dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');`}</style>
        <Confirmation total={orderTotal} onTrack={() => {}} onNewOrder={() => { setCart([]); setView("restaurant"); }} />
      </div>
    );
  }

  return (
    <div dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif", background: C.bg, minHeight: "100vh" }} className="pb-24">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      <RestaurantHeader onBack={() => {}} />
      <MenuNav active={activeSection} onSelect={(id) => { setActiveSection(id); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }} />

      <div className="max-w-2xl mx-auto px-5 bg-white">
        {MENU_SECTIONS.map((s) => (
          <div id={s.id} key={s.id} className="pt-4">
            <h3 className="font-extrabold text-base mb-1" style={{ color: C.dark }}>{s.name}</h3>
            {s.items.map((item) => (
              <ProductCard key={item.id} item={item} onOpen={setSelectedItem} />
            ))}
          </div>
        ))}
      </div>

      {cartCount > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:left-6 sm:w-80 rounded-2xl py-3.5 px-5 flex items-center justify-between text-white font-bold shadow-lg z-30"
          style={{ background: C.primary }}
        >
          <span className="flex items-center gap-2">
            <span className="bg-white/25 rounded-full w-6 h-6 flex items-center justify-center text-xs">{cartCount}</span>
            عرض السلة
          </span>
          <span>{dh(cartTotal)}</span>
        </button>
      )}

      <ProductSheet item={selectedItem} onClose={() => setSelectedItem(null)} onAdd={addToCart} />
      <CartPanel open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} setCart={setCart} onCheckout={() => { setCartOpen(false); setView("checkout"); }} />
    </div>
  );
}
