"use client";
import { Input } from "@/app/dashboard/_components/FormElements";
import { ArticleTY } from "@/types/Articles";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Activity, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
const DeleteArticle = ({ article }: { article: ArticleTY }) => {
  const blocksImagesIds =
    article.blocks
      ?.filter((block) => block.image)
      .map((block) => block.image!.public_id) ?? [];
  const [Open, setOpen] = useState<boolean>(false);
  const [deleteArticleLoader, setDeleteArticleLoader] =
    useState<boolean>(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("article-title") as string;
    if (title !== article.title) {
      toast.error("عنوان المقالة غير متطابق");
      return;
    }
    setDeleteArticleLoader(true);
    try {
      const response = await fetch(`/api/admin/articles/${article.slug}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: article._id,
          public_ids_of_images: [article.banner.public_id, ...blocksImagesIds],
        }),
      });
      const data = await response.json();
      if (response.ok) {
        router.push("/dashboard");
        toast.success(
          <span dir="rtl">
            تم حذف مقالة <span dir="ltr">{article.title}</span> بنجاح
          </span>,
        );
        queryClient.invalidateQueries({ queryKey: ["articles"] });
      } else {
        console.error("Error deleting article:", data.error);
        setDeleteArticleLoader(false);
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      setDeleteArticleLoader(false);
    }
  };
  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-md bg-primary cursor-pointer"
      >
        حذف المقالة
      </button>
      <Activity mode={Open ? "visible" : "hidden"}>
        {Open &&
          createPortal(
            <section
              onClick={() => setOpen(false)}
              className="backdrop-blur-3xl size-full z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            >
              <form
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
                className="bg-background size-[90%] rounded-md border-primary border-2 p-4 grid gap-4 grid-cols-1 grid-rows-[auto_1fr_auto]"
              >
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 rounded-md bg-primary cursor-pointer w-fit"
                  >
                    x
                  </button>
                  <strong>{article.title}</strong>
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <label htmlFor="article-title">
                    قم بادخال عنوان المقالة لتأكيد الحذف
                  </label>
                  <Input
                    id="article-title"
                    name="article-title"
                    type="text"
                    placeholder="عنوان المقالة"
                  />
                </div>
                <button
                  type="submit"
                  className="py-2 rounded-md bg-primary cursor-pointer w-full"
                >
                  {deleteArticleLoader ? "جاري الحذف..." : "متابعة الحذف"}
                </button>
              </form>
            </section>,
            document.body,
          )}
      </Activity>
    </div>
  );
};
export default DeleteArticle;
