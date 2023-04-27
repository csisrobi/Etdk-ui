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
  generalApplicationRules: SanityRichText[];
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
  contributionNeeded: boolean;
};

export type SanityPersonData = {
  name: string;
  idNumber: string;
  university: string;
  universityOther: string;
  faculty: string;
  facultyOther: string;
  subject: string;
  subjectOther: string;
  degree: string;
  class: string;
  finishedSemester: string;
  email: string;
  mobileNumber: string;
  registrationDate?: string;
  idPhoto: {
    originalFilename: string;
    url: string;
  };
  voucher: {
    originalFilename: string;
    url: string;
  };
};

export type SanityAdvisorData = {
  name: string;
  university: string;
  universityOther: string;
  title: string;
  email: string;
  mobileNumber: string;
  certificate: {
    originalFilename: string;
    url: string;
  };
};

export type SanityParticipant = SanityPersonData & {
  _id: string;

  companions: SanityPersonData[];
  advisors: SanityAdvisorData[];
  title: string;
  section: string;
  extract: {
    originalFilename: string;
    url: string;
  };
  essay: {
    originalFilename: string;
    url: string;
  };
  annex: {
    originalFilename: string;
    url: string;
  };
  contribution: {
    originalFilename: string;
    url: string;
  };
  score: {
    criteria: { name: string; _id: string };
    score: number;
  }[];

  accepted: boolean;
};

export type SanityParticipantScoring = {
  _id: string;
  name: string;
  title: string;
  section: {
    _id: string;
    name: string;
  };
  merged_section: {
    _id: string;
    name: string;
  };
  extract: {
    originalFilename: string;
    url: string;
  };
  essay: {
    originalFilename: string;
    url: string;
  };
  annex: {
    originalFilename: string;
    url: string;
  };
  contribution: {
    originalFilename: string;
    url: string;
  };
  score: {
    criteria: { name: string; _id: string };
    score: number;
  }[];
};
