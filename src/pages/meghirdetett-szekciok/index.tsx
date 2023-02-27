import { queryActiveSections } from "@lib/queries";
import { getClient } from "@lib/sanity";
import GetImage from "@utils/getImage";
import type { GetServerSideProps } from "next";
import type { SanityImage } from "types";
import Image from "next/image";

type SanitySectionPart = {
  image?: SanityImage;
  name: string;
};

const MeghirdetettSzekciok = ({
  sections,
}: {
  sections: SanitySectionPart[];
}) => {
  return (
    <div className="flex min-h-[100vh] min-w-full flex-col space-y-10 bg-lightcherry p-4 pt-[100px] text-white">
      <div className="flex flex-wrap justify-evenly gap-4 md:gap-8">
        {sections.map((section) => {
          const imageSettings = section.image
            ? GetImage(section.image)
            : undefined;
          return (
            <div
              key={section.name}
              className="relative flex w-full flex-col items-center justify-center bg-lightGray p-2 md:w-[400px] md:p-4"
            >
              <span className="flex text-center text-2xl text-darkcherry md:text-3xl">
                {section.name}
              </span>
              {imageSettings && (
                <div className="relative h-[80vw] w-[80vw] md:h-72 md:w-72">
                  <Image
                    loader={imageSettings.loader}
                    src={imageSettings.src}
                    fill
                    alt={`${section.name} kep`}
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  preview = false,
}) => {
  const sections: SanitySectionPart[] = await getClient(preview).fetch(
    queryActiveSections
  );
  return {
    props: {
      sections: sections.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      ),
      preview,
    },
  };
};

export default MeghirdetettSzekciok;
