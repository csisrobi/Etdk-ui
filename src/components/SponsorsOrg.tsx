import Image from "next/image";
import React from "react";

const sponsors = [
  {
    image: (
      <div className="relative h-[120px] w-[190px]">
        <Image
          src="/ITM.png"
          alt="Innovációs és Technológiai Minisztérium"
          fill
        />
      </div>
    ),
  },
  {
    image: (
      <div className="relative h-[120px] w-[120px]">
        <Image src="/BGA.png" alt="Bethlen Gábor Alap" fill />
      </div>
    ),
  },
  {
    image: (
      <div className="relative h-[120px] w-[216px]">
        <Image src="/RMDSZ.png" alt="RMDSZ" fill />
      </div>
    ),
  },
];

const organisers = [
  {
    image: (
      <div className="relative h-[120px] w-[128px]">
        <Image src="/KMDSZ.png" alt="KMDSZ" fill />
      </div>
    ),
  },
  {
    image: (
      <div className="relative h-[120px] w-[316px]">
        <Image src="/BBTE.png" alt="BBTE" fill />
      </div>
    ),
  },
  {
    image: (
      <div className="relative h-[120px] w-[86px]">
        <Image src="/KMEI.png" alt="KMEI" fill />
      </div>
    ),
  },
  {
    image: (
      <div className="relative h-[120px] w-[278px]">
        <Image src="/OMDSZ.png" alt="OMDSZ" fill />
      </div>
    ),
  },
];

const SponsorsOrg = () => {
  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center gap-12 bg-lightGray py-8 lg:bg-white">
      <div className="w-full">
        <div className="flex w-full flex-col items-center justify-center gap-8">
          <div>
            <span className="text-7xl text-darkGreen">Támogatók</span>
          </div>
          <div className="flex w-full flex-col items-center justify-evenly gap-24 sm:flex-row">
            {sponsors.map((sponsor, index) => (
              <React.Fragment key={index}>{sponsor.image}</React.Fragment>
            ))}
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-8">
        <div>
          <span className="text-7xl text-darkGreen">Szervezők</span>
        </div>
        <div className="flex w-full flex-col flex-wrap items-center justify-evenly gap-24 sm:flex-row">
          {organisers.map((organiser, index) => (
            <React.Fragment key={index}>{organiser.image}</React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorsOrg;
