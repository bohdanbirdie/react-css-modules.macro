!(function(e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = t(require("memoizee")))
    : "function" == typeof define && define.amd
    ? define(["memoizee"], t)
    : (e.reactCssModulesMacro = t(e.memoizee));
})(this, function(e) {
  function t(e) {
    return (t =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function(e) {
            return typeof e;
          }
        : function(e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          })(e);
  }
  e = e && e.hasOwnProperty("default") ? e.default : e;
  var n,
    o = function(e, t) {
      return e
        .map(function(e) {
          return t[e] || e;
        })
        .join(" ");
    },
    r =
      ((n = e),
      function(e) {
        return n(
          function(n) {
            if (n) {
              if (Array.isArray(n)) return " ".concat(o(n, e));
              if ("string" == typeof n) return " ".concat(o(n.split(" "), e));
              if ("object" === t(n)) {
                var r = Object.keys(n).filter(function(e) {
                  return n[e];
                });
                return " ".concat(o(r, e));
              }
            }
            return "";
          },
          { length: 1, maxAge: 5e3, primitive: !0 },
        );
      });
  return console.warn("USING MEMO IMPLEMENTATION"), r;
});
//# sourceMappingURL=bindStyleNameMemo.umd.js.map
