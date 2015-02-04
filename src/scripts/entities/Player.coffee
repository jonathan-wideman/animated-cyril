PlayerController = require("../controllers/PlayerController").PlayerController

ToolMissile = require("../tools/ToolMissile").ToolMissile
ToolTerrain = require("../tools/ToolTerrain").ToolTerrain
ToolTeleport = require("../tools/ToolTeleport").ToolTeleport
ToolBuild = require("../tools/ToolBuild").ToolBuild


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
        game.add.existing this

        # # create the Magic Missile Tool
        # @tool = new ToolMissile @game, this

        # create the Terrain Tool
        # @tool = new ToolTerrain @game, this

        @tools = [
            new ToolMissile @game, this
            new ToolTeleport @game, this
            new ToolTerrain @game, this
            new ToolBuild @game, this
        ]
        @nextTool()

        return this


    update: ()=>

        # Update the player controller
        @controller.update()

        # Update our Tool
        if @tool?
            @tool.update()


    nextTool: ()->
        # console.log 'switching from ' + if @tool then @tool.name else 'nothing'

        # hide the old tool
        if @tool
            @tool.unselect()

        # get the next tool and remove it from the list
        @tool = @tools.pop()

        # show the new tool
        if @tool
            # readd the tool to the front of the list
            @tools.unshift(@tool)
            # tell the new tool its selected
            @tool.select()

        # console.log 'to ' + @tool.name
