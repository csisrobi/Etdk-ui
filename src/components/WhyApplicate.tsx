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

const WhyApplicate = () => {
  return (
    <div className="relative h-[calc(100vh-100px)] bg-white">
      <div className="left-0 right-0 mx-auto flex min-h-[100%] w-[100vw] flex-col items-center lg:absolute lg:w-[1100px]">
        <div className="relative h-[25vh] w-[100vw] md:h-[50vh] lg:hidden">
          <Image src="/illusztracio1.png" alt="illusztracio" fill />
        </div>
        <div className="left-0 bottom-14 flex h-[600px] w-full flex-col space-y-20 bg-lightGray p-6 lg:absolute lg:w-[600px]">
          <div className="mt-2">
            <span className="text-7xl text-turquoise">
              Miért <br /> jelentkezz?
            </span>
          </div>
          <div>
            <p className="text-lg font-medium leading-tight">
              Az ETDK-n való részvételnek
              <br /> több előnye is van, mint például:
            </p>
          </div>
          {/* //TODO: GRID IF MORE ITEM */}
          <div className="flex space-x-6 lg:pr-16">
            {reasons.map((reason) => (
              <div key={reason.text} className="rounded-3xl bg-white p-2">
                <span className="text-sm font-semibold tracking-wide">
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
      <div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default WhyApplicate;
