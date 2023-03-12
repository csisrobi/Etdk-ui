import {
  getPersonDataForParticipant,
  getProjectsDataForParticipant,
  queryActiveSections,
  queryFaculties,
  querySubjects,
  queryUniversities,
} from "@lib/queries";
import { getClient } from "@lib/sanity";
import type { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import type {
  ProjectInputs,
  PersonInputs,
} from "src/components/ApplicationForm";
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
  participantData: {
    personData: PersonInputs;
    projectsData: ProjectInputs[];
  };
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
  if (session.user.role !== "participant") {
    return {
      redirect: {
        destination: "/admin/ellenorzes",
        permanent: false,
      },
    };
  }
  const defaultParticipantPersonData = await getClient(preview || false).fetch(
    getPersonDataForParticipant(session.user.email)
  );
  const defaultParticipantProjectsData = await getClient(
    preview || false
  ).fetch(getProjectsDataForParticipant(session.user.email));

  return {
    props: {
      universities,
      faculties,
      subjects,
      sections,
      participantData:
        !!defaultParticipantPersonData.length &&
        !!defaultParticipantProjectsData.length
          ? {
              personData: defaultParticipantPersonData[0],
              projectsData: defaultParticipantProjectsData,
            }
          : {},
      preview: preview || false,
    },
  };
}

export default AdminJelentkezes;
