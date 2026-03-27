import Image from "next/image";
const ArticleImage = ({
  banner,
  i,
}: {
  banner: { url: string; alt: string };
  i: number;
}) => {
  return (
    <Image
      className="object-cover w-full h-75 rounded-2xl align-middle"
      src={banner.url}
      width={300}
      height={300}
      alt={banner.alt}
      loading={i === 0 || i === 1 || i === 2 ? "eager" : "lazy"}
      priority={i === 0 || i === 1 || i === 2 ? true : false}
    />
  );
};
export default ArticleImage;
