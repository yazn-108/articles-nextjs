"use client";
import GoBackToHome from "@/app/_components/GoBackToHome";
import { ArticleTY } from "@/types/Articles";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import DeleteArticle from "./_components/DeleteArticle";
import EditArticle from "./_components/EditArticle";
const ArticleImage = dynamic(() => import("./_components/ArticleImage"), {
  ssr: false,
  loading: () => (
    <div className="w-full md:w-100 h-75 rounded-2xl bg-gray-600 animate-pulse" />
  ),
});
const BlockImage = dynamic(() => import("./_components/BlockImage"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video rounded-2xl bg-gray-600 animate-pulse" />
  ),
});
const PresentationalArticleDetails = ({ article }: { article: ArticleTY }) => {
  const [formattedCodeBlocks, setFormattedCodeBlocks] = useState<
    Record<string, string>
  >({});
  const shikiMutation = useMutation({
    mutationFn: ({ code, lang }: { code: string; lang: string }) =>
      axios.post("/api/shiki", { code, lang }),
    onSuccess: (res, variables) => {
      const blockId = `${variables.code}-${variables.lang}`;
      setFormattedCodeBlocks((prev) => ({
        ...prev,
        [blockId]: res.data.html,
      }));
    },
  });
  useEffect(() => {
    if (article.blocks) {
      article.blocks.forEach((block) => {
        if (block.code?.content && block.code?.language) {
          const blockId = `${block.code.content}-${block.code.language}`;
          if (!formattedCodeBlocks[blockId]) {
            shikiMutation.mutate({
              code: block.code.content,
              lang: block.code.language,
            });
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article]);
  const blocksList = article?.blocks?.filter(
    (block) => block.title && block.title.trim() !== "" && block,
  );
  const escapeHTML = (text: string) =>
    text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const renderTextWithLinks = (text: string) => {
    const safeText = escapeHTML(text);
    return safeText.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    );
  };
  return (
    <div className="min-h-dvh px-5 md:px-10 py-5">
      <div className="flex gap-4">
        <GoBackToHome>
          <GoBackToHome.BackToHomeIcon url="/dashboard" />
        </GoBackToHome>
        <EditArticle article={article} />
        <DeleteArticle article={article} />
      </div>
      <header className="border-b border-primary pb-10 flex flex-col-reverse md:flex-row items-center gap-10">
        <div className="flex-1 md:max-w-[calc(100%-400px)]">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 wrap-anywhere">
            {article.title}
          </h1>
          <p className="text-secondary text-lg wrap-anywhere">
            {article.description}
          </p>
        </div>
        <ArticleImage banner={article.banner} />
      </header>
      {blocksList && blocksList.length > 0 && (
        <ol className="list-decimal space-y-3 mb-10 p-5 border-b border-primary *:cursor-pointer *:hover:text-primary *:transition-colors">
          {blocksList.map(
            (block) =>
              block.title && (
                <li
                  key={block.id}
                  onClick={() =>
                    document
                      .getElementById(block.id)
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  {block.title}
                </li>
              ),
          )}
          <li
            onClick={() =>
              document
                .getElementById("NewsLetter")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            اشترك في النشرة البريدية
          </li>
        </ol>
      )}
      <main className="space-y-10">
        {article?.blocks?.map((block) => {
          const blockId = block.code
            ? `${block.code.content}-${block.code.language}`
            : "";
          const formattedHtml = formattedCodeBlocks[blockId];
          return (
            <div
              key={block.id}
              id={block.id}
              className={`space-y-5 pb-5 ${
                block.image && "grid lg:grid-cols-2 gap-10"
              }`}
            >
              <div className="space-y-5">
                {block.title && (
                  <Link
                    href={`#${block.id}`}
                    scroll={true}
                    className="text-2xl font-bold max-w-4xl hover:text-primary transition-colors cursor-pointer flex items-center gap-2 group"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/dashboard/article/${article.slug}#${block.id}`,
                      );
                    }}
                  >
                    <span>{block.title}</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 stroke-primary transition-opacity opacity-0 group-hover:opacity-100"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          d="M15.197 3.35462C16.8703 1.67483 19.4476 1.53865 20.9536 3.05046C22.4596 4.56228 22.3239 7.14956 20.6506 8.82935L18.2268 11.2626M10.0464 14C8.54044 12.4882 8.67609 9.90087 10.3494 8.22108L12.5 6.06212"
                          strokeWidth="2"
                          strokeLinecap="round"
                        ></path>
                        <path
                          d="M13.9536 10C15.4596 11.5118 15.3239 14.0991 13.6506 15.7789L11.2268 18.2121L8.80299 20.6454C7.12969 22.3252 4.55237 22.4613 3.0464 20.9495C1.54043 19.4377 1.67609 16.8504 3.34939 15.1706L5.77323 12.7373"
                          strokeWidth="2"
                          strokeLinecap="round"
                        ></path>
                      </g>
                    </svg>
                  </Link>
                )}
                {block.content && (
                  <p
                    className="text-secondary whitespace-pre-line [&_a]:wrap-break-word [&_a]:text-primary [&_a:hover]:text-primary/50 [&_a]:transition-colors [&_strong]:font-bold"
                    dangerouslySetInnerHTML={{
                      __html: renderTextWithLinks(block.content),
                    }}
                  />
                )}
                {block.code && (
                  <div
                    className="grid grid-rows-[auto_1fr] bg-[#1f242d] border-2 text-foreground border-primary max-h-75 p-2 rounded-2xl"
                    dir="ltr"
                  >
                    <div className="flex items-center justify-between">
                      <p className="bg-background w-fit rounded-md py-2 px-5">
                        {block.code.language}
                      </p>
                      <button
                        className="bg-background w-25 rounded-md py-2 px-5 cursor-pointer outline-0"
                        onClick={(e) => {
                          navigator.clipboard.writeText(block.code!.content!);
                          (e.target as HTMLButtonElement).textContent =
                            "تم النسخ";
                          setTimeout(
                            () =>
                              ((e.target as HTMLButtonElement).textContent =
                                "نسخ"),
                            1000,
                          );
                        }}
                      >
                        نسخ
                      </button>
                    </div>
                    <div className="overflow-auto relative">
                      {formattedHtml ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: formattedHtml }}
                          className="[&>pre]:bg-transparent! [&>pre]:m-0! [&>pre]:p-4! [&>pre]:text-sm [&>pre]:leading-relaxed"
                        />
                      ) : (
                        <pre className="p-4 text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
                          {block.code.content}
                        </pre>
                      )}
                      <div className="pointer-events-none sticky bottom-0 left-0 w-full h-10 bg-linear-to-t from-[#1f242d] to-transparent"></div>
                    </div>
                  </div>
                )}
              </div>
              {block.image && <BlockImage image={block.image} />}
            </div>
          );
        })}
      </main>
    </div>
  );
};
export default PresentationalArticleDetails;
