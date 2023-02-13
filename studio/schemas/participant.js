export default {
  name: "participants",
  title: "Résztvevők",
  type: "document",
  fields: [
    {
      title: "Név",
      name: "name",
      type: "string",
    },
    {
      title: "Email",
      name: "email",
      type: "string",
    },
    {
      title: "Telefonszám",
      name: "mobileNumber",
      type: "string",
    },
    {
      title: "Születési dátum",
      name: "birthDate",
      type: "date",
    },
    {
      title: "Személyi szám",
      name: "socialNumber",
      type: "string",
    },
    {
      title: "Képzési szint",
      name: "degree",
      type: "string",
    },
    {
      title: "Évfolyam",
      name: "class",
      type: "string",
    },
    {
      title: "Egyetem",
      name: "university",
      type: "reference",
      to: [{ type: "universities" }],
      options: {
        disableNew: true,
      },
    },
    {
      title: "Kar",
      name: "faculty",
      type: "reference",
      to: [{ type: "faculties" }],
      options: {
        disableNew: true,
      },
    },
    {
      title: "Szak",
      name: "subject",
      type: "reference",
      to: [{ type: "subjects" }],
      options: {
        disableNew: true,
      },
    },

    {
      title: "Témavezető név",
      name: "advisorName",
      type: "string",
    },
    {
      title: "Témavezető email",
      name: "advisorEmail",
      type: "string",
    },
    {
      title: "Témavezető telefonszám",
      name: "advisorMobileNumber",
      type: "string",
    },
    {
      title: "Témavezető titulus",
      name: "advisorTitle",
      type: "string",
    },
    {
      title: "Témavezető egyetem",
      name: "advisorUniversity",
      type: "reference",
      to: [{ type: "universities" }],
      options: {
        disableNew: true,
      },
    },
    {
      title: "Témavezető kar",
      name: "advisorFaculty",
      type: "reference",
      to: [{ type: "faculties" }],
      options: {
        disableNew: true,
      },
    },
    {
      title: "Témavezető szak",
      name: "advisorSubject",
      type: "reference",
      to: [{ type: "subjects" }],
      options: {
        disableNew: true,
      },
    },
    {
      title: "Témavezető igazolás",
      name: "advisorCertificate",
      type: "file",
    },

    {
      title: "Dolgozat cím",
      name: "title",
      type: "string",
    },
    {
      title: "Dolgozat kivonat",
      name: "extract",
      type: "file",
    },
    {
      title: "Szekció",
      name: "section",
      type: "reference",
      to: [{ type: "sections" }],
      options: {
        disableNew: true,
      },
    },
  ],
  preview: {
    select: {
      title: "name",
    },
  },
};
