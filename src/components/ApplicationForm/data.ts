import { getClient } from "@lib/sanity";
import { nanoid } from "nanoid";
import { AdvisorInputs, PersonInputs } from "./constants";

export const mapAdvisorData = async (
  advisorData: AdvisorInputs,
  uploadImage: boolean
) => {
  const certificateData =
    uploadImage &&
    advisorData.certificate &&
    typeof advisorData.certificate === "object"
      ? await getClient()
          .assets.upload("file", advisorData.certificate, {
            filename: advisorData.certificate.name,
          })
          .then((r) => r._id)
      : advisorData.certificateId || null;
  return {
    _key: nanoid(),
    name: advisorData.name,
    ...(advisorData.universityOther
      ? {
          universityOther: advisorData.universityOther,
        }
      : {
          university: {
            _type: "reference",
            _ref: advisorData.university,
          },
        }),
    title: advisorData.title,
    email: advisorData.email,
    mobileNumber: advisorData.mobileNumber,
    ...(certificateData && {
      certificate: {
        _type: "file",
        asset: {
          _ref: certificateData,
          _type: "reference",
        },
      },
    }),
  };
};

export const mapCompanionsData = async (
  participantData: PersonInputs,
  uploadImage: boolean
) => {
  const idPhotoData =
    uploadImage &&
    participantData.idPhoto &&
    typeof participantData.idPhoto === "object"
      ? await getClient()
          .assets.upload("file", participantData.idPhoto, {
            filename: participantData.idPhoto.name,
          })
          .then((r) => r._id)
      : participantData.idPhotoId || null;
  return {
    _key: nanoid(),
    name: participantData.name,
    idNumber: participantData.idNumber,
    ...(participantData.universityOther
      ? { universityOther: participantData.universityOther }
      : {
          university: {
            _type: "reference",
            _ref: participantData.university,
          },
        }),

    ...(participantData.facultyOther
      ? { facultyOther: participantData.facultyOther }
      : {
          faculty: {
            _type: "reference",
            _ref: participantData.faculty,
          },
        }),
    ...(participantData.subjectOther
      ? { subjectOther: participantData.subjectOther }
      : {
          subject: {
            _type: "reference",
            _ref: participantData.subject,
          },
        }),
    degree: participantData.degree,
    class: participantData.class,
    finishedSemester: participantData.finishedSemester,
    email: participantData.email,
    mobileNumber: participantData.mobileNumber,
    ...(idPhotoData && {
      idPhoto: {
        _type: "file",
        asset: {
          _ref: idPhotoData,
          _type: "reference",
        },
      },
    }),
  };
};
