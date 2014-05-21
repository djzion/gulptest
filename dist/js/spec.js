(function() {
  var Circle;

  Circle = require('models/circle');

  describe('Circle', function() {
    it('distance', function() {
      var c1, c2;
      c1 = new Circle({
        pos: {
          x: 0,
          y: 0
        }
      });
      c2 = new Circle({
        pos: {
          x: -2,
          y: 0
        }
      });
      return expect(c1.distance(c2)).toBe(2);
    });
    return it('intersect', function() {
      var c1, c2, int;
      c1 = new Circle({
        pos: {
          x: 0,
          y: 0
        },
        attrs: {
          r: 0.5
        }
      });
      c2 = new Circle({
        pos: {
          x: 1,
          y: 0
        },
        attrs: {
          r: 0.5
        }
      });
      int = c1.intersection(c2);
      console.log(int);
      c1 = new Circle({
        pos: {
          x: 0,
          y: 0
        },
        attrs: {
          r: 1
        }
      });
      c2 = new Circle({
        pos: {
          x: 1,
          y: 0
        },
        attrs: {
          r: 1
        }
      });
      int = c1.intersection(c2);
      return console.log(int);
    });
  });

}).call(this);
