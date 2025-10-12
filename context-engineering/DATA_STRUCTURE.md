# Data Structure - هيكل البيانات

## نظرة عامة

هذا الملف يوضح البنية الفعلية للبيانات المستخدمة في منصة مُركَّز، بناءً على الـ API responses الحقيقية.

## مقالات (Articles)

### 1. قائمة المقالات - GET `/api/articles`

```json
{
  "articles": [
    {
      "_id": "68bda3b80c7228b48933d0fa",
      "title": "اظهار بيانات محددة عند مشاركة رابط الموقع",
      "slug": "open-graph",
      "tag": "meta-tags",
      "description": "الـOpen Graph هي مجموعة وسوم خاصة بالشبكات الاجتماعية (Facebook, LinkedIn, Twitter...). وظيفتها تحديد كيف يظهر رابط موقعك عند مشاركته (العنوان، الوصف، الصورة).",
      "createdAt": "2024-05-14T00:00:00.000Z",
      "banner": {
        "url": "https://res.cloudinary.com/dki71zmkb/image/upload/v1757258679/v3eenjpmqzuuekiw0qj1.png",
        "public_id": "v3eenjpmqzuuekiw0qj1",
        "alt": "open graph image"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 1,
    "totalCount": 1,
    "hasMore": false,
    "totalPages": 1
  }
}
```

### 2. مقال واحد - GET `/api/articles/[articleSlug]`

```json
{
  "_id": "68bda3b80c7228b48933d0fa",
  "title": "اظهار بيانات محددة عند مشاركة رابط الموقع",
  "slug": "open-graph",
  "tag": "meta-tags",
  "description": "الـOpen Graph هي مجموعة وسوم خاصة بالشبكات الاجتماعية (Facebook, LinkedIn, Twitter...). وظيفتها تحديد كيف يظهر رابط موقعك عند مشاركته (العنوان، الوصف، الصورة).",
  "createdAt": "2024-05-14T00:00:00.000Z",
  "banner": {
    "url": "https://res.cloudinary.com/dki71zmkb/image/upload/v1757258679/v3eenjpmqzuuekiw0qj1.png",
    "public_id": "v3eenjpmqzuuekiw0qj1",
    "alt": "open graph image"
  },
  "blocks": [
    {
      "title": "ماهي نتيجة استخدام meta tags؟",
      "content": "تستخدم لعرض بيانات عن محتويات الرابط عند مشاركته كما في الصورة وهذا الامر يرفع نسبة الثقة عند المستخدمين ويظهر موقعك بشكل احترافي.",
      "code": null,
      "image": {
        "alt": "yazn open graph in linkedin",
        "public_id": "eifmakyi9cmim2pbhtra",
        "url": "https://res.cloudinary.com/dki71zmkb/image/upload/v1757259363/eifmakyi9cmim2pbhtra.png"
      },
      "id": "68bdabc90c7228b48933d112"
    },
    {
      "title": "ماهو open graph؟",
      "content": "الـOpen Graph هو بروتوكول (Open Graph Protocol) أنشأته شركة فيسبوك سنة 2010، والغرض منه هو جعل أي رابط على الانترنت يتم مشاركة مع بعض التفاصيل عن محتويات الرابط يتم تحديدها من قبل صاحب الصفحة التابع لها الرابط.",
      "code": {
        "language": "html",
        "content": "<!-- HTML Meta Tags -->\n<title>Front End Web Developer</title>\n<meta name=\"description\" content=\"I am Yazn, a front-end web developer from Syria. I seek professionalism in the field of website interface development. This is an exhibition of my work in which I present my new works on an ongoing basis\">\n\n<!-- Facebook Meta Tags -->\n<meta property=\"og:url\" content=\"https://yazn-108.github.io/\">\n<meta property=\"og:type\" content=\"website\">\n<meta property=\"og:title\" content=\"Front End Web Developer\">\n<meta property=\"og:description\" content=\"I am Yazn, a front-end web developer from Syria. I seek professionalism in the field of website interface development. This is an exhibition of my work in which I present my new works on an ongoing basis\">\n<meta property=\"og:image\" content=\"https://raw.githubusercontent.com/yazn-108/yazn-108.github.io/main/imgs/open-graph-image.png\">\n\n<!-- Twitter Meta Tags -->\n<meta name=\"twitter:card\" content=\"summary_large_image\">\n<meta property=\"twitter:domain\" content=\"yazn-108.github.io\">\n<meta property=\"twitter:url\" content=\"https://yazn-108.github.io/\">\n<meta name=\"twitter:title\" content=\"Front End Web Developer\">\n<meta name=\"twitter:description\" content=\"I am Yazn, a front-end web developer from Syria. I seek professionalism in the field of website interface development. This is an exhibition of my work in which I present my new works on an ongoing basis\">\n<meta name=\"twitter:image\" content=\"https://raw.githubusercontent.com/yazn-108/yazn-108.github.io/main/imgs/open-graph-image.png\">\n\n<!-- Meta Tags Generated via https://www.opengraph.xyz -->"
      },
      "image": null,
      "id": "68bdabc90c7228b48933d113"
    }
  ]
}
```

