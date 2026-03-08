import HandleUploadImage from "@/hooks/HandleUploadImage";
import { ArticleTY } from "@/types/Articles";
import { Activity, useState } from "react";
import { createPortal } from "react-dom";
import Calendar from "./calendar";
const ArticleForm = ({
  buttonText,
  article,
}: {
  buttonText: string;
  article?: ArticleTY;
}) => {
  const [IsOpen, setIsOpen] = useState<boolean>(false);
  const handleClose = () => {
    setIsOpen(false);
  };
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const image = await HandleUploadImage({
      file: data.banner as File,
    });
    const articleData: ArticleTY = {
      slug: data.slug as string,
      title: data.title as string,
      tag: data.tag as string,
      description: data.description as string,
      createdAt: new Date(data.createdAt as string),
      banner: {
        url: image!.secure_url,
        alt: image!.public_id,
      },
    };
    console.log(articleData);
  };
  return (
    <div className="m-4">
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-md bg-primary cursor-pointer"
      >
        {buttonText}
      </button>
      <Activity mode={IsOpen ? "visible" : "hidden"}>
        {IsOpen &&
          createPortal(
            <section
              onClick={handleClose}
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
                    defaultValue={article?.title}
                  />
                  <Input
                    name="slug"
                    type="text"
                    placeholder="Slug (عنوان في الرابط)"
                    defaultValue={article?.slug}
                  />
                  <Input
                    name="tag"
                    type="text"
                    placeholder="التاغ (tag)"
                    defaultValue={article?.tag}
                  />
                  <Textarea
                    name="description"
                    placeholder="وصف المقالة"
                    className="mt-4 resize-none h-48"
                  />
                  <Calendar
                    name="createdAt"
                    date={article?.createdAt && new Date(article?.createdAt)}
                  />
                  <Input name="banner" type="file" />
                </div>
                <button
                  type="submit"
                  className="py-2 rounded-md bg-primary cursor-pointer w-full"
                >
                  {buttonText}
                </button>
              </form>
            </section>,
            document.body,
          )}
      </Activity>
    </div>
  );
};
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props,
) => {
  return (
    <input
      {...props}
      className="border-[#55b0e9] border-2 rounded-md w-full px-2 py-0.5 outline-none focus:ring-2 focus:ring-primary"
    />
  );
};
const Textarea: React.FC<React.InputHTMLAttributes<HTMLTextAreaElement>> = (
  props,
) => {
  return (
    <textarea
      {...props}
      className="border-[#55b0e9] border-2 rounded-md w-full px-2 py-0.5 outline-none focus:ring-2 focus:ring-primary"
    />
  );
};
export default ArticleForm;
