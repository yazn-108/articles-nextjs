# API Documentation - منصة مُركَّز

## نظرة عامة

تطبيق Next.js يوفر API endpoints آمنة لإدارة المقالات والنشرات البريدية. جميع الـ endpoints محمية بنظام أمان متقدم.

## Base URL

```
http://localhost:3000/api
```

## Authentication

جميع الـ endpoints لا تتطلب authentication، لكنها محمية بـ:

- Rate Limiting
- Input Validation
- Security Monitoring

## Rate Limiting

| Endpoint    | Limit        | Window     |
| ----------- | ------------ | ---------- |
| `/search/*` | 10 requests  | 1 minute   |
| `/contact`  | 10 requests  | 5 minutes  |
| General     | 100 requests | 15 minutes |

## Endpoints

### 1. Articles

#### GET `/api/articles`

جلب قائمة المقالات مع pagination

**Query Parameters:**

- `page` (optional): رقم الصفحة (default: 1)
- `limit` (optional): عدد المقالات في الصفحة (default: 1)

**Response:**

```json
{
  "articles": [
    {
      "_id": "68bda3b80c7228b48933d0fa",
      "title": "اظهار بيانات محددة عند مشاركة رابط الموقع",
      "slug": "open-graph",
      "tag": "meta-tags",
      "description": "الـOpen Graph هي مجموعة وسوم خاصة بالشبكات الاجتماعية...",
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

#### GET `/api/articles/[articleSlug]`

جلب مقال محدد

**Parameters:**

- `articleSlug` (string): معرف المقال

**Response:**

```json
{
  "_id": "68bda3b80c7228b48933d0fa",
  "title": "اظهار بيانات محددة عند مشاركة رابط الموقع",
  "slug": "open-graph",
  "tag": "meta-tags",
  "description": "الـOpen Graph هي مجموعة وسوم خاصة بالشبكات الاجتماعية...",
  "createdAt": "2024-05-14T00:00:00.000Z",
  "banner": {
    "url": "https://res.cloudinary.com/dki71zmkb/image/upload/v1757258679/v3eenjpmqzuuekiw0qj1.png",
    "public_id": "v3eenjpmqzuuekiw0qj1",
    "alt": "open graph image"
  },
  "blocks": [
    {
      "title": "ماهي نتيجة استخدام meta tags؟",
      "content": "تستخدم لعرض بيانات عن محتويات الرابط عند مشاركته...",
      "code": null,
      "image": {
        "alt": "yazn open graph in linkedin",
        "public_id": "eifmakyi9cmim2pbhtra",
        "url": "https://res.cloudinary.com/dki71zmkb/image/upload/v1757259363/eifmakyi9cmim2pbhtra.png"
      },
      "id": "68bdabc90c7228b48933d112"
    }
  ]
}
```

**Error Responses:**

- `400`: Invalid slug format
- `404`: Article not found
- `429`: Rate limit exceeded

### 2. Search

#### GET `/api/search/[word]`

البحث في المقالات

**Parameters:**

- `word` (string): كلمة البحث

**Security Features:**

- Input sanitization
- Regex escaping
- Suspicious activity logging

**Response:**

```json
{
  "success": true,
  "articles": [
    {
      "_id": "68bda3b80c7228b48933d0fa",
      "title": "اظهار بيانات محددة عند مشاركة رابط الموقع",
      "slug": "open-graph"
    }
  ],
  "query": "cleaned-query",
  "count": 1
}
```

**Error Responses:**

- `400`: Invalid search query
- `429`: Rate limit exceeded (10 requests/minute)

### 3. Tags

#### GET `/api/tags/[tag]`

جلب المقالات حسب العلامة

**Parameters:**

- `tag` (string): اسم العلامة

**Response:**

```json
{
  "articles": [
    {
      "_id": "68bda3b80c7228b48933d0fa",
      "title": "اظهار بيانات محددة عند مشاركة رابط الموقع",
      "slug": "open-graph",
      "tag": "meta-tags",
      "description": "الـOpen Graph هي مجموعة وسوم خاصة بالشبكات الاجتماعية...",
      "createdAt": "2024-05-14T00:00:00.000Z",
      "banner": {
        "url": "https://res.cloudinary.com/dki71zmkb/image/upload/v1757258679/v3eenjpmqzuuekiw0qj1.png",
        "public_id": "v3eenjpmqzuuekiw0qj1",
        "alt": "open graph image"
      }
    }
  ],
  "tag": "meta-tags",
  "count": 1
}
```

### 4. Contact

#### POST `/api/contact`

إرسال رسالة اتصال

**Request Body:**

```json
{
  "name": "اسم المرسل",
  "email": "email@example.com",
  "message": "نص الرسالة"
}
```

**Security Features:**

- Email validation
- XSS protection
- Input sanitization
- Rate limiting (10 requests/5 minutes)

**Response:**

```json
{
  "success": true,
  "message": "تم إرسال الرسالة بنجاح"
}
```

**Error Responses:**

- `400`: Invalid input data
- `429`: Rate limit exceeded

### 5. Newsletter

#### POST `/api/subscribe`

الاشتراك في النشرة البريدية

**Request Body:**

```json
{
  "email": "email@example.com"
}
```

**Process:**

1. Email validation
2. Check if already subscribed
3. Generate confirmation token
4. Send confirmation email
5. Add to pending subscribers

**Response:**

```json
{
  "success": true,
  "message": "تم ارسال رسالة التحقق"
}
```

#### POST `/api/confirm`

تأكيد الاشتراك

**Request Body:**

```json
{
  "token": "confirmation-token"
}
```

**Response:**

```json
{
  "success": true,
  "message": "تم الاشتراك في النشرة البريدية"
}
```

#### POST `/api/unsubscribe`

إلغاء الاشتراك

**Request Body:**

```json
{
  "token": "subscriber-token"
}
```

**Response:**

```json
{
  "success": true,
  "message": "تم إلغاء الاشتراك"
}
```

## Security Features

### 1. Input Sanitization

جميع المدخلات يتم تنظيفها من:

- HTML tags
- Special characters
- NoSQL injection patterns
- XSS attempts

### 2. Rate Limiting

نظام Rate Limiting متقدم:

- IP-based limiting
- Endpoint-specific limits
- Automatic cleanup
- Retry-after headers

### 3. Monitoring

تسجيل شامل لـ:

- Suspicious activities
- Rate limit violations
- Error patterns
- Performance metrics

### 4. Validation

التحقق من صحة البيانات:

- Email format validation
- Slug format validation
- Tag format validation
- Search query validation

## Error Handling

جميع الـ endpoints تستخدم نظام error handling موحد:

```typescript
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}

