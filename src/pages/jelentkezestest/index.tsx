import {
  queryActiveSections,
  queryFaculties,
  queryUniversities,
} from "@lib/queries";
import { getClient } from "@lib/sanity";
import ApplicationForm from "src/components/ApplicationForm";
import type { FacultySanity, SectionsSanity, UniversitiesSanity } from "types";

const JelentkezesTest = ({
  universities,
  faculties,
  sections,
}: {
  universities: UniversitiesSanity[];
  faculties: FacultySanity[];
  sections: SectionsSanity[];
}) => {
  return (
    <ApplicationForm
      universities={universities}
      faculties={faculties}
      sections={sections}
    />
  );
};

export async function getStaticProps({ preview = false }) {
  const universities = await getClient(preview).fetch(queryUniversities);
  const faculties = await getClient(preview).fetch(queryFaculties);
  const sections = await getClient(preview).fetch(queryActiveSections);

  return {
    props: {
      universities,
      faculties,
      sections,
      preview,
    },
    revalidate: 30,
  };
}

export default JelentkezesTest;
