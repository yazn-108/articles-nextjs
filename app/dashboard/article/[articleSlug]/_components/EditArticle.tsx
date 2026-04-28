"use client";
import Calendar from "@/app/dashboard/_components/Calendar";
import { Input, Textarea } from "@/app/dashboard/_components/FormElements";
import HandleUploadImage from "@/hooks/HandleUploadImage";
import { ArticleBlock, ArticleTY } from "@/types/Articles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Activity, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
const EditArticle = ({ article }: { article: ArticleTY }) => {
  const queryClient = useQueryClient();
  const [IsOpen, setIsOpen] = useState<boolean>(false);
  const [newArticleLoader, setNewArticleLoader] = useState<boolean>(false);
  const [articleBlocks, setArticleBlocks] = useState<ArticleBlock[]>(
    article.blocks || ([] as ArticleBlock[]),
  );
  const moveBlock = ({
    index,
    direction,
  }: {
    index: number;
    direction: "up" | "down";
  }) => {
    setArticleBlocks((prev) => {
      const newBlocks = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newBlocks.length) return prev;
      [newBlocks[index], newBlocks[targetIndex]] = [
        newBlocks[targetIndex],
        newBlocks[index],
      ];
      return newBlocks;
    });
  };
  const EditArticleInfo = useMutation({
    mutationFn: (data: {
      updatedArticle: ArticleTY;
      deleteBlocksImageByIds?: string[];
    }) =>
      axios
        .put(`/api/admin/articles/${article.slug}`, data)
        .then((res) => res.data),
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
    const bannerFile = data.banner as File;
    const image =
      bannerFile.size > 0
        ? await HandleUploadImage({
            file: bannerFile,
            public_id: article.banner.alt,
          })
        : null;
    const utcMidnight = new Date(
      Date.UTC(
        new Date(data.createdAt as string).getUTCFullYear(),
        new Date(data.createdAt as string).getUTCMonth(),
        new Date(data.createdAt as string).getUTCDate(),
      ),
    );
    const articleData: ArticleTY = {
      ...article,
      slug: (data.slug as string) ?? article.slug,
      title: (data.title as string) ?? article.title,
      tag: (data.tag as string) ?? article.tag,
      description: (data.description as string) ?? article.description,
      createdAt: utcMidnight,
      SubscribersNotified: data["subscribers-notified"] === "on",
      banner: {
        url: image?.secure_url ?? article.banner.url,
        public_id: image?.public_id ?? article.banner.public_id,
        alt: (data["banner-description"] as string) ?? article.banner.alt,
      },
      blocks: articleBlocks,
    };
    if (JSON.stringify(articleData) !== JSON.stringify(article)) {
      EditArticleInfo.mutate({
        updatedArticle: articleData,
        deleteBlocksImageByIds: [],
      });
      setIsOpen(false);
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
                  onClick={() => {
                    setIsOpen(false);
                    setArticleBlocks(article.blocks || ([] as ArticleBlock[]));
                  }}
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
                    className="h-24"
                    defaultValue={article.description}
                  />
                  <Calendar
                    name="createdAt"
                    date={new Date(article.createdAt)}
                  />
                  <Input name="banner" type="file" />
                  <Input
                    name="banner-description"
                    type="text"
                    placeholder="وصف الصورة (alt)"
                    defaultValue={article.banner.alt}
                  />
                  <div>
                    <input
                      id="subscribers-notified"
                      name="subscribers-notified"
                      type="checkbox"
                      defaultChecked={article.SubscribersNotified}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor="subscribers-notified"
                      className={`cursor-pointer bg-gray-800 px-2 py-1 rounded-md peer-checked:bg-primary ${article.SubscribersNotified && "cursor-not-allowed! bg-gray-600!"}`}
                    >
                      إعلام المشتركين عند النشر
                    </label>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="py-2 rounded-md bg-primary/35 cursor-pointer w-full"
                      onClick={() => {
                        setArticleBlocks((prev) => [
                          ...prev,
                          {
                            id: crypto.randomUUID(),
                            title: "",
                            content: "",
                            image: null,
                            code: null,
                          },
                        ]);
                      }}
                    >
                      اضافة بلوك جديد
                    </button>
                    {articleBlocks.map((block, index) => (
                      <section key={block.id} className="my-8">
                        <div className="flex justify-between gap-4">
                          <button
                            onClick={() =>
                              moveBlock({ index, direction: "up" })
                            }
                            type="button"
                          >
                            up
                          </button>
                          <button
                            onClick={() =>
                              moveBlock({ index, direction: "down" })
                            }
                            type="button"
                          >
                            down
                          </button>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <Input
                            type="text"
                            placeholder="عنوان البلوك (اختياري)"
                            className="order-1"
                            defaultValue={block.title ?? ""}
                            onChange={(e) => {
                              setArticleBlocks((prev) => {
                                const newBlocks = [...prev];
                                newBlocks[index] = {
                                  ...newBlocks[index],
                                  title: e.target.value,
                                  content: newBlocks[index].content,
                                  image: {
                                    url: newBlocks[index].image?.url ?? "",
                                    public_id:
                                      newBlocks[index].image?.public_id ?? "",
                                    alt: newBlocks[index].image?.alt ?? "",
                                  },
                                  code: {
                                    language:
                                      newBlocks[index].code?.language ?? "",
                                    content:
                                      newBlocks[index].code?.content ?? "",
                                  },
                                };
                                return newBlocks;
                              });
                            }}
                          />
                          <Textarea
                            placeholder="محتوى البلوك (اختياري)"
                            className="h-24 order-2 sm:order-3"
                            defaultValue={block.content ?? ""}
                          />
                          {/*  */}
                          <Input
                            type="text"
                            placeholder="وصف الصورة (alt)"
                            defaultValue={block.image?.alt}
                            className={`order-3 sm:order-2 ${!block.image && "border-gray-600"}`}
                          />
                          <Input
                            type="file"
                            className={`order-4 ${!block.image && "border-gray-600"}`}
                          />
                          {/*  */}
                          <Input
                            dir="ltr"
                            type="text"
                            className="order-5 col-span-2"
                            placeholder="لغة الكود (اختياري)"
                            defaultValue={block.code?.language ?? ""}
                          />
                          <Textarea
                            dir="ltr"
                            placeholder="كود البلوك (اختياري)"
                            defaultValue={block.code?.content ?? ""}
                            className="order-6 col-span-2 min-h-24 max-h-96"
                          />
                          {/*  */}
                        </div>
                      </section>
                    ))}
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
