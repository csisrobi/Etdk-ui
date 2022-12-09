import Image from "next/image";
import type { SanityApplicate } from "types";
import RichText from "@utils/RichText";
import GetImage from "./../../utils/getImage";

const WhyApplicate = ({
  small_benefit,
  big_benefit,
  title,
  description,
}: SanityApplicate) => {
  return (
    <div className=" bg-lightGray lg:bg-white lg:pb-32">
      <div className="relative flex min-h-[calc(100vh-100px)] flex-col lg:flex-row lg:items-center lg:justify-center">
        <div className="flex h-[800px] w-[100vw] flex-col items-center lg:relative lg:w-[1100px]">
          <div className="relative h-[25vh] w-[100vw] md:h-[50vh] lg:hidden">
            <Image src="/illusztracio1.png" alt="illusztracio" fill />
          </div>
          <div className="left-0 bottom-14 flex w-full flex-col space-y-14 bg-lightGray p-6 text-center lg:absolute lg:h-[600px] lg:w-[600px] lg:text-start">
            <div className="mt-2">
              {/* //FIX IF ZOOMED SMALLER HEIGHT */}
              <span className="text-7xl text-darkcherry">{title}</span>
            </div>
            <div>
              <div className="text-lg font-medium leading-tight text-darkBrown">
                <RichText blocks={description} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:pr-16">
              {small_benefit.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center justify-center rounded-3xl bg-white p-2 text-center"
                >
                  <span className="flex justify-center text-sm font-semibold tracking-wide">
                    {benefit}
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
        {big_benefit.map((benefit) => (
          <div
            key={benefit.title}
            className="px-auto relative flex w-full flex-col items-center gap-6 bg-lightGray p-8 lg:h-[450px] lg:w-80"
          >
            <div className="relative">
              <Image
                {...GetImage(benefit.icon)}
                height={140}
                width={140}
                alt={benefit.title}
              />
            </div>
            <span className="text-4xl font-semibold text-darkcherry">
              {benefit.title}
            </span>
            <p className="text-center text-lg">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyApplicate;
