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
    // Rate Limiting
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
    // Recording suspicious activities
    logSuspiciousActivity(request, rawSlug, '/api/articles');
    // Check for slug
    if (!rawSlug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }
    // Check the data type
    if (typeof rawSlug !== "string") {
      return NextResponse.json({ error: "Invalid slug type" }, { status: 400 });
    }
    // slug cleaning
    const slug = sanitizeInput(rawSlug);
    // slug validation
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
    // Use a safe query
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
