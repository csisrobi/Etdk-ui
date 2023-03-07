import { Download, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import type { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useState, useMemo } from "react";
import useSWR from "swr";
import type { SanityParticipant } from "types";
import { ParticipantScoring } from "src/components/AdminComponents/Scoring";
import adminService from "../api/services/adminService";

export type Criteria = {
  _id: string;
  maxScore: number;
  name: string;
};

type Section = {
  _id: string;
  criteria: Criteria[];
  name: string;
};

const AdminPontozoFelulet = ({ sections }: { sections: Section[] }) => {
  const [tabValue, setTabValue] = useState<number>(0);
  const { data: sectionParticipantsData, isLoading } = useSWR<
    SanityParticipant[]
  >(
    ["/section_participants", tabValue],
    async () =>
      await adminService.getSectionParticipants(sections[tabValue]?._id || "")
  );

  const sectionsOptions = useMemo(
    () =>
      sections.map((s, i) => ({
        name: s.name,
        value: i,
      })),
    [sections]
  );
  return (
    <div className="min-h-[100vh] min-w-full p-4 pt-[100px]">
      <div className="relative mx-auto w-full max-w-4xl space-y-5 md:flex md:w-3/4 md:flex-col">
        <Autocomplete
          onChange={(_e, value) => {
            setTabValue(value?.value || 0);
          }}
          options={sectionsOptions}
          getOptionLabel={(option) => option.name}
          value={sectionsOptions[tabValue] || null}
          renderInput={(params) => <TextField {...params} label="Szekció" />}
          sx={{ width: "100%" }}
        />
        {isLoading && (
          <div>
            <svg
              aria-hidden="true"
              className="mr-2 h-14 w-14 animate-spin fill-white text-lightcherry dark:text-lightcherry"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}
        {sectionParticipantsData &&
          sectionParticipantsData.map((participant) => (
            <Accordion key={participant._id}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{ display: "flex" }}
              >
                <Typography className="self-center" sx={{ flex: 1 }}>
                  {participant.name}
                </Typography>
                <Button
                  variant="contained"
                  endIcon={<Download />}
                  className="bg-darkcherry"
                  sx={{ mr: 2 }}
                >
                  <a
                    href={participant.extract.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {participant.title}
                  </a>
                </Button>
              </AccordionSummary>
              <AccordionDetails>
                {sections && sections[tabValue] && (
                  <ParticipantScoring
                    criteria={sections[tabValue]!.criteria}
                    participant={participant}
                  />
                )}
              </AccordionDetails>
            </Accordion>
          ))}
      </div>
    </div>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { preview } = ctx;

  const session = await getSession(ctx);
  if (!session?.user || !session.user.email) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  //TODO: FILTER AFTER LOGGED IN USER RESPONSABILITY
  const sections = (await adminService.getSectionsForScoring(
    preview || false
  )) as Section[];

  return {
    props: {
      sections: sections.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      ),
      preview: preview || false,
    },
  };
}

export default AdminPontozoFelulet;
