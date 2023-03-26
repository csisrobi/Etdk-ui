import { Dialog, Disclosure, Transition } from "@headlessui/react";
import {
  CheckBadgeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { fetcher } from "@lib/queries";
import { getClient } from "@lib/sanity";
import RichText from "@utils/RichText";
import classNames from "classnames";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import React, { Fragment, useCallback, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import Select from "src/components/FormComponents/Select";
import Snackbar from "src/components/UtilityComponents/Snackbar";
import type {
  FacultySanity,
  SanityRichText,
  SectionsSanity,
  UniversitiesSanity,
} from "types";
import { ContributionField } from "./ContributionField";
import { FacultyField } from "./FacultyField";
import { OtherField } from "./OtherField";
import { SubjectField } from "./SubjectField";
import { UniversityField } from "./UniversityField";

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
  universityOther?: string;
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
  gdpr,
}: {
  universities: UniversitiesSanity[];
  faculties: FacultySanity[];
  sections: SectionsSanity[];
  defaultValues?: {
    personData: PersonInputs;
    projectsData: ProjectInputs[];
  };
  gdpr?: SanityRichText[];
}) => {
  const router = useRouter();
  const [notiMessage, setNotiMessage] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [gdprDialog, setGdprDialog] = useState(false);
  const [gdprApproved, setGdprApproved] = useState(false);

  const {
    control: personFormControl,
    getValues: personGetValues,
    setValue: personSetValue,
    setError: personSetError,
    clearErrors: personClearErrors,
    formState: { errors: personErrors },
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
    formState: { errors: projectErrors },
    clearErrors: projectCleanErrors,
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
                  universityOther: undefined,
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
    const certificateData =
      advisorData.certificate && typeof advisorData.certificate === "object"
        ? await getClient().assets.upload("file", advisorData.certificate, {
            filename: advisorData.certificate.name,
          })
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
      title: advisorData.title,
      email: advisorData.email,
      mobileNumber: advisorData.mobileNumber,
      ...(certificateData && {
        certificate: {
          _type: "file",
          asset: {
            _ref: certificateData._id,
            _type: "reference",
          },
        },
      }),
    };
  }, []);

  const mapCompanionsData = useCallback(
    async (participantData: PersonInputs) => {
      const idPhotoData =
        participantData.idPhoto && typeof participantData.idPhoto === "object"
          ? await getClient().assets.upload("file", participantData.idPhoto, {
              filename: participantData.idPhoto.name,
            })
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
              _ref: idPhotoData._id,
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
      if (Array.isArray(checkEmail) && !checkEmail.length) {
        const password = Math.random().toString(36).slice(-8);
        const idPhotoData =
          participantData.idPhoto && typeof participantData.idPhoto === "object"
            ? await getClient().assets.upload("file", participantData.idPhoto, {
                filename: participantData.idPhoto.name,
              })
            : null;
        Promise.all(
          data.projects.map(async (project, index) => {
            if (project.extract && typeof project.extract === "object") {
              const extractData =
                project.extract && typeof project.extract === "object"
                  ? await getClient().assets.upload("file", project.extract, {
                      filename: project.extract.name,
                    })
                  : null;
              const advisors = await Promise.all(
                project.advisors.map(
                  async (advisor) => await mapAdvisorData(advisor)
                )
              ).then((advisors) => advisors);
              const companions = await Promise.all(
                (project.companions || []).map(
                  async (companion) => await mapCompanionsData(companion)
                )
              ).then((companions) => companions);
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
                          _ref: idPhotoData._id,
                          _type: "reference",
                        },
                      },
                    }),
                    advisors: advisors,
                    companions: companions,
                    title: project.title,
                    ...(extractData && {
                      extract: {
                        _type: "file",
                        asset: {
                          _ref: extractData._id,
                          _type: "reference",
                        },
                      },
                    }),
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
              ).then((r) => {
                if (r.hasOwnProperty("error")) {
                  throw Error(
                    `${index + 1} projekt feltöltése közben hiba történt`
                  );
                }
              });
            }
          })
        )
          .then(() => {
            setLoading(false);
            setConfirmationMessage(password);
          })
          .catch((e) => {
            setNotiMessage(e.message);
            setLoading(false);
            setTimeout(() => setNotiMessage(""), 3000);
          });
      } else {
        setNotiMessage("Ezen az emailen már regisztrálva van");
        setLoading(false);
        setTimeout(() => setNotiMessage(""), 3000);
      }
    });
  }, [handleSubmit, personGetValues, mapAdvisorData, mapCompanionsData]);

  const submitData = () => {
    const participantData = personGetValues();
    let error = false;
    Object.entries(participantData).forEach((data) => {
      if (!data[1]) {
        if (
          (data[0] === "universityOther" &&
            participantData.university !== "additional") ||
          (data[0] === "facultyOther" &&
            participantData.faculty !== "additional") ||
          (data[0] === "subjectOther" &&
            participantData.subject !== "additional") ||
          data[0] === "voucher"
        ) {
          return;
        }
        error = true;
        personSetError(data[0] as keyof PersonInputs, { type: "required" });
      } else {
        if (data[0] === "email") {
          const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i;
          if (!regex.test(data[1] as string)) {
            error = true;
            personSetError(data[0] as keyof PersonInputs, { type: "pattern" });
          }
        }
        if (data[0] === "mobileNumber") {
          const regex = /^(\+\d{1,2}\s?)?\(?\d{4}\)?[\s.-]?\d{3}[\s.-]?\d{3}$/;
          if (!regex.test(data[1] as string)) {
            error = true;
            personSetError(data[0] as keyof PersonInputs, { type: "pattern" });
          }
        }
      }
    });
    if (!error) {
      personClearErrors();
      setConfirmDialog(true);
    }
  };

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
                    universityOther: undefined,
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
    <div className="flex min-h-[100vh] min-w-full flex-col items-center bg-white pb-40 pt-[66px]">
      <div className="w-full space-y-4 md:w-fit">
        <div className="h-fit w-full space-y-4 bg-lightGray px-2 py-6 md:p-6 ">
          <p className="text-3xl text-darkcherry">Személyes adatok:</p>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:pl-2">
            <Controller
              name="name"
              control={personFormControl}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <input
                  value={value}
                  onChange={(e) => {
                    personClearErrors("name");
                    onChange(e.target.value);
                  }}
                  autoComplete="off"
                  type="text"
                  className={classNames(
                    inputClasses,
                    error ? "ring ring-red-700" : "",
                    "bg-application1 text-darkcherry placeholder:text-darkcherry"
                  )}
                  placeholder="Név"
                />
              )}
            />
            <Controller
              name="idNumber"
              control={personFormControl}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <input
                  value={value}
                  onChange={(e) => {
                    personClearErrors("idNumber");
                    onChange(e.target.value);
                  }}
                  autoComplete="off"
                  type="text"
                  className={classNames(
                    inputClasses,
                    error ? "ring ring-red-700" : "",
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
                personSetValue("faculty", "");
                personSetValue("universityOther", value);
              }}
              universities={universities}
              clearError={() => personClearErrors("university")}
            />
            <OtherField
              control={personFormControl}
              text="text-darkcherry"
              bg="bg-application1"
              dependencyName="university"
              fieldName="universityOther"
              placeholder="Egyéb egyetem"
              clearError={() => personClearErrors("universityOther")}
            />
            <FacultyField
              control={personFormControl}
              fieldName="faculty"
              dependencyName="university"
              text="text-darkcherry"
              bg="bg-application1"
              setAdditional={(value: string | undefined) => {
                personSetValue("subject", "");
                personSetValue("facultyOther", value);
              }}
              universities={universities}
              clearError={() => personClearErrors("faculty")}
            />
            <OtherField
              control={personFormControl}
              text="text-darkcherry"
              bg="bg-application1"
              dependencyName="faculty"
              fieldName="facultyOther"
              placeholder="Egyéb kar"
              clearError={() => personClearErrors("facultyOther")}
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
              clearError={() => personClearErrors("subject")}
            />
            <OtherField
              control={personFormControl}
              text="text-darkcherry"
              bg="bg-application1"
              dependencyName="subject"
              fieldName="subjectOther"
              placeholder="Egyéb szak"
              clearError={() => personClearErrors("subjectOther")}
            />
            <Controller
              name="degree"
              control={personFormControl}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Select
                  onChange={(value: string | number) => {
                    personClearErrors("degree");
                    onChange(value as string);
                  }}
                  options={degreeOptions}
                  value={degreeOptions.find((d) => d.value === value) || null}
                  placeholder="Képzési szint"
                  text="text-darkcherry"
                  bg="bg-application1"
                  error={!!error}
                />
              )}
            />
            <Controller
              name="class"
              control={personFormControl}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Select
                  onChange={(value: string | number) => {
                    personClearErrors("class");
                    onChange(value as string);
                  }}
                  options={classOptions}
                  value={classOptions.find((c) => c.value === value) || null}
                  placeholder="Évfolyam"
                  text="text-darkcherry"
                  bg="bg-application1"
                  error={!!error}
                />
              )}
            />
            <Controller
              name="finishedSemester"
              control={personFormControl}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Select
                  onChange={(value: string | number) => {
                    personClearErrors("finishedSemester");
                    onChange(value as string);
                  }}
                  options={semesterOptions}
                  value={semesterOptions.find((c) => c.value === value) || null}
                  placeholder="Elvégzett félévek száma"
                  text="text-darkcherry"
                  bg="bg-application1"
                  error={!!error}
                />
              )}
            />
            <Controller
              name="email"
              control={personFormControl}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <input
                  value={value}
                  onChange={(e) => {
                    personClearErrors("email");
                    onChange(e.target.value);
                  }}
                  autoComplete="off"
                  disabled={!!defaultValues}
                  type="text"
                  className={classNames(
                    inputClasses,
                    error ? "ring ring-red-700" : "",
                    "bg-application1 text-darkcherry placeholder:text-darkcherry"
                  )}
                  placeholder="E-mail cím"
                />
              )}
            />
            <Controller
              name="mobileNumber"
              control={personFormControl}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <input
                  value={value}
                  onChange={(e) => {
                    personClearErrors("mobileNumber");
                    onChange(e.target.value);
                  }}
                  autoComplete="off"
                  type="text"
                  className={classNames(
                    inputClasses,
                    error ? "ring ring-red-700" : "",
                    "bg-application1 text-darkcherry placeholder:text-darkcherry"
                  )}
                  placeholder="Telefonszám"
                />
              )}
            />
            <Controller
              name="idPhoto"
              control={personFormControl}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => {
                return (
                  <label>
                    <div
                      className={classNames(
                        inputClasses,
                        error ? "ring ring-red-700" : "",
                        "flex cursor-pointer items-center bg-application1 pl-4  text-darkcherry placeholder:text-darkcherry"
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
                      onChange={(e) => {
                        personClearErrors("idPhoto");
                        onChange(e.target.files ? e.target.files[0] : null);
                      }}
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
                  unmount={false}
                >
                  <Disclosure.Panel
                    className="border-2 border-application3 p-2"
                    unmount={false}
                  >
                    <div className="h-fit w-full space-y-4 bg-lightGray px-2 py-6 md:w-[700px] md:p-6 ">
                      <p className="text-3xl text-darkcherry">
                        {index + 1}. Dolgozat:
                      </p>
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:pl-2">
                        <Controller
                          name={`projects.${index}.title`}
                          control={projectsControl}
                          rules={{ required: true }}
                          render={({ field, fieldState: { error } }) => (
                            <input
                              {...field}
                              type="text"
                              autoComplete="off"
                              className={classNames(
                                inputClasses,
                                error ? "ring ring-red-700" : "",
                                "bg-application3 text-darkcherry placeholder:text-darkcherry"
                              )}
                              placeholder="Cím"
                            />
                          )}
                        />
                        <Controller
                          name={`projects.${index}.extract`}
                          control={projectsControl}
                          rules={{
                            required: true,
                            validate: (value) => {
                              if (value && typeof value === "object") {
                                return value?.type === "application/pdf";
                              }
                              return true;
                            },
                          }}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => {
                            return (
                              <label>
                                <div
                                  className={classNames(
                                    inputClasses,
                                    error ? "ring ring-red-700" : "",
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
                                  accept="application/pdf"
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
                          rules={{ required: true }}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => {
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
                                error={!!error}
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
                        <Disclosure>
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
                                      projectCleanErrors(
                                        `projects.${index}.advisors.${ai}`
                                      );
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
                                unmount={false}
                              >
                                <Disclosure.Panel unmount={false}>
                                  <div className="h-fit w-full space-y-4 bg-lightGray px-2 py-6 md:w-[700px] md:p-6 ">
                                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:pl-2">
                                      <Controller
                                        name={`projects.${index}.advisors.${ai}.name`}
                                        control={projectsControl}
                                        rules={{ required: true }}
                                        render={({
                                          field,
                                          fieldState: { error },
                                        }) => (
                                          <input
                                            {...field}
                                            autoComplete="off"
                                            type="text"
                                            className={classNames(
                                              inputClasses,
                                              error ? "ring ring-red-700" : "",
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
                                        ) => {
                                          projectSetValue(
                                            `projects.${index}.advisors.${ai}.universityOther`,
                                            value
                                          );
                                        }}
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
                                      <Controller
                                        name={`projects.${index}.advisors.${ai}.title`}
                                        control={projectsControl}
                                        rules={{ required: true }}
                                        render={({
                                          field: { onChange, value },
                                          fieldState: { error },
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
                                            error={!!error}
                                          />
                                        )}
                                      />
                                      <Controller
                                        name={`projects.${index}.advisors.${ai}.email`}
                                        control={projectsControl}
                                        rules={{
                                          required: true,
                                          pattern: {
                                            value:
                                              /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Helytelen email",
                                          },
                                        }}
                                        render={({
                                          field,
                                          fieldState: { error },
                                        }) => (
                                          <input
                                            {...field}
                                            autoComplete="off"
                                            type="text"
                                            className={classNames(
                                              inputClasses,
                                              error ? "ring ring-red-700" : "",
                                              "bg-application2 text-white placeholder:text-white"
                                            )}
                                            placeholder="E-mail cím"
                                          />
                                        )}
                                      />
                                      <Controller
                                        name={`projects.${index}.advisors.${ai}.mobileNumber`}
                                        control={projectsControl}
                                        rules={{
                                          required: true,
                                          pattern: {
                                            value:
                                              /^(\+\d{1,2}\s?)?\(?\d{4}\)?[\s.-]?\d{3}[\s.-]?\d{3}$/,
                                            message: "Helytelen telefonszám",
                                          },
                                        }}
                                        render={({
                                          field,
                                          fieldState: { error },
                                        }) => (
                                          <input
                                            {...field}
                                            autoComplete="off"
                                            type="text"
                                            className={classNames(
                                              inputClasses,
                                              error ? "ring ring-red-700" : "",

                                              "bg-application2 text-white placeholder:text-white"
                                            )}
                                            placeholder="Telefonszám"
                                          />
                                        )}
                                      />
                                      <Controller
                                        name={`projects.${index}.advisors.${ai}.certificate`}
                                        control={projectsControl}
                                        rules={{
                                          required: true,
                                          validate: (value) => {
                                            if (
                                              value &&
                                              typeof value === "object"
                                            ) {
                                              return (
                                                value?.type ===
                                                "application/pdf"
                                              );
                                            }
                                            return true;
                                          },
                                        }}
                                        render={({
                                          field: { onChange, value },
                                          fieldState: { error },
                                        }) => {
                                          return (
                                            <label>
                                              <div
                                                className={classNames(
                                                  inputClasses,
                                                  error
                                                    ? "ring ring-red-700"
                                                    : "",
                                                  "flex cursor-pointer items-center bg-application2 pl-4 text-white"
                                                )}
                                              >
                                                <div className="overflow-hidden truncate opacity-80">
                                                  {value &&
                                                  typeof value === "object"
                                                    ? value.name
                                                    : typeof value === "string"
                                                    ? value
                                                    : "Témavezetői igazolás"}
                                                </div>
                                              </div>
                                              <input
                                                type="file"
                                                autoComplete="off"
                                                className="hidden"
                                                accept="application/pdf"
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
                    {(project.companions || []).map((_companion, ci) => (
                      <React.Fragment key={"companion" + ci}>
                        <Disclosure>
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
                                    projectCleanErrors(
                                      `projects.${index}.companions.${ci}`
                                    );
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
                                unmount={false}
                              >
                                <Disclosure.Panel unmount={false}>
                                  <div className="h-fit w-full space-y-4 bg-lightGray px-2 py-6 md:w-[700px] md:p-6 ">
                                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:pl-2">
                                      <Controller
                                        name={`projects.${index}.companions.${ci}.name`}
                                        rules={{ required: true }}
                                        control={projectsControl}
                                        render={({
                                          field,
                                          fieldState: { error },
                                        }) => (
                                          <input
                                            {...field}
                                            autoComplete="off"
                                            type="text"
                                            className={classNames(
                                              inputClasses,
                                              error ? "ring ring-red-700" : "",
                                              "bg-application1 text-darkcherry placeholder:text-darkcherry"
                                            )}
                                            placeholder="Név"
                                          />
                                        )}
                                      />
                                      <Controller
                                        name={`projects.${index}.companions.${ci}.idNumber`}
                                        rules={{ required: true }}
                                        control={projectsControl}
                                        render={({
                                          field,
                                          fieldState: { error },
                                        }) => (
                                          <input
                                            {...field}
                                            autoComplete="off"
                                            type="text"
                                            className={classNames(
                                              inputClasses,
                                              error ? "ring ring-red-700" : "",
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
                                        rules={{ required: true }}
                                        render={({
                                          field: { onChange, value },
                                          fieldState: { error },
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
                                            error={!!error}
                                          />
                                        )}
                                      />
                                      <Controller
                                        name={`projects.${index}.companions.${ci}.class`}
                                        rules={{ required: true }}
                                        control={projectsControl}
                                        render={({
                                          field: { onChange, value },
                                          fieldState: { error },
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
                                            error={!!error}
                                          />
                                        )}
                                      />
                                      <Controller
                                        name={`projects.${index}.companions.${ci}.finishedSemester`}
                                        rules={{ required: true }}
                                        control={projectsControl}
                                        render={({
                                          field: { onChange, value },
                                          fieldState: { error },
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
                                            error={!!error}
                                          />
                                        )}
                                      />
                                      <Controller
                                        name={`projects.${index}.companions.${ci}.email`}
                                        rules={{
                                          required: true,
                                          pattern: {
                                            value:
                                              /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Helytelen email",
                                          },
                                        }}
                                        control={projectsControl}
                                        render={({
                                          field,
                                          fieldState: { error },
                                        }) => (
                                          <input
                                            {...field}
                                            autoComplete="off"
                                            disabled={!!defaultValues}
                                            type="text"
                                            className={classNames(
                                              inputClasses,
                                              error ? "ring ring-red-700" : "",
                                              "bg-application1 text-darkcherry placeholder:text-darkcherry"
                                            )}
                                            placeholder="E-mail cím"
                                          />
                                        )}
                                      />
                                      <Controller
                                        name={`projects.${index}.companions.${ci}.mobileNumber`}
                                        rules={{
                                          required: true,
                                          pattern: {
                                            value:
                                              /^(\+\d{1,2}\s?)?\(?\d{4}\)?[\s.-]?\d{3}[\s.-]?\d{3}$/,
                                            message: "Helytelen telefonszám",
                                          },
                                        }}
                                        control={projectsControl}
                                        render={({
                                          field,
                                          fieldState: { error },
                                        }) => (
                                          <input
                                            {...field}
                                            autoComplete="off"
                                            type="text"
                                            className={classNames(
                                              inputClasses,
                                              error ? "ring ring-red-700" : "",
                                              "bg-application1 text-darkcherry placeholder:text-darkcherry"
                                            )}
                                            placeholder="Telefonszám"
                                          />
                                        )}
                                      />
                                      <Controller
                                        name={`projects.${index}.companions.${ci}.idPhoto`}
                                        rules={{ required: true }}
                                        control={projectsControl}
                                        render={({
                                          field: { onChange, value },
                                          fieldState: { error },
                                        }) => {
                                          return (
                                            <label>
                                              <div
                                                className={classNames(
                                                  inputClasses,
                                                  error
                                                    ? "ring ring-red-700"
                                                    : "",
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
                    <div className="mt-4 flex space-x-2">
                      <AddCompanionButton index={index} />
                      <AddAdvisorButton index={index} />
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        ))}

        <button
          className="ml-3 rounded-xl bg-gray-900 py-2 px-4 text-white md:mr-6"
          onClick={() =>
            append({
              advisors: [
                {
                  name: "",
                  email: "",
                  mobileNumber: "",
                  title: "",
                  university: "",
                  universityOther: undefined,
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
      </div>
      <div className="mt-16 mb-4 flex space-x-4 p-4 md:p-0">
        <input
          type="checkbox"
          value={`${gdprApproved}`}
          onChange={(e) => setGdprApproved(e.target.checked)}
          className="cursor-pointer"
        />
        <p>
          A <b>Mentés</b> gombra való kattintáshoz el kell fogadd a{" "}
          <b
            className="cursor-pointer text-blue-600"
            onClick={() => setGdprDialog(true)}
          >
            <u>feltételeket</u>
          </b>
          .
        </p>
      </div>
      <button
        className="flex h-10 w-40 items-center justify-center rounded-xl bg-lightcherry py-2 px-4 font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-200"
        onClick={() => submitData()}
        disabled={
          !!Object.keys(projectErrors).length ||
          !!Object.keys(personErrors).length ||
          !gdprApproved
        }
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
      {(!!Object.keys(projectErrors).length ||
        !!Object.keys(personErrors).length) && (
        <div className="mt-4">
          <p className="text-red-600">
            Ellenőrizd, hogy minden adat helyesen van bevezetve.
          </p>
        </div>
      )}

      <Snackbar message={notiMessage} open={notiMessage !== ""} />
      <Transition.Root show={confirmDialog} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setConfirmDialog(false)}
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
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <p className="text-center text-2xl text-black">
                        Biztos a kitöltött adatok helyességében?
                      </p>
                    </div>
                  </div>
                  <div className=" px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={() => setConfirmDialog(false)}
                    >
                      Bezárás
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => {
                        setConfirmDialog(false);
                        onSubmit();
                      }}
                    >
                      Elfogadás
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      {gdpr && (
        <Transition.Root show={gdprDialog} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setGdprDialog(false)}
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
                    <div className="prose max-w-none">
                      <RichText blocks={gdpr} />
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )}

      <Transition.Root show={confirmationMessage !== ""} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setConfirmationMessage("");
            router.push("/");
          }}
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
                  <div className="flex flex-col items-center">
                    <div className="flex items-center">
                      <CheckBadgeIcon className="h-12 w-12 text-green-300" />
                      <p className="text-xl">Sikeres jelentkezés</p>
                    </div>
                    <div className="flex">
                      Jelszó:
                      <p className="pl-5 font-black">{confirmationMessage}</p>
                    </div>
                    <p className="pl-5 text-center text-sm">
                      Ezt jegyezd le, a későbbiekben ennek a segítségével tudod
                      majd a feltöltőtt adatokat kiegészíteni.
                    </p>
                  </div>
                  <div className="flex w-full justify-end">
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => {
                        setConfirmationMessage("");
                        router.push("/");
                      }}
                    >
                      Bezárás
                    </button>
                  </div>
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
