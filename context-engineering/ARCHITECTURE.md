# Architecture - معمارية التطبيق

## نظرة عامة

منصة مُركَّز مبنية على Next.js 14 مع App Router، وتستخدم معمارية متقدمة تشمل طبقات متعددة للأمان والمراقبة والأداء.

## المعمارية العامة

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Frontend)                  │
├─────────────────────────────────────────────────────────────┤
│  Next.js 14 App Router │ React Components │ Tailwind CSS   │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Layer (Backend)                      │
├─────────────────────────────────────────────────────────────┤
│  Next.js API Routes │ Rate Limiting │ Security Middleware   │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                  Business Logic Layer                       │
├─────────────────────────────────────────────────────────────┤
│  Security Context │ Monitoring Context │ Validation Layer   │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                   Data Access Layer                         │
├─────────────────────────────────────────────────────────────┤
│  MongoDB Driver │ Connection Pooling │ Query Optimization   │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer                           │
├─────────────────────────────────────────────────────────────┤
│  MongoDB │ Indexes │ Replica Sets │ Sharding (Future)       │
└─────────────────────────────────────────────────────────────┘
```

## طبقات التطبيق

### 1. Presentation Layer (طبقة العرض)

#### Next.js App Router

```
app/
├── page.tsx                 # الصفحة الرئيسية
├── layout.tsx              # التخطيط العام
├── globals.css             # الأنماط العامة
├── components/             # مكونات React
│   ├── BackToHome.tsx
│   ├── ArticleCard.tsx
│   └── NewsletterForm.tsx
└── unsubscribe/            # صفحات إضافية
    └── [subscriberToken]/
        └── page.tsx
```

#### React Components

- **Server Components**: للعرض السريع
- **Client Components**: للتفاعل مع المستخدم
- **Custom Hooks**: لإدارة الحالة
- **Context Providers**: لتشارك البيانات

### 2. API Layer (طبقة API)

#### Next.js API Routes

```
app/api/
├── articles/
│   ├── route.ts            # GET /api/articles
│   └── [articleSlug]/
│       └── route.ts        # GET /api/articles/[slug]
├── search/
│   └── [word]/
│       └── route.ts        # GET /api/search/[word]
├── tags/
│   └── [tag]/
│       └── route.ts        # GET /api/tags/[tag]
├── contact/
│   └── route.ts            # POST /api/contact
├── subscribe/
│   └── route.ts            # POST /api/subscribe
├── confirm/
│   └── route.ts            # POST /api/confirm
└── unsubscribe/
    └── route.ts            # POST /api/unsubscribe
```

#### Middleware Stack

```typescript
// Request Flow
Request → Rate Limiting → Security Check → Input Validation → Business Logic → Response
```

### 3. Business Logic Layer (طبقة المنطق)

#### Security Context

```typescript
lib/contexts/SecurityContext.ts
├── Input Sanitization
├── NoSQL Injection Protection
├── XSS Protection
├── Rate Limiting
├── Suspicious Activity Logging
└── Security Metrics
```

#### Monitoring Context

```typescript
lib/contexts/MonitoringContext.ts
├── Performance Metrics
├── Health Checks
├── Error Tracking
├── Alert System
└── System Monitoring
```

#### Validation Layer

```typescript
lib/security.ts
├── Input Validation
├── Email Validation
├── Slug Validation
├── Tag Validation
└── Search Query Validation
```

### 4. Data Access Layer (طبقة الوصول للبيانات)

#### MongoDB Connection

```typescript
lib/mongodb.ts
├── Connection Pooling
├── Error Handling
├── Retry Logic
└── Connection Management
```

#### Query Optimization

```typescript
// Safe Query Creation
createSafeQuery(field, value);
createSafeRegexQuery(field, value);

// Indexed Queries
db.articles.find({ slug: "open-graph" });
db.articles.find({ tag: "meta-tags" });

