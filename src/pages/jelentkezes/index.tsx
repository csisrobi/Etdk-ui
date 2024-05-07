import {
  queryActiveSections,
  queryAllDeadline,
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
  SanityDeadlines,
  SanityRichText,
  SectionsSanity,
  UniversitiesSanity,
} from "types";

const Jelentkezes = ({
  universities,
  faculties,
  sections,
  gdpr,
  deadlines,
}: {
  universities: UniversitiesSanity[];
  faculties: FacultySanity[];
  sections: SectionsSanity[];
  gdpr: SanityRichText[];
  deadlines: SanityDeadlines;
}) => {
  const afterUploadStart = isAfter(
    new Date(),
    parseISO(`${deadlines.documentUploadStart}T23:59:59`)
  );

  const afterUploadEnd = isAfter(
    new Date(),
    parseISO(`${deadlines.documentUploadEnd}T23:59:59`)
  );

  const afterApplicationStart = isAfter(
    new Date(),
    parseISO(`${deadlines.applicationStart}T23:59:59`)
  );

  const afterApplicationEnd = isAfter(
    new Date(),
    parseISO(`${deadlines.applicationEnd}T23:59:59`)
  );

  if (afterApplicationEnd) {
    return (
      <div className="flex min-h-[100vh] min-w-full flex-col items-center justify-center space-y-4 bg-white p-2 pb-40 pt-[71px] text-center">
        <p className="text-5xl">A regisztráció lezárult.</p>
        {afterUploadStart && !afterUploadEnd && (
          <p>
            Amennyiben beregisztráltál, itt tudod az adataid modosítani:
            <Link className="underline" href="/admin">
              Bejelentkezés
            </Link>
          </p>
        )}
      </div>
    );
  }
  if (afterApplicationStart) {
    return (
      <ApplicationForm
        universities={universities}
        faculties={faculties}
        sections={sections}
        gdpr={gdpr}
      />
    );
  }

  return null;
};

export async function getServerSideProps({ preview = false }) {
  const universities = await getClient(preview).fetch(queryUniversities);
  const faculties = await getClient(preview).fetch(queryFaculties);
  const sections = await getClient(preview).fetch(queryActiveSections);
  const gdpr = await getClient(preview).fetch(queryGeneralGDPR);
  const deadlines = await getClient(preview).fetch(queryAllDeadline);

  return {
    props: {
      universities,
      faculties,
      sections,
      preview,
      deadlines: deadlines[0],
      gdpr: gdpr[0].gdpr,
    },
  };
}

export default Jelentkezes;
