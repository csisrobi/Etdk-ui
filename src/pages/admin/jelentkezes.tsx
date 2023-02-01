import {
  getDataForParticipant,
  queryFaculties,
  querySubjects,
  queryUniversities,
} from "@lib/queries";
import { getClient } from "@lib/sanity";
import { getSession } from "next-auth/react";
import type { Inputs } from "src/components/ApplicationForm";
import ApplicationForm from "src/components/ApplicationForm";
import type { FacultySanity, SubjectSanity, UniversitiesSanity } from "types";

const AdminJelentkezes = ({
  universities,
  faculties,
  subjects,
  participantData,
}: {
  universities: UniversitiesSanity[];
  faculties: FacultySanity[];
  subjects: SubjectSanity[];
  participantData: Inputs;
}) => {
  return (
    <ApplicationForm
      universities={universities}
      faculties={faculties}
      defaultValues={participantData}
    />
  );
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export async function getServerSideProps(ctx) {
  const universities = await getClient(ctx.preview || false).fetch(
    queryUniversities
  );
  const faculties = await getClient(ctx.preview || false).fetch(queryFaculties);
  const subjects = await getClient(ctx.preview || false).fetch(querySubjects);
  const session = await getSession(ctx);
  if (!session?.user || !session.user.email) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }
  const defaultParticipantData = await getClient(ctx.preview || false).fetch(
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
      participantData,
      preview: ctx.preview || false,
    },
  };
}

export default AdminJelentkezes;
