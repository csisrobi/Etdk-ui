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

export const newsBasic = groq`
*[_type == "news"]{
  name,
  summary,
  date
}`;

export const newsDescription = (name: string) => groq`
*[_type == "news" && name == "${name}"]{
  description
}`;
