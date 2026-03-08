const HandleUploadImage = async ({
  file,
  public_id,
}: {
  file: File;
  public_id?: string | null;
}): Promise<{
  secure_url: string;
  public_id: string;
} | null> => {
  if (!file) return null;
  const base64 = await new Promise<string | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => {
      reject(new Error("فشل قراءة الملف"));
    };
    reader.readAsDataURL(file);
  });
  const res = await fetch("/api/cloudinary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file: base64, public_id }),
  });
  const data = await res.json();
  return data;
};
export default HandleUploadImage;
