import { NextResponse } from "next/server";
import { getColl } from "@/lib/mongodb";
import {
  sanitizeSearchQuery,
  validateSearchQuery,
  logSuspiciousActivity,
  createSafeRegexQuery
} from "@/lib/security";
import { searchRateLimiter } from "@/lib/rateLimiter";
export const GET = async (request: Request) => {
  try {
    // تطبيق Rate Limiting
    const rateLimitResult = searchRateLimiter(request);
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
    const url = new URL(request.url);
    const pathname = url.pathname;
    const parts = pathname.split("/");
    const rawQuery = decodeURIComponent(parts[parts.length - 1] || "");
    // تسجيل الأنشطة المشبوهة
    logSuspiciousActivity(request, rawQuery, '/api/search');
    // التحقق من صحة الاستعلام
    if (!validateSearchQuery(rawQuery)) {
      return NextResponse.json(
        { success: false, message: "استعلام البحث غير صالح" },
        { status: 400 }
      );
    }
    // تنظيف الاستعلام
    const query = sanitizeSearchQuery(rawQuery);
    if (!query) {
      return NextResponse.json(
        { success: false, message: "استعلام البحث فارغ" },
        { status: 400 }
      );
    }
    const collection = await getColl({
      dbName: "articles-database",
      collectionName: "articles-list",
    });
    if (!collection) {
      return NextResponse.json(
        { success: false, message: "خطأ في الاتصال بقاعدة البيانات" },
        { status: 500 }
      );
    }
    // استخدام استعلامات آمنة
    const results = await collection
      .find(
        {
          $or: [
            createSafeRegexQuery("title", query),
            createSafeRegexQuery("tags", query),
            createSafeRegexQuery("description", query),
          ],
        },
        { projection: { title: 1, slug: 1, _id: 0 } }
      )
      .collation({ locale: "ar", strength: 1 })
      .limit(50) // تحديد حد أقصى للنتائج
      .toArray();
    return NextResponse.json({
      success: true,
      articles: results,
      query: query, // إرجاع الاستعلام المنظف
      count: results.length
    });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ في البحث" },
      { status: 500 }
    );
  }
};
