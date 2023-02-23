export type Name = {
  name: string;
};
export type SanityImage = {
  _type: string;
  asset: { _ref: string };
};

export type SanityContact = {
  address: string;
  phone: string;
  email: string;
  facebook: string;
  instagram: string;
};

export type RichTextChildren = {
  _type: string;
  text: string;
  marks: string[];
};

export type SanityRichText = {
  _key: string;
  _type: string;
  style: string;
  markDefs: unknown;
  children: RichTextChildren[];
};

export type SanityGeneral = {
  year: string;
  edition: string;
  editionRoman: string;
  date: string;
  rules: SanityRichText[];
  requirement: SanityRichText[];
  scoringcriteria: SanityRichText[];
  certificateURL: string;
};

export type SanityApplicate = {
  description: SanityRichText[];
  title: string;
  small_benefit: string[];
  big_benefit: {
    description: string;
    title: string;
    icon: SanityImage;
  }[];
};

export type SanityNews = {
  description: SanityRichText[];
  name: string;
  summary: string;
  date: string;
  featuredImage?: SanityImage;
};

export type SanityArchiv = {
  book: string;
  book_image: SanityImage;
  year: string;
  winners: {
    section: {
      name: string;
    };
    winnerPersons: {
      name: string;
      result: string;
    }[];
  }[];
};

export type SanitySponsor = Name & { image: SanityImage };
export type SanityOrganizer = Name & { image: SanityImage };

export type SelectOption = { name: string; value: string | number };

export type SubjectSanity = {
  name: string;
  _id: string;
};

export type FacultySanity = {
  name: string;
  subjects?: SubjectSanity[];
  _id: string;
};

export type UniversitiesSanity = {
  name: string;
  faculties?: FacultySanity[];
  _id: string;
};

export type SectionsSanity = {
  name: string;
  image?: SanityImage;
  _id: string;
};

export type SanityParticipant = {
  _id: string;

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
  advisorCertificate: {
    originalFilename: string;
    url: string;
  };

  title: string;
  extract: {
    originalFilename: string;
    url: string;
  };
  section: string;

  score: {
    criteria: { name: string; _id: string };
    score: number;
  }[];

  accepted: boolean;
};