// Complex Queries with Blocks
db.articles.find({
  $or: [
    { title: { $regex: "search-term", $options: "i" } },
    { "blocks.content": { $regex: "search-term", $options: "i" } },
  ],
});
```

## تدفق البيانات (Data Flow)

### 1. Request Flow

```
1. Client Request
   ↓
2. Next.js Router
   ↓
3. API Route Handler
   ↓
4. Rate Limiting Check
   ↓
5. Security Validation
   ↓
6. Input Sanitization
   ↓
7. Business Logic
   ↓
8. Database Query
   ↓
9. Response Processing
   ↓
10. Client Response
```

### 2. Error Handling Flow

```
1. Error Occurs
   ↓
2. Error Classification
   ↓
3. Logging & Monitoring
   ↓
4. User-Friendly Message
   ↓
5. Security Alert (if needed)
   ↓
6. Error Response
```

### 3. Security Flow

```
1. Request Received
   ↓
2. IP Validation
   ↓
3. Rate Limit Check
   ↓
4. Input Sanitization
   ↓
5. Suspicious Activity Detection
   ↓
6. Security Logging
   ↓
7. Request Processing
   ↓
8. Response Security Headers
```

## أنماط التصميم (Design Patterns)

### 1. Context Pattern

```typescript
// Security Context
const securityContext = new SecurityContext();

// Monitoring Context
const monitoringContext = new MonitoringContext();

// Usage in API routes
const isBlocked = securityContext.isIPBlocked(clientIP);
const metrics = monitoringContext.getMetrics();
```

### 2. Middleware Pattern

```typescript
// Rate Limiting Middleware
const rateLimiter = (options) => (req) => {
  // Rate limiting logic
};

// Security Middleware
const securityMiddleware = (req) => {
  // Security checks
};
```

### 3. Repository Pattern

```typescript
// Database Repository
class ArticleRepository {
  async findById(id: string) {
    return await this.collection.findOne({ _id: id });
  }

  async findBySlug(slug: string) {
    return await this.collection.findOne({ slug });
  }
}
```

### 4. Observer Pattern

```typescript
// Security Event Observer
securityContext.on("suspicious_activity", (event) => {
  // Handle suspicious activity
});

// Performance Observer
monitoringContext.on("performance_alert", (alert) => {
  // Handle performance issues
});
```

## الأمان (Security Architecture)

### 1. Defense in Depth

```
┌─────────────────────────────────────────┐
│              Client Side                │
│  Input Validation │ XSS Protection     │
├─────────────────────────────────────────┤
│              Network Layer              │
│  HTTPS │ Rate Limiting │ DDoS Protection│
├─────────────────────────────────────────┤
│              Application Layer          │
│  Input Sanitization │ NoSQL Protection │
├─────────────────────────────────────────┤
│              Database Layer             │
│  Query Validation │ Access Control     │
└─────────────────────────────────────────┘
```

### 2. Security Layers

- **Input Layer**: تنظيف وتحقق من المدخلات
- **Processing Layer**: حماية من NoSQL Injection
- **Output Layer**: حماية من XSS
- **Network Layer**: Rate Limiting و DDoS Protection
- **Database Layer**: Query Validation و Access Control

## المراقبة (Monitoring Architecture)

### 1. Metrics Collection

```typescript
// Performance Metrics
interface PerformanceMetrics {
  responseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  requestCount: number;
  errorCount: number;
}

// Security Metrics
interface SecurityMetrics {
  totalRequests: number;
  blockedRequests: number;
  suspiciousActivities: number;
  rateLimitHits: number;
}
```

### 2. Alerting System

```typescript
// Alert Types
type AlertType = "PERFORMANCE" | "ERROR" | "SECURITY" | "HEALTH";

