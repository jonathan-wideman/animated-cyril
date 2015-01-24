# The build tool allows the player to place tiles
class exports.ToolMissile

    # tool name should be displayed in the status bar
    name: "Magic Missile"

    # Define constants
    SHOT_DELAY: 250 # milliseconds
    BULLET_SPEED: 450 # pixels/second
    NUMBER_OF_BULLETS: 20
    ROTATION_OFFSET: 0
    BULLET_ENERGY_COST: 50

    constructor: (@game, @player)->

        @ROTATION_OFFSET = Phaser.Math.degToRad 90

        # Create an object representing our gun
        @gun = @game.add.sprite 50, @game.height/2, 'missile'

        # Make the gun invisible
        @gun.visible = false;

        # Set the pivot point to the center of the gun
        @gun.anchor.setTo 0.5, 0.5

        # create some bullets
        @createBullets()

        @unselect()

        return this

    update: ()=>

        # Move the gun to the player
        @gun.x = @player.x
        @gun.y = @player.y
        # @gun.rotation = @player.rotation
        # Rotate the gun to face the mouse
        @gun.rotation = @game.physics.arcade.angleToPointer @gun

        # shot the things
        if @fireInputIsActive()
            @player.animations.play('cast')
            @shootBullet()
        else
            @player.animations.play('idle')

        # l-click to fire

        # r-click to
        #   pick targets?
        #   guide missiles?
        #   defend?


    # This function should return true when the player activates the "fire" control
    # In this case, either holding the space bar
    fireInputIsActive: ()->
        isActive = false;

        # fireKey = @game.input.keyboard.isDown Phaser.Keyboard.SPACEBAR
        fireButton = @game.input.mouse.button is Phaser.Mouse.LEFT_BUTTON

        # isActive = fireKey or fireButton

        return fireButton


    createBullets: ()->

        # Create an object pool of bullets
        @bulletPool = @game.add.group()
        for i in [0..@NUMBER_OF_BULLETS]
            # Create each bullet and add it to the group.
            bullet = @game.add.sprite 0, 0, 'missile'
            @bulletPool.add bullet

            # Set its pivot point to the center of the bullet
            # bullet.anchor.setTo(0.5, -0.25);
            bullet.anchor.setTo 0.5, 0.5

            # Enable physics on the bullet
            @game.physics.enable bullet, Phaser.Physics.ARCADE

            # Give the bullet a power value which it uses to deal damage
            bullet.power = 1

            # Set its initial state to "dead".
            bullet.kill();


    shootBullet: ()->
        # Enforce a short delay between shots by recording
        # the time that each bullet is shot and testing if
        # the amount of time since the last shot is more than
        # the required delay.
        if @lastBulletShotAt is undefined
            @lastBulletShotAt = 0
        if @game.time.now - @lastBulletShotAt < @SHOT_DELAY
            return
        @lastBulletShotAt = @game.time.now

        # Get a dead bullet from the pool
        bullet = @bulletPool.getFirstDead()

        # If there aren't any bullets available then don't shoot
        if bullet is null or bullet is undefined
            return

        # Revive the bullet
        # This makes the bullet "alive"
        bullet.revive()

        # Bullets should kill themselves when they leave the world.
        # Phaser takes care of this for me by setting this flag
        # but you can do it yourself by killing the bullet if
        # its x,y coordinates are outside of the world.
        bullet.checkWorldBounds = true
        bullet.outOfBoundsKill = true

        # Set the bullet position to the gun position.
        bullet.reset @gun.x, @gun.y
        bullet.rotation = @gun.rotation - @ROTATION_OFFSET
        # console.log(bullet.rotation);

        # Shoot it
        bullet.body.velocity.x = Math.cos(bullet.rotation + @ROTATION_OFFSET) * @BULLET_SPEED
        bullet.body.velocity.y = Math.sin(bullet.rotation + @ROTATION_OFFSET) * @BULLET_SPEED

        # Do some juice
        @game.juice.pew()

    getStatusText: ()->
        return ''

    select: ()->

    unselect: ()->
