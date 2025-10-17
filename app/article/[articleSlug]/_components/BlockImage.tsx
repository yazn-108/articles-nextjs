import Image from "next/image";
import React from "react";
const BlockImage = ({
  image,
}: {
  image: {
    url: string;
    alt: string;
  };
}) => {
  return (
    <Image
      className="object-cover w-full rounded-2xl aspect-[16/9]"
      src={image.url}
      width={600}
      height={400}
      alt={image.alt}
    />
  );
};
export default BlockImage;
