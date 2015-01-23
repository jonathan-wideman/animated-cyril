(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

exports.Building = (function(_super) {
  __extends(Building, _super);

  Building.prototype.name = '';

  Building.prototype.graphicName = 'buildingTest';

  Building.prototype.isConstructed = false;

  function Building(game, x, y) {
    var name;
    this.game = game;
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    name = this.name;
    Building.__super__.constructor.call(this, this.game, x, y, this.graphicName);
    this.name = name;
    this.anchor.setTo(0.5, 0.5);
    this.ghost();
    this.events.onInputOver.add(this.hover, this);
    this.events.onInputOut.add(this.unhover, this);
    this.game.add.existing(this);
    this.addNextTurnListener();
    return this;
  }

  Building.prototype.build = function() {
    this.unghost();
    this.isConstructed = true;
  };

  Building.prototype.addNextTurnListener = function() {
    return this.game.onNextTurn.add(this.nextTurn, this);
  };

  Building.prototype.nextTurn = function() {
    if (!this.isConstructed) {
      return;
    }
    return this.turnEffects();
  };

  Building.prototype.turnEffects = function() {};

  Building.prototype.ghost = function() {
    this.alpha = 0.5;
    this.tint = 0xffccffcc;
    return this.inputEnabled = false;
  };

  Building.prototype.unghost = function() {
    this.alpha = 1;
    this.tint = 0xffffffff;
    return this.inputEnabled = true;
  };

  Building.prototype.hover = function() {
    if (!this.isConstructed) {
      return;
    }
    this.game.ui.tooltip.target = this;
    this.game.ui.tooltip.visible = true;
    this.game.ui.tooltip.text = this.name;
    this.game.ui.tooltip.x = this.x - this.game.ui.tooltip.width / 2;
    return this.game.ui.tooltip.y = this.y - 32;
  };

  Building.prototype.unhover = function() {
    if (!this.isConstructed) {
      return;
    }
    if (this.game.ui.tooltip.target === this) {
      this.game.ui.tooltip.visible = false;
      return this.game.ui.tooltip.target = null;
    }
  };

  return Building;

})(Phaser.Sprite);



},{}],2:[function(require,module,exports){
var Building,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Building = require("./Building").Building;

exports.BuildingTest = (function(_super) {
  __extends(BuildingTest, _super);

  BuildingTest.prototype.name = 'Test Building';

  BuildingTest.prototype.graphicName = 'buildingTest';

  function BuildingTest(game, x, y) {
    this.game = game;
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    BuildingTest.__super__.constructor.call(this, this.game, x, y);
    return this;
  }

  BuildingTest.prototype.turnEffects = function() {
    this.game.reg.stockpile.earn(this.game.reg.stockpile.AER, 1);
    return this.game.juice.popText(this.x, this.y, this.game.reg.stockpile.AER + ' +1');
  };

  return BuildingTest;

})(Building);



},{"./Building":1}],3:[function(require,module,exports){
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



},{}],4:[function(require,module,exports){
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



},{}],5:[function(require,module,exports){
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



},{}],6:[function(require,module,exports){
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



},{"./Building":1,"./Enemy":3,"./FxFloatingSparkles":4,"./Juice":5,"./Player":7}],7:[function(require,module,exports){
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



},{"./PlayerController":8,"./ToolBuild":9,"./ToolMissile":10,"./ToolTeleport":11,"./ToolTerrain":12}],8:[function(require,module,exports){
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



},{}],9:[function(require,module,exports){
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



},{"./BuildingTest":2}],10:[function(require,module,exports){
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



},{}],11:[function(require,module,exports){
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



},{}],12:[function(require,module,exports){
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



},{}]},{},[6])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2p3aWRlbWFuL2Rldi9nYW1lcy93aXphcmQvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvandpZGVtYW4vZGV2L2dhbWVzL3dpemFyZC9zcmMvc2NyaXB0cy9CdWlsZGluZy5jb2ZmZWUiLCIvaG9tZS9qd2lkZW1hbi9kZXYvZ2FtZXMvd2l6YXJkL3NyYy9zY3JpcHRzL0J1aWxkaW5nVGVzdC5jb2ZmZWUiLCIvaG9tZS9qd2lkZW1hbi9kZXYvZ2FtZXMvd2l6YXJkL3NyYy9zY3JpcHRzL0VuZW15LmNvZmZlZSIsIi9ob21lL2p3aWRlbWFuL2Rldi9nYW1lcy93aXphcmQvc3JjL3NjcmlwdHMvRnhGbG9hdGluZ1NwYXJrbGVzLmNvZmZlZSIsIi9ob21lL2p3aWRlbWFuL2Rldi9nYW1lcy93aXphcmQvc3JjL3NjcmlwdHMvSnVpY2UuY29mZmVlIiwiL2hvbWUvandpZGVtYW4vZGV2L2dhbWVzL3dpemFyZC9zcmMvc2NyaXB0cy9NYWluLmNvZmZlZSIsIi9ob21lL2p3aWRlbWFuL2Rldi9nYW1lcy93aXphcmQvc3JjL3NjcmlwdHMvUGxheWVyLmNvZmZlZSIsIi9ob21lL2p3aWRlbWFuL2Rldi9nYW1lcy93aXphcmQvc3JjL3NjcmlwdHMvUGxheWVyQ29udHJvbGxlci5jb2ZmZWUiLCIvaG9tZS9qd2lkZW1hbi9kZXYvZ2FtZXMvd2l6YXJkL3NyYy9zY3JpcHRzL1Rvb2xCdWlsZC5jb2ZmZWUiLCIvaG9tZS9qd2lkZW1hbi9kZXYvZ2FtZXMvd2l6YXJkL3NyYy9zY3JpcHRzL1Rvb2xNaXNzaWxlLmNvZmZlZSIsIi9ob21lL2p3aWRlbWFuL2Rldi9nYW1lcy93aXphcmQvc3JjL3NjcmlwdHMvVG9vbFRlbGVwb3J0LmNvZmZlZSIsIi9ob21lL2p3aWRlbWFuL2Rldi9nYW1lcy93aXphcmQvc3JjL3NjcmlwdHMvVG9vbFRl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QyxDQUFsRCxFQUFxRCxFQUFyRCxDQUFIO0FBQ0ksTUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBWixDQUFrQixJQUFDLENBQUEsV0FBRCxHQUFlLENBQWpDLEVBQW9DLENBQXBDLEVBQXVDLENBQXZDLENBQWYsQ0FESjtLQTlCQTtBQWlDQSxJQUFBLElBQUcsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQXJCLENBQWtDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBbEQsRUFBcUQsRUFBckQsQ0FBSDthQUNJLElBQUMsQ0FBQSxXQUFELEdBQWUsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFaLENBQWtCLElBQUMsQ0FBQSxXQUFELEdBQWUsQ0FBakMsRUFBb0MsQ0FBcEMsRUFBdUMsQ0FBdkMsRUFEbkI7S0FwQ0k7RUFBQSxDQTlEUixDQUFBOztBQUFBLHdCQXNHQSxhQUFBLEdBQWUsU0FBQSxHQUFBO0FBQ1gsUUFBQSxNQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVMsRUFBVCxDQUFBO0FBQUEsSUFDQSxNQUFBLElBQVUsVUFBQSxHQUFhLElBQUMsQ0FBQSxXQUFkLEdBQTRCLElBRHRDLENBQUE7QUFFQSxXQUFPLE1BQVAsQ0FIVztFQUFBLENBdEdmLENBQUE7O0FBQUEsd0JBMkdBLE1BQUEsR0FBUSxTQUFBLEdBQUE7V0FDSixJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBQSxFQURJO0VBQUEsQ0EzR1IsQ0FBQTs7QUFBQSx3QkE4R0EsUUFBQSxHQUFVLFNBQUEsR0FBQTtXQUNOLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxDQUFBLEVBRE07RUFBQSxDQTlHVixDQUFBOztxQkFBQTs7SUFISixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIGV4cG9ydHMuQnVpbGRpbmcgZXh0ZW5kcyBQaGFzZXIuU3ByaXRlXG5cbiAgICBuYW1lOiAnJ1xuXG4gICAgZ3JhcGhpY05hbWU6ICdidWlsZGluZ1Rlc3QnXG5cbiAgICBpc0NvbnN0cnVjdGVkOiBmYWxzZVxuXG4gICAgY29uc3RydWN0b3I6IChAZ2FtZSwgeCA9IDAsIHkgPSAwKS0+XG5cbiAgICAgICAgIyByZW1lbWJlciBvdXIgbmFtZSBiZWNhdXNlIFNwcml0ZSBjb25zdHJ1Y3RvciBpcyBkdW1iXG4gICAgICAgIG5hbWUgPSBAbmFtZVxuXG4gICAgICAgICMgQ2FsbCB0aGUgc3ByaXRlIGNvbnN0cnVjdG9yXG4gICAgICAgIHN1cGVyIEBnYW1lLCB4LCB5LCBAZ3JhcGhpY05hbWVcblxuICAgICAgICAjIHJlc2V0IG91ciBuYW1lIGJlY2F1c2UgU3ByaXRlIGNvbnN0cnVjdG9yIGlzIGR1bWJcbiAgICAgICAgQG5hbWUgPSBuYW1lXG5cbiAgICAgICAgIyBTZXQgdGhlIGFuY2hvciB0byB0aGUgY2VudGVyIG9mIHRoZSBzcHJpdGVcbiAgICAgICAgQGFuY2hvci5zZXRUbyAwLjUsIDAuNVxuXG4gICAgICAgIEBnaG9zdCgpXG5cbiAgICAgICAgIyBhZGQgZXZlbnRzIHRvIG1vdXNlb3ZlciBhbmQgbW91c2VvdXRcbiAgICAgICAgQGV2ZW50cy5vbklucHV0T3Zlci5hZGQoQGhvdmVyLCBAKVxuICAgICAgICBAZXZlbnRzLm9uSW5wdXRPdXQuYWRkKEB1bmhvdmVyLCBAKVxuXG4gICAgICAgICMgYWRkIG91cnNlbHZlcyB0byB0aGUgZ2FtZSBzdGF0ZVxuICAgICAgICBAZ2FtZS5hZGQuZXhpc3RpbmcgdGhpc1xuXG4gICAgICAgIEBhZGROZXh0VHVybkxpc3RlbmVyKClcblxuICAgICAgICByZXR1cm4gdGhpc1xuXG4gICAgYnVpbGQ6ICgpLT5cbiAgICAgICAgQHVuZ2hvc3QoKVxuXG4gICAgICAgICMgc2V0IHRoZSBjb25zdHJ1Y3RlZCBmbGFnXG4gICAgICAgIEBpc0NvbnN0cnVjdGVkID0gdHJ1ZVxuICAgICAgICByZXR1cm5cblxuICAgIGFkZE5leHRUdXJuTGlzdGVuZXI6ICgpLT5cbiAgICAgICAgQGdhbWUub25OZXh0VHVybi5hZGQoQG5leHRUdXJuLCBAKVxuXG4gICAgbmV4dFR1cm46ICgpLT5cbiAgICAgICAgIyBJZiB3ZSBoYXZlbid0IGJlZW4gYnVpbHQgeWV0LCBza2lwIG91ciB0dXJuXG4gICAgICAgIGlmIG5vdCBAaXNDb25zdHJ1Y3RlZFxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgIyBkbyB3aGF0ZXZlciBlZmZlY3RzIHRoaXMgYnVpbGRpbmcgaGFzXG4gICAgICAgIEB0dXJuRWZmZWN0cygpXG5cbiAgICB0dXJuRWZmZWN0czogKCktPlxuICAgICAgICAjIGRlZmF1bHQgYnVpbGRpbmdzIGRvIG5vdGhpbmdcblxuICAgIGdob3N0OiAoKS0+XG4gICAgICAgICMgU2V0IGdyYXBoaWMgZWZmZWN0cyB0byBpbmRpY2F0ZSBhICdnaG9zdCcgcGxhbm5lZCBidWlsZGluZ1xuICAgICAgICBAYWxwaGEgPSAwLjVcbiAgICAgICAgQHRpbnQgPSAweGZmY2NmZmNjXG5cbiAgICAgICAgIyBkaXNhYmxlIGlucHV0IGV2ZW50cyBsaWtlIGNsaWNrLCB0b3VjaCwgcm9sbG92ZXJcbiAgICAgICAgQGlucHV0RW5hYmxlZCA9IGZhbHNlXG5cbiAgICB1bmdob3N0OiAoKS0+XG4gICAgICAgICMgUmVtb3ZlIGdyYXBoaWMgZWZmZWN0cyB0byBpbmRpY2F0ZSBhIGZ1bGx5IGNvbnN0cnVjdGVkIGJ1aWxkaW5nXG4gICAgICAgIEBhbHBoYSA9IDFcbiAgICAgICAgQHRpbnQgPSAweGZmZmZmZmZmXG5cbiAgICAgICAgIyBlbmFibGUgaW5wdXQgZXZlbnRzIGxpa2UgY2xpY2ssIHRvdWNoLCByb2xsb3ZlclxuICAgICAgICBAaW5wdXRFbmFibGVkID0gdHJ1ZVxuXG4gICAgaG92ZXI6ICgpLT5cbiAgICAgICAgaWYgbm90IEBpc0NvbnN0cnVjdGVkXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBAZ2FtZS51aS50b29sdGlwLnRhcmdldCA9IEBcbiAgICAgICAgQGdhbWUudWkudG9vbHRpcC52aXNpYmxlID0gdHJ1ZVxuICAgICAgICBAZ2FtZS51aS50b29sdGlwLnRleHQgPSBAbmFtZVxuICAgICAgICBAZ2FtZS51aS50b29sdGlwLnggPSBAeCAtIEBnYW1lLnVpLnRvb2x0aXAud2lkdGggLyAyXG4gICAgICAgIEBnYW1lLnVpLnRvb2x0aXAueSA9IEB5IC0gMzJcblxuICAgIHVuaG92ZXI6ICgpLT5cbiAgICAgICAgaWYgbm90IEBpc0NvbnN0cnVjdGVkXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBpZiBAZ2FtZS51aS50b29sdGlwLnRhcmdldCA9PSBAXG4gICAgICAgICAgICBAZ2FtZS51aS50b29sdGlwLnZpc2libGUgPSBmYWxzZVxuICAgICAgICAgICAgQGdhbWUudWkudG9vbHRpcC50YXJnZXQgPSBudWxsXG4iLCJCdWlsZGluZyA9IHJlcXVpcmUoXCIuL0J1aWxkaW5nXCIpLkJ1aWxkaW5nXG5cbmNsYXNzIGV4cG9ydHMuQnVpbGRpbmdUZXN0IGV4dGVuZHMgQnVpbGRpbmdcblxuICAgIG5hbWU6ICdUZXN0IEJ1aWxkaW5nJ1xuXG4gICAgZ3JhcGhpY05hbWU6ICdidWlsZGluZ1Rlc3QnXG5cbiAgICBjb25zdHJ1Y3RvcjogKEBnYW1lLCB4ID0gMCwgeSA9IDApLT5cblxuICAgICAgICAjIENhbGwgdGhlIGJ1aWxkaW5nIGNvbnN0cnVjdG9yXG4gICAgICAgIHN1cGVyIEBnYW1lLCB4LCB5XG5cbiAgICAgICAgcmV0dXJuIHRoaXNcblxuICAgIHR1cm5FZmZlY3RzOiAoKS0+XG4gICAgICAgICMgZG8gd2hhdGV2ZXIgZWZmZWN0cyB0aGlzIGJ1aWxkaW5nIGhhc1xuICAgICAgICAjIGVnLiBhZGQgcmVzb3VyY2VzXG4gICAgICAgIEBnYW1lLnJlZy5zdG9ja3BpbGUuZWFybiggQGdhbWUucmVnLnN0b2NrcGlsZS5BRVIsIDEpXG4gICAgICAgIEBnYW1lLmp1aWNlLnBvcFRleHQoQHgsIEB5LCBAZ2FtZS5yZWcuc3RvY2twaWxlLkFFUiArICcgKzEnKVxuIiwiY2xhc3MgZXhwb3J0cy5FbmVteSBleHRlbmRzIFBoYXNlci5TcHJpdGVcbiAgICAjIGhvdyBmYXN0IGNhbiB3ZSBtb3ZlXG4gICAgTUFYX1NQRUVEOiAxMDBcbiAgICBNSU5fRElTVEFOQ0U6IDY0XG5cbiAgICBjb25zdHJ1Y3RvcjogKEBnYW1lLCBAcGxheWVyKS0+XG5cbiAgICAgICAgIyBTZXQgb3VyIHBvc2l0aW9uIHRvIHRoZSB3b3JsZCBjZW50ZXJcbiAgICAgICAgeCA9IEBnYW1lLndvcmxkLmNlbnRlclhcbiAgICAgICAgeSA9IEBnYW1lLndvcmxkLmNlbnRlcllcblxuICAgICAgICAjIENhbGwgdGhlIHNwcml0ZSBjb25zdHJ1Y3RvclxuICAgICAgICBzdXBlciBAZ2FtZSwgeCwgeSwgJ2VuZW15J1xuXG4gICAgICAgICMgU2V0IHRoZSBhbmNob3IgdG8gdGhlIGNlbnRlciBvZiB0aGUgc3ByaXRlXG4gICAgICAgIEBhbmNob3Iuc2V0VG8gMC41LCAwLjVcblxuICAgICAgICAjIEFkZCBzb21lIGFuaW1hdGlvbnNcbiAgICAgICAgQGFuaW1hdGlvbnMuYWRkICd1cCcsIFswLCAxLCAyLCAzXSwgMTAsIHRydWVcbiAgICAgICAgQGFuaW1hdGlvbnMuYWRkICdkb3duJywgWzQsIDUsIDYsIDddLCAxMCwgdHJ1ZVxuICAgICAgICBAYW5pbWF0aW9ucy5hZGQgJ2xlZnQnLCBbOCwgOSwgMTAsIDExXSwgMTAsIHRydWVcbiAgICAgICAgQGFuaW1hdGlvbnMuYWRkICdyaWdodCcsIFsxMiwgMTMsIDE0LCAxNV0sIDEwLCB0cnVlXG5cbiAgICAgICAgIyBFbmFibGUgcGh5c2ljc1xuICAgICAgICBAZ2FtZS5waHlzaWNzLmVuYWJsZSBALCBQaGFzZXIuUGh5c2ljcy5BUkNBREVcblxuICAgICAgICAjIGFkZCBvdXJzZWx2ZXMgdG8gdGhlIGdhbWUgc3RhdGVcbiAgICAgICAgZ2FtZS5hZGQuZXhpc3RpbmcgdGhpc1xuXG4gICAgICAgIEBhbmltYXRpb25zLnBsYXkoJ2Rvd24nKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG5cblxuICAgIHVwZGF0ZTogKCk9PlxuICAgICAgICBAZm9sbG93KEBwbGF5ZXIpXG4gICAgICAgIEB1cGRhdGVGYWNpbmcoKVxuXG4gICAgdXBkYXRlRmFjaW5nOiAoKS0+XG4gICAgICAgIGggPSBpZiBAYm9keS52ZWxvY2l0eS54IDwgMCB0aGVuICdsZWZ0JyBlbHNlICdyaWdodCdcbiAgICAgICAgdiA9IGlmIEBib2R5LnZlbG9jaXR5LnkgPCAwIHRoZW4gJ3VwJyBlbHNlICdkb3duJ1xuICAgICAgICBkaXIgPSBpZiBNYXRoLmFicyhAYm9keS52ZWxvY2l0eS54KSA+IE1hdGguYWJzKEBib2R5LnZlbG9jaXR5LnkpIHRoZW4gaCBlbHNlIHZcbiAgICAgICAgQGFuaW1hdGlvbnMucGxheShkaXIpXG5cbiAgICBuZXdEaXJlY3Rpb246ICgpLT5cbiAgICAgICAgZGlyZWN0aW9uID0gQGdhbWUucmFuZC5waWNrIFsndXAnLCAnZG93bicsICdsZWZ0JywgJ3JpZ2h0J11cbiAgICAgICAgY29uc29sZS5sb2cgZGlyZWN0aW9uXG4gICAgICAgIHJldHVybiBkaXJlY3Rpb25cblxuICAgIGZvbGxvdzogKHRhcmdldCktPlxuICAgICAgICAjIENhbGN1bGF0ZSBkaXN0YW5jZSB0byB0YXJnZXRcbiAgICAgICAgZGlzdGFuY2UgPSBAZ2FtZS5tYXRoLmRpc3RhbmNlKEB4LCBAeSwgdGFyZ2V0LngsIHRhcmdldC55KVxuXG4gICAgICAgICMgSWYgdGhlIGRpc3RhbmNlID4gTUlOX0RJU1RBTkNFIHRoZW4gbW92ZVxuICAgICAgICBpZiAoZGlzdGFuY2UgPiBATUlOX0RJU1RBTkNFKVxuICAgICAgICAgICAgIyBDYWxjdWxhdGUgdGhlIGFuZ2xlIHRvIHRoZSB0YXJnZXRcbiAgICAgICAgICAgIGFuZ2xlVG9UYXJnZXQgPSBAZ2FtZS5tYXRoLmFuZ2xlQmV0d2VlbihAeCwgQHksIHRhcmdldC54LCB0YXJnZXQueSlcblxuICAgICAgICAgICAgIyBDYWxjdWxhdGUgdmVsb2NpdHkgdmVjdG9yIGJhc2VkIG9uIGFuZ2xlVG9UYXJnZXQgYW5kIEBNQVhfU1BFRURcbiAgICAgICAgICAgIEBib2R5LnZlbG9jaXR5LnggPSBNYXRoLmNvcyhhbmdsZVRvVGFyZ2V0KSAqIEBNQVhfU1BFRURcbiAgICAgICAgICAgIEBib2R5LnZlbG9jaXR5LnkgPSBNYXRoLnNpbihhbmdsZVRvVGFyZ2V0KSAqIEBNQVhfU1BFRURcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGJvZHkudmVsb2NpdHkuc2V0VG8oMCwgMClcbiIsImNsYXNzIGV4cG9ydHMuRnhGbG9hdGluZ1NwYXJrbGVzIGV4dGVuZHMgUGhhc2VyLkdyb3VwXG5cbiAgICBNQVhfQVNURVJPSURTOiAxMDBcbiAgICBzcGF3blRpbWVyOiAwXG5cbiAgICBjb25zdHJ1Y3RvcjogKEBnYW1lKS0+XG5cbiAgICAgICAgIyBDYWxsIHRoZSBncm91cCBjb25zdHJ1Y3RvclxuICAgICAgICBzdXBlciBAZ2FtZVxuXG4gICAgICAgICMgQ3JlYXRlIGEgcG9vbCBvZiBhc3Rlcm9pZHNcbiAgICAgICAgIyBAYXN0ZXJvaWRHcm91cCA9IEBnYW1lLmFkZC5ncm91cCgpXG4gICAgICAgIEBlbmFibGVCb2R5ID0gdHJ1ZVxuICAgICAgICBAcGh5c2ljc0JvZHlUeXBlID0gUGhhc2VyLlBoeXNpY3MuQVJDQURFXG4gICAgICAgIEBjcmVhdGVNdWx0aXBsZShATUFYX0FTVEVST0lEUywgJ3BhcnRpY2xlJywgMClcblxuICAgICAgICAjIENyZWF0ZSBhIHRpbWVyIGZvciBzcGF3bmluZyBhIG5ldyBhc3Rlcm9pZFxuICAgICAgICBAc3Bhd25UaW1lciA9IDBcblxuICAgICAgICAjIGFkZCBvdXJzZWx2ZXMgdG8gdGhlIGdhbWUgc3RhdGVcbiAgICAgICAgIyBnYW1lLmFkZC5leGlzdGluZyB0aGlzXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcblxuXG4gICAgdXBkYXRlOiAoKS0+XG4gICAgICAgICMgU3Bhd24gYSBuZXcgYXN0ZXJvaWRcbiAgICAgICAgQHNwYXduVGltZXIgLT0gQGdhbWUudGltZS5lbGFwc2VkXG4gICAgICAgIGlmIChAc3Bhd25UaW1lciA8PSAwKVxuICAgICAgICAgICAgQHNwYXduVGltZXIgPSBAZ2FtZS5ybmQuaW50ZWdlckluUmFuZ2UoNSwgNTApXG4gICAgICAgICAgICBAY3JlYXRlTmV3QXN0ZXJvaWQoKVxuXG5cbiAgICBjcmVhdGVOZXdBc3Rlcm9pZDogKCkgLT5cbiAgICAgICAgYXN0ZXJvaWQgPSBAZ2V0Rmlyc3REZWFkKCkgIyBSZWN5Y2xlIGEgZGVhZCBhc3Rlcm9pZFxuXG4gICAgICAgIGlmIChhc3Rlcm9pZClcbiAgICAgICAgICAgIGR4ID0gMFxuICAgICAgICAgICAgZHkgPSAwXG4gICAgICAgICAgICBzbG93ID0gMTBcbiAgICAgICAgICAgIGZhc3QgPSA1MFxuICAgICAgICAgICAgd2hpbGUgKGR4IDwgc2xvdyAmJiBkeCA+IC1zbG93ICYmIGR5IDwgc2xvdyAmJiBkeSA+IC1zbG93KVxuICAgICAgICAgICAgICAgIGR4ID0gQGdhbWUucm5kLmJldHdlZW4oLWZhc3QsIGZhc3QpXG4gICAgICAgICAgICAgICAgZHkgPSBAZ2FtZS5ybmQuYmV0d2VlbigtZmFzdCwgZmFzdClcblxuICAgICAgICAgICAgc3ggPSBpZiBkeCA+IDAgdGhlbiAwIGVsc2UgQGdhbWUud29ybGQud2lkdGhcbiAgICAgICAgICAgIHN5ID0gaWYgZHkgPiAwIHRoZW4gMCBlbHNlIEBnYW1lLndvcmxkLmhlaWdodFxuXG4gICAgICAgICAgICBkaXJlY3Rpb24gPSBAZ2FtZS5ybmQucGljayhbJ2gnLCAndiddKVxuICAgICAgICAgICAgc3ggPSBpZiBkaXJlY3Rpb24gPT0gJ2gnIHRoZW4gQGdhbWUucm5kLmJldHdlZW4oMCwgQGdhbWUud29ybGQud2lkdGgpIGVsc2Ugc3hcbiAgICAgICAgICAgIHN5ID0gaWYgZGlyZWN0aW9uID09ICd2JyB0aGVuIEBnYW1lLnJuZC5iZXR3ZWVuKDAsIEBnYW1lLndvcmxkLmhlaWdodCkgZWxzZSBzeVxuXG4gICAgICAgICAgICAjIGFzdGVyb2lkLnJlc2V0KEBnYW1lLndvcmxkLndpZHRoICsgMTAwLCBAZ2FtZS53b3JsZC5oZWlnaHQgLSA0OCkgIyBQb3NpdGlvbiBvbiBncm91bmRcbiAgICAgICAgICAgIGFzdGVyb2lkLnJlc2V0KHN4LCBzeSkgIyBQb3NpdGlvbiBvbiBncm91bmRcbiAgICAgICAgICAgIGFzdGVyb2lkLnJldml2ZSgpICMgU2V0IFwiYWxpdmVcIlxuXG4gICAgICAgICAgICAjIHNldCBhIHJhbmRvbSBzY2FsZSBhbmQgYWxwaGFcbiAgICAgICAgICAgIGRlcHRoID0gQGdhbWUucm5kLnJlYWxJblJhbmdlKDAuMSwgMC44KVxuICAgICAgICAgICAgIyBhc3Rlcm9pZC5zY2FsZSA9IGRlcHRoXG4gICAgICAgICAgICBhc3Rlcm9pZC5hbHBoYSA9IGRlcHRoXG5cbiAgICAgICAgICAgIGFzdGVyb2lkLmJvZHkudmVsb2NpdHkuc2V0VG8oMCwgMCkgIyBTdG9wIG1vdmluZ1xuICAgICAgICAgICAgYXN0ZXJvaWQuYm9keS5hY2NlbGVyYXRpb24uc2V0VG8oMCwgMCkgIyBTdG9wIGFjY2VsZXJhdGluZ1xuXG4gICAgICAgICAgICAjIFNldCBpbml0aWFsIG1vdmVtZW50XG4gICAgICAgICAgICBhc3Rlcm9pZC5ib2R5LnZlbG9jaXR5LnggPSBkeFxuICAgICAgICAgICAgYXN0ZXJvaWQuYm9keS52ZWxvY2l0eS55ID0gZHlcblxuICAgICAgICAgICAgIyBTZXQgcmFuZG9tIHJvdGF0aW9uXG4gICAgICAgICAgICBhc3Rlcm9pZC5yb3RhdGlvbiA9IFBoYXNlci5NYXRoLmRlZ1RvUmFkKEBnYW1lLnJuZC5hbmdsZSgpKSAjIFJlc2V0IHJvdGF0aW9uXG5cbiAgICAgICAgICAgICMgU2V0IGFuaW1hdGlvbiBmcmFtZSB0byAwXG4gICAgICAgICAgICBhc3Rlcm9pZC5mcmFtZSA9IDBcblxuICAgICAgICAgICAgIyBDZW50ZXIgc3ByaXRlXG4gICAgICAgICAgICBhc3Rlcm9pZC5hbmNob3Iuc2V0VG8oMC41LCAwLjUpXG5cbiAgICAgICAgICAgICMgQXN0ZXJvaWRzIHNob3VsZCBraWxsIHRoZW1zZWx2ZXMgd2hlbiB0aGV5IGxlYXZlIHRoZSB3b3JsZC5cbiAgICAgICAgICAgICMgUGhhc2VyIHRha2VzIGNhcmUgb2YgdGhpcyBmb3IgbWUgYnkgc2V0dGluZyB0aGlzIGZsYWdcbiAgICAgICAgICAgICMgYnV0IHlvdSBjYW4gZG8gaXQgeW91cnNlbGYgYnkga2lsbGluZyB0aGUgYXN0ZXJvaWQgaWZcbiAgICAgICAgICAgICMgaXRzIHgseSBjb29yZGluYXRlcyBhcmUgb3V0c2lkZSBvZiB0aGUgd29ybGQuXG4gICAgICAgICAgICBhc3Rlcm9pZC5jaGVja1dvcmxkQm91bmRzID0gdHJ1ZVxuICAgICAgICAgICAgYXN0ZXJvaWQub3V0T2ZCb3VuZHNLaWxsID0gdHJ1ZVxuIiwiY2xhc3MgZXhwb3J0cy5KdWljZVxuXG4gICAgY29uc3RydWN0b3I6IChAZ2FtZSktPlxuXG4gICAgICAgIEBkZWZhdWx0U291bmRWb2x1bWUgPSAxXG5cbiAgICAgICAgIyBBZGQgc291bmRzXG4gICAgICAgIEBzbmRUaWxlID0gZ2FtZS5hZGQuc291bmQoJ3NuZFRpbGUnLCBAZGVmYXVsdFNvdW5kVm9sdW1lKVxuICAgICAgICBAc25kVGlsZS5hbGxvd011bHRpcGxlID0gdHJ1ZVxuXG4gICAgICAgIEBzbmRNaXNzaWxlID0gZ2FtZS5hZGQuc291bmQoJ3NuZE1pc3NpbGUnLCBAZGVmYXVsdFNvdW5kVm9sdW1lKVxuICAgICAgICBAc25kTWlzc2lsZS5hbGxvd011bHRpcGxlID0gdHJ1ZVxuXG4gICAgICAgIEBzbmRUZWxlcG9ydCA9IGdhbWUuYWRkLnNvdW5kKCdzbmRUZWxlcG9ydCcsIEBkZWZhdWx0U291bmRWb2x1bWUpXG4gICAgICAgIEBzbmRUZWxlcG9ydC5hbGxvd011bHRpcGxlID0gdHJ1ZVxuXG5cbiAgICAgICAgIyBwYXJ0aWNsZXNcbiAgICAgICAgQGVtaXR0ZXIgPSBnYW1lLmFkZC5lbWl0dGVyKDAsIDAsIDEwMDApXG5cbiAgICAgICAgQGVtaXR0ZXIubWFrZVBhcnRpY2xlcygncGFydGljbGUnKVxuICAgICAgICBAZW1pdHRlci5ncmF2aXR5ID0gMzAwXG5cblxuICAgICAgICByZXR1cm4gdGhpc1xuXG5cbiAgICBzaGFrZTogKCktPlxuICAgICAgICBAZ2FtZS5hZGQudHdlZW4oQGdhbWUuY2FtZXJhKVxuICAgICAgICAgICAgLmZyb20oeyB5OiBAZ2FtZS5jYW1lcmEueSAtIDUgfSwgNTAsIFBoYXNlci5FYXNpbmcuU2ludXNvaWRhbC5Jbk91dCwgZmFsc2UsIDAsIDQsIHRydWUpXG4gICAgICAgICAgICAuc3RhcnQoKVxuICAgICAgICAjIGNvbnNvbGUubG9nICdzaGFrZSBzaGFrZSEnXG5cbiAgICBzcGxvZGU6ICh4LCB5KS0+XG4gICAgICAgICMgIFBvc2l0aW9uIHRoZSBlbWl0dGVyIHdoZXJlIHRoZSBtb3VzZS90b3VjaCBldmVudCB3YXNcbiAgICAgICAgQGVtaXR0ZXIueCA9IHhcbiAgICAgICAgQGVtaXR0ZXIueSA9IHlcblxuICAgICAgICAjICBUaGUgZmlyc3QgcGFyYW1ldGVyIHNldHMgdGhlIGVmZmVjdCB0byBcImV4cGxvZGVcIiB3aGljaCBtZWFucyBhbGwgcGFydGljbGVzIGFyZSBlbWl0dGVkIGF0IG9uY2VcbiAgICAgICAgIyAgVGhlIHNlY29uZCBnaXZlcyBlYWNoIHBhcnRpY2xlIGEgMjAwMG1zIGxpZmVzcGFuXG4gICAgICAgICMgIFRoZSB0aGlyZCBpcyBpZ25vcmVkIHdoZW4gdXNpbmcgYnVyc3QvZXhwbG9kZSBtb2RlXG4gICAgICAgICMgIFRoZSBmaW5hbCBwYXJhbWV0ZXIgKDEwKSBpcyBob3cgbWFueSBwYXJ0aWNsZXMgd2lsbCBiZSBlbWl0dGVkIGluIHRoaXMgc2luZ2xlIGJ1cnN0XG4gICAgICAgIEBlbWl0dGVyLnN0YXJ0KHRydWUsIDI1MCwgbnVsbCwgNSlcblxuICAgIHBldzogKCkgLT5cbiAgICAgICAgQHNuZE1pc3NpbGUucGxheSgpXG5cbiAgICBmb29zaDogKHgxLCB5MSwgeDIsIHkyKS0+XG4gICAgICAgIEBzbmRUZWxlcG9ydC5wbGF5KClcbiAgICAgICAgQHNwbG9kZSB4MSwgeTFcbiAgICAgICAgQHNwbG9kZSB4MiwgeTJcblxuICAgIHBsb3A6ICh4LCB5KS0+XG4gICAgICAgICMgcGxheSBhIG5ldyBwbG9wIHNvdW5kXG4gICAgICAgICMgc25kVGlsZSA9IGdhbWUuYWRkLnNvdW5kKCdzbmRUaWxlJywgQGRlZmF1bHRTb3VuZFZvbHVtZSlcbiAgICAgICAgQHNuZFRpbGUucGxheSgpXG5cbiAgICAgICAgQHNwbG9kZSB4LCB5XG5cbiAgICBwb3BUZXh0OiAoeCwgeSwgbXNnKS0+XG4gICAgICAgIHRleHQgPSBAZ2FtZS5hZGQudGV4dCB4LCB5LCBtc2csIHtmaWxsOiAnd2hpdGUnLCBmb250OiAnQm9sZCAxMXB0IEFyaWFsJ31cbiAgICAgICAgQGdhbWUuYWRkLnR3ZWVuIHRleHRcbiAgICAgICAgICAgIC50byh7IHk6IHRleHQueSAtIDMyIH0sIDUwMCwgIFBoYXNlci5FYXNpbmcuUXVhZHJhdGljLk91dCwgdHJ1ZSlcbiAgICAgICAgICAgIC5vbkNvbXBsZXRlLmFkZChcbiAgICAgICAgICAgICAgICAoKS0+XG4gICAgICAgICAgICAgICAgICAgIEBkZXN0cm95KClcbiAgICAgICAgICAgICAgICAsIHRleHQpXG5cbiIsIkp1aWNlID0gcmVxdWlyZShcIi4vSnVpY2VcIikuSnVpY2VcbkZ4RmxvYXRpbmdTcGFya2xlcyA9IHJlcXVpcmUoXCIuL0Z4RmxvYXRpbmdTcGFya2xlc1wiKS5GeEZsb2F0aW5nU3BhcmtsZXNcblxuUGxheWVyID0gcmVxdWlyZShcIi4vUGxheWVyXCIpLlBsYXllclxuQnVpbGRpbmcgPSByZXF1aXJlKFwiLi9CdWlsZGluZ1wiKS5CdWlsZGluZ1xuXG5FbmVteSA9IHJlcXVpcmUoXCIuL0VuZW15XCIpLkVuZW15XG5cbndpbmRvdy5vbmxvYWQgPSAoKS0+XG5cbiAgICAjIE9uIHdpbmRvdyBsb2FkLCBjcmVhdGUgdGhlIFBoYXNlciBnYW1lIG9iamVjdCxcbiAgICAjICBhbmQgbG9hZCBnYW1lc3RhdGUgYXMgdGhlIGluaXRpYWwgc3RhdGVcbiAgICB3aW5kb3cuZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZSg2NDAsIDY0MCwgUGhhc2VyLkNBTlZBUywgJ2dhbWUtY29udGFpbmVyJywgZ2FtZXN0YXRlKVxuXG5nYW1lc3RhdGUgPVxuICAgIHByZWxvYWQ6ICgpLT5cbiAgICAgICAgIyBMb2FkIHVzIHNvbWUgYXNzZXRzXG4gICAgICAgICMgZ2FtZS5sb2FkLmltYWdlICdwbGF5ZXInLCAnYXNzZXRzL2ltZy9wbGF5ZXIucG5nJ1xuICAgICAgICBnYW1lLmxvYWQuaW1hZ2UgJ3RpbGVTZWxlY3QnLCAnYXNzZXRzL2ltZy9zdGFyMS5wbmcnXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZSAnc3RhcjInLCAnYXNzZXRzL2ltZy9zdGFyMi5wbmcnXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZSAnbWlzc2lsZScsICdhc3NldHMvaW1nL3N0YXIzLnBuZydcbiAgICAgICAgZ2FtZS5sb2FkLmltYWdlICdwYXJ0aWNsZScsICdhc3NldHMvaW1nL2ZsYXNoLnBuZydcblxuICAgICAgICAjIGxvYWQgc29tZSBidWlsZGluZyBzcHJpdGVzXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZSAnYnVpbGRpbmdUZXN0JywgJ2Fzc2V0cy9pbWcvYnVpbGRpbmdUZXN0LnBuZydcblxuICAgICAgICAjIGxvYWQgdGhlIHBsYXllciBzcHJpdGVzaGVldFxuICAgICAgICBnYW1lLmxvYWQuc3ByaXRlc2hlZXQgJ3BsYXllcicsICdhc3NldHMvaW1nL3BsYXllci5wbmcnLCAzMiwgMzJcblxuICAgICAgICAjIGxvYWQgYW4gZW5lbXkgc3ByaXRlc2hlZXRcbiAgICAgICAgZ2FtZS5sb2FkLnNwcml0ZXNoZWV0ICdlbmVteScsICdhc3NldHMvaW1nL2VuZW15LnBuZycsIDY0LCA2NFxuXG4gICAgICAgICMgTG9hZCB0aWxlc1xuICAgICAgICBnYW1lLmxvYWQuaW1hZ2UgJ3RpbGVzJywgJ2Fzc2V0cy9pbWcvdGlsZXMucG5nJ1xuXG4gICAgICAgICMgbG9hZCBzb21lIHNvdW5kc1xuICAgICAgICBnYW1lLmxvYWQuYXVkaW8oJ3NuZE1pc3NpbGUnLCAnYXNzZXRzL3NuZC9zdGVhbS5vZ2cnKVxuICAgICAgICBnYW1lLmxvYWQuYXVkaW8oJ3NuZFRlbGVwb3J0JywgJ2Fzc2V0cy9zbmQvY2xvdGgyLm9nZycpXG4gICAgICAgICMgZ2FtZS5sb2FkLmF1ZGlvKCdzbmRUaWxlJywgJ2Fzc2V0cy9zbmQvcm9sbG92ZXIxLndhdicpXG4gICAgICAgICMgZ2FtZS5sb2FkLmF1ZGlvKCdzbmRUaWxlJywgJ2Fzc2V0cy9zbmQvcm9sbG92ZXIyLndhdicpXG4gICAgICAgICMgZ2FtZS5sb2FkLmF1ZGlvKCdzbmRUaWxlJywgJ2Fzc2V0cy9zbmQvcm9sbG92ZXIzLndhdicpXG4gICAgICAgICMgZ2FtZS5sb2FkLmF1ZGlvKCdzbmRUaWxlJywgJ2Fzc2V0cy9zbmQvcm9sbG92ZXI0LndhdicpXG4gICAgICAgICMgZ2FtZS5sb2FkLmF1ZGlvKCdzbmRUaWxlJywgJ2Fzc2V0cy9zbmQvcm9sbG92ZXI1LndhdicpXG4gICAgICAgIGdhbWUubG9hZC5hdWRpbygnc25kVGlsZScsICdhc3NldHMvc25kL3JvbGxvdmVyNi53YXYnKVxuXG5cbiAgICBjcmVhdGU6ICgpLT5cbiAgICAgICAgIyAjIEFkZCBhIEhlbGxvIFdvcmxkIG1lc3NhZ2VcbiAgICAgICAgIyBmb28gPSBnYW1lLmFkZC50ZXh0IDEwLCAxMCwgXCJIZWxsbyBXb3JsZFwiLCB7ZmlsbDogJ3doaXRlJ31cblxuICAgICAgICAjIEFkZCBhIHJlZ2lzdHJ5IG9iamVjdCB0byB0aGUgZ2FtZSBzY29wZSB0byBrZWVwIHRyYWNrIG9mIHNvbWUgZ2xvYmFsIHJlZmVyZW5jZXNcbiAgICAgICAgQGdhbWUucmVnID0ge31cblxuICAgICAgICAjIEFkZCBhIHNob3J0Y3V0IHRvIHRoZSBnYW1lIHVpIChUT0RPOiBtYWtlIGl0IGEgY2xhc3MgZXh0ZW5kaW5nIGdyb3VwKVxuICAgICAgICBAZ2FtZS51aSA9IHt9XG5cbiAgICAgICAgQGNyZWF0ZVN0b2NrcGlsZSgpXG4gICAgICAgIEBjcmVhdGVOZXh0VHVyblNpZ25hbCgpXG5cbiAgICAgICAgIyBDcmVhdGUgZmxvYXRpbmcgc3BhcmtsZXMgYmFja2dyb3VuZCBlZmZlY3RcbiAgICAgICAgQHNwYXJrbGVzID0gbmV3IEZ4RmxvYXRpbmdTcGFya2xlcyhnYW1lKVxuXG4gICAgICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICAgICAjICBDcmVhdGVzIGEgYmxhbmsgdGlsZW1hcFxuICAgICAgICBAbWFwID0gZ2FtZS5hZGQudGlsZW1hcCgpXG5cbiAgICAgICAgIyAgQWRkIGEgVGlsZXNldCBpbWFnZSB0byB0aGUgbWFwXG4gICAgICAgIEBtYXAuYWRkVGlsZXNldEltYWdlKCd0aWxlcycpXG5cbiAgICAgICAgIyBpbmNyZWFzZSB0aGUgdGlsZW1hcCBiaWFzIGluIHRoZSBwaHlzaWNzIHN5c3RlbSB0byBwcmV2ZW50IGNsaXBwaW5nIGludG8gdGlsZXNcbiAgICAgICAgIyBnYW1lLnBoeXNpY3MuYXJjYWRlLlRJTEVfQklBUyA9IDY0XG5cbiAgICAgICAgTUFQX1dJRFRIID0gNDBcbiAgICAgICAgTUFQX0hFSUdIVCA9IDMwXG5cbiAgICAgICAgIyAgQ3JlYXRlcyBhIG5ldyBibGFuayBsYXllciBhbmQgc2V0cyB0aGUgbWFwIGRpbWVuc2lvbnMuXG4gICAgICAgICMgIEluIHRoaXMgY2FzZSB0aGUgbWFwIGlzIDQweDMwIHRpbGVzIGluIHNpemUgYW5kIHRoZSB0aWxlcyBhcmUgMzJ4MzIgcGl4ZWxzIGluIHNpemUuXG4gICAgICAgIGxheWVyMSA9IEBtYXAuY3JlYXRlKCdsZXZlbDEnLCBNQVBfV0lEVEgsIE1BUF9IRUlHSFQsIDMyLCAzMilcbiAgICAgICAgIyBsYXllcjEuc2Nyb2xsRmFjdG9yWCA9IDAuNVxuICAgICAgICAjIGxheWVyMS5zY3JvbGxGYWN0b3JZID0gMC41XG5cbiAgICAgICAgIyAgUmVzaXplIHRoZSB3b3JsZFxuICAgICAgICBsYXllcjEucmVzaXplV29ybGQoKVxuXG4gICAgICAgICMgbGF5ZXIxLmRlYnVnID0gdHJ1ZVxuXG4gICAgICAgIEBjdXJyZW50TGF5ZXIgPSBsYXllcjFcbiAgICAgICAgQGN1cnJlbnRUaWxlID0gN1xuXG4gICAgICAgICMgQG1hcC5wdXRUaWxlKEBjdXJyZW50VGlsZSwgMCwgMCwgQGN1cnJlbnRMYXllcilcbiAgICAgICAgQG1hcC5maWxsKEBjdXJyZW50VGlsZSwgMCwgMCwgTUFQX1dJRFRILCBNQVBfSEVJR0hULCBAY3VycmVudExheWVyKVxuXG4gICAgICAgICMgbWFrZSBhIGxpdHRsZSBpc2xhbmRcbiAgICAgICAgQGN1cnJlbnRUaWxlID0gMFxuICAgICAgICBAbWFwLmZpbGwoQGN1cnJlbnRUaWxlLCAxMCwgMTAsIDE4LCAxMCwgQGN1cnJlbnRMYXllcilcblxuXG4gICAgICAgIEBnYW1lLmN1cnJlbnRMZXZlbCA9IHtcbiAgICAgICAgICAgIHRpbGVtYXA6IEBtYXAsXG4gICAgICAgICAgICBjdXJyZW50TGF5ZXI6IEBjdXJyZW50TGF5ZXIsXG4gICAgICAgIH1cblxuICAgICAgICAjIHNldCBjb2xsaXNpb24gb24gdGhlIHRpbGVtYXBcbiAgICAgICAgIyB0aGlzIGlzIGRvbmUgYWZ0ZXIgZ2VuZXJhdGluZyB0aGUgbWFwIHNvIHRoYXQgY29sbGlzaW9uIHdpbGwgdXBkYXRlIHByb3Blcmx5XG4gICAgICAgICMgdGhlIGZpbGwgY29tbWFuZCBkb2Vzbid0IHNlZW0gdG8gdXBkYXRlIHRoZSBjb2xsaXNpb24gYm94ZXNcbiAgICAgICAgQG1hcC5zZXRDb2xsaXNpb24oWyA3IF0sIHRydWUsICdsZXZlbDEnKVxuXG4gICAgICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5cbiAgICAgICAgIyBDcmVhdGUgYSBwbGF5ZXIgb2JqZWN0XG4gICAgICAgIEBwbGF5ZXIgPSBuZXcgUGxheWVyKGdhbWUpXG5cbiAgICAgICAgIyBDcmVhdGUgYW4gZW5lbXkgb2JqZWN0XG4gICAgICAgIEBlbmVteSA9IG5ldyBFbmVteShnYW1lLCBAcGxheWVyKVxuXG5cbiAgICAgICAgIyBIYXZlIHRoZSBjYW1lcmEgZm9sbG93IHRoZSBwbGF5ZXJcbiAgICAgICAgQGdhbWUuY2FtZXJhLmZvbGxvdyBAcGxheWVyLCBQaGFzZXIuQ2FtZXJhLkZPTExPV19UT1BET1dOX1RJR0hUXG5cbiAgICAgICAgIyBhZGQgdXMgYSBqdWljZVxuICAgICAgICBAZ2FtZS5qdWljZSA9IG5ldyBKdWljZShAZ2FtZSlcblxuICAgICAgICAjIGFkZCBuZXh0IHR1cm4ga2V5XG4gICAgICAgIEBnYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuRU5URVIpLm9uVXAuYWRkKFxuICAgICAgICAgICAgKCktPlxuICAgICAgICAgICAgICAgICMgY29uc29sZS5sb2cgJ2tleSBjYWxsYmFjayBjb250ZXh0OiAgJ1xuICAgICAgICAgICAgICAgICMgY29uc29sZS5sb2cgQFxuICAgICAgICAgICAgICAgIEBnYW1lLm9uTmV4dFR1cm4uZGlzcGF0Y2goKVxuICAgICAgICApXG5cbiAgICAgICAgIyBhZGQgc29ydCBrZXlcbiAgICAgICAgQGdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5aKS5vblVwLmFkZChcbiAgICAgICAgICAgICgpLT5cbiAgICAgICAgICAgICAgICAjIGNvbnNvbGUubG9nICdrZXkgY2FsbGJhY2sgY29udGV4dDogICdcbiAgICAgICAgICAgICAgICAjIGNvbnNvbGUubG9nIEBcbiAgICAgICAgICAgICAgICBAZ2FtZS53b3JsZC5zb3J0KCd5JylcbiAgICAgICAgKVxuXG4gICAgICAgICMgYWRkIGEgdWkgZ3JvdXAgb24gdG9wIG9mIGV2ZXJ5dGhpbmdcbiAgICAgICAgQGdhbWUudWkuZ3JvdXAgPSBAZ2FtZS5hZGQuZ3JvdXAoKVxuICAgICAgICBAZ2FtZS51aS5ncm91cC5maXhlZFRvQ2FtZXJhID0gdHJ1ZVxuICAgICAgICBAZ2FtZS51aS50b29sdGlwID0gQGdhbWUuYWRkLnRleHQoMCwgMCwgJycsIHtmaWxsOiAnd2hpdGUnLCBmb250OiAnMTFwdCBBcmlhbCd9KVxuICAgICAgICBAZ2FtZS51aS50b29sdGlwLnRhcmdldCA9IG51bGxcblxuICAgICAgICAjIFNob3cgRGVidWcgU3RhdHVzIHRleHRcbiAgICAgICAgQGdhbWUudGltZS5hZHZhbmNlZFRpbWluZyA9IHRydWVcbiAgICAgICAgQHN0YXR1c1RleHQgPSBAZ2FtZS5hZGQudGV4dChcbiAgICAgICAgICAgIDIwLCAyMCwgJycsIHsgZm9udDogJzE2cHggQXJpYWwnLCBmaWxsOiAnI2ZmZmZmZicgfVxuICAgICAgICApXG4gICAgICAgIEBzdGF0dXNUZXh0LmZpeGVkVG9DYW1lcmEgPSB0cnVlXG5cblxuICAgIHVwZGF0ZTogKCktPlxuICAgICAgICBAZ2FtZS5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKEBwbGF5ZXIsIEBjdXJyZW50TGF5ZXIpXG5cbiAgICAgICAgIyB1cGRhdGUgc3RhdHVzIHRleHRcbiAgICAgICAgQHN0YXR1c1RleHQuc2V0VGV4dChAZ2V0U3RhdHVzVGV4dCgpKVxuXG5cbiAgICBnZXRTdGF0dXNUZXh0OiAoKS0+XG4gICAgICAgIHN0YXR1cyA9ICcnXG4gICAgICAgIHN0YXR1cyArPSBAZ2FtZS50aW1lLmZwcyArICcgRlBTJyArICdcXG4nXG4gICAgICAgIHN0YXR1cyArPSAnXFxuJ1xuICAgICAgICBzdGF0dXMgKz0gJ1RPT0w6ICcgKyBAcGxheWVyLnRvb2wubmFtZSArICdcXG4nXG4gICAgICAgIHN0YXR1cyArPSBAcGxheWVyLnRvb2wuZ2V0U3RhdHVzVGV4dCgpICsgJ1xcbidcbiAgICAgICAgc3RhdHVzICs9ICdcXG4nXG4gICAgICAgIHN0YXR1cyArPSAnU1RPQ0tQSUxFOiBcXG4nXG4gICAgICAgIHN0YXR1cyArPSBAZ2FtZS5yZWcuc3RvY2twaWxlLmdldFN0YXR1c1RleHQoKVxuICAgICAgICByZXR1cm4gc3RhdHVzXG5cblxuICAgIGNyZWF0ZU5leHRUdXJuU2lnbmFsOiAoKS0+XG4gICAgICAgIEBnYW1lLm9uTmV4dFR1cm4gPSBuZXcgUGhhc2VyLlNpZ25hbCgpXG5cblxuICAgIGNyZWF0ZVN0b2NrcGlsZTogKCktPlxuICAgICAgICBAZ2FtZS5yZWcuc3RvY2twaWxlID1cblxuICAgICAgICAgICAgIyBSZXNvdXJjZSBuYW1pbmcgY29uc3RhbnRzXG4gICAgICAgICAgICBBRVI6ICdBZXJlZ2l1bSdcbiAgICAgICAgICAgIERZTjogJ0R5bmFtaXMnXG5cbiAgICAgICAgICAgIHJlc291cmNlczogW1xuICAgICAgICAgICAgICAgIHsgbmFtZTogJ0FlcmVnaXVtJywgYW1vdW50OiAwIH1cbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdEeW5hbWlzJywgYW1vdW50OiAwIH1cbiAgICAgICAgICAgIF1cblxuICAgICAgICAgICAgZ2V0U3RhdHVzVGV4dDogKCktPlxuICAgICAgICAgICAgICAgIHN0YXR1cyA9ICcnXG4gICAgICAgICAgICAgICAgc3RhdHVzICs9IHJlc291cmNlLm5hbWUgKyAnOiAnICsgcmVzb3VyY2UuYW1vdW50ICsgJ1xcbicgZm9yIHJlc291cmNlIGluIEByZXNvdXJjZXNcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdHVzXG5cbiAgICAgICAgICAgIGZpbmQ6IChyZXNvdXJjZSktPlxuICAgICAgICAgICAgICAgIHJldHVybiBfLmZpbmQoQHJlc291cmNlcywgeyBuYW1lOiByZXNvdXJjZSB9KVxuXG4gICAgICAgICAgICBlYXJuOiAocmVzb3VyY2UsIGFtb3VudCktPlxuICAgICAgICAgICAgICAgIHN0b2NrID0gQGZpbmQocmVzb3VyY2UpXG4gICAgICAgICAgICAgICAgaWYgbm90IHN0b2NrXG4gICAgICAgICAgICAgICAgICAgICMgd2UgZG9uJ3QgaGF2ZSB0aGlzIHJlc291cmNlLCBhZGQgYW4gZW50cnkgdG8gdGhlIHN0b2NrcGlsZVxuICAgICAgICAgICAgICAgICAgICBzdG9jayA9IHsgbmFtZTogcmVzb3VyY2UsIGFtb3VudDogMCAgfVxuICAgICAgICAgICAgICAgICAgICBAcmVzb3VyY2VzLnB1c2goc3RvY2spXG4gICAgICAgICAgICAgICAgIyBhZGQgc29tZSBvZiB0aGlzIHJlc291cmNlIHRvIG91ciBzdG9ja3NcbiAgICAgICAgICAgICAgICBzdG9jay5hbW91bnQgKz0gYW1vdW50XG5cbiAgICAgICAgICAgIGNhbkFmZm9yZDogKHJlc291cmNlLCBhbW91bnQpLT5cbiAgICAgICAgICAgICAgICBzdG9jayA9IEBmaW5kKHJlc291cmNlKVxuICAgICAgICAgICAgICAgIGlmIG5vdCBzdG9ja1xuICAgICAgICAgICAgICAgICAgICAjIHdlIGRvbid0IGhhdmUgdGhpcyByZXNvdXJjZSBhdCBhbGxcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgICAgIyB3ZSBoYXZlIHRoaXMgcmVzb3VyY2UsIHJldHVybiBpZiB3ZSBoYXZlIGVub3VnaFxuICAgICAgICAgICAgICAgIHJldHVybiBzdG9jay5hbW91bnQgPj0gYW1vdW50XG5cbiAgICAgICAgICAgIHNwZW5kOiAocmVzb3VyY2UsIGFtb3VudCktPlxuICAgICAgICAgICAgICAgIGlmIG5vdCBAY2FuQWZmb3JkKHJlc291cmNlLCBhbW91bnQpXG4gICAgICAgICAgICAgICAgICAgICMgd2UgY2FuJ3QgYWZmb3JkIHRoaXMgLSByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgICAgIyB3ZSBhcmUgYWJsZSB0byBhZmZvcmQgdGhpcyAtIHNwZW5kIGl0XG4gICAgICAgICAgICAgICAgc3RvY2sgPSBAZmluZChyZXNvdXJjZSlcbiAgICAgICAgICAgICAgICBzdG9jay5hbW91bnQgLT0gYW1vdW50XG4gICAgICAgICAgICAgICAgIyB3ZSBzcGVudCB0aGUgcmVzb3VyY2UgLSByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG5cblxuXG4gICAgICAgICMgY29uc29sZS5sb2cgQGdhbWUucmVnLnN0b2NrcGlsZVxuIiwiUGxheWVyQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL1BsYXllckNvbnRyb2xsZXJcIikuUGxheWVyQ29udHJvbGxlclxuXG5Ub29sTWlzc2lsZSA9IHJlcXVpcmUoXCIuL1Rvb2xNaXNzaWxlXCIpLlRvb2xNaXNzaWxlXG5Ub29sVGVycmFpbiA9IHJlcXVpcmUoXCIuL1Rvb2xUZXJyYWluXCIpLlRvb2xUZXJyYWluXG5Ub29sVGVsZXBvcnQgPSByZXF1aXJlKFwiLi9Ub29sVGVsZXBvcnRcIikuVG9vbFRlbGVwb3J0XG5Ub29sQnVpbGQgPSByZXF1aXJlKFwiLi9Ub29sQnVpbGRcIikuVG9vbEJ1aWxkXG5cblxuY2xhc3MgZXhwb3J0cy5QbGF5ZXIgZXh0ZW5kcyBQaGFzZXIuU3ByaXRlXG4gICAgIyBob3cgZmFzdCBjYW4gd2UgbW92ZVxuICAgIHNwZWVkOiAyNTBcblxuICAgIGNvbnN0cnVjdG9yOiAoQGdhbWUpLT5cblxuICAgICAgICAjIFNldCBvdXIgcG9zaXRpb24gdG8gdGhlIHdvcmxkIGNlbnRlclxuICAgICAgICB4ID0gQGdhbWUud29ybGQuY2VudGVyWFxuICAgICAgICB5ID0gQGdhbWUud29ybGQuY2VudGVyWVxuXG4gICAgICAgICMgQ2FsbCB0aGUgc3ByaXRlIGNvbnN0cnVjdG9yXG4gICAgICAgIHN1cGVyIEBnYW1lLCB4LCB5LCAncGxheWVyJ1xuXG4gICAgICAgICMgU2V0IHRoZSBhbmNob3IgdG8gdGhlIGNlbnRlciBvZiB0aGUgc3ByaXRlXG4gICAgICAgIEBhbmNob3Iuc2V0VG8gMC41LCAwLjVcblxuICAgICAgICAjIEFkZCBzb21lIGFuaW1hdGlvbnNcbiAgICAgICAgQGFuaW1hdGlvbnMuYWRkICdpZGxlJywgWzBdXG4gICAgICAgIEBhbmltYXRpb25zLmFkZCAnY2FzdCcsIFsxXVxuXG4gICAgICAgICMgRW5hYmxlIHBoeXNpY3NcbiAgICAgICAgQGdhbWUucGh5c2ljcy5lbmFibGUgQCwgUGhhc2VyLlBoeXNpY3MuQVJDQURFXG5cbiAgICAgICAgIyBBdHRhY2ggYSBjb250cm9sbGVyXG4gICAgICAgIEBjb250cm9sbGVyID0gbmV3IFBsYXllckNvbnRyb2xsZXIgQGdhbWUsIEBcblxuICAgICAgICAjIGFkZCBvdXJzZWx2ZXMgdG8gdGhlIGdhbWUgc3RhdGVcbiAgICAgICAgZ2FtZS5hZGQuZXhpc3RpbmcgdGhpc1xuXG4gICAgICAgICMgIyBjcmVhdGUgdGhlIE1hZ2ljIE1pc3NpbGUgVG9vbFxuICAgICAgICAjIEB0b29sID0gbmV3IFRvb2xNaXNzaWxlIEBnYW1lLCB0aGlzXG5cbiAgICAgICAgIyBjcmVhdGUgdGhlIFRlcnJhaW4gVG9vbFxuICAgICAgICAjIEB0b29sID0gbmV3IFRvb2xUZXJyYWluIEBnYW1lLCB0aGlzXG5cbiAgICAgICAgQHRvb2xzID0gW1xuICAgICAgICAgICAgbmV3IFRvb2xNaXNzaWxlIEBnYW1lLCB0aGlzXG4gICAgICAgICAgICBuZXcgVG9vbFRlbGVwb3J0IEBnYW1lLCB0aGlzXG4gICAgICAgICAgICBuZXcgVG9vbFRlcnJhaW4gQGdhbWUsIHRoaXNcbiAgICAgICAgICAgIG5ldyBUb29sQnVpbGQgQGdhbWUsIHRoaXNcbiAgICAgICAgXVxuICAgICAgICBAbmV4dFRvb2woKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG5cblxuICAgIHVwZGF0ZTogKCk9PlxuXG4gICAgICAgICMgVXBkYXRlIHRoZSBwbGF5ZXIgY29udHJvbGxlclxuICAgICAgICBAY29udHJvbGxlci51cGRhdGUoKVxuXG4gICAgICAgICMgVXBkYXRlIG91ciBUb29sXG4gICAgICAgIGlmIEB0b29sP1xuICAgICAgICAgICAgQHRvb2wudXBkYXRlKClcblxuXG4gICAgbmV4dFRvb2w6ICgpLT5cbiAgICAgICAgIyBjb25zb2xlLmxvZyAnc3dpdGNoaW5nIGZyb20gJyArIGlmIEB0b29sIHRoZW4gQHRvb2wubmFtZSBlbHNlICdub3RoaW5nJ1xuXG4gICAgICAgICMgaGlkZSB0aGUgb2xkIHRvb2xcbiAgICAgICAgaWYgQHRvb2xcbiAgICAgICAgICAgIEB0b29sLnVuc2VsZWN0KClcblxuICAgICAgICAjIGdldCB0aGUgbmV4dCB0b29sIGFuZCByZW1vdmUgaXQgZnJvbSB0aGUgbGlzdFxuICAgICAgICBAdG9vbCA9IEB0b29scy5wb3AoKVxuXG4gICAgICAgICMgc2hvdyB0aGUgbmV3IHRvb2xcbiAgICAgICAgaWYgQHRvb2xcbiAgICAgICAgICAgIEB0b29scy51bnNoaWZ0KEB0b29sKVxuICAgICAgICAgICAgIyByZWFkZCB0aGUgdG9vbCB0byB0aGVmcm9udCBvZiB0aGUgbGlzdFxuICAgICAgICAgICAgQHRvb2wuc2VsZWN0KClcblxuICAgICAgICAjIGNvbnNvbGUubG9nICd0byAnICsgQHRvb2wubmFtZVxuIiwiY2xhc3MgZXhwb3J0cy5QbGF5ZXJDb250cm9sbGVyXG5cbiAgICBrZXlib2FyZF9tb2Rlczoge1xuICAgICAgICBRV0VSVFk6IHtcbiAgICAgICAgICAgIHVwOiBQaGFzZXIuS2V5Ym9hcmQuV1xuICAgICAgICAgICAgZG93bjogUGhhc2VyLktleWJvYXJkLlNcbiAgICAgICAgICAgIGxlZnQ6IFBoYXNlci5LZXlib2FyZC5BXG4gICAgICAgICAgICByaWdodDogUGhhc2VyLktleWJvYXJkLkRcbiAgICAgICAgfVxuICAgICAgICBEVk9SQUs6IHtcbiAgICAgICAgICAgIHVwOiAxODggIyBDb21tYVxuICAgICAgICAgICAgZG93bjogUGhhc2VyLktleWJvYXJkLk9cbiAgICAgICAgICAgIGxlZnQ6IFBoYXNlci5LZXlib2FyZC5BXG4gICAgICAgICAgICByaWdodDogUGhhc2VyLktleWJvYXJkLkVcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgY29uc3RydWN0b3I6IChAZ2FtZSwgQHBsYXllciktPlxuICAgICAgICBAY3Vyc29ycyA9IGdhbWUuaW5wdXQua2V5Ym9hcmQuY3JlYXRlQ3Vyc29yS2V5cygpXG4gICAgICAgIEBzZXRLZXltYXAoXCJRV0VSVFlcIilcblxuICAgICAgICBAZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXlDYXB0dXJlKFtcbiAgICAgICAgICAgIFBoYXNlci5LZXlib2FyZC5MRUZULFxuICAgICAgICAgICAgUGhhc2VyLktleWJvYXJkLlJJR0hULFxuICAgICAgICAgICAgUGhhc2VyLktleWJvYXJkLlVQLFxuICAgICAgICAgICAgUGhhc2VyLktleWJvYXJkLkRPV04sXG4gICAgICAgICAgICBQaGFzZXIuS2V5Ym9hcmQuVyxcbiAgICAgICAgICAgIFBoYXNlci5LZXlib2FyZC5TLFxuICAgICAgICAgICAgUGhhc2VyLktleWJvYXJkLkEsXG4gICAgICAgICAgICBQaGFzZXIuS2V5Ym9hcmQuRCxcbiAgICAgICAgICAgIFBoYXNlci5LZXlib2FyZC5RLFxuICAgICAgICAgICAgUGhhc2VyLktleWJvYXJkLkUsXG4gICAgICAgICAgICBQaGFzZXIuS2V5Ym9hcmQuU1BBQ0VCQVIsXG4gICAgICAgICAgICBQaGFzZXIuS2V5Ym9hcmQuRU5URVIsXG4gICAgICAgIF0pO1xuXG4gICAgc2V0S2V5bWFwOiAobW9kZSk9PlxuICAgICAgICBpZiBAa2V5Ym9hcmRfbW9kZXNbbW9kZV0/XG4gICAgICAgICAgICBAa2V5Ym9hcmRfbW9kZSA9IEBrZXlib2FyZF9tb2Rlc1ttb2RlXVxuXG4gICAgdXBkYXRlOiAoKS0+XG5cbiAgICAgICAgIyBSZXNldCB0aGUgcGxheWVyJ3MgdmVsb2NpdHlcbiAgICAgICAgQHBsYXllci5ib2R5LnZlbG9jaXR5LnggPSAwXG4gICAgICAgIEBwbGF5ZXIuYm9keS52ZWxvY2l0eS55ID0gMFxuXG4gICAgICAgICMgU2V0IGxlZnQgb3IgcmlnaHQgdmVsb2NpdHlcbiAgICAgICAgaWYgQGN1cnNvcnMubGVmdC5pc0Rvd24gb3IgQGdhbWUuaW5wdXQua2V5Ym9hcmQuaXNEb3duKEBrZXlib2FyZF9tb2RlLmxlZnQpXG4gICAgICAgICAgICBAcGxheWVyLmJvZHkudmVsb2NpdHkueCA9IC0xICogQHBsYXllci5zcGVlZFxuICAgICAgICBlbHNlIGlmIEBjdXJzb3JzLnJpZ2h0LmlzRG93biBvciBAZ2FtZS5pbnB1dC5rZXlib2FyZC5pc0Rvd24oQGtleWJvYXJkX21vZGUucmlnaHQpXG4gICAgICAgICAgICBAcGxheWVyLmJvZHkudmVsb2NpdHkueCA9IEBwbGF5ZXIuc3BlZWRcblxuICAgICAgICAjIFNldCB1cCBvciBkb3duIHZlbG9jaXR5XG4gICAgICAgIGlmIEBjdXJzb3JzLnVwLmlzRG93biBvciBAZ2FtZS5pbnB1dC5rZXlib2FyZC5pc0Rvd24oQGtleWJvYXJkX21vZGUudXApXG4gICAgICAgICAgICBAcGxheWVyLmJvZHkudmVsb2NpdHkueSA9IC0xICogQHBsYXllci5zcGVlZFxuICAgICAgICBlbHNlIGlmIEBjdXJzb3JzLmRvd24uaXNEb3duIG9yIEBnYW1lLmlucHV0LmtleWJvYXJkLmlzRG93bihAa2V5Ym9hcmRfbW9kZS5kb3duKVxuICAgICAgICAgICAgQHBsYXllci5ib2R5LnZlbG9jaXR5LnkgPSBAcGxheWVyLnNwZWVkXG5cbiAgICAgICAgaWYgQGdhbWUuaW5wdXQua2V5Ym9hcmQuZG93bkR1cmF0aW9uKFBoYXNlci5LZXlib2FyZC5TUEFDRUJBUiwgMTApXG4gICAgICAgICAgICBAcGxheWVyLm5leHRUb29sKClcblxuICAgICAgICAjICMgVE9ETzogd2UnbGwgd2FudCB0byBzd2l0Y2ggdGhpcyBzbyB3ZSd2ZSBnb3Qgb3VyIGNoZWNrLWFtbW9cbiAgICAgICAgIyAjIHNjcmVlbiwgcmF0aGVyIHRoYW4gZXhwbGljaXRseSBwcmVzc2luZyB0aGUgUiBrZXkgdG8gcmVsb2FkXG4gICAgICAgICMgaWYgQGdhbWUuaW5wdXQua2V5Ym9hcmQuanVzdFByZXNzZWQoUGhhc2VyLktleWJvYXJkLlIpXG4gICAgICAgICMgICAgIEBwbGF5ZXIucmVsb2FkR3VuKClcbiIsIkJ1aWxkaW5nVGVzdCA9IHJlcXVpcmUoXCIuL0J1aWxkaW5nVGVzdFwiKS5CdWlsZGluZ1Rlc3RcblxuIyBUaGUgYnVpbGQgdG9vbCBhbGxvd3MgdGhlIHBsYXllciB0byBjcmVhdGUgYnVpbGRpbmdzXG5jbGFzcyBleHBvcnRzLlRvb2xCdWlsZFxuXG4gICAgIyB0b29sIG5hbWUgc2hvdWxkIGJlIGRpc3BsYXllZCBpbiB0aGUgc3RhdHVzIGJhclxuICAgIG5hbWU6IFwiQnVpbGRcIlxuXG4gICAgIyB0aW1lIGJldHdlZW4gcmVnaXN0ZXJpbmcgc2VwZXJhdGUgY2xpY2tzXG4gICAgY29vbGRvd246IDEwMCAjIG1zXG5cbiAgICAjIHRoZSBidWlsZGluZyB0byBiZSBjcmVhdGVkXG4gICAgY3VycmVudEJ1aWxkaW5nOiBudWxsXG5cbiAgICBjb25zdHJ1Y3RvcjogKEBnYW1lLCBAcGxheWVyKS0+XG5cbiAgICAgICAgQGNvbnN0cnVjdGluZyA9IGZhbHNlXG5cbiAgICAgICAgIyBDcmVhdGUgYW4gb2JqZWN0IHJlcHJlc2VudGluZyBvdXIgZ3VuXG4gICAgICAgIEBndW4gPSBAZ2FtZS5hZGQuc3ByaXRlIDUwLCBAZ2FtZS5oZWlnaHQvMiwgJ3N0YXIyJ1xuXG4gICAgICAgICMgU2V0IHRoZSBwaXZvdCBwb2ludCB0byB0aGUgY2VudGVyIG9mIHRoZSBndW5cbiAgICAgICAgQGd1bi5hbmNob3Iuc2V0VG8gMC41LCAwLjVcblxuICAgICAgICBAZ3VuLnZpc2libGUgPSBmYWxzZVxuXG4gICAgICAgICMgY3JlYXRlIGEgZ2hvc3QgY3Vyc29yXG4gICAgICAgIEBuZXdHaG9zdChCdWlsZGluZ1Rlc3QpXG5cbiAgICAgICAgQHVuc2VsZWN0KClcblxuICAgICAgICByZXR1cm4gdGhpc1xuXG4gICAgdXBkYXRlOiAoKT0+XG5cbiAgICAgICAgIyBNb3ZlIHRoZSBndW4gdG8gdGhlIHBsYXllclxuICAgICAgICBAZ3VuLnggPSBAcGxheWVyLnhcbiAgICAgICAgQGd1bi55ID0gQHBsYXllci55XG5cbiAgICAgICAgIyBNb3ZlIHRoZSBnaG9zdCBpbWFnZSB0byB0aGUgY3Vyc29yXG4gICAgICAgIEBnaG9zdC54ID0gQGdhbWUuaW5wdXQuYWN0aXZlUG9pbnRlci53b3JsZFhcbiAgICAgICAgQGdob3N0LnkgPSBAZ2FtZS5pbnB1dC5hY3RpdmVQb2ludGVyLndvcmxkWVxuXG5cbiAgICAgICAgaWYgbm90IEBjb25zdHJ1Y3RpbmdcbiAgICAgICAgICAgIGlmIEBnYW1lLmlucHV0Lm1vdXNlUG9pbnRlci5qdXN0UmVsZWFzZWQoQGNvb2xkb3duKVxuICAgICAgICAgICAgICAgIEBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdjYXN0JylcbiAgICAgICAgICAgICAgICBAZ2FtZS5qdWljZS5wbG9wKEBnaG9zdC54LCBAZ2hvc3QueSlcbiAgICAgICAgICAgICAgICBAYnVpbGRHaG9zdCgpXG4gICAgICAgICAgICAgICAgQGNvbnN0cnVjdGluZyA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgaWYgbm90IEBnYW1lLmlucHV0Lm1vdXNlUG9pbnRlci5qdXN0UmVsZWFzZWQoQGNvb2xkb3duKVxuICAgICAgICAgICAgICAgIEBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdpZGxlJylcbiAgICAgICAgICAgICAgICBAY29uc3RydWN0aW5nID0gZmFsc2VcblxuICAgIGdldFN0YXR1c1RleHQ6ICgpLT5cbiAgICAgICAgc3RhdHVzID0gJydcbiAgICAgICAgc3RhdHVzICs9ICdidWlsZGluZzogJyArIGlmIEBnaG9zdCB0aGVuIEBnaG9zdC5uYW1lIGVsc2UgJ25vbmUnICsgJ1xcbidcbiAgICAgICAgcmV0dXJuIHN0YXR1c1xuXG4gICAgc2VsZWN0OiAoKS0+XG4gICAgICAgIEBnaG9zdC5yZXZpdmUoKVxuXG4gICAgdW5zZWxlY3Q6ICgpLT5cbiAgICAgICAgQGdob3N0LmtpbGwoKVxuXG5cblxuICAgIG5ld0dob3N0OiAoYnVpbGRpbmdUeXBlKT0+XG4gICAgICAgICMgaWYgd2UndmUgbm90IGNvbnN0cnVjdGVkIHRoZSBnaG9zdCBidWlsZGluZyxcbiAgICAgICAgIyB3ZSdyZSBzd2l0Y2hpbmcgY3Vyc29ycywgc28gZGVzdG9yeSB0aGUgb2xkIG9uZVxuICAgICAgICBpZiBAZ2hvc3QgYW5kIG5vdCBAZ2hvc3QuaXNDb25zdHJ1Y3RlZFxuICAgICAgICAgICAgQGdob3N0LmRlc3Ryb3koKVxuICAgICAgICBAZ2hvc3QgPSBuZXcgYnVpbGRpbmdUeXBlKEBnYW1lKVxuICAgICAgICAjIGNvbnNvbGUubG9nIEBnaG9zdFxuICAgICAgICByZXR1cm4gQGdob3N0XG5cbiAgICBidWlsZEdob3N0OiAoKS0+XG4gICAgICAgIGlmIEBnaG9zdFxuICAgICAgICAgICAgQGdob3N0LmJ1aWxkKClcbiAgICAgICAgICAgICMgQGdob3N0ID0gbnVsbFxuICAgICAgICAgICAgQG5ld0dob3N0KEJ1aWxkaW5nVGVzdClcblxuXG4iLCIjIFRoZSBidWlsZCB0b29sIGFsbG93cyB0aGUgcGxheWVyIHRvIHBsYWNlIHRpbGVzXG5jbGFzcyBleHBvcnRzLlRvb2xNaXNzaWxlXG5cbiAgICAjIHRvb2wgbmFtZSBzaG91bGQgYmUgZGlzcGxheWVkIGluIHRoZSBzdGF0dXMgYmFyXG4gICAgbmFtZTogXCJNYWdpYyBNaXNzaWxlXCJcblxuICAgICMgRGVmaW5lIGNvbnN0YW50c1xuICAgIFNIT1RfREVMQVk6IDI1MCAjIG1pbGxpc2Vjb25kc1xuICAgIEJVTExFVF9TUEVFRDogNDUwICMgcGl4ZWxzL3NlY29uZFxuICAgIE5VTUJFUl9PRl9CVUxMRVRTOiAyMFxuICAgIFJPVEFUSU9OX09GRlNFVDogMFxuICAgIEJVTExFVF9FTkVSR1lfQ09TVDogNTBcblxuICAgIGNvbnN0cnVjdG9yOiAoQGdhbWUsIEBwbGF5ZXIpLT5cblxuICAgICAgICBAUk9UQVRJT05fT0ZGU0VUID0gUGhhc2VyLk1hdGguZGVnVG9SYWQgOTBcblxuICAgICAgICAjIENyZWF0ZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIG91ciBndW5cbiAgICAgICAgQGd1biA9IEBnYW1lLmFkZC5zcHJpdGUgNTAsIEBnYW1lLmhlaWdodC8yLCAnbWlzc2lsZSdcblxuICAgICAgICAjIE1ha2UgdGhlIGd1biBpbnZpc2libGVcbiAgICAgICAgQGd1bi52aXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgIyBTZXQgdGhlIHBpdm90IHBvaW50IHRvIHRoZSBjZW50ZXIgb2YgdGhlIGd1blxuICAgICAgICBAZ3VuLmFuY2hvci5zZXRUbyAwLjUsIDAuNVxuXG4gICAgICAgICMgY3JlYXRlIHNvbWUgYnVsbGV0c1xuICAgICAgICBAY3JlYXRlQnVsbGV0cygpXG5cbiAgICAgICAgQHVuc2VsZWN0KClcblxuICAgICAgICByZXR1cm4gdGhpc1xuXG4gICAgdXBkYXRlOiAoKT0+XG5cbiAgICAgICAgIyBNb3ZlIHRoZSBndW4gdG8gdGhlIHBsYXllclxuICAgICAgICBAZ3VuLnggPSBAcGxheWVyLnhcbiAgICAgICAgQGd1bi55ID0gQHBsYXllci55XG4gICAgICAgICMgQGd1bi5yb3RhdGlvbiA9IEBwbGF5ZXIucm90YXRpb25cbiAgICAgICAgIyBSb3RhdGUgdGhlIGd1biB0byBmYWNlIHRoZSBtb3VzZVxuICAgICAgICBAZ3VuLnJvdGF0aW9uID0gQGdhbWUucGh5c2ljcy5hcmNhZGUuYW5nbGVUb1BvaW50ZXIgQGd1blxuXG4gICAgICAgICMgc2hvdCB0aGUgdGhpbmdzXG4gICAgICAgIGlmIEBmaXJlSW5wdXRJc0FjdGl2ZSgpXG4gICAgICAgICAgICBAcGxheWVyLmFuaW1hdGlvbnMucGxheSgnY2FzdCcpXG4gICAgICAgICAgICBAc2hvb3RCdWxsZXQoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAcGxheWVyLmFuaW1hdGlvbnMucGxheSgnaWRsZScpXG5cbiAgICAgICAgIyBsLWNsaWNrIHRvIGZpcmVcblxuICAgICAgICAjIHItY2xpY2sgdG9cbiAgICAgICAgIyAgIHBpY2sgdGFyZ2V0cz9cbiAgICAgICAgIyAgIGd1aWRlIG1pc3NpbGVzP1xuICAgICAgICAjICAgZGVmZW5kP1xuXG5cbiAgICAjIFRoaXMgZnVuY3Rpb24gc2hvdWxkIHJldHVybiB0cnVlIHdoZW4gdGhlIHBsYXllciBhY3RpdmF0ZXMgdGhlIFwiZmlyZVwiIGNvbnRyb2xcbiAgICAjIEluIHRoaXMgY2FzZSwgZWl0aGVyIGhvbGRpbmcgdGhlIHNwYWNlIGJhclxuICAgIGZpcmVJbnB1dElzQWN0aXZlOiAoKS0+XG4gICAgICAgIGlzQWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgIyBmaXJlS2V5ID0gQGdhbWUuaW5wdXQua2V5Ym9hcmQuaXNEb3duIFBoYXNlci5LZXlib2FyZC5TUEFDRUJBUlxuICAgICAgICBmaXJlQnV0dG9uID0gQGdhbWUuaW5wdXQubW91c2UuYnV0dG9uIGlzIFBoYXNlci5Nb3VzZS5MRUZUX0JVVFRPTlxuXG4gICAgICAgICMgaXNBY3RpdmUgPSBmaXJlS2V5IG9yIGZpcmVCdXR0b25cblxuICAgICAgICByZXR1cm4gZmlyZUJ1dHRvblxuXG5cbiAgICBjcmVhdGVCdWxsZXRzOiAoKS0+XG5cbiAgICAgICAgIyBDcmVhdGUgYW4gb2JqZWN0IHBvb2wgb2YgYnVsbGV0c1xuICAgICAgICBAYnVsbGV0UG9vbCA9IEBnYW1lLmFkZC5ncm91cCgpXG4gICAgICAgIGZvciBpIGluIFswLi5ATlVNQkVSX09GX0JVTExFVFNdXG4gICAgICAgICAgICAjIENyZWF0ZSBlYWNoIGJ1bGxldCBhbmQgYWRkIGl0IHRvIHRoZSBncm91cC5cbiAgICAgICAgICAgIGJ1bGxldCA9IEBnYW1lLmFkZC5zcHJpdGUgMCwgMCwgJ21pc3NpbGUnXG4gICAgICAgICAgICBAYnVsbGV0UG9vbC5hZGQgYnVsbGV0XG5cbiAgICAgICAgICAgICMgU2V0IGl0cyBwaXZvdCBwb2ludCB0byB0aGUgY2VudGVyIG9mIHRoZSBidWxsZXRcbiAgICAgICAgICAgICMgYnVsbGV0LmFuY2hvci5zZXRUbygwLjUsIC0wLjI1KTtcbiAgICAgICAgICAgIGJ1bGxldC5hbmNob3Iuc2V0VG8gMC41LCAwLjVcblxuICAgICAgICAgICAgIyBFbmFibGUgcGh5c2ljcyBvbiB0aGUgYnVsbGV0XG4gICAgICAgICAgICBAZ2FtZS5waHlzaWNzLmVuYWJsZSBidWxsZXQsIFBoYXNlci5QaHlzaWNzLkFSQ0FERVxuXG4gICAgICAgICAgICAjIEdpdmUgdGhlIGJ1bGxldCBhIHBvd2VyIHZhbHVlIHdoaWNoIGl0IHVzZXMgdG8gZGVhbCBkYW1hZ2VcbiAgICAgICAgICAgIGJ1bGxldC5wb3dlciA9IDFcblxuICAgICAgICAgICAgIyBTZXQgaXRzIGluaXRpYWwgc3RhdGUgdG8gXCJkZWFkXCIuXG4gICAgICAgICAgICBidWxsZXQua2lsbCgpO1xuXG5cbiAgICBzaG9vdEJ1bGxldDogKCktPlxuICAgICAgICAjIEVuZm9yY2UgYSBzaG9ydCBkZWxheSBiZXR3ZWVuIHNob3RzIGJ5IHJlY29yZGluZ1xuICAgICAgICAjIHRoZSB0aW1lIHRoYXQgZWFjaCBidWxsZXQgaXMgc2hvdCBhbmQgdGVzdGluZyBpZlxuICAgICAgICAjIHRoZSBhbW91bnQgb2YgdGltZSBzaW5jZSB0aGUgbGFzdCBzaG90IGlzIG1vcmUgdGhhblxuICAgICAgICAjIHRoZSByZXF1aXJlZCBkZWxheS5cbiAgICAgICAgaWYgQGxhc3RCdWxsZXRTaG90QXQgaXMgdW5kZWZpbmVkXG4gICAgICAgICAgICBAbGFzdEJ1bGxldFNob3RBdCA9IDBcbiAgICAgICAgaWYgQGdhbWUudGltZS5ub3cgLSBAbGFzdEJ1bGxldFNob3RBdCA8IEBTSE9UX0RFTEFZXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgQGxhc3RCdWxsZXRTaG90QXQgPSBAZ2FtZS50aW1lLm5vd1xuXG4gICAgICAgICMgR2V0IGEgZGVhZCBidWxsZXQgZnJvbSB0aGUgcG9vbFxuICAgICAgICBidWxsZXQgPSBAYnVsbGV0UG9vbC5nZXRGaXJzdERlYWQoKVxuXG4gICAgICAgICMgSWYgdGhlcmUgYXJlbid0IGFueSBidWxsZXRzIGF2YWlsYWJsZSB0aGVuIGRvbid0IHNob290XG4gICAgICAgIGlmIGJ1bGxldCBpcyBudWxsIG9yIGJ1bGxldCBpcyB1bmRlZmluZWRcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICMgUmV2aXZlIHRoZSBidWxsZXRcbiAgICAgICAgIyBUaGlzIG1ha2VzIHRoZSBidWxsZXQgXCJhbGl2ZVwiXG4gICAgICAgIGJ1bGxldC5yZXZpdmUoKVxuXG4gICAgICAgICMgQnVsbGV0cyBzaG91bGQga2lsbCB0aGVtc2VsdmVzIHdoZW4gdGhleSBsZWF2ZSB0aGUgd29ybGQuXG4gICAgICAgICMgUGhhc2VyIHRha2VzIGNhcmUgb2YgdGhpcyBmb3IgbWUgYnkgc2V0dGluZyB0aGlzIGZsYWdcbiAgICAgICAgIyBidXQgeW91IGNhbiBkbyBpdCB5b3Vyc2VsZiBieSBraWxsaW5nIHRoZSBidWxsZXQgaWZcbiAgICAgICAgIyBpdHMgeCx5IGNvb3JkaW5hdGVzIGFyZSBvdXRzaWRlIG9mIHRoZSB3b3JsZC5cbiAgICAgICAgYnVsbGV0LmNoZWNrV29ybGRCb3VuZHMgPSB0cnVlXG4gICAgICAgIGJ1bGxldC5vdXRPZkJvdW5kc0tpbGwgPSB0cnVlXG5cbiAgICAgICAgIyBTZXQgdGhlIGJ1bGxldCBwb3NpdGlvbiB0byB0aGUgZ3VuIHBvc2l0aW9uLlxuICAgICAgICBidWxsZXQucmVzZXQgQGd1bi54LCBAZ3VuLnlcbiAgICAgICAgYnVsbGV0LnJvdGF0aW9uID0gQGd1bi5yb3RhdGlvbiAtIEBST1RBVElPTl9PRkZTRVRcbiAgICAgICAgIyBjb25zb2xlLmxvZyhidWxsZXQucm90YXRpb24pO1xuXG4gICAgICAgICMgU2hvb3QgaXRcbiAgICAgICAgYnVsbGV0LmJvZHkudmVsb2NpdHkueCA9IE1hdGguY29zKGJ1bGxldC5yb3RhdGlvbiArIEBST1RBVElPTl9PRkZTRVQpICogQEJVTExFVF9TUEVFRFxuICAgICAgICBidWxsZXQuYm9keS52ZWxvY2l0eS55ID0gTWF0aC5zaW4oYnVsbGV0LnJvdGF0aW9uICsgQFJPVEFUSU9OX09GRlNFVCkgKiBAQlVMTEVUX1NQRUVEXG5cbiAgICAgICAgIyBEbyBzb21lIGp1aWNlXG4gICAgICAgIEBnYW1lLmp1aWNlLnBldygpXG5cbiAgICBnZXRTdGF0dXNUZXh0OiAoKS0+XG4gICAgICAgIHJldHVybiAnJ1xuXG4gICAgc2VsZWN0OiAoKS0+XG5cbiAgICB1bnNlbGVjdDogKCktPlxuIiwiIyBUaGUgVGVsZXBvcnQgdG9vbCBhbGxvd3MgdGhlIHBsYXllciB0byB0ZWxlcG9ydFxuY2xhc3MgZXhwb3J0cy5Ub29sVGVsZXBvcnRcblxuICAgICMgdG9vbCBuYW1lIHNob3VsZCBiZSBkaXNwbGF5ZWQgaW4gdGhlIHN0YXR1cyBiYXJcbiAgICBuYW1lOiBcIlRlbGVwb3J0XCJcblxuICAgICMgdGltZSBiZXR3ZWVuIHJlZ2lzdGVyaW5nIHNlcGVyYXRlIGNsaWNrc1xuICAgIGNvb2xkb3duOiAxMDAgIyBtc1xuXG4gICAgY29uc3RydWN0b3I6IChAZ2FtZSwgQHBsYXllciktPlxuXG4gICAgICAgIEB0ZWxlcG9ydGluZyA9IGZhbHNlXG5cbiAgICAgICAgQHVuc2VsZWN0KClcblxuICAgICAgICByZXR1cm4gdGhpc1xuXG4gICAgdXBkYXRlOiAoKT0+XG5cbiAgICAgICAgIyBsLWNsaWNrIHRvIHRlbGVwb3J0XG5cbiAgICAgICAgIyByLWNsaWNrIHRvIHBpY2sgdGlsZXNcblxuICAgICAgICAjIHEgdG8gdG9nZ2xlIHBhbGV0dGVcblxuICAgICAgICAjIGNsaWNrIHRoZSB0aWxlIHBhbGV0dGUgdG8gcGljayBhIHRpbGVcblxuICAgICAgICBpZiBub3QgQHRlbGVwb3J0aW5nXG4gICAgICAgICAgICBpZiBAZ2FtZS5pbnB1dC5tb3VzZVBvaW50ZXIuanVzdFJlbGVhc2VkKEBjb29sZG93bilcbiAgICAgICAgICAgICAgICBAcGxheWVyLmFuaW1hdGlvbnMucGxheSgnY2FzdCcpXG4gICAgICAgICAgICAgICAgQGdhbWUuanVpY2UuZm9vc2goQHBsYXllci54LCBAcGxheWVyLnksIGdhbWUuaW5wdXQuYWN0aXZlUG9pbnRlci53b3JsZFgsIGdhbWUuaW5wdXQuYWN0aXZlUG9pbnRlci53b3JsZFkpXG4gICAgICAgICAgICAgICAgQHBsYXllci54ID0gZ2FtZS5pbnB1dC5hY3RpdmVQb2ludGVyLndvcmxkWFxuICAgICAgICAgICAgICAgIEBwbGF5ZXIueSA9IGdhbWUuaW5wdXQuYWN0aXZlUG9pbnRlci53b3JsZFlcbiAgICAgICAgICAgICAgICBAdGVsZXBvcnRpbmcgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGlmIG5vdCBAZ2FtZS5pbnB1dC5tb3VzZVBvaW50ZXIuanVzdFJlbGVhc2VkKEBjb29sZG93bilcbiAgICAgICAgICAgICAgICBAcGxheWVyLmFuaW1hdGlvbnMucGxheSgnaWRsZScpXG4gICAgICAgICAgICAgICAgQHRlbGVwb3J0aW5nID0gZmFsc2VcblxuICAgIGdldFN0YXR1c1RleHQ6ICgpLT5cbiAgICAgICAgcmV0dXJuICd0ZWxlcG9ydGluZzogJyArIEB0ZWxlcG9ydGluZ1xuXG4gICAgc2VsZWN0OiAoKS0+XG5cbiAgICB1bnNlbGVjdDogKCktPlxuXG5cblxuIiwiIyBUaGUgdGVycmFpbiB0b29sIGFsbG93cyB0aGUgcGxheWVyIHRvIHBsYWNlIHRpbGVzXG5jbGFzcyBleHBvcnRzLlRvb2xUZXJyYWluXG5cbiAgICAjIHRvb2wgbmFtZSBzaG91bGQgYmUgZGlzcGxheWVkIGluIHRoZSBzdGF0dXMgYmFyXG4gICAgbmFtZTogXCJUZXJyYWluXCJcblxuICAgICMgdGhlIHRpbGUgaWQgdGhhdCBpcyBjdXJyZW50bHkgcGlja2VkXG4gICAgY3VycmVudFRpbGVJZDogMFxuXG4gICAgIyB0aGUgdGlsZW1hcCB3ZSdyZSBnb2luZyB0byBiZSBjaGFuZ2luZ1xuICAgIHRpbGVtYXA6IG51bGxcblxuICAgIGNvbnN0cnVjdG9yOiAoQGdhbWUsIEBwbGF5ZXIpLT5cblxuICAgICAgICAjIENyZWF0ZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIG91ciBndW5cbiAgICAgICAgQGd1biA9IEBnYW1lLmFkZC5zcHJpdGUgNTAsIEBnYW1lLmhlaWdodC8yLCAnc3RhcjInXG5cbiAgICAgICAgIyBTZXQgdGhlIHBpdm90IHBvaW50IHRvIHRoZSBjZW50ZXIgb2YgdGhlIGd1blxuICAgICAgICBAZ3VuLmFuY2hvci5zZXRUbyAwLjUsIDAuNVxuXG4gICAgICAgIEBndW4udmlzaWJsZSA9IGZhbHNlXG5cbiAgICAgICAgIyBjcmVhdGUgYSBzZWxlY3Rpb24gY3Vyc29yXG4gICAgICAgIEBzZWxlY3Rpb24gPSBAZ2FtZS5hZGQuc3ByaXRlIDUwLCBAZ2FtZS5oZWlnaHQvMiwgJ3RpbGVTZWxlY3QnXG4gICAgICAgIEBzZWxlY3Rpb24uYW5jaG9yLnNldFRvIDAuNSwgMC41XG5cbiAgICAgICAgQGN1cnJlbnRUaWxlID0gMFxuICAgICAgICBAbWFwID0gQGdhbWUuY3VycmVudExldmVsLnRpbGVtYXBcbiAgICAgICAgQGN1cnJlbnRMYXllciA9IEBnYW1lLmN1cnJlbnRMZXZlbC5jdXJyZW50TGF5ZXJcblxuICAgICAgICBAdW5zZWxlY3QoKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG5cbiAgICBzaG93UGFsbGV0ZTogKCktPlxuICAgICAgICAjIFRPRE86IHNob3cgdGhlIHBhbGxldGUgYXQgdGhlIHRvcCBvZiB0aGUgc2NyZWVuXG5cbiAgICBoaWRlUGFsbGV0ZTogKCktPlxuICAgICAgICAjIFRPRE86IGhpZGUgdGhlIHBhbGV0dGVcblxuICAgIHBpY2tQYWxsZXRlVGlsZTogKCktPlxuICAgICAgICAjIFRPRE86IHBpY2sgYSB0aWxlIGZyb20gdGhlIHBhbGV0dGUgYW5kIHNldCBpdCBhcyBjdXJyZW50XG5cbiAgICAjIHBpY2sgYSB0aWxlIGZyb20gdGhlIHRpbGVtYXAgYW5kIHNldCBpdCBhcyB0aGUgY3VycmVudCB0aWxlXG4gICAgcGlja1RpbGU6ICh4LCB5KS0+XG4gICAgICAgICMgaWYgdGhlIHRpbGVtYXAgaXMgbnVsbCwgcmV0dXJuXG4gICAgICAgIGlmIG5vdCBAdGlsZW1hcD9cbiAgICAgICAgICAgIGNvbnNvbGUubG9nIFwiVG9vbFRlcnJhaW4ucGlja1RpbGU6IEB0aWxlbWFwIGRvZXMgbm90IGV4aXN0XCJcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAjIGdldCBhbmQgYXNzaWduIHRoZSB0aWxlIGlkIGZyb20gdGhlIHRpbGVtYXBcbiAgICAgICAgQGN1cnJlbnRUaWxlSWQgPSAwICMgVE9ETzogZ2V0IHRpbGUgZnJvbSB0aWxlbWFwXG5cbiAgICAjIHJlcGxhY2UgYSB0aWxlIG9uIHRoZSB0aWxlbWFwIHdpdGggdGhlIGN1cnJlbnQgdGlsZVxuICAgIHBhaW50VGlsZTogKHgsIHkpLT5cbiAgICAgICAgIyBpZiB0aGUgdGlsZW1hcCBpcyBudWxsLCByZXR1cm5cbiAgICAgICAgaWYgbm90IEB0aWxlbWFwP1xuICAgICAgICAgICAgY29uc29sZS5sb2cgXCJUb29sVGVycmFpbi5wYWludFRpbGU6IEB0aWxlbWFwIGRvZXMgbm90IGV4aXN0XCJcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAjIFRPRE86IGlmIHRoZSB0aWxlIGF0IHgsIHkgaXMgYWxyZWFkeSB0aGUgY3VycmVudCB0aWxlLCByZXR1cm5cblxuICAgICAgICAjIFRPRE86IHJlcGxhY2UgdGhlIHRpbGVtYXAgYXQgeCwgeSB3aXRoIHRoZSBjdXJyZW50IHRpbGVcblxuICAgICMgdGFrZXMgYSBzZXQgb2Ygc2NyZWVuIGNvb3JkaW5hdGVzIGFuZCB0cmFuc2xhdGVzIHRoZW0gdG8gdGlsZW1hcCBjb29yZHNcbiAgICBjb29yZHNTY3JlZW5Ub1RpbGVtYXA6ICh4LCB5KS0+XG4gICAgICAgICMgVE9ETzogdHJhbnNsYXRlIGFuZCByZXR1cm4gY29vcmRpbmF0ZXNcblxuICAgIHVwZGF0ZTogKCk9PlxuXG4gICAgICAgICMgTW92ZSB0aGUgZ3VuIHRvIHRoZSBwbGF5ZXJcbiAgICAgICAgQGd1bi54ID0gQHBsYXllci54XG4gICAgICAgIEBndW4ueSA9IEBwbGF5ZXIueVxuXG4gICAgICAgICMgTW92ZSB0aGUgc2VsZWN0aW9uIHRvIHRoZSBjdXJzb3JcbiAgICAgICAgQHNlbGVjdGlvbi54ID0gTWF0aC5mbG9vcihAZ2FtZS5pbnB1dC5hY3RpdmVQb2ludGVyLndvcmxkWCAvIDMyKSAqIDMyICsgMTZcbiAgICAgICAgQHNlbGVjdGlvbi55ID0gTWF0aC5mbG9vcihAZ2FtZS5pbnB1dC5hY3RpdmVQb2ludGVyLndvcmxkWSAvIDMyKSAqIDMyICsgMTZcblxuICAgICAgICAjIGwtY2xpY2sgdG8gcGFpbnQgdGlsZXNcblxuICAgICAgICAjIHItY2xpY2sgdG8gcGljayB0aWxlc1xuXG4gICAgICAgICMgcSB0byB0b2dnbGUgcGFsZXR0ZVxuXG4gICAgICAgICMgY2xpY2sgdGhlIHRpbGUgcGFsZXR0ZSB0byBwaWNrIGEgdGlsZVxuXG4gICAgICAgIG1hcmtlclggPSBAY3VycmVudExheWVyLmdldFRpbGVYKGdhbWUuaW5wdXQuYWN0aXZlUG9pbnRlci53b3JsZFgpICogMzJcbiAgICAgICAgbWFya2VyWSA9IEBjdXJyZW50TGF5ZXIuZ2V0VGlsZVkoZ2FtZS5pbnB1dC5hY3RpdmVQb2ludGVyLndvcmxkWSkgKiAzMlxuXG4gICAgICAgIGlmIChAZ2FtZS5pbnB1dC5tb3VzZVBvaW50ZXIuaXNEb3duKVxuICAgICAgICAgICAgQHBsYXllci5hbmltYXRpb25zLnBsYXkoJ2Nhc3QnKVxuICAgICAgICAgICAgIyBAbWFwLnB1dFRpbGUoQGN1cnJlbnRUaWxlLCBAY3VycmVudExheWVyLmdldFRpbGVYKG1hcmtlclgpLCBAY3VycmVudExheWVyLmdldFRpbGVZKG1hcmtlclkpLCBAY3VycmVudExheWVyKVxuICAgICAgICAgICAgaWYgKGdhbWUuaW5wdXQua2V5Ym9hcmQuaXNEb3duKFBoYXNlci5LZXlib2FyZC5TSElGVCkpXG4gICAgICAgICAgICAgICAgQGN1cnJlbnRUaWxlID0gQG1hcC5nZXRUaWxlKEBjdXJyZW50TGF5ZXIuZ2V0VGlsZVgobWFya2VyWCksIEBjdXJyZW50TGF5ZXIuZ2V0VGlsZVkobWFya2VyWSkpLmluZGV4XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgaWYgKEBtYXAuZ2V0VGlsZShAY3VycmVudExheWVyLmdldFRpbGVYKG1hcmtlclgpLCBAY3VycmVudExheWVyLmdldFRpbGVZKG1hcmtlclkpKS5pbmRleCAhPSBAY3VycmVudFRpbGUpXG4gICAgICAgICAgICAgICAgICAgIEBtYXAucHV0VGlsZShAY3VycmVudFRpbGUsIEBjdXJyZW50TGF5ZXIuZ2V0VGlsZVgobWFya2VyWCksIEBjdXJyZW50TGF5ZXIuZ2V0VGlsZVkobWFya2VyWSkpXG4gICAgICAgICAgICAgICAgICAgIEBnYW1lLmp1aWNlLnBsb3AoZ2FtZS5pbnB1dC5hY3RpdmVQb2ludGVyLndvcmxkWCwgZ2FtZS5pbnB1dC5hY3RpdmVQb2ludGVyLndvcmxkWSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHBsYXllci5hbmltYXRpb25zLnBsYXkoJ2lkbGUnKVxuXG4gICAgICAgIGlmIEBnYW1lLmlucHV0LmtleWJvYXJkLmRvd25EdXJhdGlvbihQaGFzZXIuS2V5Ym9hcmQuUSwgMTApXG4gICAgICAgICAgICBAY3VycmVudFRpbGUgPSBQaGFzZXIuTWF0aC5jbGFtcCBAY3VycmVudFRpbGUgLSAxLCAwLCA3XG4gICAgICAgICAgICAjIGNvbnNvbGUubG9nICdjdXJyZW50VGlsZSAtLSB0byAnICsgQGN1cnJlbnRUaWxlXG4gICAgICAgIGlmIEBnYW1lLmlucHV0LmtleWJvYXJkLmRvd25EdXJhdGlvbihQaGFzZXIuS2V5Ym9hcmQuRSwgMTApXG4gICAgICAgICAgICBAY3VycmVudFRpbGUgPSBQaGFzZXIuTWF0aC5jbGFtcCBAY3VycmVudFRpbGUgKyAxLCAwLCA3XG4gICAgICAgICAgICAjIGNvbnNvbGUubG9nICdjdXJyZW50VGlsZSArKyB0byAnICsgQGN1cnJlbnRUaWxlXG5cbiAgICBnZXRTdGF0dXNUZXh0OiAoKS0+XG4gICAgICAgIHN0YXR1cyA9ICcnXG4gICAgICAgIHN0YXR1cyArPSAndGlsZUlEOiAnICsgQGN1cnJlbnRUaWxlICsgJ1xcbidcbiAgICAgICAgcmV0dXJuIHN0YXR1c1xuXG4gICAgc2VsZWN0OiAoKS0+XG4gICAgICAgIEBzZWxlY3Rpb24ucmV2aXZlKClcblxuICAgIHVuc2VsZWN0OiAoKS0+XG4gICAgICAgIEBzZWxlY3Rpb24ua2lsbCgpXG5cblxuXG4iXX0=
