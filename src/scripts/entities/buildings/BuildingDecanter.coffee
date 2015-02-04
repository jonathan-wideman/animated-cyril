Building = require("./Building").Building

class exports.BuildingDecanter extends Building

    name: 'Decanter'

    graphicName: 'buildingDecanter'

    resourcePerTurn: 1

    resource = "" # assigned below

    constructor: (@game, x = 0, y = 0)->

        # Call the building constructor
        super @game, x, y

        @resource = @game.reg.stockpile.AER

        return this

    onTurn: ()->
        # add a certain amount of resources per turn
        @game.reg.stockpile.earn(@resource, @resourcePerTurn)
        @game.juice.popText(@x, @y, @resource + " +#{@resourcePerTurn}")
