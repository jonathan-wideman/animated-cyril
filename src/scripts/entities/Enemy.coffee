class exports.Enemy extends Phaser.Sprite
    # how fast can we move
    MAX_SPEED: 100
    MIN_DISTANCE: 64

    constructor: (@game, @player)->

        # Set our position to the world center
        x = @game.world.centerX
        y = @game.world.centerY

        # Call the sprite constructor
        super @game, x, y, 'enemy'

        # Set the anchor to the center of the sprite
        @anchor.setTo 0.5, 0.5

        # Add some animations
        @animations.add 'up', [0, 1, 2, 3], 10, true
        @animations.add 'down', [4, 5, 6, 7], 10, true
        @animations.add 'left', [8, 9, 10, 11], 10, true
        @animations.add 'right', [12, 13, 14, 15], 10, true

        # Enable physics
        @game.physics.enable @, Phaser.Physics.ARCADE

        # add ourselves to the game state
        @game.add.existing this

        @animations.play('down')

        return this


    update: ()=>
        @follow(@player)
        @updateFacing()

    updateFacing: ()->
        h = if @body.velocity.x < 0 then 'left' else 'right'
        v = if @body.velocity.y < 0 then 'up' else 'down'
        dir = if Math.abs(@body.velocity.x) > Math.abs(@body.velocity.y) then h else v
        @animations.play(dir)

    newDirection: ()->
        direction = @game.rand.pick ['up', 'down', 'left', 'right']
        console.log direction
        return direction

    follow: (target)->
        # Calculate distance to target
        distance = @game.math.distance(@x, @y, target.x, target.y)

        # If the distance > MIN_DISTANCE then move
        if (distance > @MIN_DISTANCE)
            # Calculate the angle to the target
            angleToTarget = @game.math.angleBetween(@x, @y, target.x, target.y)

            # Calculate velocity vector based on angleToTarget and @MAX_SPEED
            @body.velocity.x = Math.cos(angleToTarget) * @MAX_SPEED
            @body.velocity.y = Math.sin(angleToTarget) * @MAX_SPEED
        else
            @body.velocity.setTo(0, 0)