// Error Response
{
  "success": false,
  "message": "Error message",
  "retryAfter": 60 // for rate limiting
}
```

## Status Codes

| Code | Description           |
| ---- | --------------------- |
| 200  | Success               |
| 400  | Bad Request           |
| 404  | Not Found             |
| 429  | Too Many Requests     |
| 500  | Internal Server Error |

## Examples

### Search Example

```bash
curl -X GET "http://localhost:3000/api/search/تقنية" \
  -H "Content-Type: application/json"
```

### Contact Example

```bash
curl -X POST "http://localhost:3000/api/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "message": "رسالة تجريبية"
  }'
```

### Subscribe Example

```bash
curl -X POST "http://localhost:3000/api/subscribe" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

## Monitoring

### Security Logs

```typescript
// Suspicious activity detected
{
  endpoint: '/api/search',
  query: '{"$ne": null}',
  clientIP: '192.168.1.100',
  userAgent: 'Mozilla/5.0...',
  timestamp: '2024-01-15T10:30:00.000Z'
}
```

### Performance Metrics

```typescript
{
  responseTime: 150,
  memoryUsage: 45.2,
  requestCount: 1250,
  errorRate: 2.5
}
```

## Best Practices

1. **Always validate input** before processing
2. **Use rate limiting** to prevent abuse
3. **Log suspicious activities** for monitoring
4. **Sanitize all user inputs** to prevent attacks
5. **Handle errors gracefully** with proper status codes
6. **Monitor performance** and resource usage

---

**آخر تحديث**: ${new Date().toLocaleDateString('ar-SA')}
**الإصدار**: 1.0.0
