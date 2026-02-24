import { Activity, useState } from "react";
import { createPortal } from "react-dom";
const ArticleForm = ({ buttonText }: { buttonText: string }) => {
  const [IsOpen, setIsOpen] = useState<boolean>(false);
  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    setIsOpen(false);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);
    // setIsOpen(false);
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
              onClick={(e) => handleClose(e)}
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
                  <Input type="text" placeholder="عنوان المقالة" />
                  <Input type="text" placeholder="Slug (عنوان في الرابط)" />
                  <Input type="text" placeholder="التاغ (tag)" />
                  {/* <label htmlFor="date">
                    {format(new Date(2014, 1, 11), "dd-MM-yyyy")}
                  </label>
                  <Input type="date" id="date" />
                  <Calendar /> */}
                  <Input type="file" />
                  <Textarea
                    name="content"
                    placeholder="محتوى المقالة"
                    className="mt-4 resize-none h-48"
                  />
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
