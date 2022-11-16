import Image from "next/image";

const Communication = () => {
  return (
    <div className="flex min-h-[calc(70vh-100px)] flex-col items-center gap-12 bg-lightGray px-2 py-10 md:flex-row md:items-start md:p-8 lg:gap-48 lg:bg-white">
      <div className="hidden w-full flex-col items-end md:flex md:w-1/2">
        <div className="justify-center md:justify-start">
          <div className="flex justify-center md:justify-start">
            <Image src="/ETDK.png" width={150} height={150} alt="ETDK" />
          </div>
          <div className="flex text-center md:text-start">
            <span className="w-full  text-2xl tracking-wide ">
              XXV. REÁL ÉS HUMÁNTUDOMÁNYI ETDK
              <br />
              KOLOZSVÁR • 2022. MÁJUS 19–22
            </span>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center text-center md:w-1/2 md:text-start">
        <div>
          <span className="text-6xl text-turquoise">KAPCSOLAT</span>
          <div className="flex flex-col gap-6">
            <p className="text-lg">
              KOLOZSVÁRI MAGYAR DIÁKSZÖVETSÉG – KMDSZ (Uniunea Studențească
              Maghiară din Cluj)
            </p>
            <p className="text-lg">
              Cím : KMDSZ iroda ( str. Avram Iancu/Petőfi Sándor utca 4. szám)
            </p>
            <p className="text-lg">Telefonszám : +40 755 116 251</p>
            <p className="text-lg"> Email : office@kmdsz.ro</p>
            <div className="flex justify-center gap-2 md:justify-start">
              <a href="https://www.facebook.com/KMDSZ" target="_blank" rel="noreferrer">
                <Image
                  src="/facebook.png"
                  height={50}
                  width={50}
                  alt="facebook"
                />
              </a>
              <a href="https://www.instagram.com/kmdszofficial/" target="_blank" rel="noreferrer">
                <Image
                  src="/instagram.png"
                  height={50}
                  width={50}
                  alt="instagram"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col md:hidden md:w-1/2">
        <div className="justify-center md:justify-start">
          <div className="flex justify-center md:justify-start">
            <Image src="/ETDK.png" width={150} height={150} alt="ETDK" />
          </div>
          <div className="flex text-center md:text-start">
            <span className="w-full  text-2xl tracking-wide ">
              XXV. REÁL ÉS HUMÁNTUDOMÁNYI ETDK
              <br />
              KOLOZSVÁR • 2022. MÁJUS 19–22
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communication;
