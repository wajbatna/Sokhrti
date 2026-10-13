# سخرتي — SAKHRTI

منصة Delivery Marketplace للسوق المغربي — مشروع Vite + React.

## التشغيل محلياً

```bash
npm install
npm run dev
```

## النشر على GitHub Pages

1. ارفع كل الملفات إلى المستودع (فرع `main`).
2. من **Settings → Pages** اختر **Source: GitHub Actions**.
3. بعد انتهاء الـ workflow في تبويب **Actions** يصبح الموقع على:
   https://wajbatna.github.io/Sokhrti/

## الهيكل

- `src/pages/` — صفحات الواجهة (معاينات React مستقلة ببيانات تجريبية)
- `src/App.jsx` — التوجيه عبر hash + قائمة التنقل
- `database/sakhrti-schema.sql` — Database Schema لـ PostgreSQL/Supabase
