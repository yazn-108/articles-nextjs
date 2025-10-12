# Development Guide - دليل التطوير

## نظرة عامة

دليل شامل لتطوير وصيانة منصة مُركَّز مع أفضل الممارسات والأدوات المطلوبة.

## متطلبات التطوير

### الأدوات المطلوبة

- **Node.js**: 18.x أو أحدث
- **npm**: 9.x أو أحدث
- **MongoDB**: 5.0 أو أحدث
- **Git**: 2.x أو أحدث
- **VS Code**: مع الإضافات المطلوبة

### الإضافات الموصى بها لـ VS Code

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "mongodb.mongodb-vscode",
    "ms-vscode.vscode-json"
  ]
}
```

## إعداد بيئة التطوير

### 1. استنساخ المشروع

```bash
# استنساخ المستودع
git clone https://github.com/yourusername/articles-nextjs.git
cd articles-nextjs

# تثبيت التبعيات
npm install

# إعداد متغيرات البيئة
cp .env.example .env.local
```

### 2. إعداد قاعدة البيانات

```bash
# تشغيل MongoDB محلياً
mongod --dbpath /path/to/your/db

# أو استخدام Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# إنشاء قاعدة البيانات
mongo
use articles-database
```

### 3. تشغيل التطبيق

```bash
# وضع التطوير
npm run dev

# فتح المتصفح
open http://localhost:3000
```

## هيكل المشروع

```
articles-nextjs/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── articles/            # إدارة المقالات
│   │   │   ├── route.ts         # GET /api/articles
│   │   │   └── [articleSlug]/   # GET /api/articles/[slug]
│   │   ├── search/              # البحث
│   │   │   └── [word]/          # GET /api/search/[word]
│   │   ├── tags/                # العلامات
│   │   │   └── [tag]/           # GET /api/tags/[tag]
│   │   ├── contact/             # الاتصال
│   │   │   └── route.ts         # POST /api/contact
│   │   ├── subscribe/           # الاشتراك
│   │   │   └── route.ts         # POST /api/subscribe
│   │   ├── confirm/             # تأكيد الاشتراك
│   │   │   └── route.ts         # POST /api/confirm
│   │   └── unsubscribe/         # إلغاء الاشتراك
│   │       └── route.ts         # POST /api/unsubscribe
│   ├── components/              # مكونات React
│   │   ├── BackToHome.tsx
│   │   ├── ArticleCard.tsx
│   │   └── NewsletterForm.tsx
│   ├── unsubscribe/             # صفحات إضافية
│   │   └── [subscriberToken]/
│   │       └── page.tsx
│   ├── globals.css              # الأنماط العامة
│   ├── layout.tsx               # التخطيط العام
│   └── page.tsx                 # الصفحة الرئيسية
├── lib/                         # مكتبات مساعدة
│   ├── contexts/                # Context Engineering
│   │   ├── SecurityContext.ts   # إدارة الأمان
│   │   └── MonitoringContext.ts # إدارة المراقبة
│   ├── mongodb.ts               # اتصال قاعدة البيانات
│   ├── security.ts              # مكتبة الأمان
│   └── rateLimiter.ts           # نظام Rate Limiting
├── context-engineering/         # ملفات Context Engineering
│   ├── README.md
│   ├── API_DOCUMENTATION.md
│   ├── SECURITY_GUIDE.md
│   ├── DATABASE_SCHEMA.md
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   └── DEVELOPMENT_GUIDE.md
├── public/                      # الملفات الثابتة
├── .env.example                 # مثال متغيرات البيئة
├── .gitignore                   # ملفات Git المهملة
├── next.config.js               # إعدادات Next.js
├── package.json                 # تبعيات المشروع
├── tailwind.config.js           # إعدادات Tailwind
└── tsconfig.json                # إعدادات TypeScript
```

## معايير الكود

### 1. TypeScript

```typescript
// ✅ صحيح - استخدام types واضحة
interface Article {
  _id: string;
  title: string;
  slug: string;
  tag: string;
  description: string;
  createdAt: Date;
  banner: {
    url: string;
    public_id: string;
    alt: string;
  };
  blocks: ArticleBlock[];
}

interface ArticleBlock {
  id: string;
  title: string;
  content: string;
  code: {
    language: string;
    content: string;
  } | null;
  image: {
    url: string;
    public_id: string;
    alt: string;
  } | null;
}

// ❌ خطأ - استخدام any
function processArticle(article: any) {
  // ...
}

