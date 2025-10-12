# Database Schema - هيكل قاعدة البيانات

## نظرة عامة

منصة مُركَّز تستخدم MongoDB كقاعدة بيانات رئيسية مع مجموعات (collections) منظمة لإدارة المقالات والنشرات البريدية.

## قاعدة البيانات

**Database Name**: `articles-database`

## المجموعات (Collections)

### 1. articles-list

مجموعة المقالات الرئيسية

#### Schema

```typescript
interface Article {
  _id: ObjectId;
  title: string; // عنوان المقال
  slug: string; // معرف المقال (unique)
  tag: string; // العلامة الرئيسية
  description: string; // وصف المقال
  createdAt: Date; // تاريخ الإنشاء
  banner: {
    url: string; // رابط الصورة
    public_id: string; // معرف الصورة في Cloudinary
    alt: string; // النص البديل للصورة
  };
  blocks: ArticleBlock[]; // كتل المحتوى
}

interface ArticleBlock {
  id: string; // معرف الكتلة
  title: string; // عنوان الكتلة
  content: string; // محتوى الكتلة
  code: {
    language: string; // لغة البرمجة
    content: string; // الكود
  } | null; // كود البرمجة (اختياري)
  image: {
    url: string; // رابط الصورة
    public_id: string; // معرف الصورة في Cloudinary
    alt: string; // النص البديل للصورة
  } | null; // صورة الكتلة (اختيارية)
}
```

#### Indexes

```javascript
// فهرس على slug للبحث السريع
db.articles.createIndex({ slug: 1 }, { unique: true });

// فهرس على createdAt للترتيب
db.articles.createIndex({ createdAt: -1 });

// فهرس على tag للبحث
db.articles.createIndex({ tag: 1 });

// فهرس على tags للبحث المتقدم
db.articles.createIndex({ tags: 1 });

// فهرس مركب للبحث
db.articles.createIndex({
  title: "text",
  content: "text",
  description: "text",
});
```

#### Sample Document

```json
{
  "_id": ObjectId("68bda3b80c7228b48933d0fa"),
  "title": "اظهار بيانات محددة عند مشاركة رابط الموقع",
  "slug": "open-graph",
  "tag": "meta-tags",
  "description": "الـOpen Graph هي مجموعة وسوم خاصة بالشبكات الاجتماعية (Facebook, LinkedIn, Twitter...). وظيفتها تحديد كيف يظهر رابط موقعك عند مشاركته (العنوان، الوصف، الصورة).",
  "createdAt": ISODate("2024-05-14T00:00:00.000Z"),
  "banner": {
    "url": "https://res.cloudinary.com/dki71zmkb/image/upload/v1757258679/v3eenjpmqzuuekiw0qj1.png",
    "public_id": "v3eenjpmqzuuekiw0qj1",
    "alt": "open graph image"
  },
  "blocks": [
    {
      "id": "68bdabc90c7228b48933d112",
      "title": "ماهي نتيجة استخدام meta tags؟",
      "content": "تستخدم لعرض بيانات عن محتويات الرابط عند مشاركته كما في الصورة وهذا الامر يرفع نسبة الثقة عند المستخدمين ويظهر موقعك بشكل احترافي.",
      "code": null,
      "image": {
        "alt": "yazn open graph in linkedin",
        "public_id": "eifmakyi9cmim2pbhtra",
        "url": "https://res.cloudinary.com/dki71zmkb/image/upload/v1757259363/eifmakyi9cmim2pbhtra.png"
      }
    }
  ]
}
```

### 2. newsletter.emails

مجموعة المشتركين في النشرة البريدية

#### Schema

```typescript
interface Subscriber {
  _id: ObjectId;
  email: string; // البريد الإلكتروني (unique)
  subscribedAt: Date; // تاريخ الاشتراك
  status: "active" | "unsubscribed" | "bounced";
  source: string; // مصدر الاشتراك
  preferences: {
    frequency: "daily" | "weekly" | "monthly";
    categories: string[];
  };
  lastEmailSent: Date; // آخر بريد مرسل
  unsubscribedAt?: Date; // تاريخ إلغاء الاشتراك
}
```

