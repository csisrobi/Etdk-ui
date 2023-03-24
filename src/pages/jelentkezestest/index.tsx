import {
  queryActiveSections,
  queryFaculties,
  queryGeneralGDPR,
  queryUniversities,
} from "@lib/queries";
import { getClient } from "@lib/sanity";
import ApplicationForm from "src/components/ApplicationForm";
import type {
  FacultySanity,
  SanityRichText,
  SectionsSanity,
  UniversitiesSanity,
} from "types";

const JelentkezesTest = ({
  universities,
  faculties,
  sections,
  gdpr,
}: {
  universities: UniversitiesSanity[];
  faculties: FacultySanity[];
  sections: SectionsSanity[];
  gdpr: SanityRichText[];
}) => {
  return (
    <ApplicationForm
      universities={universities}
      faculties={faculties}
      sections={sections}
      gdpr={gdpr}
    />
  );
};

export async function getStaticProps({ preview = false }) {
  const universities = await getClient(preview).fetch(queryUniversities);
  const faculties = await getClient(preview).fetch(queryFaculties);
  const sections = await getClient(preview).fetch(queryActiveSections);
  const gdpr = await getClient(preview).fetch(queryGeneralGDPR);

  return {
    props: {
      universities,
      faculties,
      sections,
      preview,
      gdpr: gdpr[0].gdpr,
    },
    revalidate: 30,
  };
}

export default JelentkezesTest;
