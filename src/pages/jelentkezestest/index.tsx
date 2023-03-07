import ApplicationForm from "src/components/ApplicationForm";
import type { UniversitiesSanity, FacultySanity, SectionsSanity } from "types";
import adminService from "../api/services/adminService";

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
  const universities = await adminService.getUniversities(preview);
  const faculties = await adminService.getFaculties(preview);
  const sections = await adminService.getSections(preview);

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