## TypeScript Interfaces

### Article Interface

```typescript
interface Article {
  _id: string;
  title: string;
  slug: string;
  tag: string;
  description: string;
  createdAt: string; // ISO date string
  banner: BannerImage;
  blocks: ArticleBlock[];
}

interface BannerImage {
  url: string;
  public_id: string;
  alt: string;
}

interface ArticleBlock {
  id: string;
  title: string;
  content: string;
  code: CodeBlock | null;
  image: BlockImage | null;
}

interface CodeBlock {
  language: string;
  content: string;
}

interface BlockImage {
  url: string;
  public_id: string;
  alt: string;
}

interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  hasMore: boolean;
  totalPages: number;
}

interface ArticlesResponse {
  articles: Article[];
  pagination: Pagination;
}

interface SingleArticleResponse extends Article {}
```

## Cloudinary Integration

### Image Structure

جميع الصور في التطبيق تستخدم Cloudinary مع البنية التالية:

```typescript
interface CloudinaryImage {
  url: string; // رابط الصورة الكامل
  public_id: string; // معرف الصورة في Cloudinary
  alt: string; // النص البديل للصورة
}
```

### مثال على استخدام Cloudinary

```javascript
// Banner Image
{
  "url": "https://res.cloudinary.com/dki71zmkb/image/upload/v1757258679/v3eenjpmqzuuekiw0qj1.png",
  "public_id": "v3eenjpmqzuuekiw0qj1",
  "alt": "open graph image"
}

// Block Image
{
  "url": "https://res.cloudinary.com/dki71zmkb/image/upload/v1757259363/eifmakyi9cmim2pbhtra.png",
  "public_id": "eifmakyi9cmim2pbhtra",
  "alt": "yazn open graph in linkedin"
}
```

## Database Schema

### MongoDB Collection Structure

```javascript
// articles-list collection
{
  _id: ObjectId,
  title: String,
  slug: String, // unique
  tag: String,
  description: String,
  createdAt: Date,
  banner: {
    url: String,
    public_id: String,
    alt: String
  },
  blocks: [
    {
      id: String,
      title: String,
      content: String,
      code: {
        language: String,
        content: String
      } | null,
      image: {
        url: String,
        public_id: String,
        alt: String
      } | null
    }
  ]
}
```

### Indexes

```javascript
// فهرس على slug للبحث السريع
db.articles.createIndex({ slug: 1 }, { unique: true });

// فهرس على createdAt للترتيب
db.articles.createIndex({ createdAt: -1 });

// فهرس على tag للبحث
db.articles.createIndex({ tag: 1 });

// فهرس مركب للبحث النصي
db.articles.createIndex({
  title: "text",
  description: "text",
  "blocks.title": "text",
  "blocks.content": "text",
});
```

