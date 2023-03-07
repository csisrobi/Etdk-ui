import { checkIfUniqueEmail } from "@lib/queries";
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

//TODO SORREND DOCX

// Szemelyes adatok
//TODO KELL ELLENORZO SZAM -------------- DONE
//TODO KELL ELVEGZETT FELEVEK SZAMA, 1-10 -------------- DONE
//TODO ELLENORZO KEP -------------- DONE

//TODO: jelentkezes utan, masodik fazisba
// Dolgozat - pdf, akár 100 oldalas dokumentum, képekkel, ábrákkal
// 	Melléklet - pdf, max. 20 oldalas dokumentum

// Egyéb dokumentumok:
// Adatbankos nyilatkozat - pdf, 1 oldalas dokumentum
// Kifizetési bizonylat - pdf vagy jpg.
// Kivételes eset: Biológia szekció esetében, hozzájárulási nyilatkozat, pdf, 1 oldalas (ha nem megoldható e-mailen továbbítják, kb. 10-15 ember érint)

//TODO: GDPR kocka enelkul nem lehet jelentkezni + lekell menteni hogy beleegyezett
//TODO: JELENTKEZETT -> NOW sanitybe

//TODO: EGYEB szaknak, karnak es egyetemnek!

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

export type DefaultInputs = {
  name: string;
  idNumber: string;
  finishedSemester: string;
  degree: string;
  class: string;
  university: string;
  faculty: string;
  subject: string;
  email: string;
  mobileNumber: string;
  idPhoto: File | null;
  voucher: File | null;
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
  annex: File | null;
  declaration: File | null;
  contribution: File | null;
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
  const [loading, setLoading] = useState(false);
  const { control: defaultFormControl, getValues: defaultGetValues } =
    useForm<DefaultInputs>({
      defaultValues: {
        name: "",
        idNumber: "",
        degree: "",
        class: "",
        university: "",
        faculty: "",
        subject: "",
        finishedSemester: "",
        email: "",
        mobileNumber: "",
        idPhoto: null,
        voucher: null,
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
          contribution: null,
          annex: null,
          declaration: null,
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
      setLoading(true);
      const participantData = defaultGetValues();
      const checkEmail = await getClient().fetch(
        checkIfUniqueEmail(participantData.email)
      );
      if (
        !checkEmail.length &&
        participantData.idPhoto &&
        participantData.voucher
      ) {
        const idPhotoData = await getClient().assets.upload(
          "file",
          participantData.idPhoto,
          { filename: participantData.idPhoto.name }
        );
        const voucherData = await getClient().assets.upload(
          "file",
          participantData.voucher,
          { filename: participantData.voucher.name }
        );
        Promise.all(
          data.projects.map(async (project) => {
            if (
              project.extract &&
              project.advisorCertificate &&
              project.declaration &&
              project.annex
            ) {
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
              const contributionData = project.contribution
                ? await getClient().assets.upload(
                    "file",
                    project.contribution,
                    { filename: project.contribution.name }
                  )
                : undefined;
              const declarationData = await getClient().assets.upload(
                "file",
                project.declaration,
                { filename: project.declaration.name }
              );
              const annexData = await getClient().assets.upload(
                "file",
                project.annex,
                { filename: project.annex.name }
              );
              const mutations = [
                {
                  create: {
                    _type: "participants",
                    name: participantData.name,
                    idNumber: participantData.idNumber,
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
                    degree: participantData.degree,
                    class: participantData.class,
                    finishedSemester: participantData.finishedSemester,
                    email: participantData.email,
                    mobileNumber: participantData.mobileNumber,
                    idPhoto: {
                      _type: "file",
                      asset: {
                        _ref: idPhotoData._id,
                        _type: "reference",
                      },
                    },
                    voucher: {
                      _type: "file",
                      asset: {
                        _ref: voucherData._id,
                        _type: "reference",
                      },
                    },

                    advisorName: project.advisorName,
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
                    advisorTitle: project.advisorTitle,
                    advisorEmail: project.advisorEmail,
                    advisorMobileNumber: project.advisorMobileNumber,
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
                    annex: {
                      _type: "file",
                      asset: { _ref: annexData._id, _type: "reference" },
                    },
                    declaration: {
                      _type: "file",
                      asset: { _ref: declarationData._id, _type: "reference" },
                    },
                    ...(contributionData && {
                      contribution: {
                        _type: "file",
                        asset: {
                          _ref: contributionData._id,
                          _type: "reference",
                        },
                      },
                    }),
                    accepted: false,
                  },
                },
              ];
              //TODO:MOVE TO THE SERVER THE WHOLE UPLOAD SHIT
              return await getClient()
                .mutate(mutations)
                .then(() => setLoading(false))
                .catch((error) => console.error(error));
            }
          })
        );
      } else {
        setNotiMessage("Ezen az emailen már regisztrálva van");
        setLoading(false);
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

  const ContributionField = ({ index }: { index: number }) => {
    const selectedSection = useWatch({
      control: arrayControl,
      name: `projects.${index}.section`,
    });
    const findSection = sections.find((s) => s._id === selectedSection);
    if (findSection && findSection.contributionNeeded === true) {
      return (
        <Controller
          name={`projects.${index}.contribution`}
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
                    {value ? value.name : "Hozzájárulási nyilatkozat"}
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
      );
    }
    return null;
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
              name="idNumber"
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
                  placeholder="Ellenőrző száma"
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
            <Controller
              name="finishedSemester"
              control={defaultFormControl}
              render={({ field: { onChange, value } }) => (
                <Select
                  disabled={!!defaultValues}
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
                  placeholder="Telefonszám"
                />
              )}
            />
            <Controller
              name="idPhoto"
              control={defaultFormControl}
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
                        {value ? value.name : "Ellenőrző kép"}
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
              name="voucher"
              control={defaultFormControl}
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
                        {value ? value.name : "Kifizetési bizonylat"}
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
        {fields.map((data, index) => (
          <React.Fragment key={data.id}>
            <div className="h-fit w-full space-y-4 bg-lightGray px-2 py-6 md:w-[700px] md:p-6 ">
              <p className="text-3xl text-darkcherry">
                {index + 1}. Témavezető adatai:
              </p>
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
                      placeholder="Telefonszám"
                    />
                  )}
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
              <p className="text-3xl text-darkcherry">{index + 1}. Dolgozat:</p>
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
                <Controller
                  name={`projects.${index}.annex`}
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
                            {value ? value.name : "Melléklet"}
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
                  name={`projects.${index}.declaration`}
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
                            {value ? value.name : "Adatbankos nyilatkozat"}
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
                <ContributionField index={index} />
              </div>
            </div>
            <button
              className="mr-6 rounded-xl bg-darkcherry py-2 px-4 text-white"
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
                  contribution: null,
                  annex: null,
                  declaration: null,
                })
              }
            >
              <p>Új dolgozat hozzáadása</p>
            </button>
            {fields.length > 1 && (
              <button
                className=" rounded-xl bg-red py-2 px-4 text-white"
                onClick={() => remove(index)}
              >
                <p>Dolgozat törlése</p>
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          className="float-right flex h-10 items-center rounded-xl bg-darkcherry py-2 px-4 text-white"
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
                stroke-width="4"
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
    </div>
  );
};

export default ApplicationForm;
