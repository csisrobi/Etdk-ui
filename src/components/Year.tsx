import Image from "next/image";

const yearElements = [
  { text: "Határidők" },
  { text: "Zsűrik" },
  { text: "Program" },
  { text: "Díjazottak" },
  { text: "Előadások és workshopok" },
];

const Year = () => {
  return (
    <div className="relative -z-20 flex min-h-[70vh] flex-col items-center gap-10 bg-lightGray py-10 md:justify-center md:pt-0 lg:bg-white">
      <div>
        <span className="text-7xl text-turquoise">2023</span>
      </div>
      <div className="flex flex-col flex-wrap items-center justify-evenly gap-8 sm:flex-row md:w-3/4">
        {yearElements.map((element) => (
          <div
            key={element.text}
            className="w-80 rounded-3xl bg-beige py-2 px-2 text-center text-3xl tracking-wide text-black"
          >
            <span>{element.text}</span>
          </div>
        ))}
      </div>
      <div className="absolute right-0 top-10 -z-10 hidden h-[300px] w-[400px] md:block">
        <Image src="/zoldhullamjobb.png" alt="zoldhullam" fill />
      </div>
      <div className="absolute left-0 bottom-10 -z-10 hidden h-[300px] w-[400px] md:block">
        <Image src="/zoldhullambal.png" alt="zoldhullam" fill />
      </div>
    </div>
  );
};

export default Year;
