# سخرتي — SAKHRTI

منصة Delivery Marketplace للسوق المغربي — Prototype متقدم (Frontend + Schema).

## محتوى هاد الحزمة

كل ملف `.jsx` هو معاينة React شغالة بشكل مستقل (self-contained: يحتوي على التصميم، البيانات التجريبية، والمنطق).

| الملف | الوصف |
|---|---|
| `sakhrti-homepage.jsx` | الواجهة الرئيسية: Header, Location, Hero+Search, Categories, Banners, أقسام المطاعم |
| `sakhrti-discovery.jsx` | صفحات المطاعم / المتاجر (Grid+Filters+Sort) + البحث المتقدم |
| `sakhrti-offers.jsx` | صفحة العروض 🔥 مع Countdown حي |
| `sakhrti-restaurant-checkout.jsx` | صفحة المطعم، المنتج، السلة، Checkout، تأكيد الطلب |
| `sakhrti-order-tracking.jsx` | تتبع الطلب: Timeline + خريطة توضيحية + بطاقة السائق |
| `sakhrti-account.jsx` | حساب المستخدم: طلبات، مفضلة، عناوين، دفع، إشعارات، كوبونات |
| `sakhrti-auth.jsx` | تسجيل الدخول / إنشاء حساب / OTP / نسيت كلمة المرور |
| `sakhrti-vendor.jsx` | لوحة تحكم صاحب المحل `/vendor` |
| `sakhrti-driver.jsx` | لوحة تحكم السائق |
| `sakhrti-admin.jsx` | لوحة تحكم Admin: Dashboard, Orders, Stores, Products, Categories |
| `sakhrti-admin-extended.jsx` | لوحة Admin (تكملة): Vendors, Drivers, Coupons, Banners, Reviews, Analytics |
| `sakhrti-schema.sql` | Database Schema كامل (PostgreSQL/Supabase) مع RLS, Triggers, Storage, Realtime |

## الهوية

- Primary `#FF6B35` / Primary Dark `#E4551F` / Dark `#111827` / Background `#F7F7F7`
- خط Tajawal، اتجاه RTL، عربية.

## الحالة الحالية

هاد الملفات **معاينات React مستقلة** (كل ملف فيه بيانات تجريبية hard-coded وواجهة كاملة شغالة). ماشي بعد Architecture إنتاجية حقيقية (Next.js + services/ منفصلة + اتصال حقيقي بـ Supabase). كل ملف مكتوب بطريقة توضح فيه التعليقات وين غادي يترتبط بالباك إند الحقيقي لاحقاً (مثال: `AuthService`, `MapPlaceholder`, تعليقات RLS...).

## الخطوة الجاية المقترحة (بعد رفعها لـ GitHub)

1. إنشاء مشروع Next.js + TypeScript + Tailwind فارغ.
2. تفعيل Supabase وتنفيذ `sakhrti-schema.sql` مباشرة فـ SQL Editor.
3. تقسيم كل ملف `.jsx` هنا لمكوناته الفرعية جوا `components/` (كل ملف فيه بالفعل تقسيم داخلي بـ subcomponents معلّقة بخطوط فاصلة، سهل تفصلها).
4. بناء `services/*.ts` تربط الـ UI بـ Supabase (auth, orders realtime, storage upload) بدل الـ mock functions الموجودة حالياً.
5. حذف كل الـ Mock Data واستبدالها بـ fetch حقيقي.

## ملاحظة

هاد الحزمة ماشي مشروع npm جاهز للتشغيل مباشرة (`npm run dev`) — هي ملفات React قابلة للنسخ داخل مشروع Next.js/Vite جديد. إلا بغيتي نبنيو ليك مشروع Vite/Next.js كامل قابل للتشغيل محلياً بـ `package.json` و`npm install`، قوليها فالمحادثة الجاية.
