import { queryNewsDescription } from "@lib/queries";
import { getClient } from "@lib/sanity";
import RichText from "@utils/RichText";
import type { GetServerSideProps } from "next";
import type { SanityRichText } from "types";

const Hirek = ({ description }: { description: SanityRichText[] }) => {
  return (
    <div className="flex min-h-[100vh] min-w-[100vw] flex-col bg-lightGray px-6 pb-6 pt-[100px] text-black  md:px-10 md:pb-10 lg:bg-lightcherry">
      <div className="h-full w-full lg:bg-lightGray lg:p-6">
        <RichText blocks={description} />
      </div>
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
