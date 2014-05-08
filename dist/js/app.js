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
  var Circle,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Circle = (function(_super) {
  __extends(Circle, _super);

  function Circle() {
    return Circle.__super__.constructor.apply(this, arguments);
  }

  Circle.prototype.distance = function(other) {
    var d;
    d = Math.pow(other.get('pos').x - this.get('pos').x, 2) + Math.pow(other.get('pos').y - this.get('pos').y, 2);
    return Math.sqrt(d);
  };

  Circle.prototype.intersection = function(other) {
    var a, d, h, int, p0, p1, p2, r0, r1, rx, ry;
    d = this.distance(other);
    r0 = this.get('attrs').r;
    p0 = this.get('pos');
    r1 = other.get('attrs').r;
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
    return int = [
      {
        x: p2.x - rx,
        y: p2.y - ry
      }, {
        x: p2.x + rx,
        y: p2.y + ry
      }
    ];
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
  var Circle, Circles, Seed,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Circle = require('models/circle');

Circles = require('models/circles');

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
    this.r = 80;
    this.i = 0;
    this.createCircles();
    this.drawCircles();
    return this;
  };

  Seed.prototype.createCircles = function() {
    var circle, getPos;
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
    this.iterRadians((function(_this) {
      return function(i, degrees, rads) {
        _this.pos = getPos(rads, 2);
        return _this.createCircle({
          "class": 'level-2'
        }, null, 2);
      };
    })(this), 6);
    return;
    if (this.model.get('mode') === 'seed') {
      this.pos = _(this.center).clone();
      this.createCircle({
        "class": 'outer',
        r: this.r * 2
      });
    } else {
      return this.drawGeneration(1, circle);
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
    "rect = circle.getBoundingClientRect()\n@pos =\n  x: rect.left + (rect.width / 2) - @r * 1.5\n  y: rect.top + (rect.height / 2) + @r * @levelScaleFactor";
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

  Seed.prototype.createCircle = function(attrs, pos, gen) {
    var circle, _attrs;
    if (pos == null) {
      pos = this.pos;
    }
    _attrs = {
      r: this.r,
      "class": 'circle',
      cx: pos.x,
      cy: pos.y,
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
    var $text, node, pointAttrs;
    node = this.svg.append("svg:circle").attr(circle.get('attrs')).datum({
      circle: circle
    });
    circle.el = this.svg.select("#" + (circle.get('attrs').id)).node();
    pointAttrs = {
      r: 2,
      cx: circle.get('pos').x,
      cy: circle.get('pos').y,
      id: circle.id
    };
    this.svg.append("svg:circle").attr(pointAttrs);
    $text = this.svg.append('text').attr({
      x: circle.get('pos').x,
      y: circle.get('pos').y
    });
    $text.text(circle.get('index'));
    node.on('click', function(data) {
      return console.log(data.circle.toJSON());
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
        wait = i < 12 ? 0 : 500;
        return _.delay(_draw, wait);
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

  return Seed;

})(Backbone.View);

  
});
