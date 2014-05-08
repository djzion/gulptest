module.exports = class Point

  constructor: ({@x, @y}) ->

  distance: (other) ->
    d = Math.pow(other.x - @x, 2) + Math.pow(other.y - @y, 2)
    Math.sqrt(d)

  toString: ->
    {@x, @y}