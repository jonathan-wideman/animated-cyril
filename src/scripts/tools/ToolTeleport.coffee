# The Teleport tool allows the player to teleport
class exports.ToolTeleport

    # tool name should be displayed in the status bar
    name: "Teleport"

    # time between registering seperate clicks
    cooldown: 100 # ms

    constructor: (@game, @player)->

        @teleporting = false

        @unselect()

        return this

    update: ()=>

        # l-click to teleport

        # r-click to pick tiles

        # q to toggle palette

        # click the tile palette to pick a tile

        if not @teleporting
            if @game.input.mousePointer.justReleased(@cooldown)
                @player.animations.play('cast')
                @game.juice.foosh(@player.x, @player.y, game.input.activePointer.worldX, game.input.activePointer.worldY)
                @player.x = game.input.activePointer.worldX
                @player.y = game.input.activePointer.worldY
                @teleporting = true
        else
            if not @game.input.mousePointer.justReleased(@cooldown)
                @player.animations.play('idle')
                @teleporting = false

    getStatusText: ()->
        return 'teleporting: ' + @teleporting

    select: ()->

    unselect: ()->



