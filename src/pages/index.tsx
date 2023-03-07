import { type NextPage } from "next";
import Head from "next/head";
import type {
  SanityApplicate,
  SanityArchiv,
  SanityContact,
  SanityGeneral,
  SanityNews,
  SanityOrganizer,
  SanitySponsor,
} from "types";
import Contact from "../components/Contact";
import MainPage from "../components/MainPage";
import NewsArchiv from "../components/NewsArchiv";
import ParticipationCondition from "../components/ParticipationCondition";
import SponsorsOrg from "../components/SponsorsOrg";
import WhyApplicate from "../components/WhyApplicate";
import Year from "../components/Year";
import mainService from "./api/services/mainService";

type Props = {
  sponsors: SanitySponsor[];
  organizers: SanityOrganizer[];
  contact: SanityContact;
  general: SanityGeneral;
  applicate: SanityApplicate;
  news: SanityNews[];
  archivs: SanityArchiv[];
};

const Home: NextPage<Props> = ({
  sponsors,
  organizers,
  contact,
  general,
  applicate,
  news,
  archivs,
}: Props) => {
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
      <MainPage
        date={general.date}
        edition={general.edition}
        romanEdition={general.editionRoman}
      />
      <WhyApplicate
        title={applicate.title}
        description={applicate.description}
        small_benefit={applicate.small_benefit}
        big_benefit={applicate.big_benefit}
      />
      <ParticipationCondition certificateURL={general.certificateURL} />
      <Year />
      <NewsArchiv news={news} archivs={archivs} />
      <SponsorsOrg sponsors={sponsors} organizers={organizers} />
      <Contact
        address={contact.address}
        email={contact.email}
        phone={contact.phone}
        facebook={contact.facebook}
        instagram={contact.instagram}
        date={general.date}
        romanEdition={general.editionRoman}
      />
    </>
  );
};

export async function getStaticProps({ preview = false }) {
  const sponsors = await mainService.getSponsors(preview);
  const organizers = await mainService.getOrganizers(preview);
  const contacts = await mainService.getContacts(preview);
  const generals = await mainService.getGenerals(preview);
  const applicate = await mainService.getApplicate(preview);
  const news = await mainService.getNews(preview);
  const archivs = await mainService.getArchives(preview);
  return {
    props: {
      contact: contacts[0],
      general: generals[0],
      applicate: applicate[0],
      archivs,
      news,
      sponsors,
      organizers,
      preview,
    },
    revalidate: 10,
  };
}

export default Home;
