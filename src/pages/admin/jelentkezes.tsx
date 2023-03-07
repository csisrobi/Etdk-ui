import type { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import type { Inputs } from "src/components/ApplicationForm";
import ApplicationForm from "src/components/ApplicationForm";
import type { FacultySanity, SectionsSanity, UniversitiesSanity } from "types";
import adminService from "../api/services/adminService";
import participantService from "../api/services/participantService";

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
  if (!Object.keys(participantData).length) {
    return (
      <div className="flex min-h-[100vh] min-w-full flex-col items-center justify-center space-y-4 bg-white pb-40 pt-[71px]">
        <p className="text-5xl">Nincs kitöltötött adatod</p>
      </div>
    );
  }
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
  const universities = await adminService.getUniversities(preview || false);
  const faculties = await adminService.getFaculties(preview || false);
  const subjects = await adminService.getSubjects(preview || false);
  const sections = await adminService.getSections(preview || false);

  const session = await getSession(ctx);
  if (!session?.user || !session.user.email) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }
  const defaultParticipantData = await participantService.getParticipantData(
    preview || false,
    session.user.email
  );

  const participantData = defaultParticipantData.length
    ? {
        ...defaultParticipantData[0],
        subject: defaultParticipantData[0]?.subject?._ref,
        university: defaultParticipantData[0]?.university?._ref,
        faculty: defaultParticipantData[0]?.faculty?._ref,
      }
    : undefined;

  return {
    props: {
      universities,
      faculties,
      subjects,
      sections,
      participantData: participantData || {},
      preview: preview || false,
    },
  };
}

export default AdminJelentkezes;
