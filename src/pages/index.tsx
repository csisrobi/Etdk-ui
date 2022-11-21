import { getClient } from "@lib/sanity";
import { type NextPage } from "next";
import { groq } from "next-sanity";
import Head from "next/head";
import type { SanityOrganizer, SanitySponsor } from "types";
import Contact from "../components/Contact";
import MainPage from "../components/MainPage";
import NewsArchiv from "../components/NewsArchiv";
import ParticipationCondition from "../components/ParticipationCondition";
import SponsorsOrg from "../components/SponsorsOrg";
import WhyApplicate from "../components/WhyApplicate";
import Year from "../components/Year";

const querySponsor = groq`
*[_type == "sponsor"]{
  name,
  image
}
`;

const queryOrg = groq`
*[_type == "organizer"]{
  name,
  image
}
`;

type Props = {
  sponsors: SanitySponsor[];
  organizers: SanityOrganizer[];
};

const Home: NextPage<Props> = ({ sponsors, organizers }: Props) => {
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
      <SponsorsOrg sponsors={sponsors} organizers={organizers} />
      <Contact />
    </>
  );
};

export async function getStaticProps({ preview = false }) {
  const sponsors = await getClient(preview).fetch(querySponsor);
  const organizers = await getClient(preview).fetch(queryOrg);
  return {
    props: {
      sponsors,
      organizers,
      preview,
    },
    revalidate: 10,
  };
}

export default Home;
