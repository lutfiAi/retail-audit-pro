# 🏬 Retail Audit Pro

> نظام التدقيق الشامل لقطاع التجزئة — مبني بخبرة BeO Audit الميدانية

## ⚡ تشغيل المشروع محلياً (5 دقائق)

```bash
# 1. فك ضغط المجلد وادخل إليه
cd retail-audit-pro

# 2. تثبيت الحزم
npm install

# 3. تشغيل المشروع (وضع Demo بدون Supabase)
npm run dev

# 4. افتح المتصفح على
# http://localhost:5173
```

## 🔧 الإعداد الكامل مع Supabase

### الخطوة 1 — إنشاء مشروع Supabase
1. اذهب إلى [supabase.com](https://supabase.com) وأنشئ حساباً مجاناً
2. أنشئ مشروعاً جديداً واختر المنطقة الأقرب (Frankfurt أو Singapore)
3. انسخ `Project URL` و `anon public key`

### الخطوة 2 — إعداد قاعدة البيانات
1. في Supabase: اذهب إلى **SQL Editor**
2. انسخ محتوى ملف `supabase_schema.sql` والصق ثم نفّذ
3. اذهب إلى **Authentication > Users** وأضف أول مستخدم

### الخطوة 3 — متغيرات البيئة
```bash
# انسخ ملف .env.example
cp .env.example .env

# عدّل القيم
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### الخطوة 4 — تشغيل المشروع
```bash
npm run dev
```

## 🚀 النشر على Vercel (مجاناً)

```bash
# 1. ثبّت Vercel CLI
npm install -g vercel

# 2. ادفع المشروع
vercel

# 3. أضف متغيرات البيئة في لوحة Vercel
# Settings > Environment Variables
```

## 📁 هيكل المشروع

```
retail-audit-pro/
├── src/
│   ├── pages/
│   │   ├── AuditApp.jsx      ← البرنامج الأساسي (249 بند)
│   │   └── Login.jsx         ← صفحة تسجيل الدخول
│   ├── context/
│   │   └── AuthContext.jsx   ← إدارة المصادقة
│   ├── hooks/
│   │   └── useAutoSave.js    ← حفظ تلقائي
│   ├── lib/
│   │   └── supabase.js       ← اتصال Supabase
│   └── App.jsx               ← الجذر الرئيسي
├── supabase_schema.sql        ← قاعدة البيانات
├── .env.example               ← مثال متغيرات البيئة
└── README.md
```

## 💰 خطط الأسعار

| الباقة | السعر | الفروع |
|--------|-------|--------|
| Starter | 650 ر.س/شهر | حتى 3 |
| Business | 1,800 ر.س/شهر | حتى 15 |
| Enterprise | تفاوض | غير محدود |

## 📞 التواصل والدعم
- البريد: support@retailauditpro.sa
- واتساب: +966 5X XXX XXXX

---
© 2025 Retail Audit Pro — جميع الحقوق محفوظة
