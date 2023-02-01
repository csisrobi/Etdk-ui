const customCollate = (a, b) => {
  console.log(a, b);
  const normalizedA = a.normalize("NFD").toLowerCase();
  const normalizedB = b.normalize("NFD").toLowerCase();
  return normalizedA.localeCompare(normalizedB, "hu", {
    sensitivity: "accent",
  });
};

export default {
  title: "Szekciók",
  name: "sections",
  type: "document",
  fields: [
    {
      title: "Név",
      name: "name",
      type: "string",
      collate: customCollate,
    },
    {
      title: "Slug",
      name: "slug",
      type: "string",
      description:
        "Ez fog megjelenni az urlbe pld: https://etdk.kmdsz.ro/allam-es-jogtudomany, lehetoleg ekezet nelkul",
    },
    {
      title: "Aktív",
      name: "active",
      type: "boolean",
    },
    {
      title: "Kép",
      name: "image",
      type: "image",
    },
    {
      title: "Követelmények",
      name: "requirement",
      type: "array",
      of: [{ type: "block" }],
    },
  ],
};
