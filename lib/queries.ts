import { groq } from "next-sanity";

//TODO: CREATE A GENERAL QUERY
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
  description,
  featuredImage
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
*[_type == "archiv"] | order(year){
  year,
}`;

export const queryArhivDetails = (year: string) => groq`
*[_type == "archiv" && year == "${year}"]{
  book,
  book_image,
  winners[] {
    section->{name},
    winnerPersons
  },
}`;

export const queryActiveSections = () => groq`
  *[_type == "sections" && active == true]{
    name,
    image
}`;
