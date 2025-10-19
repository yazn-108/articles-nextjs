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
    // pagination parameters
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    // extract tag
    const parts = pathname.split("/");
    const rawTag = parts[parts.length - 1];
    // log suspicious activity
    logSuspiciousActivity(request, rawTag, "/api/tags");
    // validate tag
    if (!rawTag) {
      return NextResponse.json({ error: "Missing tag" }, { status: 400 });
    }
    if (typeof rawTag !== "string") {
      return NextResponse.json({ error: "Invalid tag type" }, { status: 400 });
    }
    const tag = sanitizeInput(rawTag);
    if (!validateTag(tag)) {
      return NextResponse.json({ error: "Invalid tag format" }, { status: 400 });
    }
    const coll = await getColl({
      dbName: "articles-database",
      collectionName: "articles-list",
    });
    if (!coll) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }
    const query = createSafeQuery("tag", tag);
    const articles = await coll
      .find(query, {
        projection: {
          title: 1,
          banner: 1,
          createdAt: 1,
          tag: 1,
          description: 1,
          slug: 1,
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    const totalCount = await coll.countDocuments(query);
    const hasMore = skip + limit < totalCount;
    return NextResponse.json(
      {
        articles,
        pagination: {
          page,
          limit,
          totalCount,
          hasMore,
          totalPages: Math.ceil(totalCount / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Tags API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
