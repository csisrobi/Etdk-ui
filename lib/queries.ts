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
  files[] {
    name,
    "url": file.asset->url,
  }
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

export const queryScoringCriteria = groq`
*[_type == "general"]{
  scoringcriteria
}`;

export const querySchedule = groq`
*[_type == "general"]{
  schedule
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

export const queryWinners = groq`
*[_type == "winners"]{
  winnerPersons,
  section->{name}
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
  role,
  _id
}`;

export const getProjectsDataForParticipant = (email: string) => groq`
*[_type == "participants" && email == "${email}"]{
  _id,
  title,
  "section":section -> _id,
  "extract": extract.asset->originalFilename,
  "essay":essay.asset->originalFilename,
  "contribution": contribution.asset->originalFilename,
  "annex": annex.asset->originalFilename,

  companions[]{
    _key,
    name,
    idNumber,
    "university": university -> _id,
    universityOther,
    "faculty":faculty -> _id,
    facultyOther,
    "subject":subject -> _id,
    subjectOther,
    degree,
    class,
    finishedSemester,
    email,
    mobileNumber,
    "idPhoto": idPhoto.asset->originalFilename,
    "idPhotoId": idPhoto.asset->_id,
    "voucher": voucher.asset-> originalFilename,
    "voucherId": voucher.asset->_id,
  },

  advisors[]{
    _key,
    name,
    "university": university -> _id,
    universityOther,
    title,
    email,
    "certificate": certificate.asset->originalFilename,
    "certificateId": certificate.asset->_id,

  }
}`;

export const getPersonDataForParticipant = (email: string) => groq`
*[_type == "participants" && email == "${email}"]{
  name,
  idNumber,
  "university": university -> _id,
  universityOther,
  "faculty":faculty -> _id,
  facultyOther,
  "subject":subject -> _id,
  subjectOther,
  degree,
  class,
  finishedSemester,
  email,
  mobileNumber,
  "idPhoto": idPhoto.asset-> originalFilename,
  "voucher": voucher.asset-> originalFilename,
}`;

export const getAllParticipants = groq`
*[_type == "participants"] {
  _id, 
  "registrationDate": _createdAt,
  name,
  idNumber,
  "university": university -> name,
  universityOther,
  "faculty":faculty -> name,
  facultyOther,
  "subject":subject -> name,
  subjectOther,
  degree,
  class,
  finishedSemester,
  email,
  mobileNumber,
  "idPhoto": idPhoto.asset->{url, originalFilename},
  "voucher": voucher.asset->{url, originalFilename},

  title,
  "section":section -> name,
  "merged_section":merged_section -> name,
  accepted,
  "extract": extract.asset->{url, originalFilename},
  "annex": annex.asset->{url, originalFilename},
  "contribution": contribution.asset->{url, originalFilename},
  "essay": essay.asset->{url, originalFilename},


  companions[]{
    name,
    idNumber,
    "university": university -> name,
    universityOther,
    "faculty":faculty -> name,
    facultyOther,
    "subject":subject -> name,
    subjectOther,
    degree,
    class,
    finishedSemester,
    email,
    mobileNumber,
    "idPhoto": idPhoto.asset->{url, originalFilename},
    "voucher": voucher.asset->{url, originalFilename},
  },

  advisors[]{
    name,
    "university": university -> name,
    universityOther,
    title,
    email,
    "certificate": certificate.asset->{url, originalFilename},
  },

  score[] {
    scorer -> {email, _id},
    score[] {
      criteria->{name, _id},
      score,
    }, 
    _key,
    otdk_nominated,
    publish_nominated,
  }
}`;

export const querySectionsForScoring = groq`
*[_type == "sections" ]{
  name,
  _id,
  active,
  closed,
  criteria[]->{
    name,
    maxScore,
    written,
    _id
  }
}`;

export const sectionParticipants = (section: string) => groq`
*[_type == "participants" && "${section}" in [section._ref, merged_section._ref] && accepted == true ] {
  _id, 
  name,

  title,
  "extract": extract.asset->{url, originalFilename},
  "annex": annex.asset->{url, originalFilename},
  "contribution": contribution.asset->{url, originalFilename},
  "essay": essay.asset->{url, originalFilename},
  "section" : section -> {_id, name},
  "merged_section":merged_section -> {_id, name},
  score[] {
    scorer -> {email, _id},
    score[] {
      criteria->{name, _id},
      score,
    }, 
    _key,
    otdk_nominated,
    publish_nominated,
  }
}`;

export const adminSections = (email: string) => groq`
*[_type == "admins" && email == "${email}" ] {
  sections
}`;

export const getParticipantScore = (id: string) => groq`
*[_type == "participants" && _id == "${id}" ] {
  score[] {
    scorer -> {email, _id},
    score[] {
      criteria->{name, _id},
      score,
    }, 
    _key,
  }
}`;

export const querySectionScorers = groq`
*[_type == "sections" && active == true ] {
  name,
  scorers[] -> {name}
}`;

export const queryAllCriteria = groq`
*[_type == "criteria" ] {
  name,
  _id
}`;

export const queryAllDeadline = groq`
*[_type == "deadlines" ] {
  applicationStart,
  applicationEnd,
  documentUploadStart,
  documentUploadEnd,
  dataCheckStart,
  dataCheckEnd,
  scoringStart,
  scoringEnd,
  scoringCheckStart,
  scoringCheckEnd
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
        return r;
      } else {
        return r.body;
      }
    });
};
