!(function(n, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define(t)
    : (n.reactCssModulesMacro = t());
})(this, function() {
  function n(t) {
    return (n =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function(n) {
            return typeof n;
          }
        : function(n) {
            return n &&
              "function" == typeof Symbol &&
              n.constructor === Symbol &&
              n !== Symbol.prototype
              ? "symbol"
              : typeof n;
          })(t);
  }
  var t,
    o = function(n, t, o) {
      return (
        o &&
          n
            .map(function(n) {
              return t[n]
                ? t[n]
                : (console.warn(
                    "".concat(n, " key is missing in provided styles map"),
                  ),
                  n);
            })
            .join(" "),
        n
          .map(function(n) {
            return t[n] || n;
          })
          .join(" ")
      );
    };
  return (
    (t = function(n) {
      return n;
    }),
    function(e, r) {
      return t(function(t) {
        if (t) {
          if (Array.isArray(t)) return " ".concat(o(t, e, r));
          if ("string" == typeof t) return " ".concat(o(t.split(" "), e, r));
          if ("object" === n(t)) {
            var i = Object.keys(t).filter(function(n) {
              return t[n];
            });
            return " ".concat(o(i, e, r));
          }
        }
        return "";
      });
    }
  );
});
//# sourceMappingURL=bindStyleNamePure.umd.js.map