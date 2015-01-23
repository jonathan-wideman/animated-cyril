(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var BuildingController,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BuildingController = require("./BuildingController").BuildingController;

exports.Building = (function(_super) {
  __extends(Building, _super);

  function Building(game) {
    var x, y;
    this.game = game;
    this.update = __bind(this.update, this);
    x = this.game.world.centerX;
    y = this.game.world.centerY;
    Building.__super__.constructor.call(this, this.game, x, y, 'player');
    this.anchor.setTo(0.5, 0.5);
    this.controller = new BuildingController(this.game, this);
    return this;
  }

  Building.prototype.update = function() {
    return this.controller.update();
  };

  return Building;

})(Phaser.Sprite);



},{"./BuildingController":2}],2:[function(require,module,exports){
exports.BuildingController = (function() {
  function BuildingController(game, building) {
    this.game = game;
    this.building = building;
    this.building.inputEnabled = true;
    this.building.input.enableDrag();
    this.building.input.enableSnap(32, 32, true, true);
  }

  BuildingController.prototype.update = function() {};

  return BuildingController;

})();



},{}],3:[function(require,module,exports){
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

exports.BuildingTest = (function(_super) {
  __extends(BuildingTest, _super);

  BuildingTest.prototype.name = 'Test Building';

  BuildingTest.prototype.isConstructed = false;

  function BuildingTest(game, x, y) {
    this.game = game;
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    BuildingTest.__super__.constructor.call(this, this.game, x, y, 'buildingTest');
    this.anchor.setTo(0.5, 0.5);
    this.alpha = 0.5;
    this.tint = 0xffccffcc;
    this.inputEnabled = false;
    this.events.onInputOver.add(this.hover, this);
    this.events.onInputOut.add(this.unhover, this);
    game.add.existing(this);
    this.name = 'Test Building';
    this.addNextTurnListener();
    return this;
  }

  BuildingTest.prototype.build = function() {
    this.alpha = 1;
    this.tint = 0xffffffff;
    this.inputEnabled = true;
    this.isConstructed = true;
  };

  BuildingTest.prototype.addNextTurnListener = function() {
    return this.game.onNextTurn.add(this.nextTurn, this);
  };

  BuildingTest.prototype.nextTurn = function() {
    if (!this.isConstructed) {
      return;
    }
    this.game.reg.stockpile.earn(this.game.reg.stockpile.AER, 1);
    return this.game.juice.popText(this.x, this.y, this.game.reg.stockpile.AER + ' +1');
  };

  BuildingTest.prototype.hover = function() {
    if (!this.isConstructed) {
      return;
    }
    this.game.ui.tooltip.target = this;
    this.game.ui.tooltip.visible = true;
    this.game.ui.tooltip.text = this.name;
    this.game.ui.tooltip.x = this.x - this.game.ui.tooltip.width / 2;
    return this.game.ui.tooltip.y = this.y - 32;
  };

  BuildingTest.prototype.unhover = function() {
    if (!this.isConstructed) {
      return;
    }
    if (this.game.ui.tooltip.target === this) {
      this.game.ui.tooltip.visible = false;
      return this.game.ui.tooltip.target = null;
    }
  };

  return BuildingTest;

})(Phaser.Sprite);



},{}],4:[function(require,module,exports){
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

exports.Enemy = (function(_super) {
  __extends(Enemy, _super);

  Enemy.prototype.MAX_SPEED = 100;

  Enemy.prototype.MIN_DISTANCE = 64;

  function Enemy(game, player) {
    var x, y;
    this.game = game;
    this.player = player;
    this.update = __bind(this.update, this);
    x = this.game.world.centerX;
    y = this.game.world.centerY;
    Enemy.__super__.constructor.call(this, this.game, x, y, 'enemy');
    this.anchor.setTo(0.5, 0.5);
    this.animations.add('up', [0, 1, 2, 3], 10, true);
    this.animations.add('down', [4, 5, 6, 7], 10, true);
    this.animations.add('left', [8, 9, 10, 11], 10, true);
    this.animations.add('right', [12, 13, 14, 15], 10, true);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    game.add.existing(this);
    this.animations.play('down');
    return this;
  }

  Enemy.prototype.update = function() {
    this.follow(this.player);
    return this.updateFacing();
  };

  Enemy.prototype.updateFacing = function() {
    var dir, h, v;
    h = this.body.velocity.x < 0 ? 'left' : 'right';
    v = this.body.velocity.y < 0 ? 'up' : 'down';
    dir = Math.abs(this.body.velocity.x) > Math.abs(this.body.velocity.y) ? h : v;
    return this.animations.play(dir);
  };

  Enemy.prototype.newDirection = function() {
    var direction;
    direction = this.game.rand.pick(['up', 'down', 'left', 'right']);
    console.log(direction);
    return direction;
  };

  Enemy.prototype.follow = function(target) {
    var angleToTarget, distance;
    distance = this.game.math.distance(this.x, this.y, target.x, target.y);
    if (distance > this.MIN_DISTANCE) {
      angleToTarget = this.game.math.angleBetween(this.x, this.y, target.x, target.y);
      this.body.velocity.x = Math.cos(angleToTarget) * this.MAX_SPEED;
      return this.body.velocity.y = Math.sin(angleToTarget) * this.MAX_SPEED;
    } else {
      return this.body.velocity.setTo(0, 0);
    }
  };

  return Enemy;

})(Phaser.Sprite);



},{}],5:[function(require,module,exports){
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

exports.FxFloatingSparkles = (function(_super) {
  __extends(FxFloatingSparkles, _super);

  FxFloatingSparkles.prototype.MAX_ASTEROIDS = 100;

  FxFloatingSparkles.prototype.spawnTimer = 0;

  function FxFloatingSparkles(game) {
    this.game = game;
    FxFloatingSparkles.__super__.constructor.call(this, this.game);
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.ARCADE;
    this.createMultiple(this.MAX_ASTEROIDS, 'particle', 0);
    this.spawnTimer = 0;
    return this;
  }

  FxFloatingSparkles.prototype.update = function() {
    this.spawnTimer -= this.game.time.elapsed;
    if (this.spawnTimer <= 0) {
      this.spawnTimer = this.game.rnd.integerInRange(5, 50);
      return this.createNewAsteroid();
    }
  };

  FxFloatingSparkles.prototype.createNewAsteroid = function() {
    var asteroid, depth, direction, dx, dy, fast, slow, sx, sy;
    asteroid = this.getFirstDead();
    if (asteroid) {
      dx = 0;
      dy = 0;
      slow = 10;
      fast = 50;
      while (dx < slow && dx > -slow && dy < slow && dy > -slow) {
        dx = this.game.rnd.between(-fast, fast);
        dy = this.game.rnd.between(-fast, fast);
      }
      sx = dx > 0 ? 0 : this.game.world.width;
      sy = dy > 0 ? 0 : this.game.world.height;
      direction = this.game.rnd.pick(['h', 'v']);
      sx = direction === 'h' ? this.game.rnd.between(0, this.game.world.width) : sx;
      sy = direction === 'v' ? this.game.rnd.between(0, this.game.world.height) : sy;
      asteroid.reset(sx, sy);
      asteroid.revive();
      depth = this.game.rnd.realInRange(0.1, 0.8);
      asteroid.alpha = depth;
      asteroid.body.velocity.setTo(0, 0);
      asteroid.body.acceleration.setTo(0, 0);
      asteroid.body.velocity.x = dx;
      asteroid.body.velocity.y = dy;
      asteroid.rotation = Phaser.Math.degToRad(this.game.rnd.angle());
      asteroid.frame = 0;
      asteroid.anchor.setTo(0.5, 0.5);
      asteroid.checkWorldBounds = true;
      return asteroid.outOfBoundsKill = true;
    }
  };

  return FxFloatingSparkles;

})(Phaser.Group);



},{}],6:[function(require,module,exports){
exports.Juice = (function() {
  function Juice(game) {
    this.game = game;
    this.defaultSoundVolume = 1;
    this.sndTile = game.add.sound('sndTile', this.defaultSoundVolume);
    this.sndTile.allowMultiple = true;
    this.sndMissile = game.add.sound('sndMissile', this.defaultSoundVolume);
    this.sndMissile.allowMultiple = true;
    this.sndTeleport = game.add.sound('sndTeleport', this.defaultSoundVolume);
    this.sndTeleport.allowMultiple = true;
    this.emitter = game.add.emitter(0, 0, 1000);
    this.emitter.makeParticles('particle');
    this.emitter.gravity = 300;
    return this;
  }

  Juice.prototype.shake = function() {
    return this.game.add.tween(this.game.camera).from({
      y: this.game.camera.y - 5
    }, 50, Phaser.Easing.Sinusoidal.InOut, false, 0, 4, true).start();
  };

  Juice.prototype.splode = function(x, y) {
    this.emitter.x = x;
    this.emitter.y = y;
    return this.emitter.start(true, 250, null, 5);
  };

  Juice.prototype.pew = function() {
    return this.sndMissile.play();
  };

  Juice.prototype.foosh = function(x1, y1, x2, y2) {
    this.sndTeleport.play();
    this.splode(x1, y1);
    return this.splode(x2, y2);
  };

  Juice.prototype.plop = function(x, y) {
    this.sndTile.play();
    return this.splode(x, y);
  };

  Juice.prototype.popText = function(x, y, msg) {
    var text;
    text = this.game.add.text(x, y, msg, {
      fill: 'white',
      font: 'Bold 11pt Arial'
    });
    return this.game.add.tween(text).to({
      y: text.y - 32
    }, 500, Phaser.Easing.Quadratic.Out, true).onComplete.add(function() {
      return this.destroy();
    }, text);
  };

  return Juice;

})();



},{}],7:[function(require,module,exports){
var Building, Enemy, FxFloatingSparkles, Juice, Player, gamestate;

Juice = require("./Juice").Juice;

FxFloatingSparkles = require("./FxFloatingSparkles").FxFloatingSparkles;

Player = require("./Player").Player;

Building = require("./Building").Building;

Enemy = require("./Enemy").Enemy;

window.onload = function() {
  return window.game = new Phaser.Game(640, 640, Phaser.CANVAS, 'game-container', gamestate);
};

gamestate = {
  preload: function() {
    game.load.image('tileSelect', 'assets/img/star1.png');
    game.load.image('star2', 'assets/img/star2.png');
    game.load.image('missile', 'assets/img/star3.png');
    game.load.image('particle', 'assets/img/flash.png');
    game.load.image('buildingTest', 'assets/img/buildingTest.png');
    game.load.spritesheet('player', 'assets/img/player.png', 32, 32);
    game.load.spritesheet('enemy', 'assets/img/enemy.png', 64, 64);
    game.load.image('tiles', 'assets/img/tiles.png');
    game.load.audio('sndMissile', 'assets/snd/steam.ogg');
    game.load.audio('sndTeleport', 'assets/snd/cloth2.ogg');
    return game.load.audio('sndTile', 'assets/snd/rollover6.wav');
  },
  create: function() {
    var MAP_HEIGHT, MAP_WIDTH, layer1;
    this.game.reg = {};
    this.game.ui = {};
    this.createStockpile();
    this.createNextTurnSignal();
    this.sparkles = new FxFloatingSparkles(game);
    this.map = game.add.tilemap();
    this.map.addTilesetImage('tiles');
    MAP_WIDTH = 40;
    MAP_HEIGHT = 30;
    layer1 = this.map.create('level1', MAP_WIDTH, MAP_HEIGHT, 32, 32);
    layer1.resizeWorld();
    this.currentLayer = layer1;
    this.currentTile = 7;
    this.map.fill(this.currentTile, 0, 0, MAP_WIDTH, MAP_HEIGHT, this.currentLayer);
    this.currentTile = 0;
    this.map.fill(this.currentTile, 10, 10, 18, 10, this.currentLayer);
    this.game.currentLevel = {
      tilemap: this.map,
      currentLayer: this.currentLayer
    };
    this.map.setCollision([7], true, 'level1');
    this.player = new Player(game);
    this.enemy = new Enemy(game, this.player);
    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);
    this.game.juice = new Juice(this.game);
    this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onUp.add(function() {
      return this.game.onNextTurn.dispatch();
    });
    this.game.input.keyboard.addKey(Phaser.Keyboard.Z).onUp.add(function() {
      return this.game.world.sort('y');
    });
    this.game.ui.group = this.game.add.group();
    this.game.ui.group.fixedToCamera = true;
    this.game.ui.tooltip = this.game.add.text(0, 0, '', {
      fill: 'white',
      font: '11pt Arial'
    });
    this.game.ui.tooltip.target = null;
    this.game.time.advancedTiming = true;
    this.statusText = this.game.add.text(20, 20, '', {
      font: '16px Arial',
      fill: '#ffffff'
    });
    return this.statusText.fixedToCamera = true;
  },
  update: function() {
    this.game.physics.arcade.collide(this.player, this.currentLayer);
    return this.statusText.setText(this.getStatusText());
  },
  getStatusText: function() {
    var status;
    status = '';
    status += this.game.time.fps + ' FPS' + '\n';
    status += '\n';
    status += 'TOOL: ' + this.player.tool.name + '\n';
    status += this.player.tool.getStatusText() + '\n';
    status += '\n';
    status += 'STOCKPILE: \n';
    status += this.game.reg.stockpile.getStatusText();
    return status;
  },
  createNextTurnSignal: function() {
    return this.game.onNextTurn = new Phaser.Signal();
  },
  createStockpile: function() {
    return this.game.reg.stockpile = {
      AER: 'Aeregium',
      DYN: 'Dynamis',
      resources: [
        {
          name: 'Aeregium',
          amount: 0
        }, {
          name: 'Dynamis',
          amount: 0
        }
      ],
      getStatusText: function() {
        var resource, status, _i, _len, _ref;
        status = '';
        _ref = this.resources;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          resource = _ref[_i];
          status += resource.name + ': ' + resource.amount + '\n';
        }
        return status;
      },
      find: function(resource) {
        return _.find(this.resources, {
          name: resource
        });
      },
      earn: function(resource, amount) {
        var stock;
        stock = this.find(resource);
        if (!stock) {
          stock = {
            name: resource,
            amount: 0
          };
          this.resources.push(stock);
        }
        return stock.amount += amount;
      },
      canAfford: function(resource, amount) {
        var stock;
        stock = this.find(resource);
        if (!stock) {
          return false;
        }
        return stock.amount >= amount;
      },
      spend: function(resource, amount) {
        var stock;
        if (!this.canAfford(resource, amount)) {
          return false;
        }
        stock = this.find(resource);
        stock.amount -= amount;
        return true;
      }
    };
  }
};



},{"./Building":1,"./Enemy":4,"./FxFloatingSparkles":5,"./Juice":6,"./Player":8}],8:[function(require,module,exports){
var PlayerController, ToolBuild, ToolMissile, ToolTeleport, ToolTerrain,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PlayerController = require("./PlayerController").PlayerController;

ToolMissile = require("./ToolMissile").ToolMissile;

ToolTerrain = require("./ToolTerrain").ToolTerrain;

ToolTeleport = require("./ToolTeleport").ToolTeleport;

ToolBuild = require("./ToolBuild").ToolBuild;

exports.Player = (function(_super) {
  __extends(Player, _super);

  Player.prototype.speed = 250;

  function Player(game) {
    var x, y;
    this.game = game;
    this.update = __bind(this.update, this);
    x = this.game.world.centerX;
    y = this.game.world.centerY;
    Player.__super__.constructor.call(this, this.game, x, y, 'player');
    this.anchor.setTo(0.5, 0.5);
    this.animations.add('idle', [0]);
    this.animations.add('cast', [1]);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.controller = new PlayerController(this.game, this);
    game.add.existing(this);
    this.tools = [new ToolMissile(this.game, this), new ToolTeleport(this.game, this), new ToolTerrain(this.game, this), new ToolBuild(this.game, this)];
    this.nextTool();
    return this;
  }

  Player.prototype.update = function() {
    this.controller.update();
    if (this.tool != null) {
      return this.tool.update();
    }
  };

  Player.prototype.nextTool = function() {
    if (this.tool) {
      this.tool.unselect();
    }
    this.tool = this.tools.pop();
    if (this.tool) {
      this.tools.unshift(this.tool);
      return this.tool.select();
    }
  };

  return Player;

})(Phaser.Sprite);



},{"./PlayerController":9,"./ToolBuild":10,"./ToolMissile":11,"./ToolTeleport":12,"./ToolTerrain":13}],9:[function(require,module,exports){
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

exports.PlayerController = (function() {
  PlayerController.prototype.keyboard_modes = {
    QWERTY: {
      up: Phaser.Keyboard.W,
      down: Phaser.Keyboard.S,
      left: Phaser.Keyboard.A,
      right: Phaser.Keyboard.D
    },
    DVORAK: {
      up: 188,
      down: Phaser.Keyboard.O,
      left: Phaser.Keyboard.A,
      right: Phaser.Keyboard.E
    }
  };

  function PlayerController(game, player) {
    this.game = game;
    this.player = player;
    this.setKeymap = __bind(this.setKeymap, this);
    this.cursors = game.input.keyboard.createCursorKeys();
    this.setKeymap("QWERTY");
    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.W, Phaser.Keyboard.S, Phaser.Keyboard.A, Phaser.Keyboard.D, Phaser.Keyboard.Q, Phaser.Keyboard.E, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.ENTER]);
  }

  PlayerController.prototype.setKeymap = function(mode) {
    if (this.keyboard_modes[mode] != null) {
      return this.keyboard_mode = this.keyboard_modes[mode];
    }
  };

  PlayerController.prototype.update = function() {
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;
    if (this.cursors.left.isDown || this.game.input.keyboard.isDown(this.keyboard_mode.left)) {
      this.player.body.velocity.x = -1 * this.player.speed;
    } else if (this.cursors.right.isDown || this.game.input.keyboard.isDown(this.keyboard_mode.right)) {
      this.player.body.velocity.x = this.player.speed;
    }
    if (this.cursors.up.isDown || this.game.input.keyboard.isDown(this.keyboard_mode.up)) {
      this.player.body.velocity.y = -1 * this.player.speed;
    } else if (this.cursors.down.isDown || this.game.input.keyboard.isDown(this.keyboard_mode.down)) {
      this.player.body.velocity.y = this.player.speed;
    }
    if (this.game.input.keyboard.downDuration(Phaser.Keyboard.SPACEBAR, 10)) {
      return this.player.nextTool();
    }
  };

  return PlayerController;

})();



},{}],10:[function(require,module,exports){
var BuildingTest,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

BuildingTest = require("./BuildingTest").BuildingTest;

exports.ToolBuild = (function() {
  ToolBuild.prototype.name = "Build";

  ToolBuild.prototype.cooldown = 100;

  ToolBuild.prototype.currentBuilding = null;

  function ToolBuild(game, player) {
    this.game = game;
    this.player = player;
    this.newGhost = __bind(this.newGhost, this);
    this.update = __bind(this.update, this);
    this.constructing = false;
    this.gun = this.game.add.sprite(50, this.game.height / 2, 'star2');
    this.gun.anchor.setTo(0.5, 0.5);
    this.gun.visible = false;
    this.newGhost(BuildingTest);
    this.unselect();
    return this;
  }

  ToolBuild.prototype.update = function() {
    this.gun.x = this.player.x;
    this.gun.y = this.player.y;
    this.ghost.x = this.game.input.activePointer.worldX;
    this.ghost.y = this.game.input.activePointer.worldY;
    if (!this.constructing) {
      if (this.game.input.mousePointer.justReleased(this.cooldown)) {
        this.player.animations.play('cast');
        this.game.juice.plop(this.ghost.x, this.ghost.y);
        this.buildGhost();
        return this.constructing = true;
      }
    } else {
      if (!this.game.input.mousePointer.justReleased(this.cooldown)) {
        this.player.animations.play('idle');
        return this.constructing = false;
      }
    }
  };

  ToolBuild.prototype.getStatusText = function() {
    var status;
    status = '';
    status += 'building: ' + (this.ghost ? this.ghost.name : 'none' + '\n');
    return status;
  };

  ToolBuild.prototype.select = function() {
    return this.ghost.revive();
  };

  ToolBuild.prototype.unselect = function() {
    return this.ghost.kill();
  };

  ToolBuild.prototype.newGhost = function(buildingType) {
    if (this.ghost && !this.ghost.isConstructed) {
      this.ghost.destroy();
    }
    this.ghost = new buildingType(this.game);
    return this.ghost;
  };

  ToolBuild.prototype.buildGhost = function() {
    if (this.ghost) {
      this.ghost.build();
      return this.newGhost(BuildingTest);
    }
  };

  return ToolBuild;

})();



},{"./BuildingTest":3}],11:[function(require,module,exports){
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

exports.ToolMissile = (function() {
  ToolMissile.prototype.name = "Magic Missile";

  ToolMissile.prototype.SHOT_DELAY = 250;

  ToolMissile.prototype.BULLET_SPEED = 450;

  ToolMissile.prototype.NUMBER_OF_BULLETS = 20;

  ToolMissile.prototype.ROTATION_OFFSET = 0;

  ToolMissile.prototype.BULLET_ENERGY_COST = 50;

  function ToolMissile(game, player) {
    this.game = game;
    this.player = player;
    this.update = __bind(this.update, this);
    this.ROTATION_OFFSET = Phaser.Math.degToRad(90);
    this.gun = this.game.add.sprite(50, this.game.height / 2, 'missile');
    this.gun.visible = false;
    this.gun.anchor.setTo(0.5, 0.5);
    this.createBullets();
    this.unselect();
    return this;
  }

  ToolMissile.prototype.update = function() {
    this.gun.x = this.player.x;
    this.gun.y = this.player.y;
    this.gun.rotation = this.game.physics.arcade.angleToPointer(this.gun);
    if (this.fireInputIsActive()) {
      this.player.animations.play('cast');
      return this.shootBullet();
    } else {
      return this.player.animations.play('idle');
    }
  };

  ToolMissile.prototype.fireInputIsActive = function() {
    var fireButton, isActive;
    isActive = false;
    fireButton = this.game.input.mouse.button === Phaser.Mouse.LEFT_BUTTON;
    return fireButton;
  };

  ToolMissile.prototype.createBullets = function() {
    var bullet, i, _i, _ref, _results;
    this.bulletPool = this.game.add.group();
    _results = [];
    for (i = _i = 0, _ref = this.NUMBER_OF_BULLETS; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      bullet = this.game.add.sprite(0, 0, 'missile');
      this.bulletPool.add(bullet);
      bullet.anchor.setTo(0.5, 0.5);
      this.game.physics.enable(bullet, Phaser.Physics.ARCADE);
      bullet.power = 1;
      _results.push(bullet.kill());
    }
    return _results;
  };

  ToolMissile.prototype.shootBullet = function() {
    var bullet;
    if (this.lastBulletShotAt === void 0) {
      this.lastBulletShotAt = 0;
    }
    if (this.game.time.now - this.lastBulletShotAt < this.SHOT_DELAY) {
      return;
    }
    this.lastBulletShotAt = this.game.time.now;
    bullet = this.bulletPool.getFirstDead();
    if (bullet === null || bullet === void 0) {
      return;
    }
    bullet.revive();
    bullet.checkWorldBounds = true;
    bullet.outOfBoundsKill = true;
    bullet.reset(this.gun.x, this.gun.y);
    bullet.rotation = this.gun.rotation - this.ROTATION_OFFSET;
    bullet.body.velocity.x = Math.cos(bullet.rotation + this.ROTATION_OFFSET) * this.BULLET_SPEED;
    bullet.body.velocity.y = Math.sin(bullet.rotation + this.ROTATION_OFFSET) * this.BULLET_SPEED;
    return this.game.juice.pew();
  };

  ToolMissile.prototype.getStatusText = function() {
    return '';
  };

  ToolMissile.prototype.select = function() {};

  ToolMissile.prototype.unselect = function() {};

  return ToolMissile;

})();



},{}],12:[function(require,module,exports){
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

exports.ToolTeleport = (function() {
  ToolTeleport.prototype.name = "Teleport";

  ToolTeleport.prototype.cooldown = 100;

  function ToolTeleport(game, player) {
    this.game = game;
    this.player = player;
    this.update = __bind(this.update, this);
    this.teleporting = false;
    this.unselect();
    return this;
  }

  ToolTeleport.prototype.update = function() {
    if (!this.teleporting) {
      if (this.game.input.mousePointer.justReleased(this.cooldown)) {
        this.player.animations.play('cast');
        this.game.juice.foosh(this.player.x, this.player.y, game.input.activePointer.worldX, game.input.activePointer.worldY);
        this.player.x = game.input.activePointer.worldX;
        this.player.y = game.input.activePointer.worldY;
        return this.teleporting = true;
      }
    } else {
      if (!this.game.input.mousePointer.justReleased(this.cooldown)) {
        this.player.animations.play('idle');
        return this.teleporting = false;
      }
    }
  };

  ToolTeleport.prototype.getStatusText = function() {
    return 'teleporting: ' + this.teleporting;
  };

  ToolTeleport.prototype.select = function() {};

  ToolTeleport.prototype.unselect = function() {};

  return ToolTeleport;

})();



},{}],13:[function(require,module,exports){
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

exports.ToolTerrain = (function() {
  ToolTerrain.prototype.name = "Terrain";

  ToolTerrain.prototype.currentTileId = 0;

  ToolTerrain.prototype.tilemap = null;

  function ToolTerrain(game, player) {
    this.game = game;
    this.player = player;
    this.update = __bind(this.update, this);
    this.gun = this.game.add.sprite(50, this.game.height / 2, 'star2');
    this.gun.anchor.setTo(0.5, 0.5);
    this.gun.visible = false;
    this.selection = this.game.add.sprite(50, this.game.height / 2, 'tileSelect');
    this.selection.anchor.setTo(0.5, 0.5);
    this.currentTile = 0;
    this.map = this.game.currentLevel.tilemap;
    this.currentLayer = this.game.currentLevel.currentLayer;
    this.unselect();
    return this;
  }

  ToolTerrain.prototype.showPallete = function() {};

  ToolTerrain.prototype.hidePallete = function() {};

  ToolTerrain.prototype.pickPalleteTile = function() {};

  ToolTerrain.prototype.pickTile = function(x, y) {
    if (this.tilemap == null) {
      console.log("ToolTerrain.pickTile: @tilemap does not exist");
      return;
    }
    return this.currentTileId = 0;
  };

  ToolTerrain.prototype.paintTile = function(x, y) {
    if (this.tilemap == null) {
      console.log("ToolTerrain.paintTile: @tilemap does not exist");
    }
  };

  ToolTerrain.prototype.coordsScreenToTilemap = function(x, y) {};

  ToolTerrain.prototype.update = function() {
    var markerX, markerY;
    this.gun.x = this.player.x;
    this.gun.y = this.player.y;
    this.selection.x = Math.floor(this.game.input.activePointer.worldX / 32) * 32 + 16;
    this.selection.y = Math.floor(this.game.input.activePointer.worldY / 32) * 32 + 16;
    markerX = this.currentLayer.getTileX(game.input.activePointer.worldX) * 32;
    markerY = this.currentLayer.getTileY(game.input.activePointer.worldY) * 32;
    if (this.game.input.mousePointer.isDown) {
      this.player.animations.play('cast');
      if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
        this.currentTile = this.map.getTile(this.currentLayer.getTileX(markerX), this.currentLayer.getTileY(markerY)).index;
      } else {
        if (this.map.getTile(this.currentLayer.getTileX(markerX), this.currentLayer.getTileY(markerY)).index !== this.currentTile) {
          this.map.putTile(this.currentTile, this.currentLayer.getTileX(markerX), this.currentLayer.getTileY(markerY));
          this.game.juice.plop(game.input.activePointer.worldX, game.input.activePointer.worldY);
        }
      }
    } else {
      this.player.animations.play('idle');
    }
    if (this.game.input.keyboard.downDuration(Phaser.Keyboard.Q, 10)) {
      this.currentTile = Phaser.Math.clamp(this.currentTile - 1, 0, 7);
    }
    if (this.game.input.keyboard.downDuration(Phaser.Keyboard.E, 10)) {
      return this.currentTile = Phaser.Math.clamp(this.currentTile + 1, 0, 7);
    }
  };

  ToolTerrain.prototype.getStatusText = function() {
    var status;
    status = '';
    status += 'tileID: ' + this.currentTile + '\n';
    return status;
  };

  ToolTerrain.prototype.select = function() {
    return this.selection.revive();
  };

  ToolTerrain.prototype.unselect = function() {
    return this.selection.kill();
  };

  return ToolTerrain;

})();



},{}]},{},[7])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2p3aWRlbWFuL2Rldi9nYW1lcy93aXphcmQvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvandpZGVtYW4vZGV2L2dhbWVzL3dpemFyZC9zcmMvc2NyaXB0cy9CdWlsZGluZy5jb2ZmZWUiLCIvaG9tZS9qd2lkZW1hbi9kZXYvZ2FtZXMvd2l6YXJkL3NyYy9zY3JpcHRzL0J1aWxkaW5nQ29udHJvbGxlci5jb2ZmZWUiLCIvaG9tZS9qd2lkZW1hbi9kZXYvZ2FtZXMvd2l6YXJkL3NyYy9zY3JpcHRzL0J1aWxkaW5nVGVzdC5jb2ZmZWUiLCIvaG9tZS9qd2lkZW1hbi9kZXYvZ2FtZXMvd2l6YXJkL3NyYy9zY3JpcHRzL0VuZW15LmNvZmZlZSIsIi9ob21lL2p3aWRlbWFuL2Rldi9nYW1lcy93aXphcmQvc3JjL3NjcmlwdHMvRnhGbG9hdGluZ1NwYXJrbGVzLmNvZmZlZSIsIi9ob21lL2p3aWRlbWFuL2Rldi9nYW1lcy93aXphcmQvc3JjL3NjcmlwdHMvSnVpY2UuY29mZmVlIiwiL2hvbWUvandpZGVtYW4vZGV2L2dhbWVzL3dpemFyZC9zcmMvc2NyaXB0cy9NYWluLmNvZmZlZSIsIi9ob21lL2p3aWRlbWFuL2Rldi9nYW1lcy93aXphcmQvc3JjL3NjcmlwdHMvUGxheWVyLmNvZmZlZSIsIi9ob21lL2p3aWRlbWFuL2Rldi9nYW1lcy93aXphcmQvc3JjL3NjcmlwdHMvUGxheWVyQ29udHJvbGxlci5jb2ZmZWUiLCIvaG9tZS9qd2lkZW1hbi9kZXYvZ2FtZXMvd2l6YXJkL3NyYy9zY3JpcHRzL1Rvb2xCdWlsZC5jb2ZmZWUiLCIvaG9tZS9qd2lkZW1hbi9kZXYvZ2FtZXMvd2l6YXJkL3NyYy9zY3JpcHRzL1Rvb2xNaXNzaWxlLmNvZmZlZSIsIi9ob21lL2p3aWRlbWFuL2Rldi9nYW1lcy93aXphcmQvc3JjL3NjcmlwdHMvVG9vbFRlbGVwb3J0LmNvZmZlZSIsIi9ob21lL2p3aWRlbWFuL2Rldi9nYW1lcy93aXphcmQvc3JjL3NjcmlwdHMvVG9vbFRlcnJhaW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSxrQkFBQTtFQUFBOztpU0FBQTs7QUFBQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsc0JBQVIsQ0FBK0IsQ0FBQyxrQkFBckQsQ0FBQTs7QUFBQSxPQUVhLENBQUM7QUFFViw2QkFBQSxDQUFBOztBQUFhLEVBQUEsa0JBQUUsSUFBRixHQUFBO0FBR1QsUUFBQSxJQUFBO0FBQUEsSUFIVSxJQUFDLENBQUEsT0FBQSxJQUdYLENBQUE7QUFBQSwyQ0FBQSxDQUFBO0FBQUEsSUFBQSxDQUFBLEdBQUksSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBaEIsQ0FBQTtBQUFBLElBQ0EsQ0FBQSxHQUFJLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BRGhCLENBQUE7QUFBQSxJQUlBLDBDQUFNLElBQUMsQ0FBQSxJQUFQLEVBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQixRQUFuQixDQUpBLENBQUE7QUFBQSxJQU9BLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixDQUFjLEdBQWQsRUFBbUIsR0FBbkIsQ0FQQSxDQUFBO0FBQUEsSUFhQSxJQUFDLENBQUEsVUFBRCxHQUFrQixJQUFBLGtCQUFBLENBQW1CLElBQUMsQ0FBQSxJQUFwQixFQUEwQixJQUExQixDQWJsQixDQUFBO0FBZUEsV0FBTyxJQUFQLENBbEJTO0VBQUEsQ0FBYjs7QUFBQSxxQkFxQkEsTUFBQSxHQUFRLFNBQUEsR0FBQTtXQUdKLElBQUMsQ0FBQSxVQUFVLENBQUMsTUFBWixDQUFBLEVBSEk7RUFBQSxDQXJCUixDQUFBOztrQkFBQTs7R0FGMkIsTUFBTSxDQUFDLE9BRnRDLENBQUE7Ozs7O0FDQUEsT0FBYSxDQUFDO0FBRUcsRUFBQSw0QkFBRSxJQUFGLEVBQVMsUUFBVCxHQUFBO0FBRVQsSUFGVSxJQUFD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QUFVLFVBQUEsR0FBYSxJQUFDLENBQUEsV0FBZCxHQUE0QixJQUR0QyxDQUFBO0FBRUEsV0FBTyxNQUFQLENBSFc7RUFBQSxDQXRHZixDQUFBOztBQUFBLHdCQTJHQSxNQUFBLEdBQVEsU0FBQSxHQUFBO1dBQ0osSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLENBQUEsRUFESTtFQUFBLENBM0dSLENBQUE7O0FBQUEsd0JBOEdBLFFBQUEsR0FBVSxTQUFBLEdBQUE7V0FDTixJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBQSxFQURNO0VBQUEsQ0E5R1YsQ0FBQTs7cUJBQUE7O0lBSEosQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJCdWlsZGluZ0NvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9CdWlsZGluZ0NvbnRyb2xsZXJcIikuQnVpbGRpbmdDb250cm9sbGVyXG5cbmNsYXNzIGV4cG9ydHMuQnVpbGRpbmcgZXh0ZW5kcyBQaGFzZXIuU3ByaXRlXG5cbiAgICBjb25zdHJ1Y3RvcjogKEBnYW1lKS0+XG5cbiAgICAgICAgIyBTZXQgb3VyIHBvc2l0aW9uIHRvIHRoZSB3b3JsZCBjZW50ZXJcbiAgICAgICAgeCA9IEBnYW1lLndvcmxkLmNlbnRlclhcbiAgICAgICAgeSA9IEBnYW1lLndvcmxkLmNlbnRlcllcblxuICAgICAgICAjIENhbGwgdGhlIHNwcml0ZSBjb25zdHJ1Y3RvclxuICAgICAgICBzdXBlciBAZ2FtZSwgeCwgeSwgJ3BsYXllcidcblxuICAgICAgICAjIFNldCB0aGUgYW5jaG9yIHRvIHRoZSBjZW50ZXIgb2YgdGhlIHNwcml0ZVxuICAgICAgICBAYW5jaG9yLnNldFRvIDAuNSwgMC41XG5cbiAgICAgICAgIyAjIEVuYWJsZSBwaHlzaWNzXG4gICAgICAgICMgQGdhbWUucGh5c2ljcy5lbmFibGUgQCwgUGhhc2VyLlBoeXNpY3MuQVJDQURFXG5cbiAgICAgICAgIyBBdHRhY2ggYSBjb250cm9sbGVyXG4gICAgICAgIEBjb250cm9sbGVyID0gbmV3IEJ1aWxkaW5nQ29udHJvbGxlciBAZ2FtZSwgQFxuXG4gICAgICAgIHJldHVybiB0aGlzXG5cblxuICAgIHVwZGF0ZTogKCk9PlxuXG4gICAgICAgICMgVXBkYXRlIHRoZSBwbGF5ZXIgY29udHJvbGxlclxuICAgICAgICBAY29udHJvbGxlci51cGRhdGUoKVxuIiwiY2xhc3MgZXhwb3J0cy5CdWlsZGluZ0NvbnRyb2xsZXJcblxuICAgIGNvbnN0cnVjdG9yOiAoQGdhbWUsIEBidWlsZGluZyktPlxuXG4gICAgICAgIEBidWlsZGluZy5pbnB1dEVuYWJsZWQgPSB0cnVlXG4gICAgICAgIEBidWlsZGluZy5pbnB1dC5lbmFibGVEcmFnKClcbiAgICAgICAgQGJ1aWxkaW5nLmlucHV0LmVuYWJsZVNuYXAgMzIsIDMyLCB0cnVlLCB0cnVlXG4gICAgICAgICMgQGJ1aWxkaW5nLmlucHV0LnN0YXJ0RHJhZyhAZ2FtZS5pbnB1dC5tb3VzZVBvaW50ZXIpXG5cbiAgICB1cGRhdGU6ICgpLT5cblxuICAgICMgICAgICMgTW92ZSB0aGUgYnVpbGRpbmcgdG8gdGhlIG1vdXNlIHBvaW50ZXJcbiAgICAjICAgICBAYnVpbGRpbmcueCA9IEBnYW1lLmlucHV0Lm1vdXNlLlxuIiwiY2xhc3MgZXhwb3J0cy5CdWlsZGluZ1Rlc3QgZXh0ZW5kcyBQaGFzZXIuU3ByaXRlXG5cbiAgICBuYW1lOiAnVGVzdCBCdWlsZGluZydcblxuICAgIGlzQ29uc3RydWN0ZWQ6IGZhbHNlXG5cbiAgICBjb25zdHJ1Y3RvcjogKEBnYW1lLCB4ID0gMCwgeSA9IDApLT5cblxuICAgICAgICAjIENhbGwgdGhlIHNwcml0ZSBjb25zdHJ1Y3RvclxuICAgICAgICBzdXBlciBAZ2FtZSwgeCwgeSwgJ2J1aWxkaW5nVGVzdCdcblxuICAgICAgICAjIFNldCB0aGUgYW5jaG9yIHRvIHRoZSBjZW50ZXIgb2YgdGhlIHNwcml0ZVxuICAgICAgICBAYW5jaG9yLnNldFRvIDAuNSwgMC41XG5cbiAgICAgICAgIyBTZXQgZ3JhcGhpYyBlZmZlY3RzIHRvIGluZGljYXRlIGEgJ2dob3N0JyBwbGFubmVkIGJ1aWxkaW5nXG4gICAgICAgIEBhbHBoYSA9IDAuNVxuICAgICAgICBAdGludCA9IDB4ZmZjY2ZmY2NcblxuICAgICAgICAjIGRpc2FibGUgaW5wdXQgZXZlbnRzIGxpa2UgY2xpY2ssIHRvdWNoLCByb2xsb3ZlclxuICAgICAgICBAaW5wdXRFbmFibGVkID0gZmFsc2VcbiAgICAgICAgIyBhZGQgZXZlbnRzIHRvIG1vdXNlb3ZlciBhbmQgbW91c2VvdXRcbiAgICAgICAgQGV2ZW50cy5vbklucHV0T3Zlci5hZGQoQGhvdmVyLCBAKVxuICAgICAgICBAZXZlbnRzLm9uSW5wdXRPdXQuYWRkKEB1bmhvdmVyLCBAKVxuXG4gICAgICAgICMgYWRkIG91cnNlbHZlcyB0byB0aGUgZ2FtZSBzdGF0ZVxuICAgICAgICBnYW1lLmFkZC5leGlzdGluZyB0aGlzXG5cbiAgICAgICAgQG5hbWUgPSAnVGVzdCBCdWlsZGluZydcblxuICAgICAgICBAYWRkTmV4dFR1cm5MaXN0ZW5lcigpXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcblxuICAgIGJ1aWxkOiAoKS0+XG4gICAgICAgICMgUmVtb3ZlIGdyYXBoaWMgZWZmZWN0cyB0byBpbmRpY2F0ZSBhIGZ1bGx5IGNvbnN0cnVjdGVkIGJ1aWxkaW5nXG4gICAgICAgIEBhbHBoYSA9IDFcbiAgICAgICAgQHRpbnQgPSAweGZmZmZmZmZmXG5cbiAgICAgICAgIyBlbmFibGUgaW5wdXQgZXZlbnRzIGxpa2UgY2xpY2ssIHRvdWNoLCByb2xsb3ZlclxuICAgICAgICBAaW5wdXRFbmFibGVkID0gdHJ1ZVxuXG4gICAgICAgICMgc2V0IHRoZSBjb25zdHJ1Y3RlZCBmbGFnXG4gICAgICAgIEBpc0NvbnN0cnVjdGVkID0gdHJ1ZVxuICAgICAgICByZXR1cm5cblxuICAgIGFkZE5leHRUdXJuTGlzdGVuZXI6ICgpLT5cbiAgICAgICAgQGdhbWUub25OZXh0VHVybi5hZGQoQG5leHRUdXJuLCBAKVxuXG4gICAgbmV4dFR1cm46ICgpLT5cbiAgICAgICAgIyBjb25zb2xlLmxvZyAndGFraW5nIHR1cm4gZm9yICdcbiAgICAgICAgIyBjb25zb2xlLmxvZyBAXG4gICAgICAgICMgSWYgd2UgaGF2ZW4ndCBiZWVuIGJ1aWx0IHlldCwgc2tpcCBvdXIgdHVyblxuICAgICAgICBpZiBub3QgQGlzQ29uc3RydWN0ZWRcbiAgICAgICAgICAgICMgY29uc29sZS5sb2cgQG5hbWUgKyAnIG5vdCBjb25zdHJ1Y3RlZCdcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAjIGNvbnNvbGUubG9nIEBuYW1lICsgJyBpcyBjb25zdHJ1Y3RlZCdcblxuICAgICAgICAjIGRvIHdoYXRldmVyIGVmZmVjdHMgdGhpcyBidWlsZGluZyBoYXNcbiAgICAgICAgIyBlZy4gYWRkIHJlc291cmNlc1xuICAgICAgICBAZ2FtZS5yZWcuc3RvY2twaWxlLmVhcm4oIEBnYW1lLnJlZy5zdG9ja3BpbGUuQUVSLCAxKVxuICAgICAgICBAZ2FtZS5qdWljZS5wb3BUZXh0KEB4LCBAeSwgQGdhbWUucmVnLnN0b2NrcGlsZS5BRVIgKyAnICsxJylcblxuICAgIGhvdmVyOiAoKS0+XG4gICAgICAgIGlmIG5vdCBAaXNDb25zdHJ1Y3RlZFxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgQGdhbWUudWkudG9vbHRpcC50YXJnZXQgPSBAXG4gICAgICAgIEBnYW1lLnVpLnRvb2x0aXAudmlzaWJsZSA9IHRydWVcbiAgICAgICAgQGdhbWUudWkudG9vbHRpcC50ZXh0ID0gQG5hbWVcbiAgICAgICAgQGdhbWUudWkudG9vbHRpcC54ID0gQHggLSBAZ2FtZS51aS50b29sdGlwLndpZHRoIC8gMlxuICAgICAgICBAZ2FtZS51aS50b29sdGlwLnkgPSBAeSAtIDMyXG5cbiAgICB1bmhvdmVyOiAoKS0+XG4gICAgICAgIGlmIG5vdCBAaXNDb25zdHJ1Y3RlZFxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgaWYgQGdhbWUudWkudG9vbHRpcC50YXJnZXQgPT0gQFxuICAgICAgICAgICAgQGdhbWUudWkudG9vbHRpcC52aXNpYmxlID0gZmFsc2VcbiAgICAgICAgICAgIEBnYW1lLnVpLnRvb2x0aXAudGFyZ2V0ID0gbnVsbFxuIiwiY2xhc3MgZXhwb3J0cy5FbmVteSBleHRlbmRzIFBoYXNlci5TcHJpdGVcbiAgICAjIGhvdyBmYXN0IGNhbiB3ZSBtb3ZlXG4gICAgTUFYX1NQRUVEOiAxMDBcbiAgICBNSU5fRElTVEFOQ0U6IDY0XG5cbiAgICBjb25zdHJ1Y3RvcjogKEBnYW1lLCBAcGxheWVyKS0+XG5cbiAgICAgICAgIyBTZXQgb3VyIHBvc2l0aW9uIHRvIHRoZSB3b3JsZCBjZW50ZXJcbiAgICAgICAgeCA9IEBnYW1lLndvcmxkLmNlbnRlclhcbiAgICAgICAgeSA9IEBnYW1lLndvcmxkLmNlbnRlcllcblxuICAgICAgICAjIENhbGwgdGhlIHNwcml0ZSBjb25zdHJ1Y3RvclxuICAgICAgICBzdXBlciBAZ2FtZSwgeCwgeSwgJ2VuZW15J1xuXG4gICAgICAgICMgU2V0IHRoZSBhbmNob3IgdG8gdGhlIGNlbnRlciBvZiB0aGUgc3ByaXRlXG4gICAgICAgIEBhbmNob3Iuc2V0VG8gMC41LCAwLjVcblxuICAgICAgICAjIEFkZCBzb21lIGFuaW1hdGlvbnNcbiAgICAgICAgQGFuaW1hdGlvbnMuYWRkICd1cCcsIFswLCAxLCAyLCAzXSwgMTAsIHRydWVcbiAgICAgICAgQGFuaW1hdGlvbnMuYWRkICdkb3duJywgWzQsIDUsIDYsIDddLCAxMCwgdHJ1ZVxuICAgICAgICBAYW5pbWF0aW9ucy5hZGQgJ2xlZnQnLCBbOCwgOSwgMTAsIDExXSwgMTAsIHRydWVcbiAgICAgICAgQGFuaW1hdGlvbnMuYWRkICdyaWdodCcsIFsxMiwgMTMsIDE0LCAxNV0sIDEwLCB0cnVlXG5cbiAgICAgICAgIyBFbmFibGUgcGh5c2ljc1xuICAgICAgICBAZ2FtZS5waHlzaWNzLmVuYWJsZSBALCBQaGFzZXIuUGh5c2ljcy5BUkNBREVcblxuICAgICAgICAjIGFkZCBvdXJzZWx2ZXMgdG8gdGhlIGdhbWUgc3RhdGVcbiAgICAgICAgZ2FtZS5hZGQuZXhpc3RpbmcgdGhpc1xuXG4gICAgICAgIEBhbmltYXRpb25zLnBsYXkoJ2Rvd24nKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG5cblxuICAgIHVwZGF0ZTogKCk9PlxuICAgICAgICBAZm9sbG93KEBwbGF5ZXIpXG4gICAgICAgIEB1cGRhdGVGYWNpbmcoKVxuXG4gICAgdXBkYXRlRmFjaW5nOiAoKS0+XG4gICAgICAgIGggPSBpZiBAYm9keS52ZWxvY2l0eS54IDwgMCB0aGVuICdsZWZ0JyBlbHNlICdyaWdodCdcbiAgICAgICAgdiA9IGlmIEBib2R5LnZlbG9jaXR5LnkgPCAwIHRoZW4gJ3VwJyBlbHNlICdkb3duJ1xuICAgICAgICBkaXIgPSBpZiBNYXRoLmFicyhAYm9keS52ZWxvY2l0eS54KSA+IE1hdGguYWJzKEBib2R5LnZlbG9jaXR5LnkpIHRoZW4gaCBlbHNlIHZcbiAgICAgICAgQGFuaW1hdGlvbnMucGxheShkaXIpXG5cbiAgICBuZXdEaXJlY3Rpb246ICgpLT5cbiAgICAgICAgZGlyZWN0aW9uID0gQGdhbWUucmFuZC5waWNrIFsndXAnLCAnZG93bicsICdsZWZ0JywgJ3JpZ2h0J11cbiAgICAgICAgY29uc29sZS5sb2cgZGlyZWN0aW9uXG4gICAgICAgIHJldHVybiBkaXJlY3Rpb25cblxuICAgIGZvbGxvdzogKHRhcmdldCktPlxuICAgICAgICAjIENhbGN1bGF0ZSBkaXN0YW5jZSB0byB0YXJnZXRcbiAgICAgICAgZGlzdGFuY2UgPSBAZ2FtZS5tYXRoLmRpc3RhbmNlKEB4LCBAeSwgdGFyZ2V0LngsIHRhcmdldC55KVxuXG4gICAgICAgICMgSWYgdGhlIGRpc3RhbmNlID4gTUlOX0RJU1RBTkNFIHRoZW4gbW92ZVxuICAgICAgICBpZiAoZGlzdGFuY2UgPiBATUlOX0RJU1RBTkNFKVxuICAgICAgICAgICAgIyBDYWxjdWxhdGUgdGhlIGFuZ2xlIHRvIHRoZSB0YXJnZXRcbiAgICAgICAgICAgIGFuZ2xlVG9UYXJnZXQgPSBAZ2FtZS5tYXRoLmFuZ2xlQmV0d2VlbihAeCwgQHksIHRhcmdldC54LCB0YXJnZXQueSlcblxuICAgICAgICAgICAgIyBDYWxjdWxhdGUgdmVsb2NpdHkgdmVjdG9yIGJhc2VkIG9uIGFuZ2xlVG9UYXJnZXQgYW5kIEBNQVhfU1BFRURcbiAgICAgICAgICAgIEBib2R5LnZlbG9jaXR5LnggPSBNYXRoLmNvcyhhbmdsZVRvVGFyZ2V0KSAqIEBNQVhfU1BFRURcbiAgICAgICAgICAgIEBib2R5LnZlbG9jaXR5LnkgPSBNYXRoLnNpbihhbmdsZVRvVGFyZ2V0KSAqIEBNQVhfU1BFRURcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGJvZHkudmVsb2NpdHkuc2V0VG8oMCwgMClcbiIsImNsYXNzIGV4cG9ydHMuRnhGbG9hdGluZ1NwYXJrbGVzIGV4dGVuZHMgUGhhc2VyLkdyb3VwXG5cbiAgICBNQVhfQVNURVJPSURTOiAxMDBcbiAgICBzcGF3blRpbWVyOiAwXG5cbiAgICBjb25zdHJ1Y3RvcjogKEBnYW1lKS0+XG5cbiAgICAgICAgIyBDYWxsIHRoZSBncm91cCBjb25zdHJ1Y3RvclxuICAgICAgICBzdXBlciBAZ2FtZVxuXG4gICAgICAgICMgQ3JlYXRlIGEgcG9vbCBvZiBhc3Rlcm9pZHNcbiAgICAgICAgIyBAYXN0ZXJvaWRHcm91cCA9IEBnYW1lLmFkZC5ncm91cCgpXG4gICAgICAgIEBlbmFibGVCb2R5ID0gdHJ1ZVxuICAgICAgICBAcGh5c2ljc0JvZHlUeXBlID0gUGhhc2VyLlBoeXNpY3MuQVJDQURFXG4gICAgICAgIEBjcmVhdGVNdWx0aXBsZShATUFYX0FTVEVST0lEUywgJ3BhcnRpY2xlJywgMClcblxuICAgICAgICAjIENyZWF0ZSBhIHRpbWVyIGZvciBzcGF3bmluZyBhIG5ldyBhc3Rlcm9pZFxuICAgICAgICBAc3Bhd25UaW1lciA9IDBcblxuICAgICAgICAjIGFkZCBvdXJzZWx2ZXMgdG8gdGhlIGdhbWUgc3RhdGVcbiAgICAgICAgIyBnYW1lLmFkZC5leGlzdGluZyB0aGlzXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcblxuXG4gICAgdXBkYXRlOiAoKS0+XG4gICAgICAgICMgU3Bhd24gYSBuZXcgYXN0ZXJvaWRcbiAgICAgICAgQHNwYXduVGltZXIgLT0gQGdhbWUudGltZS5lbGFwc2VkXG4gICAgICAgIGlmIChAc3Bhd25UaW1lciA8PSAwKVxuICAgICAgICAgICAgQHNwYXduVGltZXIgPSBAZ2FtZS5ybmQuaW50ZWdlckluUmFuZ2UoNSwgNTApXG4gICAgICAgICAgICBAY3JlYXRlTmV3QXN0ZXJvaWQoKVxuXG5cbiAgICBjcmVhdGVOZXdBc3Rlcm9pZDogKCkgLT5cbiAgICAgICAgYXN0ZXJvaWQgPSBAZ2V0Rmlyc3REZWFkKCkgIyBSZWN5Y2xlIGEgZGVhZCBhc3Rlcm9pZFxuXG4gICAgICAgIGlmIChhc3Rlcm9pZClcbiAgICAgICAgICAgIGR4ID0gMFxuICAgICAgICAgICAgZHkgPSAwXG4gICAgICAgICAgICBzbG93ID0gMTBcbiAgICAgICAgICAgIGZhc3QgPSA1MFxuICAgICAgICAgICAgd2hpbGUgKGR4IDwgc2xvdyAmJiBkeCA+IC1zbG93ICYmIGR5IDwgc2xvdyAmJiBkeSA+IC1zbG93KVxuICAgICAgICAgICAgICAgIGR4ID0gQGdhbWUucm5kLmJldHdlZW4oLWZhc3QsIGZhc3QpXG4gICAgICAgICAgICAgICAgZHkgPSBAZ2FtZS5ybmQuYmV0d2VlbigtZmFzdCwgZmFzdClcblxuICAgICAgICAgICAgc3ggPSBpZiBkeCA+IDAgdGhlbiAwIGVsc2UgQGdhbWUud29ybGQud2lkdGhcbiAgICAgICAgICAgIHN5ID0gaWYgZHkgPiAwIHRoZW4gMCBlbHNlIEBnYW1lLndvcmxkLmhlaWdodFxuXG4gICAgICAgICAgICBkaXJlY3Rpb24gPSBAZ2FtZS5ybmQucGljayhbJ2gnLCAndiddKVxuICAgICAgICAgICAgc3ggPSBpZiBkaXJlY3Rpb24gPT0gJ2gnIHRoZW4gQGdhbWUucm5kLmJldHdlZW4oMCwgQGdhbWUud29ybGQud2lkdGgpIGVsc2Ugc3hcbiAgICAgICAgICAgIHN5ID0gaWYgZGlyZWN0aW9uID09ICd2JyB0aGVuIEBnYW1lLnJuZC5iZXR3ZWVuKDAsIEBnYW1lLndvcmxkLmhlaWdodCkgZWxzZSBzeVxuXG4gICAgICAgICAgICAjIGFzdGVyb2lkLnJlc2V0KEBnYW1lLndvcmxkLndpZHRoICsgMTAwLCBAZ2FtZS53b3JsZC5oZWlnaHQgLSA0OCkgIyBQb3NpdGlvbiBvbiBncm91bmRcbiAgICAgICAgICAgIGFzdGVyb2lkLnJlc2V0KHN4LCBzeSkgIyBQb3NpdGlvbiBvbiBncm91bmRcbiAgICAgICAgICAgIGFzdGVyb2lkLnJldml2ZSgpICMgU2V0IFwiYWxpdmVcIlxuXG4gICAgICAgICAgICAjIHNldCBhIHJhbmRvbSBzY2FsZSBhbmQgYWxwaGFcbiAgICAgICAgICAgIGRlcHRoID0gQGdhbWUucm5kLnJlYWxJblJhbmdlKDAuMSwgMC44KVxuICAgICAgICAgICAgIyBhc3Rlcm9pZC5zY2FsZSA9IGRlcHRoXG4gICAgICAgICAgICBhc3Rlcm9pZC5hbHBoYSA9IGRlcHRoXG5cbiAgICAgICAgICAgIGFzdGVyb2lkLmJvZHkudmVsb2NpdHkuc2V0VG8oMCwgMCkgIyBTdG9wIG1vdmluZ1xuICAgICAgICAgICAgYXN0ZXJvaWQuYm9keS5hY2NlbGVyYXRpb24uc2V0VG8oMCwgMCkgIyBTdG9wIGFjY2VsZXJhdGluZ1xuXG4gICAgICAgICAgICAjIFNldCBpbml0aWFsIG1vdmVtZW50XG4gICAgICAgICAgICBhc3Rlcm9pZC5ib2R5LnZlbG9jaXR5LnggPSBkeFxuICAgICAgICAgICAgYXN0ZXJvaWQuYm9keS52ZWxvY2l0eS55ID0gZHlcblxuICAgICAgICAgICAgIyBTZXQgcmFuZG9tIHJvdGF0aW9uXG4gICAgICAgICAgICBhc3Rlcm9pZC5yb3RhdGlvbiA9IFBoYXNlci5NYXRoLmRlZ1RvUmFkKEBnYW1lLnJuZC5hbmdsZSgpKSAjIFJlc2V0IHJvdGF0aW9uXG5cbiAgICAgICAgICAgICMgU2V0IGFuaW1hdGlvbiBmcmFtZSB0byAwXG4gICAgICAgICAgICBhc3Rlcm9pZC5mcmFtZSA9IDBcblxuICAgICAgICAgICAgIyBDZW50ZXIgc3ByaXRlXG4gICAgICAgICAgICBhc3Rlcm9pZC5hbmNob3Iuc2V0VG8oMC41LCAwLjUpXG5cbiAgICAgICAgICAgICMgQXN0ZXJvaWRzIHNob3VsZCBraWxsIHRoZW1zZWx2ZXMgd2hlbiB0aGV5IGxlYXZlIHRoZSB3b3JsZC5cbiAgICAgICAgICAgICMgUGhhc2VyIHRha2VzIGNhcmUgb2YgdGhpcyBmb3IgbWUgYnkgc2V0dGluZyB0aGlzIGZsYWdcbiAgICAgICAgICAgICMgYnV0IHlvdSBjYW4gZG8gaXQgeW91cnNlbGYgYnkga2lsbGluZyB0aGUgYXN0ZXJvaWQgaWZcbiAgICAgICAgICAgICMgaXRzIHgseSBjb29yZGluYXRlcyBhcmUgb3V0c2lkZSBvZiB0aGUgd29ybGQuXG4gICAgICAgICAgICBhc3Rlcm9pZC5jaGVja1dvcmxkQm91bmRzID0gdHJ1ZVxuICAgICAgICAgICAgYXN0ZXJvaWQub3V0T2ZCb3VuZHNLaWxsID0gdHJ1ZVxuIiwiY2xhc3MgZXhwb3J0cy5KdWljZVxuXG4gICAgY29uc3RydWN0b3I6IChAZ2FtZSktPlxuXG4gICAgICAgIEBkZWZhdWx0U291bmRWb2x1bWUgPSAxXG5cbiAgICAgICAgIyBBZGQgc291bmRzXG4gICAgICAgIEBzbmRUaWxlID0gZ2FtZS5hZGQuc291bmQoJ3NuZFRpbGUnLCBAZGVmYXVsdFNvdW5kVm9sdW1lKVxuICAgICAgICBAc25kVGlsZS5hbGxvd011bHRpcGxlID0gdHJ1ZVxuXG4gICAgICAgIEBzbmRNaXNzaWxlID0gZ2FtZS5hZGQuc291bmQoJ3NuZE1pc3NpbGUnLCBAZGVmYXVsdFNvdW5kVm9sdW1lKVxuICAgICAgICBAc25kTWlzc2lsZS5hbGxvd011bHRpcGxlID0gdHJ1ZVxuXG4gICAgICAgIEBzbmRUZWxlcG9ydCA9IGdhbWUuYWRkLnNvdW5kKCdzbmRUZWxlcG9ydCcsIEBkZWZhdWx0U291bmRWb2x1bWUpXG4gICAgICAgIEBzbmRUZWxlcG9ydC5hbGxvd011bHRpcGxlID0gdHJ1ZVxuXG5cbiAgICAgICAgIyBwYXJ0aWNsZXNcbiAgICAgICAgQGVtaXR0ZXIgPSBnYW1lLmFkZC5lbWl0dGVyKDAsIDAsIDEwMDApXG5cbiAgICAgICAgQGVtaXR0ZXIubWFrZVBhcnRpY2xlcygncGFydGljbGUnKVxuICAgICAgICBAZW1pdHRlci5ncmF2aXR5ID0gMzAwXG5cblxuICAgICAgICByZXR1cm4gdGhpc1xuXG5cbiAgICBzaGFrZTogKCktPlxuICAgICAgICBAZ2FtZS5hZGQudHdlZW4oQGdhbWUuY2FtZXJhKVxuICAgICAgICAgICAgLmZyb20oeyB5OiBAZ2FtZS5jYW1lcmEueSAtIDUgfSwgNTAsIFBoYXNlci5FYXNpbmcuU2ludXNvaWRhbC5Jbk91dCwgZmFsc2UsIDAsIDQsIHRydWUpXG4gICAgICAgICAgICAuc3RhcnQoKVxuICAgICAgICAjIGNvbnNvbGUubG9nICdzaGFrZSBzaGFrZSEnXG5cbiAgICBzcGxvZGU6ICh4LCB5KS0+XG4gICAgICAgICMgIFBvc2l0aW9uIHRoZSBlbWl0dGVyIHdoZXJlIHRoZSBtb3VzZS90b3VjaCBldmVudCB3YXNcbiAgICAgICAgQGVtaXR0ZXIueCA9IHhcbiAgICAgICAgQGVtaXR0ZXIueSA9IHlcblxuICAgICAgICAjICBUaGUgZmlyc3QgcGFyYW1ldGVyIHNldHMgdGhlIGVmZmVjdCB0byBcImV4cGxvZGVcIiB3aGljaCBtZWFucyBhbGwgcGFydGljbGVzIGFyZSBlbWl0dGVkIGF0IG9uY2VcbiAgICAgICAgIyAgVGhlIHNlY29uZCBnaXZlcyBlYWNoIHBhcnRpY2xlIGEgMjAwMG1zIGxpZmVzcGFuXG4gICAgICAgICMgIFRoZSB0aGlyZCBpcyBpZ25vcmVkIHdoZW4gdXNpbmcgYnVyc3QvZXhwbG9kZSBtb2RlXG4gICAgICAgICMgIFRoZSBmaW5hbCBwYXJhbWV0ZXIgKDEwKSBpcyBob3cgbWFueSBwYXJ0aWNsZXMgd2lsbCBiZSBlbWl0dGVkIGluIHRoaXMgc2luZ2xlIGJ1cnN0XG4gICAgICAgIEBlbWl0dGVyLnN0YXJ0KHRydWUsIDI1MCwgbnVsbCwgNSlcblxuICAgIHBldzogKCkgLT5cbiAgICAgICAgQHNuZE1pc3NpbGUucGxheSgpXG5cbiAgICBmb29zaDogKHgxLCB5MSwgeDIsIHkyKS0+XG4gICAgICAgIEBzbmRUZWxlcG9ydC5wbGF5KClcbiAgICAgICAgQHNwbG9kZSB4MSwgeTFcbiAgICAgICAgQHNwbG9kZSB4MiwgeTJcblxuICAgIHBsb3A6ICh4LCB5KS0+XG4gICAgICAgICMgcGxheSBhIG5ldyBwbG9wIHNvdW5kXG4gICAgICAgICMgc25kVGlsZSA9IGdhbWUuYWRkLnNvdW5kKCdzbmRUaWxlJywgQGRlZmF1bHRTb3VuZFZvbHVtZSlcbiAgICAgICAgQHNuZFRpbGUucGxheSgpXG5cbiAgICAgICAgQHNwbG9kZSB4LCB5XG5cbiAgICBwb3BUZXh0OiAoeCwgeSwgbXNnKS0+XG4gICAgICAgIHRleHQgPSBAZ2FtZS5hZGQudGV4dCB4LCB5LCBtc2csIHtmaWxsOiAnd2hpdGUnLCBmb250OiAnQm9sZCAxMXB0IEFyaWFsJ31cbiAgICAgICAgQGdhbWUuYWRkLnR3ZWVuIHRleHRcbiAgICAgICAgICAgIC50byh7IHk6IHRleHQueSAtIDMyIH0sIDUwMCwgIFBoYXNlci5FYXNpbmcuUXVhZHJhdGljLk91dCwgdHJ1ZSlcbiAgICAgICAgICAgIC5vbkNvbXBsZXRlLmFkZChcbiAgICAgICAgICAgICAgICAoKS0+XG4gICAgICAgICAgICAgICAgICAgIEBkZXN0cm95KClcbiAgICAgICAgICAgICAgICAsIHRleHQpXG5cbiIsIkp1aWNlID0gcmVxdWlyZShcIi4vSnVpY2VcIikuSnVpY2VcbkZ4RmxvYXRpbmdTcGFya2xlcyA9IHJlcXVpcmUoXCIuL0Z4RmxvYXRpbmdTcGFya2xlc1wiKS5GeEZsb2F0aW5nU3BhcmtsZXNcblxuUGxheWVyID0gcmVxdWlyZShcIi4vUGxheWVyXCIpLlBsYXllclxuQnVpbGRpbmcgPSByZXF1aXJlKFwiLi9CdWlsZGluZ1wiKS5CdWlsZGluZ1xuXG5FbmVteSA9IHJlcXVpcmUoXCIuL0VuZW15XCIpLkVuZW15XG5cbndpbmRvdy5vbmxvYWQgPSAoKS0+XG5cbiAgICAjIE9uIHdpbmRvdyBsb2FkLCBjcmVhdGUgdGhlIFBoYXNlciBnYW1lIG9iamVjdCxcbiAgICAjICBhbmQgbG9hZCBnYW1lc3RhdGUgYXMgdGhlIGluaXRpYWwgc3RhdGVcbiAgICB3aW5kb3cuZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZSg2NDAsIDY0MCwgUGhhc2VyLkNBTlZBUywgJ2dhbWUtY29udGFpbmVyJywgZ2FtZXN0YXRlKVxuXG5nYW1lc3RhdGUgPVxuICAgIHByZWxvYWQ6ICgpLT5cbiAgICAgICAgIyBMb2FkIHVzIHNvbWUgYXNzZXRzXG4gICAgICAgICMgZ2FtZS5sb2FkLmltYWdlICdwbGF5ZXInLCAnYXNzZXRzL2ltZy9wbGF5ZXIucG5nJ1xuICAgICAgICBnYW1lLmxvYWQuaW1hZ2UgJ3RpbGVTZWxlY3QnLCAnYXNzZXRzL2ltZy9zdGFyMS5wbmcnXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZSAnc3RhcjInLCAnYXNzZXRzL2ltZy9zdGFyMi5wbmcnXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZSAnbWlzc2lsZScsICdhc3NldHMvaW1nL3N0YXIzLnBuZydcbiAgICAgICAgZ2FtZS5sb2FkLmltYWdlICdwYXJ0aWNsZScsICdhc3NldHMvaW1nL2ZsYXNoLnBuZydcblxuICAgICAgICAjIGxvYWQgc29tZSBidWlsZGluZyBzcHJpdGVzXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZSAnYnVpbGRpbmdUZXN0JywgJ2Fzc2V0cy9pbWcvYnVpbGRpbmdUZXN0LnBuZydcblxuICAgICAgICAjIGxvYWQgdGhlIHBsYXllciBzcHJpdGVzaGVldFxuICAgICAgICBnYW1lLmxvYWQuc3ByaXRlc2hlZXQgJ3BsYXllcicsICdhc3NldHMvaW1nL3BsYXllci5wbmcnLCAzMiwgMzJcblxuICAgICAgICAjIGxvYWQgYW4gZW5lbXkgc3ByaXRlc2hlZXRcbiAgICAgICAgZ2FtZS5sb2FkLnNwcml0ZXNoZWV0ICdlbmVteScsICdhc3NldHMvaW1nL2VuZW15LnBuZycsIDY0LCA2NFxuXG4gICAgICAgICMgTG9hZCB0aWxlc1xuICAgICAgICBnYW1lLmxvYWQuaW1hZ2UgJ3RpbGVzJywgJ2Fzc2V0cy9pbWcvdGlsZXMucG5nJ1xuXG4gICAgICAgICMgbG9hZCBzb21lIHNvdW5kc1xuICAgICAgICBnYW1lLmxvYWQuYXVkaW8oJ3NuZE1pc3NpbGUnLCAnYXNzZXRzL3NuZC9zdGVhbS5vZ2cnKVxuICAgICAgICBnYW1lLmxvYWQuYXVkaW8oJ3NuZFRlbGVwb3J0JywgJ2Fzc2V0cy9zbmQvY2xvdGgyLm9nZycpXG4gICAgICAgICMgZ2FtZS5sb2FkLmF1ZGlvKCdzbmRUaWxlJywgJ2Fzc2V0cy9zbmQvcm9sbG92ZXIxLndhdicpXG4gICAgICAgICMgZ2FtZS5sb2FkLmF1ZGlvKCdzbmRUaWxlJywgJ2Fzc2V0cy9zbmQvcm9sbG92ZXIyLndhdicpXG4gICAgICAgICMgZ2FtZS5sb2FkLmF1ZGlvKCdzbmRUaWxlJywgJ2Fzc2V0cy9zbmQvcm9sbG92ZXIzLndhdicpXG4gICAgICAgICMgZ2FtZS5sb2FkLmF1ZGlvKCdzbmRUaWxlJywgJ2Fzc2V0cy9zbmQvcm9sbG92ZXI0LndhdicpXG4gICAgICAgICMgZ2FtZS5sb2FkLmF1ZGlvKCdzbmRUaWxlJywgJ2Fzc2V0cy9zbmQvcm9sbG92ZXI1LndhdicpXG4gICAgICAgIGdhbWUubG9hZC5hdWRpbygnc25kVGlsZScsICdhc3NldHMvc25kL3JvbGxvdmVyNi53YXYnKVxuXG5cbiAgICBjcmVhdGU6ICgpLT5cbiAgICAgICAgIyAjIEFkZCBhIEhlbGxvIFdvcmxkIG1lc3NhZ2VcbiAgICAgICAgIyBmb28gPSBnYW1lLmFkZC50ZXh0IDEwLCAxMCwgXCJIZWxsbyBXb3JsZFwiLCB7ZmlsbDogJ3doaXRlJ31cblxuICAgICAgICAjIEFkZCBhIHJlZ2lzdHJ5IG9iamVjdCB0byB0aGUgZ2FtZSBzY29wZSB0byBrZWVwIHRyYWNrIG9mIHNvbWUgZ2xvYmFsIHJlZmVyZW5jZXNcbiAgICAgICAgQGdhbWUucmVnID0ge31cblxuICAgICAgICAjIEFkZCBhIHNob3J0Y3V0IHRvIHRoZSBnYW1lIHVpIChUT0RPOiBtYWtlIGl0IGEgY2xhc3MgZXh0ZW5kaW5nIGdyb3VwKVxuICAgICAgICBAZ2FtZS51aSA9IHt9XG5cbiAgICAgICAgQGNyZWF0ZVN0b2NrcGlsZSgpXG4gICAgICAgIEBjcmVhdGVOZXh0VHVyblNpZ25hbCgpXG5cbiAgICAgICAgIyBDcmVhdGUgZmxvYXRpbmcgc3BhcmtsZXMgYmFja2dyb3VuZCBlZmZlY3RcbiAgICAgICAgQHNwYXJrbGVzID0gbmV3IEZ4RmxvYXRpbmdTcGFya2xlcyhnYW1lKVxuXG4gICAgICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICAgICAjICBDcmVhdGVzIGEgYmxhbmsgdGlsZW1hcFxuICAgICAgICBAbWFwID0gZ2FtZS5hZGQudGlsZW1hcCgpXG5cbiAgICAgICAgIyAgQWRkIGEgVGlsZXNldCBpbWFnZSB0byB0aGUgbWFwXG4gICAgICAgIEBtYXAuYWRkVGlsZXNldEltYWdlKCd0aWxlcycpXG5cbiAgICAgICAgIyBpbmNyZWFzZSB0aGUgdGlsZW1hcCBiaWFzIGluIHRoZSBwaHlzaWNzIHN5c3RlbSB0byBwcmV2ZW50IGNsaXBwaW5nIGludG8gdGlsZXNcbiAgICAgICAgIyBnYW1lLnBoeXNpY3MuYXJjYWRlLlRJTEVfQklBUyA9IDY0XG5cbiAgICAgICAgTUFQX1dJRFRIID0gNDBcbiAgICAgICAgTUFQX0hFSUdIVCA9IDMwXG5cbiAgICAgICAgIyAgQ3JlYXRlcyBhIG5ldyBibGFuayBsYXllciBhbmQgc2V0cyB0aGUgbWFwIGRpbWVuc2lvbnMuXG4gICAgICAgICMgIEluIHRoaXMgY2FzZSB0aGUgbWFwIGlzIDQweDMwIHRpbGVzIGluIHNpemUgYW5kIHRoZSB0aWxlcyBhcmUgMzJ4MzIgcGl4ZWxzIGluIHNpemUuXG4gICAgICAgIGxheWVyMSA9IEBtYXAuY3JlYXRlKCdsZXZlbDEnLCBNQVBfV0lEVEgsIE1BUF9IRUlHSFQsIDMyLCAzMilcbiAgICAgICAgIyBsYXllcjEuc2Nyb2xsRmFjdG9yWCA9IDAuNVxuICAgICAgICAjIGxheWVyMS5zY3JvbGxGYWN0b3JZID0gMC41XG5cbiAgICAgICAgIyAgUmVzaXplIHRoZSB3b3JsZFxuICAgICAgICBsYXllcjEucmVzaXplV29ybGQoKVxuXG4gICAgICAgICMgbGF5ZXIxLmRlYnVnID0gdHJ1ZVxuXG4gICAgICAgIEBjdXJyZW50TGF5ZXIgPSBsYXllcjFcbiAgICAgICAgQGN1cnJlbnRUaWxlID0gN1xuXG4gICAgICAgICMgQG1hcC5wdXRUaWxlKEBjdXJyZW50VGlsZSwgMCwgMCwgQGN1cnJlbnRMYXllcilcbiAgICAgICAgQG1hcC5maWxsKEBjdXJyZW50VGlsZSwgMCwgMCwgTUFQX1dJRFRILCBNQVBfSEVJR0hULCBAY3VycmVudExheWVyKVxuXG4gICAgICAgICMgbWFrZSBhIGxpdHRsZSBpc2xhbmRcbiAgICAgICAgQGN1cnJlbnRUaWxlID0gMFxuICAgICAgICBAbWFwLmZpbGwoQGN1cnJlbnRUaWxlLCAxMCwgMTAsIDE4LCAxMCwgQGN1cnJlbnRMYXllcilcblxuXG4gICAgICAgIEBnYW1lLmN1cnJlbnRMZXZlbCA9IHtcbiAgICAgICAgICAgIHRpbGVtYXA6IEBtYXAsXG4gICAgICAgICAgICBjdXJyZW50TGF5ZXI6IEBjdXJyZW50TGF5ZXIsXG4gICAgICAgIH1cblxuICAgICAgICAjIHNldCBjb2xsaXNpb24gb24gdGhlIHRpbGVtYXBcbiAgICAgICAgIyB0aGlzIGlzIGRvbmUgYWZ0ZXIgZ2VuZXJhdGluZyB0aGUgbWFwIHNvIHRoYXQgY29sbGlzaW9uIHdpbGwgdXBkYXRlIHByb3Blcmx5XG4gICAgICAgICMgdGhlIGZpbGwgY29tbWFuZCBkb2Vzbid0IHNlZW0gdG8gdXBkYXRlIHRoZSBjb2xsaXNpb24gYm94ZXNcbiAgICAgICAgQG1hcC5zZXRDb2xsaXNpb24oWyA3IF0sIHRydWUsICdsZXZlbDEnKVxuXG4gICAgICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5cbiAgICAgICAgIyBDcmVhdGUgYSBwbGF5ZXIgb2JqZWN0XG4gICAgICAgIEBwbGF5ZXIgPSBuZXcgUGxheWVyKGdhbWUpXG5cbiAgICAgICAgIyBDcmVhdGUgYW4gZW5lbXkgb2JqZWN0XG4gICAgICAgIEBlbmVteSA9IG5ldyBFbmVteShnYW1lLCBAcGxheWVyKVxuXG5cbiAgICAgICAgIyBIYXZlIHRoZSBjYW1lcmEgZm9sbG93IHRoZSBwbGF5ZXJcbiAgICAgICAgQGdhbWUuY2FtZXJhLmZvbGxvdyBAcGxheWVyLCBQaGFzZXIuQ2FtZXJhLkZPTExPV19UT1BET1dOX1RJR0hUXG5cbiAgICAgICAgIyBhZGQgdXMgYSBqdWljZVxuICAgICAgICBAZ2FtZS5qdWljZSA9IG5ldyBKdWljZShAZ2FtZSlcblxuICAgICAgICAjIGFkZCBuZXh0IHR1cm4ga2V5XG4gICAgICAgIEBnYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuRU5URVIpLm9uVXAuYWRkKFxuICAgICAgICAgICAgKCktPlxuICAgICAgICAgICAgICAgICMgY29uc29sZS5sb2cgJ2tleSBjYWxsYmFjayBjb250ZXh0OiAgJ1xuICAgICAgICAgICAgICAgICMgY29uc29sZS5sb2cgQFxuICAgICAgICAgICAgICAgIEBnYW1lLm9uTmV4dFR1cm4uZGlzcGF0Y2goKVxuICAgICAgICApXG5cbiAgICAgICAgIyBhZGQgc29ydCBrZXlcbiAgICAgICAgQGdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5aKS5vblVwLmFkZChcbiAgICAgICAgICAgICgpLT5cbiAgICAgICAgICAgICAgICAjIGNvbnNvbGUubG9nICdrZXkgY2FsbGJhY2sgY29udGV4dDogICdcbiAgICAgICAgICAgICAgICAjIGNvbnNvbGUubG9nIEBcbiAgICAgICAgICAgICAgICBAZ2FtZS53b3JsZC5zb3J0KCd5JylcbiAgICAgICAgKVxuXG4gICAgICAgICMgYWRkIGEgdWkgZ3JvdXAgb24gdG9wIG9mIGV2ZXJ5dGhpbmdcbiAgICAgICAgQGdhbWUudWkuZ3JvdXAgPSBAZ2FtZS5hZGQuZ3JvdXAoKVxuICAgICAgICBAZ2FtZS51aS5ncm91cC5maXhlZFRvQ2FtZXJhID0gdHJ1ZVxuICAgICAgICBAZ2FtZS51aS50b29sdGlwID0gQGdhbWUuYWRkLnRleHQoMCwgMCwgJycsIHtmaWxsOiAnd2hpdGUnLCBmb250OiAnMTFwdCBBcmlhbCd9KVxuICAgICAgICBAZ2FtZS51aS50b29sdGlwLnRhcmdldCA9IG51bGxcblxuICAgICAgICAjIFNob3cgRGVidWcgU3RhdHVzIHRleHRcbiAgICAgICAgQGdhbWUudGltZS5hZHZhbmNlZFRpbWluZyA9IHRydWVcbiAgICAgICAgQHN0YXR1c1RleHQgPSBAZ2FtZS5hZGQudGV4dChcbiAgICAgICAgICAgIDIwLCAyMCwgJycsIHsgZm9udDogJzE2cHggQXJpYWwnLCBmaWxsOiAnI2ZmZmZmZicgfVxuICAgICAgICApXG4gICAgICAgIEBzdGF0dXNUZXh0LmZpeGVkVG9DYW1lcmEgPSB0cnVlXG5cblxuICAgIHVwZGF0ZTogKCktPlxuICAgICAgICBAZ2FtZS5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKEBwbGF5ZXIsIEBjdXJyZW50TGF5ZXIpXG5cbiAgICAgICAgIyB1cGRhdGUgc3RhdHVzIHRleHRcbiAgICAgICAgQHN0YXR1c1RleHQuc2V0VGV4dChAZ2V0U3RhdHVzVGV4dCgpKVxuXG5cbiAgICBnZXRTdGF0dXNUZXh0OiAoKS0+XG4gICAgICAgIHN0YXR1cyA9ICcnXG4gICAgICAgIHN0YXR1cyArPSBAZ2FtZS50aW1lLmZwcyArICcgRlBTJyArICdcXG4nXG4gICAgICAgIHN0YXR1cyArPSAnXFxuJ1xuICAgICAgICBzdGF0dXMgKz0gJ1RPT0w6ICcgKyBAcGxheWVyLnRvb2wubmFtZSArICdcXG4nXG4gICAgICAgIHN0YXR1cyArPSBAcGxheWVyLnRvb2wuZ2V0U3RhdHVzVGV4dCgpICsgJ1xcbidcbiAgICAgICAgc3RhdHVzICs9ICdcXG4nXG4gICAgICAgIHN0YXR1cyArPSAnU1RPQ0tQSUxFOiBcXG4nXG4gICAgICAgIHN0YXR1cyArPSBAZ2FtZS5yZWcuc3RvY2twaWxlLmdldFN0YXR1c1RleHQoKVxuICAgICAgICByZXR1cm4gc3RhdHVzXG5cblxuICAgIGNyZWF0ZU5leHRUdXJuU2lnbmFsOiAoKS0+XG4gICAgICAgIEBnYW1lLm9uTmV4dFR1cm4gPSBuZXcgUGhhc2VyLlNpZ25hbCgpXG5cblxuICAgIGNyZWF0ZVN0b2NrcGlsZTogKCktPlxuICAgICAgICBAZ2FtZS5yZWcuc3RvY2twaWxlID1cblxuICAgICAgICAgICAgIyBSZXNvdXJjZSBuYW1pbmcgY29uc3RhbnRzXG4gICAgICAgICAgICBBRVI6ICdBZXJlZ2l1bSdcbiAgICAgICAgICAgIERZTjogJ0R5bmFtaXMnXG5cbiAgICAgICAgICAgIHJlc291cmNlczogW1xuICAgICAgICAgICAgICAgIHsgbmFtZTogJ0FlcmVnaXVtJywgYW1vdW50OiAwIH1cbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdEeW5hbWlzJywgYW1vdW50OiAwIH1cbiAgICAgICAgICAgIF1cblxuICAgICAgICAgICAgZ2V0U3RhdHVzVGV4dDogKCktPlxuICAgICAgICAgICAgICAgIHN0YXR1cyA9ICcnXG4gICAgICAgICAgICAgICAgc3RhdHVzICs9IHJlc291cmNlLm5hbWUgKyAnOiAnICsgcmVzb3VyY2UuYW1vdW50ICsgJ1xcbicgZm9yIHJlc291cmNlIGluIEByZXNvdXJjZXNcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdHVzXG5cbiAgICAgICAgICAgIGZpbmQ6IChyZXNvdXJjZSktPlxuICAgICAgICAgICAgICAgIHJldHVybiBfLmZpbmQoQHJlc291cmNlcywgeyBuYW1lOiByZXNvdXJjZSB9KVxuXG4gICAgICAgICAgICBlYXJuOiAocmVzb3VyY2UsIGFtb3VudCktPlxuICAgICAgICAgICAgICAgIHN0b2NrID0gQGZpbmQocmVzb3VyY2UpXG4gICAgICAgICAgICAgICAgaWYgbm90IHN0b2NrXG4gICAgICAgICAgICAgICAgICAgICMgd2UgZG9uJ3QgaGF2ZSB0aGlzIHJlc291cmNlLCBhZGQgYW4gZW50cnkgdG8gdGhlIHN0b2NrcGlsZVxuICAgICAgICAgICAgICAgICAgICBzdG9jayA9IHsgbmFtZTogcmVzb3VyY2UsIGFtb3VudDogMCAgfVxuICAgICAgICAgICAgICAgICAgICBAcmVzb3VyY2VzLnB1c2goc3RvY2spXG4gICAgICAgICAgICAgICAgIyBhZGQgc29tZSBvZiB0aGlzIHJlc291cmNlIHRvIG91ciBzdG9ja3NcbiAgICAgICAgICAgICAgICBzdG9jay5hbW91bnQgKz0gYW1vdW50XG5cbiAgICAgICAgICAgIGNhbkFmZm9yZDogKHJlc291cmNlLCBhbW91bnQpLT5cbiAgICAgICAgICAgICAgICBzdG9jayA9IEBmaW5kKHJlc291cmNlKVxuICAgICAgICAgICAgICAgIGlmIG5vdCBzdG9ja1xuICAgICAgICAgICAgICAgICAgICAjIHdlIGRvbid0IGhhdmUgdGhpcyByZXNvdXJjZSBhdCBhbGxcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgICAgIyB3ZSBoYXZlIHRoaXMgcmVzb3VyY2UsIHJldHVybiBpZiB3ZSBoYXZlIGVub3VnaFxuICAgICAgICAgICAgICAgIHJldHVybiBzdG9jay5hbW91bnQgPj0gYW1vdW50XG5cbiAgICAgICAgICAgIHNwZW5kOiAocmVzb3VyY2UsIGFtb3VudCktPlxuICAgICAgICAgICAgICAgIGlmIG5vdCBAY2FuQWZmb3JkKHJlc291cmNlLCBhbW91bnQpXG4gICAgICAgICAgICAgICAgICAgICMgd2UgY2FuJ3QgYWZmb3JkIHRoaXMgLSByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgICAgIyB3ZSBhcmUgYWJsZSB0byBhZmZvcmQgdGhpcyAtIHNwZW5kIGl0XG4gICAgICAgICAgICAgICAgc3RvY2sgPSBAZmluZChyZXNvdXJjZSlcbiAgICAgICAgICAgICAgICBzdG9jay5hbW91bnQgLT0gYW1vdW50XG4gICAgICAgICAgICAgICAgIyB3ZSBzcGVudCB0aGUgcmVzb3VyY2UgLSByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG5cblxuXG4gICAgICAgICMgY29uc29sZS5sb2cgQGdhbWUucmVnLnN0b2NrcGlsZVxuIiwiUGxheWVyQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL1BsYXllckNvbnRyb2xsZXJcIikuUGxheWVyQ29udHJvbGxlclxuXG5Ub29sTWlzc2lsZSA9IHJlcXVpcmUoXCIuL1Rvb2xNaXNzaWxlXCIpLlRvb2xNaXNzaWxlXG5Ub29sVGVycmFpbiA9IHJlcXVpcmUoXCIuL1Rvb2xUZXJyYWluXCIpLlRvb2xUZXJyYWluXG5Ub29sVGVsZXBvcnQgPSByZXF1aXJlKFwiLi9Ub29sVGVsZXBvcnRcIikuVG9vbFRlbGVwb3J0XG5Ub29sQnVpbGQgPSByZXF1aXJlKFwiLi9Ub29sQnVpbGRcIikuVG9vbEJ1aWxkXG5cblxuY2xhc3MgZXhwb3J0cy5QbGF5ZXIgZXh0ZW5kcyBQaGFzZXIuU3ByaXRlXG4gICAgIyBob3cgZmFzdCBjYW4gd2UgbW92ZVxuICAgIHNwZWVkOiAyNTBcblxuICAgIGNvbnN0cnVjdG9yOiAoQGdhbWUpLT5cblxuICAgICAgICAjIFNldCBvdXIgcG9zaXRpb24gdG8gdGhlIHdvcmxkIGNlbnRlclxuICAgICAgICB4ID0gQGdhbWUud29ybGQuY2VudGVyWFxuICAgICAgICB5ID0gQGdhbWUud29ybGQuY2VudGVyWVxuXG4gICAgICAgICMgQ2FsbCB0aGUgc3ByaXRlIGNvbnN0cnVjdG9yXG4gICAgICAgIHN1cGVyIEBnYW1lLCB4LCB5LCAncGxheWVyJ1xuXG4gICAgICAgICMgU2V0IHRoZSBhbmNob3IgdG8gdGhlIGNlbnRlciBvZiB0aGUgc3ByaXRlXG4gICAgICAgIEBhbmNob3Iuc2V0VG8gMC41LCAwLjVcblxuICAgICAgICAjIEFkZCBzb21lIGFuaW1hdGlvbnNcbiAgICAgICAgQGFuaW1hdGlvbnMuYWRkICdpZGxlJywgWzBdXG4gICAgICAgIEBhbmltYXRpb25zLmFkZCAnY2FzdCcsIFsxXVxuXG4gICAgICAgICMgRW5hYmxlIHBoeXNpY3NcbiAgICAgICAgQGdhbWUucGh5c2ljcy5lbmFibGUgQCwgUGhhc2VyLlBoeXNpY3MuQVJDQURFXG5cbiAgICAgICAgIyBBdHRhY2ggYSBjb250cm9sbGVyXG4gICAgICAgIEBjb250cm9sbGVyID0gbmV3IFBsYXllckNvbnRyb2xsZXIgQGdhbWUsIEBcblxuICAgICAgICAjIGFkZCBvdXJzZWx2ZXMgdG8gdGhlIGdhbWUgc3RhdGVcbiAgICAgICAgZ2FtZS5hZGQuZXhpc3RpbmcgdGhpc1xuXG4gICAgICAgICMgIyBjcmVhdGUgdGhlIE1hZ2ljIE1pc3NpbGUgVG9vbFxuICAgICAgICAjIEB0b29sID0gbmV3IFRvb2xNaXNzaWxlIEBnYW1lLCB0aGlzXG5cbiAgICAgICAgIyBjcmVhdGUgdGhlIFRlcnJhaW4gVG9vbFxuICAgICAgICAjIEB0b29sID0gbmV3IFRvb2xUZXJyYWluIEBnYW1lLCB0aGlzXG5cbiAgICAgICAgQHRvb2xzID0gW1xuICAgICAgICAgICAgbmV3IFRvb2xNaXNzaWxlIEBnYW1lLCB0aGlzXG4gICAgICAgICAgICBuZXcgVG9vbFRlbGVwb3J0IEBnYW1lLCB0aGlzXG4gICAgICAgICAgICBuZXcgVG9vbFRlcnJhaW4gQGdhbWUsIHRoaXNcbiAgICAgICAgICAgIG5ldyBUb29sQnVpbGQgQGdhbWUsIHRoaXNcbiAgICAgICAgXVxuICAgICAgICBAbmV4dFRvb2woKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG5cblxuICAgIHVwZGF0ZTogKCk9PlxuXG4gICAgICAgICMgVXBkYXRlIHRoZSBwbGF5ZXIgY29udHJvbGxlclxuICAgICAgICBAY29udHJvbGxlci51cGRhdGUoKVxuXG4gICAgICAgICMgVXBkYXRlIG91ciBUb29sXG4gICAgICAgIGlmIEB0b29sP1xuICAgICAgICAgICAgQHRvb2wudXBkYXRlKClcblxuXG4gICAgbmV4dFRvb2w6ICgpLT5cbiAgICAgICAgIyBjb25zb2xlLmxvZyAnc3dpdGNoaW5nIGZyb20gJyArIGlmIEB0b29sIHRoZW4gQHRvb2wubmFtZSBlbHNlICdub3RoaW5nJ1xuXG4gICAgICAgICMgaGlkZSB0aGUgb2xkIHRvb2xcbiAgICAgICAgaWYgQHRvb2xcbiAgICAgICAgICAgIEB0b29sLnVuc2VsZWN0KClcblxuICAgICAgICAjIGdldCB0aGUgbmV4dCB0b29sIGFuZCByZW1vdmUgaXQgZnJvbSB0aGUgbGlzdFxuICAgICAgICBAdG9vbCA9IEB0b29scy5wb3AoKVxuXG4gICAgICAgICMgc2hvdyB0aGUgbmV3IHRvb2xcbiAgICAgICAgaWYgQHRvb2xcbiAgICAgICAgICAgIEB0b29scy51bnNoaWZ0KEB0b29sKVxuICAgICAgICAgICAgIyByZWFkZCB0aGUgdG9vbCB0byB0aGVmcm9udCBvZiB0aGUgbGlzdFxuICAgICAgICAgICAgQHRvb2wuc2VsZWN0KClcblxuICAgICAgICAjIGNvbnNvbGUubG9nICd0byAnICsgQHRvb2wubmFtZVxuIiwiY2xhc3MgZXhwb3J0cy5QbGF5ZXJDb250cm9sbGVyXG5cbiAgICBrZXlib2FyZF9tb2Rlczoge1xuICAgICAgICBRV0VSVFk6IHtcbiAgICAgICAgICAgIHVwOiBQaGFzZXIuS2V5Ym9hcmQuV1xuICAgICAgICAgICAgZG93bjogUGhhc2VyLktleWJvYXJkLlNcbiAgICAgICAgICAgIGxlZnQ6IFBoYXNlci5LZXlib2FyZC5BXG4gICAgICAgICAgICByaWdodDogUGhhc2VyLktleWJvYXJkLkRcbiAgICAgICAgfVxuICAgICAgICBEVk9SQUs6IHtcbiAgICAgICAgICAgIHVwOiAxODggIyBDb21tYVxuICAgICAgICAgICAgZG93bjogUGhhc2VyLktleWJvYXJkLk9cbiAgICAgICAgICAgIGxlZnQ6IFBoYXNlci5LZXlib2FyZC5BXG4gICAgICAgICAgICByaWdodDogUGhhc2VyLktleWJvYXJkLkVcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgY29uc3RydWN0b3I6IChAZ2FtZSwgQHBsYXllciktPlxuICAgICAgICBAY3Vyc29ycyA9IGdhbWUuaW5wdXQua2V5Ym9hcmQuY3JlYXRlQ3Vyc29yS2V5cygpXG4gICAgICAgIEBzZXRLZXltYXAoXCJRV0VSVFlcIilcblxuICAgICAgICBAZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXlDYXB0dXJlKFtcbiAgICAgICAgICAgIFBoYXNlci5LZXlib2FyZC5MRUZULFxuICAgICAgICAgICAgUGhhc2VyLktleWJvYXJkLlJJR0hULFxuICAgICAgICAgICAgUGhhc2VyLktleWJvYXJkLlVQLFxuICAgICAgICAgICAgUGhhc2VyLktleWJvYXJkLkRPV04sXG4gICAgICAgICAgICBQaGFzZXIuS2V5Ym9hcmQuVyxcbiAgICAgICAgICAgIFBoYXNlci5LZXlib2FyZC5TLFxuICAgICAgICAgICAgUGhhc2VyLktleWJvYXJkLkEsXG4gICAgICAgICAgICBQaGFzZXIuS2V5Ym9hcmQuRCxcbiAgICAgICAgICAgIFBoYXNlci5LZXlib2FyZC5RLFxuICAgICAgICAgICAgUGhhc2VyLktleWJvYXJkLkUsXG4gICAgICAgICAgICBQaGFzZXIuS2V5Ym9hcmQuU1BBQ0VCQVIsXG4gICAgICAgICAgICBQaGFzZXIuS2V5Ym9hcmQuRU5URVIsXG4gICAgICAgIF0pO1xuXG4gICAgc2V0S2V5bWFwOiAobW9kZSk9PlxuICAgICAgICBpZiBAa2V5Ym9hcmRfbW9kZXNbbW9kZV0/XG4gICAgICAgICAgICBAa2V5Ym9hcmRfbW9kZSA9IEBrZXlib2FyZF9tb2Rlc1ttb2RlXVxuXG4gICAgdXBkYXRlOiAoKS0+XG5cbiAgICAgICAgIyBSZXNldCB0aGUgcGxheWVyJ3MgdmVsb2NpdHlcbiAgICAgICAgQHBsYXllci5ib2R5LnZlbG9jaXR5LnggPSAwXG4gICAgICAgIEBwbGF5ZXIuYm9keS52ZWxvY2l0eS55ID0gMFxuXG4gICAgICAgICMgU2V0IGxlZnQgb3IgcmlnaHQgdmVsb2NpdHlcbiAgICAgICAgaWYgQGN1cnNvcnMubGVmdC5pc0Rvd24gb3IgQGdhbWUuaW5wdXQua2V5Ym9hcmQuaXNEb3duKEBrZXlib2FyZF9tb2RlLmxlZnQpXG4gICAgICAgICAgICBAcGxheWVyLmJvZHkudmVsb2NpdHkueCA9IC0xICogQHBsYXllci5zcGVlZFxuICAgICAgICBlbHNlIGlmIEBjdXJzb3JzLnJpZ2h0LmlzRG93biBvciBAZ2FtZS5pbnB1dC5rZXlib2FyZC5pc0Rvd24oQGtleWJvYXJkX21vZGUucmlnaHQpXG4gICAgICAgICAgICBAcGxheWVyLmJvZHkudmVsb2NpdHkueCA9IEBwbGF5ZXIuc3BlZWRcblxuICAgICAgICAjIFNldCB1cCBvciBkb3duIHZlbG9jaXR5XG4gICAgICAgIGlmIEBjdXJzb3JzLnVwLmlzRG93biBvciBAZ2FtZS5pbnB1dC5rZXlib2FyZC5pc0Rvd24oQGtleWJvYXJkX21vZGUudXApXG4gICAgICAgICAgICBAcGxheWVyLmJvZHkudmVsb2NpdHkueSA9IC0xICogQHBsYXllci5zcGVlZFxuICAgICAgICBlbHNlIGlmIEBjdXJzb3JzLmRvd24uaXNEb3duIG9yIEBnYW1lLmlucHV0LmtleWJvYXJkLmlzRG93bihAa2V5Ym9hcmRfbW9kZS5kb3duKVxuICAgICAgICAgICAgQHBsYXllci5ib2R5LnZlbG9jaXR5LnkgPSBAcGxheWVyLnNwZWVkXG5cbiAgICAgICAgaWYgQGdhbWUuaW5wdXQua2V5Ym9hcmQuZG93bkR1cmF0aW9uKFBoYXNlci5LZXlib2FyZC5TUEFDRUJBUiwgMTApXG4gICAgICAgICAgICBAcGxheWVyLm5leHRUb29sKClcblxuICAgICAgICAjICMgVE9ETzogd2UnbGwgd2FudCB0byBzd2l0Y2ggdGhpcyBzbyB3ZSd2ZSBnb3Qgb3VyIGNoZWNrLWFtbW9cbiAgICAgICAgIyAjIHNjcmVlbiwgcmF0aGVyIHRoYW4gZXhwbGljaXRseSBwcmVzc2luZyB0aGUgUiBrZXkgdG8gcmVsb2FkXG4gICAgICAgICMgaWYgQGdhbWUuaW5wdXQua2V5Ym9hcmQuanVzdFByZXNzZWQoUGhhc2VyLktleWJvYXJkLlIpXG4gICAgICAgICMgICAgIEBwbGF5ZXIucmVsb2FkR3VuKClcbiIsIkJ1aWxkaW5nVGVzdCA9IHJlcXVpcmUoXCIuL0J1aWxkaW5nVGVzdFwiKS5CdWlsZGluZ1Rlc3RcblxuIyBUaGUgYnVpbGQgdG9vbCBhbGxvd3MgdGhlIHBsYXllciB0byBjcmVhdGUgYnVpbGRpbmdzXG5jbGFzcyBleHBvcnRzLlRvb2xCdWlsZFxuXG4gICAgIyB0b29sIG5hbWUgc2hvdWxkIGJlIGRpc3BsYXllZCBpbiB0aGUgc3RhdHVzIGJhclxuICAgIG5hbWU6IFwiQnVpbGRcIlxuXG4gICAgIyB0aW1lIGJldHdlZW4gcmVnaXN0ZXJpbmcgc2VwZXJhdGUgY2xpY2tzXG4gICAgY29vbGRvd246IDEwMCAjIG1zXG5cbiAgICAjIHRoZSBidWlsZGluZyB0byBiZSBjcmVhdGVkXG4gICAgY3VycmVudEJ1aWxkaW5nOiBudWxsXG5cbiAgICBjb25zdHJ1Y3RvcjogKEBnYW1lLCBAcGxheWVyKS0+XG5cbiAgICAgICAgQGNvbnN0cnVjdGluZyA9IGZhbHNlXG5cbiAgICAgICAgIyBDcmVhdGUgYW4gb2JqZWN0IHJlcHJlc2VudGluZyBvdXIgZ3VuXG4gICAgICAgIEBndW4gPSBAZ2FtZS5hZGQuc3ByaXRlIDUwLCBAZ2FtZS5oZWlnaHQvMiwgJ3N0YXIyJ1xuXG4gICAgICAgICMgU2V0IHRoZSBwaXZvdCBwb2ludCB0byB0aGUgY2VudGVyIG9mIHRoZSBndW5cbiAgICAgICAgQGd1bi5hbmNob3Iuc2V0VG8gMC41LCAwLjVcblxuICAgICAgICBAZ3VuLnZpc2libGUgPSBmYWxzZVxuXG4gICAgICAgICMgY3JlYXRlIGEgZ2hvc3QgY3Vyc29yXG4gICAgICAgIEBuZXdHaG9zdChCdWlsZGluZ1Rlc3QpXG5cbiAgICAgICAgQHVuc2VsZWN0KClcblxuICAgICAgICByZXR1cm4gdGhpc1xuXG4gICAgdXBkYXRlOiAoKT0+XG5cbiAgICAgICAgIyBNb3ZlIHRoZSBndW4gdG8gdGhlIHBsYXllclxuICAgICAgICBAZ3VuLnggPSBAcGxheWVyLnhcbiAgICAgICAgQGd1bi55ID0gQHBsYXllci55XG5cbiAgICAgICAgIyBNb3ZlIHRoZSBnaG9zdCBpbWFnZSB0byB0aGUgY3Vyc29yXG4gICAgICAgIEBnaG9zdC54ID0gQGdhbWUuaW5wdXQuYWN0aXZlUG9pbnRlci53b3JsZFhcbiAgICAgICAgQGdob3N0LnkgPSBAZ2FtZS5pbnB1dC5hY3RpdmVQb2ludGVyLndvcmxkWVxuXG5cbiAgICAgICAgaWYgbm90IEBjb25zdHJ1Y3RpbmdcbiAgICAgICAgICAgIGlmIEBnYW1lLmlucHV0Lm1vdXNlUG9pbnRlci5qdXN0UmVsZWFzZWQoQGNvb2xkb3duKVxuICAgICAgICAgICAgICAgIEBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdjYXN0JylcbiAgICAgICAgICAgICAgICBAZ2FtZS5qdWljZS5wbG9wKEBnaG9zdC54LCBAZ2hvc3QueSlcbiAgICAgICAgICAgICAgICBAYnVpbGRHaG9zdCgpXG4gICAgICAgICAgICAgICAgQGNvbnN0cnVjdGluZyA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgaWYgbm90IEBnYW1lLmlucHV0Lm1vdXNlUG9pbnRlci5qdXN0UmVsZWFzZWQoQGNvb2xkb3duKVxuICAgICAgICAgICAgICAgIEBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdpZGxlJylcbiAgICAgICAgICAgICAgICBAY29uc3RydWN0aW5nID0gZmFsc2VcblxuICAgIGdldFN0YXR1c1RleHQ6ICgpLT5cbiAgICAgICAgc3RhdHVzID0gJydcbiAgICAgICAgc3RhdHVzICs9ICdidWlsZGluZzogJyArIGlmIEBnaG9zdCB0aGVuIEBnaG9zdC5uYW1lIGVsc2UgJ25vbmUnICsgJ1xcbidcbiAgICAgICAgcmV0dXJuIHN0YXR1c1xuXG4gICAgc2VsZWN0OiAoKS0+XG4gICAgICAgIEBnaG9zdC5yZXZpdmUoKVxuXG4gICAgdW5zZWxlY3Q6ICgpLT5cbiAgICAgICAgQGdob3N0LmtpbGwoKVxuXG5cblxuICAgIG5ld0dob3N0OiAoYnVpbGRpbmdUeXBlKT0+XG4gICAgICAgICMgaWYgd2UndmUgbm90IGNvbnN0cnVjdGVkIHRoZSBnaG9zdCBidWlsZGluZyxcbiAgICAgICAgIyB3ZSdyZSBzd2l0Y2hpbmcgY3Vyc29ycywgc28gZGVzdG9yeSB0aGUgb2xkIG9uZVxuICAgICAgICBpZiBAZ2hvc3QgYW5kIG5vdCBAZ2hvc3QuaXNDb25zdHJ1Y3RlZFxuICAgICAgICAgICAgQGdob3N0LmRlc3Ryb3koKVxuICAgICAgICBAZ2hvc3QgPSBuZXcgYnVpbGRpbmdUeXBlKEBnYW1lKVxuICAgICAgICAjIGNvbnNvbGUubG9nIEBnaG9zdFxuICAgICAgICByZXR1cm4gQGdob3N0XG5cbiAgICBidWlsZEdob3N0OiAoKS0+XG4gICAgICAgIGlmIEBnaG9zdFxuICAgICAgICAgICAgQGdob3N0LmJ1aWxkKClcbiAgICAgICAgICAgICMgQGdob3N0ID0gbnVsbFxuICAgICAgICAgICAgQG5ld0dob3N0KEJ1aWxkaW5nVGVzdClcblxuXG4iLCIjIFRoZSBidWlsZCB0b29sIGFsbG93cyB0aGUgcGxheWVyIHRvIHBsYWNlIHRpbGVzXG5jbGFzcyBleHBvcnRzLlRvb2xNaXNzaWxlXG5cbiAgICAjIHRvb2wgbmFtZSBzaG91bGQgYmUgZGlzcGxheWVkIGluIHRoZSBzdGF0dXMgYmFyXG4gICAgbmFtZTogXCJNYWdpYyBNaXNzaWxlXCJcblxuICAgICMgRGVmaW5lIGNvbnN0YW50c1xuICAgIFNIT1RfREVMQVk6IDI1MCAjIG1pbGxpc2Vjb25kc1xuICAgIEJVTExFVF9TUEVFRDogNDUwICMgcGl4ZWxzL3NlY29uZFxuICAgIE5VTUJFUl9PRl9CVUxMRVRTOiAyMFxuICAgIFJPVEFUSU9OX09GRlNFVDogMFxuICAgIEJVTExFVF9FTkVSR1lfQ09TVDogNTBcblxuICAgIGNvbnN0cnVjdG9yOiAoQGdhbWUsIEBwbGF5ZXIpLT5cblxuICAgICAgICBAUk9UQVRJT05fT0ZGU0VUID0gUGhhc2VyLk1hdGguZGVnVG9SYWQgOTBcblxuICAgICAgICAjIENyZWF0ZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIG91ciBndW5cbiAgICAgICAgQGd1biA9IEBnYW1lLmFkZC5zcHJpdGUgNTAsIEBnYW1lLmhlaWdodC8yLCAnbWlzc2lsZSdcblxuICAgICAgICAjIE1ha2UgdGhlIGd1biBpbnZpc2libGVcbiAgICAgICAgQGd1bi52aXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgIyBTZXQgdGhlIHBpdm90IHBvaW50IHRvIHRoZSBjZW50ZXIgb2YgdGhlIGd1blxuICAgICAgICBAZ3VuLmFuY2hvci5zZXRUbyAwLjUsIDAuNVxuXG4gICAgICAgICMgY3JlYXRlIHNvbWUgYnVsbGV0c1xuICAgICAgICBAY3JlYXRlQnVsbGV0cygpXG5cbiAgICAgICAgQHVuc2VsZWN0KClcblxuICAgICAgICByZXR1cm4gdGhpc1xuXG4gICAgdXBkYXRlOiAoKT0+XG5cbiAgICAgICAgIyBNb3ZlIHRoZSBndW4gdG8gdGhlIHBsYXllclxuICAgICAgICBAZ3VuLnggPSBAcGxheWVyLnhcbiAgICAgICAgQGd1bi55ID0gQHBsYXllci55XG4gICAgICAgICMgQGd1bi5yb3RhdGlvbiA9IEBwbGF5ZXIucm90YXRpb25cbiAgICAgICAgIyBSb3RhdGUgdGhlIGd1biB0byBmYWNlIHRoZSBtb3VzZVxuICAgICAgICBAZ3VuLnJvdGF0aW9uID0gQGdhbWUucGh5c2ljcy5hcmNhZGUuYW5nbGVUb1BvaW50ZXIgQGd1blxuXG4gICAgICAgICMgc2hvdCB0aGUgdGhpbmdzXG4gICAgICAgIGlmIEBmaXJlSW5wdXRJc0FjdGl2ZSgpXG4gICAgICAgICAgICBAcGxheWVyLmFuaW1hdGlvbnMucGxheSgnY2FzdCcpXG4gICAgICAgICAgICBAc2hvb3RCdWxsZXQoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAcGxheWVyLmFuaW1hdGlvbnMucGxheSgnaWRsZScpXG5cbiAgICAgICAgIyBsLWNsaWNrIHRvIGZpcmVcblxuICAgICAgICAjIHItY2xpY2sgdG9cbiAgICAgICAgIyAgIHBpY2sgdGFyZ2V0cz9cbiAgICAgICAgIyAgIGd1aWRlIG1pc3NpbGVzP1xuICAgICAgICAjICAgZGVmZW5kP1xuXG5cbiAgICAjIFRoaXMgZnVuY3Rpb24gc2hvdWxkIHJldHVybiB0cnVlIHdoZW4gdGhlIHBsYXllciBhY3RpdmF0ZXMgdGhlIFwiZmlyZVwiIGNvbnRyb2xcbiAgICAjIEluIHRoaXMgY2FzZSwgZWl0aGVyIGhvbGRpbmcgdGhlIHNwYWNlIGJhclxuICAgIGZpcmVJbnB1dElzQWN0aXZlOiAoKS0+XG4gICAgICAgIGlzQWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgIyBmaXJlS2V5ID0gQGdhbWUuaW5wdXQua2V5Ym9hcmQuaXNEb3duIFBoYXNlci5LZXlib2FyZC5TUEFDRUJBUlxuICAgICAgICBmaXJlQnV0dG9uID0gQGdhbWUuaW5wdXQubW91c2UuYnV0dG9uIGlzIFBoYXNlci5Nb3VzZS5MRUZUX0JVVFRPTlxuXG4gICAgICAgICMgaXNBY3RpdmUgPSBmaXJlS2V5IG9yIGZpcmVCdXR0b25cblxuICAgICAgICByZXR1cm4gZmlyZUJ1dHRvblxuXG5cbiAgICBjcmVhdGVCdWxsZXRzOiAoKS0+XG5cbiAgICAgICAgIyBDcmVhdGUgYW4gb2JqZWN0IHBvb2wgb2YgYnVsbGV0c1xuICAgICAgICBAYnVsbGV0UG9vbCA9IEBnYW1lLmFkZC5ncm91cCgpXG4gICAgICAgIGZvciBpIGluIFswLi5ATlVNQkVSX09GX0JVTExFVFNdXG4gICAgICAgICAgICAjIENyZWF0ZSBlYWNoIGJ1bGxldCBhbmQgYWRkIGl0IHRvIHRoZSBncm91cC5cbiAgICAgICAgICAgIGJ1bGxldCA9IEBnYW1lLmFkZC5zcHJpdGUgMCwgMCwgJ21pc3NpbGUnXG4gICAgICAgICAgICBAYnVsbGV0UG9vbC5hZGQgYnVsbGV0XG5cbiAgICAgICAgICAgICMgU2V0IGl0cyBwaXZvdCBwb2ludCB0byB0aGUgY2VudGVyIG9mIHRoZSBidWxsZXRcbiAgICAgICAgICAgICMgYnVsbGV0LmFuY2hvci5zZXRUbygwLjUsIC0wLjI1KTtcbiAgICAgICAgICAgIGJ1bGxldC5hbmNob3Iuc2V0VG8gMC41LCAwLjVcblxuICAgICAgICAgICAgIyBFbmFibGUgcGh5c2ljcyBvbiB0aGUgYnVsbGV0XG4gICAgICAgICAgICBAZ2FtZS5waHlzaWNzLmVuYWJsZSBidWxsZXQsIFBoYXNlci5QaHlzaWNzLkFSQ0FERVxuXG4gICAgICAgICAgICAjIEdpdmUgdGhlIGJ1bGxldCBhIHBvd2VyIHZhbHVlIHdoaWNoIGl0IHVzZXMgdG8gZGVhbCBkYW1hZ2VcbiAgICAgICAgICAgIGJ1bGxldC5wb3dlciA9IDFcblxuICAgICAgICAgICAgIyBTZXQgaXRzIGluaXRpYWwgc3RhdGUgdG8gXCJkZWFkXCIuXG4gICAgICAgICAgICBidWxsZXQua2lsbCgpO1xuXG5cbiAgICBzaG9vdEJ1bGxldDogKCktPlxuICAgICAgICAjIEVuZm9yY2UgYSBzaG9ydCBkZWxheSBiZXR3ZWVuIHNob3RzIGJ5IHJlY29yZGluZ1xuICAgICAgICAjIHRoZSB0aW1lIHRoYXQgZWFjaCBidWxsZXQgaXMgc2hvdCBhbmQgdGVzdGluZyBpZlxuICAgICAgICAjIHRoZSBhbW91bnQgb2YgdGltZSBzaW5jZSB0aGUgbGFzdCBzaG90IGlzIG1vcmUgdGhhblxuICAgICAgICAjIHRoZSByZXF1aXJlZCBkZWxheS5cbiAgICAgICAgaWYgQGxhc3RCdWxsZXRTaG90QXQgaXMgdW5kZWZpbmVkXG4gICAgICAgICAgICBAbGFzdEJ1bGxldFNob3RBdCA9IDBcbiAgICAgICAgaWYgQGdhbWUudGltZS5ub3cgLSBAbGFzdEJ1bGxldFNob3RBdCA8IEBTSE9UX0RFTEFZXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgQGxhc3RCdWxsZXRTaG90QXQgPSBAZ2FtZS50aW1lLm5vd1xuXG4gICAgICAgICMgR2V0IGEgZGVhZCBidWxsZXQgZnJvbSB0aGUgcG9vbFxuICAgICAgICBidWxsZXQgPSBAYnVsbGV0UG9vbC5nZXRGaXJzdERlYWQoKVxuXG4gICAgICAgICMgSWYgdGhlcmUgYXJlbid0IGFueSBidWxsZXRzIGF2YWlsYWJsZSB0aGVuIGRvbid0IHNob290XG4gICAgICAgIGlmIGJ1bGxldCBpcyBudWxsIG9yIGJ1bGxldCBpcyB1bmRlZmluZWRcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICMgUmV2aXZlIHRoZSBidWxsZXRcbiAgICAgICAgIyBUaGlzIG1ha2VzIHRoZSBidWxsZXQgXCJhbGl2ZVwiXG4gICAgICAgIGJ1bGxldC5yZXZpdmUoKVxuXG4gICAgICAgICMgQnVsbGV0cyBzaG91bGQga2lsbCB0aGVtc2VsdmVzIHdoZW4gdGhleSBsZWF2ZSB0aGUgd29ybGQuXG4gICAgICAgICMgUGhhc2VyIHRha2VzIGNhcmUgb2YgdGhpcyBmb3IgbWUgYnkgc2V0dGluZyB0aGlzIGZsYWdcbiAgICAgICAgIyBidXQgeW91IGNhbiBkbyBpdCB5b3Vyc2VsZiBieSBraWxsaW5nIHRoZSBidWxsZXQgaWZcbiAgICAgICAgIyBpdHMgeCx5IGNvb3JkaW5hdGVzIGFyZSBvdXRzaWRlIG9mIHRoZSB3b3JsZC5cbiAgICAgICAgYnVsbGV0LmNoZWNrV29ybGRCb3VuZHMgPSB0cnVlXG4gICAgICAgIGJ1bGxldC5vdXRPZkJvdW5kc0tpbGwgPSB0cnVlXG5cbiAgICAgICAgIyBTZXQgdGhlIGJ1bGxldCBwb3NpdGlvbiB0byB0aGUgZ3VuIHBvc2l0aW9uLlxuICAgICAgICBidWxsZXQucmVzZXQgQGd1bi54LCBAZ3VuLnlcbiAgICAgICAgYnVsbGV0LnJvdGF0aW9uID0gQGd1bi5yb3RhdGlvbiAtIEBST1RBVElPTl9PRkZTRVRcbiAgICAgICAgIyBjb25zb2xlLmxvZyhidWxsZXQucm90YXRpb24pO1xuXG4gICAgICAgICMgU2hvb3QgaXRcbiAgICAgICAgYnVsbGV0LmJvZHkudmVsb2NpdHkueCA9IE1hdGguY29zKGJ1bGxldC5yb3RhdGlvbiArIEBST1RBVElPTl9PRkZTRVQpICogQEJVTExFVF9TUEVFRFxuICAgICAgICBidWxsZXQuYm9keS52ZWxvY2l0eS55ID0gTWF0aC5zaW4oYnVsbGV0LnJvdGF0aW9uICsgQFJPVEFUSU9OX09GRlNFVCkgKiBAQlVMTEVUX1NQRUVEXG5cbiAgICAgICAgIyBEbyBzb21lIGp1aWNlXG4gICAgICAgIEBnYW1lLmp1aWNlLnBldygpXG5cbiAgICBnZXRTdGF0dXNUZXh0OiAoKS0+XG4gICAgICAgIHJldHVybiAnJ1xuXG4gICAgc2VsZWN0OiAoKS0+XG5cbiAgICB1bnNlbGVjdDogKCktPlxuIiwiIyBUaGUgVGVsZXBvcnQgdG9vbCBhbGxvd3MgdGhlIHBsYXllciB0byB0ZWxlcG9ydFxuY2xhc3MgZXhwb3J0cy5Ub29sVGVsZXBvcnRcblxuICAgICMgdG9vbCBuYW1lIHNob3VsZCBiZSBkaXNwbGF5ZWQgaW4gdGhlIHN0YXR1cyBiYXJcbiAgICBuYW1lOiBcIlRlbGVwb3J0XCJcblxuICAgICMgdGltZSBiZXR3ZWVuIHJlZ2lzdGVyaW5nIHNlcGVyYXRlIGNsaWNrc1xuICAgIGNvb2xkb3duOiAxMDAgIyBtc1xuXG4gICAgY29uc3RydWN0b3I6IChAZ2FtZSwgQHBsYXllciktPlxuXG4gICAgICAgIEB0ZWxlcG9ydGluZyA9IGZhbHNlXG5cbiAgICAgICAgQHVuc2VsZWN0KClcblxuICAgICAgICByZXR1cm4gdGhpc1xuXG4gICAgdXBkYXRlOiAoKT0+XG5cbiAgICAgICAgIyBsLWNsaWNrIHRvIHRlbGVwb3J0XG5cbiAgICAgICAgIyByLWNsaWNrIHRvIHBpY2sgdGlsZXNcblxuICAgICAgICAjIHEgdG8gdG9nZ2xlIHBhbGV0dGVcblxuICAgICAgICAjIGNsaWNrIHRoZSB0aWxlIHBhbGV0dGUgdG8gcGljayBhIHRpbGVcblxuICAgICAgICBpZiBub3QgQHRlbGVwb3J0aW5nXG4gICAgICAgICAgICBpZiBAZ2FtZS5pbnB1dC5tb3VzZVBvaW50ZXIuanVzdFJlbGVhc2VkKEBjb29sZG93bilcbiAgICAgICAgICAgICAgICBAcGxheWVyLmFuaW1hdGlvbnMucGxheSgnY2FzdCcpXG4gICAgICAgICAgICAgICAgQGdhbWUuanVpY2UuZm9vc2goQHBsYXllci54LCBAcGxheWVyLnksIGdhbWUuaW5wdXQuYWN0aXZlUG9pbnRlci53b3JsZFgsIGdhbWUuaW5wdXQuYWN0aXZlUG9pbnRlci53b3JsZFkpXG4gICAgICAgICAgICAgICAgQHBsYXllci54ID0gZ2FtZS5pbnB1dC5hY3RpdmVQb2ludGVyLndvcmxkWFxuICAgICAgICAgICAgICAgIEBwbGF5ZXIueSA9IGdhbWUuaW5wdXQuYWN0aXZlUG9pbnRlci53b3JsZFlcbiAgICAgICAgICAgICAgICBAdGVsZXBvcnRpbmcgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGlmIG5vdCBAZ2FtZS5pbnB1dC5tb3VzZVBvaW50ZXIuanVzdFJlbGVhc2VkKEBjb29sZG93bilcbiAgICAgICAgICAgICAgICBAcGxheWVyLmFuaW1hdGlvbnMucGxheSgnaWRsZScpXG4gICAgICAgICAgICAgICAgQHRlbGVwb3J0aW5nID0gZmFsc2VcblxuICAgIGdldFN0YXR1c1RleHQ6ICgpLT5cbiAgICAgICAgcmV0dXJuICd0ZWxlcG9ydGluZzogJyArIEB0ZWxlcG9ydGluZ1xuXG4gICAgc2VsZWN0OiAoKS0+XG5cbiAgICB1bnNlbGVjdDogKCktPlxuXG5cblxuIiwiIyBUaGUgdGVycmFpbiB0b29sIGFsbG93cyB0aGUgcGxheWVyIHRvIHBsYWNlIHRpbGVzXG5jbGFzcyBleHBvcnRzLlRvb2xUZXJyYWluXG5cbiAgICAjIHRvb2wgbmFtZSBzaG91bGQgYmUgZGlzcGxheWVkIGluIHRoZSBzdGF0dXMgYmFyXG4gICAgbmFtZTogXCJUZXJyYWluXCJcblxuICAgICMgdGhlIHRpbGUgaWQgdGhhdCBpcyBjdXJyZW50bHkgcGlja2VkXG4gICAgY3VycmVudFRpbGVJZDogMFxuXG4gICAgIyB0aGUgdGlsZW1hcCB3ZSdyZSBnb2luZyB0byBiZSBjaGFuZ2luZ1xuICAgIHRpbGVtYXA6IG51bGxcblxuICAgIGNvbnN0cnVjdG9yOiAoQGdhbWUsIEBwbGF5ZXIpLT5cblxuICAgICAgICAjIENyZWF0ZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIG91ciBndW5cbiAgICAgICAgQGd1biA9IEBnYW1lLmFkZC5zcHJpdGUgNTAsIEBnYW1lLmhlaWdodC8yLCAnc3RhcjInXG5cbiAgICAgICAgIyBTZXQgdGhlIHBpdm90IHBvaW50IHRvIHRoZSBjZW50ZXIgb2YgdGhlIGd1blxuICAgICAgICBAZ3VuLmFuY2hvci5zZXRUbyAwLjUsIDAuNVxuXG4gICAgICAgIEBndW4udmlzaWJsZSA9IGZhbHNlXG5cbiAgICAgICAgIyBjcmVhdGUgYSBzZWxlY3Rpb24gY3Vyc29yXG4gICAgICAgIEBzZWxlY3Rpb24gPSBAZ2FtZS5hZGQuc3ByaXRlIDUwLCBAZ2FtZS5oZWlnaHQvMiwgJ3RpbGVTZWxlY3QnXG4gICAgICAgIEBzZWxlY3Rpb24uYW5jaG9yLnNldFRvIDAuNSwgMC41XG5cbiAgICAgICAgQGN1cnJlbnRUaWxlID0gMFxuICAgICAgICBAbWFwID0gQGdhbWUuY3VycmVudExldmVsLnRpbGVtYXBcbiAgICAgICAgQGN1cnJlbnRMYXllciA9IEBnYW1lLmN1cnJlbnRMZXZlbC5jdXJyZW50TGF5ZXJcblxuICAgICAgICBAdW5zZWxlY3QoKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG5cbiAgICBzaG93UGFsbGV0ZTogKCktPlxuICAgICAgICAjIFRPRE86IHNob3cgdGhlIHBhbGxldGUgYXQgdGhlIHRvcCBvZiB0aGUgc2NyZWVuXG5cbiAgICBoaWRlUGFsbGV0ZTogKCktPlxuICAgICAgICAjIFRPRE86IGhpZGUgdGhlIHBhbGV0dGVcblxuICAgIHBpY2tQYWxsZXRlVGlsZTogKCktPlxuICAgICAgICAjIFRPRE86IHBpY2sgYSB0aWxlIGZyb20gdGhlIHBhbGV0dGUgYW5kIHNldCBpdCBhcyBjdXJyZW50XG5cbiAgICAjIHBpY2sgYSB0aWxlIGZyb20gdGhlIHRpbGVtYXAgYW5kIHNldCBpdCBhcyB0aGUgY3VycmVudCB0aWxlXG4gICAgcGlja1RpbGU6ICh4LCB5KS0+XG4gICAgICAgICMgaWYgdGhlIHRpbGVtYXAgaXMgbnVsbCwgcmV0dXJuXG4gICAgICAgIGlmIG5vdCBAdGlsZW1hcD9cbiAgICAgICAgICAgIGNvbnNvbGUubG9nIFwiVG9vbFRlcnJhaW4ucGlja1RpbGU6IEB0aWxlbWFwIGRvZXMgbm90IGV4aXN0XCJcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAjIGdldCBhbmQgYXNzaWduIHRoZSB0aWxlIGlkIGZyb20gdGhlIHRpbGVtYXBcbiAgICAgICAgQGN1cnJlbnRUaWxlSWQgPSAwICMgVE9ETzogZ2V0IHRpbGUgZnJvbSB0aWxlbWFwXG5cbiAgICAjIHJlcGxhY2UgYSB0aWxlIG9uIHRoZSB0aWxlbWFwIHdpdGggdGhlIGN1cnJlbnQgdGlsZVxuICAgIHBhaW50VGlsZTogKHgsIHkpLT5cbiAgICAgICAgIyBpZiB0aGUgdGlsZW1hcCBpcyBudWxsLCByZXR1cm5cbiAgICAgICAgaWYgbm90IEB0aWxlbWFwP1xuICAgICAgICAgICAgY29uc29sZS5sb2cgXCJUb29sVGVycmFpbi5wYWludFRpbGU6IEB0aWxlbWFwIGRvZXMgbm90IGV4aXN0XCJcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAjIFRPRE86IGlmIHRoZSB0aWxlIGF0IHgsIHkgaXMgYWxyZWFkeSB0aGUgY3VycmVudCB0aWxlLCByZXR1cm5cblxuICAgICAgICAjIFRPRE86IHJlcGxhY2UgdGhlIHRpbGVtYXAgYXQgeCwgeSB3aXRoIHRoZSBjdXJyZW50IHRpbGVcblxuICAgICMgdGFrZXMgYSBzZXQgb2Ygc2NyZWVuIGNvb3JkaW5hdGVzIGFuZCB0cmFuc2xhdGVzIHRoZW0gdG8gdGlsZW1hcCBjb29yZHNcbiAgICBjb29yZHNTY3JlZW5Ub1RpbGVtYXA6ICh4LCB5KS0+XG4gICAgICAgICMgVE9ETzogdHJhbnNsYXRlIGFuZCByZXR1cm4gY29vcmRpbmF0ZXNcblxuICAgIHVwZGF0ZTogKCk9PlxuXG4gICAgICAgICMgTW92ZSB0aGUgZ3VuIHRvIHRoZSBwbGF5ZXJcbiAgICAgICAgQGd1bi54ID0gQHBsYXllci54XG4gICAgICAgIEBndW4ueSA9IEBwbGF5ZXIueVxuXG4gICAgICAgICMgTW92ZSB0aGUgc2VsZWN0aW9uIHRvIHRoZSBjdXJzb3JcbiAgICAgICAgQHNlbGVjdGlvbi54ID0gTWF0aC5mbG9vcihAZ2FtZS5pbnB1dC5hY3RpdmVQb2ludGVyLndvcmxkWCAvIDMyKSAqIDMyICsgMTZcbiAgICAgICAgQHNlbGVjdGlvbi55ID0gTWF0aC5mbG9vcihAZ2FtZS5pbnB1dC5hY3RpdmVQb2ludGVyLndvcmxkWSAvIDMyKSAqIDMyICsgMTZcblxuICAgICAgICAjIGwtY2xpY2sgdG8gcGFpbnQgdGlsZXNcblxuICAgICAgICAjIHItY2xpY2sgdG8gcGljayB0aWxlc1xuXG4gICAgICAgICMgcSB0byB0b2dnbGUgcGFsZXR0ZVxuXG4gICAgICAgICMgY2xpY2sgdGhlIHRpbGUgcGFsZXR0ZSB0byBwaWNrIGEgdGlsZVxuXG4gICAgICAgIG1hcmtlclggPSBAY3VycmVudExheWVyLmdldFRpbGVYKGdhbWUuaW5wdXQuYWN0aXZlUG9pbnRlci53b3JsZFgpICogMzJcbiAgICAgICAgbWFya2VyWSA9IEBjdXJyZW50TGF5ZXIuZ2V0VGlsZVkoZ2FtZS5pbnB1dC5hY3RpdmVQb2ludGVyLndvcmxkWSkgKiAzMlxuXG4gICAgICAgIGlmIChAZ2FtZS5pbnB1dC5tb3VzZVBvaW50ZXIuaXNEb3duKVxuICAgICAgICAgICAgQHBsYXllci5hbmltYXRpb25zLnBsYXkoJ2Nhc3QnKVxuICAgICAgICAgICAgIyBAbWFwLnB1dFRpbGUoQGN1cnJlbnRUaWxlLCBAY3VycmVudExheWVyLmdldFRpbGVYKG1hcmtlclgpLCBAY3VycmVudExheWVyLmdldFRpbGVZKG1hcmtlclkpLCBAY3VycmVudExheWVyKVxuICAgICAgICAgICAgaWYgKGdhbWUuaW5wdXQua2V5Ym9hcmQuaXNEb3duKFBoYXNlci5LZXlib2FyZC5TSElGVCkpXG4gICAgICAgICAgICAgICAgQGN1cnJlbnRUaWxlID0gQG1hcC5nZXRUaWxlKEBjdXJyZW50TGF5ZXIuZ2V0VGlsZVgobWFya2VyWCksIEBjdXJyZW50TGF5ZXIuZ2V0VGlsZVkobWFya2VyWSkpLmluZGV4XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgaWYgKEBtYXAuZ2V0VGlsZShAY3VycmVudExheWVyLmdldFRpbGVYKG1hcmtlclgpLCBAY3VycmVudExheWVyLmdldFRpbGVZKG1hcmtlclkpKS5pbmRleCAhPSBAY3VycmVudFRpbGUpXG4gICAgICAgICAgICAgICAgICAgIEBtYXAucHV0VGlsZShAY3VycmVudFRpbGUsIEBjdXJyZW50TGF5ZXIuZ2V0VGlsZVgobWFya2VyWCksIEBjdXJyZW50TGF5ZXIuZ2V0VGlsZVkobWFya2VyWSkpXG4gICAgICAgICAgICAgICAgICAgIEBnYW1lLmp1aWNlLnBsb3AoZ2FtZS5pbnB1dC5hY3RpdmVQb2ludGVyLndvcmxkWCwgZ2FtZS5pbnB1dC5hY3RpdmVQb2ludGVyLndvcmxkWSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHBsYXllci5hbmltYXRpb25zLnBsYXkoJ2lkbGUnKVxuXG4gICAgICAgIGlmIEBnYW1lLmlucHV0LmtleWJvYXJkLmRvd25EdXJhdGlvbihQaGFzZXIuS2V5Ym9hcmQuUSwgMTApXG4gICAgICAgICAgICBAY3VycmVudFRpbGUgPSBQaGFzZXIuTWF0aC5jbGFtcCBAY3VycmVudFRpbGUgLSAxLCAwLCA3XG4gICAgICAgICAgICAjIGNvbnNvbGUubG9nICdjdXJyZW50VGlsZSAtLSB0byAnICsgQGN1cnJlbnRUaWxlXG4gICAgICAgIGlmIEBnYW1lLmlucHV0LmtleWJvYXJkLmRvd25EdXJhdGlvbihQaGFzZXIuS2V5Ym9hcmQuRSwgMTApXG4gICAgICAgICAgICBAY3VycmVudFRpbGUgPSBQaGFzZXIuTWF0aC5jbGFtcCBAY3VycmVudFRpbGUgKyAxLCAwLCA3XG4gICAgICAgICAgICAjIGNvbnNvbGUubG9nICdjdXJyZW50VGlsZSArKyB0byAnICsgQGN1cnJlbnRUaWxlXG5cbiAgICBnZXRTdGF0dXNUZXh0OiAoKS0+XG4gICAgICAgIHN0YXR1cyA9ICcnXG4gICAgICAgIHN0YXR1cyArPSAndGlsZUlEOiAnICsgQGN1cnJlbnRUaWxlICsgJ1xcbidcbiAgICAgICAgcmV0dXJuIHN0YXR1c1xuXG4gICAgc2VsZWN0OiAoKS0+XG4gICAgICAgIEBzZWxlY3Rpb24ucmV2aXZlKClcblxuICAgIHVuc2VsZWN0OiAoKS0+XG4gICAgICAgIEBzZWxlY3Rpb24ua2lsbCgpXG5cblxuXG4iXX0=
