export type ImageType = {
  url: string;
  public_id: string;
  alt: string;
};
type CodeBlock = {
  language?: string;
  content?: string;
};
type Block = {
  id: string;
  title: string | null;
  content?: string | null;
  code?: CodeBlock | null;
  image?: ImageType | null;
  link: {
    url: string;
    title: string;
  };
};
export type ArticleDetailsResponse = {
  title: string;
  slug: string;
  tag: string;
  description: string;
  createdAt: Date;
  SubscribersNotified?: boolean;
  banner: ImageType;
  blocks?: Block[];
};