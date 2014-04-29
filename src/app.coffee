Seed = require 'views/seed'
Grid = require 'views/grid'
$ = jQuery

class App extends Backbone.Model

  defaults:
    mode: 'tree'

  initialize: ->
    @on 'change:mode', => @view.render()

  ready: ->
    width = $("#page").width()
    height = $("#page").height()
    @svg = d3.select("#page").append("svg").attr(viewBox: "#{-width/2} #{-height/2} #{width} #{height}")
    @view = new Seed(el: $('#page'), model: @, app: @)
    @view.render()

    @grid = new Grid(el: $('#page'), model: @, app: @)
    @grid.render()

app = new App

jQuery ->
  app.ready()

module.exports = app
Backbone.$ = jQuery