#### Indexes

```javascript
// فهرس على email للبحث السريع
db.emails.createIndex({ email: 1 }, { unique: true });

// فهرس على status للتصفية
db.emails.createIndex({ status: 1 });

// فهرس على subscribedAt للترتيب
db.emails.createIndex({ subscribedAt: -1 });
```

#### Sample Document

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "email": "user@example.com",
  "subscribedAt": ISODate("2024-01-15T10:30:00.000Z"),
  "status": "active",
  "source": "website",
  "preferences": {
    "frequency": "weekly",
    "categories": ["التقنية", "البرمجة"]
  },
  "lastEmailSent": ISODate("2024-01-20T10:30:00.000Z")
}
```

### 3. newsletter.pendingSubscribers

مجموعة المشتركين في انتظار التأكيد

#### Schema

```typescript
interface PendingSubscriber {
  _id: ObjectId;
  email: string; // البريد الإلكتروني
  token: string; // رمز التأكيد (unique)
  createdAt: Date; // تاريخ الطلب
  expiresAt: Date; // تاريخ انتهاء الصلاحية
  attempts: number; // عدد محاولات الإرسال
  lastAttempt: Date; // آخر محاولة
}
```

#### Indexes

```javascript
// فهرس على token للبحث السريع
db.pendingSubscribers.createIndex({ token: 1 }, { unique: true });

// فهرس على email للبحث
db.pendingSubscribers.createIndex({ email: 1 });

// فهرس على expiresAt للتنظيف التلقائي
db.pendingSubscribers.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

#### Sample Document

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439013"),
  "email": "newuser@example.com",
  "token": "a1b2c3d4e5f6g7h8i9j0",
  "createdAt": ISODate("2024-01-15T10:30:00.000Z"),
  "expiresAt": ISODate("2024-01-15T12:30:00.000Z"),
  "attempts": 1,
  "lastAttempt": ISODate("2024-01-15T10:30:00.000Z")
}
```

## العلاقات (Relationships)

### 1. Articles ↔ Tags

- **One-to-Many**: مقال واحد يمكن أن يحتوي على عدة علامات
- **Many-to-Many**: علامة واحدة يمكن أن تكون في عدة مقالات

### 2. Subscribers ↔ Newsletter

- **One-to-Many**: مشترك واحد يمكن أن يكون في عدة قوائم
- **Many-to-One**: عدة مشتركين يمكن أن يكونوا في قائمة واحدة

## الاستعلامات (Queries)

### 1. جلب المقالات

```javascript
// جلب جميع المقالات مع pagination
db.articles
  .find(
    {},
    {
      title: 1,
      slug: 1,
      tag: 1,
      description: 1,
      createdAt: 1,
      banner: 1,
    }
  )
  .sort({ createdAt: -1 })
  .skip(0)
  .limit(10);

// جلب مقال محدد مع جميع الكتل
db.articles.findOne({ slug: "open-graph" });
```

### 2. البحث في المقالات

```javascript
// البحث النصي
db.articles.find({
  $or: [
    { title: { $regex: "open graph", $options: "i" } },
    { description: { $regex: "open graph", $options: "i" } },
    { "blocks.title": { $regex: "open graph", $options: "i" } },
    { "blocks.content": { $regex: "open graph", $options: "i" } },
  ],
});

// البحث بالعلامة
db.articles.find({ tag: "meta-tags" });
```

### 3. إدارة المشتركين

```javascript
// إضافة مشترك جديد
db.emails.insertOne({
  email: "user@example.com",
  subscribedAt: new Date(),
  status: "active",
  source: "website",
});

// البحث عن مشترك
db.emails.findOne({ email: "user@example.com" });

// إلغاء الاشتراك
db.emails.updateOne(
  { email: "user@example.com" },
  {
    $set: {
      status: "unsubscribed",
      unsubscribedAt: new Date(),
    },
  }
);
```

### 4. إدارة المشتركين المعلقين

```javascript
// إضافة مشترك معلق
db.pendingSubscribers.insertOne({
  email: "newuser@example.com",
  token: "confirmation-token",
  createdAt: new Date(),
  expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 ساعة
});

