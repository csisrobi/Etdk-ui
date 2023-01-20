import { queryDeadline } from "@lib/queries";
import { getClient } from "@lib/sanity";
import RichText from "@utils/RichText";
import type { SanityRichText } from "types";

type Props = {
  deadline: SanityRichText[];
};

const Hataridok = ({ deadline }: Props) => {
  return (
    <div className="flex min-h-[100vh] min-w-full flex-col bg-lightGray px-6 pb-6 pt-[100px] text-black  md:px-10 md:pb-10 lg:bg-lightcherry ">
      <div className="text-justified h-full w-full lg:bg-lightGray lg:p-6">
        <div className="prose max-w-none">
          <RichText blocks={deadline} />
        </div>
      </div>
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
