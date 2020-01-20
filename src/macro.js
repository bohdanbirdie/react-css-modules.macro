const { createMacro } = require("babel-plugin-macros");
const { name } = require("../package.json");

const defaultConfig = {
  enableMemo: true,
  targetTag: "styleName",
  warning: true,
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

const createClassNameOmmitedSpread = (spreadAttr, t) => {
  return t.JSXSpreadAttribute(
    t.callExpression(
      t.ArrowFunctionExpression(
        [],
        t.BlockStatement([
          t.VariableDeclaration("const", [
            t.VariableDeclarator(
              t.identifier("k"),
              t.ObjectExpression([t.SpreadElement(spreadAttr.argument)]),
            ),
          ]),
          t.ExpressionStatement(
            t.UnaryExpression(
              "delete",
              t.memberExpression(
                t.identifier("k"),
                t.StringLiteral("className"),
                true,
              ),
            ),
          ),
          t.ReturnStatement(t.identifier("k")),
        ]),
      ),
      [],
    ),
  );
};

const findStyleNameAttrIndex = (path, config, t) => {
  const list = path.node.openingElement.attributes.map(attr => {
    return t.isJSXAttribute(attr) && ensureAttrName(attr) === config.targetTag;
  });

  return list.indexOf(true);
};

const findClassNameAttr = (path, t) => {
  return path.node.openingElement.attributes.find(
    attr => ensureAttrName(attr) === "className",
  );
};

const findJSXSpreadAttr = (path, t) => {
  const propsSpread = path.node.openingElement.attributes.find(attr => {
    return t.isJSXSpreadAttribute(attr);
  });

  if (propsSpread) {
    return propsSpread;
  }
  return false;
};

const getMemberExpressionFromSpread = (spread, t) => {
  if (spread) {
    return t.memberExpression(spread.argument, t.identifier("className"));
  }
  return false;
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
      const spreadAttr = findJSXSpreadAttr(path, t);
      const classNameFromSpread = getMemberExpressionFromSpread(spreadAttr, t);
      const styleNameAttrIndex = findStyleNameAttrIndex(path, config, t);

      const styleNameAttr = path.node.openingElement.attributes.find(
        attr => ensureAttrName(attr) === config.targetTag,
      );

      if (styleNameAttr) {
        const styleNameAttrPayload = getStyleNameAttrPayload(t, styleNameAttr);

        const styleNameExp = t.callExpression(getStyleNameIdentifier, [
          ...[styleNameAttrPayload].filter(Boolean),
        ]);
        const classNameAttr = findClassNameAttr(path, t);

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
          removeStyleNameAttr(path, config);
        } else {
          const newClassNameAttr = createClassNameAttr(
            t,
            t.JSXExpressionContainer(
              spreadAttr
                ? t.binaryExpression("+", classNameFromSpread, styleNameExp)
                : styleNameExp,
            ),
          );

          path.node.openingElement.attributes[
            styleNameAttrIndex
          ] = newClassNameAttr;
          const spreadIndex = path.node.openingElement.attributes.indexOf(
            spreadAttr,
          );

          if (spreadIndex >= 0) {
            path.node.openingElement.attributes[
              spreadIndex
            ] = createClassNameOmmitedSpread(spreadAttr, t);
          }
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
