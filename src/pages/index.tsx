import { type NextPage } from "next";
import Head from "next/head";
import MainPage from "../components/MainPage";

const Home: NextPage = () => {
  return (
    <>
      {/* TODO: SEO */}
      <Head>
        <title>ETDK</title>
        <meta name="description" content="Etdk" />
        <link rel="icon" href="/ETDK.png" />
      </Head>

      <MainPage />
    </>
  );
};

export default Home;
