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
    const { pathname, searchParams } = new URL(request.url);
    console.log(pathname)
    // pagination parameters
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "1")
    const skip = (page - 1) * limit
    // 
    const parts = pathname.split("/");
    const rawTag = parts[parts.length - 1];
    // Recording suspicious activities
    logSuspiciousActivity(request, rawTag, '/api/tags');
    // Check for tag
    if (!rawTag) {
      return NextResponse.json({ error: "Missing tag" }, { status: 400 });
    }
    // Check the data type
    if (typeof rawTag !== "string") {
      return NextResponse.json({ error: "Invalid tag type" }, { status: 400 });
    }
    // clean tag
    const tag = sanitizeInput(rawTag);
    // Validate tag
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
    // Use a safe query
    const articles = await coll
      .find(createSafeQuery("tag", tag), { projection: { title: 1, banner: 1, createdAt: 1, tag: 1, description: 1, slug: 1 } }).skip(skip)
      .limit(limit)
      .toArray();
    const totalCount = await coll.countDocuments({})
    const hasMore = skip + limit < totalCount
    return NextResponse.json(
      {
        articles: articles,
        pagination: {
          page,
          limit,
          totalCount,
          hasMore,
          totalPages: Math.ceil(totalCount / limit),
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Tags API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
