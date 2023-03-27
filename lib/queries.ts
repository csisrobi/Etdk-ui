/* eslint-disable @typescript-eslint/no-explicit-any */
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
  generalApplicationRules,
  "certificateURL": certificate.asset->url
}`;

export const queryFiles = groq`
*[_type == "files"]{
  "certificateURL": certificate.asset->url,
  "declarationURL": declaration.asset->url,
  "declarationProjectURL": declarationProject.asset->url,
  "contributionURL": contribution.asset->url,
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

export const queryGeneralGDPR = groq`
*[_type == "general"]{
  gdpr,
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

export const queryRequirement = groq`
*[_type == "general"]{
  requirement
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
    contributionNeeded,
    _id
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

export const checkIfUniqueEmail = (email: string) => groq`
*[_type == "participants" && email == "${email}"]{
  email
}`;

export const checkIfCredentialsOk = (email: string, password: string) => groq`
*[_type in ["participants", "admins"] && email == "${email}" && password == "${password}"]{
  email
}`;

export const checkIfAdmin = (email: string) => groq`
*[_type == "admins" && email == "${email}"]{
  email,
  role
}`;

export const getProjectsDataForParticipant = (email: string) => groq`
*[_type == "participants" && email == "${email}"]{
  _id,
  "advisorUniversity": advisorUniversity -> _id,
  "advisorFaculty":advisorFaculty -> _id,
  "advisorSubject":advisorSubject -> _id,
  advisorName,
  advisorTitle,
  advisorEmail,
  advisorMobileNumber,
  "advisorCertificate": advisorCertificate.asset->originalFilename,

  title,
  "extract": extract.asset->originalFilename,
  "section":section -> _id,
  "annex": annex.asset->originalFilename,
  "declaration": declaration.asset->originalFilename,
  "contribution": contribution.asset->originalFilename,
}`;

export const getPersonDataForParticipant = (email: string) => groq`
*[_type == "participants" && email == "${email}"]{
  name,
  idNumber,
  "university": university -> _id,
  "faculty":faculty -> _id,
  "subject":subject -> _id,
  degree,
  class,
  finishedSemester,
  email,
  mobileNumber,
  "idPhoto": idPhoto.asset->originalFilename,
  "voucher": voucher.asset->originalFilename,
}`;

export const getAllParticipants = groq`
*[_type == "participants"] {
  _id, 

  birthDate,
  class,
  degree,
  email,
  mobileNumber,
  name,
  socialNumber,
  "university": university -> name,
  "faculty":faculty -> name,
  "subject":subject -> name,

  advisorName,
  advisorEmail,
  advisorMobileNumber,
  advisorTitle,
  "advisorUniversity": advisorUniversity -> name,
  "advisorFaculty":advisorFaculty -> name,
  "advisorSubject":advisorSubject -> name,
  "advisorCertificate": advisorCertificate.asset->{url, originalFilename},

  title,
  "extract": extract.asset->{url, originalFilename},
  "section":section -> name,

  accepted,
}`;

export const querySectionsForScoring = groq`
*[_type == "sections" && active == true ]{
  name,
  _id,
  criteria[]->{
    name,
    maxScore,
    _id
  }
}`;

export const sectionParticipants = (section: string) => groq`
*[_type == "participants" && section._ref == "${section}" && accepted == true] {
  _id, 
  name,

  title,
  "extract": extract.asset->{url},
  "section":section -> name,
  score[] {
    criteria->{name, _id},
    score
  }
}`;

type Response = {
  [key in "body" | "error"]: string | Array<any>;
};

export const fetcher = async (url: string, data?: any, isFormData = false) => {
  return await fetch(`/api${url}`, {
    method: data ? "POST" : "GET",
    ...(!isFormData && {
      headers: {
        "Content-Type": "application/json",
      },
    }),
    body: data,
  })
    .then((res) => {
      return res.json();
    })
    .then((r: Response) => {
      if (r.error) {
        console.log(r);
        return r;
      } else {
        return r.body;
      }
    });
};
