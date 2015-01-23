class exports.TextPopup extends Phaser.Group

    constructor: (@game, width = 100, height = 200)->

        # Call the group constructor
        super @game

        # Create a background image and add it to ourself
        backTexture = @game.make.bitmapData width, height, 'backTexture', true
        backTexture.fill 50, 50, 75, 0.5 # r, g, b, a
        @background = @game.make.image 0, 0
        @background.loadTexture backTexture
        @add(@background)

        # Create a text object and add it to ourself
        @text = new Phaser.Text @game, 0, 0, '', {fill: 'white', font: '11pt Arial'}
        @text.wordWrap = true
        @text.wordWrapWidth = width
        @add(@text)

        return this

    update: ()->
        @updateBackgroundHeight()

    updateBackgroundHeight: ()->
        @background.height = @text.height
