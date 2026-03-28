"use client";
import HandleUploadImage from "@/hooks/HandleUploadImage";
import { ArticleDetailsResponse } from "@/types/ArticleDetails";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Activity, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { Input, Textarea } from "./FormElements";
const EditArticle = ({ article }: { article: ArticleDetailsResponse }) => {
  const [IsOpen, setIsOpen] = useState<boolean>(false);
  const [newArticleLoader, setNewArticleLoader] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const EditArticleInfo = useMutation({
    mutationFn: (data: ArticleDetailsResponse) =>
      axios.put(`/api/admin/articles`, data).then((res) => res.data),
    onSuccess: (res) => {
      toast.success(res.message);
      setNewArticleLoader(false);
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
    onError: (err: AxiosError) => {
      const data = err.response?.data as { error?: string };
      toast.error(data?.error);
      setNewArticleLoader(false);
    },
  });
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNewArticleLoader(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const banner = data.banner as File;
    const image =
      banner.size > 0
        ? await HandleUploadImage({
            file: banner,
            public_id: article.banner.alt,
          })
        : null;
    const articleData: ArticleDetailsResponse = {
      ...article,
      slug: (data.slug as string) ?? article.slug,
      title: (data.title as string) ?? article.title,
      tag: (data.tag as string) ?? article.tag,
      description: (data.description as string) ?? article.description,
      SubscribersNotified: false,
      banner: {
        url: image?.secure_url ?? article.banner.url,
        public_id: image?.public_id ?? article.banner.public_id,
        alt: (data["banner-description"] as string) ?? article.banner.alt,
      },
    };
    if (JSON.stringify(articleData) !== JSON.stringify(article)) {
      EditArticleInfo.mutate(articleData);
    } else {
      toast.warning("لم يتم إجراء أي تغييرات على المقالة");
      setNewArticleLoader(false);
    }
  };
  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-md bg-primary cursor-pointer"
      >
        تعديل المقالة
      </button>
      <Activity mode={IsOpen ? "visible" : "hidden"}>
        {IsOpen &&
          createPortal(
            <section
              onClick={() => setIsOpen(false)}
              className="backdrop-blur-3xl size-full z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            >
              <form
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
                className="bg-background size-[90%] rounded-md border-primary border-2 p-4 grid gap-4 grid-cols-1 grid-rows-[auto_1fr_auto]"
              >
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-md bg-primary cursor-pointer w-fit"
                >
                  x
                </button>
                <div className="overflow-x-auto p-4 space-y-3">
                  <Input
                    name="title"
                    type="text"
                    placeholder="عنوان المقالة"
                    defaultValue={article.title}
                  />
                  <Input
                    name="slug"
                    type="text"
                    placeholder="Slug (عنوان في الرابط)"
                    defaultValue={article.slug}
                  />
                  <Input
                    name="tag"
                    type="text"
                    placeholder="التاغ (tag)"
                    defaultValue={article.tag}
                  />
                  <Textarea
                    name="description"
                    placeholder="وصف المقالة"
                    className="mt-4 resize-none h-48"
                    defaultValue={article.description}
                  />
                  <Input name="banner" type="file" />
                  <Input
                    name="banner-description"
                    type="text"
                    placeholder="وصف الصورة (alt)"
                    defaultValue={article.banner.alt}
                  />
                  <div>
                    {/* title: string | null;
                      content?: string | null;
                      code?: CodeBlock | null;
                      image?: ImageType | null;
                      link: {
                        url: string;
                        title: string;
                      }; */}
                  </div>
                </div>
                <button
                  type="submit"
                  className="py-2 rounded-md bg-primary cursor-pointer w-full"
                >
                  {newArticleLoader ? "جاري النشر..." : "تعديل المقالة"}
                </button>
              </form>
            </section>,
            document.body,
          )}
      </Activity>
    </div>
  );
};
export default EditArticle;
