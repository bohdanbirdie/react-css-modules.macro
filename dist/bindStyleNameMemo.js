var t,
  n =
    (t = require("memoizee")) && "object" == typeof t && "default" in t
      ? t.default
      : t;
function r(t) {
  return (r =
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
        })(t);
}
var o,
  e = function(t, n) {
    return t
      .map(function(t) {
        return n[t] || t;
      })
      .join(" ");
  },
  i =
    ((o = n),
    function(t) {
      return o(
        function(n) {
          if (n) {
            if (Array.isArray(n)) return " ".concat(e(n, t));
            if ("string" == typeof n) return " ".concat(e(n.split(" "), t));
            if ("object" === r(n)) {
              var o = Object.keys(n).filter(function(t) {
                return n[t];
              });
              return " ".concat(e(o, t));
            }
          }
          return "";
        },
        { length: 1, maxAge: 5e3, primitive: !0 },
      );
    });
console.warn("USING MEMO IMPLEMENTATION"), (module.exports = i);
//# sourceMappingURL=bindStyleNameMemo.js.map
