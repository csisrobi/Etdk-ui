import type { MRT_ColumnDef, MRT_Row } from "material-react-table";
import MaterialReactTable from "material-react-table";
import type { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useMemo } from "react";
import type {
  SanityAdvisorData,
  SanityParticipant,
  SanityPersonData,
} from "types";
import { Switch } from "@headlessui/react";
import useSWR from "swr";
import { fetcher } from "@lib/queries";
import { Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";

const headersParticipant = {
  name: "Név",
  idNumber: "Ellenőrző szám",
  university: "Egyetem",
  subject: "Szak",
  faculty: "Kar",
  degree: "Képzési szint",
  class: "Évfolyam",
  finishedSemester: "Elvégzett félévek száma",
  email: "Email",
  mobileNumber: "Telefonszám",
};

const headersAdvisor = {
  name: "Témavezető név",
  university: "Témavezető egyetem",
  title: "Témavezető titulus",
  email: "Témavezető email",
  mobileNumber: "Témavezető telefonszám",
};

const headersProject = {
  title: "Dolgozat cím",
  section: "Szekció",
};

const EllenorzoFelulet = () => {
  const { data: allParticipantData, isLoading } = useSWR<SanityParticipant[]>(
    "/participants_data",
    async () =>
      await fetcher(`/participants`).then((r) => (Array.isArray(r) ? r : []))
  );

  const columns = useMemo<MRT_ColumnDef<SanityParticipant>[]>(() => {
    const participantHeaders = Object.keys(headersParticipant).map((key) => {
      return {
        accessorFn: (row: SanityParticipant) => {
          const newKey =
            key === "university" && !row.university
              ? "universityOther"
              : key === "faculty" && !row.faculty
              ? "facultyOther"
              : key === "subject" && !row.subject
              ? "subjectOther"
              : key;
          return row[newKey as keyof SanityParticipant];
        },
        header: headersParticipant[key as keyof typeof headersParticipant],
      };
    });
    const advisorHeaders: MRT_ColumnDef<SanityParticipant>[] = [
      0, 1, 2, 3,
    ].reduce((acc, i) => {
      return [
        ...acc,
        ...Object.keys(headersAdvisor).map((key) => {
          return {
            accessorFn: (row: SanityParticipant) => {
              const newKey =
                key === "university" && !row.advisors?.[i]?.university
                  ? "universityOther"
                  : key;
              return row.advisors?.[i]?.[newKey as keyof SanityAdvisorData]
                ? row.advisors?.[i]?.[newKey as keyof SanityAdvisorData]
                : null;
            },
            header: `${i + 1}. ${
              headersAdvisor[key as keyof typeof headersAdvisor]
            }`,
          };
        }),
      ];
    }, [] as MRT_ColumnDef<SanityParticipant>[]);

    const companionsHeaders: MRT_ColumnDef<SanityParticipant>[] = [
      0, 1, 2, 3,
    ].reduce((acc, i) => {
      return [
        ...acc,
        ...Object.keys(headersParticipant).map((key) => {
          return {
            accessorFn: (row: SanityParticipant) => {
              const newKey =
                key === "university" && !row.companions?.[i]?.university
                  ? "universityOther"
                  : key === "faculty" && !row.companions?.[i]?.faculty
                  ? "facultyOther"
                  : key === "subject" && !row.companions?.[i]?.subject
                  ? "subjectOther"
                  : key;
              return row.companions?.[i]?.[newKey as keyof SanityPersonData]
                ? row.companions?.[i]?.[newKey as keyof SanityPersonData]
                : null;
            },
            header: `${i + 1}. Társszerző ${headersParticipant[
              key as keyof typeof headersParticipant
            ].toLowerCase()}`,
          };
        }),
      ];
    }, [] as MRT_ColumnDef<SanityParticipant>[]);

    const projectHeaders = Object.keys(headersProject).map((key) => {
      return {
        accessorKey: key as keyof SanityParticipant,
        header: headersProject[key as keyof typeof headersProject],
      };
    });

    const acceptedHeader: MRT_ColumnDef<SanityParticipant> = {
      accessorKey: "accepted",
      header: "Elfogadva",
      Cell: ({ row }) => (
        <Switch
          checked={row.original.accepted}
          onChange={async () =>
            await fetcher(`/participants/accept`, {
              id: row.original._id,
              currentValue: row.original.accepted,
            })
          }
          className={`${
            row.original.accepted ? "bg-lightcherry" : "bg-lightBrown"
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span
            className={`${
              row.original.accepted ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
      ),
    };
    return [
      ...participantHeaders,
      ...advisorHeaders,
      ...companionsHeaders,
      ...projectHeaders,
      acceptedHeader,
    ];
  }, []);

  if (isLoading) {
    return (
      <div className="align-center flex min-h-[100vh] min-w-full items-center justify-center p-4 pt-[100px]">
        <svg
          aria-hidden="true"
          className="mr-2 h-28 w-28 animate-spin fill-white text-lightcherry dark:text-lightcherry"
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
    );
  }

  const csvOptions = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: true,
  };

  const csvExporter = new ExportToCsv(csvOptions);

  const handleExportRows = (rows: MRT_Row<SanityParticipant>[]) => {
    csvExporter.generateCsv(rows.map((row) => row._valuesCache));
  };

  return (
    <div className="ellenorzes min-h-[100vh] min-w-full pt-[100px] text-white">
      {!!allParticipantData && (
        <MaterialReactTable
          columns={columns}
          data={allParticipantData}
          renderTopToolbarCustomActions={({ table }) => (
            <Button
              disabled={table.getPrePaginationRowModel().rows.length === 0}
              onClick={() => {
                handleExportRows(table.getPrePaginationRowModel().rows);
              }}
              startIcon={<FileDownloadIcon />}
              variant="contained"
            >
              Export
            </Button>
          )}
        />
      )}
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

  return {
    props: {
      preview: preview || false,
    },
  };
}

export default EllenorzoFelulet;
