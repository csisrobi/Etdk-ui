import { queryGeneralRules } from "@lib/queries";
import { getClient } from "@lib/sanity";
import RichText from "@utils/RichText";
import type { SanityGeneral } from "types";

type Props = {
  general: SanityGeneral;
};

const Szabalyzat = ({ general }: Props) => {
  return (
    <div className="flex min-h-[100vh] min-w-[100vw] flex-col bg-lightcherry p-4 pt-[100px] text-white">
      <RichText blocks={general.rules} />
    </div>
  );
};

export async function getStaticProps({ preview = false }) {
  const generals = await getClient(preview).fetch(queryGeneralRules);
  return {
    props: {
      general: generals[0],
      preview,
    },
    revalidate: 30,
  };
}

export default Szabalyzat;
