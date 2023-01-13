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
      title: "Karok",
      name: "faculties",
      type: "reference",
      to: [{ type: "faculties" }],
      options: {
        disableNew: true,
      },
    },
  ],
};
