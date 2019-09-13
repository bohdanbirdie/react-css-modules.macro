var t,
  r =
    (t = require("memoizee")) && "object" == typeof t && "default" in t
      ? t.default
      : t;
function n(t) {
  return (n =
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
var e = function(t, r) {
  return t
    .map(function(t) {
      return r[t] || t;
    })
    .join(" ");
};
module.exports = function(t) {
  return r(
    function(r) {
      if (r) {
        if (Array.isArray(r)) return " ".concat(e(r, t));
        if ("string" == typeof r) return " ".concat(e(r.split(" "), t));
        if ("object" === n(r)) {
          var o = Object.keys(r).filter(function(t) {
            return r[t];
          });
          return " ".concat(e(o, t));
        }
      }
      return "";
    },
    { length: 1, maxAge: 5e3, primitive: !0 },
  );
};
//# sourceMappingURL=bindStyleName.js.map
