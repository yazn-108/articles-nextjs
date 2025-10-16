type HomePageArticleTY = {
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
export type HomePageArticlesResponse = {
  articles: HomePageArticleTY[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    hasMore: boolean;
    totalPages: number;
  };
};
export interface PresentationalHomePageArticlesProps {
  isError: boolean;
  isLoading: boolean;
  articles: HomePageArticleTY[];
  hasNextPage: boolean;
  inViewRef: (node?: Element | null | undefined) => void;
}
