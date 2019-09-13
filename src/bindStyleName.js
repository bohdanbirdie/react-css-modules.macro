// TODO: memo should be optional
import memoizee from "memoizee";

const getClassNames = (input, stylesMap) =>
  input.map(name => stylesMap[name] || name).join(" ");

const bindStyleName = stylesMap => {
  return memoizee(
    styleNames => {
      if (styleNames) {
        if (Array.isArray(styleNames)) {
          return ` ${getClassNames(styleNames, stylesMap)}`;
        }

        if (typeof styleNames === "string") {
          return ` ${getClassNames(styleNames.split(" "), stylesMap)}`;
        }

        if (typeof styleNames === "object") {
          const keys = Object.keys(styleNames).filter(key => styleNames[key]);
          return ` ${getClassNames(keys, stylesMap)}`;
        }
      }
      return "";
    },
    { length: 1, maxAge: 5000, primitive: true },
  );
};

export default bindStyleName;
