PlayerController = require("../controllers/PlayerController").PlayerController


class exports.Player extends Phaser.Sprite
    # how fast can we move
    speed: 250

    constructor: (@game)->

        # Set our position to the world center
        x = @game.world.centerX
        y = @game.world.centerY

        # Call the sprite constructor
        super @game, x, y, 'player'

        # Set the anchor to the center of the sprite
        @anchor.setTo 0.5, 0.5

        # Add some animations
        @animations.add 'idle', [0]
        @animations.add 'cast', [1]

        # Enable physics
        @game.physics.enable @, Phaser.Physics.ARCADE

        # Attach a controller
        @controller = new PlayerController @game, @

        # add ourselves to the game state
        @game.add.existing @

    update: ->
        # Update the player controller
        @controller.update()

    getTool: ->
        @controller.tool

    handleClick: (tile) ->
        @controller.handleClick tile
