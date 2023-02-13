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

export const queryNews = groq`
*[_type == "news"]{
  name,
  summary,
  date,
  description,
  featuredImage
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

export const queryActiveSections = groq`
  *[_type == "sections" && active == true ] | order(name){
    name,
    image,
    id
}`;

export const queryUniversities = groq`
*[_type == "universities"]{
  name,
  _id,
  faculties[]->{
    name,
    _id,
    subjects[]->{name, _id}
  }
}`;

export const queryFaculties = groq`
*[_type == "faculties"]{
  name,
  _id,
  subjects[]->{
    name,
    _id,
  }
}`;

export const querySubjects = groq`
*[_type == "subjects"]{
  name,
  _id,
}`;

export const checkifUniqueEmail = (email: string) => groq`
*[_type == "participants" && email == "${email}"]{
  email
}`;

export const getDataForParticipant = (email: string) => groq`
*[_type == "participants" && email == "${email}"] {
  birthDate,
  class,
  degree,
  email,
  mobileNumber,
  name,
  socialNumber,
  faculty,
  subject,
  university
}`;
