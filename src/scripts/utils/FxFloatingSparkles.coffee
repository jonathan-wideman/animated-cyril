class exports.FxFloatingSparkles extends Phaser.Group

    MAX_PARTICLES: 100
    spawnTimer: 0

    constructor: (@game)->

        # Call the group constructor
        super @game

        # Create a pool of particles
        # @particleGroup = @game.add.group()
        @enableBody = true
        @physicsBodyType = Phaser.Physics.ARCADE
        @createMultiple(@MAX_PARTICLES, 'particle', 0)

        # Create a timer for spawning a new particle
        @spawnTimer = 0

        # add ourselves to the game state
        # game.add.existing this

        return this


    update: ()->
        # Spawn a new particle
        @spawnTimer -= @game.time.elapsed
        if (@spawnTimer <= 0)
            @spawnTimer = @game.rnd.integerInRange(5, 50)
            @createNewAsteroid()


    createNewAsteroid: () ->
        particle = @getFirstDead() # Recycle a dead particle

        if (particle)
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

            # particle.reset(@game.world.width + 100, @game.world.height - 48) # Position on ground
            particle.reset(sx, sy) # Position on ground
            particle.revive() # Set "alive"

            # set a random scale and alpha
            depth = @game.rnd.realInRange(0.1, 0.8)
            # particle.scale = depth
            particle.alpha = depth

            particle.body.velocity.setTo(0, 0) # Stop moving
            particle.body.acceleration.setTo(0, 0) # Stop accelerating

            # Set initial movement
            particle.body.velocity.x = dx
            particle.body.velocity.y = dy

            # Set random rotation
            particle.rotation = Phaser.Math.degToRad(@game.rnd.angle()) # Reset rotation

            # Set animation frame to 0
            particle.frame = 0

            # Center sprite
            particle.anchor.setTo(0.5, 0.5)

            # Asteroids should kill themselves when they leave the world.
            # Phaser takes care of this for me by setting this flag
            # but you can do it yourself by killing the particle if
            # its x,y coordinates are outside of the world.
            particle.checkWorldBounds = true
            particle.outOfBoundsKill = true
