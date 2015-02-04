# The terrain tool allows the player to place tiles
class exports.ToolTerrain

    # tool name should be displayed in the status bar
    name: "Terrain"

    # the tile id that is currently picked
    currentTileId: 0

    # the tilemap we're going to be changing
    tilemap: null

    constructor: (@game, @player)->

        # Create an object representing our gun
        @gun = @game.add.sprite 50, @game.height/2, 'star2'

        # Set the pivot point to the center of the gun
        @gun.anchor.setTo 0.5, 0.5

        @gun.visible = false

        # create a selection cursor
        @selection = @game.add.sprite 50, @game.height/2, 'tileSelect'
        @selection.anchor.setTo 0.5, 0.5

        @currentTile = 0
        @map = @game.currentLevel.tilemap
        @currentLayer = @game.currentLevel.currentLayer

        @unselect()

        return this

    showPallete: ()->
        # TODO: show the pallete at the top of the screen

    hidePallete: ()->
        # TODO: hide the palette

    pickPalleteTile: ()->
        # TODO: pick a tile from the palette and set it as current

    # pick a tile from the tilemap and set it as the current tile
    pickTile: (x, y)->
        # if the tilemap is null, return
        if not @tilemap?
            console.log "ToolTerrain.pickTile: @tilemap does not exist"
            return
        # get and assign the tile id from the tilemap
        @currentTileId = 0 # TODO: get tile from tilemap

    # replace a tile on the tilemap with the current tile
    paintTile: (x, y)->
        # if the tilemap is null, return
        if not @tilemap?
            console.log "ToolTerrain.paintTile: @tilemap does not exist"
            return
        # TODO: if the tile at x, y is already the current tile, return

        # TODO: replace the tilemap at x, y with the current tile

    # takes a set of screen coordinates and translates them to tilemap coords
    coordsScreenToTilemap: (x, y)->
        # TODO: translate and return coordinates

    update: ()=>

        # Move the gun to the player
        @gun.x = @player.x
        @gun.y = @player.y

        # Move the selection to the cursor
        @selection.x = (@game.input.activePointer.worldX // 32) * 32 + 16
        @selection.y = (@game.input.activePointer.worldY // 32) * 32 + 16

        # l-click to paint tiles

        # r-click to pick tiles

        # q to toggle palette

        # click the tile palette to pick a tile

        markerX = @currentLayer.getTileX(@game.input.activePointer.worldX) * 32
        markerY = @currentLayer.getTileY(@game.input.activePointer.worldY) * 32

        if (@game.input.mousePointer.isDown)
            @player.animations.play('cast')
            # @map.putTile(@currentTile, @currentLayer.getTileX(markerX), @currentLayer.getTileY(markerY), @currentLayer)
            if (@game.input.keyboard.isDown(Phaser.Keyboard.SHIFT))
                @currentTile = @map.getTile(@currentLayer.getTileX(markerX), @currentLayer.getTileY(markerY)).index
            else
                if (@map.getTile(@currentLayer.getTileX(markerX), @currentLayer.getTileY(markerY)).index != @currentTile)
                    @map.putTile(@currentTile, @currentLayer.getTileX(markerX), @currentLayer.getTileY(markerY))
                    @game.juice.plop(@game.input.activePointer.worldX, @game.input.activePointer.worldY)
        else
            @player.animations.play('idle')

        if @game.input.keyboard.downDuration(Phaser.Keyboard.Q, 10)
            @currentTile = Phaser.Math.clamp @currentTile - 1, 0, 7
            # console.log 'currentTile -- to ' + @currentTile
        if @game.input.keyboard.downDuration(Phaser.Keyboard.E, 10)
            @currentTile = Phaser.Math.clamp @currentTile + 1, 0, 7
            # console.log 'currentTile ++ to ' + @currentTile

    getStatusText: ()->
        status = ''
        status += 'tileID: ' + @currentTile + '\n'
        return status

    select: ()->
        @selection.revive()

    unselect: ()->
        @selection.kill()



