class exports.Juice

    constructor: (@game)->

        @defaultSoundVolume = 1

        # Add sounds
        @sndTile = game.add.sound('sndTile', @defaultSoundVolume)
        @sndTile.allowMultiple = true

        @sndMissile = game.add.sound('sndMissile', @defaultSoundVolume)
        @sndMissile.allowMultiple = true

        @sndTeleport = game.add.sound('sndTeleport', @defaultSoundVolume)
        @sndTeleport.allowMultiple = true

        @sndPlace = @game.add.sound('sndPlace')
        @sndPlace.allowMultiple = true

        # particles
        @emitter = game.add.emitter(0, 0, 1000)

        @emitter.makeParticles('particle')
        @emitter.gravity = 300


        return this


    shake: ()->
        @game.add.tween(@game.camera)
            .from({ y: @game.camera.y - 5 }, 50, Phaser.Easing.Sinusoidal.InOut, false, 0, 4, true)
            .start()
        # console.log 'shake shake!'

    splode: (x, y)->
        #  Position the emitter where the mouse/touch event was
        @emitter.x = x
        @emitter.y = y

        #  The first parameter sets the effect to "explode" which means all particles are emitted at once
        #  The second gives each particle a 2000ms lifespan
        #  The third is ignored when using burst/explode mode
        #  The final parameter (10) is how many particles will be emitted in this single burst
        @emitter.start(true, 250, null, 5)

    pew: () ->
        @sndMissile.play()

    foosh: (x1, y1, x2, y2)->
        @sndTeleport.play()
        @splode x1, y1
        @splode x2, y2

    build: () ->
        @sndPlace.play()

    plop: (x, y)->
        # play a new plop sound
        # sndTile = game.add.sound('sndTile', @defaultSoundVolume)
        @sndTile.play()

        @splode x, y

    popText: (x, y, msg)->
        text = @game.add.text x, y, msg, {fill: 'white', font: 'Bold 11pt Arial'}
        @game.add.tween text
            .to({ y: text.y - 32 }, 500,  Phaser.Easing.Quadratic.Out, true)
            .onComplete.add(
                ()->
                    @destroy()
                , text)

