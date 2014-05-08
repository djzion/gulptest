Circle = require 'models/circle'
Circles = require 'models/circles'

module.exports = class Seed extends Backbone.View

  initialize: (@options) ->
    super
    @circles = new Circles()

  render: ->
    @svg = @options.app.svg
    @center = x: 0, y: 0
    @r = 80
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
    ###
    @iterRadians (i, degrees, rads) =>
      @pos = getPos(rads, 2)
      @createCircle(class: 'level-2', null, 2)
    , 6
    ###
    @drawGen2 1, 2
    @drawGen2 2, 2
    @drawGen2 2, 3

    #@iterRadians (i, degrees, rads) =>
    #  @pos = getPos(rads, 1.73)
    #  @createCircle(class: 'level-2')
    #, 6, -30

    return

    if @model.get('mode') is 'seed'
      @pos = _(@center).clone()
      @createCircle(class: 'outer', r: @r * 2)
      return
    else
      @drawGeneration(1, circle)

  drawGeneration: (gen, circle, dir=0) ->
    return if gen >= 2

    getPos = (rads, rscale=1) =>
      x: @pos.x + (Math.sin rads) * (@r * rscale)
      y: @pos.y - (Math.cos rads) * (@r * rscale)
    """
    rect = circle.getBoundingClientRect()
    @pos =
      x: rect.left + (rect.width / 2) - @r * 1.5
      y: rect.top + (rect.height / 2) + @r * @levelScaleFactor
    """
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

  drawGen2: (childGenId, genId) ->
    console.log 'Gen', genId
    gen = @circles.where({gen: childGenId})
    for i in [0..gen.length-1]
      circle = gen[i]
      c2 = @circles.get(gen[0].id + (gen.length + 1 + i) % gen.length)
      int = circle.intersection(c2)
      console.log circle.id, c2.id, int
      if int
        newCircle = @createCircle class: 'level-3', int[0], genId
      else
        console.log 'no int'

  createCircle: (attrs, pos=@pos, gen) ->
    console.log 'circle', @i
    _attrs =
      r: @r
      class: 'circle'
      cx: pos.x
      cy: pos.y
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
    node = @svg.append("svg:circle").attr(circle.get 'attrs').datum(circle: circle)
    circle.el = @svg.select("##{circle.get('attrs').id}").node()

    pointAttrs =
      r: 2
      cx: circle.get('pos').x
      cy: circle.get('pos').y
      id: circle.id
    @svg.append("svg:circle").attr pointAttrs

    $text = @svg.append('text').attr
      x: circle.get('pos').x
      y: circle.get('pos').y
    $text.text circle.get('index')

    node.on 'click', (data) ->
      console.log data.circle.toJSON()

    node[0][0]

  drawCircles: ->
    i = 0
    do _draw = =>
      if i >= @circles.size()
        return
      @drawCircle @circles.models[i]
      i++
      wait = if i < 12 then 0 else 500
      _.delay _draw, wait
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