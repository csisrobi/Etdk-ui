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
