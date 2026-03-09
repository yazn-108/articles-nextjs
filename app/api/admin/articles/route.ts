import { getColl } from "@/lib/mongodb";
import { ArticleTY } from "@/types/Articles";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "1")
    const skip = (page - 1) * limit
    const coll = await getColl({ dbName: "articles-database", collectionName: "articles-list" })
    if (!coll) {
      return NextResponse.json({ error: "Collection not found" }, { status: 500 })
    }
    const data = await coll
      .find({}, { projection: { SubscribersNotified: 1, title: 1, banner: 1, createdAt: 1, tag: 1, description: 1, slug: 1 } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()
    const totalCount = await coll.countDocuments({})
    const hasMore = skip + limit < totalCount
    return NextResponse.json(
      {
        articles: data,
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
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "خطأ في جلب البيانات" }, { status: 500 })
  }
}
export async function POST(req: NextRequest) {
  try {
    const { title, slug, description, tag, createdAt, banner, SubscribersNotified }: ArticleTY = await req.json();
    const coll = await getColl({
      dbName: "articles-database",
      collectionName: "articles-list",
    });
    if (!coll) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 500 }
      );
    }
    if (!title || !slug || !description || !tag || !createdAt || !banner.url || !banner.alt || SubscribersNotified !== false) {
      return NextResponse.json(
        { error: "بيانات المقالة غير مكتملة" },
        { status: 500 }
      );
    }
    await coll.insertOne({
      title,
      slug,
      description,
      tag,
      createdAt,
      banner,
      SubscribersNotified
    });
    return NextResponse.json(
      { message: "تمت إضافة المقالة بنجاح" },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "خطأ في إضافة المقالة" }, { status: 500 });
  }
}