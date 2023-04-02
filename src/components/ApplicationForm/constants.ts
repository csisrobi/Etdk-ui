export const degreeOptions = [
  {
    name: "BA (alapképzés)",
    value: "BA",
  },
  {
    name: "MA (mesterképzés)",
    value: "MA",
  },
  {
    name: "BSc (alapképzés)",
    value: "BSc",
  },
];

export const classOptions = [
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
];

export const semesterOptions = [
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
  {
    name: "11",
    value: "11",
  },
  {
    name: "12",
    value: "12",
  },
];

export const titleOptions = [
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
  _key?: string;
  name: string;
  email: string;
  mobileNumber: string;
  title: string;
  university: string;
  universityOther?: string;

  certificate: File | null | string;
  certificateId?: string;
};
export type PersonInputs = {
  _key?: string;
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
  idPhotoId?: string;
  voucher?: File | null | string;
  voucherId?: string;
};

export type ProjectInputs = {
  _id?: string;

  title: string;
  section: string;

  extract: File | null | string;
  annex: File | null | string;
  declaration: File | null | string;
  contribution: File | null | string;
  essay: File | null | string;

  advisors: AdvisorInputs[];
  companions?: PersonInputs[];
};

export type Inputs = {
  projects: ProjectInputs[];
};

export const inputClasses =
  "pl-3 border-none block h-11 w-full rounded-xl text-lg font-semibold placeholder:opacity-80 focus:border-darkcherry focus:ring-darkcherry";