## API Response Patterns

### 1. Success Response Pattern

```typescript
interface SuccessResponse<T> {
  success: true;
  data?: T;
  message?: string;
}

// مثال
{
  "success": true,
  "articles": [...],
  "pagination": {...}
}
```

### 2. Error Response Pattern

```typescript
interface ErrorResponse {
  success: false;
  message: string;
  retryAfter?: number; // للـ rate limiting
}

// مثال
{
  "success": false,
  "message": "تم تجاوز حد طلبات البحث، حاول مرة أخرى لاحقاً",
  "retryAfter": 60
}
```

### 3. Search Response Pattern

```typescript
interface SearchResponse {
  success: true;
  articles: {
    _id: string;
    title: string;
    slug: string;
  }[];
  query: string; // cleaned query
  count: number;
}
```

## Data Validation

### Input Validation Rules

```typescript
// Article Slug
const slugPattern = /^[a-zA-Z0-9-_]+$/;
const slugLength = { min: 1, max: 100 };

// Article Tag
const tagPattern = /^[a-zA-Z0-9\u0600-\u06FF\s-_]+$/;
const tagLength = { min: 1, max: 50 };

// Search Query
const searchQueryLength = { min: 1, max: 100 };

// Email
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailLength = { max: 100 };
```

### Sanitization Rules

```typescript
// HTML Sanitization
const sanitizeHTML = (html: string): string => {
  return html
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

// Input Sanitization
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, "")
    .replace(/['"]/g, "")
    .replace(/[{}]/g, "")
    .replace(/[$]/g, "")
    .replace(/[\\]/g, "")
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
```

## Performance Considerations

### 1. Database Queries

```javascript
// ✅ صحيح - استخدام projection
db.articles.find(
  {},
  {
    title: 1,
    slug: 1,
    tag: 1,
    description: 1,
    createdAt: 1,
    banner: 1,
  }
);

// ✅ صحيح - البحث في الكتل
db.articles.find({
  $or: [
    { title: { $regex: "search-term", $options: "i" } },
    { description: { $regex: "search-term", $options: "i" } },
    { "blocks.title": { $regex: "search-term", $options: "i" } },
    { "blocks.content": { $regex: "search-term", $options: "i" } },
  ],
});
```

### 2. Caching Strategy

```typescript
// Redis Cache Keys
const cacheKeys = {
  articles: (page: number, limit: number) => `articles:${page}:${limit}`,
  article: (slug: string) => `article:${slug}`,
  search: (query: string) => `search:${query}`,
  tags: (tag: string) => `tags:${tag}`,
};

// Cache TTL
const cacheTTL = {
  articles: 3600, // 1 hour
  article: 7200, // 2 hours
  search: 1800, // 30 minutes
  tags: 3600, // 1 hour
};
```

## Security Considerations

### 1. NoSQL Injection Protection

```typescript
// ❌ خطأ - عرضة للهجوم
db.articles.find({ title: userInput });

// ✅ صحيح - محمي
db.articles.find({ title: { $eq: sanitizedInput } });
```

### 2. XSS Protection

```typescript
// ❌ خطأ - عرضة للهجوم
<div dangerouslySetInnerHTML={{ __html: article.content }} />

// ✅ صحيح - محمي
<div>{sanitizeHTML(article.content)}</div>
```

### 3. Rate Limiting

```typescript
// Rate Limiting per endpoint
const rateLimits = {
  search: { windowMs: 60000, max: 10 }, // 10 requests/minute
  contact: { windowMs: 300000, max: 10 }, // 10 requests/5 minutes
  general: { windowMs: 900000, max: 100 }, // 100 requests/15 minutes
};
```

---

**آخر تحديث**: ${new Date().toLocaleDateString('ar-SA')}
**الإصدار**: 1.0.0
