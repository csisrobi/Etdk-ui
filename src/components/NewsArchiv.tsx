import Image from "next/image";

const archiv = [{ text: "2019" }, { text: "2021" }, { text: "2022" }];
const news = [
  {
    date: "2023.02.01",
    text: "hogyan írj és hogyan mutass be kutatást? // előadással készülnek a kmdsz szakosztályok az ETDK-ra",
  },
  {
    date: "2023.02.01",
    text: "Elkezdődött a regisztráció!",
  },
  {
    date: "2023.02.01",
    text: "Megnyitó és plenáris előadás // 25. Erdélyi Tudományos Diákköri Konferencia",
  },
];
const NewsArchiv = () => {
  return (
    <div className="relative flex min-h-[100vh] flex-col justify-center gap-24 bg-gray py-8 lg:pb-24">
      <div id="news">
        <div className="flex flex-col items-center justify-center gap-8">
          <div>
            <span className="text-7xl text-turquoise">Hírek</span>
          </div>
          <div className="flex flex-col flex-wrap items-center justify-evenly gap-10 sm:flex-row">
            {news.map((newElem) => (
              <div
                key={newElem.text}
                className="flex h-72 w-72 flex-col items-center gap-8 bg-white p-8"
              >
                <div className="w-36 rounded-2xl bg-lightBrown text-center text-3xl tracking-wide text-yellow">
                  <span>{newElem.date}</span>
                </div>
                <span className="text-2xl">{newElem.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        id="archiv"
        className="flex flex-col items-center justify-center gap-8"
      >
        <div>
          <span className="text-7xl text-turquoise">Archívum</span>
        </div>
        <div className="flex flex-col gap-12 md:flex-row">
          {archiv.map((archivEl) => (
            <button
              key={archivEl.text}
              type="button"
              className="relative h-11 w-40 rounded-3xl bg-lightBrown py-2 px-2 text-center text-3xl tracking-wide text-yellow"
              disabled
            >
              <span className="absolute -top-3 right-0 left-0 mx-auto text-7xl">
                {archivEl.text}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="absolute top-0 right-0 hidden h-28 w-96 lg:block">
        <Image src="/hullam1.png" alt="hullam" fill />
      </div>
      <div className="absolute bottom-0 left-0 hidden h-28 w-96 lg:block">
        <Image src="/hullam1.png" alt="hullam" fill />
      </div>
    </div>
  );
};

export default NewsArchiv;
