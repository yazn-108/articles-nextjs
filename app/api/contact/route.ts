import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { promisify } from "util";
import {
  sanitizeText,
  sanitizeHTML,
  validateEmail,
  logSuspiciousActivity
} from "@/lib/security";
import { contactRateLimiter } from "@/lib/rateLimiter";
export const POST = async (req: Request) => {
  try {
    // Rate Limiting
    const rateLimitResult = contactRateLimiter(req);
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
    const { name, email, message } = await req.json();
    // Recording suspicious activities
    logSuspiciousActivity(req, `${name} ${email} ${message}`, '/api/contact');
    // Verify that the required data is available
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "جميع الحقول مطلوبة", type: "error" },
        { status: 400 }
      );
    }
    // Clean inputs
    const cleanName = sanitizeText(name);
    const cleanEmail = email.trim();
    const cleanMessage = sanitizeText(message);
    // Email verification
    if (!validateEmail(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: "البريد الالكتروني غير صحيح", type: "error" },
        { status: 400 }
      );
    }
    // Check the length of the data
    if (cleanName.length < 2 || cleanName.length > 50) {
      return NextResponse.json(
        { success: false, message: "الاسم يجب أن يكون بين 2 و 50 حرف", type: "error" },
        { status: 400 }
      );
    }
    if (cleanMessage.length < 10 || cleanMessage.length > 1000) {
      return NextResponse.json(
        { success: false, message: "الرسالة يجب أن تكون بين 10 و 1000 حرف", type: "error" },
        { status: 400 }
      );
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
    // Convert functions to Promisified
    const verifyAsync = promisify(transporter.verify).bind(transporter);
    const sendMailAsync = promisify(transporter.sendMail).bind(transporter);
    // Server verification
    await verifyAsync();
    // Send the message to your email
    await sendMailAsync({
      from: `"مُركَّز" <${process.env.GMAIL_EMAIL}>`,
      replyTo: cleanEmail,
      to: `"مُركَّز" <${process.env.GMAIL_EMAIL}>`,
      subject: `📩 رسالة جديدة من ${cleanName}`,
      html: `
        <!DOCTYPE html>
        <html lang="ar">
          <body style="direction: rtl; font-family: ui-sans-serif, system-ui, sans-serif;">
            <p><b>الاسم:</b> ${sanitizeHTML(cleanName)}</p>
            <p><b>البريد:</b> ${sanitizeHTML(cleanEmail)}</p>
            <p style="text-align: center;">${sanitizeHTML(cleanMessage)}</p>
          </body>
        </html>
      `,
    });
    // Send a confirmation message to the sender
    await sendMailAsync({
      from: `"مُركَّز" <${process.env.GMAIL_EMAIL}>`,
      to: cleanEmail,
      subject: "✅ تم استلام رسالتك",
      html: `
        <!DOCTYPE html>
        <html lang="ar">
          <body style="direction: rtl; font-family: ui-sans-serif, system-ui, sans-serif;">
            <h3 style="font-weight: bold; text-align: center">حياك الله <span style="color: #34a1e7;">${sanitizeHTML(cleanName)}</span></h3>
            <p style="text-align: center;">سيتم التواصل معك قريبا إن شاء الله.</p>
            <p style="text-align: center; margin: 30px 0">
              <a href="https://yazn-108.github.io/" style="background-color: #34a1e7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 999px; font-weight: bold;">خذ نظرة على موقعي الشخصي</a>
            </p>
            <p style="text-align: center">أو</p>
            <p style="text-align: center; margin: 30px 0">
              <a href="https://yazn-108.github.io/" style="background-color: #34a1e7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 999px; font-weight: bold;">اشترك في النشرة البريدية</a>
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0" />
            <p style="color: #999; font-size: 12px; text-align: center">&copy; ${new Date().getFullYear()} منصة مُركَّز. جميع الحقوق محفوظة.</p>
          </body>
        </html>
      `,
    });
    return NextResponse.json({ success: true, message: "تم إرسال الرسالة بنجاح" });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: (error instanceof Error ? error.message : "حدث خطأ في الارسال") },
      { status: 500 }
    );
  }
};
