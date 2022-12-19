import Image from "next/image";

type Props = {
  date: string;
  edition: string;
  romanEdition: string;
};

const MainPage = ({ date, edition, romanEdition }: Props) => {
  return (
    <div className="relative flex min-h-[100vh] min-w-[100vw] flex-col items-center justify-center bg-lightcherry p-4 pt-[100px] lg:pt-0">
      <div id="general" className="absolute -top-[70px]" />
      <div className="flex h-full w-full flex-col items-center lg:flex-row">
        <div className=" lg:mr-1/2 relative h-[100vw] w-[100vw] md:h-[600px] md:w-[600px] lg:-ml-32 lg:mr-4 lg:w-1/2 xl:mr-auto xl:-ml-4 xl:h-[500px] xl:w-[500px]">
          <div className="hidden lg:block">
            <Image
              src="/mainpagelogocrop.png"
              alt="fo oldal logo"
              fill
              loading="eager"
            />
          </div>
          <div className="block lg:hidden">
            <Image
              src="/mainpagelogo.png"
              alt="fo oldal logo"
              fill
              loading="eager"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-col justify-end space-y-2 tracking-wide sm:mt-10 lg:mr-auto lg:mt-24 xl:scale-110 2xl:scale-100 2xl:space-y-4">
          <div className="flex flex-col">
            <span className="text-lg text-white sm:text-3xl lg:text-3xl 2xl:text-4xl">
              kolozsvár // Cluj - napoca
            </span>
            <span className="text-xl text-white sm:text-4xl lg:text-4xl 2xl:text-5xl">
              {date || ""}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl text-white sm:text-7xl lg:text-7xl 2xl:text-8xl">
              <span className="text-yellow">{romanEdition}.</span> erdélyi
              Tudományos
            </span>
            <span className="text-4xl text-white sm:text-7xl lg:text-7xl 2xl:text-8xl">
              diákköri konferencia
            </span>
            <span className="text-3xl text-white sm:text-6xl lg:text-6xl 2xl:text-7xl">
              reál és humántudományok
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl text-white sm:text-4xl lg:text-4xl 2xl:text-5xl">
              {`Conferința științifică din transilvania, ediția ${
                edition.slice(0, 2) || ""
              }-a`}
            </span>
            <span className="text-xl text-white sm:text-4xl lg:text-4xl 2xl:text-5xl">
              {`${edition || ""} transilvanian students’ scientific conference`}
            </span>
            <span className="text-lg sm:text-3xl lg:text-3xl 2xl:text-4xl">
              <span className="text-yellow"> ȘTIINȚE REALE ȘI UMANE /</span>
              <span className="text-darkcherry">
                / FORMAL AND EMPIRICAL SCIENCES
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
