import { type NextPage } from "next";
import Head from "next/head";
import MainPage from "../components/MainPage";
import NewsArchiv from "../components/NewsArchiv";
import ParticipationCondition from "../components/ParticipationCondition";
import SponsorsOrg from "../components/SponsorsOrg";
import WhyApplicate from "../components/WhyApplicate";
import Year from "../components/Year";
import Communication from "./../components/Communication";

const Home: NextPage = () => {
  return (
    <>
      {/* TODO: SEO FROM STRAPI*/}
      <Head>
        <title>ETDK</title>
        <meta
          name="description"
          content="Erdélyi Tudományos diákköri konferencia reál és humántudományok"
        />
        <link rel="icon" href="/ETDK.png" />
      </Head>
      <MainPage />
      <WhyApplicate />
      <ParticipationCondition />
      <Year />
      <NewsArchiv />
      <SponsorsOrg />
      <Communication />
    </>
  );
};

export default Home;
