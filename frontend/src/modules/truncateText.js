const truncateText = (text, maxLength = 35) => {
  if (text.length > maxLength) {
    return text.trim().slice(0, maxLength - 3) + "...";
  }

  return text;
};

export default truncateText;
