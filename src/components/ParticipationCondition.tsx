import Image from "next/image";
import Link from "next/link";

const ParticipationCondition = ({
  certificateURL,
}: {
  certificateURL: string;
}) => {
  const conditions = [
    { text: "Szabályzat", link: "/szabalyzat" },
    { text: "Követelmények" },
    { text: "Pontozási kritériumok" },
    { text: "Témavezetői igazolás", link: certificateURL, target: "_blank" },
  ];

  return (
    <div
      id="participation_condition"
      className="relative flex min-h-[calc(100vh-100px)] flex-col bg-gray px-8 pt-14"
    >
      <div className="flex w-full justify-center">
        <span className="text-center text-3xl text-white sm:text-6xl lg:text-8xl">
          Általános részvételi feltételek
        </span>
      </div>
      <div className="mt-8 flex min-h-[70vh] flex-col sm:flex-row">
        <div className="flex min-h-full justify-end sm:w-3/5">
          <p className="pr-4 text-justify text-lg text-white lg:w-3/4">
            Minden romániai felsőoktatási intézmény (alapképzésben vagy
            mesterképzésben részt vevő) hallgatójának joga van az ETDK bármely
            szekciójában dolgozatot bemutatni, ha a jelentkezési feltételeket
            teljesíti.
            <br /> A külföldi felsőoktatási intézmények hallgatói versenyen
            kívül mutathatják be tudományos munkájukat, a többi résztvevővel
            azonos feltételek mellett.
            <br /> A kivonat és a dolgozat szövege magyar nyelvű. Az ETDK
            szekcióinak munkálatai (beleértve a dolgozatok előadását) szintén
            magyar nyelven folynak. <br />
            Kivételt képez az Állam és Jogtudomány szekció, ahol a dolgozat
            szövege lehet román nyelvű, de bemutatása kizárólag magyar nyelven
            kell, hogy megtörténjen.
          </p>
        </div>
        <div className="mt-8 flex flex-col sm:mt-0 sm:w-2/5">
          <div className="flex w-full flex-col items-center gap-4">
            {conditions.map((condition) => (
              <Link
                key={condition.text}
                href={condition.link || "#"}
                target={condition.target}
              >
                <button
                  type="button"
                  className="min-w-max rounded-2xl bg-white py-2 px-2 text-center text-3xl tracking-wide text-turquoise hover:cursor-pointer"
                  disabled
                >
                  <span>{condition.text}</span>
                </button>
              </Link>
            ))}
          </div>
          <div className="relative mt-10 h-[60vw] w-[82vw] sm:h-[25vw] sm:w-[40vw] lg:h-[35vh] lg:w-[50vh]">
            <Image src="/illusztracio2.png" alt="illusztracio" fill />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipationCondition;
