"use client";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import PresentationalArticles from "./PresentationalArticles";
export type ArticleTY = {
  _id: string;
  slug: string;
  title: string;
  banner: {
    url: string;
    alt: string;
  };
  tag: string;
  createdAt: Date;
  description: string;
};
type ArticlesResponse = {
  articles: ArticleTY[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    hasMore: boolean;
    totalPages: number;
  };
};
export default function Articles() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["articles"],
    queryFn: ({ pageParam = 1 }) =>
      axios
        .get(`/api/articles?page=${pageParam}&limit=6`)
        .then((res) => res.data as ArticlesResponse),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
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
      .filter(
        (article, index, self) =>
          index === self.findIndex((a) => a._id === article._id)
      ) || [];
  return (
    <PresentationalArticles
      isLoading={isLoading}
      isError={isError}
      articles={articles}
      hasNextPage={hasNextPage}
      inViewRef={ref}
    />
  );
}
