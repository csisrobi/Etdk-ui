import {
  AcademicCapIcon,
  BanknotesIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

const reasons = [
  {
    text: "Részvétel az OTDK-n",
  },
  {
    text: "Kapcsolati háló kiépítése",
  },
  {
    text: "Magyar szaknyelv elsajátítása",
  },
];

const reasons2 = [
  {
    title: "Tapasztalatszerzés",
    description:
      "Egy ETDK-dolgozat megírása közben szerzett tapasztalatok, élmények, bírálatok nagyon hasznosnak bizonyulnak az államvizsga-dolgozat megírásakor.",
    icon: <AcademicCapIcon className="relative z-10 h-40 w-40 " />,
  },
  {
    title: "Publikáció",
    description:
      "Az ETDK-n bemutatott dolgozatok szakmai publikációnak számítanak. (És nagyon jól mutatnak majd a szakmai önéletrajzodban!)",
    icon: <BookOpenIcon className="relative z-10 h-40  w-40 " />,
  },
  {
    title: "Pénzbeli jutalom",
    description:
      "Egy ETDK-díj elsősorban szakmai-erkölcsi siker, de részben anyagi siker is: a nyertes dolgozatok szerzői ugyanis pénzbeli díjakban részesülnek.",
    icon: <BanknotesIcon className="relative z-10 h-40 w-40" />,
  },
];

const WhyApplicate = () => {
  return (
    <div className="bg-lightGray lg:bg-white lg:pb-32">
      <div className="relative flex min-h-[calc(100vh-100px)] flex-col ">
        <div className="left-0 right-0 mx-auto flex min-h-[100%] w-[100vw] flex-col items-center lg:absolute lg:w-[1100px]">
          <div className="relative h-[25vh] w-[100vw] md:h-[50vh] lg:hidden">
            <Image src="/illusztracio1.png" alt="illusztracio" fill />
          </div>
          <div className="left-0 bottom-14 flex w-full flex-col space-y-14 bg-lightGray p-6 text-center lg:absolute lg:h-[600px] lg:w-[600px] lg:text-start">
            <div className="mt-2">
              <span className="text-7xl text-turquoise">
                Miért <br /> jelentkezz?
              </span>
            </div>
            <div>
              <p className="text-lg font-medium leading-tight text-darkBrown">
                Az ETDK-n való részvételnek
                <br /> több előnye is van, mint például:
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:pr-16">
              {reasons.map((reason) => (
                <div
                  key={reason.text}
                  className="flex items-center justify-center rounded-3xl bg-white p-2 text-center"
                >
                  <span className="flex justify-center text-sm font-semibold tracking-wide">
                    {reason.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="top-28 right-0 hidden h-[80%] w-[600px] flex-col lg:absolute lg:flex">
            <div className="hidden h-full w-full items-end justify-end pr-8 lg:flex">
              <div className="relative h-full w-[75%]">
                <Image src="/hullam2.png" alt="hullam" fill />
              </div>
            </div>
            <div className="relative h-5/6 w-full">
              <Image src="/illusztracio1.png" alt="illusztracio" fill />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center bg-lightGray lg:mt-24 lg:flex-row lg:justify-center lg:gap-8 lg:bg-white">
        {reasons2.map((reason) => (
          <div
            key={reason.title}
            className="px-auto relative flex w-full flex-col items-center gap-6 bg-lightGray p-8 lg:h-[450px] lg:w-80"
          >
            <div className="relative">
              <div>{reason.icon}</div>
              <div className="absolute top-2 right-0 left-0 mx-auto h-[145px] w-[145px] rounded-full bg-lightGreen"></div>
            </div>
            <span className="text-4xl font-semibold text-darkGreen">
              {reason.title}
            </span>
            <p className="text-center text-lg">{reason.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyApplicate;
