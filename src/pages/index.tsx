import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      {/* TODO: SEO */}
      <Head>
        <title>ETDK</title>
        <meta name="description" content="Etdk" />
        <link rel="icon" href="/ETDK.png" />
      </Head>

      <main className="container flex min-h-[calc(100vh-100px)] min-w-full flex-col items-center justify-center bg-gray p-4">
        <h1 className="text-gray-700 text-5xl font-extrabold leading-normal md:text-[5rem]">
          ETDK
        </h1>
      </main>
    </>
  );
};

export default Home;
