# Security Guide - دليل الأمان

## نظرة عامة

منصة مُركَّز محمية بنظام أمان متقدم يشمل حماية من جميع أنواع الهجمات الشائعة مع مراقبة مستمرة للأنشطة المشبوهة.

## طبقات الحماية

### 1. Input Sanitization (تنظيف المدخلات)

#### `lib/security.ts`

```typescript
// تنظيف المدخلات من الرموز الخطيرة
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, "") // إزالة HTML tags
    .replace(/['"]/g, "") // إزالة quotes
    .replace(/[{}]/g, "") // إزالة curly braces
    .replace(/[$]/g, "") // إزالة dollar signs
    .replace(/[\\]/g, "") // إزالة backslashes
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // تنظيف regex
};
```

#### `sanitizeSearchQuery()`

```typescript
// تنظيف استعلامات البحث بشكل خاص
export const sanitizeSearchQuery = (query: string): string => {
  const cleaned = query
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/[<>{}'"]/g, "");
  return cleaned.substring(0, 100); // تحديد طول معقول
};
```

### 2. NoSQL Injection Protection

#### Safe Query Creation

```typescript
// إنشاء استعلام آمن لـ MongoDB
export const createSafeQuery = (field: string, value: string) => {
  const sanitizedValue = sanitizeInput(value);
  return { [field]: { $eq: sanitizedValue } };
};
// إنشاء استعلام regex آمن
export const createSafeRegexQuery = (field: string, value: string) => {
  const sanitizedValue = sanitizeSearchQuery(value);
  return { [field]: { $regex: sanitizedValue, $options: "i" } };
};
```

#### Protected Endpoints

- `/api/search/[word]` - محمي من NoSQL injection
- `/api/articles/[articleSlug]` - محمي من NoSQL injection
- `/api/tags/[tag]` - محمي من NoSQL injection

### 3. XSS Protection

#### HTML Sanitization

```typescript
// تنظيف HTML لمنع XSS
export const sanitizeHTML = (html: string): string => {
  return html
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};
```

#### Text Sanitization

```typescript
// تنظيف النص للعرض الآمن
export const sanitizeText = (text: string): string => {
  return text
    .trim()
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .substring(0, 1000);
};
```

### 4. Rate Limiting

#### `lib/rateLimiter.ts`

```typescript
// Rate Limiter للبحث
export const searchRateLimiter = rateLimiter({
  windowMs: 60 * 1000, // دقيقة واحدة
  maxRequests: 10, // 10 طلبات في الدقيقة
  message: "تم تجاوز حد طلبات البحث، حاول مرة أخرى لاحقاً",
});
// Rate Limiter للاتصال
export const contactRateLimiter = rateLimiter({
  windowMs: 5 * 60 * 1000, // 5 دقائق
  maxRequests: 10, // 10 طلبات في 5 دقائق
  message: "تم تجاوز حد إرسال الرسائل، حاول مرة أخرى لاحقاً",
});
```

#### IP-based Limiting

```typescript
// الحصول على IP العميل
export const getClientIP = (req: NextRequest): string => {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
};
```

### 5. Input Validation

#### Email Validation

```typescript
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length < 100;
};
```

#### Slug Validation

```typescript
export const validateSlug = (slug: string): boolean => {
  return /^[a-zA-Z0-9-_]+$/.test(slug) && slug.length > 0 && slug.length < 100;
};
```

#### Tag Validation

```typescript
export const validateTag = (tag: string): boolean => {
  return (
    /^[a-zA-Z0-9\u0600-\u06FF\s-_]+$/.test(tag) &&
    tag.length > 0 &&
    tag.length < 50
  );
};
```

### 6. Security Monitoring

#### Suspicious Activity Logging

```typescript
export const logSuspiciousActivity = (
  req: Request,
  query: string,
  endpoint: string,
) => {
  const suspiciousPatterns = [
    "$",
    "{",
    "}",
    "ne",
    "gt",
    "lt",
    "regex",
    "where",
  ];
  const hasSuspiciousPattern = suspiciousPatterns.some((pattern) =>
    query.toLowerCase().includes(pattern),
  );
  if (hasSuspiciousPattern) {
    console.warn(`🚨 Suspicious activity detected:`, {
      endpoint,
      query: query.substring(0, 100),
      clientIP: req.headers.get("x-forwarded-for"),
      userAgent: req.headers.get("user-agent"),
      timestamp: new Date().toISOString(),
    });
  }
};
```

## Security Context

### `lib/contexts/SecurityContext.ts`

#### Security Configuration

```typescript
export interface SecurityConfig {
  enableLogging: boolean;
  enableRateLimiting: boolean;
  enableInputValidation: boolean;
  enableXSSProtection: boolean;
  maxRequestSize: number;
  allowedOrigins: string[];
  blockedIPs: string[];
  suspiciousPatterns: string[];
}
```

#### Security Events

```typescript
export interface SecurityEvent {
  type:
    | "SUSPICIOUS_ACTIVITY"
    | "RATE_LIMIT_EXCEEDED"
    | "INVALID_INPUT"
    | "XSS_ATTEMPT";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  message: string;
  data: Record<string, any>;
  timestamp: Date;
  clientIP: string;
  userAgent?: string;
  endpoint: string;
}
```

#### Security Metrics