// ✅ صحيح - استخدام types محددة
function processArticle(article: Article) {
  // ...
}
```

### 2. React Components

```typescript
// ✅ صحيح - استخدام interface للـ props
interface ArticleCardProps {
  article: Article;
  onLike: (id: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onLike,
}) => {
  return (
    <div className="article-card">
      <h2>{article.title}</h2>
      <button onClick={() => onLike(article.id)}>Like</button>
    </div>
  );
};
```

### 3. API Routes

```typescript
// ✅ صحيح - استخدام try-catch و error handling
export const GET = async (request: Request) => {
  try {
    // معالجة الطلب
    const data = await processRequest(request);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};
```

### 4. Security

```typescript
// ✅ صحيح - تنظيف المدخلات
const cleanInput = sanitizeInput(userInput);
const isValid = validateInput(cleanInput, "search");

if (!isValid) {
  return NextResponse.json({ error: "Invalid input" }, { status: 400 });
}

// ✅ صحيح - استخدام استعلامات آمنة
const results = await collection.find(createSafeQuery("title", cleanInput));
```

## اختبار الكود

### 1. Unit Tests

```typescript
// tests/security.test.ts
import { sanitizeInput, validateEmail } from "../lib/security";

describe("Security Functions", () => {
  test("should sanitize input correctly", () => {
    const input = '<script>alert("xss")</script>';
    const result = sanitizeInput(input);
    expect(result).toBe('alert("xss")');
  });

  test("should validate email correctly", () => {
    expect(validateEmail("test@example.com")).toBe(true);
    expect(validateEmail("invalid-email")).toBe(false);
  });
});
```

### 2. Integration Tests

```typescript
// tests/api.test.ts
import { GET } from "../app/api/articles/route";

describe("Articles API", () => {
  test("should return articles list", async () => {
    const request = new Request("http://localhost:3000/api/articles");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.articles).toBeDefined();
  });
});
```

### 3. E2E Tests

```typescript
// tests/e2e.test.ts
import { test, expect } from "@playwright/test";

test("should display articles on homepage", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator(".article-card")).toHaveCount.greaterThan(0);
});
```

## إدارة التبعيات

### 1. package.json

```json
{
  "name": "articles-nextjs",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "18.0.0",
    "react-dom": "18.0.0",
    "mongodb": "6.0.0",
    "nodemailer": "6.9.0"
  },
  "devDependencies": {
    "@types/node": "20.0.0",
    "@types/react": "18.0.0",
    "@types/react-dom": "18.0.0",
    "typescript": "5.0.0",
    "jest": "29.0.0",
    "@testing-library/react": "13.0.0",
    "playwright": "1.40.0"
  }
}
```

### 2. إدارة التبعيات

```bash
# تثبيت تبعية جديدة
npm install package-name

# تثبيت تبعية تطوير
npm install -D package-name

# تحديث التبعيات
npm update

# فحص الثغرات الأمنية
npm audit
npm audit fix

# حذف تبعية
npm uninstall package-name
```

## Git Workflow

### 1. Branching Strategy

```bash
# إنشاء branch جديد
git checkout -b feature/new-feature

# أو
git checkout -b bugfix/fix-issue

# أو
git checkout -b hotfix/critical-fix
```

### 2. Commit Messages

```bash
# ✅ صحيح - رسائل واضحة ومفصلة
git commit -m "feat: add article search functionality"
git commit -m "fix: resolve NoSQL injection vulnerability"
git commit -m "docs: update API documentation"

# ❌ خطأ - رسائل غير واضحة
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
```

### 3. Pull Request Template

```markdown
## وصف التغيير

وصف مختصر للتغيير المطلوب

## نوع التغيير

- [ ] إصلاح خطأ
- [ ] ميزة جديدة
- [ ] تحسين
- [ ] توثيق
- [ ] إعادة هيكلة

## الاختبارات

- [ ] تم اختبار الكود محلياً
- [ ] تم تشغيل الاختبارات
- [ ] تم اختبار الأمان

## ملاحظات إضافية

أي ملاحظات إضافية للمراجعين
```

## Debugging

### 1. Console Logging

```typescript
// ✅ صحيح - استخدام console.log للتصحيح
console.log("Processing request:", { url, method, headers });

// ✅ صحيح - استخدام console.error للأخطاء
console.error("Database error:", error);

// ❌ خطأ - ترك console.log في الإنتاج
console.log("Debug info"); // يجب حذفها قبل النشر
```

### 2. Error Handling

```typescript
// ✅ صحيح - معالجة شاملة للأخطاء
try {
  const result = await riskyOperation();
  return NextResponse.json({ success: true, data: result });
} catch (error) {
  console.error("Operation failed:", error);

  if (error instanceof ValidationError) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { success: false, message: "Internal server error" },
    { status: 500 }
  );
}
```

### 3. Debugging Tools

```typescript
// استخدام debugger
function processData(data: any) {
  debugger; // توقف هنا في DevTools
  return data.map((item) => item.value);
}

