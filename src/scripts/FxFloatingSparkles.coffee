class exports.FxFloatingSparkles extends Phaser.Group

    MAX_ASTEROIDS: 100
    spawnTimer: 0

    constructor: (@game)->

        # Call the group constructor
        super @game

        # Create a pool of asteroids
        # @asteroidGroup = @game.add.group()
        @enableBody = true
        @physicsBodyType = Phaser.Physics.ARCADE
        @createMultiple(@MAX_ASTEROIDS, 'particle', 0)

        # Create a timer for spawning a new asteroid
        @spawnTimer = 0

        # add ourselves to the game state
        # game.add.existing this

        return this


    update: ()->
        # Spawn a new asteroid
        @spawnTimer -= @game.time.elapsed
        if (@spawnTimer <= 0)
            @spawnTimer = @game.rnd.integerInRange(5, 50)
            @createNewAsteroid()


    createNewAsteroid: () ->
        asteroid = @getFirstDead() # Recycle a dead asteroid

        if (asteroid)
            dx = 0
            dy = 0
            slow = 10
            fast = 50
            while (dx < slow && dx > -slow && dy < slow && dy > -slow)
                dx = @game.rnd.between(-fast, fast)
                dy = @game.rnd.between(-fast, fast)

            sx = if dx > 0 then 0 else @game.world.width
            sy = if dy > 0 then 0 else @game.world.height

            direction = @game.rnd.pick(['h', 'v'])
            sx = if direction == 'h' then @game.rnd.between(0, @game.world.width) else sx
            sy = if direction == 'v' then @game.rnd.between(0, @game.world.height) else sy

            # asteroid.reset(@game.world.width + 100, @game.world.height - 48) # Position on ground
            asteroid.reset(sx, sy) # Position on ground
            asteroid.revive() # Set "alive"

            # set a random scale and alpha
            depth = @game.rnd.realInRange(0.1, 0.8)
            # asteroid.scale = depth
            asteroid.alpha = depth

            asteroid.body.velocity.setTo(0, 0) # Stop moving
            asteroid.body.acceleration.setTo(0, 0) # Stop accelerating

            # Set initial movement
            asteroid.body.velocity.x = dx
            asteroid.body.velocity.y = dy

            # Set random rotation
            asteroid.rotation = Phaser.Math.degToRad(@game.rnd.angle()) # Reset rotation

            # Set animation frame to 0
            asteroid.frame = 0

            # Center sprite
            asteroid.anchor.setTo(0.5, 0.5)

            # Asteroids should kill themselves when they leave the world.
            # Phaser takes care of this for me by setting this flag
            # but you can do it yourself by killing the asteroid if
            # its x,y coordinates are outside of the world.
            asteroid.checkWorldBounds = true
            asteroid.outOfBoundsKill = true
