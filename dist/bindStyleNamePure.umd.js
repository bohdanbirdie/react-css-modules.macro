!(function(t, n) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = n())
    : "function" == typeof define && define.amd
    ? define(n)
    : (t.reactCssModulesMacro = n());
})(this, function() {
  function t(n) {
    return (t =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function(t) {
            return typeof t;
          }
        : function(t) {
            return t &&
              "function" == typeof Symbol &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          })(n);
  }
  var n,
    o = function(t, n) {
      return t
        .map(function(t) {
          return n[t] || t;
        })
        .join(" ");
    },
    e =
      ((n = function(t) {
        return t;
      }),
      function(e) {
        return n(function(n) {
          if (n) {
            if (Array.isArray(n)) return " ".concat(o(n, e));
            if ("string" == typeof n) return " ".concat(o(n.split(" "), e));
            if ("object" === t(n)) {
              var r = Object.keys(n).filter(function(t) {
                return n[t];
              });
              return " ".concat(o(r, e));
            }
          }
          return "";
        });
      });
  return console.warn("USING PURE IMPLEMENTATION"), e;
});
//# sourceMappingURL=bindStyleNamePure.umd.js.map
