import { NextResponse } from "next/server";
import { codeToHtml } from "shiki";
export const POST = async (req: Request) => {
  try {
    const { code, lang } = await req.json();
    const html = await codeToHtml(code, { lang, theme: "github-dark" });
    return NextResponse.json({ html });
  } catch (error) {
    console.log(error)
  }
}
