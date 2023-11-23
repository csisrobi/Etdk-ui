import { queryFiles } from "@lib/queries";
import { getClient } from "@lib/sanity";

type Props = {
  files: {
    certificateURL: string;
    contributionURL: string;
  };
};

const LetolthetoDokumentumok = ({ files }: Props) => {
  return (
    <div className="flex min-h-[100vh] min-w-full flex-col bg-lightGray px-6 pb-6 pt-[100px] text-black  md:px-10 md:pb-10 lg:bg-primaryLight ">
      <div className="flex flex-col items-center justify-center space-y-4 p-6 lg:bg-lightGray">
        {files.certificateURL && (
          <div className="w-fit rounded-lg bg-primaryLight px-4 py-2 text-white">
            <a target="_blank" href={files.certificateURL} rel="noreferrer">
              Témavezetői igazolás
            </a>
          </div>
        )}
        {files.contributionURL && (
          <div className="w-fit rounded-lg bg-primaryLight px-4 py-2 text-white">
            <a target="_blank" href={files.contributionURL} rel="noreferrer">
              Hozzájárulási nyilatkozat - a Biológia szekcióban résztvevőknek
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps({ preview = false }) {
  const files = await getClient(preview).fetch(queryFiles);
  return {
    props: {
      files: files[0],
      preview,
    },
  };
}

export default LetolthetoDokumentumok;
