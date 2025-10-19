import { getColl } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import {
  sanitizeText,
  logSuspiciousActivity
} from '@/lib/security';
import { generalRateLimiter } from '@/lib/rateLimiter';
export const POST = async (request: Request) => {
  try {
    // Rate Limiting
    const rateLimitResult = generalRateLimiter(request);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: rateLimitResult.message,
          retryAfter: rateLimitResult.retryAfter
        },
        { status: 429 }
      );
    }
    const { token } = await request.json();
    // Recording suspicious activities
    logSuspiciousActivity(request, token, '/api/confirm');
    // Clean up the token
    const cleanToken = sanitizeText(token);
    if (!cleanToken) return NextResponse.json({ success: false, message: "Invalid token" }, { status: 400 });
    // Is on the waiting list?
    const pendingCollection = await getColl({ dbName: "newsletter", collectionName: "pendingSubscribers" });
    const record = await pendingCollection.findOne({ token: cleanToken });
    if (!record) return NextResponse.json({ success: false, message: "لم يتم العثور على رمز التحقق" }, { status: 404 });
    // It has expired?
    const now = new Date();
    const tokenAge = now.getTime() - new Date(record.createdAt).getTime();
    const maxAge = 2 * 60 * 1000;
    if (tokenAge > maxAge) {
      await pendingCollection.deleteOne({ token: cleanToken });
      return NextResponse.json({ success: false, message: "انتهت صلاحية رمز التحقق" }, { status: 410 });
    }
    // Add to subscriber list
    const subscribersCollection = await getColl({ dbName: "newsletter", collectionName: "emails" });
    await subscribersCollection.insertOne({ email: record.email, subscribedAt: new Date() });
    await pendingCollection.deleteOne({ token: cleanToken });
    // Return joining success message
    return NextResponse.json({ success: true, message: "تم الاشتراك في النشرة البريدية" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error, message: "حدث خطأ اثناء التحقق" }, { status: 500 });
  }
};
