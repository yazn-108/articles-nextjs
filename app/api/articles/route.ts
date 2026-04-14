import { getColl } from "@/lib/mongodb"
import { NextRequest, NextResponse } from "next/server"
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const safePage = isNaN(page) || page < 1 ? 1 : page
    const limit = Number.parseInt(searchParams.get("limit") || "1")
    const safeLimit = isNaN(limit) || limit < 1 ? 6 : limit
    const skip = (safePage - 1) * safeLimit
    const coll = await getColl({ dbName: "articles-database", collectionName: "articles-list" })
    if (!coll) {
      return NextResponse.json({ error: "Collection not found" }, { status: 500 })
    }
    const data = await coll
      .find({ SubscribersNotified: { $ne: false } }, { projection: { title: 1, banner: 1, createdAt: 1, tag: 1, description: 1, slug: 1 } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .toArray()
    const totalCount = await coll.countDocuments({})
    const hasMore = skip + safeLimit < totalCount
    return NextResponse.json(
      {
        articles: data,
        pagination: {
          page: safePage,
          limit: safeLimit,
          totalCount,
          hasMore,
          totalPages: Math.ceil(totalCount / safeLimit),
        },
      },
      { status: 200 },
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "خطأ في جلب البيانات" }, { status: 500 })
  }
}
