const getClassNames = (input, stylesMap, warningEnabled) => {
  if (warningEnabled) {
    input
      .map(name => {
        if (stylesMap[name]) {
          return stylesMap[name];
        }

        console.warn(`${name} key is missing in provided styles map`);

        return name;
      })
      .join(" ");
  }

  return input.map(name => stylesMap[name] || name).join(" ");
};

const bindStyleName = memoWrapper => (stylesMap, warningEnabled) => {
  return memoWrapper(
    styleNames => {
      if (styleNames) {
        if (Array.isArray(styleNames)) {
          return ` ${getClassNames(styleNames, stylesMap, warningEnabled)}`;
        }

        if (typeof styleNames === "string") {
          return ` ${getClassNames(
            styleNames.split(" "),
            stylesMap,
            warningEnabled,
          )}`;
        }

        if (typeof styleNames === "object") {
          const keys = Object.keys(styleNames).filter(key => styleNames[key]);
          return ` ${getClassNames(keys, stylesMap, warningEnabled)}`;
        }
      }
      return "";
    },
    { length: 1, maxAge: 5000, primitive: true },
  );
};

export default bindStyleName;
