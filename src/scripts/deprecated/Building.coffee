BuildingController = require("./BuildingController").BuildingController

class exports.Building extends Phaser.Sprite

    constructor: (@game)->

        # Set our position to the world center
        x = @game.world.centerX
        y = @game.world.centerY

        # Call the sprite constructor
        super @game, x, y, 'player'

        # Set the anchor to the center of the sprite
        @anchor.setTo 0.5, 0.5

        # # Enable physics
        # @game.physics.enable @, Phaser.Physics.ARCADE

        # Attach a controller
        @controller = new BuildingController @game, @

        return this


    update: ()=>

        # Update the player controller
        @controller.update()