```typescript
export interface SecurityMetrics {
  totalRequests: number;
  blockedRequests: number;
  suspiciousActivities: number;
  rateLimitHits: number;
  xssAttempts: number;
  lastUpdated: Date;
}
```

## Protected Endpoints

### 1. Search API (`/api/search/[word]`)

**Protections:**

- Input sanitization
- Regex escaping
- Rate limiting (10 requests/minute)
- Suspicious activity logging
- Query validation
  **Example Attack Prevention:**

```
❌ /api/search/.*|.*
❌ /api/search/.*\$ne.*
❌ /api/search/.*\$gt.*
```

### 2. Articles API (`/api/articles/[articleSlug]`)

**Protections:**

- Slug validation
- Input sanitization
- Rate limiting
- Safe query creation
  **Example Attack Prevention:**

```
❌ /api/articles/{"$ne": null}
❌ /api/articles/{"$gt": ""}
```

### 3. Tags API (`/api/tags/[tag]`)

**Protections:**

- Tag validation
- Input sanitization
- Rate limiting
- Safe query creation

### 4. Contact API (`/api/contact`)

**Protections:**

- XSS protection
- Input sanitization
- Rate limiting (10 requests/5 minutes)
- Email validation
- HTML escaping

### 5. Newsletter APIs

**Protections:**

- Email validation
- Token sanitization
- Rate limiting
- Input validation

## Security Best Practices

### 1. Always Sanitize Input

```typescript
// ❌ خطأ
const article = await coll.findOne({ slug: rawSlug });
// ✅ صحيح
const cleanSlug = sanitizeInput(rawSlug);
const article = await coll.findOne(createSafeQuery("slug", cleanSlug));
```

### 2. Validate Before Processing

```typescript
// ❌ خطأ
const results = await collection.find({ title: { $regex: query } });
// ✅ صحيح
if (!validateSearchQuery(query)) {
  return NextResponse.json({ error: "Invalid query" }, { status: 400 });
}
const cleanQuery = sanitizeSearchQuery(query);
const results = await collection.find(
  createSafeRegexQuery("title", cleanQuery),
);
```

### 3. Use Rate Limiting

```typescript
// ❌ خطأ
export const GET = async (request: NextRequest) => {
  // معالجة مباشرة بدون rate limiting
};
// ✅ صحيح
export const GET = async (request: NextRequest) => {
  const rateLimitResult = searchRateLimiter(request);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: rateLimitResult.message },
      { status: 429 },
    );
  }
  // معالجة الطلب
};
```

### 4. Log Suspicious Activities

```typescript
// ❌ خطأ
const results = await collection.find({ title: { $regex: query } });
// ✅ صحيح
logSuspiciousActivity(request, query, "/api/search");
const results = await collection.find(createSafeRegexQuery("title", query));
```

## Monitoring and Alerting

### 1. Security Metrics

```typescript
const metrics = securityContext.getMetrics();
console.log("Security Metrics:", {
  totalRequests: metrics.totalRequests,
  blockedRequests: metrics.blockedRequests,
  suspiciousActivities: metrics.suspiciousActivities,
});
```

### 2. Security Events

```typescript
const events = securityContext.getEvents(50);
events.forEach((event) => {
  console.log(`Security Event [${event.severity}]:`, event.message);
});
```

### 3. Suspicious IPs

```typescript
const suspiciousIPs = securityContext.getSuspiciousIPs();
suspiciousIPs.forEach(({ ip, count }) => {
  if (count > 5) {
    securityContext.blockIP(ip, "Multiple suspicious activities");
  }
});
```

## Attack Prevention Examples

### 1. NoSQL Injection Prevention

```typescript
// ❌ عرضة للهجوم
const user = await collection.findOne({ email: req.body.email });
// ✅ محمي
const cleanEmail = sanitizeInput(req.body.email);
const user = await collection.findOne(createSafeQuery("email", cleanEmail));
```

### 2. XSS Prevention

```typescript
// ❌ عرضة للهجوم
<div dangerouslySetInnerHTML={{ __html: userInput }} />
// ✅ محمي
<div>{sanitizeHTML(userInput)}</div>
```

### 3. Rate Limiting Prevention

```typescript
// ❌ عرضة للهجوم
app.get("/api/search", (req, res) => {
  // معالجة مباشرة
});
// ✅ محمي
app.get(
  "/api/search",
  rateLimiter({ windowMs: 60000, max: 10 }),
  (req, res) => {
    // معالجة محمية
  },
);
```

## Security Checklist

- [x] Input sanitization implemented
- [x] NoSQL injection protection
- [x] XSS protection
- [x] Rate limiting enabled
- [x] Input validation
- [x] Security monitoring
- [x] Suspicious activity logging
- [x] Error handling
- [x] HTTPS enforcement (production)
- [x] Security headers
- [x] Regular security updates

## Incident Response

### 1. Suspicious Activity Detected

1. Log the activity
2. Block IP if necessary
3. Alert administrators
4. Investigate the source

### 2. Rate Limit Exceeded

1. Log the violation
2. Return 429 status
3. Include retry-after header
4. Monitor for patterns

### 3. Security Breach

1. Immediately block suspicious IPs
2. Review security logs
3. Update security measures
4. Notify stakeholders

---

**آخر تحديث**: ${new Date().toLocaleDateString('ar-SA')}
**الإصدار**: 1.0.0
