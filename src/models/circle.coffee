Point = require 'models/point'

module.exports = class Circle extends Backbone.Model

  initialize: ->
    @pos = new Point @get('pos')
    if _.isNaN(@pos.x) or _.isNaN(@pos.y)
      throw Error 'invalid pos'

  distance: (other) ->
    @pos.distance(other.pos)

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


    int = [new Point({
      x: p2.x - rx
      y: p2.y - ry
    }), new Point({
      x: p2.x + rx
      y: p2.y + ry
    })]

    if int[1].distance(new Point(x: 0, y: 0)) >= int[0].distance(new Point(x: 0, y: 0))
      console.log 'reversed'
      int = _(int).reverse()
    int