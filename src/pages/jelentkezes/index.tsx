import {
  queryActiveSections,
  queryFaculties,
  queryGeneralGDPR,
  queryUniversities,
} from "@lib/queries";
import { getClient } from "@lib/sanity";
import { isAfter, parseISO } from "date-fns";
import Link from "next/link";
import ApplicationForm from "src/components/ApplicationForm";
import type {
  FacultySanity,
  SanityRichText,
  SectionsSanity,
  UniversitiesSanity,
} from "types";

const Jelentkezes = ({
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
  if (isAfter(new Date(), parseISO("2023-04-02T23:59:59"))) {
    return (
      <div className="flex min-h-[100vh] min-w-full flex-col items-center justify-center space-y-4 bg-white p-2 pb-40 pt-[71px] text-center">
        <p className="text-5xl">A regisztráció lezárult.</p>
        <p>
          Amennyiben beregisztráltál, itt tudod az adataid modosítani:
          <Link className="underline" href="/admin">
            Admin
          </Link>
        </p>
      </div>
    );
  }
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

export default Jelentkezes;
