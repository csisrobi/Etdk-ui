import { checkifUniqueEmail } from "@lib/queries";
import { getClient } from "@lib/sanity";
import { Controller, useForm, useWatch } from "react-hook-form";
import Select from "src/components/FormComponents/Select";
import Snackbar from "src/components/UtilityComponents/Snackbar";
import { useState } from "react";
import type { UniversitiesSanity, FacultySanity, SectionsSanity } from "types";
import classNames from "classnames";

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

export type Inputs = {
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

const inputClasses =
  "border-none block h-11 w-full rounded-xl text-lg font-semibold placeholder:opacity-80 focus:border-darkcherry focus:ring-darkcherry";

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
  const { control, handleSubmit } = useForm<Inputs>({
    defaultValues: defaultValues || {
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
  });

  const onSubmit = async (data: Inputs) => {
    console.log(data);
    if (data.extract && data.advisorCertificate) {
      const extractData = await getClient().assets.upload(
        "file",
        data.extract,
        { filename: data.extract.name }
      );
      const advisorCertificateData = await getClient().assets.upload(
        "file",
        data.advisorCertificate,
        { filename: data.advisorCertificate.name }
      );
      const checkEmail = await getClient().fetch(
        checkifUniqueEmail(data.email)
      );
      if (!checkEmail.length) {
        const mutations = [
          {
            create: {
              _type: "participants",

              name: data.name,
              email: data.email,
              mobileNumber: data.mobileNumber,
              birthDate: data.birthDate,
              socialNumber: data.socialNumber,
              degree: data.degree,
              class: data.class,
              university: {
                _type: "reference",
                _ref: data.university,
              },
              faculty: {
                _type: "reference",
                _ref: data.faculty,
              },
              subject: {
                _type: "reference",
                _ref: data.subject,
              },

              advisorName: data.advisorName,
              advisorEmail: data.advisorEmail,
              advisorMobileNumber: data.mobileNumber,
              advisorTitle: data.advisorTitle,
              advisorUniversity: {
                _type: "reference",
                _ref: data.advisorUniversity,
              },
              advisorFaculty: {
                _type: "reference",
                _ref: data.advisorFaculty,
              },
              advisorSubject: {
                _type: "reference",
                _ref: data.advisorSubject,
              },
              advisorCertificate: {
                _type: "file",
                asset: { _ref: advisorCertificateData._id, _type: "reference" },
              },

              title: data.title,
              extract: {
                _type: "file",
                asset: { _ref: extractData._id, _type: "reference" },
              },
              section: {
                _type: "reference",
                _ref: data.section,
              },
            },
          },
        ];
        //TODO:MOVE TO THE SERVER THE WHOLE UPLOAD SHIT
        await getClient()
          .mutate(mutations)
          .then((response) => response)
          .then((result) => console.log(result))
          .catch((error) => console.error(error));
      } else {
        setNotiMessage("Ezen az emailen már regisztrálva van");
        setTimeout(() => setNotiMessage(""), 3000);
      }
    }
  };

  const UniversityField = ({
    advisor,
    text,
    bg,
  }: {
    advisor?: boolean;
    text: string;
    bg: string;
  }) => {
    const universitiesOption = universities.map((uni) => ({
      name: uni.name,
      value: uni._id,
    }));
    return (
      <Controller
        name={advisor ? "advisorUniversity" : "university"}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            disabled={!!defaultValues}
            onChange={(value: string) => onChange(value)}
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
  }: {
    advisor?: boolean;
    text: string;
    bg: string;
  }) => {
    const selectedUniversity = useWatch({
      control,
      name: "university",
    });
    const uniData = universities.find((uni) => uni._id === selectedUniversity);
    const faculties =
      uniData && uniData.faculties
        ? uniData.faculties.map((fac) => ({ name: fac.name, value: fac._id }))
        : undefined;

    return (
      <Controller
        name={advisor ? "advisorFaculty" : "faculty"}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            disabled={!!defaultValues}
            onChange={(value: string) => {
              onChange(value);
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
  }: {
    advisor?: boolean;
    text: string;
    bg: string;
  }) => {
    const selectedFaculty = useWatch({
      control,
      name: advisor ? "advisorFaculty" : "faculty",
    });
    const facultyData = faculties.find((f) => f._id === selectedFaculty);
    const subjects =
      facultyData && facultyData.subjects
        ? facultyData.subjects.map((sb) => ({ name: sb.name, value: sb._id }))
        : undefined;

    return (
      <Controller
        name={advisor ? "advisorSubject" : "subject"}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            disabled={!!defaultValues}
            onChange={(value: string) => {
              onChange(value);
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
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="h-fit w-full space-y-4 bg-lightGray px-2 py-6 md:w-[700px] md:p-6 ">
          <p className="text-3xl text-darkcherry">Személyes adatok:</p>
          <div className="grid grid-cols-1 gap-2 pl-2 md:grid-cols-2">
            <Controller
              name="name"
              control={control}
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
              control={control}
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
              control={control}
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
              control={control}
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
              control={control}
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
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  disabled={!!defaultValues}
                  onChange={(value: string) => {
                    onChange(value);
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
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  disabled={!!defaultValues}
                  onChange={(value: string) => {
                    onChange(value);
                  }}
                  options={classOptions}
                  value={classOptions.find((c) => c.value === value) || null}
                  placeholder="Évfolyam"
                  text="text-darkcherry"
                  bg="bg-application1"
                />
              )}
            />
            <UniversityField text="text-darkcherry" bg="bg-application1" />
            <FacultyField text="text-darkcherry" bg="bg-application1" />
            <SubjectField text="text-darkcherry" bg="bg-application1" />
          </div>
        </div>
        <div className="h-fit w-full space-y-4 bg-lightGray px-2 py-6 md:w-[700px] md:p-6 ">
          <p className="text-3xl text-darkcherry">Témavezető adatai:</p>
          <div className="grid grid-cols-1 gap-2 pl-2 md:grid-cols-2">
            <Controller
              name="advisorName"
              control={control}
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
              name="advisorEmail"
              control={control}
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
              name="advisorMobileNumber"
              control={control}
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
              name="advisorTitle"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  disabled={!!defaultValues}
                  onChange={(value: string) => {
                    onChange(value);
                  }}
                  options={titleOptions}
                  value={titleOptions.find((t) => t.value === value) || null}
                  placeholder="Titulus"
                  text="text-white"
                  bg="bg-application2"
                />
              )}
            />
            <UniversityField advisor text="text-white" bg="bg-application2" />
            <FacultyField advisor text="text-white" bg="bg-application2" />
            <SubjectField advisor text="text-white" bg="bg-application2" />
            <Controller
              name="advisorCertificate"
              control={control}
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
              name="title"
              control={control}
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
              name="extract"
              control={control}
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
              name="section"
              control={control}
              render={({ field: { onChange, value } }) => {
                const sectionsOptions = sections.map((s) => ({
                  name: s.name,
                  value: s._id,
                }));
                return (
                  <Select
                    disabled={!!defaultValues}
                    onChange={(value: string) => {
                      onChange(value);
                    }}
                    options={sectionsOptions}
                    value={
                      sectionsOptions.find((s) => s.value === value) || null
                    }
                    placeholder="Titulus"
                    text="text-darkcherry"
                    bg="bg-application3"
                  />
                );
              }}
            />
          </div>
        </div>
        <button
          type="submit"
          className="h-10 w-20 rounded-lg bg-black text-white"
        >
          submit
        </button>
      </form>
      <Snackbar message={notiMessage} open={notiMessage !== ""} />
    </div>
  );
};

export default ApplicationForm;
