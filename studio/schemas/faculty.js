export default {
  title: "Karok",
  name: "faculties",
  type: "document",
  fields: [
    {
      title: "Név",
      name: "name",
      type: "string",
    },
    {
      title: "Szakok",
      name: "subjects",
      type: "reference",
      to: [{ type: "subjects" }],
      options: {
        disableNew: true,
      },
    },
  ],
};
