export default {
  title: "Egyetemek",
  name: "universities",
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
