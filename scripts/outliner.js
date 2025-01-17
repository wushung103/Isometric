//outliner

    ! function(r) {
        if ("object" == typeof exports && "undefined" != typeof module) module.exports = r();
        else if ("function" == typeof define && define.amd) define([], r);
        else {
            var t;
            t = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, t.getImageOutline = r()
        }
    }(function() {
        return function r(t, e, n) {
            function o(u, f) {
                if (!e[u]) {
                    if (!t[u]) {
                        var a = "function" == typeof require && require;
                        if (!f && a) return a(u, !0);
                        if (i) return i(u, !0);
                        var c = new Error("Cannot find module '" + u + "'");
                        throw c.code = "MODULE_NOT_FOUND", c
                    }
                    var s = e[u] = {
                        exports: {}
                    };
                    t[u][0].call(s.exports, function(r) {
                        var e = t[u][1][r];
                        return o(e ? e : r)
                    }, s, s.exports, r, t, e, n)
                }
                return e[u].exports
            }
            for (var i = "function" == typeof require && require, u = 0; u < n.length; u++) o(n[u]);
            return o
        }({
            1: [function(r, t, e) {
                "use strict";
                var n = r("./core.js");
                t.exports = function(r, t) {
                    if (!r.complete || !r.naturalWidth) throw new Error("getImageOutline: imageElement must be loaded.");
                    var e = document.createElement("canvas"),
                        o = r.naturalWidth,
                        i = r.naturalHeight;
                    e.width = o, e.height = i;
                    var u = e.getContext("2d");
                    u.drawImage(r, 0, 0);
                    var f = u.getImageData(0, 0, o, i).data,
                        a = function(r, t, e) {
                            return f[4 * r + 4 * t * o + e]
                        };
                    return n(o, i, a, t)
                }
            }, {
                "./core.js": 2
            }],
            2: [function(r, t, e) {
                "use strict";
                var n = r("line-simplify-rdp"),
                    o = r("marching-squares"),
                    i = r("extend"),
                    u = r("./find-edge-point.js");
                t.exports = function(r, t, e, f) {
                    f = i({
                        opacityThreshold: 170,
                        simplifyThreshold: 1
                    }, f);
                    var a, c = f.opacityThreshold;
                    a = "luminance" in f ? function(n, o) {
                        if (0 > n || 0 > o || n >= r || o >= t) return !1;
                        var i = .299 * e(n, o, 0) + .587 * e(n, o, 1) + .114 * e(n, o, 2);
                        return c >= i
                    } : function(n, o) {
                        return 0 > n || 0 > o || n >= r || o >= t ? !1 : e(n, o, 3) >= c
                    };
                    var s = u(r, t, a),
                        l = o(s.x, s.y, a);
                    return f.simplifyThreshold >= 0 && (l = n(l, f.simplifyThreshold, !0)), l
                }
            }, {
                "./find-edge-point.js": 3,
                extend: 4,
                "line-simplify-rdp": 5,
                "marching-squares": 7
            }],
            3: [function(r, t, e) {
                "use strict";

                function n(r, t, e) {
                    for (var n = Math.min(r, t), o = 0; n > o; o++)
                        if (e(o, o)) return {
                            x: o,
                            y: o
                        };
                    for (var i = 0; t > i; i++)
                        for (var u = 0; r > u; u++)
                            if (e(u, i)) return {
                                x: u,
                                y: i
                            };
                    throw new Error("No point found inside region!")
                }
                t.exports = n
            }, {}],
            4: [function(r, t, e) {
                "use strict";
                var n = Object.prototype.hasOwnProperty,
                    o = Object.prototype.toString,
                    i = function(r) {
                        return "function" == typeof Array.isArray ? Array.isArray(r) : "[object Array]" === o.call(r)
                    },
                    u = function(r) {
                        if (!r || "[object Object]" !== o.call(r)) return !1;
                        var t = n.call(r, "constructor"),
                            e = r.constructor && r.constructor.prototype && n.call(r.constructor.prototype, "isPrototypeOf");
                        if (r.constructor && !t && !e) return !1;
                        var i;
                        for (i in r);
                        return "undefined" == typeof i || n.call(r, i)
                    };
                t.exports = function f() {
                    var r, t, e, n, o, a, c = arguments[0],
                        s = 1,
                        l = arguments.length,
                        p = !1;
                    for ("boolean" == typeof c ? (p = c, c = arguments[1] || {}, s = 2) : ("object" != typeof c && "function" != typeof c || null == c) && (c = {}); l > s; ++s)
                        if (r = arguments[s], null != r)
                            for (t in r) e = c[t], n = r[t], c !== n && (p && n && (u(n) || (o = i(n))) ? (o ? (o = !1, a = e && i(e) ? e : []) : a = e && u(e) ? e : {}, c[t] = f(p, a, n)) : "undefined" != typeof n && (c[t] = n));
                    return c
                }
            }, {}],
            5: [function(r, t, e) {
                "use strict";

                function n(r, t, e, o, i) {
                    if (i[t] = i[e] = !0, !(t + 1 >= e)) {
                        for (var f = r[t], a = r[e], c = f.x, s = f.y, l = a.x - c, p = a.y - s, d = l * l + p * p, y = Number.NEGATIVE_INFINITY, h = -1, v = t + 1; e > v; v++) {
                            var g = r[v],
                                m = u(c, s, l, p, d, g.x, g.y);
                            m > y && (y = m, h = v)
                        }
                        o >= y || (n(r, t, h, o, i), n(r, h, e, o, i))
                    }
                }

                function o(r, t) {
                    return r.x === t.x && r.y === t.y
                }

                function i(r, t, e) {
                    var i = r.length;
                    if (t = t || 0, 2 >= i || 0 > t) return r.slice(0);
                    e && (o(r[0], r[r.length - 1]) ? e = !1 : (r = r.slice(0), r.push(r[0]), i++));
                    var u = [];
                    n(r, 0, i - 1, t, u);
                    for (var f = [], a = 0; i > a; a++) u[a] && f.push(r[a]);
                    return e && f.pop(), f
                }
                var u = r("distance-to-line-segment").squaredWithPrecalc;
                t.exports = i
            }, {
                "distance-to-line-segment": 6
            }],
            6: [function(r, t, e) {
                "use strict";

                function n(r, t, e, n, o, i, u) {
                    var f;
                    o ? (f = ((i - r) * e + (u - t) * n) / o, 0 > f ? f = 0 : f > 1 && (f = 1)) : f = 0;
                    var a = r + f * e,
                        c = t + f * n,
                        s = i - a,
                        l = u - c;
                    return s * s + l * l
                }

                function o(r, t, e, o, i, u) {
                    var f = e - r,
                        a = o - t,
                        c = f * f + a * a;
                    return n(r, t, f, a, c, i, u)
                }

                function i(r, t, e, n, i, u) {
                    return Math.sqrt(o(r, t, e, n, i, u))
                }
                i.squared = o, i.squaredWithPrecalc = n, t.exports = i
            }, {}],
            7: [function(r, t, e) {
                "use strict";

                function n(r, t, e) {
                    var n = r,
                        c = t,
                        s = [{
                            x: r,
                            y: t
                        }],
                        l = i,
                        p = (e(r - 1, t - 1) ? 1 : 0) + (e(r, t - 1) ? 2 : 0) + (e(r - 1, t) ? 4 : 0) + (e(r, t) ? 8 : 0);
                    if (0 === p || 15 === p) throw new Error("Bad Starting point.");
                    for (;;) {
                        if (l = a[p][l[2]], r += l[0], t += l[1], r === n && t === c) return s;
                        s.push({
                            x: r,
                            y: t
                        }), l === i ? p = (12 & p) >> 2 : l === o ? p = (3 & p) << 2 : l === f ? p = (10 & p) >> 1 : l === u && (p = (5 & p) << 1), p += l === i || l === u ? e(r - 1, t) ? 4 : 0 : e(r, t - 1) ? 2 : 0, p += l === i || l === f ? e(r, t) ? 8 : 0 : e(r - 1, t - 1) ? 1 : 0
                    }
                }
                var o = [0, -1, 1],
                    i = [0, 1, 0],
                    u = [-1, 0, 1],
                    f = [1, 0, 0],
                    a = [null, [u, u],
                        [o, o],
                        [u, u],
                        [i, i],
                        [i, i],
                        [o, i],
                        [i, i],
                        [f, f],
                        [f, u],
                        [o, o],
                        [u, u],
                        [f, f],
                        [f, f],
                        [o, o]
                    ];
                t.exports = n
            }, {}]
        }, {}, [1])(1)
    });