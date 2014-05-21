module.exports = class Point

  constructor: ({@x, @y}) ->

  distance: (other) ->
    d = Math.pow(other.x - @x, 2) + Math.pow(other.y - @y, 2)
    Math.sqrt(d)

  isReal: ->
    Boolean(not _.isNaN(@x) and not _.isNaN(@y))

  equals: (other, acc=0.001) ->
    Math.abs(other.x - @x) < acc and Math.abs(other.y - @y) < acc

  toString: ->
    {@x, @y}