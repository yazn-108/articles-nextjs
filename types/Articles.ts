import { ImageType } from "./ArticleDetails";
export type ArticleTY = {
  _id?: string;
  SubscribersNotified: false,
  slug: string;
  title: string;
  banner: ImageType;
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
  admin?: boolean;
  inViewRef: (node?: Element | null | undefined) => void;
}
