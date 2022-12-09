import { newsDescription } from "@lib/queries";
import { getClient } from "@lib/sanity";
import RichText from "@utils/RichText";
import type { GetServerSideProps } from "next";
import type { SanityRichText } from "types";

const Hirek = ({ description }: { description: SanityRichText[] }) => {
  return <RichText blocks={description} />;
};

export const getServerSideProps: GetServerSideProps = async ({
  preview = false,
  params,
}) => {
  const newsData = await getClient(preview).fetch(
    newsDescription(params?.slug as string)
  );
  return {
    props: {
      description: newsData[0].description,
      preview,
    },
  };
};

export default Hirek;
