import { queryArhivDetails } from "@lib/queries";
import { getClient } from "@lib/sanity";
import GetImage from "@utils/getImage";
import type { GetServerSideProps } from "next";
import type { SanityArchiv } from "types";
import Image from "next/image";
import Link from "next/link";

const Hirek = ({ archivData }: { archivData: SanityArchiv }) => {
  return (
    <div className="flex min-h-[100vh] min-w-[100vw] flex-col space-y-10 bg-lightcherry p-4 pt-[100px] text-white">
      <div className="flex flex-col items-center justify-center space-y-5">
        <span className="text-center text-6xl">Kivonatos füzet</span>
        <Link href={archivData.book} target="_blank">
          <Image
            {...GetImage(archivData.book_image)}
            height={500}
            width={500}
            alt={archivData.book}
            className="object-cover"
          />
        </Link>
      </div>
      <div className="flex flex-col space-y-5">
        <span className="text-center text-6xl">Díjazottak</span>
        <div className="flex flex-wrap justify-evenly gap-4 md:gap-8">
          {archivData.winners.map((winner) => (
            <div
              key={winner.section.name}
              className="h-fit w-full bg-lightGray p-2 md:w-[500px] md:p-4"
            >
              <table className="border-separate border-spacing-x-3 border-spacing-y-2 md:border-spacing-x-5 md:border-spacing-y-4">
                <thead>
                  <tr>
                    <th className="w-2/3">
                      <span className="flex text-left text-2xl text-darkcherry md:text-3xl">
                        {winner.section.name}
                      </span>
                    </th>
                    <th>
                      <span className=" flex text-left text-lg text-darkcherry md:text-xl">
                        ELÉRT PONTSZÁM:
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {winner.winnerPersons.map((winnerPerson) => (
                    <tr key={winnerPerson.name}>
                      <td>
                        <span
                          key={winnerPerson.name}
                          className="whitespace-pre-wrap text-lg text-gray md:text-xl"
                        >
                          {winnerPerson.name.split(",").join(",\n")}
                        </span>
                      </td>
                      <td>
                        <span
                          key={winnerPerson.name}
                          className="text-lg text-gray md:text-xl"
                        >
                          {winnerPerson.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  preview = false,
  params,
}) => {
  const archivData = await getClient(preview).fetch(
    queryArhivDetails(params?.slug as string)
  );
  return {
    props: {
      archivData: archivData[0],
      preview,
    },
  };
};

export default Hirek;