import { groq } from "next-sanity";

export const querySponsor = groq`
*[_type == "sponsor"]{
  name,
  image
}
`;

export const queryOrg = groq`
*[_type == "organizer"]{
  name,
  image
}
`;

export const queryContact = groq`
*[_type == "contact"]{
  address,
  phone,
  email,
  facebook,
  instagram,
}`;

export const queryGeneral = groq`
*[_type == "general"]{
  year,
  edition,
  editionRoman,
  date,
  rules,
  requirement,
  scoringcriteria,
  "certificateURL": certificate.asset->url
}`;

export const queryApplicate = groq`
*[_type == "applicate"]{
  title,
  description,
  small_benefit,
  big_benefit
}`;

export const queryGeneralRules = groq`
*[_type == "general"]{
  rules,
}`;

export const queryNewsBasic = groq`
*[_type == "news"]{
  name,
  summary,
  date,
  description
}`;

export const queryNewsDescription = (name: string) => groq`
*[_type == "news" && name == "${name}"]{
  description
}`;

export const queryDeadline = groq`
*[_type == "general"]{
  deadline
}`;

export const queryArchivsBasic = groq`
*[_type == "archiv"]{
  year,
}`;

export const queryArhivDetails = (year: string) => groq`
*[_type == "archiv" && year == "${year}"]{
  book,
  book_image
}`;
