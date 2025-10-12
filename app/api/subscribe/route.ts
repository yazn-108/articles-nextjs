import { getColl } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import { promisify } from 'util';
import {
  validateEmail,
  logSuspiciousActivity
} from '@/lib/security';
import { generalRateLimiter } from '@/lib/rateLimiter';
export const POST = async (request: Request) => {
  try {
    // تطبيق Rate Limiting
    const rateLimitResult = generalRateLimiter(request);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: rateLimitResult.message,
          retryAfter: rateLimitResult.retryAfter,
          type: "error"
        },
        { status: 429 }
      );
    }
    const { email } = await request.json();
    // تسجيل الأنشطة المشبوهة
    logSuspiciousActivity(request, email, '/api/subscribe');
    // تنظيف البريد الإلكتروني
    const cleanEmail = email?.trim();
    // التحقق من صحة البريد الإلكتروني
    if (!cleanEmail || !validateEmail(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: "البريد الالكتروني غير صحيح", type: "error" },
        { status: 400 }
      );
    }
    // Available on the subscriber list?
    const emailsCollection = await getColl({ dbName: "newsletter", collectionName: "emails" });
    const existingEmail = await emailsCollection.findOne({ email: cleanEmail });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "بالفعل هذا البريد مشترك في النشرة البريدية", type: "info" }
      );
    }
    // Is on the waiting list?
    const pendingCollection = await getColl({ dbName: "newsletter", collectionName: "pendingSubscribers" });
    const existingPending = await pendingCollection.findOne({ email: cleanEmail });
    const now = new Date();
    if (existingPending) {
      // It has expired?
      const requestAge = now.getTime() - new Date(existingPending.createdAt).getTime();
      const maxAge = 2 * 60 * 1000;
      // Is on the waiting list
      if (requestAge <= maxAge) {
        return NextResponse.json(
          { success: false, message: "بالفعل تم ارسال رسالة التحقق", type: "warning" },
          { status: 400 }
        );
      } else {
        await pendingCollection.deleteOne({ email: cleanEmail });
      }
    }
    // Generate a random token to confirm subscription
    const token = randomBytes(20).toString("hex");
    // Add to waiting list
    await pendingCollection.insertOne({ email: cleanEmail, token, createdAt: now });
    // Send a verification message
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
    // تحويل sendMail إلى Promise باستخدام promisify
    const sendMailAsync = promisify(transporter.sendMail).bind(transporter);
    const confirmUrl = `${process.env.url}/confirm/${token}`;
    await sendMailAsync({
      from: `"مُركَّز" <${process.env.GMAIL_EMAIL}>`,
      to: cleanEmail,
      subject: "تأكيد اشتراكك في النشرة البريدية لمنصة مُركَّز",
      html: `
        <!doctype html>
        <html lang="ar">
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>مُركَّز</title></head>
        <body style="direction: rtl; font-family: ui-sans-serif, system-ui, sans-serif;">
          <h3 style="font-weight: bold; text-align: center">مرحبا بك في مُركَّز</h3>
          <p style="text-align: center">تأكيد اشتراكك في النشرة البريدية لمنصة مُركَّز</p>
          <p style="text-align: center; margin: 30px 0">
            <a href="${confirmUrl}" style="background-color: #34a1e7; color: white; padding: 1rem 3rem; text-decoration: none; border-radius: 999px; font-weight: bold;">تأكيد الاشتراك</a>
          </p>
          <p style="color: #999; font-size: 12px; text-align: center">إذا لم تطلب الاشتراك، يمكنك تجاهل هذه الرسالة.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0" />
          <p style="color: #999; font-size: 12px; text-align: center">&copy; ${now.getFullYear()} منصة مُركَّز. جميع الحقوق محفوظة.</p>
        </body>
        </html>
      `,
    });
    return NextResponse.json({ success: true, message: "تم ارسال رسالة التحقق" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error, message: "تم ارسال رسالة التحقق", type: "catchError" },
      { status: 500 }
    );
  }
};