// استخدام console.table للبيانات المعقدة
console.table(articles);

// استخدام console.group للتنظيم
console.group("API Request");
console.log("URL:", url);
console.log("Method:", method);
console.log("Headers:", headers);
console.groupEnd();
```

## Performance Optimization

### 1. Database Queries

```typescript
// ✅ صحيح - استخدام projection
const articles = await collection.find(
  {},
  {
    title: 1,
    slug: 1,
    tag: 1,
    description: 1,
    createdAt: 1,
    banner: 1,
  } // فقط الحقول المطلوبة
);

// ✅ صحيح - استخدام limit
const recentArticles = await collection
  .find({})
  .sort({ createdAt: -1 })
  .limit(10);

// ✅ صحيح - استخدام index
// db.articles.createIndex({ "createdAt": -1 })
```

### 2. Caching

```typescript
// ✅ صحيح - استخدام cache
const cacheKey = `article:${slug}`;
let article = await redis.get(cacheKey);

if (!article) {
  article = await db.articles.findOne({ slug });
  await redis.setex(cacheKey, 3600, JSON.stringify(article));
}

return JSON.parse(article);
```

### 3. Lazy Loading

```typescript
// ✅ صحيح - lazy loading للمكونات
const ArticleModal = lazy(() => import("./ArticleModal"));

// استخدام Suspense
<Suspense fallback={<div>Loading...</div>}>
  <ArticleModal />
</Suspense>;
```

## Security Best Practices

### 1. Input Validation

```typescript
// ✅ صحيح - التحقق من المدخلات
if (!validateEmail(email)) {
  return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
}

// ✅ صحيح - تنظيف المدخلات
const cleanInput = sanitizeInput(userInput);
```

### 2. Rate Limiting

```typescript
// ✅ صحيح - تطبيق rate limiting
const rateLimitResult = searchRateLimiter(request);
if (!rateLimitResult.allowed) {
  return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
}
```

### 3. Error Information

```typescript
// ✅ صحيح - عدم كشف معلومات حساسة
catch (error) {
  console.error('Database error:', error); // في السجلات
  return NextResponse.json(
    { error: 'Internal server error' }, // للمستخدم
    { status: 500 }
  );
}
```

## Monitoring and Logging

### 1. Application Logs

```typescript
// ✅ صحيح - تسجيل الأحداث المهمة
console.log("User subscribed:", { email, timestamp: new Date() });
console.warn("Rate limit exceeded:", { ip, endpoint });
console.error("Database connection failed:", error);
```

### 2. Performance Monitoring

```typescript
// ✅ صحيح - مراقبة الأداء
const startTime = Date.now();
const result = await processRequest();
const duration = Date.now() - startTime;

if (duration > 1000) {
  console.warn("Slow request:", { duration, endpoint });
}
```

### 3. Security Monitoring

```typescript
// ✅ صحيح - مراقبة الأمان
if (suspiciousPatterns.some((pattern) => input.includes(pattern))) {
  console.warn("Suspicious activity detected:", {
    input: input.substring(0, 100),
    ip: clientIP,
    timestamp: new Date(),
  });
}
```

## Deployment Checklist

### قبل النشر

- [ ] تشغيل الاختبارات
- [ ] فحص الأمان
- [ ] تحسين الأداء
- [ ] تحديث التوثيق
- [ ] نسخ احتياطي للبيانات

### بعد النشر

- [ ] فحص التطبيق
- [ ] مراقبة السجلات
- [ ] فحص الأداء
- [ ] اختبار الوظائف
- [ ] مراقبة الأمان

## Troubleshooting

### مشاكل شائعة

1. **خطأ في قاعدة البيانات**: فحص اتصال MongoDB
2. **خطأ في البريد الإلكتروني**: فحص إعدادات Gmail
3. **خطأ في Rate Limiting**: فحص إعدادات Rate Limiter
4. **خطأ في الأمان**: فحص إعدادات Security Context

### أدوات المساعدة

- **MongoDB Compass**: لإدارة قاعدة البيانات
- **Postman**: لاختبار API
- **Chrome DevTools**: لتصحيح Frontend
- **VS Code Debugger**: لتصحيح Backend

---

**آخر تحديث**: ${new Date().toLocaleDateString('ar-SA')}
**الإصدار**: 1.0.0
