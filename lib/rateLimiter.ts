/**
 * مكتبة Rate Limiting لمنع الهجمات
 */
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}
const store: RateLimitStore = {};
// تنظيف البيانات المنتهية الصلاحية
const cleanupExpiredEntries = () => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
};
// مسح جميع البيانات (للاستخدام في الاختبار)
export const clearRateLimitStore = () => {
  Object.keys(store).forEach(key => {
    delete store[key];
  });
};
// مسح بيانات Rate Limiting لـ IP محدد
export const clearRateLimitForIP = (ip: string) => {
  Object.keys(store).forEach(key => {
    if (key.includes(ip)) {
      delete store[key];
    }
  });
};
// عرض حالة Rate Limiting (للاستخدام في الاختبار)
export const getRateLimitStatus = () => {
  const now = Date.now();
  const status: { [key: string]: { count: number; resetTime: number; remaining: number } } = {};
  Object.keys(store).forEach(key => {
    const entry = store[key];
    status[key] = {
      count: entry.count,
      resetTime: entry.resetTime,
      remaining: Math.max(0, Math.ceil((entry.resetTime - now) / 1000))
    };
  });
  return status;
};
// الحصول على IP العميل
export const getClientIP = (req: Request): string => {
  return req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    'unknown';
};
// Rate Limiter
export const rateLimiter = (options: {
  windowMs: number;
  maxRequests: number;
  message?: string;
}) => {
  const { windowMs, maxRequests, message = 'Too many requests' } = options;
  return (req: Request): { allowed: boolean; message?: string; retryAfter?: number } => {
    const clientIP = getClientIP(req);
    const now = Date.now();
    const key = `${clientIP}:${Math.floor(now / windowMs)}`;
    // تنظيف البيانات المنتهية الصلاحية
    cleanupExpiredEntries();
    // التحقق من الحد الحالي
    if (!store[key]) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs
      };
      return { allowed: true };
    }
    if (store[key].count >= maxRequests) {
      const retryAfter = Math.ceil((store[key].resetTime - now) / 1000);
      return {
        allowed: false,
        message,
        retryAfter
      };
    }
    store[key].count++;
    return { allowed: true };
  };
};
// Rate Limiter للبحث (أكثر تقييداً)
export const searchRateLimiter = rateLimiter({
  windowMs: 60 * 1000, // دقيقة واحدة
  maxRequests: 10, // 10 طلبات في الدقيقة
  message: 'تم تجاوز حد طلبات البحث، حاول مرة أخرى لاحقاً'
});
// Rate Limiter للاتصال (أكثر تقييداً)
export const contactRateLimiter = rateLimiter({
  windowMs: 5 * 60 * 1000, // 5 دقائق
  maxRequests: 10, // 1 طلب في 5 دقائق (10 في التطوير)
  message: 'تم تجاوز حد إرسال الرسائل، حاول مرة أخرى لاحقاً',
});
// Rate Limiter عام
export const generalRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  maxRequests: 100, // 100 طلب في 15 دقيقة
  message: 'تم تجاوز حد الطلبات، حاول مرة أخرى لاحقاً'
});
