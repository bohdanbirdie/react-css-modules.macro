!(function(e, n) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = n())
    : "function" == typeof define && define.amd
    ? define(n)
    : (e.reactCssModulesMacro = n());
})(this, function() {
  function e(e, n, t) {
    return (
      n in e
        ? Object.defineProperty(e, n, {
            value: t,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[n] = t),
      e
    );
  }
  function n(e, n) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      n &&
        (r = r.filter(function(n) {
          return Object.getOwnPropertyDescriptor(e, n).enumerable;
        })),
        t.push.apply(t, r);
    }
    return t;
  }
  function t(e) {
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
  var r = require("babel-plugin-macros").createMacro,
    i = require("../package.json").name,
    a = { enableMemo: !0, targetTag: "styleName", warning: !1 };
  return r(
    function(r) {
      var o = r.references,
        u = r.babel,
        s = (function(t) {
          for (var r = 1; r < arguments.length; r++) {
            var i = null != arguments[r] ? arguments[r] : {};
            r % 2
              ? n(i, !0).forEach(function(n) {
                  e(t, n, i[n]);
                })
              : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(i))
              : n(i).forEach(function(e) {
                  Object.defineProperty(
                    t,
                    e,
                    Object.getOwnPropertyDescriptor(i, e),
                  );
                });
          }
          return t;
        })({}, a, {}, r.config),
        c = o.macro,
        l = u.types;
      (void 0 === c ? [] : c).forEach(function(e) {
        var n = e.parent.arguments[0];
        if (!n) throw "Styles map argument must be provided";
        var r = e.findParent(function(e) {
          return e.isProgram();
        });
        e.parentPath.remove();
        var a = r.get("body").find(function(e) {
            return l.isImportDeclaration(e);
          }),
          o = r.get("body").find(function(e) {
            return !l.isImportDeclaration(e);
          }),
          u = r.scope.generateUidIdentifier("getStyleName"),
          c = r.scope.generateUidIdentifier("bindStyleNames"),
          f = "".concat(
            i,
            s.enableMemo
              ? "/dist/bindStyleNameMemo"
              : "/dist/bindStyleNamePure",
          ),
          p = l.importDeclaration(
            [l.importDefaultSpecifier(c)],
            l.stringLiteral(f),
          ),
          m = l.variableDeclaration("const", [
            l.variableDeclarator(
              u,
              l.callExpression(c, [n, l.booleanLiteral(!!s.warning)]),
            ),
          ]);
        a.insertBefore(p),
          o.insertBefore(m),
          r.traverse(
            (function(e, n, r) {
              return {
                JSXElement: function(i) {
                  if (i.node.openingElement.attributes.length) {
                    var a = i.node.openingElement.attributes.find(function(e) {
                      return e.name.name === r.targetTag;
                    });
                    if (a) {
                      !(function(e, n) {
                        e.node.openingElement.attributes = t(
                          e.node.openingElement.attributes.filter(function(e) {
                            return e.name.name !== n.targetTag;
                          }),
                        );
                      })(i, r);
                      var o = (function(e, n) {
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
                        })(e, a),
                        u = e.callExpression(n, t([o].filter(Boolean))),
                        s = (function(e) {
                          return e.node.openingElement.attributes.find(function(
                            e,
                          ) {
                            return "className" === e.name.name;
                          });
                        })(i);
                      if (s)
                        o &&
                          (e.isJSXExpressionContainer(s.value) &&
                            (s.value = e.JSXExpressionContainer(
                              e.binaryExpression("+", s.value.expression, u),
                            )),
                          e.isStringLiteral(s.value) &&
                            (s.value = e.JSXExpressionContainer(
                              e.binaryExpression("+", s.value, u),
                            ))),
                          (i.node.openingElement.attributes = [s].concat(
                            t(
                              i.node.openingElement.attributes.filter(function(
                                e,
                              ) {
                                return "className" !== e.name.name;
                              }),
                            ),
                          ));
                      else {
                        var c = (function(e, n) {
                          return e.JSXAttribute(
                            e.jsxIdentifier("className"),
                            n,
                          );
                        })(e, e.JSXExpressionContainer(u));
                        i.node.openingElement.attributes = [c].concat(
                          t(
                            i.node.openingElement.attributes.filter(function(
                              e,
                            ) {
                              return "className" !== e.name.name;
                            }),
                          ),
                        );
                      }
                    }
                  }
                },
              };
            })(l, u, s),
          );
      });
    },
    { configName: "reactCssModulesMacro" },
  );
});
//# sourceMappingURL=react-css-modules.macro.umd.js.map
