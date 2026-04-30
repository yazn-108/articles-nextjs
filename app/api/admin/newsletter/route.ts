import IsAdmin from "@/hooks/IsAdmin";
import { getColl } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { promisify } from "util";
export async function POST(req: Request) {
  const session = await IsAdmin();
  if (!session) {
    return NextResponse.json({ error: "غير مسموح" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { slug, title } = body
    const collEmail = await getColl({
      dbName: "newsletter",
      collectionName: "emails",
    });
    const newsletterEmails = await collEmail.find({}, { projection: { _id: 1, email: 1 } }).toArray();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
    const verifyAsync = promisify(transporter.verify).bind(transporter);
    const sendMailAsync = promisify(transporter.sendMail).bind(transporter);
    await verifyAsync();
    await Promise.all(
      newsletterEmails.map(subscriber =>
        sendMailAsync({
          from: `"مُركَّز" <${process.env.GMAIL_EMAIL}>`,
          to: subscriber.email,
          subject: "مقالة جديدة على منصة مُركَّز",
          html: `
            <!DOCTYPE html>
            <html lang="ar">
              <body
                style="direction: rtl; font-family: ui-sans-serif, system-ui, sans-serif"
              >
                <h3 style="font-weight: bold; text-align: center">تم نشر مقالة جديدة!</h3>
                  <p style="text-align: center; color: #999">${title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
                <p style="text-align: center; margin: 30px 0">
                  <a
                    href="https://murakkaz.vercel.app/article/${slug}"
                    style="
                      background-color: #34a1e7;
                      color: white;
                      padding: 1rem 3rem;
                      text-decoration: none;
                      border-radius: 999px;
                      font-weight: bold;
                    "
                  >
                    قراءة المقالة
                  </a>
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0" />
                <p style="color: #999; font-size: 12px; text-align: center">
                  &copy; ${new Date().getFullYear()} منصة مُركَّز. جميع الحقوق محفوظة.
                  <br />
                  <a
                    href="https://murakkaz.vercel.app/unsubscribe/${subscriber._id}"
                    style="color: #999"
                  >
                    إلغاء الاشتراك في النشرة
                  </a>
                </p>
              </body>
            </html>`,
        })
      )
    );
    return NextResponse.json(
      { message: "تم تنبيه المتابعون" },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "خطأ في تنبيه المتابعون" }, { status: 500 });
  }
}