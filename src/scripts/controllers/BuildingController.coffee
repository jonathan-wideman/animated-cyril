module.exports = class BuildingController
    constructor: (@game) ->
    build: (@building) ->
        unless @game.reg.map[@building.tilex][@building.tiley]?
            @game.reg.map[@building.tilex][@building.tiley] = @building
            @building.build()
            true
        else
            false
