import { queryDeadline } from "@lib/queries";
import { getClient } from "@lib/sanity";
import RichText from "@utils/RichText";
import type { SanityRichText } from "types";

type Props = {
  deadline: SanityRichText[];
};

const Hataridok = ({ deadline }: Props) => {
  return (
    <div className="flex min-h-[100vh] min-w-[100vw] flex-col bg-lightcherry p-4 pt-[100px] text-white">
      <RichText blocks={deadline} />
    </div>
  );
};

export async function getStaticProps({ preview = false }) {
  const deadline = await getClient(preview).fetch(queryDeadline);
  return {
    props: {
      deadline: deadline[0].deadline,
      preview,
    },
    revalidate: 30,
  };
}

export default Hataridok;
