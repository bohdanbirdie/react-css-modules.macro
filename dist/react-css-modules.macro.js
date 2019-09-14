function e(e, n, r) {
  return (
    n in e
      ? Object.defineProperty(e, n, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (e[n] = r),
    e
  );
}
function n(e, n) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var t = Object.getOwnPropertySymbols(e);
    n &&
      (t = t.filter(function(n) {
        return Object.getOwnPropertyDescriptor(e, n).enumerable;
      })),
      r.push.apply(r, t);
  }
  return r;
}
function r(e) {
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
var t = require("babel-plugin-macros").createMacro,
  i = require("../package.json").name,
  o = { enableMemo: !0 },
  a = t(
    function(t) {
      var a = t.references,
        s = t.babel,
        u = t.config;
      console.log("config", u);
      var l = (function(r) {
          for (var t = 1; t < arguments.length; t++) {
            var i = null != arguments[t] ? arguments[t] : {};
            t % 2
              ? n(i, !0).forEach(function(n) {
                  e(r, n, i[n]);
                })
              : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(r, Object.getOwnPropertyDescriptors(i))
              : n(i).forEach(function(e) {
                  Object.defineProperty(
                    r,
                    e,
                    Object.getOwnPropertyDescriptor(i, e),
                  );
                });
          }
          return r;
        })({}, o, {}, u),
        c = a.macro,
        f = s.types;
      (void 0 === c ? [] : c).forEach(function(e) {
        var n = e.parent.arguments[0];
        if (!n) throw "Styles map argument must be provided";
        var t = e.findParent(function(e) {
          return e.isProgram();
        });
        e.parentPath.remove();
        var o = t.get("body").find(function(e) {
            return f.isImportDeclaration(e);
          }),
          a = t.get("body").find(function(e) {
            return !f.isImportDeclaration(e);
          }),
          s = t.scope.generateUidIdentifier("getStyleName"),
          u = t.scope.generateUidIdentifier("bindStyleNames"),
          c = "".concat(
            i,
            l.enableMemo
              ? "/dist/bindStyleNameMemo"
              : "/dist/bindStyleNamePure",
          ),
          p = f.importDeclaration(
            [f.importDefaultSpecifier(u)],
            f.stringLiteral(c),
          ),
          m = f.variableDeclaration("const", [
            f.variableDeclarator(s, f.callExpression(u, [n])),
          ]);
        o.insertBefore(p),
          a.insertBefore(m),
          t.traverse(
            (function(e, n) {
              return {
                JSXElement: function(t) {
                  if (t.node.openingElement.attributes.length) {
                    var i = t.node.openingElement.attributes.find(function(e) {
                      return "styleName" === e.name.name;
                    });
                    if (i) {
                      !(function(e) {
                        e.node.openingElement.attributes = r(
                          e.node.openingElement.attributes.filter(function(e) {
                            return "styleName" !== e.name.name;
                          }),
                        );
                      })(t);
                      var o = (function(e, n) {
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
                        })(e, i),
                        a = e.callExpression(n, r([o].filter(Boolean))),
                        s = (function(e) {
                          return e.node.openingElement.attributes.find(function(
                            e,
                          ) {
                            return "className" === e.name.name;
                          });
                        })(t);
                      if (s)
                        o &&
                          (e.isJSXExpressionContainer(s.value) &&
                            (s.value = e.JSXExpressionContainer(
                              e.binaryExpression("+", s.value.expression, a),
                            )),
                          e.isStringLiteral(s.value) &&
                            (s.value = e.JSXExpressionContainer(
                              e.binaryExpression("+", s.value, a),
                            ))),
                          (t.node.openingElement.attributes = [s]);
                      else {
                        var u = (function(e, n) {
                          return e.JSXAttribute(
                            e.jsxIdentifier("className"),
                            n,
                          );
                        })(e, e.JSXExpressionContainer(a));
                        t.node.openingElement.attributes = [u];
                      }
                    }
                  }
                },
              };
            })(f, s),
          );
      });
    },
    { configName: "reactCssModulesMacro" },
  );
module.exports = a;
//# sourceMappingURL=react-css-modules.macro.js.map
