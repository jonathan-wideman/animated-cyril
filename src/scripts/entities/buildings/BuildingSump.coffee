Building = require("./Building").Building

class exports.BuildingSump extends Building

    name: 'Sump'

    graphicName: 'buildingSump'

    stockpileBonus: 25

    resource = "" # assigned below

    constructor: (@game, x = 0, y = 0)->

        # Call the building constructor
        super @game, x, y

        @resource = @game.reg.stockpile.AER

        return this

    onBuild: ()->
        # when this building is constructed, add to the stockpile maximum
        @game.reg.stockpile.increaseMax(@resource, @stockpileBonus)

    onDemolish: ()->
        # when this building is demolished, subtract from the stockpile maximum
        @game.reg.stockpile.decreaseMax(@resource, @stockpileBonus)
