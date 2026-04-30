import IsAdmin from "@/hooks/IsAdmin";
import cloudinary from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const session = await IsAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { file, public_id } = await req.json();
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const options: Record<string, boolean> = {};
    if (public_id) {
      options.public_id = public_id;
      options.overwrite = true;
    }
    const result = await cloudinary.uploader.upload(file, options);
    return NextResponse.json({
      secure_url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
  const session = await IsAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { public_ids }: { public_ids: string | string[] } = await req.json();
    if (!public_ids) {
      return NextResponse.json({ error: "No image id provided" }, { status: 400 });
    }
    const result = await cloudinary.api.delete_resources([...public_ids]);
    return NextResponse.json({ message: `deleted ${result}` });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}