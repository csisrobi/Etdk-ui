import { newsDescription } from "@lib/queries";
import { getClient } from "@lib/sanity";
import RichText from "@utils/RichText";
import type { SanityRichText } from "types";

const Hirek = ({ description }: { description: SanityRichText[] }) => {
  return <RichText blocks={description} />;
};

export async function getServerSideProps({
  preview = false,
  params,
}: {
  preview: boolean;
  params: unknown;
}) {
  const newsData = await getClient(preview).fetch(newsDescription(params.slug));
  return {
    props: {
      description: newsData[0].description,
      preview,
    },
  };
}

export default Hirek;
