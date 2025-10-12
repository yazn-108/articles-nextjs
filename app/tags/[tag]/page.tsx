"use client";
import GoBackToHome from "@/app/_components/GoBackToHome";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { use } from "react";
interface ImageType {
  url: string;
  alt: string;
}
interface CodeBlock {
  language?: string;
  content?: string;
}
interface Block {
  id: string;
  title: string | null;
  content?: string | null;
  code?: CodeBlock | null;
  image?: ImageType | null;
}
export interface ArticleTY {
  _id: string;
  title: string;
  slug: string;
  tag: string;
  description: string;
  createdAt: Date;
  banner: ImageType;
  blocks: Block[];
}
const Page = ({ params }: { params: Promise<{ tag: string }> }) => {
  const { tag } = use(params);
  const { data: articles, isLoading } = useQuery<ArticleTY[]>({
    queryKey: [tag],
    queryFn: () => axios.get(`/api/tags/${tag}`).then((res) => res.data),
    staleTime: 10000,
  });
  return (
    <div className="p-5 space-y-4">
      <div className="flex justify-between items-center">
        <GoBackToHome>
          <GoBackToHome.BackToHomeIcon />
        </GoBackToHome>
        <h3 className="text-3xl md:text-xl text-center font-bold text-secondary space-x-2">
          <span>#</span>
          <span>{tag}</span>
        </h3>
      </div>
      {isLoading && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-0 py-5 sm:p-5 gap-x-10 gap-y-16">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className={`space-y-4 animate-pulse ${
                index > 0 ? "hidden sm:block" : ""
              }`}
            >
              <div className="bg-gray-700 rounded-2xl w-full h-[300px] aspect-[16/9]"></div>
              <div className="flex justify-center items-center gap-5">
                <div className="bg-gray-600 h-4 w-20 rounded"></div>
                <div className="bg-gray-600 h-6 w-16 rounded-full"></div>
              </div>
              <div>
                <div className="bg-gray-600 h-6 w-3/4 mb-2 rounded"></div>
                <div className="bg-gray-600 h-4 w-full mb-1 rounded"></div>
                <div className="bg-gray-600 h-4 w-5/6 mb-1 rounded"></div>
                <div className="bg-gray-600 h-4 w-2/3 rounded"></div>
              </div>
            </div>
          ))}
        </section>
      )}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-0 py-5 sm:p-5 gap-x-10 gap-y-16">
        {articles?.length ? (
          articles.map((article: ArticleTY) => (
            <div key={article._id} className="space-y-4">
              <Link href={`/article/${article.slug}`} className="block">
                <Image
                  className="object-cover w-full h-[300px] rounded-2xl aspect-[16/9] align-middle"
                  src={article.banner.url}
                  width={300}
                  height={300}
                  alt={article.banner.alt}
                />
              </Link>
              <p className="flex justify-center items-center gap-5">
                <span className="text-secondary/75">
                  {new Date(article.createdAt).toLocaleDateString("us-en")}
                </span>
                <span className="capitalize text-secondary bg-[#1e293999] hover:bg-[#1e2939] py-1 px-4 rounded-2xl transition-all">
                  {article.tag}
                </span>
              </p>
              <Link href={`/article/${article.slug}`}>
                <h2 className="text-xl font-bold mt-2 mb-4">{article.title}</h2>
                <p className="line-clamp-3 text-secondary">
                  {article.description}
                </p>
              </Link>
            </div>
          ))
        ) : (
          <p className="p-10 text-center">لم يتم العثور على الوسم</p>
        )}
      </section>
    </div>
  );
};
export default Page;
