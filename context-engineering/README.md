# Context Engineering - منصة مُركَّز

## نظرة عامة على المشروع

منصة مُركَّز هي تطبيق Next.js متكامل لإدارة المقالات والنشرات البريدية باللغة العربية. يوفر التطبيق نظام إدارة محتوى متقدم مع ميزات أمان شاملة وواجهة مستخدم حديثة.

## هيكل المشروع

```
articles-nextjs/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── articles/            # إدارة المقالات
│   │   ├── search/              # البحث
│   │   ├── tags/                # العلامات
│   │   ├── contact/             # الاتصال
│   │   ├── subscribe/           # الاشتراك
│   │   ├── confirm/             # تأكيد الاشتراك
│   │   └── unsubscribe/         # إلغاء الاشتراك
│   ├── components/              # مكونات React
│   ├── unsubscribe/             # صفحة إلغاء الاشتراك
│   └── globals.css              # الأنماط العامة
├── lib/                         # مكتبات مساعدة
│   ├── contexts/                # Context Engineering
│   ├── mongodb.ts               # اتصال قاعدة البيانات
│   ├── security.ts              # مكتبة الأمان
│   └── rateLimiter.ts           # نظام Rate Limiting
├── context-engineering/         # ملفات Context Engineering
└── public/                      # الملفات الثابتة
```

## الميزات الرئيسية

### 1. إدارة المقالات

- إنشاء وعرض المقالات
- نظام العلامات (Tags)
- البحث المتقدم
- Pagination

### 2. النشرة البريدية

- اشتراك آمن
- تأكيد عبر البريد الإلكتروني
- إلغاء الاشتراك
- إدارة المشتركين

### 3. الأمان

- حماية من NoSQL Injection
- حماية من XSS
- Rate Limiting
- تسجيل الأنشطة المشبوهة
- تنظيف المدخلات

### 4. المراقبة

- مراقبة الأداء
- تسجيل الأخطاء
- مقاييس الاستخدام
- تنبيهات النظام

## التقنيات المستخدمة

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Styling**: Tailwind CSS
- **Email**: Nodemailer
- **Security**: Custom Security Library
- **Monitoring**: Custom Monitoring System

## ملفات Context Engineering

1. [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - توثيق شامل لجميع API endpoints
2. [SECURITY_GUIDE.md](./SECURITY_GUIDE.md) - دليل الأمان والحماية
3. [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - هيكل قاعدة البيانات
4. [ARCHITECTURE.md](./ARCHITECTURE.md) - معمارية التطبيق
5. [DEPLOYMENT.md](./DEPLOYMENT.md) - دليل النشر
6. [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - دليل التطوير
7. [DATA_STRUCTURE.md](./DATA_STRUCTURE.md) - هيكل البيانات الفعلي

## البدء السريع

```bash
# تثبيت التبعيات
npm install

# إعداد متغيرات البيئة
cp .env.example .env.local

# تشغيل التطبيق
npm run dev
```

## متغيرات البيئة المطلوبة

```env
MONGO_URL=mongodb://localhost:27017/articles-database
GMAIL_EMAIL=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
url=http://localhost:3000
```

## الأمان

التطبيق محمي بالكامل من:

- هجمات NoSQL Injection
- هجمات XSS
- هجمات DDoS
- محاولات الاختراق

## المراقبة

يتضمن التطبيق نظام مراقبة متقدم لـ:

- أداء API
- استخدام الذاكرة
- معدلات الخطأ
- الأنشطة المشبوهة

## الدعم

للحصول على الدعم أو الإبلاغ عن مشاكل، يرجى فتح issue في المستودع.

---

**آخر تحديث**: ${new Date().toLocaleDateString('ar-SA')}
**الإصدار**: 1.0.0
