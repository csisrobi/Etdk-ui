import { checkifUniqueEmail } from "@lib/queries";
import { getClient } from "@lib/sanity";
import { Controller, useForm, useWatch } from "react-hook-form";
import Select from "src/components/FormComponents/Select";
import Snackbar from "src/components/UtilityComponents/Snackbar";
import { useState } from "react";
import type { UniversitiesSanity, FacultySanity } from "types";
import classNames from "classnames";

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

  title: string;
  extract: string;
  section: string;
};

const inputClasses =
  "border-gray-300 block h-11 w-full rounded-xl text-lg font-semibold placeholder:opacity-80 focus:border-darkcherry focus:ring-darkcherry";

const ApplicationForm = ({
  universities,
  faculties,
  defaultValues,
}: {
  universities: UniversitiesSanity[];
  faculties: FacultySanity[];
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

      title: "",
      extract: "",
      section: "",
    },
  });

  const onSubmit = async (data: Inputs) => {
    const checkEmail = await getClient().fetch(checkifUniqueEmail(data.email));
    if (!checkEmail.length) {
      const mutations = [
        {
          create: {
            name: data.name,
            email: data.email,
            _type: "participants",
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
            mobileNumber: data.mobileNumber,
            birthDate: data.birthDate,
            socialNumber: data.socialNumber,
            degree: data.degree,
            class: data.class,
          },
        },
      ];

      fetch(
        `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v1/data/mutate/production`,
        {
          method: "post",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_ID}`,
          },
          body: JSON.stringify({ mutations }),
        }
      )
        .then((response) => response.json())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    } else {
      setNotiMessage("Ezen az emailen már regisztrálva van");
      setTimeout(() => setNotiMessage(""), 3000);
    }
  };

  const UniversityField = ({ advisor }: { advisor?: boolean }) => {
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
          />
        )}
      />
    );
  };

  const FacultyField = ({ advisor }: { advisor?: boolean }) => {
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
          />
        )}
      />
    );
  };

  const SubjectField = ({ advisor }: { advisor?: boolean }) => {
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
          />
        )}
      />
    );
  };

  return (
    <div className="flex min-h-[100vh] min-w-full flex-col items-center justify-center space-y-4 bg-white pt-[71px]">
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
                  name="price"
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
                  name="price"
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
              render={({ field }) => (
                <input
                  {...field}
                  disabled={!!defaultValues}
                  type="text"
                  className={classNames(
                    inputClasses,
                    "bg-application1 text-darkcherry placeholder:text-darkcherry"
                  )}
                  placeholder="Képzési szint"
                />
              )}
            />
            <Controller
              name="class"
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
                  placeholder="Évfolyam"
                />
              )}
            />
            <UniversityField />
            <FacultyField />
            <SubjectField />
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
                  name="price"
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
                  name="price"
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
              render={({ field }) => (
                <input
                  {...field}
                  disabled={!!defaultValues}
                  type="text"
                  className={classNames(
                    inputClasses,
                    "bg-application2 text-white placeholder:text-white"
                  )}
                  placeholder="Titulus(doktor,adjunktus stb.)"
                />
              )}
            />
            <UniversityField advisor />
            <FacultyField advisor />
            <SubjectField advisor />
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
              render={({ field }) => (
                <input
                  {...field}
                  disabled={!!defaultValues}
                  type="text"
                  name="price"
                  className={classNames(
                    inputClasses,
                    "bg-application3 text-darkcherry placeholder:text-darkcherry"
                  )}
                  placeholder="Kivonat"
                />
              )}
            />
            <Controller
              name="section"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  disabled={!!defaultValues}
                  type="text"
                  name="price"
                  className={classNames(
                    inputClasses,
                    "bg-application3 text-darkcherry placeholder:text-darkcherry"
                  )}
                  placeholder="Szekció"
                />
              )}
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
