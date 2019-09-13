!(function(e, n) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = n())
    : "function" == typeof define && define.amd
    ? define(n)
    : (e.reactCssModulesMacro = n());
})(this, function() {
  function e(e) {
    return (
      (function(e) {
        if (Array.isArray(e)) {
          for (var n = 0, t = new Array(e.length); n < e.length; n++)
            t[n] = e[n];
          return t;
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
    t = require("../package.json").name;
  return n(function(n) {
    var r = n.references.macro,
      i = n.babel.types;
    (void 0 === r ? [] : r).forEach(function(n) {
      var r = n.parent.arguments[0];
      if (((r.name = "s"), console.log(r), !r))
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
        u = a.scope.generateUidIdentifier("getStyleName"),
        l = a.scope.generateUidIdentifier("bindStyleNames"),
        f = i.importDeclaration(
          [i.importDefaultSpecifier(l)],
          i.stringLiteral("".concat(t, "/dist/bindStyleName")),
        ),
        c = i.variableDeclaration("const", [
          i.variableDeclarator(u, i.callExpression(l, [r])),
        ]);
      o.insertBefore(f),
        s.insertBefore(c),
        a.traverse(
          (function(n, t) {
            return {
              JSXElement: function(r) {
                if (r.node.openingElement.attributes.length) {
                  var i = r.node.openingElement.attributes.find(function(e) {
                    return "styleName" === e.name.name;
                  });
                  if (i) {
                    !(function(n) {
                      n.node.openingElement.attributes = e(
                        n.node.openingElement.attributes.filter(function(e) {
                          return "styleName" !== e.name.name;
                        }),
                      );
                    })(r);
                    var a = (function(e, n) {
                        if (e.isStringLiteral(n.value)) {
                          if (!n.value.value) return;
                          var t = n.value.value.split(" ").map(function(n) {
                            return e.stringLiteral(n);
                          });
                          return t.length > 1
                            ? e.arrayExpression(t)
                            : t[0]
                            ? t[0]
                            : void 0;
                        }
                        return n.value.expression;
                      })(n, i),
                      o = n.callExpression(t, e([a].filter(Boolean))),
                      s = (function(e) {
                        return e.node.openingElement.attributes.find(function(
                          e,
                        ) {
                          return "className" === e.name.name;
                        });
                      })(r);
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
                        (r.node.openingElement.attributes = [s]);
                    else {
                      var u = (function(e, n) {
                        return e.JSXAttribute(e.jsxIdentifier("className"), n);
                      })(n, n.JSXExpressionContainer(o));
                      r.node.openingElement.attributes = [u];
                    }
                  }
                }
              },
            };
          })(i, u),
        );
    });
  });
});
//# sourceMappingURL=react-css-modules.macro.umd.js.map
