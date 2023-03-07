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
      title: "Ellenőrző száma",
      name: "idNumber",
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
      title: "Elvégzett félévek száma",
      name: "finishedSemester",
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
      title: "Ellenőrző kép",
      name: "idPhoto",
      type: "file",
    },

    {
      title: "Témavezető név",
      name: "advisorName",
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
      title: "Témavezető titulus",
      name: "advisorTitle",
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

    {
      title: "Melléklet",
      name: "annex",
      type: "file",
    },
    {
      title: "Adatbankos nyilatkozat",
      name: "declaration",
      type: "file",
    },
    {
      title: "Kifizetési bizonylat",
      name: "voucher",
      type: "file",
    },
    {
      title: "Hozzájárulási nyilatkozat",
      name: "contribution",
      type: "file",
    },

    {
      title: "Elért pontszámok",
      name: "score",
      type: "array",
      of: [
        {
          title: "Elért pontszám",
          type: "object",
          fields: [
            {
              title: "Kritérium",
              name: "criteria",
              type: "reference",
              to: [{ type: "criteria" }],
              options: {
                disableNew: true,
              },
            },
            {
              title: "Pontszám",
              name: "score",
              type: "number",
            },
          ],
          preview: {
            select: {
              title: "criteria.name",
              score: "score",
            },
            prepare(selection) {
              const { title, score } = selection;
              return {
                title: `${title} ${score}`,
              };
            },
          },
        },
      ],
    },

    {
      title: "Elfogadva",
      name: "accepted",
      type: "boolean",
    },
  ],
  preview: {
    select: {
      title: "name",
      section: "section.name",
    },
    prepare(selection) {
      const { title, section } = selection;
      return {
        title: `${title} ${section}`,
      };
    },
  },
};
