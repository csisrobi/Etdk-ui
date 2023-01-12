import { type AppType } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import "../styles/globals.css";
import Layout from "../components/Layout";
import { Bebas_Neue } from "@next/font/google";
import { Open_Sans } from "@next/font/google";

const Bebas = Bebas_Neue({ weight: "400" });
const Sans = Open_Sans({ weight: "400", subsets: ["latin"] });

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --bebas-font: ${Bebas.style.fontFamily};
            --sans-font: ${Sans.style.fontFamily};
          }
        `}
      </style>
      <Layout>
        <Component {...pageProps} />
        <Analytics />
      </Layout>
    </>
  );
};

export default MyApp;
