import { queryNewsDescription } from "@lib/queries";
import { getClient } from "@lib/sanity";
import RichText from "@utils/RichText";
import type { GetServerSideProps } from "next";
import type { SanityRichText } from "types";

const Hirek = ({ description }: { description: SanityRichText[] }) => {
  return (
    <div className="flex min-h-[100vh] min-w-[100vw] flex-col bg-lightcherry p-4 pt-[100px] text-white">
      <RichText blocks={description} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  preview = false,
  params,
}) => {
  const newsData = await getClient(preview).fetch(
    queryNewsDescription(params?.slug as string)
  );
  return {
    props: {
      description: newsData[0].description,
      preview,
    },
  };
};

export default Hirek;
