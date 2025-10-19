/**
 * Security library to prevent NoSQL Injection and XSS attacks
 */
// Clean up inputs of dangerous codes
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/['"]/g, '') // Remove quotation marks
    .replace(/[{}]/g, '') // Remove brackets
    .replace(/[$]/g, '') // Remove the dollar sign
    .replace(/[\\]/g, '') // Remove slash
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // clean regex
};
// Clean up search queries specifically
export const sanitizeSearchQuery = (query: string): string => {
  if (typeof query !== 'string') return '';
  // Remove dangerous symbols in regex
  const cleaned = query
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/[<>{}'"]/g, '');
  // Determine a reasonable length
  return cleaned.substring(0, 100);
};
// slug validation
export const validateSlug = (slug: string): boolean => {
  if (typeof slug !== 'string') return false;
  return /^[a-zA-Z0-9-_]+$/.test(slug) && slug.length > 0 && slug.length < 100;
};
// Validate tag
export const validateTag = (tag: string): boolean => {
  if (typeof tag !== 'string') return false;
  return /^[a-zA-Z0-9\u0600-\u06FF\s-_]+$/.test(tag) && tag.length > 0 && tag.length < 50;
};
// Validate search query
export const validateSearchQuery = (query: string): boolean => {
  if (typeof query !== 'string') return false;
  return query.length > 0 && query.length < 100 && !query.includes('$');
};
// Clean HTML to prevent XSS
export const sanitizeHTML = (html: string): string => {
  if (typeof html !== 'string') return '';
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
// Recording suspicious activities
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
// Create a secure query for MongoDB
export const createSafeQuery = (field: string, value: string) => {
  const sanitizedValue = sanitizeInput(value);
  return { [field]: { $regex: `^${sanitizedValue}$`, $options: "i" } };
};
// Create a secure regex query
export const createSafeRegexQuery = (field: string, value: string) => {
  const sanitizedValue = sanitizeSearchQuery(value);
  return { [field]: { $regex: sanitizedValue, $options: 'i' } };
};
// Email verification
export const validateEmail = (email: string): boolean => {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length < 100;
};
// Clean up text for safe viewing
export const sanitizeText = (text: string): string => {
  if (typeof text !== 'string') return '';
  return text
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .substring(0, 1000); // Determine a reasonable length
};
