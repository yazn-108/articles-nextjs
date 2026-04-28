export type ImageType = {
  url: string;
  public_id: string;
  alt: string;
};
type CodeBlock = {
  language?: string;
  content?: string;
};
export type ArticleBlock = {
  id: string;
  title?: string | null;
  content?: string | null;
  code?: CodeBlock | null;
  image?: ImageType | null;
};
export type ArticleTY = {
  _id?: string;
  SubscribersNotified: boolean;
  slug: string;
  title: string;
  banner: ImageType;
  tag: string;
  createdAt: Date;
  description: string;
  blocks?: ArticleBlock[];
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
