import Image from "next/image";
import LinkWrapper from "./UtilityComponents/LinkWrapper";

const yearElements = [
  { text: "Határidők", link: "/hataridok" },
  { text: "Zsűrik", link: "/zsurik" },
  { text: "Program", link: "/program" },
  { text: "Díjazottak", link: "/dijazottak" },
  { text: "Előadások és workshopok" },
  { text: "Meghirdetett szekciók", link: "/meghirdetett-szekciok" },
  { text: "Befizetés", link: "https://jegy.link/etdk" },
];

const Year = () => {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center gap-10 bg-lightGray py-10 md:justify-center md:pt-0 lg:bg-white">
      <div id="aktualis_ev" className="absolute -top-[70px]" />
      <div>
        <span className="text-7xl text-primaryDark">
          {new Date().getFullYear()}
        </span>
      </div>
      <div className="relative z-10 flex flex-col flex-wrap items-center justify-evenly gap-8 sm:flex-row md:w-3/4">
        {yearElements.map((element) => (
          <LinkWrapper key={element.text} href={element.link || "#"}>
            <div className="w-80 cursor-pointer rounded-3xl bg-beige p-2 text-center text-3xl tracking-wide text-primaryDark">
              <span>{element.text}</span>
            </div>
          </LinkWrapper>
        ))}
      </div>
      <div className="absolute right-0 top-10 hidden h-[300px] w-[400px] md:block">
        <Image src="/zoldhullamjobb.png" alt="zoldhullam" fill />
      </div>
      <div className="absolute left-0 bottom-10 hidden h-[300px] w-[400px] md:block">
        <Image src="/zoldhullambal.png" alt="zoldhullam" fill />
      </div>
    </div>
  );
};

export default Year;
