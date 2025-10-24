"use client";
import GoBackToHome from "@/app/_components/GoBackToHome";
import { ArticleDetailsResponse } from "@/types/ArticleDetails";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";
const ArticleImage = dynamic(() => import("./_components/ArticleImage"), {
  ssr: false,
  loading: () => (
    <div className="w-full md:w-[400px] h-[300px] rounded-2xl bg-gray-600 animate-pulse" />
  ),
});
const BlockImage = dynamic(() => import("./_components/BlockImage"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[16/9] rounded-2xl bg-gray-600 animate-pulse" />
  ),
});
import Link from "next/link";
import React, { useEffect, useState } from "react";
const PresentationalArticleDetails = ({
  article,
}: {
  article: ArticleDetailsResponse;
}) => {
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
  const blocksList = article.blocks.filter(
    (block) => block.title && block.title.trim() !== "" && block
  );
  const renderTextWithLinks = (text: string) => {
    const markdownRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    const result = text.replace(
      markdownRegex,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    return result;
  };
  return (
    <div className="min-h-dvh px-5 md:px-10 py-5">
      <GoBackToHome>
        <GoBackToHome.BackToHomeIcon />
      </GoBackToHome>
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
      {blocksList.length > 0 && (
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
              )
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
        {article.blocks.map((block) => {
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
                  <h2 className="text-2xl font-bold max-w-4xl">
                    {block.title}
                  </h2>
                )}
                {block.content && (
                  <p
                    className="text-secondary whitespace-pre-line [&_a]:text-primary [&_a:hover]:text-primary/50 [&_a]:transition-colors"
                    dangerouslySetInnerHTML={{
                      __html: renderTextWithLinks(block.content),
                    }}
                  />
                )}
                {block.code && (
                  <div
                    className="grid grid-rows-[auto_1fr] bg-[#1f242d] border-2 text-foreground border-primary max-h-[300px] p-2 rounded-2xl"
                    dir="ltr"
                  >
                    <div className="flex items-center justify-between">
                      <p className="bg-background w-fit rounded-md py-2 px-5">
                        {block.code.language}
                      </p>
                      <button
                        className="bg-background w-[100px] rounded-md py-2 px-5 cursor-pointer outline-0"
                        onClick={(e) => {
                          navigator.clipboard.writeText(block.code!.content!);
                          (e.target as HTMLButtonElement).textContent =
                            "تم النسخ";
                          setTimeout(
                            () =>
                              ((e.target as HTMLButtonElement).textContent =
                                "نسخ"),
                            1000
                          );
                        }}
                      >
                        نسخ
                      </button>
                    </div>
                    <div className="overflow-auto">
                      {formattedHtml ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: formattedHtml }}
                          className="[&>pre]:!bg-transparent [&>pre]:!m-0 [&>pre]:!p-4 [&>pre]:text-sm [&>pre]:leading-relaxed"
                        />
                      ) : (
                        <pre className="p-4 text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
                          {block.code.content}
                        </pre>
                      )}
                    </div>
                  </div>
                )}
                {block.link && (
                  <Link target="_blank" href={block.link.url}>
                    {block.link.title}
                  </Link>
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
