var t,
  n =
    (t = require("memoizee")) && "object" == typeof t && "default" in t
      ? t.default
      : t;
function o(t) {
  return (o =
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
var r,
  e = function(t, n, o) {
    return (
      o &&
        t
          .map(function(t) {
            return n[t]
              ? n[t]
              : (console.warn(
                  "".concat(t, " key is missing in provided styles map"),
                ),
                t);
          })
          .join(" "),
      t
        .map(function(t) {
          return n[t] || t;
        })
        .join(" ")
    );
  },
  i =
    ((r = n),
    function(t, n) {
      return r(
        function(r) {
          if (r) {
            if (Array.isArray(r)) return " ".concat(e(r, t, n));
            if ("string" == typeof r) return " ".concat(e(r.split(" "), t, n));
            if ("object" === o(r)) {
              var i = Object.keys(r).filter(function(t) {
                return r[t];
              });
              return " ".concat(e(i, t, n));
            }
          }
          return "";
        },
        { length: 1, maxAge: 5e3, primitive: !0 },
      );
    });
module.exports = i;
//# sourceMappingURL=bindStyleNameMemo.js.map
