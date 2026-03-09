import Image from "next/image";
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
      className="object-cover w-full rounded-2xl aspect-video"
      src={image.url}
      width={600}
      height={400}
      alt={image.alt}
    />
  );
};
export default BlockImage;
