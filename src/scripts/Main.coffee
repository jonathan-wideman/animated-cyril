Juice = require("./utils/Juice").Juice
FxFloatingSparkles = require("./utils/FxFloatingSparkles").FxFloatingSparkles

Player = require("./entities/Player").Player

Enemy = require("./entities/Enemy").Enemy

Stockpile = require('./logic/Stockpile').Stockpile

window.onload = ()->

    # On window load, create the Phaser game object,
    #  and load gamestate as the initial state
    window.game = new Phaser.Game(640, 640, Phaser.CANVAS, 'game-container', gamestate)

gamestate =
    preload: ()->
        # Load us some assets
        # game.load.image 'player', 'assets/img/player.png'
        game.load.image 'tileSelect', 'assets/img/star1.png'
        game.load.image 'star2', 'assets/img/star2.png'
        game.load.image 'missile', 'assets/img/star3.png'
        game.load.image 'particle', 'assets/img/flash.png'

        # load some building sprites
        game.load.image 'buildingTest', 'assets/img/buildingTest.png'
        game.load.image 'buildingDecanter', 'assets/img/buildingDecanter.png'
        game.load.image 'buildingSump', 'assets/img/buildingSump.png'
        game.load.image 'buildingWall', 'assets/img/buildingWall.png'

        # load the player spritesheet
        game.load.spritesheet 'player', 'assets/img/player.png', 32, 32

        # load an enemy spritesheet
        game.load.spritesheet 'enemy', 'assets/img/enemy.png', 64, 64

        # Load tiles
        game.load.image 'tiles', 'assets/img/tiles.png'

        # load some sounds
        game.load.audio('sndMissile', 'assets/snd/steam.ogg')
        game.load.audio('sndTeleport', 'assets/snd/cloth2.ogg')
        game.load.audio('sndPlace', 'assets/snd/cloth2.ogg')
        # game.load.audio('sndTile', 'assets/snd/rollover1.wav')
        # game.load.audio('sndTile', 'assets/snd/rollover2.wav')
        # game.load.audio('sndTile', 'assets/snd/rollover3.wav')
        # game.load.audio('sndTile', 'assets/snd/rollover4.wav')
        # game.load.audio('sndTile', 'assets/snd/rollover5.wav')
        game.load.audio('sndTile', 'assets/snd/rollover6.wav')

        game.plugins.screenShake = game.plugins.add(Phaser.Plugin.ScreenShake)
        game.plugins.screenShake.setup
            shakeX: false
            shakeY: true
            sensCoef: .5

    create: ()->
        # # Add a Hello World message
        # foo = game.add.text 10, 10, "Hello World", {fill: 'white'}

        # Add a registry object to the game scope to keep track of some global references
        @game.reg = {}

        # Add a shortcut to the game ui (TODO: make it a class extending group)
        @game.ui = {}

        @createStockpile()
        @createNextTurnSignal()

        # Create floating sparkles background effect
        @sparkles = new FxFloatingSparkles(game)

        ########################################################################
        #  Creates a blank tilemap
        @map = game.add.tilemap()

        #  Add a Tileset image to the map
        @map.addTilesetImage('tiles')

        # increase the tilemap bias in the physics system to prevent clipping into tiles
        # game.physics.arcade.TILE_BIAS = 64

        MAP_WIDTH = 40
        MAP_HEIGHT = 30

        #  Creates a new blank layer and sets the map dimensions.
        #  In this case the map is 40x30 tiles in size and the tiles are 32x32 pixels in size.
        layer1 = @map.create('level1', MAP_WIDTH, MAP_HEIGHT, 32, 32)
        # layer1.scrollFactorX = 0.5
        # layer1.scrollFactorY = 0.5

        #  Resize the world
        layer1.resizeWorld()

        # layer1.debug = true

        @currentLayer = layer1
        @currentTile = 7

        # @map.putTile(@currentTile, 0, 0, @currentLayer)
        @map.fill(@currentTile, 0, 0, MAP_WIDTH, MAP_HEIGHT, @currentLayer)

        # make a little island
        @currentTile = 0
        @map.fill(@currentTile, 10, 10, 18, 10, @currentLayer)


        @game.currentLevel = {
            tilemap: @map,
            currentLayer: @currentLayer,
        }

        # set collision on the tilemap
        # this is done after generating the map so that collision will update properly
        # the fill command doesn't seem to update the collision boxes
        @map.setCollision([ 7 ], true, 'level1')

        ########################################################################


        # Create a player object
        @player = new Player(game)

        # Create an enemy object
        @enemy = new Enemy(game, @player)


        # Have the camera follow the player
        @game.camera.follow @player, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT

        # add us a juice
        @game.juice = new Juice(@game)

        # add next turn key
        @game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onUp.add(
            ()->
                # console.log 'key callback context:  '
                # console.log @
                @game.onNextTurn.dispatch()
        )

        # add sort key
        @game.input.keyboard.addKey(Phaser.Keyboard.Z).onUp.add(
            ()->
                # console.log 'key callback context:  '
                # console.log @
                @game.world.sort('y')
        )

        # add a ui group on top of everything
        @game.ui.group = @game.add.group()
        @game.ui.group.fixedToCamera = true
        @game.ui.tooltip = @game.add.text(0, 0, '', {fill: 'white', font: '11pt Arial'})
        @game.ui.tooltip.target = null

        # Show Debug Status text
        @game.time.advancedTiming = true
        @statusText = @game.add.text(
            20, 20, '', { font: '16px Arial', fill: '#ffffff' }
        )
        @statusText.fixedToCamera = true


    update: ()->
        @game.physics.arcade.collide(@player, @currentLayer)

        # update status text
        @statusText.setText(@getStatusText())


    getStatusText: ()->
        status = ''
        status += @game.time.fps + ' FPS' + '\n'
        status += '\n'
        status += 'TOOL: ' + @player.tool.name + '\n'
        status += @player.tool.getStatusText() + '\n'
        status += '\n'
        status += 'STOCKPILE: \n'
        status += @game.reg.stockpile.getStatusText()
        return status


    createNextTurnSignal: ()->
        @game.onNextTurn = new Phaser.Signal()


    createStockpile: ()->
        @game.reg.stockpile = new Stockpile(@game)


        # console.log @game.reg.stockpile
