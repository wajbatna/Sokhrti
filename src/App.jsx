import React, { Suspense, lazy, useEffect, useState } from "react";

// كل صفحة هي معاينة مستقلة. التوجيه عبر الـ hash (#/offers) ليعمل على GitHub Pages بدون إعداد خادم.
const PAGES = [
  { path: "/", label: "الرئيسية", C: lazy(() => import("./pages/sakhrti-homepage.jsx")) },
  { path: "/discovery", label: "المطاعم والبحث", C: lazy(() => import("./pages/sakhrti-discovery.jsx")) },
  { path: "/offers", label: "العروض", C: lazy(() => import("./pages/sakhrti-offers.jsx")) },
  { path: "/restaurant", label: "المطعم والطلب", C: lazy(() => import("./pages/sakhrti-restaurant-checkout.jsx")) },
  { path: "/tracking", label: "تتبع الطلب", C: lazy(() => import("./pages/sakhrti-order-tracking.jsx")) },
  { path: "/account", label: "حسابي", C: lazy(() => import("./pages/sakhrti-account.jsx")) },
  { path: "/auth", label: "تسجيل الدخول", C: lazy(() => import("./pages/sakhrti-auth.jsx")) },
  { path: "/vendor", label: "لوحة المحل", C: lazy(() => import("./pages/sakhrti-vendor.jsx")) },
  { path: "/driver", label: "لوحة السائق", C: lazy(() => import("./pages/sakhrti-driver.jsx")) },
  { path: "/admin", label: "الإدارة", C: lazy(() => import("./pages/sakhrti-admin.jsx")) },
  { path: "/admin-extended", label: "الإدارة (تكملة)", C: lazy(() => import("./pages/sakhrti-admin-extended.jsx")) },
];

const getPath = () => window.location.hash.replace(/^#/, "") || "/";

export default function App() {
  const [path, setPath] = useState(getPath());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onChange = () => { setPath(getPath()); setOpen(false); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const page = PAGES.find((p) => p.path === path) || PAGES[0];
  const Page = page.C;

  return (
    <>
      <Suspense fallback={<div style={{ padding: 40, textAlign: "center" }}>جاري التحميل…</div>}>
        <Page />
      </Suspense>

      {/* قائمة التنقل بين الصفحات (للمعاينة فقط) */}
      <div style={{ position: "fixed", bottom: 16, left: 16, zIndex: 99999, direction: "rtl" }}>
        {open && (
          <div style={{ background: "#111827", borderRadius: 14, padding: 8, marginBottom: 8, maxHeight: "70vh", overflowY: "auto", boxShadow: "0 8px 30px rgba(0,0,0,.35)" }}>
            {PAGES.map((p) => (
              <a key={p.path} href={`#${p.path}`}
                style={{ display: "block", padding: "10px 16px", color: p.path === page.path ? "#FF6B35" : "#fff", textDecoration: "none", fontSize: 14, fontWeight: 700, whiteSpace: "nowrap" }}>
                {p.label}
              </a>
            ))}
          </div>
        )}
        <button onClick={() => setOpen(!open)} aria-label="القائمة"
          style={{ background: "#FF6B35", color: "#fff", border: 0, borderRadius: 999, padding: "12px 18px", fontFamily: "inherit", fontSize: 14, fontWeight: 800, cursor: "pointer", boxShadow: "0 6px 20px rgba(255,107,53,.5)" }}>
          {open ? "إغلاق ✕" : "الصفحات ☰"}
        </button>
      </div>
    </>
  );
}
