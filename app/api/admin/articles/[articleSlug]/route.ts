import { getColl } from "@/lib/mongodb";
import { generalRateLimiter } from "@/lib/rateLimiter";
import {
  createSafeQuery,
  logSuspiciousActivity,
  sanitizeInput,
  validateSlug
} from "@/lib/security";
import { NextResponse } from "next/server";
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
    const article = await coll.findOne({ ...createSafeQuery("slug", slug) });
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch (error) {
    console.error("Article API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
// export async function PUT(request: Request) {
//   const { updated, _id, deletedImageIdsOfBlocks }: { updated: ArticleTY, _id: string; deletedImageIdsOfBlocks: string[] } = await request.json()
//   const blocks = (updated.blocks || []).map((block: ArticleBlockTY) => ({
//     ...block,
//     id: block.id ?? new ObjectId(),
//   }))
//   const updatedArticle = {
//     ...updated,
//     blocks
//   }
//   const coll = await getColl({ dbName: "articles-database", collectionName: "articles-list" });
//   await coll.updateOne({ _id: new ObjectId(_id) },
//     { $set: updatedArticle });
//   const deletedImages = deletedImageIdsOfBlocks.length > 0 && await cloudinary.api.delete_resources(deletedImageIdsOfBlocks)
//   return NextResponse.json({ updatedArticle, deletedImages });
// }
// export async function DELETE(request: Request) {
//   const { _id, public_ids_of_images }: { _id: string; public_ids_of_images: string[] } = await request.json()
//   const coll = await getColl({ dbName: "articles-database", collectionName: "articles-list" });
//   const article = await coll.deleteOne({ _id: new ObjectId(_id) });
//   const deletedImages = await cloudinary.api.delete_resources(public_ids_of_images)
//   return NextResponse.json({ article, deletedImages });
// }