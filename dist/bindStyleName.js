function t(r) {
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
        })(r);
}
var r = function(t, r) {
  return t
    .map(function(t) {
      return r[t] || t;
    })
    .join(" ");
};
module.exports = function(n) {
  return function(o) {
    if (o) {
      if ("string" == typeof o) return " " + r(o.split(" "), n);
      if (Array.isArray(o)) return " " + r(o, n);
      if ("object" === t(o)) {
        var e = Object.keys(o).filter(function(t) {
          return o[t];
        });
        return " " + r(e, n);
      }
    }
    return "";
  };
};
//# sourceMappingURL=bindStyleName.js.map
