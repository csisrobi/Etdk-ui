import { Dialog, Disclosure, Transition } from "@headlessui/react";
import {
  CheckBadgeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { fetcher } from "@lib/queries";
import classNames from "classnames";
import { nanoid } from "nanoid";
import React, { Fragment, useCallback, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import Select from "src/components/FormComponents/Select";
import Snackbar from "src/components/UtilityComponents/Snackbar";
import type { FacultySanity, SectionsSanity, UniversitiesSanity } from "types";
import { ContributionField } from "./ContributionField";
import { FacultyField } from "./FacultyField";
import { OtherField } from "./OtherField";
import { SubjectField } from "./SubjectField";
import { UniversityField } from "./UniversityField";

//TODO SORREND DOCX

// Szemelyes adatok
//TODO KELL ELLENORZO SZAM -------------- DONE
//TODO KELL ELVEGZETT FELEVEK SZAMA, 1-10 -------------- DONE
//TODO ELLENORZO KEP -------------- DONE

//TODO: jelentkezes utan, masodik fazisba
// Dolgozat - pdf, akár 100 oldalas dokumentum, képekkel, ábrákkal -------------- DONE
// 	Melléklet - pdf, max. 20 oldalas dokumentum -------------- DONE

// Egyéb dokumentumok:
// Adatbankos nyilatkozat - pdf, 1 oldalas dokumentum -------------- DONE
// Kifizetési bizonylat - pdf vagy jpg. -------------- DONE
// Kivételes eset: Biológia szekció esetében, hozzájárulási nyilatkozat, pdf, 1 oldalas (ha nem megoldható e-mailen továbbítják, kb. 10-15 ember érint) -------------- DONE

//TODO: GDPR kocka enelkul nem lehet jelentkezni + lekell menteni hogy beleegyezett
//TODO: JELENTKEZETT -> NOW sanitybe

//TODO: EGYEB szaknak, karnak es egyetemnek!

//TODO: ERROR HANDLING
const degreeOptions = [
  {
    name: "BA (alapképzés)",
    value: "BA",
  },
  {
    name: "MA (mesterképzés)",
    value: "MA",
  },
];

const classOptions = [
  {
    name: "1",
    value: "1",
  },
  {
    name: "2",
    value: "2",
  },
  {
    name: "3",
    value: "3",
  },
  {
    name: "4",
    value: "4",
  },
  {
    name: "5",
    value: "5",
  },
];

const semesterOptions = [
  {
    name: "1",
    value: "1",
  },
  {
    name: "2",
    value: "2",
  },
  {
    name: "3",
    value: "3",
  },
  {
    name: "4",
    value: "4",
  },
  {
    name: "5",
    value: "5",
  },
  {
    name: "6",
    value: "6",
  },
  {
    name: "7",
    value: "7",
  },
  {
    name: "8",
    value: "8",
  },
  {
    name: "9",
    value: "9",
  },
  {
    name: "10",
    value: "10",
  },
];

const titleOptions = [
  {
    name: "Adjunktus",
    value: "adjunktus",
  },
  {
    name: "Docens",
    value: "Ddocens",
  },
  {
    name: "Doktorandusz",
    value: "doktorandusz",
  },
  {
    name: "Professzor",
    value: "professzor",
  },
];

export type AdvisorInputs = {
  name: string;
  email: string;
  mobileNumber: string;
  title: string;
  university: string;
  faculty: string;
  subject: string;
  universityOther?: string;
  facultyOther?: string;
  subjectOther?: string;
  certificate: File | null | string;
};
export type PersonInputs = {
  name: string;
  idNumber: string;
  finishedSemester: string;
  degree: string;
  class: string;
  university: string;
  faculty: string;
  subject: string;
  universityOther?: string;
  facultyOther?: string;
  subjectOther?: string;
  email: string;
  mobileNumber: string;
  idPhoto: File | null | string;
  voucher?: File | null | string;
};

export type ProjectInputs = {
  _id?: string;

  title: string;
  extract: File | null | string;
  section: string;
  annex: File | null | string;
  declaration: File | null | string;
  contribution: File | null | string;
  advisors: AdvisorInputs[];
  companions?: PersonInputs[];
};

export type Inputs = {
  projects: ProjectInputs[];
};

const inputClasses =
  "pl-3 border-none block h-11 w-full rounded-xl text-lg font-semibold placeholder:opacity-80 focus:border-darkcherry focus:ring-darkcherry";

const ApplicationForm = ({
  universities,
  faculties,
  sections,
  defaultValues,
}: {
  universities: UniversitiesSanity[];
  faculties: FacultySanity[];
  sections: SectionsSanity[];
  defaultValues?: {
    personData: PersonInputs;
    projectsData: ProjectInputs[];
  };
}) => {
  const [notiMessage, setNotiMessage] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    control: personFormControl,
    getValues: personGetValues,
    setValue: personSetValue,
  } = useForm<PersonInputs>({
    defaultValues: !defaultValues
      ? {
          name: "",
          idNumber: "",
          degree: "",
          class: "",
          university: "",
          faculty: "",
          subject: "",
          universityOther: undefined,
          facultyOther: undefined,
          subjectOther: undefined,
          finishedSemester: "",
          email: "",
          mobileNumber: "",
          idPhoto: null,
          voucher: null,
        }
      : defaultValues.personData,
  });

  const {
    control: projectsControl,
    handleSubmit,
    setValue: projectSetValue,
    getValues: projectGetValues,
  } = useForm<Inputs>({
    defaultValues: {
      projects: !defaultValues
        ? [
            {
              advisors: [
                {
                  name: "",
                  email: "",
                  mobileNumber: "",
                  title: "",
                  university: "",
                  faculty: "",
                  subject: "",
                  universityOther: undefined,
                  facultyOther: undefined,
                  subjectOther: undefined,
                  certificate: null,
                },
              ],
              title: "",
              extract: null,
              section: "",
              contribution: null,
              annex: null,
              declaration: null,
              companions: [],
            },
          ]
        : defaultValues.projectsData,
    },
  });

  const { append, remove, fields, update } = useFieldArray({
    control: projectsControl,
    name: "projects",
  });

  const mapAdvisorData = useCallback(async (advisorData: AdvisorInputs) => {
    const formData = new FormData();
    formData.append("file", advisorData.certificate || "");
    formData.append(
      "name",
      advisorData.certificate && typeof advisorData.certificate === "object"
        ? advisorData.certificate.name
        : ""
    );

    const certificateData =
      advisorData.certificate && typeof advisorData.certificate === "object"
        ? await fetcher(`/participants/upload/file`, formData, true)
        : null;
    return {
      _key: nanoid(),
      name: advisorData.name,
      ...(advisorData.universityOther
        ? {
            universityOther: advisorData.universityOther,
          }
        : {
            university: {
              _type: "reference",
              _ref: advisorData.university,
            },
          }),
      ...(advisorData.facultyOther
        ? { facultyOther: advisorData.facultyOther }
        : {
            faculty: {
              _type: "reference",
              _ref: advisorData.faculty,
            },
          }),
      ...(advisorData.subjectOther
        ? { subjectOther: advisorData.subjectOther }
        : {
            subject: {
              _type: "reference",
              _ref: advisorData.subject,
            },
          }),
      title: advisorData.title,
      email: advisorData.email,
      mobileNumber: advisorData.mobileNumber,
      ...(certificateData && {
        certificate: {
          _type: "file",
          asset: {
            _ref: certificateData,
            _type: "reference",
          },
        },
      }),
    };
  }, []);

  const mapCompanionsData = useCallback(
    async (participantData: PersonInputs) => {
      const formData = new FormData();
      formData.append("file", participantData.idPhoto || "");
      formData.append(
        "name",
        participantData.idPhoto && typeof participantData.idPhoto === "object"
          ? participantData.idPhoto.name
          : ""
      );

      const idPhotoData =
        participantData.idPhoto && typeof participantData.idPhoto === "object"
          ? await fetcher(`/participants/upload/file`, formData, true)
          : null;
      return {
        _key: nanoid(),
        name: participantData.name,
        idNumber: participantData.idNumber,
        ...(participantData.universityOther
          ? { universityOther: participantData.universityOther }
          : {
              university: {
                _type: "reference",
                _ref: participantData.university,
              },
            }),

        ...(participantData.facultyOther
          ? { facultyOther: participantData.facultyOther }
          : {
              faculty: {
                _type: "reference",
                _ref: participantData.faculty,
              },
            }),
        ...(participantData.subjectOther
          ? { subjectOther: participantData.subjectOther }
          : {
              subject: {
                _type: "reference",
                _ref: participantData.subject,
              },
            }),
        degree: participantData.degree,
        class: participantData.class,
        finishedSemester: participantData.finishedSemester,
        email: participantData.email,
        mobileNumber: participantData.mobileNumber,
        ...(idPhotoData && {
          idPhoto: {
            _type: "file",
            asset: {
              _ref: idPhotoData,
              _type: "reference",
            },
          },
        }),
      };
    },
    []
  );

  const onSubmit = React.useMemo(() => {
    return handleSubmit(async (data) => {
      setLoading(true);
      const participantData = personGetValues();
      const checkEmail = await fetcher(
        `/participants/check`,
        JSON.stringify({
          email: participantData.email,
        })
      );
      if (!checkEmail.length) {
        const password = Math.random().toString(36).slice(-8);

        const formData = new FormData();
        formData.append("file", participantData.idPhoto || "");
        formData.append(
          "name",
          participantData.idPhoto && typeof participantData.idPhoto === "object"
            ? participantData.idPhoto.name
            : ""
        );

        const idPhotoData =
          participantData.idPhoto && typeof participantData.idPhoto === "object"
            ? await fetcher(`/participants/upload/file`, formData, true)
            : null;

        Promise.all(
          data.projects.map(async (project, index) => {
            if (project.extract && typeof project.extract === "object") {
              const formData = new FormData();
              formData.append("file", project.extract || "");
              formData.append(
                "name",
                project.extract && typeof project.extract === "object"
                  ? project.extract.name
                  : ""
              );

              const extractData =
                project.extract && typeof project.extract === "object"
                  ? await fetcher(`/participants/upload/file`, formData, true)
                  : null;
              Promise.all(
                project.advisors.map(
                  async (advisor) => await mapAdvisorData(advisor)
                )
              ).then((advisors) => {
                Promise.all(
                  (project.companions || []).map(
                    async (companion) => await mapCompanionsData(companion)
                  )
                ).then(async (companions) => {
                  const mutations = [
                    {
                      create: {
                        _type: "participants",
                        name: participantData.name,
                        idNumber: participantData.idNumber,
                        ...(participantData.universityOther
                          ? {
                              universityOther: participantData.universityOther,
                            }
                          : {
                              university: {
                                _type: "reference",
                                _ref: participantData.university,
                              },
                            }),

                        ...(participantData.facultyOther
                          ? { facultyOther: participantData.facultyOther }
                          : {
                              faculty: {
                                _type: "reference",
                                _ref: participantData.faculty,
                              },
                            }),
                        ...(participantData.subjectOther
                          ? { subjectOther: participantData.subjectOther }
                          : {
                              subject: {
                                _type: "reference",
                                _ref: participantData.subject,
                              },
                            }),
                        degree: participantData.degree,
                        class: participantData.class,
                        finishedSemester: participantData.finishedSemester,
                        email: participantData.email,
                        mobileNumber: participantData.mobileNumber,
                        ...(idPhotoData && {
                          idPhoto: {
                            _type: "file",
                            asset: {
                              _ref: idPhotoData,
                              _type: "reference",
                            },
                          },
                        }),

                        advisors: advisors,

                        companions: companions,

                        title: project.title,
                        extract: {
                          _type: "file",
                          asset: {
                            _ref: extractData,
                            _type: "reference",
                          },
                        },
                        section: {
                          _type: "reference",
                          _ref: project.section,
                        },
                        accepted: false,
                        password: password,
                      },
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ] as any;
                  return await fetcher(
                    `/participants/upload/mutations`,
                    JSON.stringify(mutations)
                  ).catch(() => {
                    setNotiMessage(
                      `${
                        index + 1
                      } projekt: Ellenőrizd, hogy minden adat helyesen volt bevezetve.`
                    );
                    setLoading(false);
                    setTimeout(() => setNotiMessage(""), 3000);
                  });
                });
              });
            }
          })
        )
          .catch(() => {
            console.log("asd");
            setNotiMessage(
              `Ellenőrizd, hogy minden adat helyesen volt bevezetve.`
            );
            setLoading(false);
            setTimeout(() => setNotiMessage(""), 3000);
          })
          .then(() => {
            // setConfirmationMessage(password);
          });
      } else {
        setNotiMessage("Ezen az emailen már regisztrálva van");
        setLoading(false);
        setTimeout(() => setNotiMessage(""), 3000);
      }
    });
  }, [handleSubmit, personGetValues, mapAdvisorData, mapCompanionsData]);

  const AddAdvisorButton = ({ index }: { index: number }) => {
    const advisors = useWatch({
      control: projectsControl,
      name: `projects.${index}.advisors`,
    });
    if (advisors.length < 4) {
      return (
        <div className="flex flex-col items-center md:flex-row ">
          <button
            className="rounded-xl bg-gray-900 py-2 px-4 text-white md:mr-6"
            onClick={() => {
              const projectValues = projectGetValues(`projects.${index}`);
              update(index, {
                ...projectValues,
                advisors: [
                  ...(projectValues.advisors || []),
                  {
                    name: "",
                    email: "",
                    mobileNumber: "",
                    title: "",
                    university: "",
                    faculty: "",
                    subject: "",
                    universityOther: undefined,
                    facultyOther: undefined,
                    subjectOther: undefined,
                    certificate: null,
                  },
                ],
              });
            }}
          >
            <p>Témavezető hozzáadása</p>
          </button>
        </div>
      );
    }
    return null;
  };

  const AddCompanionButton = ({ index }: { index: number }) => {
    const companions = useWatch({
      control: projectsControl,
      name: `projects.${index}.companions`,
    });
    if (!companions || companions.length < 4) {
      return (
        <div className="flex flex-col items-center md:flex-row ">
          <button
            className="rounded-xl bg-gray-900 py-2 px-4 text-white md:mr-6"
            onClick={() => {
              const projectValues = projectGetValues(`projects.${index}`);
              update(index, {
                ...projectValues,
                companions: [
                  ...(projectValues.companions || []),
                  {
                    name: "",
                    idNumber: "",
                    degree: "",
                    class: "",
                    university: "",
                    faculty: "",
                    subject: "",
                    universityOther: undefined,
                    facultyOther: undefined,
                    subjectOther: undefined,
                    finishedSemester: "",
                    email: "",
                    mobileNumber: "",
                    idPhoto: null,
                  },
                ],
              });
            }}
          >
            <p>Társszerző hozzáadása</p>
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex min-h-[100vh] min-w-full flex-col items-center space-y-4 bg-white pb-40 pt-[66px]">
      <div className="w-full space-y-4 md:w-fit">
        <div className="h-fit w-full space-y-4 bg-lightGray px-2 py-6 md:w-[700px] md:p-6 ">
          <p className="text-3xl text-darkcherry">Személyes adatok:</p>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:pl-2">
            <Controller
              name="name"
              control={personFormControl}
              render={({ field }) => (
                <input
                  {...field}
                  autoComplete="off"
                  type="text"
                  className={classNames(
                    inputClasses,
                    "bg-application1 text-darkcherry placeholder:text-darkcherry"
                  )}
                  placeholder="Név"
                />
              )}
            />
            <Controller
              name="idNumber"
              control={personFormControl}
              render={({ field }) => (
                <input
                  {...field}
                  autoComplete="off"
                  type="text"
                  className={classNames(
                    inputClasses,
                    "bg-application1 text-darkcherry placeholder:text-darkcherry"
                  )}
                  placeholder="Ellenőrző száma"
                />
              )}
            />
            <UniversityField
              control={personFormControl}
              fieldName="university"
              text="text-darkcherry"
              bg="bg-application1"
              setAdditional={(value: string | undefined) => {
                personSetValue("universityOther", value);
              }}
              universities={universities}
            />
            <OtherField
              control={personFormControl}
              text="text-darkcherry"
              bg="bg-application1"
              dependencyName="university"
              fieldName="universityOther"
              placeholder="Egyéb egyetem"
            />
            <FacultyField
              control={personFormControl}
              fieldName="faculty"
              dependencyName="university"
              text="text-darkcherry"
              bg="bg-application1"
              setAdditional={(value: string | undefined) =>
                personSetValue("facultyOther", value)
              }
              universities={universities}
            />
            <OtherField
              control={personFormControl}
              text="text-darkcherry"
              bg="bg-application1"
              dependencyName="faculty"
              fieldName="facultyOther"
              placeholder="Egyéb kar"
            />
            <SubjectField
              fieldName="subject"
              dependencyName="faculty"
              control={personFormControl}
              text="text-darkcherry"
              bg="bg-application1"
              setAdditional={(value: string | undefined) =>
                personSetValue("subjectOther", value)
              }
              faculties={faculties}
            />
            <OtherField
              control={personFormControl}
              text="text-darkcherry"
              bg="bg-application1"
              dependencyName="subject"
              fieldName="subjectOther"
              placeholder="Egyéb szak"
            />
            <Controller
              name="degree"
              control={personFormControl}
              render={({ field: { onChange, value } }) => (
                <Select
                  onChange={(value: string | number) => {
                    onChange(value as string);
                  }}
                  options={degreeOptions}
                  value={degreeOptions.find((d) => d.value === value) || null}
                  placeholder="Képzési szint"
                  text="text-darkcherry"
                  bg="bg-application1"
                />
              )}
            />
            <Controller
              name="class"
              control={personFormControl}
              render={({ field: { onChange, value } }) => (
                <Select
                  onChange={(value: string | number) => {
                    onChange(value as string);
                  }}
                  options={classOptions}
                  value={classOptions.find((c) => c.value === value) || null}
                  placeholder="Évfolyam"
                  text="text-darkcherry"
                  bg="bg-application1"
                />
              )}
            />
            <Controller
              name="finishedSemester"
              control={personFormControl}
              render={({ field: { onChange, value } }) => (
                <Select
                  onChange={(value: string | number) => {
                    onChange(value as string);
                  }}
                  options={semesterOptions}
                  value={semesterOptions.find((c) => c.value === value) || null}
                  placeholder="Elvégzett félévek száma"
                  text="text-darkcherry"
                  bg="bg-application1"
                />
              )}
            />
            <Controller
              name="email"
              control={personFormControl}
              render={({ field }) => (
                <input
                  {...field}
                  autoComplete="off"
                  disabled={!!defaultValues}
                  type="text"
                  className={classNames(
                    inputClasses,
                    "bg-application1 text-darkcherry placeholder:text-darkcherry"
                  )}
                  placeholder="E-mail cím"
                />
              )}
            />
            <Controller
              name="mobileNumber"
              control={personFormControl}
              render={({ field }) => (
                <input
                  {...field}
                  autoComplete="off"
                  type="text"
                  className={classNames(
                    inputClasses,
                    "bg-application1 text-darkcherry placeholder:text-darkcherry"
                  )}
                  placeholder="Telefonszám"
                />
              )}
            />
            <Controller
              name="idPhoto"
              control={personFormControl}
              render={({ field: { onChange, value } }) => {
                return (
                  <label>
                    <div
                      className={classNames(
                        inputClasses,
                        "flex cursor-pointer items-center bg-application1 pl-4 text-darkcherry  placeholder:text-darkcherry "
                      )}
                    >
                      <div className="overflow-hidden truncate opacity-80">
                        {value && typeof value === "object"
                          ? value.name
                          : typeof value === "string"
                          ? value
                          : "Ellenőrző kép"}
                      </div>
                    </div>
                    <input
                      type="file"
                      autoComplete="off"
                      className="hidden"
                      onChange={(e) =>
                        onChange(e.target.files ? e.target.files[0] : null)
                      }
                    />
                  </label>
                );
              }}
            />
            {defaultValues && (
              <Controller
                name="voucher"
                control={personFormControl}
                render={({ field: { onChange, value } }) => {
                  return (
                    <label>
                      <div
                        className={classNames(
                          inputClasses,
                          "flex cursor-pointer items-center bg-application1 pl-4 text-darkcherry  placeholder:text-darkcherry "
                        )}
                      >
                        <div className="overflow-hidden truncate opacity-80">
                          {value && typeof value === "object"
                            ? value.name
                            : typeof value === "string"
                            ? value
                            : "Kifizetési bizonylat"}
                        </div>
                      </div>
                      <input
                        type="file"
                        autoComplete="off"
                        className="hidden"
                        onChange={(e) =>
                          onChange(e.target.files ? e.target.files[0] : null)
                        }
                      />
                    </label>
                  );
                }}
              />
            )}
          </div>
        </div>
        {fields.map((project, index) => (
          <Disclosure defaultOpen={index === 0} key={project.id}>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full items-center rounded-xl bg-application3 py-2 px-4">
                  <p className="flex-1 text-start text-lg text-darkcherry">
                    {index + 1}. Dolgozat adatai
                  </p>
                  {fields.length > 1 && (
                    <TrashIcon
                      className="mr-6 h-7 w-7 text-darkcherry"
                      onClick={(e) => {
                        e.preventDefault();
                        remove(index);
                      }}
                    />
                  )}

                  {!open ? (
                    <ChevronDownIcon
                      className="h-7 w-7 text-darkcherry"
                      aria-hidden="true"
                    />
                  ) : (
                    <ChevronUpIcon
                      className="h-7 w-7 text-darkcherry"
                      aria-hidden="true"
                    />
                  )}
                </Disclosure.Button>
                <Transition
                  enter="transition duration-150 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-150 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel>
                    <div className="h-fit w-full space-y-4 bg-lightGray px-2 py-6 md:w-[700px] md:p-6 ">
                      <p className="text-3xl text-darkcherry">
                        {index + 1}. Dolgozat:
                      </p>
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:pl-2">
                        <Controller
                          name={`projects.${index}.title`}
                          control={projectsControl}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="text"
                              autoComplete="off"
                              className={classNames(
                                inputClasses,
                                "bg-application3 text-darkcherry placeholder:text-darkcherry"
                              )}
                              placeholder="Cím"
                            />
                          )}
                        />
                        <Controller
                          name={`projects.${index}.extract`}
                          control={projectsControl}
                          render={({ field: { onChange, value } }) => {
                            return (
                              <label>
                                <div
                                  className={classNames(
                                    inputClasses,
                                    "flex cursor-pointer items-center  bg-application3 pl-4 text-darkcherry"
                                  )}
                                >
                                  <div className="overflow-hidden truncate opacity-80">
                                    {value && typeof value === "object"
                                      ? value.name
                                      : typeof value === "string"
                                      ? value
                                      : "Kivonat"}
                                  </div>
                                </div>
                                <input
                                  type="file"
                                  autoComplete="off"
                                  className="hidden"
                                  onChange={(e) =>
                                    onChange(
                                      e.target.files ? e.target.files[0] : null
                                    )
                                  }
                                />
                              </label>
                            );
                          }}
                        />
                        <Controller
                          name={`projects.${index}.section`}
                          control={projectsControl}
                          render={({ field: { onChange, value } }) => {
                            const sectionsOptions = sections.map((s) => ({
                              name: s.name,
                              value: s._id,
                            }));
                            return (
                              <Select
                                onChange={(value: string | number) => {
                                  onChange(value as string);
                                }}
                                options={sectionsOptions}
                                value={
                                  sectionsOptions.find(
                                    (s) => s.value === value
                                  ) || null
                                }
                                placeholder="Szekció"
                                text="text-darkcherry"
                                bg="bg-application3"
                              />
                            );
                          }}
                        />
                        {defaultValues && (
                          <Controller
                            name={`projects.${index}.annex`}
                            control={projectsControl}
                            render={({ field: { onChange, value } }) => {
                              return (
                                <label>
                                  <div
                                    className={classNames(
                                      inputClasses,
                                      "flex cursor-pointer items-center  bg-application3 pl-4 text-darkcherry"
                                    )}
                                  >
                                    <div className="overflow-hidden truncate opacity-80">
                                      {value && typeof value === "object"
                                        ? value.name
                                        : typeof value === "string"
                                        ? value
                                        : "Melléklet"}
                                    </div>
                                  </div>
                                  <input
                                    type="file"
                                    autoComplete="off"
                                    className="hidden"
                                    onChange={(e) =>
                                      onChange(
                                        e.target.files
                                          ? e.target.files[0]
                                          : null
                                      )
                                    }
                                  />
                                </label>
                              );
                            }}
                          />
                        )}
                        {defaultValues && (
                          <Controller
                            name={`projects.${index}.declaration`}
                            control={projectsControl}
                            render={({ field: { onChange, value } }) => {
                              return (
                                <label>
                                  <div
                                    className={classNames(
                                      inputClasses,
                                      "flex cursor-pointer items-center  bg-application3 pl-4 text-darkcherry"
                                    )}
                                  >
                                    <div className="overflow-hidden truncate opacity-80">
                                      {value && typeof value === "object"
                                        ? value.name
                                        : typeof value === "string"
                                        ? value
                                        : "Adatbankos nyilatkozat"}
                                    </div>
                                  </div>
                                  <input
                                    type="file"
                                    autoComplete="off"
                                    className="hidden"
                                    onChange={(e) =>
                                      onChange(
                                        e.target.files
                                          ? e.target.files[0]
                                          : null
                                      )
                                    }
                                  />
                                </label>
                              );
                            }}
                          />
                        )}
                        {defaultValues && (
                          <ContributionField
                            index={index}
                            control={projectsControl}
                            sections={sections}
                          />
                        )}
                      </div>
                    </div>
                    {project.advisors.map((_advisor, ai) => (
                      <React.Fragment key={"companion" + ai}>
                        <Disclosure defaultOpen>
                          {({ open }) => (
                            <>
                              <Disclosure.Button className="my-4 flex w-full items-center rounded-xl bg-application1 py-2 px-4 ">
                                <p className="flex-1 text-start text-lg text-darkcherry">
                                  {ai + 1}. Témavezető adatai:
                                </p>
                                {ai !== 0 && (
                                  <TrashIcon
                                    className="mr-6 h-7 w-7 text-darkcherry"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      const projectValues = projectGetValues(
                                        `projects.${index}`
                                      );
                                      const projectAdvisors =
                                        projectValues.advisors || [];
                                      projectAdvisors.splice(ai, 1);
                                      update(index, {
                                        ...projectValues,
                                        advisors: projectAdvisors,
                                      });
                                    }}
                                  />
                                )}

                                {!open ? (
                                  <ChevronDownIcon
                                    className="h-7 w-7 text-darkcherry"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <ChevronUpIcon
                                    className="h-7 w-7 text-darkcherry"
                                    aria-hidden="true"
                                  />
                                )}
                              </Disclosure.Button>
                              <Transition
                                enter="transition duration-150 ease-out"
                                enterFrom="transform scale-95 opacity-0"
                                enterTo="transform scale-100 opacity-100"
                                leave="transition duration-150 ease-out"
                                leaveFrom="transform scale-100 opacity-100"
                                leaveTo="transform scale-95 opacity-0"
                              >
                                <Disclosure.Panel>
                                  <div className="h-fit w-full space-y-4 bg-lightGray px-2 py-6 md:w-[700px] md:p-6 ">
                                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:pl-2">
                                      <Controller
                                        name={`projects.${index}.advisors.${ai}.name`}
                                        control={projectsControl}
                                        render={({ field }) => (
                                          <input
                                            {...field}
                                            autoComplete="off"
                                            type="text"
                                            className={classNames(
                                              inputClasses,
                                              "bg-application2 text-white placeholder:text-white"
                                            )}
                                            placeholder="Név"
                                          />
                                        )}
                                      />
                                      <UniversityField
                                        fieldName={`projects.${index}.advisors.${ai}.university`}
                                        control={projectsControl}
                                        text="text-white"
                                        bg="bg-application2"
                                        setAdditional={(
                                          value: string | undefined
                                        ) =>
                                          projectSetValue(
                                            `projects.${index}.advisors.${ai}.universityOther`,
                                            value
                                          )
                                        }
                                        universities={universities}
                                      />
                                      <OtherField
                                        control={projectsControl}
                                        text="text-white"
                                        bg="bg-application2"
                                        dependencyName={`projects.${index}.advisors.${ai}.university`}
                                        fieldName={`projects.${index}.advisors.${ai}.universityOther`}
                                        placeholder="Egyéb egyetem"
                                      />
                                      <FacultyField
                                        fieldName={`projects.${index}.advisors.${ai}.faculty`}
                                        dependencyName={`projects.${index}.advisors.${ai}.university`}
                                        control={projectsControl}
                                        text="text-white"
                                        bg="bg-application2"
                                        setAdditional={(
                                          value: string | undefined
                                        ) =>
                                          projectSetValue(
                                            `projects.${index}.advisors.${ai}.facultyOther`,
                                            value
                                          )
                                        }
                                        universities={universities}
                                      />
                                      <OtherField
                                        control={projectsControl}
                                        text="text-white"
                                        bg="bg-application2"
                                        dependencyName={`projects.${index}.advisors.${ai}.faculty`}
                                        fieldName={`projects.${index}.advisors.${ai}.facultyOther`}
                                        placeholder="Egyéb kar"
                                      />
                                      <SubjectField
                                        fieldName={`projects.${index}.advisors.${ai}.subject`}
                                        dependencyName={`projects.${index}.advisors.${ai}.faculty`}
                                        control={projectsControl}
                                        text="text-white"
                                        bg="bg-application2"
                                        setAdditional={(
                                          value: string | undefined
                                        ) =>
                                          projectSetValue(
                                            `projects.${index}.advisors.${ai}.subjectOther`,
                                            value
                                          )
                                        }
                                        faculties={faculties}
                                      />
                                      <OtherField
                                        control={projectsControl}
                                        text="text-white"
                                        bg="bg-application2"
                                        dependencyName={`projects.${index}.advisors.${ai}.subject`}
                                        fieldName={`projects.${index}.advisors.${ai}.subjectOther`}
                                        placeholder="Egyéb szak"
                                      />
                                      <Controller
                                        name={`projects.${index}.advisors.${ai}.title`}
                                        control={projectsControl}
                                        render={({
                                          field: { onChange, value },
                                        }) => (
                                          <Select
                                            onChange={(
                                              value: string | number
                                            ) => {
                                              onChange(value as string);
                                            }}
                                            options={titleOptions}
                                            value={
                                              titleOptions.find(
                                                (t) => t.value === value
                                              ) || null
                                            }
                                            placeholder="Titulus"
                                            text="text-white"
                                            bg="bg-application2"
                                          />
                                        )}
                                      />
                                      <Controller
                                        name={`projects.${index}.advisors.${ai}.email`}
                                        control={projectsControl}
                                        render={({ field }) => (
                                          <input
                                            {...field}
                                            autoComplete="off"
                                            type="text"
                                            className={classNames(
                                              inputClasses,
                                              "bg-application2 text-white placeholder:text-white"
                                            )}
                                            placeholder="E-mail cím"
                                          />
                                        )}
                                      />
                                      <Controller
                                        name={`projects.${index}.advisors.${ai}.mobileNumber`}
                                        control={projectsControl}
                                        render={({ field }) => (
                                          <input
                                            {...field}
                                            autoComplete="off"
                                            type="text"
                                            className={classNames(
                                              inputClasses,
                                              "bg-application2 text-white placeholder:text-white"
                                            )}
                                            placeholder="Telefonszám"
                                          />
                                        )}
                                      />
                                      <Controller
                                        name={`projects.${index}.advisors.${ai}.certificate`}
                                        control={projectsControl}
                                        render={({
                                          field: { onChange, value },
                                        }) => {
                                          return (
                                            <label>
                                              <div
                                                className={classNames(
                                                  inputClasses,
                                                  "flex cursor-pointer items-center bg-application2 pl-4 text-white"
                                                )}
                                              >
                                                <div className="overflow-hidden truncate opacity-80">
                                                  {value &&
                                                  typeof value === "object"
                                                    ? value.name
                                                    : typeof value === "string"
                                                    ? value
                                                    : "Igazolás"}
                                                </div>
                                              </div>
                                              <input
                                                type="file"
                                                autoComplete="off"
                                                className="hidden"
                                                onChange={(e) =>
                                                  onChange(
                                                    e.target.files
                                                      ? e.target.files[0]
                                                      : null
                                                  )
                                                }
                                              />
                                            </label>
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                </Disclosure.Panel>
                              </Transition>
                            </>
                          )}
                        </Disclosure>
                      </React.Fragment>
                    ))}
                    <AddAdvisorButton index={index} />
                    {(project.companions || []).map((_companion, ci) => (
                      <React.Fragment key={"companion" + ci}>
                        <Disclosure defaultOpen>
                          {({ open }) => (
                            <>
                              <Disclosure.Button className="my-4 flex w-full items-center rounded-xl bg-application1 py-2 px-4 ">
                                <p className="flex-1 text-start text-lg text-darkcherry">
                                  {ci + 1}. Társszerző adatok:
                                </p>
                                <TrashIcon
                                  className="mr-6 h-7 w-7 text-darkcherry"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const projectValues = projectGetValues(
                                      `projects.${index}`
                                    );
                                    const projectCompanions =
                                      projectValues.companions || [];
                                    projectCompanions.splice(ci, 1);
                                    update(index, {
                                      ...projectValues,
                                      companions: projectCompanions,
                                    });
                                  }}
                                />

                                {!open ? (
                                  <ChevronDownIcon
                                    className="h-7 w-7 text-darkcherry"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <ChevronUpIcon
                                    className="h-7 w-7 text-darkcherry"
                                    aria-hidden="true"
                                  />
                                )}
                              </Disclosure.Button>
                              <Transition
                                enter="transition duration-150 ease-out"
                                enterFrom="transform scale-95 opacity-0"
                                enterTo="transform scale-100 opacity-100"
                                leave="transition duration-150 ease-out"
                                leaveFrom="transform scale-100 opacity-100"
                                leaveTo="transform scale-95 opacity-0"
                              >
                                <Disclosure.Panel>
                                  <div className="h-fit w-full space-y-4 bg-lightGray px-2 py-6 md:w-[700px] md:p-6 ">
                                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:pl-2">
                                      <Controller
                                        name={`projects.${index}.companions.${ci}.name`}
                                        control={projectsControl}
                                        render={({ field }) => (
                                          <input
                                            {...field}
                                            autoComplete="off"
                                            type="text"
                                            className={classNames(
                                              inputClasses,
                                              "bg-application1 text-darkcherry placeholder:text-darkcherry"
                                            )}
                                            placeholder="Név"
                                          />
                                        )}
                                      />
                                      <Controller
                                        name={`projects.${index}.companions.${ci}.idNumber`}
                                        control={projectsControl}
                                        render={({ field }) => (
                                          <input
                                            {...field}
                                            autoComplete="off"
                                            type="text"
                                            className={classNames(
                                              inputClasses,
                                              "bg-application1 text-darkcherry placeholder:text-darkcherry"
                                            )}
                                            placeholder="Ellenőrző száma"
                                          />
                                        )}
                                      />
                                      <UniversityField
                                        control={projectsControl}
                                        fieldName={`projects.${index}.companions.${ci}.university`}
                                        text="text-darkcherry"
                                        bg="bg-application1"
                                        setAdditional={(
                                          value: string | undefined
                                        ) => {
                                          projectSetValue(
                                            `projects.${index}.companions.${ci}.universityOther`,
                                            value
                                          );
                                        }}
                                        universities={universities}
                                      />
                                      <OtherField
                                        control={projectsControl}
                                        text="text-darkcherry"
                                        bg="bg-application1"
                                        fieldName={`projects.${index}.companions.${ci}.universityOther`}
                                        dependencyName={`projects.${index}.companions.${ci}.university`}
                                        placeholder="Egyéb egyetem"
                                      />
                                      <FacultyField
                                        control={projectsControl}
                                        fieldName={`projects.${index}.companions.${ci}.faculty`}
                                        dependencyName={`projects.${index}.companions.${ci}.university`}
                                        text="text-darkcherry"
                                        bg="bg-application1"
                                        setAdditional={(
                                          value: string | undefined
                                        ) =>
                                          projectSetValue(
                                            `projects.${index}.companions.${ci}.facultyOther`,
                                            value
                                          )
                                        }
                                        universities={universities}
                                      />
                                      <OtherField
                                        control={projectsControl}
                                        text="text-darkcherry"
                                        bg="bg-application1"
                                        dependencyName={`projects.${index}.companions.${ci}.faculty`}
                                        fieldName={`projects.${index}.companions.${ci}.facultyOther`}
                                        placeholder="Egyéb kar"
                                      />
                                      <SubjectField
                                        fieldName={`projects.${index}.companions.${ci}.subject`}
                                        dependencyName={`projects.${index}.companions.${ci}.faculty`}
                                        control={projectsControl}
                                        text="text-darkcherry"
                                        bg="bg-application1"
                                        setAdditional={(
                                          value: string | undefined
                                        ) =>
                                          projectSetValue(
                                            `projects.${index}.companions.${ci}.subjectOther`,
                                            value
                                          )
                                        }
                                        faculties={faculties}
                                      />
                                      <OtherField
                                        control={projectsControl}
                                        text="text-darkcherry"
                                        bg="bg-application1"
                                        dependencyName={`projects.${index}.companions.${ci}.subject`}
                                        fieldName={`projects.${index}.companions.${ci}.subjectOther`}
                                        placeholder="Egyéb szak"
                                      />
                                      <Controller
                                        name={`projects.${index}.companions.${ci}.degree`}
                                        control={projectsControl}
                                        render={({
                                          field: { onChange, value },
                                        }) => (
                                          <Select
                                            onChange={(
                                              value: string | number
                                            ) => {
                                              onChange(value as string);
                                            }}
                                            options={degreeOptions}
                                            value={
                                              degreeOptions.find(
                                                (d) => d.value === value
                                              ) || null
                                            }
                                            placeholder="Képzési szint"
                                            text="text-darkcherry"
                                            bg="bg-application1"
                                          />
                                        )}
                                      />
                                      <Controller
                                        name={`projects.${index}.companions.${ci}.class`}
                                        control={projectsControl}
                                        render={({
                                          field: { onChange, value },
                                        }) => (
                                          <Select
                                            onChange={(
                                              value: string | number
                                            ) => {
                                              onChange(value as string);
                                            }}
                                            options={classOptions}
                                            value={
                                              classOptions.find(
                                                (c) => c.value === value
                                              ) || null
                                            }
                                            placeholder="Évfolyam"
                                            text="text-darkcherry"
                                            bg="bg-application1"
                                          />
                                        )}
                                      />
                                      <Controller
                                        name={`projects.${index}.companions.${ci}.finishedSemester`}
                                        control={projectsControl}
                                        render={({
                                          field: { onChange, value },
                                        }) => (
                                          <Select
                                            onChange={(
                                              value: string | number
                                            ) => {
                                              onChange(value as string);
                                            }}
                                            options={semesterOptions}
                                            value={
                                              semesterOptions.find(
                                                (c) => c.value === value
                                              ) || null
                                            }
                                            placeholder="Elvégzett félévek száma"
                                            text="text-darkcherry"
                                            bg="bg-application1"
                                          />
                                        )}
                                      />
                                      <Controller
                                        name={`projects.${index}.companions.${ci}.email`}
                                        control={projectsControl}
                                        render={({ field }) => (
                                          <input
                                            {...field}
                                            autoComplete="off"
                                            disabled={!!defaultValues}
                                            type="text"
                                            className={classNames(
                                              inputClasses,
                                              "bg-application1 text-darkcherry placeholder:text-darkcherry"
                                            )}
                                            placeholder="E-mail cím"
                                          />
                                        )}
                                      />
                                      <Controller
                                        name={`projects.${index}.companions.${ci}.mobileNumber`}
                                        control={projectsControl}
                                        render={({ field }) => (
                                          <input
                                            {...field}
                                            autoComplete="off"
                                            type="text"
                                            className={classNames(
                                              inputClasses,
                                              "bg-application1 text-darkcherry placeholder:text-darkcherry"
                                            )}
                                            placeholder="Telefonszám"
                                          />
                                        )}
                                      />
                                      <Controller
                                        name={`projects.${index}.companions.${ci}.idPhoto`}
                                        control={projectsControl}
                                        render={({
                                          field: { onChange, value },
                                        }) => {
                                          return (
                                            <label>
                                              <div
                                                className={classNames(
                                                  inputClasses,
                                                  "flex cursor-pointer items-center bg-application1 pl-4 text-darkcherry  placeholder:text-darkcherry "
                                                )}
                                              >
                                                <div className="overflow-hidden truncate opacity-80">
                                                  {value &&
                                                  typeof value === "object"
                                                    ? value.name
                                                    : typeof value === "string"
                                                    ? value
                                                    : "Ellenőrző kép"}
                                                </div>
                                              </div>
                                              <input
                                                type="file"
                                                autoComplete="off"
                                                className="hidden"
                                                onChange={(e) =>
                                                  onChange(
                                                    e.target.files
                                                      ? e.target.files[0]
                                                      : null
                                                  )
                                                }
                                              />
                                            </label>
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                </Disclosure.Panel>
                              </Transition>
                            </>
                          )}
                        </Disclosure>
                      </React.Fragment>
                    ))}
                    <AddCompanionButton index={index} />
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        ))}

        <button
          className="rounded-xl bg-gray-900 py-2 px-4 text-white md:mr-6"
          onClick={() =>
            append({
              advisors: [
                {
                  name: "",
                  email: "",
                  mobileNumber: "",
                  title: "",
                  university: "",
                  faculty: "",
                  subject: "",
                  universityOther: undefined,
                  facultyOther: undefined,
                  subjectOther: undefined,
                  certificate: null,
                },
              ],
              title: "",
              extract: null,
              section: "",
              contribution: null,
              annex: null,
              declaration: null,
            })
          }
        >
          <p>Új dolgozat hozzáadása</p>
        </button>
        <button
          className="float-right flex h-10 items-center rounded-xl bg-gray-900 py-2 px-4 font-bold text-white"
          onClick={() => onSubmit()}
        >
          {loading && (
            <svg
              className="mr-2 h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}

          <p>Mentés</p>
        </button>
      </div>
      <Snackbar message={notiMessage} open={notiMessage !== ""} />
      <Transition.Root show={confirmationMessage !== ""} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setConfirmationMessage("")}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="relative flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative flex transform flex-col items-center justify-center space-y-4 rounded-lg bg-white p-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="flex items-center">
                    <CheckBadgeIcon className="h-12 w-12 text-green-300" />
                    <p className="text-xl">Sikeres jelentkezés</p>
                  </div>
                  <div className="flex">
                    Jelszó:{" "}
                    <p className="pl-5 font-black">{confirmationMessage}</p>
                  </div>
                  <p className="pl-5 text-center text-sm">
                    Ezt jegyezze le, a kesőbbiekben ennek a segítségével tudja
                    majd a feltöltőtt adatokat kiegészíteni.
                  </p>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default ApplicationForm;
