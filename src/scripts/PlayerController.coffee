class exports.PlayerController

    keyboard_modes: {
        QWERTY: {
            up: Phaser.Keyboard.W
            down: Phaser.Keyboard.S
            left: Phaser.Keyboard.A
            right: Phaser.Keyboard.D
        }
        DVORAK: {
            up: 188 # Comma
            down: Phaser.Keyboard.O
            left: Phaser.Keyboard.A
            right: Phaser.Keyboard.E
        }

    }

    constructor: (@game, @player)->
        @cursors = game.input.keyboard.createCursorKeys()
        @setKeymap("QWERTY")

        @game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.W,
            Phaser.Keyboard.S,
            Phaser.Keyboard.A,
            Phaser.Keyboard.D,
            Phaser.Keyboard.Q,
            Phaser.Keyboard.E,
            Phaser.Keyboard.SPACEBAR,
            Phaser.Keyboard.ENTER,
        ]);

    setKeymap: (mode)=>
        if @keyboard_modes[mode]?
            @keyboard_mode = @keyboard_modes[mode]

    update: ()->

        # Reset the player's velocity
        @player.body.velocity.x = 0
        @player.body.velocity.y = 0

        # Set left or right velocity
        if @cursors.left.isDown or @game.input.keyboard.isDown(@keyboard_mode.left)
            @player.body.velocity.x = -1 * @player.speed
        else if @cursors.right.isDown or @game.input.keyboard.isDown(@keyboard_mode.right)
            @player.body.velocity.x = @player.speed

        # Set up or down velocity
        if @cursors.up.isDown or @game.input.keyboard.isDown(@keyboard_mode.up)
            @player.body.velocity.y = -1 * @player.speed
        else if @cursors.down.isDown or @game.input.keyboard.isDown(@keyboard_mode.down)
            @player.body.velocity.y = @player.speed

        if @game.input.keyboard.downDuration(Phaser.Keyboard.SPACEBAR, 10)
            @player.nextTool()

        # # TODO: we'll want to switch this so we've got our check-ammo
        # # screen, rather than explicitly pressing the R key to reload
        # if @game.input.keyboard.justPressed(Phaser.Keyboard.R)
        #     @player.reloadGun()
