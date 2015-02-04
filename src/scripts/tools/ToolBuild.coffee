BuildingTest = require("../entities/buildings/BuildingTest").BuildingTest
BuildingDecanter = require("../entities/buildings/BuildingDecanter").BuildingDecanter
BuildingSump = require("../entities/buildings/BuildingSump").BuildingSump
BuildingWall = require("../entities/buildings/BuildingWall").BuildingWall

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

        # Create an object representing our gun
        @gun = @game.add.sprite 50, @game.height/2, 'star2'

        # Set the pivot point to the center of the gun
        @gun.anchor.setTo 0.5, 0.5

        @gun.visible = false

        # create a ghost cursor
        @newGhost(BuildingDecanter)

        @buildings = [
            # BuildingTest,
            BuildingDecanter,
            BuildingSump,
            BuildingWall,
        ]
        @nextBuilding()

        @unselect()

        return this

    update: ()=>

        # Move the gun to the player
        @gun.x = @player.x
        @gun.y = @player.y

        # Move the ghost image to the cursor
        @ghost.x = @game.input.activePointer.worldX
        @ghost.y = @game.input.activePointer.worldY


        if not @constructing
            if @game.input.mousePointer.justReleased(@cooldown)
                @player.animations.play('cast')
                @game.juice.plop(@ghost.x, @ghost.y)
                @buildGhost()
                @constructing = true
        else
            if not @game.input.mousePointer.justReleased(@cooldown)
                @player.animations.play('idle')
                @constructing = false

        # switch buildings
        if @game.input.keyboard.downDuration(Phaser.Keyboard.Q, 10)
            # change the cursor to the prev building in the list
            @prevBuilding()
        if @game.input.keyboard.downDuration(Phaser.Keyboard.E, 10)
            # change the cursor to the next building in the list
            @nextBuilding()

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
        # we're switching cursors, so destroy the old one
        if @ghost and not @ghost.isConstructed
            @ghost.destroy()
        @ghost = new buildingType(@game)
        # console.log @ghost
        return @ghost

    buildGhost: ()->
        if @ghost
            @ghost.build()
            # @ghost = null
            @newGhost(@currentBuilding)

    nextBuilding: ()->
        # console.log 'switching from ' + if @currentBuilding then @currentBuilding.name else 'nothing'

        # get the next building and remove it from the list
        @currentBuilding = @buildings.pop()

        # show the new building
        if @currentBuilding
            # readd the building to the front of the list
            @buildings.unshift(@currentBuilding)
            # create a new build ghost (will also destroy old one)
            @newGhost(@currentBuilding)

        # console.log 'to ' + @currentBuilding.name

    prevBuilding: ()->
        # console.log 'switching from ' + if @currentBuilding then @currentBuilding.name else 'nothing'

        # get the prev building and remove it from the list
        @currentBuilding = @buildings.shift()

        # show the new building
        if @currentBuilding
            # readd the building to the end of the list
            @buildings.push(@currentBuilding)
            # create a new build ghost (will also destroy old one)
            @newGhost(@currentBuilding)

        # console.log 'to ' + @currentBuilding.name
