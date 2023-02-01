import { queryFaculties, querySubjects, queryUniversities } from "@lib/queries";
import { getClient } from "@lib/sanity";
import ApplicationForm from "src/components/ApplicationForm";
import type { UniversitiesSanity, FacultySanity } from "types";

const JelentkezesTest = ({
  universities,
  faculties,
}: {
  universities: UniversitiesSanity[];
  faculties: FacultySanity[];
}) => {
  return <ApplicationForm universities={universities} faculties={faculties} />;
};

export async function getStaticProps({ preview = false }) {
  const universities = await getClient(preview).fetch(queryUniversities);
  const faculties = await getClient(preview).fetch(queryFaculties);
  const subject = await getClient(preview).fetch(querySubjects);

  return {
    props: {
      universities,
      faculties,
      subject,
      preview,
    },
    revalidate: 30,
  };
}

export default JelentkezesTest;
