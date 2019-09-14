const { createMacro } = require("babel-plugin-macros");
const { name } = require("../package.json");

const defaultConfig = {
  enableMemo: true,
};

const removeStyleNameAttr = path => {
  path.node.openingElement.attributes = [
    ...path.node.openingElement.attributes.filter(
      attr => attr.name.name !== "styleName",
    ),
  ];
};

const findClassNameAttr = path => {
  return path.node.openingElement.attributes.find(
    attr => attr.name.name === "className",
  );
};

const createClassNameAttr = (t, value) => {
  return t.JSXAttribute(t.jsxIdentifier("className"), value);
};

const getStyleNameAttrPayload = (t, styleNameAttr) => {
  if (t.isStringLiteral(styleNameAttr.value)) {
    if (!styleNameAttr.value.value) {
      return undefined;
    }
    const stringValueReplacement = styleNameAttr.value.value
      .split(" ")
      .map(val => t.stringLiteral(val));
    if (stringValueReplacement.length > 1) {
      return t.arrayExpression(stringValueReplacement);
    }

    if (stringValueReplacement[0]) {
      return stringValueReplacement[0];
    }

    return undefined;
  }

  return styleNameAttr.value.expression;
};

const visitor = (t, getStyleNameIdentifier) => ({
  JSXElement(path) {
    if (path.node.openingElement.attributes.length) {
      const styleNameAttr = path.node.openingElement.attributes.find(
        attr => attr.name.name === "styleName",
      );
      if (styleNameAttr) {
        removeStyleNameAttr(path);
        const styleNameAttrPayload = getStyleNameAttrPayload(t, styleNameAttr);

        const styleNameExp = t.callExpression(getStyleNameIdentifier, [
          ...[styleNameAttrPayload].filter(Boolean),
        ]);
        const classNameAttr = findClassNameAttr(path);

        if (classNameAttr) {
          if (styleNameAttrPayload) {
            if (t.isJSXExpressionContainer(classNameAttr.value)) {
              classNameAttr.value = t.JSXExpressionContainer(
                t.binaryExpression(
                  "+",
                  classNameAttr.value.expression,
                  styleNameExp,
                ),
              );
            }

            if (t.isStringLiteral(classNameAttr.value)) {
              classNameAttr.value = t.JSXExpressionContainer(
                t.binaryExpression("+", classNameAttr.value, styleNameExp),
              );
            }
          }

          path.node.openingElement.attributes = [classNameAttr];
        } else {
          const newClassNameAttr = createClassNameAttr(
            t,
            t.JSXExpressionContainer(styleNameExp),
          );
          path.node.openingElement.attributes = [newClassNameAttr];
        }
      }
    }
  },
});

const getStylesArgument = path => path.parent.arguments[0];

const myMacro = ({ references, babel, config }) => {
  console.log("config", config);
  const marcoConfig = { ...defaultConfig, ...config };
  const { macro = [] } = references;
  const { types: t } = babel;
  macro.forEach(referencePath => {
    const stylesArgument = getStylesArgument(referencePath);
    // stylesArgument.name = "s";
    // console.log(stylesArgument);
    if (!stylesArgument) {
      throw "Styles map argument must be provided";
    }

    const programPath = referencePath.findParent(parentPath =>
      parentPath.isProgram(),
    );
    referencePath.parentPath.remove();
    const firstImportDeclarationNode = programPath
      .get("body")
      .find(node => t.isImportDeclaration(node));

    const firstNonImportDeclarationNode = programPath
      .get("body")
      .find(node => !t.isImportDeclaration(node));

    const getStyleNameIdentifier = programPath.scope.generateUidIdentifier(
      "getStyleName",
    );

    const bindStyleNames = programPath.scope.generateUidIdentifier(
      "bindStyleNames",
    );

    const bindImplementation = marcoConfig.enableMemo
      ? `${name}/dist/bindStyleNameMemo`
      : `${name}/dist/bindStyleNamePure`;
    const helperImportDeclaration = t.importDeclaration(
      [t.importDefaultSpecifier(bindStyleNames)],
      t.stringLiteral(bindImplementation),
    );

    const bindedStylesDeclaration = t.variableDeclaration("const", [
      t.variableDeclarator(
        getStyleNameIdentifier,
        t.callExpression(bindStyleNames, [stylesArgument]),
      ),
    ]);

    firstImportDeclarationNode.insertBefore(helperImportDeclaration);
    firstNonImportDeclarationNode.insertBefore(bindedStylesDeclaration);

    programPath.traverse(visitor(t, getStyleNameIdentifier));
  });
};
// TODO: fix issue with config that could not be find
export default createMacro(myMacro, { configName: "reactCssModulesMacro" });
