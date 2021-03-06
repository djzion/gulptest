require.register("app", function(exports, require, module){
  var $, App, Grid, Seed, app,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Seed = require('views/seed');

Grid = require('views/grid');

$ = jQuery;

App = (function(_super) {
  __extends(App, _super);

  function App() {
    return App.__super__.constructor.apply(this, arguments);
  }

  App.prototype.defaults = {
    mode: 'tree'
  };

  App.prototype.initialize = function() {
    return this.on('change:mode', (function(_this) {
      return function() {
        return _this.view.render();
      };
    })(this));
  };

  App.prototype.ready = function() {
    var height, width;
    width = $("#page").width();
    height = $("#page").height();
    this.svg = d3.select("#page").append("svg").attr({
      viewBox: "" + (-width / 2) + " " + (-height / 2) + " " + width + " " + height
    });
    this.view = new Seed({
      el: $('#page'),
      model: this,
      app: this
    });
    this.view.render();
    this.grid = new Grid({
      el: $('#page'),
      model: this,
      app: this
    });
    return this.grid.render();
  };

  return App;

})(Backbone.Model);

app = new App;

jQuery(function() {
  return app.ready();
});

module.exports = app;

Backbone.$ = jQuery;

  
});

require.register("models/circle", function(exports, require, module){
  var Circle, Point,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Point = require('models/point');

module.exports = Circle = (function(_super) {
  __extends(Circle, _super);

  function Circle() {
    return Circle.__super__.constructor.apply(this, arguments);
  }

  Circle.prototype.initialize = function() {
    this.pos = new Point(this.get('pos'));
    if (_.isNaN(this.pos.x) || _.isNaN(this.pos.y)) {
      throw Error('invalid pos');
    }
  };

  Circle.prototype.distance = function(other) {
    return this.pos.distance(other.pos);
  };

  Circle.prototype.intersection = function(other, acc) {
    var a, d, h, int, p0, p1, p2, r0, r1, rx, ry;
    if (acc == null) {
      acc = 0.001;
    }
    d = this.distance(other);
    r0 = this.get('attrs').r + acc;
    p0 = this.get('pos');
    r1 = other.get('attrs').r + acc;
    p1 = other.get('pos');
    if (d > r0 + r1) {
      console.log('does not intersect');
      false;
    }
    if (d < r0 - r1) {
      console.log('one within other');
      false;
    }
    if (d === 0) {
      console.log('concident');
      false;
    }
    a = (Math.pow(r0, 2) - Math.pow(r1, 2) + Math.pow(d, 2)) / (d * 2);
    p2 = {
      x: p0.x + ((p1.x - p0.x) * a / d),
      y: p0.y + ((p1.y - p0.y) * a / d)
    };
    h = Math.sqrt(Math.pow(r0, 2) - Math.pow(a, 2));
    rx = (0 - (p1.y - p0.y)) * (h / d);
    ry = (p1.x - p0.x) * (h / d);
    int = [
      new Point({
        x: p2.x - rx,
        y: p2.y - ry
      }), new Point({
        x: p2.x + rx,
        y: p2.y + ry
      })
    ];
    if (int[1].distance(new Point({
      x: 0,
      y: 0
    })) >= int[0].distance(new Point({
      x: 0,
      y: 0
    }))) {
      int = _(int).reverse();
    }
    return int;
  };

  return Circle;

})(Backbone.Model);

  
});

require.register("models/circles", function(exports, require, module){
  var Circle, Circles,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Circle = require('models/circle');

module.exports = Circles = (function(_super) {
  __extends(Circles, _super);

  function Circles() {
    return Circles.__super__.constructor.apply(this, arguments);
  }

  Circles.prototype.model = Circle;

  return Circles;

})(Backbone.Collection);

  
});

require.register("models/point", function(exports, require, module){
  var Point;

module.exports = Point = (function() {
  function Point(_arg) {
    this.x = _arg.x, this.y = _arg.y;
  }

  Point.prototype.distance = function(other) {
    var d;
    d = Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2);
    return Math.sqrt(d);
  };

  Point.prototype.isReal = function() {
    return Boolean(!_.isNaN(this.x) && !_.isNaN(this.y));
  };

  Point.prototype.equals = function(other, acc) {
    if (acc == null) {
      acc = 0.001;
    }
    return Math.abs(other.x - this.x) < acc && Math.abs(other.y - this.y) < acc;
  };

  Point.prototype.toString = function() {
    return {
      x: this.x,
      y: this.y
    };
  };

  return Point;

})();

  
});

