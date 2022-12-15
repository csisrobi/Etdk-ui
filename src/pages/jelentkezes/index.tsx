const Jelentkezes = () => {
  const adatok = [
    {
      title: "Személyes adatok",
      data: [
        "Név",
        "Egyetem",
        "Születési dátum",
        "Szak",
        "E-mail cím",
        "Kar",
        "Telefonszám",
        "Képzési szint",
        "Személyi szám",
        "Évfolyam",
      ],
      bg: "bg-application1",
    },
    {
      title: "Témavezető adatai",
      data: [
        "Név",
        "Egyetem",
        "E-mail cím",
        "Szak",
        "Telefonszám",
        "Kar",
        "Igazolás egyetem",
        "Titulus(doktor,adjunktus stb.)",
      ],
      bg: "bg-application2",
      text: "text-white",
    },
    {
      title: "Dolgozat",
      data: ["Cím", "Kivonat", "Szekció"],
      bg: "bg-application3",
    },
  ];
  return (
    <div className="flex min-h-[100vh] min-w-[100vw] flex-col items-center space-y-4 bg-white p-4 pt-[100px]">
      <div className="rounded-md bg-red p-2 ">
        <p className="text-2xl font-semibold tracking-wider text-white">
          MÁRCIUS 27-TŐL!
        </p>
      </div>
      <span className="text-5xl text-darkcherry">JELENTKEZÉS</span>
      {adatok.map((adat) => (
        <div
          className="h-fit w-full space-y-4 bg-lightGray p-6 md:w-[700px]"
          key={adat.title}
        >
          <p className="text-3xl text-darkcherry">{adat.title}:</p>
          <div className="grid grid-cols-1 gap-2 pl-2 md:grid-cols-2">
            {adat.data.map((element) => (
              <div
                key={element}
                className={`rounded-2xl p-2  text-lg font-semibold ${adat.bg} ${
                  adat.text ? adat.text : "text-darkcherry"
                }`}
              >
                {element}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Jelentkezes;
