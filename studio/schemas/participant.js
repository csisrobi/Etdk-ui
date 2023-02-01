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
  ],
};
