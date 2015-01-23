class exports.BuildingController

    constructor: (@game, @building)->

        @building.inputEnabled = true
        @building.input.enableDrag()
        @building.input.enableSnap 32, 32, true, true
        # @building.input.startDrag(@game.input.mousePointer)

    update: ()->

    #     # Move the building to the mouse pointer
    #     @building.x = @game.input.mouse.