require.register("views/grid", function(exports, require, module){
  var Grid,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Grid = (function(_super) {
  __extends(Grid, _super);

  function Grid() {
    return Grid.__super__.constructor.apply(this, arguments);
  }

  Grid.prototype.initialize = function(options) {
    this.options = options;
  };

  Grid.prototype.render = function() {
    var xAxis;
    this.svg = this.options.app.svg;
    this.rect = this.svg[0][0].getBoundingClientRect();
    this.center = {
      x: this.rect.width / 2,
      y: this.rect.height / 2
    };
    this.pxScale = 100;
    this.svg.append('svg:circle').attr({
      cx: this.center.x,
      cy: this.center.y,
      r: 5
    });
    this.svg.append('svg:line').attr({
      x1: -this.center.x,
      y1: 0,
      x2: this.rect.width,
      y2: 0,
      "class": 'axis'
    });
    this.svg.append('svg:line').attr({
      x1: 0,
      y1: -this.center.y,
      x2: 0,
      y2: this.rect.height,
      "class": 'axis'
    });
    return xAxis = d3.svg.axis().scale(1).tickValues([-3, -2, -1, 0, 1, 2, 3]);
  };

  return Grid;

})(Backbone.View);

  
});

require.register("views/seed", function(exports, require, module){
  var Circle, Circles, Point, Seed,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

Circle = require('models/circle');

Circles = require('models/circles');

Point = require('models/point');

module.exports = Seed = (function(_super) {
  __extends(Seed, _super);

  function Seed() {
    return Seed.__super__.constructor.apply(this, arguments);
  }

  Seed.prototype.initialize = function(options) {
    this.options = options;
    Seed.__super__.initialize.apply(this, arguments);
    return this.circles = new Circles();
  };

  Seed.prototype.render = function() {
    this.svg = this.options.app.svg;
    this.center = {
      x: 0,
      y: 0
    };
    this.r = 60;
    this.i = 0;
    this.createCircles();
    this.drawCircles();
    return this;
  };

  Seed.prototype.createCircles = function() {
    var circle, getPos, i, _i;
    this.pos = _(this.center).clone();
    circle = this.createCircle({
      "class": 'center'
    });
    this.levelScaleFactor = 0.866;
    getPos = (function(_this) {
      return function(rads, rscale) {
        if (rscale == null) {
          rscale = 1;
        }
        return {
          x: _this.center.x + (Math.sin(rads)) * (_this.r * rscale),
          y: _this.center.y - (Math.cos(rads)) * (_this.r * rscale)
        };
      };
    })(this);
    this.level = 1;
    this.iterRadians((function(_this) {
      return function(i, degrees, rads) {
        _this.pos = getPos(rads, 1);
        return _this.createCircle({
          "class": 'level-1'
        }, null, 1);
      };
    })(this), 6);
    this.drawGenByIntersections(1, 2);
    this.drawGenByIntersections(2, 2);
    this.drawGenByIntersections(2, 3);
    this.drawGenByIntersections(3, 4);
    this.drawGenByIntersections(4, 4);
    this.drawGenByIntersections(4, 5);
    for (i = _i = 5; _i < 6; i = ++_i) {
      this.drawGenByIntersections(i, i + 1);
    }
    if (this.model.get('mode') === 'seed') {
      this.pos = _(this.center).clone();
      return this.createCircle({
        "class": 'outer',
        r: this.r * 8
      });
    }
  };

  Seed.prototype.drawGeneration = function(gen, circle, dir) {
    var childCount, circles, getPos, i, _draw, _i, _j, _ref, _ref1, _results;
    if (dir == null) {
      dir = 0;
    }
    if (gen >= 2) {
      return;
    }
    getPos = (function(_this) {
      return function(rads, rscale) {
        if (rscale == null) {
          rscale = 1;
        }
        return {
          x: _this.pos.x + (Math.sin(rads)) * (_this.r * rscale),
          y: _this.pos.y - (Math.cos(rads)) * (_this.r * rscale)
        };
      };
    })(this);
    _draw = (function(_this) {
      return function(i, gen) {
        var delta, rads;
        rads = _this.getRads(i);
        _this.pos = getPos(rads, _this.levelScaleFactor * 2);
        delta = {
          x: 0,
          y: 0
        };
        return circle = _this.createCircle({
          "class": "level-" + gen
        }, {
          x: _this.pos.x + delta.x,
          y: _this.pos.y + delta.y
        });
      };
    })(this);
    childCount = function() {
      if (gen === 1) {
        return 6;
      } else if (gen === 2) {
        return 2;
      } else {
        return 2;
      }
    };
    circles = [];
    for (i = _i = 0, _ref = childCount() - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      circles.push(_draw((dir + i) % 6, gen));
    }
    _results = [];
    for (i = _j = 0, _ref1 = circles.length - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      _results.push(this.drawGeneration(gen + 1, circle, (i + dir) % 6));
    }
    return _results;
  };

  Seed.prototype.drawGenByIntersections = function(childGenId, genId) {
    var c2, circle, conflict, distFromOrigin, gen, i, int, newCircle, pastGeneration, _i, _ref, _results;
    console.log('Gen', genId);
    gen = this.circles.where({
      gen: childGenId
    });
    gen = _(gen).sortBy(function(c) {
      return Math.atan2(c.pos.x, c.pos.y);
    });
    distFromOrigin = (this.r * genId) + this.r / 10;
    _results = [];
    for (i = _i = 0, _ref = gen.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      circle = gen[i];
      c2 = gen[(i + 1) % gen.length];
      int = circle.intersection(c2);
      console.log(circle.id, c2.id, int);
      if (int != null ? int[0].isReal() : void 0) {
        conflict = this.circles.find((function(_this) {
          return function(c) {
            return c.pos.equals(int[0]);
          };
        })(this));
        pastGeneration = int[0].distance(new Point({
          x: 0,
          y: 0
        })) > distFromOrigin;
        if (conflict) {
          _results.push(console.log('not drawing because of conflict:', conflict));
        } else if (pastGeneration) {
          _results.push(console.log('too far!!!'));
        } else {
          _results.push(newCircle = this.createCircle({
            "class": "level-" + genId
          }, int[0], genId));
        }
      } else {
        _results.push(console.log('no int', circle, c2));
      }
    }
    return _results;
  };

  Seed.prototype.createCircle = function(attrs, pos, gen) {
    var circle, _attrs;
    if (pos == null) {
      pos = this.pos;
    }
    console.log('circle', this.i);
    _attrs = {
      r: this.r,
      "class": "circle level-" + gen,
      cx: this.r,
      cy: this.r,
      'data-id': this.i,
      id: "circle-" + this.i
    };
    _(_attrs).extend(attrs);
    circle = new Circle({
      id: this.i,
      pos: pos,
      attrs: _attrs,
      index: this.i,
      gen: gen
    });
    this.circles.add(circle);
    this.i++;
    return circle;
  };

  Seed.prototype.drawCircle = function(circle) {
    var $text, g, node, pointAttrs, svg;
    svg = this.svg.append('svg:svg').attr({
      x: circle.get('pos').x - this.r,
      y: circle.get('pos').y - this.r
    });
    g = svg.append('svg:g');
    node = g.append("svg:circle").attr(circle.get('attrs')).datum({
      circle: circle
    });
    circle.el = this.svg.select("#" + (circle.get('attrs').id)).node();
    pointAttrs = {
      r: 2,
      cx: 0,
      cy: 0,
      id: circle.id
    };
    g.append("svg:circle").attr(pointAttrs);
    $text = g.append('text').attr({
      x: this.r,
      y: this.r
    });
    $text.text(circle.get('index'));
    g.on('click', function(data) {
      d3.select(this).attr("transform", "scale(0.80)");
      return console.log('click:', d3.select(this).select('circle').data()[0].circle.toJSON());
    });
    return node[0][0];
  };

  Seed.prototype.drawCircles = function() {
    var i, _draw;
    i = 0;
    (_draw = (function(_this) {
      return function() {
        var wait;
        if (i >= _this.circles.size()) {
          return;
        }
        _this.drawCircle(_this.circles.models[i]);
        i++;
        wait = i < 12 ? 0 : 0;
        return _draw();
      };
    })(this))();
  };

  Seed.prototype.drawMarker = function(pos) {
    var pointAttrs;
    pointAttrs = {
      r: 5,
      cx: pos.x,
      cy: pos.y
    };
    return this.svg.append("svg:circle").attr(pointAttrs);
  };

  Seed.prototype.iterRadians = function(f, count, degreeOffset) {
    var degrees, i, rads, _i, _ref, _results;
    if (degreeOffset == null) {
      degreeOffset = 0;
    }
    _results = [];
    for (i = _i = 0, _ref = count - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      degrees = ((360 * (i / count)) + degreeOffset) % 360;
      rads = degrees * Math.PI / 180;
      _results.push(f(i, degrees, rads));
    }
    return _results;
  };

  Seed.prototype.getRads = function(i, count) {
    var degrees, rads;
    if (count == null) {
      count = 6;
    }
    degrees = (360 * (i / count)) % 360;
    return rads = degrees * Math.PI / 180;
  };

  Seed.prototype.log = function() {
    var msg;
    msg = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return console.log.apply(console, msg);
  };

  return Seed;

})(Backbone.View);

  
});
