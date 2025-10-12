import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ArticleTY } from "./Articles";
interface PresentationalArticlesProps {
  isError: boolean;
  isLoading: boolean;
  articles: ArticleTY[];
  hasNextPage: boolean;
  inViewRef: (node?: Element | null | undefined) => void;
}
const PresentationalArticles: React.FC<PresentationalArticlesProps> = ({
  isError,
  isLoading,
  articles,
  hasNextPage,
  inViewRef,
}) => {
  return (
    <div className="p-5 space-y-4">
      <h1 className="text-3xl md:text-4xl text-center font-bold">مُركَّز</h1>
      <p className="text-center text-xl md:text-2xl text-secondary max-w-4xl m-auto">
        مُركَّز منصة اجمع فيها مقالاتي التي تكون عبارة عن ملخص لمعلومة برمجية
        بدون كثرة مقدمات او تمطيط للكلام....
      </p>
      {isLoading && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-0 py-5 sm:p-5 gap-x-10 gap-y-16">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className={`space-y-4 animate-pulse ${
                index > 2
                  ? "hidden lg:block"
                  : index > 0
                  ? "hidden md:block"
                  : ""
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
      {isError && (
        <div className="p-5 space-y-4">
          <div className="min-h-[50dvh] flex justify-center items-center">
            <h2 className="text-xl text-destructive">
              حدث خطأ في تحميل المقالات
            </h2>
          </div>
        </div>
      )}
      {articles.length === 0 && !isLoading && (
        <section className="min-h-[50dvh] flex justify-center items-center">
          <h2 className="text-xl">لا يوجد مقالات بعد...</h2>
        </section>
      )}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-0 py-5 sm:p-5 gap-x-10 gap-y-16">
        {articles.map((article: ArticleTY, i: number) => (
          <div key={article._id} className="space-y-4">
            <Link href={`/article/${article.slug}`} className="block">
              <Image
                className="object-cover w-full h-[300px] rounded-2xl aspect-[16/9] align-middle"
                src={article.banner.url}
                width={300}
                height={300}
                alt={article.banner.alt}
                loading={i === 0 || i === 1 || i === 2 ? "eager" : "lazy"}
                priority={i === 0 || i === 1 || i === 2 ? true : false}
                // blurDataURL="/default-og-image.jpg"
                // placeholder="blur"
              />
            </Link>
            <p className="flex justify-center items-center gap-5">
              <span className="text-secondary/75">
                {new Date(article.createdAt).toLocaleDateString("en-GB")}
              </span>
              <Link
                href={`/tags/${article.tag}`}
                className="capitalize truncate max-w-32 text-secondary bg-[#1e293999] hover:bg-[#1e2939] py-1 px-4 rounded-2xl transition-all"
              >
                {article.tag}
              </Link>
            </p>
            <Link href={`/article/${article.slug}`}>
              <h2 className="text-xl font-bold mt-2 mb-4 truncate max-w-full">
                {article.title}
              </h2>
              <p className="line-clamp-3 text-secondary max-w-full">
                {article.description}
              </p>
            </Link>
          </div>
        ))}
      </section>
      {hasNextPage && (
        <div ref={inViewRef} className="w-full h-40">
          {/* {isFetchingNextPage ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-secondary">جاري تحميل المزيد...</span>
            </div>
          ) : (
            <div className="text-secondary">اسحب لأسفل لتحميل المزيد</div>
          )} */}
        </div>
      )}
    </div>
  );
};
export default PresentationalArticles;
