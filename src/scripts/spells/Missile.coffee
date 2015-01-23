

class exports.Missile extends Phaser.Sprite
    # Number of bullets in the bullet @pool (NOT ammo. Check Player.ammo)
    number_of_bullets: 12

    # When we fired the last shot
    last_bullet_time: 0

    # How fast bullets move
    speed: 400

    # How long you have to wait (ms) between shooting
    fire_delay: 200

    click_time: 100

    constructor: (@game, @player)->
        super @game, 0, 0, 'missile', 1
        @anchor.setTo 0.5, 0.5

        @pool = @game.make.group()
        @_fillPool()

        @player.group.add @
        @player.group.add @pool

        @game.input.mouse.mouseDownCallback = @shoot

        return this

    update: ()=>
        @x = @player.x
        @y = @player.y

        @rotation = @game.physics.arcade.angleToPointer(@)


    # Attempts to shoot the gun.
    # Currently there are a few conditions on shooting:
    #
    #   - you can't fire too fast (we check if @fire_delay) has elapsed
    #       since you last shot
    #   - you can't shoot if you don't have any ammo
    #
    # Bullets are drawn from @pool and recycled
    #
    shoot: ()=>
        return if @game.time.now - @game.input.activePointer.timeDown < @click_time
        return if @game.time.now - @last_bullet_time < @fire_delay
        return if @loaded_bullets is 0

        # @game.custom_fx.flash2.flash(5000, 255, 255, 255, 1)
        # @game.custom_fx.flash.flash(30000, 0, 0, 0, 0.25)
        @game.custom_fx.flash2.flash(250, 255, 255, 255, 0.75)
        # @game.custom_fx.flash.flash(3000, 0, 0, 0, 0.25)

        @last_bullet_time = @game.time.now

        bullet = @pool.getFirstDead()

        if not bullet?
            return

        bullet.revive()
        bullet.reset @x, @y
        bullet.rotation = @rotation

        bullet.body.velocity.x = Math.cos(bullet.rotation) * @speed
        bullet.body.velocity.y = Math.sin(bullet.rotation) * @speed

        @loaded_bullets--


    # Attempts to put a bullet in the gun. If
    # we've loaded the max number of bullets,
    # then return false (so the player knows if
    # we successfully loaded a round). Likewise,
    # if we try reloading too quickly, return
    # false.Otherwise load the bullet and return
    # the number of loaded bullets
    reload: ()->
        if @loaded_bullets is @max_bullets
            return false

        return false if @game.time.now - @last_reloaded_time < @reload_delay
        @last_reloaded_time = @game.time.now

        ++@loaded_bullets

    # Populates the initial bullet @pool.
    _fillPool: ()->
        for i in [0..@number_of_bullets]
            bullet = @game.add.sprite 0, 0, 'player_bullet'
            bullet.anchor.setTo 0.5, 0.5
            bullet.checkWorldBounds = true
            bullet.outOfBoundsKill = true
            bullet.damageAmount = 1

            @pool.add(bullet)

            @game.physics.enable bullet, Phaser.Physics.ARCADE
            bullet.kill()
