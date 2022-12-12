import S from "@sanity/desk-tool/structure-builder";

const hiddenDocTypes = (listItem) =>
  !["general", "contact", "applicate"].includes(listItem.getId());

export default () =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Általános adatok")
        .child(
          S.editor()
            .id("general")
            .schemaType("general")
            .documentId("singleton-general")
        ),
      S.listItem()
        .title("Kapcsolat")
        .child(
          S.editor()
            .id("contact")
            .schemaType("contact")
            .documentId("singleton-contact")
        ),
      S.listItem()
        .title("Miért jelentkezz?")
        .child(
          S.editor()
            .id("applicate")
            .schemaType("applicate")
            .documentId("singleton-applicate")
        ),
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ]);
