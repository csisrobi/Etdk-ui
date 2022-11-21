import client from "@lib/sanity";
import type { UseNextSanityImageProps } from "next-sanity-image";
import { useNextSanityImage } from "next-sanity-image";
import type { SanityImage } from "types";

export default function GetImage(
  image: SanityImage
): UseNextSanityImageProps | null {
  const imageProps = useNextSanityImage(client, image);
  if (!image || !image.asset) {
    return null;
  }
  return imageProps;
}
