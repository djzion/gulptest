module.exports = class Circle extends Backbone.Model

  distance: (other) ->
    d = Math.pow(other.get('pos').x - @get('pos').x, 2) + Math.pow(other.get('pos').y - @get('pos').y, 2)
    Math.sqrt(d)

  intersection: (other) ->
    d = @distance(other)
    r0 = @get('attrs').r
    p0 = @get('pos')
    r1 = other.get('attrs').r
    p1 = other.get('pos')

    if d > r0 + r1
      console.log 'does not intersect'
      false
    if d < r0 - r1
      console.log 'one within other'
      false
    if d is 0
      console.log 'concident'
      false


    a = (Math.pow(r0, 2) - Math.pow(r1, 2) + Math.pow(d, 2)) / (d * 2)
    p2 =
      x: p0.x + ((p1.x - p0.x ) * a/d)
      y: p0.y + ((p1.y - p0.y ) * a/d)
    h = Math.sqrt(Math.pow(r0, 2) - Math.pow(a, 2))
    #Now determine the offsets of the intersection points from point 2.
    rx = (0 - (p1.y - p0.y)) * (h/d)
    ry = (p1.x - p0.x ) * (h/d)


    int = [{
      x: p2.x - rx
      y: p2.y - ry
    }, {
      x: p2.x + rx
      y: p2.y + ry
    }]