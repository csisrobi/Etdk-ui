export default {
  title: "Szekciók",
  name: "sections",
  type: "document",
  fields: [
    {
      title: "Név",
      name: "name",
      type: "string",
    },
    {
      title: "Slug",
      name: "slug",
      type: "string",
      description:
        "Ez fog megjelenni az urlbe pld: https://etdk.kmdsz.ro/allam-es-jogtudomany, lehetoleg ekezet nelkul",
    },
    {
      title: "Követelmények",
      name: "requirement",
      type: "array",
      of: [{ type: "block" }],
    },
  ],
};