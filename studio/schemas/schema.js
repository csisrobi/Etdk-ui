import createSchema from "part:@sanity/base/schema-creator";
import schemaTypes from "all:part:@sanity/base/schema-type";
import sponsor from "./sponsor";
import organizer from "./organizer";
import news from "./news";
import singletonGeneralData from "./singletionGeneralData";
import singletonContact from "./singletonContact";
import whyApplicateData from "./whyApplicateData";
import sections from "./sections";
import archiv from "./archiv";

export default createSchema({
  name: "default",
  types: schemaTypes.concat([
    sponsor,
    organizer,
    news,
    sections,
    archiv,
    singletonGeneralData,
    singletonContact,
    whyApplicateData,
  ]),
});
