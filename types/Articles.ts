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
export type ArticlesResponse = {
  articles: ArticleTY[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    hasMore: boolean;
    totalPages: number;
  };
};
export interface PresentationalArticlesProps {
  isError: boolean;
  isLoading: boolean;
  articles: ArticleTY[];
  hasNextPage: boolean;
  inViewRef: (node?: Element | null | undefined) => void;
}
