const getClassNames = (input, stylesMap) =>
  input.map(name => stylesMap[name] || name).join(" ");

const bindStyleName = stylesMap => {
  return styleNames => {
    if (styleNames) {
      if (typeof styleNames === "string") {
        return " " + getClassNames(styleNames.split(" "), stylesMap);
      }

      if (Array.isArray(styleNames)) {
        return " " + getClassNames(styleNames, stylesMap);
      }

      if (typeof styleNames === "object") {
        const keys = Object.keys(styleNames).filter(key => styleNames[key]);
        return " " + getClassNames(keys, stylesMap);
      }
    }
    return "";
  };
};

export default bindStyleName;
