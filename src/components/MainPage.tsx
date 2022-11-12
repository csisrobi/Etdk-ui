import Image from "next/image";

const MainPage = () => {
  return (
    <div className="container flex min-h-[100vh] min-w-[100vw] flex-col items-center justify-center bg-gray p-4 pt-[80px] lg:pt-0">
      <div className="flex h-full w-full flex-col items-center lg:flex-row">
        <div className="sm:-px-24 sm:h-[60vh] sm:w-[80vw] xl:h-[500px] xl:w-[500px] relative h-[45vh] w-[100vw] lg:-ml-4 lg:mr-auto lg:w-2/5">
          <div className="hidden lg:block">
            <Image src="/mainpagelogocrop.png" alt="fo oldal logo" fill />
          </div>
          <div className="block lg:hidden">
            <Image src="/mainpagelogo.png" alt="fo oldal logo" fill />
          </div>
        </div>
        <div className="sm:mt-10 xl:scale-110 2xl:scale-100 2xl:space-y-4 mt-4 flex flex-col justify-end space-y-2 tracking-wide lg:mr-auto lg:mt-24">
          <div className="flex flex-col">
            <span className="sm:text-3xl 2xl:text-4xl text-lg text-turquoise lg:text-3xl">
              kolozsvár // Cluj - napoca
            </span>
            <span className="sm:text-4xl 2xl:text-5xl text-xl text-turquoise lg:text-4xl">
              2022. május 23-26.
            </span>
          </div>
          <div className="flex flex-col">
            <span className="sm:text-7xl 2xl:text-8xl text-4xl text-white lg:text-7xl">
              <span className="text-yellow">XXVI.</span> erdélyi Tudományos
            </span>
            <span className="sm:text-7xl 2xl:text-8xl text-4xl text-white lg:text-7xl">
              diákköri konferencia
            </span>
            <span className="sm:text-6xl 2xl:text-7xl text-3xl text-white lg:text-6xl">
              reál és humántudományok
            </span>
          </div>
          <div className="flex flex-col">
            <span className="sm:text-4xl 2xl:text-5xl text-xl text-white lg:text-4xl">
              Conferința științifică din transilvania, ediția 26-a
            </span>
            <span className="sm:text-4xl 2xl:text-5xl text-xl text-white lg:text-4xl">
              26th transilvanian students’ scientific conference
            </span>
            <span className="sm:text-3xl 2xl:text-4xl text-lg lg:text-3xl">
              <span className="text-yellow"> ȘTIINȚE REALE ȘI UMANE /</span>
              <span className="text-turquoise">
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
