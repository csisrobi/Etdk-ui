export default {
  title: "Letölthető dokumentumok",
  name: "files",
  type: "document",
  __experimental_actions: ["create", "update", /*"delete",*/ "publish"],
  fields: [
    { title: "Témavezetői igazolás", name: "certificate", type: "file" },
    {
      title: "Adatbankos nyilatkozat - a kivonatos füzetre vonatkozóan",
      name: "declaration",
      type: "file",
    },
    {
      title: "Adatbankos nyilatkozat - a dolgozatra vonatkozóan",
      name: "declarationProject",
      type: "file",
    },
    {
      title: "Hozzájárulási nyilatkozat - a Biológia szekcióban résztvevőknek",
      name: "contribution",
      type: "file",
    },
  ],
};
