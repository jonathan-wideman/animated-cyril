Building = require("./Building").Building

class exports.BuildingWall extends Building

    name: 'Wall'

    graphicName: 'buildingWall'

    constructor: (@game, x = 0, y = 0)->

        # Call the building constructor
        super @game, x, y

        return this

    turnEffects: ()->
        # do whatever effects this building has