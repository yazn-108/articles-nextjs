/**
 * مكتبة الأمان لمنع هجمات NoSQL Injection و XSS
 */
// تنظيف المدخلات من الرموز الخطيرة
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // إزالة علامات HTML
    .replace(/['"]/g, '') // إزالة علامات التنصيص
    .replace(/[{}]/g, '') // إزالة الأقواس المعقوفة
    .replace(/[$]/g, '') // إزالة علامة الدولار
    .replace(/[\\]/g, '') // إزالة الشرطة المائلة
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // تنظيف regex
};
// تنظيف استعلامات البحث بشكل خاص
export const sanitizeSearchQuery = (query: string): string => {
  if (typeof query !== 'string') return '';
  // إزالة الرموز الخطيرة في regex
  const cleaned = query
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/[<>{}'"]/g, '');
  // تحديد طول معقول
  return cleaned.substring(0, 100);
};
// التحقق من صحة slug
export const validateSlug = (slug: string): boolean => {
  if (typeof slug !== 'string') return false;
  return /^[a-zA-Z0-9-_]+$/.test(slug) && slug.length > 0 && slug.length < 100;
};
// التحقق من صحة tag
export const validateTag = (tag: string): boolean => {
  if (typeof tag !== 'string') return false;
  return /^[a-zA-Z0-9\u0600-\u06FF\s-_]+$/.test(tag) && tag.length > 0 && tag.length < 50;
};
// التحقق من صحة استعلام البحث
export const validateSearchQuery = (query: string): boolean => {
  if (typeof query !== 'string') return false;
  return query.length > 0 && query.length < 100 && !query.includes('$');
};
// تنظيف HTML لمنع XSS
export const sanitizeHTML = (html: string): string => {
  if (typeof html !== 'string') return '';
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
// تسجيل الأنشطة المشبوهة
export const logSuspiciousActivity = (req: Request, query: string, endpoint: string) => {
  const suspiciousPatterns = ['$', '{', '}', 'ne', 'gt', 'lt', 'regex', 'where'];
  const hasSuspiciousPattern = suspiciousPatterns.some(pattern =>
    query.toLowerCase().includes(pattern)
  );
  if (hasSuspiciousPattern) {
    const clientIP = req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'unknown';
    console.warn(`🚨 Suspicious activity detected:`, {
      endpoint,
      query: query.substring(0, 100),
      clientIP,
      userAgent: req.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    });
  }
};
// إنشاء استعلام آمن لـ MongoDB
export const createSafeQuery = (field: string, value: string) => {
  const sanitizedValue = sanitizeInput(value);
  return { [field]: { $regex: `^${sanitizedValue}$`, $options: "i" } };
};
// إنشاء استعلام regex آمن
export const createSafeRegexQuery = (field: string, value: string) => {
  const sanitizedValue = sanitizeSearchQuery(value);
  return { [field]: { $regex: sanitizedValue, $options: 'i' } };
};
// التحقق من صحة البريد الإلكتروني
export const validateEmail = (email: string): boolean => {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length < 100;
};
// تنظيف النص للعرض الآمن
export const sanitizeText = (text: string): string => {
  if (typeof text !== 'string') return '';
  return text
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .substring(0, 1000); // تحديد طول معقول
};
