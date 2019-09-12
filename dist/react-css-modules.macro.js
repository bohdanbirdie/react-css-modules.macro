var e = require("babel-plugin-macros").createMacro,
  n = require("../package.json").name,
  t = e(function(e) {
    var t = e.references.macro,
      r = e.babel.types;
    (void 0 === t ? [] : t).forEach(function(e) {
      var t = e.parent.arguments[0];
      if (!t) throw "Styles map argument must be provided";
      var i = e.findParent(function(e) {
        return e.isProgram();
      });
      e.parentPath.remove();
      var a = i.get("body").find(function(e) {
          return r.isImportDeclaration(e);
        }),
        o = i.get("body").find(function(e) {
          return !r.isImportDeclaration(e);
        }),
        s = i.scope.generateUidIdentifier("getStyleName"),
        u = i.scope.generateUidIdentifier("bindStyleNames"),
        l = r.importDeclaration(
          [r.importDefaultSpecifier(u)],
          r.stringLiteral("".concat(n, "/dist/bindStyleName")),
        ),
        c = r.variableDeclaration("const", [
          r.variableDeclarator(s, r.callExpression(u, [t])),
        ]);
      a.insertBefore(l),
        o.insertBefore(c),
        i.traverse(
          (function(e, n) {
            return {
              JSXElement: function(t) {
                if (t.node.openingElement.attributes.length) {
                  var r = t.node.openingElement.attributes.find(function(e) {
                    return "styleName" === e.name.name;
                  });
                  if (r) {
                    !(function(e) {
                      var n;
                      e.node.openingElement.attributes =
                        (function(e) {
                          if (Array.isArray(e)) {
                            for (
                              var n = 0, t = new Array(e.length);
                              n < e.length;
                              n++
                            )
                              t[n] = e[n];
                            return t;
                          }
                        })(
                          (n = e.node.openingElement.attributes.filter(function(
                            e,
                          ) {
                            return "styleName" !== e.name.name;
                          })),
                        ) ||
                        (function(e) {
                          if (
                            Symbol.iterator in Object(e) ||
                            "[object Arguments]" ===
                              Object.prototype.toString.call(e)
                          )
                            return Array.from(e);
                        })(n) ||
                        (function() {
                          throw new TypeError(
                            "Invalid attempt to spread non-iterable instance",
                          );
                        })();
                    })(t);
                    var i = (function(e, n) {
                        return e.isStringLiteral(n.value)
                          ? n.value
                          : n.value.expression;
                      })(e, r),
                      a = e.callExpression(n, [i]),
                      o = (function(e) {
                        return e.node.openingElement.attributes.find(function(
                          e,
                        ) {
                          return "className" === e.name.name;
                        });
                      })(t);
                    if (o)
                      e.isJSXExpressionContainer(o.value) &&
                        (o.value = e.JSXExpressionContainer(
                          e.binaryExpression("+", o.value.expression, a),
                        )),
                        e.isStringLiteral(o.value) &&
                          (o.value = e.JSXExpressionContainer(
                            e.binaryExpression("+", o.value, a),
                          )),
                        (t.node.openingElement.attributes = [o]);
                    else {
                      var s = (function(e, n) {
                        return e.JSXAttribute(e.jsxIdentifier("className"), n);
                      })(e, e.JSXExpressionContainer(a));
                      t.node.openingElement.attributes = [s];
                    }
                  }
                }
              },
            };
          })(r, s),
        );
    });
  });
module.exports = t;
//# sourceMappingURL=react-css-modules.macro.js.map
