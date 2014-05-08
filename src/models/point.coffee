module.exports = class Point

  constructor: ({@x, @y}) ->

  distance: (other) ->
    d = Math.pow(other.x - @x, 2) + Math.pow(other.y - @y, 2)
    Math.sqrt(d)

  isReal: ->
    Boolean(not _.isNaN(@x) and not _.isNaN(@y))

  toString: ->
    {@x, @y}