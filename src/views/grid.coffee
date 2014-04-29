module.exports = class Grid extends Backbone.View

  initialize: (@options) ->

  render: ->
    @svg = @options.app.svg
    @rect = @svg[0][0].getBoundingClientRect()
    @center = x: @rect.width / 2, y: @rect.height / 2
    @pxScale = 100
    @svg.append('svg:circle').attr(cx: @center.x, cy: @center.y, r: 5)
    @svg.append('svg:line').attr(x1: -@center.x, y1: 0, x2: @rect.width, y2: 0, class: 'axis')
    @svg.append('svg:line').attr(x1: 0, y1: -@center.y, x2: 0, y2: @rect.height, class: 'axis')
    xAxis = d3.svg.axis()
      .scale(1)
      .tickValues([-3, -2, -1, 0, 1, 2, 3])