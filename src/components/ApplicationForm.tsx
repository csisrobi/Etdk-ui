import { checkifUniqueEmail } from "@lib/queries";
import { getClient } from "@lib/sanity";
import {
  Control,
  Controller,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import Select from "src/components/FormComponents/Select";
import Snackbar from "src/components/UtilityComponents/Snackbar";
import { useState } from "react";
import type { UniversitiesSanity, FacultySanity, SectionsSanity } from "types";
import classNames from "classnames";
import React from "react";

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

export type DefaultInputs = {
  name: string;
  email: string;
  mobileNumber: string;
  birthDate: string;
  socialNumber: string;
  degree: string;
  class: string;
  university: string;
  faculty: string;
  subject: string;
};

export type ArrayInputs = {
  advisorName: string;
  advisorEmail: string;
  advisorMobileNumber: string;
  advisorTitle: string;
  advisorUniversity: string;
  advisorFaculty: string;
  advisorSubject: string;
  advisorCertificate: File | null;

  title: string;
  extract: File | null;
  section: string;
};

export type Inputs = {
  projects: ArrayInputs[];
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
  defaultValues?: Inputs;
}) => {
  const [notiMessage, setNotiMessage] = useState("");
  const { control: defaultFormControl, getValues: defaultGetValues } =
    useForm<DefaultInputs>({
      defaultValues: {
        name: "",
        email: "",
        mobileNumber: "",
        birthDate: "",
        socialNumber: "",
        degree: "",
        class: "",
        university: "",
        faculty: "",
        subject: "",
      },
    });
  const { control: arrayControl, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      projects: [
        {
          advisorName: "",
          advisorEmail: "",
          advisorMobileNumber: "",
          advisorTitle: "",
          advisorUniversity: "",
          advisorFaculty: "",
          advisorSubject: "",
          advisorCertificate: null,

          title: "",
          extract: null,
          section: "",
        },
      ],
    },
  });

  const { append, remove, fields } = useFieldArray({
    control: arrayControl,
    name: "projects",
  });

  const onSubmit = React.useMemo(() => {
    return handleSubmit(async (data) => {
      const participantData = defaultGetValues();
      const checkEmail = await getClient().fetch(
        checkifUniqueEmail(participantData.email)
      );
      if (!checkEmail.length) {
        Promise.all(
          data.projects.map(async (project) => {
            if (project.extract && project.advisorCertificate) {
              const extractData = await getClient().assets.upload(
                "file",
                project.extract,
                { filename: project.extract.name }
              );
              const advisorCertificateData = await getClient().assets.upload(
                "file",
                project.advisorCertificate,
                { filename: project.advisorCertificate.name }
              );

              const mutations = [
                {
                  create: {
                    _type: "participants",
                    name: participantData.name,
                    email: participantData.email,
                    mobileNumber: participantData.mobileNumber,
                    birthDate: participantData.birthDate,
                    socialNumber: participantData.socialNumber,
                    degree: participantData.degree,
                    class: participantData.class,
                    university: {
                      _type: "reference",
                      _ref: participantData.university,
                    },
                    faculty: {
                      _type: "reference",
                      _ref: participantData.faculty,
                    },
                    subject: {
                      _type: "reference",
                      _ref: participantData.subject,
                    },
                    advisorName: project.advisorName,
                    advisorEmail: project.advisorEmail,
                    advisorMobileNumber: project.advisorMobileNumber,
                    advisorTitle: project.advisorTitle,
                    advisorUniversity: {
                      _type: "reference",
                      _ref: project.advisorUniversity,
                    },
                    advisorFaculty: {
                      _type: "reference",
                      _ref: project.advisorFaculty,
                    },
                    advisorSubject: {
                      _type: "reference",
                      _ref: project.advisorSubject,
                    },
                    advisorCertificate: {
                      _type: "file",
                      asset: {
                        _ref: advisorCertificateData._id,
                        _type: "reference",
                      },
                    },
                    title: project.title,
                    extract: {
                      _type: "file",
                      asset: { _ref: extractData._id, _type: "reference" },
                    },
                    section: {
                      _type: "reference",
                      _ref: project.section,
                    },
                    accepted: false,
                  },
                },
              ];
              //TODO:MOVE TO THE SERVER THE WHOLE UPLOAD SHIT
              return await getClient()
                .mutate(mutations)
                .then((response) => response)
                .then((result) => console.log(result))
                .catch((error) => console.error(error));
            }
          })
        );
      } else {
        setNotiMessage("Ezen az emailen már regisztrálva van");
        setTimeout(() => setNotiMessage(""), 3000);
      }
    });
  }, [defaultGetValues, handleSubmit]);

  const UniversityField = ({
    advisor,
    text,
    bg,
    control,
    index,
  }: {
    advisor?: boolean;
    text: string;
    bg: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any, any>;
    index?: number;
  }) => {
    const universitiesOption = universities.map((uni) => ({
      name: uni.name,
      value: uni._id,
    }));
    return (
      <Controller
        name={advisor ? `projects.${index}.advisorUniversity` : "university"}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            disabled={!!defaultValues}
            onChange={(value: string | number) => {
              onChange(value as string);
            }}
            options={universitiesOption}
            value={
              universitiesOption
                ? universitiesOption.find((uni) => uni.value === value) || null
                : null
            }
            placeholder="Egyetem"
            text={text}
            bg={bg}
          />
        )}
      />
    );
  };

  const FacultyField = ({
    advisor,
    text,
    bg,
    control,
    index,
  }: {
    advisor?: boolean;
    index?: number;
    text: string;
    bg: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any, any>;
  }) => {
    const selectedUniversity = useWatch({
      control,
      name: advisor ? `projects.${index}.advisorUniversity` : "university",
    });
    const uniData = universities.find((uni) => uni._id === selectedUniversity);
    const faculties =
      uniData && uniData.faculties
        ? uniData.faculties.map((fac) => ({ name: fac.name, value: fac._id }))
        : undefined;

    return (
      <Controller
        name={advisor ? `projects.${index}.advisorFaculty` : "faculty"}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            disabled={!!defaultValues}
            onChange={(value: string | number) => {
              onChange(value as string);
            }}
            options={faculties}
            value={
              faculties
                ? faculties.find((f) => f.value === value) || null
                : null
            }
            placeholder="Kar"
            text={text}
            bg={bg}
          />
        )}
      />
    );
  };

  const SubjectField = ({
    advisor,
    text,
    bg,
    control,
    index,
  }: {
    advisor?: boolean;
    index?: number;
    text: string;
    bg: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any, any>;
  }) => {
    const selectedFaculty = useWatch({
      control,
      name: advisor ? `projects.${index}.advisorFaculty` : "faculty",
    });
    const facultyData = faculties.find((f) => f._id === selectedFaculty);
    const subjects =
      facultyData && facultyData.subjects
        ? facultyData.subjects.map((sb) => ({ name: sb.name, value: sb._id }))
        : undefined;

    return (
      <Controller
        name={advisor ? `projects.${index}.advisorSubject` : "subject"}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            disabled={!!defaultValues}
            onChange={(value: string | number) => {
              onChange(value as string);
            }}
            options={subjects}
            value={
              subjects ? subjects.find((s) => s.value === value) || null : null
            }
            placeholder="Szak"
            text={text}
            bg={bg}
          />
        )}
      />
    );
  };

  return (
    <div className="flex min-h-[100vh] min-w-full flex-col items-center justify-center space-y-4 bg-white pb-40 pt-[71px]">
      <div className="space-y-4">
        <div className="h-fit w-full space-y-4 bg-lightGray px-2 py-6 md:w-[700px] md:p-6 ">
          <p className="text-3xl text-darkcherry">Személyes adatok:</p>
          <div className="grid grid-cols-1 gap-2 pl-2 md:grid-cols-2">
            <Controller
              name="name"
              control={defaultFormControl}
              render={({ field }) => (
                <input
                  {...field}
                  disabled={!!defaultValues}
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
              name="email"
              control={defaultFormControl}
              render={({ field }) => (
                <input
                  {...field}
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
              control={defaultFormControl}
              render={({ field }) => (
                <input
                  {...field}
                  disabled={!!defaultValues}
                  type="text"
                  className={classNames(
                    inputClasses,
                    "bg-application1 text-darkcherry placeholder:text-darkcherry"
                  )}
                  placeholder="Telefonszam"
                />
              )}
            />
            <Controller
              name="birthDate"
              control={defaultFormControl}
              render={({ field }) => (
                <input
                  {...field}
                  disabled={!!defaultValues}
                  type="text"
                  className={classNames(
                    inputClasses,
                    "bg-application1 text-darkcherry placeholder:text-darkcherry"
                  )}
                  placeholder="Születési dátum"
                  onFocus={(e) => (e.target.type = "date")}
                />
              )}
            />
            <Controller
              name="socialNumber"
              control={defaultFormControl}
              render={({ field }) => (
                <input
                  {...field}
                  disabled={!!defaultValues}
                  type="text"
                  className={classNames(
                    inputClasses,
                    "bg-application1 text-darkcherry placeholder:text-darkcherry"
                  )}
                  placeholder="Személyi szám"
                />
              )}
            />
            <Controller
              name="degree"
              control={defaultFormControl}
              render={({ field: { onChange, value } }) => (
                <Select
                  disabled={!!defaultValues}
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
              control={defaultFormControl}
              render={({ field: { onChange, value } }) => (
                <Select
                  disabled={!!defaultValues}
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
            <UniversityField
              control={defaultFormControl}
              text="text-darkcherry"
              bg="bg-application1"
            />
            <FacultyField
              control={defaultFormControl}
              text="text-darkcherry"
              bg="bg-application1"
            />
            <SubjectField
              control={defaultFormControl}
              text="text-darkcherry"
              bg="bg-application1"
            />
          </div>
        </div>
        {fields.map((data, index) => (
          <React.Fragment key={data.id}>
            <div className="h-fit w-full space-y-4 bg-lightGray px-2 py-6 md:w-[700px] md:p-6 ">
              <p className="text-3xl text-darkcherry">Témavezető adatai:</p>
              <div className="grid grid-cols-1 gap-2 pl-2 md:grid-cols-2">
                <Controller
                  name={`projects.${index}.advisorName`}
                  control={arrayControl}
                  render={({ field }) => (
                    <input
                      {...field}
                      disabled={!!defaultValues}
                      type="text"
                      className={classNames(
                        inputClasses,
                        "bg-application2 text-white placeholder:text-white"
                      )}
                      placeholder="Név"
                    />
                  )}
                />
                <Controller
                  name={`projects.${index}.advisorEmail`}
                  control={arrayControl}
                  render={({ field }) => (
                    <input
                      {...field}
                      disabled={!!defaultValues}
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
                  name={`projects.${index}.advisorMobileNumber`}
                  control={arrayControl}
                  render={({ field }) => (
                    <input
                      {...field}
                      disabled={!!defaultValues}
                      type="text"
                      className={classNames(
                        inputClasses,
                        "bg-application2 text-white placeholder:text-white"
                      )}
                      placeholder="Telefonszam"
                    />
                  )}
                />
                <Controller
                  name={`projects.${index}.advisorTitle`}
                  control={arrayControl}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      disabled={!!defaultValues}
                      onChange={(value: string | number) => {
                        onChange(value as string);
                      }}
                      options={titleOptions}
                      value={
                        titleOptions.find((t) => t.value === value) || null
                      }
                      placeholder="Titulus"
                      text="text-white"
                      bg="bg-application2"
                    />
                  )}
                />
                <UniversityField
                  index={index}
                  advisor
                  control={arrayControl}
                  text="text-white"
                  bg="bg-application2"
                />
                <FacultyField
                  index={index}
                  advisor
                  control={arrayControl}
                  text="text-white"
                  bg="bg-application2"
                />
                <SubjectField
                  index={index}
                  advisor
                  control={arrayControl}
                  text="text-white"
                  bg="bg-application2"
                />
                <Controller
                  name={`projects.${index}.advisorCertificate`}
                  control={arrayControl}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <label>
                        <div
                          className={classNames(
                            inputClasses,
                            "flex cursor-pointer items-center bg-application2 pl-4 text-white"
                          )}
                        >
                          <div className="overflow-hidden truncate opacity-80">
                            {value ? value.name : "Igazolás"}
                          </div>
                        </div>
                        <input
                          disabled={!!defaultValues}
                          type="file"
                          className="hidden"
                          onChange={(e) =>
                            onChange(e.target.files ? e.target.files[0] : null)
                          }
                        />
                      </label>
                    );
                  }}
                />
              </div>
            </div>
            <div className="h-fit w-full space-y-4 bg-lightGray px-2 py-6 md:w-[700px] md:p-6 ">
              <p className="text-3xl text-darkcherry">Dolgozat:</p>
              <div className="grid grid-cols-1 gap-2 pl-2 md:grid-cols-2">
                <Controller
                  name={`projects.${index}.title`}
                  control={arrayControl}
                  render={({ field }) => (
                    <input
                      {...field}
                      disabled={!!defaultValues}
                      type="text"
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
                  control={arrayControl}
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
                            {value ? value.name : "Kivonat"}
                          </div>
                        </div>
                        <input
                          disabled={!!defaultValues}
                          type="file"
                          className="hidden"
                          onChange={(e) =>
                            onChange(e.target.files ? e.target.files[0] : null)
                          }
                        />
                      </label>
                    );
                  }}
                />
                <Controller
                  name={`projects.${index}.section`}
                  control={arrayControl}
                  render={({ field: { onChange, value } }) => {
                    const sectionsOptions = sections.map((s) => ({
                      name: s.name,
                      value: s._id,
                    }));
                    return (
                      <Select
                        disabled={!!defaultValues}
                        onChange={(value: string | number) => {
                          onChange(value as string);
                        }}
                        options={sectionsOptions}
                        value={
                          sectionsOptions.find((s) => s.value === value) || null
                        }
                        placeholder="Szekció"
                        text="text-darkcherry"
                        bg="bg-application3"
                      />
                    );
                  }}
                />
              </div>
            </div>
            <button
              className="rounded-lg bg-black p-2 text-white"
              onClick={() =>
                append({
                  advisorName: "",
                  advisorEmail: "",
                  advisorMobileNumber: "",
                  advisorTitle: "",
                  advisorUniversity: "",
                  advisorFaculty: "",
                  advisorSubject: "",
                  advisorCertificate: null,

                  title: "",
                  extract: null,
                  section: "",
                })
              }
            >
              Uj dolgozat hozzadasa
            </button>
            {index !== 0}
            <button
              className=" rounded-lg bg-red p-2 text-white"
              onClick={() => remove(index)}
            >
              Dolgozat torlese
            </button>
          </React.Fragment>
        ))}

        <button
          className="h-10 w-20 rounded-lg bg-black text-white"
          onClick={() => onSubmit()}
        >
          submit
        </button>
      </div>
      <Snackbar message={notiMessage} open={notiMessage !== ""} />
    </div>
  );
};

export default ApplicationForm;
