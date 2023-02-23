import {
  getDataForParticipant,
  queryActiveSections,
  queryFaculties,
  querySubjects,
  queryUniversities,
} from "@lib/queries";
import { getClient } from "@lib/sanity";
import type { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import type { Inputs } from "src/components/ApplicationForm";
import ApplicationForm from "src/components/ApplicationForm";
import type { FacultySanity, SectionsSanity, UniversitiesSanity } from "types";

const AdminJelentkezes = ({
  universities,
  faculties,
  sections,
  participantData,
}: {
  universities: UniversitiesSanity[];
  faculties: FacultySanity[];
  sections: SectionsSanity[];
  participantData: Inputs;
}) => {
  return (
    <ApplicationForm
      universities={universities}
      faculties={faculties}
      sections={sections}
      defaultValues={participantData}
    />
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { preview } = ctx;
  const universities = await getClient(preview || false).fetch(
    queryUniversities
  );
  const faculties = await getClient(preview || false).fetch(queryFaculties);
  const subjects = await getClient(preview || false).fetch(querySubjects);
  const sections = await getClient(preview).fetch(queryActiveSections);

  const session = await getSession(ctx);
  if (!session?.user || !session.user.email) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }
  const defaultParticipantData = await getClient(preview || false).fetch(
    getDataForParticipant(session.user.email)
  );

  const participantData = {
    ...defaultParticipantData[0],
    subject: defaultParticipantData[0].subject._ref,
    university: defaultParticipantData[0].university._ref,
    faculty: defaultParticipantData[0].faculty._ref,
  };
  return {
    props: {
      universities,
      faculties,
      subjects,
      sections,
      participantData,
      preview: preview || false,
    },
  };
}

export default AdminJelentkezes;
