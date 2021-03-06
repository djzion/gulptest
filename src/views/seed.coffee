Circle = require 'models/circle'
Circles = require 'models/circles'
Point = require 'models/point'

module.exports = class Seed extends Backbone.View

  initialize: (@options) ->
    super
    @circles = new Circles()

  render: ->
    @svg = @options.app.svg
    @center = x: 0, y: 0
    @r = 60
    @i = 0
    @createCircles()
    @drawCircles()
    @

  createCircles: ->
    @pos = _(@center).clone()
    circle = @createCircle(class: 'center')
    #circle = @createCircle({class: 'center'}, {x:0, y: -@r})

    @levelScaleFactor = 0.866

    getPos = (rads, rscale=1) =>
      x: @center.x + (Math.sin rads) * (@r * rscale)
      y: @center.y - (Math.cos rads) * (@r * rscale)

    @level = 1
    @iterRadians (i, degrees, rads) =>
      @pos = getPos(rads, 1)
      @createCircle(class: 'level-1', null, 1)
    , 6

    @drawGenByIntersections 1, 2
    @drawGenByIntersections 2, 2

    @drawGenByIntersections 2, 3

    @drawGenByIntersections 3, 4

    @drawGenByIntersections 4, 4


    @drawGenByIntersections 4, 5

    for i in [5...6]
      @drawGenByIntersections i, i+1

    if @model.get('mode') is 'seed'
      @pos = _(@center).clone()
      @createCircle(class: 'outer', r: @r * 8)

  #not working
  drawGeneration: (gen, circle, dir=0) ->
    return if gen >= 2

    getPos = (rads, rscale=1) =>
      x: @pos.x + (Math.sin rads) * (@r * rscale)
      y: @pos.y - (Math.cos rads) * (@r * rscale)

    _draw = (i, gen) =>
      rads = @getRads(i)
      @pos = getPos(rads, @levelScaleFactor * 2)
      delta = x: 0, y:0
      circle = @createCircle({class: "level-#{gen}"}, x: @pos.x + delta.x, y: @pos.y + delta.y)

    childCount = ->
      if gen is 1
        6
      else if gen is 2
        2
      else
        2

    circles = []
    for i in [0..childCount()-1]
      circles.push _draw((dir+i) % 6, gen)

    for i in [0..circles.length-1]
      @drawGeneration(gen+1, circle, (i+dir)%6)

  drawGenByIntersections: (childGenId, genId) ->
    console.log 'Gen', genId
    gen = @circles.where({gen: childGenId})
    gen = _(gen).sortBy (c) -> Math.atan2(c.pos.x, c.pos.y)
    distFromOrigin = (@r * genId) + @r/10
    for i in [0..gen.length-1]
      circle = gen[i]
      c2 = gen[(i+1) % gen.length]
      int = circle.intersection(c2)
      console.log circle.id, c2.id, int
      if int?[0].isReal()
        conflict = @circles.find (c) => c.pos.equals(int[0])
        pastGeneration = int[0].distance(new Point(x: 0, y: 0)) > distFromOrigin
        if conflict
          console.log 'not drawing because of conflict:', conflict
        else if pastGeneration
          console.log 'too far!!!'
        else
          newCircle = @createCircle class: "level-#{genId}", int[0], genId

      else
        console.log 'no int', circle, c2

  createCircle: (attrs, pos=@pos, gen) ->
    console.log 'circle', @i
    _attrs =
      r: @r
      class: "circle level-#{gen}"
      cx: @r
      cy: @r
      'data-id': @i
      id: "circle-#{@i}"
    _(_attrs).extend attrs

    circle = new Circle
      id: @i
      pos: pos
      attrs: _attrs
      index: @i
      gen: gen
    @circles.add circle
    @i++

    circle

  drawCircle: (circle) ->
    svg = @svg.append('svg:svg').attr
      x: circle.get('pos').x - @r
      y: circle.get('pos').y - @r
    g = svg.append('svg:g')
    node = g.append("svg:circle").attr(circle.get 'attrs').datum(circle: circle)
    circle.el = @svg.select("##{circle.get('attrs').id}").node()

    pointAttrs =
      r: 2
      cx: 0
      cy: 0
      id: circle.id
    g.append("svg:circle").attr pointAttrs

    $text = g.append('text').attr x: @r, y: @r
    $text.text circle.get('index')

    g.on 'click', (data) ->
      d3.select(@).attr("transform", "scale(0.80)")
      console.log 'click:', d3.select(@).select('circle').data()[0].circle.toJSON()

    node[0][0]

  drawCircles: ->
    i = 0
    do _draw = =>
      if i >= @circles.size()
        return
      @drawCircle @circles.models[i]
      i++
      wait = if i < 12 then 0 else 0
      _draw()
    return

  drawMarker: (pos) ->
    pointAttrs =
      r: 5
      cx: pos.x
      cy: pos.y
    @svg.append("svg:circle").attr pointAttrs

  iterRadians: (f, count, degreeOffset=0) ->
    for i in [0..count-1]
      degrees = ((360 * (i/count)) + degreeOffset) % 360
      rads = degrees * Math.PI/180
      f(i, degrees, rads)

  getRads: (i, count=6) ->
      degrees = ((360 * (i/count))) % 360
      rads = degrees * Math.PI/180

  log: (msg...) ->
    console.log msg...