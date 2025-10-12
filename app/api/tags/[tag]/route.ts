import { NextResponse } from "next/server";
import { getColl } from "@/lib/mongodb";
import {
  sanitizeInput,
  validateTag,
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
    const rawTag = parts[parts.length - 1];
    // تسجيل الأنشطة المشبوهة
    logSuspiciousActivity(request, rawTag, '/api/tags');
    // التحقق من وجود tag
    if (!rawTag) {
      return NextResponse.json({ error: "Missing tag" }, { status: 400 });
    }
    // التحقق من نوع البيانات
    if (typeof rawTag !== "string") {
      return NextResponse.json({ error: "Invalid tag type" }, { status: 400 });
    }
    // تنظيف tag
    const tag = sanitizeInput(rawTag);
    // التحقق من صحة tag
    if (!validateTag(tag)) {
      return NextResponse.json({ error: "Invalid tag format" }, { status: 400 });
    }
    const coll = await getColl({
      dbName: "articles-database",
      collectionName: "articles-list"
    });
    if (!coll) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }
    // استخدام استعلام آمن
    const articles = await coll
      .find(createSafeQuery("tag", tag))
      .limit(100) // تحديد حد أقصى للنتائج
      .toArray();
    if (!articles.length) {
      return NextResponse.json({ error: "No articles found for this tag" }, { status: 404 });
    }
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Tags API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
