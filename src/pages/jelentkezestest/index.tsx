import { fetcher } from "@lib/queries";
import ApplicationForm from "src/components/ApplicationForm";
import type { UniversitiesSanity, FacultySanity, SectionsSanity } from "types";

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
  const universities = await fetcher("/universities");
  const faculties = await fetcher("/faculties");
  const sections = await fetcher("/sections");

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
