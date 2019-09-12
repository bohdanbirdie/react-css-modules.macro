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
  var n = function(t, n) {
    return t
      .map(function(t) {
        return n[t] || t;
      })
      .join(" ");
  };
  return function(o) {
    return function(e) {
      if (e) {
        if ("string" == typeof e) return " " + n(e.split(" "), o);
        if (Array.isArray(e)) return " " + n(e, o);
        if ("object" === t(e)) {
          var r = Object.keys(e).filter(function(t) {
            return e[t];
          });
          return " " + n(r, o);
        }
      }
      return "";
    };
  };
});
//# sourceMappingURL=bindStyleName.umd.js.map