// Alert Severity
type AlertSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
```

### 3. Health Checks

```typescript
// System Health
interface HealthCheck {
  status: "healthy" | "degraded" | "unhealthy";
  checks: {
    database: boolean;
    api: boolean;
    memory: boolean;
    disk: boolean;
  };
}
```

## الأداء (Performance Architecture)

### 1. Caching Strategy

```typescript
// Redis Cache
const cacheKey = `article:${slug}`;
const cached = await redis.get(cacheKey);

if (!cached) {
  const article = await db.articles.findOne({ slug });
  await redis.setex(cacheKey, 3600, JSON.stringify(article));
}
```

### 2. Database Optimization

```javascript
// Indexes
db.articles.createIndex({ slug: 1 }, { unique: true });
db.articles.createIndex({ createdAt: -1 });
db.articles.createIndex({ tag: 1 });

// Query Optimization
db.articles
  .find({ published: true })
  .select({ title: 1, slug: 1, createdAt: 1 })
  .sort({ createdAt: -1 })
  .limit(10);
```

### 3. CDN Integration

```typescript
// Static Assets
const staticAssets = {
  images: "https://cdn.example.com/images/",
  css: "https://cdn.example.com/css/",
  js: "https://cdn.example.com/js/",
};
```

## قابلية التوسع (Scalability)

### 1. Horizontal Scaling

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Load      │    │   Load      │    │   Load      │
│  Balancer   │    │  Balancer   │    │  Balancer   │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   App       │    │   App       │    │   App       │
│  Instance 1 │    │  Instance 2 │    │  Instance 3 │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           ▼
                  ┌─────────────┐
                  │   MongoDB    │
                  │   Cluster    │
                  └─────────────┘
```

### 2. Database Scaling

```javascript
// Replica Set
{
  "replicaSet": "articles-rs",
  "members": [
    { "host": "primary:27017", "priority": 2 },
    { "host": "secondary1:27017", "priority": 1 },
    { "host": "secondary2:27017", "priority": 1 }
  ]
}

// Sharding (Future)
{
  "shards": [
    { "host": "shard1:27017" },
    { "host": "shard2:27017" },
    { "host": "shard3:27017" }
  ]
}
```

## النشر (Deployment Architecture)

### 1. Production Environment

```
┌─────────────────────────────────────────┐
│              CDN Layer                  │
│  CloudFlare │ Static Assets │ Caching   │
├─────────────────────────────────────────┤
│              Load Balancer              │
│  Nginx │ SSL Termination │ Rate Limiting│
├─────────────────────────────────────────┤
│              Application Layer          │
│  Next.js App │ PM2 │ Process Management │
├─────────────────────────────────────────┤
│              Database Layer             │
│  MongoDB │ Replica Set │ Backup         │
└─────────────────────────────────────────┘
```

### 2. Environment Configuration

```typescript
// Environment Variables
const config = {
  development: {
    mongoUrl: "mongodb://localhost:27017/articles-dev",
    port: 3000,
    debug: true,
  },
  production: {
    mongoUrl: process.env.MONGO_URL,
    port: process.env.PORT || 3000,
    debug: false,
  },
};
```

## الصيانة والتطوير

### 1. Code Organization

```
lib/
├── contexts/           # Context Engineering
│   ├── SecurityContext.ts
│   └── MonitoringContext.ts
├── security.ts         # Security Utilities
├── rateLimiter.ts      # Rate Limiting
└── mongodb.ts          # Database Connection
```

### 2. Testing Strategy

```typescript
// Unit Tests
describe("SecurityContext", () => {
  it("should sanitize input correctly", () => {
    // Test implementation
  });
});

// Integration Tests
describe("API Endpoints", () => {
  it("should handle search requests", async () => {
    // Test implementation
  });
});
```

### 3. Documentation

- **API Documentation**: Swagger/OpenAPI
- **Code Documentation**: JSDoc
- **Architecture Documentation**: This file
- **Security Documentation**: SECURITY_GUIDE.md

---

**آخر تحديث**: ${new Date().toLocaleDateString('ar-SA')}
**الإصدار**: 1.0.0
