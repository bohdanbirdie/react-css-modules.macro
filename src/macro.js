const { createMacro } = require("babel-plugin-macros");
const { name } = require("../package.json");

const defaultConfig = {
  enableMemo: true,
  targetTag: "styleName",
  warning: false,
};

const ensureAttrName = attr => {
  if (attr && attr.name && attr.name.name) {
    return attr.name.name;
  }

  return "";
};

const removeStyleNameAttr = (path, config) => {
  path.node.openingElement.attributes = [
    ...path.node.openingElement.attributes.filter(
      attr => ensureAttrName(attr) !== config.targetTag,
    ),
  ];
};

const findClassNameAttr = path => {
  return path.node.openingElement.attributes.find(
    attr => ensureAttrName(attr) === "className",
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

const visitor = (t, getStyleNameIdentifier, config) => ({
  JSXElement(path) {
    if (path.node.openingElement.attributes.length) {
      const styleNameAttr = path.node.openingElement.attributes.find(
        attr => ensureAttrName(attr) === config.targetTag,
      );
      if (styleNameAttr) {
        removeStyleNameAttr(path, config);
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

          path.node.openingElement.attributes = [
            classNameAttr,
            ...path.node.openingElement.attributes.filter(
              node => ensureAttrName(node) !== "className",
            ),
          ];
        } else {
          const newClassNameAttr = createClassNameAttr(
            t,
            t.JSXExpressionContainer(styleNameExp),
          );

          path.node.openingElement.attributes = [
            newClassNameAttr,
            ...path.node.openingElement.attributes.filter(
              node => ensureAttrName(node) !== "className",
            ),
          ];
        }
      }
    }
  },
});

const getStylesArgument = path => path.parent.arguments[0];

const myMacro = ({ references, babel, config }) => {
  const marcoConfig = { ...defaultConfig, ...config };
  const { macro = [] } = references;
  const { types: t } = babel;
  macro.forEach(referencePath => {
    const stylesArgument = getStylesArgument(referencePath);

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
        t.callExpression(bindStyleNames, [
          stylesArgument,
          marcoConfig.warning
            ? t.booleanLiteral(true)
            : t.booleanLiteral(false),
        ]),
      ),
    ]);

    firstImportDeclarationNode.insertBefore(helperImportDeclaration);
    firstNonImportDeclarationNode.insertBefore(bindedStylesDeclaration);

    programPath.traverse(visitor(t, getStyleNameIdentifier, marcoConfig));
  });
};

export default createMacro(myMacro, { configName: "reactCssModulesMacro" });
