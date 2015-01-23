class exports.BuildingTest extends Phaser.Sprite

    name: 'Test Building'

    isConstructed: false

    constructor: (@game, x = 0, y = 0)->

        # Call the sprite constructor
        super @game, x, y, 'buildingTest'

        # Set the anchor to the center of the sprite
        @anchor.setTo 0.5, 0.5

        # Set graphic effects to indicate a 'ghost' planned building
        @alpha = 0.5
        @tint = 0xffccffcc

        # disable input events like click, touch, rollover
        @inputEnabled = false
        # add events to mouseover and mouseout
        @events.onInputOver.add(@hover, @)
        @events.onInputOut.add(@unhover, @)

        # add ourselves to the game state
        game.add.existing this

        @name = 'Test Building'

        @addNextTurnListener()

        return this

    build: ()->
        # Remove graphic effects to indicate a fully constructed building
        @alpha = 1
        @tint = 0xffffffff

        # enable input events like click, touch, rollover
        @inputEnabled = true

        # set the constructed flag
        @isConstructed = true
        @game.juice.shake()
        @game.juice.build()
        return

    addNextTurnListener: ()->
        @game.onNextTurn.add(@nextTurn, @)

    nextTurn: ()->
        # console.log 'taking turn for '
        # console.log @
        # If we haven't been built yet, skip our turn
        if not @isConstructed
            # console.log @name + ' not constructed'
            return
        # console.log @name + ' is constructed'

        # do whatever effects this building has
        # eg. add resources
        amount = 7
        @game.reg.stockpile.earn( @game.reg.stockpile.AER, amount)
        @game.juice.popText(@x, @y, @game.reg.stockpile.AER + " +#{amount}")

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
