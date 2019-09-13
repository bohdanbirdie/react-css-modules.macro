function e(e) {
  return (
    (function(e) {
      if (Array.isArray(e)) {
        for (var n = 0, r = new Array(e.length); n < e.length; n++) r[n] = e[n];
        return r;
      }
    })(e) ||
    (function(e) {
      if (
        Symbol.iterator in Object(e) ||
        "[object Arguments]" === Object.prototype.toString.call(e)
      )
        return Array.from(e);
    })(e) ||
    (function() {
      throw new TypeError("Invalid attempt to spread non-iterable instance");
    })()
  );
}
var n = require("babel-plugin-macros").createMacro,
  r = require("../package.json").name,
  t = n(function(n) {
    var t = n.references.macro,
      i = n.babel.types;
    (void 0 === t ? [] : t).forEach(function(n) {
      var t = n.parent.arguments[0];
      if (((t.name = "s"), console.log(t), !t))
        throw "Styles map argument must be provided";
      var a = n.findParent(function(e) {
        return e.isProgram();
      });
      n.parentPath.remove();
      var o = a.get("body").find(function(e) {
          return i.isImportDeclaration(e);
        }),
        s = a.get("body").find(function(e) {
          return !i.isImportDeclaration(e);
        }),
        l = a.scope.generateUidIdentifier("getStyleName"),
        u = a.scope.generateUidIdentifier("bindStyleNames"),
        c = i.importDeclaration(
          [i.importDefaultSpecifier(u)],
          i.stringLiteral("".concat(r, "/dist/bindStyleName")),
        ),
        f = i.variableDeclaration("const", [
          i.variableDeclarator(l, i.callExpression(u, [t])),
        ]);
      o.insertBefore(c),
        s.insertBefore(f),
        a.traverse(
          (function(n, r) {
            return {
              JSXElement: function(t) {
                if (t.node.openingElement.attributes.length) {
                  var i = t.node.openingElement.attributes.find(function(e) {
                    return "styleName" === e.name.name;
                  });
                  if (i) {
                    !(function(n) {
                      n.node.openingElement.attributes = e(
                        n.node.openingElement.attributes.filter(function(e) {
                          return "styleName" !== e.name.name;
                        }),
                      );
                    })(t);
                    var a = (function(e, n) {
                        if (e.isStringLiteral(n.value)) {
                          if (!n.value.value) return;
                          var r = n.value.value.split(" ").map(function(n) {
                            return e.stringLiteral(n);
                          });
                          return r.length > 1
                            ? e.arrayExpression(r)
                            : r[0]
                            ? r[0]
                            : void 0;
                        }
                        return n.value.expression;
                      })(n, i),
                      o = n.callExpression(r, e([a].filter(Boolean))),
                      s = (function(e) {
                        return e.node.openingElement.attributes.find(function(
                          e,
                        ) {
                          return "className" === e.name.name;
                        });
                      })(t);
                    if (s)
                      a &&
                        (n.isJSXExpressionContainer(s.value) &&
                          (s.value = n.JSXExpressionContainer(
                            n.binaryExpression("+", s.value.expression, o),
                          )),
                        n.isStringLiteral(s.value) &&
                          (s.value = n.JSXExpressionContainer(
                            n.binaryExpression("+", s.value, o),
                          ))),
                        (t.node.openingElement.attributes = [s]);
                    else {
                      var l = (function(e, n) {
                        return e.JSXAttribute(e.jsxIdentifier("className"), n);
                      })(n, n.JSXExpressionContainer(o));
                      t.node.openingElement.attributes = [l];
                    }
                  }
                }
              },
            };
          })(i, l),
        );
    });
  });
module.exports = t;
//# sourceMappingURL=react-css-modules.macro.js.map
