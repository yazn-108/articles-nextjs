"use client";
import { ArticlesResponse } from "@/types/Articles";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import PresentationalArticles from "./PresentationalArticles";
export default function Articles({
  initialArticles,
  tag,
  admin,
}: {
  initialArticles?: ArticlesResponse;
  tag?: string;
  admin?: boolean;
}) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["articles", tag],
    queryFn: ({ pageParam = 1 }) =>
      axios
        .get(
          !admin
            ? !tag
              ? `/api/articles?page=${pageParam}&limit=6`
              : `/api/tags/${tag}?page=${pageParam}&limit=6`
            : `/api/admin/articles?page=${pageParam}&limit=6`,
        )
        .then((res) => res.data as ArticlesResponse),
    getNextPageParam: (lastPage) =>
      lastPage.pagination?.hasMore ? lastPage.pagination.page + 1 : undefined,
    initialData: initialArticles && {
      pages: [initialArticles] as ArticlesResponse[],
      pageParams: [1],
    },
    initialPageParam: 1,
  });
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "1000px",
  });
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
  const articles =
    data?.pages
      .flatMap((page) => page.articles)
      .filter((article) => article?._id && article?.slug)
      .filter(
        (article, index, self) =>
          index === self.findIndex((a) => a?._id === article?._id),
      ) || [];
  return (
    <PresentationalArticles
      isLoading={isLoading}
      isError={isError}
      articles={articles}
      hasNextPage={hasNextPage}
      inViewRef={ref}
      admin={admin}
    />
  );
}
