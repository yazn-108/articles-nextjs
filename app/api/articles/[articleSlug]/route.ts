import { NextResponse } from "next/server";
import { getColl } from "@/lib/mongodb";
import {
  sanitizeInput,
  validateSlug,
  logSuspiciousActivity,
  createSafeQuery
} from "@/lib/security";
import { generalRateLimiter } from "@/lib/rateLimiter";
export async function GET(request: Request) {
  try {
    // تطبيق Rate Limiting
    const rateLimitResult = generalRateLimiter(request);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: rateLimitResult.message,
          retryAfter: rateLimitResult.retryAfter
        },
        { status: 429 }
      );
    }
    const url = new URL(request.url);
    const pathname = url.pathname;
    const parts = pathname.split("/");
    const rawSlug = parts[parts.length - 1];
    // تسجيل الأنشطة المشبوهة
    logSuspiciousActivity(request, rawSlug, '/api/articles');
    // التحقق من وجود slug
    if (!rawSlug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }
    // التحقق من نوع البيانات
    if (typeof rawSlug !== "string") {
      return NextResponse.json({ error: "Invalid slug type" }, { status: 400 });
    }
    // تنظيف slug
    const slug = sanitizeInput(rawSlug);
    // التحقق من صحة slug
    if (!validateSlug(slug)) {
      return NextResponse.json({ error: "Invalid slug format" }, { status: 400 });
    }
    const coll = await getColl({
      dbName: "articles-database",
      collectionName: "articles-list"
    });
    if (!coll) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }
    // استخدام استعلام آمن
    const article = await coll.findOne(createSafeQuery("slug", slug));
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch (error) {
    console.error("Article API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
