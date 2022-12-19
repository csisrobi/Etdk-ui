import Image from "next/image";
import type { SanityArchiv, SanityNews } from "types";
import dayjs from "dayjs";
import LinkWrapper from "./UtilityComponents/LinkWrapper";
import Link from "next/link";

const NewsArchiv = ({
  news,
  archivs,
}: {
  news: SanityNews[];
  archivs: SanityArchiv[];
}) => {
  return (
    <div className="relative flex min-h-[100vh] flex-col justify-center gap-24 bg-gray py-8 lg:pb-24">
      <div>
        <div id="hirek" className="absolute -top-[70px]" />
        <div className="flex flex-col items-center justify-center gap-8">
          <div>
            <span className="text-7xl text-darkcherry">Hírek</span>
          </div>
          <div className="flex flex-col flex-wrap items-center justify-evenly gap-10 sm:flex-row">
            {news.map(
              (newElem) =>
                !dayjs(newElem.date).isAfter(dayjs()) && (
                  <LinkWrapper
                    href={
                      !!newElem.description ? `/hirek/${newElem.name}` : "#"
                    }
                    key={newElem.name}
                  >
                    <div className="flex h-72 w-72 cursor-pointer flex-col items-center gap-8 bg-white p-8">
                      <div className="w-36 rounded-2xl bg-lightBrown text-center text-3xl tracking-wide text-yellow">
                        <span>{newElem.date}</span>
                      </div>
                      <span className="text-2xl text-lightcherry">
                        {newElem.summary}
                      </span>
                    </div>
                  </LinkWrapper>
                )
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-8">
        <div id="archivum" className="absolute -top-[70px]" />
        <div>
          <span className="text-7xl text-darkcherry">Archívum</span>
        </div>
        <div className="flex flex-col gap-12 md:flex-row">
          {archivs.map((archivEl) => (
            <Link key={archivEl.year} href={`archivum/${archivEl.year}`}>
              <button
                type="button"
                className="relative h-11 w-40 cursor-pointer rounded-3xl bg-lightBrown py-2 px-2 text-center text-3xl tracking-wide text-yellow"
                disabled
              >
                <span className="absolute -top-3 right-0 left-0 mx-auto text-7xl">
                  {archivEl.year}
                </span>
              </button>
            </Link>
          ))}
        </div>
      </div>
      <div className="absolute top-0 right-0 hidden h-28 w-96 lg:block">
        <Image src="/hullam1.png" alt="hullam" fill />
      </div>
      <div className="absolute bottom-0 left-0 hidden h-28 w-96 lg:block">
        <Image src="/hullam1.png" alt="hullam" fill />
      </div>
    </div>
  );
};

export default NewsArchiv;
