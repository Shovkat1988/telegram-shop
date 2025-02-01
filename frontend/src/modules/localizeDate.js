const localizeDate = (date) =>
  new Date(date * 1000).toLocaleString("ru", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default localizeDate;
