import Image from "next/image";
import React from "react";
const ArticleImage = ({
  banner,
}: {
  banner: {
    url: string;
    alt: string;
  };
}) => {
  return (
    <Image
      className="object-cover w-full md:w-[400px] h-[300px] rounded-2xl"
      src={banner.url}
      width={400}
      height={300}
      alt={banner.alt}
    />
  );
};
export default ArticleImage;
