(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Canvas = function () {
    function Canvas(opts) {
        _classCallCheck(this, Canvas);

        if (Canvas.instance) return Canvas.instance;
        if (!(this instanceof Canvas)) return new Canvas(opts);

        opts = _extends({
            canvasElementOrId: null,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: document.getElementsByTagName('body')[0],
            renderers: []
        }, opts);

        if (opts.canvasElementOrId) {
            this.cvs = opts.canvaselementOrId instanceof Element ? opts.canvasElementOrId : document.createElement('canvas');
        }
        if (!this.cvs) {
            this.cvs = document.createElement('canvas');
        }

        this.cvs.width = opts.width;
        this.cvs.height = opts.height;
        this.cvs.style.width = '100%';
        this.cvs.style.height = '100%';
        this.ctx = this.cvs.getContext('2d');
        this.renderers = [].concat(_toConsumableArray(opts.renderers));

        this.render();
        opts.parent.appendChild(this.cvs);

        Canvas.instance = this;
    }

    _createClass(Canvas, [{
        key: 'addRenderer',
        value: function addRenderer(renderer) {
            if (typeof renderer === 'function') this.renderers.push(renderer);
        }
    }, {
        key: 'render',
        value: function render(renderers) {
            var _this = this;

            this.ctx.fillStyle = 'rgba(0,0,0,0)';
            this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
            this.ctx.imageSmoothingEnabled = false;

            this.renderers.forEach(function (func) {
                return func(_this.ctx);
            });
            Array.isArray(renderers) && renderers.forEach(function (func) {
                return func(_this.ctx);
            });
        }
    }]);

    return Canvas;
}();

Canvas.instance = null;
exports.default = Canvas;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _hex = require('./hex');

var _hex2 = _interopRequireDefault(_hex);

var _point = require('./point');

var _point2 = _interopRequireDefault(_point);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HexMap = function () {
    function HexMap(radius) {
        _classCallCheck(this, HexMap);

        // Build a hex-shaped map filled with Hex objects
        var counter = 0;
        for (var q = -radius; q <= radius; ++q) {
            for (var r = Math.max(-radius, -q - radius); r <= Math.min(radius, -q + radius); ++r) {
                var hex = new _hex2.default(q, r);
                this[hex.coords()] = hex;
                counter++;
            }
        }
        console.log(counter);
    }

    _createClass(HexMap, [{
        key: 'forEach',
        value: function forEach(func) {
            return HexMap.forEach(this, func);
        }
    }, {
        key: 'render',
        value: function render(center, size, ctx) {
            return HexMap.render(this, center, size, ctx);
        }
    }], [{
        key: 'forEach',
        value: function forEach(hexMap, func) {
            if (typeof func !== 'function') return;

            var hexes = Object.keys(hexMap);
            hexes.forEach(function (coords) {
                var hex = hexMap[coords];
                func(hex);
            });
        }
    }, {
        key: 'render',
        value: function render(hexMap, center, size, ctx) {
            // Flat top hexes
            var width = size;
            var height = width * 0.8660254037844386; // sqrt(3)/2
            var horiz = width * 0.75;
            var vert = height;
            // // Pointy top hexes
            // const height = size;
            // const width = height * 0.8660254037844386; // sqrt(3)/2
            // const vert = height * 0.75;
            // const horiz = width;
            var halfVert = vert * 0.5;

            hexMap.forEach(function (hex) {
                var c = new _point2.default(center.x + hex.q * horiz, center.y + hex.r * vert + halfVert * hex.q);
                hex.render(c, size, ctx);
                ctx.fillStyle = '#eee';
                ctx.font = '1rem sans-serif';
                ctx.fillText(hex.coords(), c.x - ctx.measureText(hex.coords()).width / 2, c.y + 5);
            });
        }
    }]);

    return HexMap;
}();

exports.default = HexMap;

},{"./hex":3,"./point":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _point = require('./point');

var _point2 = _interopRequireDefault(_point);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rad2deg = Math.PI / 180;

var Hex = function () {
    function Hex() {
        var q = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
        var r = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

        _classCallCheck(this, Hex);

        if (q instanceof Hex) return new Hex(q.q, q.r); // Clone a given hex
        this.q = q;
        this.r = r;
    }

    /**
     * Returns the coordinate string of the given hex
     **/


    _createClass(Hex, [{
        key: 'coords',
        value: function coords() {
            return Hex.coords(this);
        }

        /**
         * Helper function to identify the cardinal directions of a hex
         **/

    }, {
        key: 'neighbor',
        value: function neighbor(direction) {
            return Hex.neighbor(this, direction);
        }

        /**
         * Returns coordinates of all neighboring hexes out to the given distance.
         **/

    }, {
        key: 'neighborhood',
        value: function neighborhood(distance) {
            return Hex.neighborhood(this, distance);
        }

        /**
         * Calculates the manhattan distance between two given hexes
         **/

    }, {
        key: 'distance',
        value: function distance(B) {
            return Hex.distance(this, B);
        }

        /**
         * Helper function to return the point of the given corner
         **/

    }, {
        key: 'render',
        value: function render(center, size, ctx) {
            return Hex.render(this, center, size, ctx);
        }
    }], [{
        key: 'coords',
        value: function coords(hex) {
            return hex.q + ',' + hex.r;
        }
    }, {
        key: 'direction',
        value: function direction(_direction) {
            var directions = [{ q: +1, r: 0 }, { q: +1, r: -1 }, { q: 0, r: -1 }, { q: -1, r: 0 }, { q: -1, r: +1 }, { q: 0, r: +1 }];
            var dir = (_direction | 0) % 6;
            return directions[dir];
        }

        /**
         * Returns the neighboring (adjacent) hex in the given direction
         **/

    }, {
        key: 'neighbor',
        value: function neighbor(hex, direction) {
            hex = hex instanceof Object ? hex : {};

            var dir = Hex.direction(direction);
            return new Hex((hex.q | 0) + dir.q, (hex.r | 0) + dir.r);
        }
    }, {
        key: 'neighborhood',
        value: function neighborhood(hex, distance) {
            hex = hex instanceof Object ? hex : {};
            var q = hex.q | 0;
            var r = hex.r | 0;
            var d = distance | 0;
            var neighbors = [];

            for (var dq = -d; dq <= d; ++dq) {
                for (var dr = -d; dr <= d; ++dr) {
                    neighbors.push(new Hex(q + dq, r + dr));
                }
            }
            return neighbors;
        }
    }, {
        key: 'distance',
        value: function distance(A, B) {
            var a = A instanceof Hex ? A : new Hex();
            var b = B instanceof Hex ? B : new Hex();

            return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
        }
    }, {
        key: 'corner',
        value: function corner(center, size, i) {
            var angleDeg = 60 * (i | 0); // Flat top
            //let angleDeg = 60 * (i|0) + 30; // Pointy top
            var angleRad = rad2deg * angleDeg;
            return new _point2.default(center.x + size / 2 * Math.cos(angleRad), center.y + size / 2 * Math.sin(angleRad));
        }
    }, {
        key: 'render',
        value: function render(hex, center, size, ctx) {
            var p = Hex.corner(center, size, 0);
            ctx.beginPath();
            ctx.fillStyle = hex.fillStyle || 'rgba(255,0,0,0.25)';
            ctx.strokeStyle = hex.strokeStyle || 'rgba(255,0,0,0.5)';
            ctx.lineWidth = hex.lineWidth || 0.025 * size;
            ctx.moveTo(p.x, p.y);
            for (var i = 1; i < 6; ++i) {
                p = Hex.corner(center, size, i);
                ctx.lineTo(p.x, p.y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }]);

    return Hex;
}();

exports.default = Hex;

},{"./point":5}],4:[function(require,module,exports){
'use strict';

var _hex = require('./hex');

var _hex2 = _interopRequireDefault(_hex);

var _hexMap = require('./hex-map');

var _hexMap2 = _interopRequireDefault(_hexMap);

var _canvas = require('./canvas');

var _canvas2 = _interopRequireDefault(_canvas);

var _point = require('./point');

var _point2 = _interopRequireDefault(_point);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapSize = 5;

var centerHex = new _hex2.default();
var map = new _hexMap2.default(mapSize);
map.forEach(function (hex) {
	if (hex.distance(centerHex) === 5) {
		hex.strokeStyle = '#aaa';
		hex.fillStyle = '#784315';
	} else {
		hex.strokeStyle = '#aaa';
		hex.fillStyle = '#6c9023';
	}
});
var canvas = new _canvas2.default();

function render() {
	canvas.render();
	var center = new _point2.default(canvas.cvs.width / 2, canvas.cvs.height / 2);
	var size = Math.min(canvas.cvs.width, canvas.cvs.height) / mapSize / 2;
	map.render(center, size, canvas.ctx);
}

setTimeout(render, 0);

},{"./canvas":1,"./hex":3,"./hex-map":2,"./point":5}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Point = function () {
  function Point() {
    var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    _classCallCheck(this, Point);

    if (x instanceof Point) return new Point(x.x, x.y); // Clone a given Point
    if (!(this instanceof Point)) return new Point(x, y);
    this.x = +x || 0;
    this.y = +y || 0;
  }

  /**
   * Calculates the Pythagorean distance between two given points
   **/


  _createClass(Point, [{
    key: "distance",
    value: function distance(B) {
      return Point.distance(this, B);
    }
  }], [{
    key: "distance",
    value: function distance(A, B) {
      var a = A instanceof Point ? A : new Point();
      var b = B instanceof Point ? B : new Point();

      var x = b.x - a.x;
      var y = b.y - a.y;
      return Math.sqrt(x * x + y * y);
    }
  }]);

  return Point;
}();

exports.default = Point;

},{}]},{},[4]);
