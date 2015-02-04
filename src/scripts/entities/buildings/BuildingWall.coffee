Building = require("./Building").Building

class exports.BuildingWall extends Building

    name: 'Wall'

    graphicName: 'buildingWall'

    constructor: (@game, x = 0, y = 0)->

        # Call the building constructor
        super @game, x, y

        return this

    onTurn: ()->
        # The wall doesn't do anything. It's a wall.
