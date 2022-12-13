import { queryArhivDetails } from "@lib/queries";
import { getClient } from "@lib/sanity";
import GetImage from "@utils/getImage";
import type { GetServerSideProps } from "next";
import type { SanityArchiv } from "types";
import Image from "next/image";
import Link from "next/link";

const Hirek = ({ archivData }: { archivData: SanityArchiv }) => {
  return (
    <div className="flex min-h-[100vh] min-w-[100vw] items-center justify-center bg-lightcherry p-4 pt-[100px] text-white">
      <Link href={archivData.book} target="_blank">
        <Image
          {...GetImage(archivData.book_image)}
          height={500}
          width={500}
          alt={archivData.book}
          className="object-cover"
        />
      </Link>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  preview = false,
  params,
}) => {
  const archivData = await getClient(preview).fetch(
    queryArhivDetails(params?.slug as string)
  );
  return {
    props: {
      archivData: archivData[0],
      preview,
    },
  };
};

export default Hirek;
