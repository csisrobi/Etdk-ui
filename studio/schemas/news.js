export default {
  title: "Hírek",
  name: "news",
  type: "document",
  fields: [
    {
      title: "Név",
      name: "name",
      type: "string",
      description:
        "Ez fog megjelenni az URLbe, ha valaki rámegy, pld news/elkezdodott-a-regisztracio",
    },
    {
      title: "Összefoglaló",
      name: "summary",
      type: "string",
      description: "Ez egy rövid leirás ami a kis kártyán fog megjelenni",
    },
    {
      title: "Publikálási dátum",
      name: "date",
      type: "date",
      options: {
        dateFormat: "YYYY.MM.DD",
        calendarTodayLabel: "Today",
      },
    },
    {
      title: "Kiemelt kép",
      name: "featuredImage",
      type: "image",
    },
    {
      title: "Leirás",
      name: "description",
      type: "array",
      of: [{ type: "block" }],
    },
  ],
};
