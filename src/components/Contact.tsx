import Image from "next/image";
import type { SanityContact } from "types";

type Props = SanityContact & {
  date: string;
  romanEdition: string;
};

const Contact = ({
  date,
  romanEdition,
  address,
  phone,
  email,
  facebook,
  instagram,
}: Props) => {
  return (
    <div
      id="contact"
      className="flex min-h-[calc(70vh-100px)] flex-col items-center gap-12 bg-lightGray px-2 py-10 md:flex-row md:items-start md:p-8 lg:gap-48 lg:bg-white"
    >
      <div className="hidden w-full flex-col items-end md:flex md:w-1/2">
        <div className="justify-center md:justify-start">
          <div className="flex justify-center md:justify-start">
            <Image src="/ETDK.png" width={150} height={150} alt="ETDK" />
          </div>
          <div className="flex text-center md:text-start">
            <span className="w-full  text-2xl tracking-wide ">
              {romanEdition}. REÁL ÉS HUMÁNTUDOMÁNYI ETDK
              <br />
              KOLOZSVÁR • {date}
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
            <p className="text-lg">{address}</p>
            <p className="text-lg">Telefonszám : {phone}</p>
            <p className="text-lg"> Email : {email}</p>
            <div className="flex justify-center gap-2 md:justify-start">
              <a href={facebook} target="_blank" rel="noreferrer">
                <Image
                  src="/facebook.png"
                  height={50}
                  width={50}
                  alt="facebook"
                />
              </a>
              <a href={instagram} target="_blank" rel="noreferrer">
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
              {romanEdition}. REÁL ÉS HUMÁNTUDOMÁNYI ETDK
              <br />
              KOLOZSVÁR • {date}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