// البحث بالرمز
db.pendingSubscribers.findOne({ token: "confirmation-token" });

// تنظيف الرموز المنتهية الصلاحية
db.pendingSubscribers.deleteMany({ expiresAt: { $lt: new Date() } });
```

## الأداء والتحسين

### 1. Indexes

```javascript
// فهارس مركبة للبحث المتقدم
db.articles.createIndex(
  {
    title: "text",
    content: "text",
    description: "text",
  },
  {
    weights: {
      title: 10,
      description: 5,
      content: 1,
    },
  }
);

// فهرس مركب للترتيب والتصفية
db.articles.createIndex({
  published: 1,
  createdAt: -1,
});
```

### 2. Aggregation Pipeline

```javascript
// إحصائيات المقالات
db.articles.aggregate([
  { $match: { published: true } },
  {
    $group: {
      _id: "$tag",
      count: { $sum: 1 },
      totalViews: { $sum: "$views" },
      avgViews: { $avg: "$views" },
    },
  },
  { $sort: { count: -1 } },
]);

// المقالات الأكثر مشاهدة
db.articles.aggregate([
  { $match: { published: true } },
  { $sort: { views: -1 } },
  { $limit: 10 },
  { $project: { title: 1, views: 1, slug: 1 } },
]);
```

### 3. Caching Strategy

```javascript
// استخدام Redis للكاش
const cacheKey = `article:${slug}`;
const cachedArticle = await redis.get(cacheKey);

if (!cachedArticle) {
  const article = await db.articles.findOne({ slug });
  await redis.setex(cacheKey, 3600, JSON.stringify(article)); // 1 ساعة
  return article;
}

return JSON.parse(cachedArticle);
```

## النسخ الاحتياطية

### 1. MongoDB Backup

```bash
# نسخ احتياطي كامل
mongodump --db articles-database --out /backup/$(date +%Y%m%d)

# نسخ احتياطي لمجموعة محددة
mongodump --db articles-database --collection articles-list --out /backup/
```

### 2. استعادة النسخة الاحتياطية

```bash
# استعادة كاملة
mongorestore --db articles-database /backup/20240115/

# استعادة مجموعة محددة
mongorestore --db articles-database --collection articles-list /backup/articles-list/
```

## المراقبة والصيانة

### 1. مراقبة الأداء

```javascript
// فحص الأداء
db.articles.explain("executionStats").find({ slug: "article-slug" });

// إحصائيات المجموعة
db.articles.stats();

// فحص الفهارس
db.articles.getIndexes();
```

### 2. تنظيف البيانات

```javascript
// حذف المقالات غير المنشورة القديمة
db.articles.deleteMany({
  published: false,
  createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
});

// تنظيف المشتركين المعلقين المنتهية صلاحيتهم
db.pendingSubscribers.deleteMany({
  expiresAt: { $lt: new Date() },
});
```

### 3. تحسين الاستعلامات

```javascript
// استخدام projection لتقليل البيانات
db.articles.find({ published: true }, { title: 1, slug: 1, createdAt: 1 });

// استخدام limit لتقليل النتائج
db.articles.find({ published: true }).limit(10);

// استخدام sort مع index
db.articles.find({ published: true }).sort({ createdAt: -1 });
```

## الأمان

### 1. حماية من NoSQL Injection

```javascript
// ❌ خطأ - عرضة للهجوم
db.articles.find({ title: userInput });

// ✅ صحيح - محمي
db.articles.find({ title: { $eq: sanitizedInput } });
```

### 2. التحقق من الصلاحيات

```javascript
// التحقق من وجود المقال قبل التحديث
const article = await db.articles.findOne({ slug: articleSlug });
if (!article) {
  throw new Error("Article not found");
}
```

### 3. تشفير البيانات الحساسة

```javascript
// تشفير البريد الإلكتروني
const encryptedEmail = encrypt(userEmail);
db.emails.insertOne({ email: encryptedEmail });
```

---

**آخر تحديث**: ${new Date().toLocaleDateString('ar-SA')}
**الإصدار**: 1.0.0
