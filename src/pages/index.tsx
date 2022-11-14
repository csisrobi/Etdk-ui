import { type NextPage } from "next";
import Head from "next/head";
import MainPage from "../components/MainPage";
import ParticipationCondition from "../components/ParticipationCondition";
import WhyApplicate from "../components/WhyApplicate";

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
    </>
  );
};

export default Home;
