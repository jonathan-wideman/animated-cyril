Building = require("./Building").Building

class exports.BuildingTest extends Building

    name: 'Test Building'

    graphicName: 'buildingTest'

    constructor: (@game, x = 0, y = 0)->

        # Call the building constructor
        super @game, x, y

        return this

    onTurn: ()->
        # do whatever effects this building has
        # eg. add resources
        amount = 1
        @game.reg.stockpile.earn( @game.reg.stockpile.AER, amount)
        @game.juice.popText(@x, @y, @game.reg.stockpile.AER + " +#{amount}")
