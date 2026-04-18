import { getColl } from "@/lib/mongodb";
import { searchRateLimiter } from "@/lib/rateLimiter";
import {
  createSafeRegexQuery,
  logSuspiciousActivity,
  sanitizeSearchQuery,
  validateSearchQuery
} from "@/lib/security";
import { NextRequest, NextResponse } from "next/server";
export const GET = async (request: NextRequest) => {
  try {
    // Rate Limiting
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
    // Recording suspicious activities
    logSuspiciousActivity(request, rawQuery, '/api/search');
    // Verify the validity of the query
    if (!validateSearchQuery(rawQuery)) {
      return NextResponse.json(
        { success: false, message: "استعلام البحث غير صالح" },
        { status: 400 }
      );
    }
    // Clean up the query
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
    // Use secure queries
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
      .limit(50) // Set a maximum number of results
      .toArray();
    return NextResponse.json({
      success: true,
      articles: results,
      query: query, // Returns the cleaner query
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
