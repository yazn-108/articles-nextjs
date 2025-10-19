"use client";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import PresentationalArticles from "./PresentationalArticles";
import { HomePageArticlesResponse } from "@/types/Articles";
export default function Articles({
  initialArticles,
  tag,
}: {
  initialArticles: HomePageArticlesResponse;
  tag: string;
}) {
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
        .get(`/api/tags/${tag}?page=${pageParam}&limit=6`)
        .then((res) => res.data as HomePageArticlesResponse),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
    initialData: {
      pages: [initialArticles!],
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
