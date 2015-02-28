BuildingTest = require('../entities/BuildingTest').BuildingTest
BuildingController = require '../controllers/BuildingController'

# The build tool allows the player to create buildings
class exports.ToolBuild

    # tool name should be displayed in the status bar
    name: "Build"

    # time between registering seperate clicks
    cooldown: 100 # ms

    # the building to be created
    currentBuilding: null

    constructor: (@game, @player)->

        @constructing = false
        @casting = false

        @controller = new BuildingController(@game)

        # Create an object representing our gun
        # @gun = @game.add.sprite 50, @game.height/2, 'star2'

        # Set the pivot point to the center of the gun
        # @gun.anchor.setTo 0.5, 0.5

        # @gun.visible = false

        # create a ghost cursor
        @newGhost(BuildingTest)

        @unselect()

    update: ()=>

        # Move the gun to the player
        # @gun.x = @player.x
        # @gun.y = @player.y

        # Move the ghost image to the cursor
        x = @game.input.activePointer.worldX // 32
        y = @game.input.activePointer.worldY // 32
        @ghost.x = x * 32 + 16
        @ghost.y = y * 32 + 16
        @ghost.tilex = x
        @ghost.tiley = y
        if not @constructing
            if @game.input.mousePointer.justReleased(@cooldown)
                if @controller.build(@ghost)
                    @constructing = true
                    @player.animations.play('cast')
                    @game.juice.plop(@ghost.x, @ghost.y)
                    @newGhost(BuildingTest)
                    @casting = true
                    setTimeout =>
                        @casting = false
                        @constructing = false
                    , 500
        if @player.animations.name isnt 'idle' and not @casting
            # console.log "constructing=true"
            #if not @game.input.mousePointer.justReleased(@cooldown)
            @player.animations.play('idle')
            @casting = false

    getStatusText: ()->
        status = ''
        status += 'building: ' + if @ghost then @ghost.name else 'none' + '\n'
        return status

    select: ()->
        @ghost.revive()

    unselect: ()->
        @ghost.kill()

    newGhost: (buildingType)=>
        # if we've not constructed the ghost building,
        # we're switching cursors, so destory the old one
        if @ghost and not @ghost.isConstructed
            @ghost.destroy()
        @ghost = new buildingType(@game)
        # console.log @ghost
        return @ghost
