class exports.BuildingTest extends Phaser.Sprite

    name: ''

    graphicName: 'buildingTest'

    isConstructed: false

    constructor: (@game, x = 0, y = 0)->

        # Call the sprite constructor
        super @game, x, y, @graphicName

        # Set the anchor to the center of the sprite
        @anchor.setTo 0.5, 0.5

        @ghost()

        # add events to mouseover and mouseout
        @events.onInputOver.add(@hover, @)
        @events.onInputOut.add(@unhover, @)

        # add ourselves to the game state
        game.add.existing this

        @addNextTurnListener()

        return this

    build: ()->
        @unghost()

        # set the constructed flag
        @isConstructed = true
        return

    addNextTurnListener: ()->
        @game.onNextTurn.add(@nextTurn, @)

    nextTurn: ()->
        # If we haven't been built yet, skip our turn
        if not @isConstructed
            return

        # do whatever effects this building has
        @turnEffects()

    turnEffects: ()->
        # default buildings do nothing

    ghost: ()->
        # Set graphic effects to indicate a 'ghost' planned building
        @alpha = 0.5
        @tint = 0xffccffcc

        # disable input events like click, touch, rollover
        @inputEnabled = false

    unghost: ()->
        # Remove graphic effects to indicate a fully constructed building
        @alpha = 1
        @tint = 0xffffffff

        # enable input events like click, touch, rollover
        @inputEnabled = true

    hover: ()->
        if not @isConstructed
            return

        @game.ui.tooltip.target = @
        @game.ui.tooltip.visible = true
        @game.ui.tooltip.text = @name
        @game.ui.tooltip.x = @x - @game.ui.tooltip.width / 2
        @game.ui.tooltip.y = @y - 32

    unhover: ()->
        if not @isConstructed
            return

        if @game.ui.tooltip.target == @
            @game.ui.tooltip.visible = false
            @game.ui.tooltip.target = null
