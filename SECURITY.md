# دليل الأمان - Security Guide

## الحماية من هجمات NoSQL Injection

تم تطبيق عدة طبقات حماية لمنع هجمات NoSQL Injection في هذا التطبيق:

### 1. تنظيف المدخلات (Input Sanitization)

- **الملف**: `lib/security.ts`
- **الوظائف**:
  - `sanitizeInput()`: تنظيف المدخلات من الرموز الخطيرة
  - `sanitizeSearchQuery()`: تنظيف استعلامات البحث بشكل خاص
  - `sanitizeHTML()`: تنظيف HTML لمنع XSS

### 2. التحقق من صحة البيانات (Input Validation)

- **الوظائف**:
  - `validateSlug()`: التحقق من صحة slug
  - `validateTag()`: التحقق من صحة العلامات
  - `validateSearchQuery()`: التحقق من صحة استعلامات البحث
  - `validateEmail()`: التحقق من صحة البريد الإلكتروني

### 3. استعلامات آمنة (Safe Queries)

- **الوظائف**:
  - `createSafeQuery()`: إنشاء استعلامات آمنة لـ MongoDB
  - `createSafeRegexQuery()`: إنشاء استعلامات regex آمنة

### 4. Rate Limiting

- **الملف**: `lib/rateLimiter.ts`
- **الأنواع**:
  - `searchRateLimiter`: 10 طلبات في الدقيقة للبحث
  - `contactRateLimiter`: 3 طلبات في 15 دقيقة للاتصال
  - `generalRateLimiter`: 100 طلب في 15 دقيقة عام

### 5. تسجيل الأنشطة المشبوهة (Suspicious Activity Logging)

- **الوظيفة**: `logSuspiciousActivity()`
- **تسجل**:
  - استعلامات تحتوي على رموز خطيرة (`$`, `{`, `}`, `ne`, `gt`, `lt`)
  - IP العميل
  - User Agent
  - الوقت والتاريخ

## الملفات المحمية

### 1. `/api/search/[word]/route.ts`

- ✅ تنظيف استعلامات البحث
- ✅ Rate limiting (10 طلبات/دقيقة)
- ✅ تسجيل الأنشطة المشبوهة
- ✅ تحديد حد أقصى للنتائج (50)

### 2. `/api/articles/[articleSlug]/route.ts`

- ✅ تنظيف slug
- ✅ التحقق من صحة slug
- ✅ Rate limiting عام
- ✅ تسجيل الأنشطة المشبوهة

### 3. `/api/tags/[tag]/route.ts`

- ✅ تنظيف العلامات
- ✅ التحقق من صحة العلامات
- ✅ Rate limiting عام
- ✅ تسجيل الأنشطة المشبوهة
- ✅ تحديد حد أقصى للنتائج (100)

### 4. `/api/contact/route.ts`

- ✅ تنظيف النصوص
- ✅ حماية من XSS
- ✅ Rate limiting (3 طلبات/15 دقيقة)
- ✅ التحقق من طول البيانات

### 5. `/api/subscribe/route.ts`

- ✅ تنظيف البريد الإلكتروني
- ✅ Rate limiting عام
- ✅ تسجيل الأنشطة المشبوهة

### 6. `/api/confirm/route.ts`

- ✅ تنظيف الرموز
- ✅ Rate limiting عام
- ✅ تسجيل الأنشطة المشبوهة

### 7. `/api/unsubscribe/route.ts`

- ✅ تنظيف الرموز
- ✅ Rate limiting عام
- ✅ تسجيل الأنشطة المشبوهة

## أمثلة على الهجمات المحظورة

### NoSQL Injection

```
❌ /api/search/.*|.*
❌ /api/articles/{"$ne": null}
❌ /api/tags/{"$gt": ""}
❌ /api/search/.*\$ne.*
```

### XSS

```
❌ <script>alert('XSS')</script>
❌ javascript:alert('XSS')
❌ onload=alert('XSS')
```

## مراقبة الأمان

### 1. فحص السجلات

```bash
# البحث عن أنشطة مشبوهة
grep "Suspicious activity detected" logs/

# فحص Rate Limiting
grep "Rate limit exceeded" logs/
```

### 2. مؤشرات الأداء

- عدد الطلبات المرفوضة
- عدد الأنشطة المشبوهة
- متوسط وقت الاستجابة

## التوصيات الإضافية

### 1. تحديثات أمنية

- مراجعة دورية للكود
- تحديث المكتبات المستخدمة
- فحص دوري للثغرات

### 2. مراقبة متقدمة

- إضافة نظام إنذار للأنشطة المشبوهة
- ربط مع خدمات مراقبة خارجية
- تحليل أنماط الهجمات

### 3. نسخ احتياطية

- نسخ احتياطية دورية للبيانات
- خطة استرداد في حالة الهجمات
- اختبار دوري لخطة الاسترداد

## جهات الاتصال للأمان

في حالة اكتشاف ثغرة أمنية، يرجى التواصل عبر:

- البريد الإلكتروني: security@example.com
- GitHub Issues: [رابط Issues]

---

**آخر تحديث**: ${new Date().toLocaleDateString('ar-SA')}
**الإصدار**: 1.0.0
