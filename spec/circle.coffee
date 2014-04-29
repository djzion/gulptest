Circle = require 'models/circle'

describe 'Circle', ->

  it 'distance', ->

    c1 = new Circle
      pos: {x: 0, y: 0}

    c2 = new Circle
      pos: {x: -2, y: 0}

    expect(c1.distance(c2)).toBe 2

  it 'intersect', ->
    c1 = new Circle
      pos: {x: 0, y: 0}
      attrs: {r: 0.5}

    c2 = new Circle
      pos: {x: 1, y: 0}
      attrs: {r: 0.5}

    int = c1.intersection(c2)
    console.log int
    #expect(int.x).toBe 0.5
    #expect(int.y).toBe 0

    c1 = new Circle
      pos: {x: 0, y: 0}
      attrs: {r: 1}

    c2 = new Circle
      pos: {x: 1, y: 0}
      attrs: {r: 1}

    int = c1.intersection(c2)
    console.log int