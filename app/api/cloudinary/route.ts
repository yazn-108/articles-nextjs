import cloudinary from "@/lib/cloudinary";
export async function POST(req: Request) {
  try {
    const { file, public_id } = await req.json();
    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }
    const options: Record<string, boolean> = {};
    if (public_id) {
      options.public_id = public_id;
      options.overwrite = true;
    }
    const result = await cloudinary.uploader.upload(file, options);
    return Response.json({
      secure_url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}