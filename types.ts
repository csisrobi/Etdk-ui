export type Name = {
  name: string;
};
export type SanityImage = {
  _type: string;
  asset: { _ref: string };
};

export type SanitySponsor = Name & { image: SanityImage };
export type SanityOrganizer = Name & { image: SanityImage };
