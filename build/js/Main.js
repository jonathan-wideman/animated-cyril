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
    this.game.juice.shake();
    this.game.juice.build();
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
    var amount;
    amount = 1;
    this.game.reg.stockpile.earn(this.game.reg.stockpile.AER, amount);
    return this.game.juice.popText(this.x, this.y, this.game.reg.stockpile.AER + (" +" + amount));
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
    this.sndPlace = this.game.add.sound('sndPlace');
    this.sndPlace.allowMultiple = true;
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

  Juice.prototype.build = function() {
    return this.sndPlace.play();
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
var Building, Enemy, FxFloatingSparkles, Juice, Player, Stockpile, gamestate;

Juice = require("./Juice").Juice;

FxFloatingSparkles = require("./FxFloatingSparkles").FxFloatingSparkles;

Player = require("./Player").Player;

Building = require("./Building").Building;

Enemy = require("./Enemy").Enemy;

Stockpile = require('./Stockpile').Stockpile;

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
    game.load.audio('sndPlace', 'assets/snd/cloth2.ogg');
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
    return this.game.reg.stockpile = new Stockpile(this.game);
  }
};



},{"./Building":1,"./Enemy":3,"./FxFloatingSparkles":4,"./Juice":5,"./Player":7,"./Stockpile":9}],7:[function(require,module,exports){
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



},{"./PlayerController":8,"./ToolBuild":10,"./ToolMissile":11,"./ToolTeleport":12,"./ToolTerrain":13}],8:[function(require,module,exports){
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
exports.Stockpile = (function() {
  function Stockpile(game) {
    this.game = game;
    this.AER = 'Aeregium';
    this.DYN = 'Dynamis';
    this.resources = [
      {
        name: 'Aeregium',
        amount: 0
      }, {
        name: 'Dynamis',
        amount: 0
      }
    ];
  }

  Stockpile.prototype.getStatusText = function() {
    var resource, status, _i, _len, _ref;
    status = '';
    _ref = this.resources;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      resource = _ref[_i];
      status += resource.name + ': ' + resource.amount + '\n';
    }
    return status;
  };

  Stockpile.prototype.find = function(resource) {
    return _.find(this.resources, {
      name: resource
    });
  };

  Stockpile.prototype.earn = function(resource, amount) {
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
  };

  Stockpile.prototype.canAfford = function(resource, amount) {
    var stock;
    stock = this.find(resource);
    if (!stock) {
      return false;
    }
    return stock.amount >= amount;
  };

  Stockpile.prototype.spend = function(resource, amount) {
    var stock;
    if (!this.canAfford(resource, amount)) {
      return false;
    }
    stock = this.find(resource);
    stock.amount -= amount;
    return true;
  };

  return Stockpile;

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



},{"./BuildingTest":2}],11:[function(require,module,exports){
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



},{}]},{},[6])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2p3aWRlbWFuL2Rldi9nYW1lcy93aXphcmQvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvandpZGVtYW4vZGV2L2dhbWVzL3dpemFyZC9zcmMvc2NyaXB0cy9CdWlsZGluZy5jb2ZmZWUiLCIvaG9tZS9qd2lkZW1hbi9kZXYvZ2FtZXMvd2l6YXJkL3NyYy9zY3JpcHRzL0J1aWxkaW5nVGVzdC5jb2ZmZWUiLCIvaG9tZS9qd2lkZW1hbi9kZXYvZ2FtZXMvd2l6YXJkL3NyYy9zY3JpcHRzL0VuZW15LmNvZmZlZSIsIi9ob21lL2p3aWRlbWFuL2Rldi9nYW1lcy93aXphcmQvc3JjL3NjcmlwdHMvRnhGbG9hdGluZ1NwYXJrbGVzLmNvZmZlZSIsIi9ob21lL2p3aWRlbWFuL2Rldi9nYW1lcy93aXphcmQvc3JjL3NjcmlwdHMvSnVpY2UuY29mZmVlIiwiL2hvbWUvandpZGVtYW4vZGV2L2dhbWVzL3dpemFyZC9zcmMvc2NyaXB0cy9NYWluLmNvZmZlZSIsIi9ob21lL2p3aWRlbWFuL2Rldi9nYW1lcy93aXphcmQvc3JjL3NjcmlwdHMvUGxheWVyLmNvZmZlZSIsIi9ob21lL2p3aWRlbWFuL2Rldi9nYW1lcy93aXphcmQvc3JjL3NjcmlwdHMvUGxheWVyQ29udHJvbGxlci5jb2ZmZWUiLCIvaG9tZS9qd2lkZW1hbi9kZXYvZ2FtZXMvd2l6YXJkL3NyYy9zY3JpcHRzL1N0b2NrcGlsZS5jb2ZmZWUiLCIvaG9tZS9qd2lkZW1hbi9kZXYvZ2FtZXMvd2l6YXJkL3NyYy9zY3JpcHRzL1Rvb2xCdWlsZC5jb2ZmZWUiLCIvaG9tZS9qd2lkZW1hbi9kZXYvZ2FtZXMvd2l6YXJkL3NyYy9zY3JpcHRzL1Rvb2xNaXNzaWxlLmNvZmZlZSIsIi9ob21lL2p3aWRlbWFuL2Rldi9nYW1lcy93aXphcmQvc3JjL3NjcmlwdHMvVG9vbFRlbGVwb3J0LmNvZmZlZSIsIi9ob21lL2p3aWRlbWFuL2Rldi9nYW1lcy93aXphcmQvc3JjL3NjcmlwdHMvVG9vbFRlcnJhaW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTtpU0FBQTs7QUFBQSxPQUFhLENBQUM7QUFFViw2QkFBQSxDQUFBOztBQUFBLHFCQUFBLElBQUEsR0FBTSxFQUFOLENBQUE7O0FBQUEscUJBRUEsV0FBQSxHQUFhLGNBRmIsQ0FBQTs7QUFBQSxxQkFJQSxhQUFBLEdBQWUsS0FKZixDQUFBOztBQU1hLEVBQUEsa0JBQUUsSUFBRixFQUFRLENBQVIsRUFBZSxDQUFmLEdBQUE7QUFHVCxRQUFBLElBQUE7QUFBQSxJQUhVLElBQUMsQ0FBQSxPQUFBLElBR1gsQ0FBQTs7TUFIaUIsSUFBSTtLQUdyQjs7TUFId0IsSUFBSTtLQUc1QjtBQUFBLElBQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxJQUFSLENBQUE7QUFBQSxJQUdBLDBDQUFNLElBQUMsQ0FBQSxJQUFQLEVBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQixJQUFDLENBQUEsV0FBcEIsQ0FIQSxDQUFBO0FBQUEsSUFNQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBTlIsQ0FBQTtBQUFBLElBU0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLENBQWMsR0FBZCxFQUFtQixHQUFuQixDQVRBLENBQUE7QUFBQSxJQVdBLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FYQSxDQUFBO0FBQUEsSUFjQSxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFwQixDQUF3QixJQUFDLENBQUEsS0FBekIsRUFBZ0MsSUFBaEMsQ0FkQSxDQUFBO0FBQUEsSUFlQSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFuQixDQUF1QixJQUFDLENBQUEsT0FBeEIsRUFBaUMsSUFBakMsQ0FmQSxDQUFBO0FBQUEsSUFrQkEsSUFBQyxDQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBVixDQUFtQixJQUFuQixDQWxCQSxD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WixDQUFrQixJQUFDLENBQUEsV0FBRCxHQUFlLENBQWpDLEVBQW9DLENBQXBDLEVBQXVDLENBQXZDLENBQWYsQ0FESjtLQTlCQTtBQWlDQSxJQUFBLElBQUcsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQXJCLENBQWtDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBbEQsRUFBcUQsRUFBckQsQ0FBSDthQUNJLElBQUMsQ0FBQSxXQUFELEdBQWUsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFaLENBQWtCLElBQUMsQ0FBQSxXQUFELEdBQWUsQ0FBakMsRUFBb0MsQ0FBcEMsRUFBdUMsQ0FBdkMsRUFEbkI7S0FwQ0k7RUFBQSxDQTlEUixDQUFBOztBQUFBLHdCQXNHQSxhQUFBLEdBQWUsU0FBQSxHQUFBO0FBQ1gsUUFBQSxNQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVMsRUFBVCxDQUFBO0FBQUEsSUFDQSxNQUFBLElBQVUsVUFBQSxHQUFhLElBQUMsQ0FBQSxXQUFkLEdBQTRCLElBRHRDLENBQUE7QUFFQSxXQUFPLE1BQVAsQ0FIVztFQUFBLENBdEdmLENBQUE7O0FBQUEsd0JBMkdBLE1BQUEsR0FBUSxTQUFBLEdBQUE7V0FDSixJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBQSxFQURJO0VBQUEsQ0EzR1IsQ0FBQTs7QUFBQSx3QkE4R0EsUUFBQSxHQUFVLFNBQUEsR0FBQTtXQUNOLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxDQUFBLEVBRE07RUFBQSxDQTlHVixDQUFBOztxQkFBQTs7SUFISixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIGV4cG9ydHMuQnVpbGRpbmcgZXh0ZW5kcyBQaGFzZXIuU3ByaXRlXG5cbiAgICBuYW1lOiAnJ1xuXG4gICAgZ3JhcGhpY05hbWU6ICdidWlsZGluZ1Rlc3QnXG5cbiAgICBpc0NvbnN0cnVjdGVkOiBmYWxzZVxuXG4gICAgY29uc3RydWN0b3I6IChAZ2FtZSwgeCA9IDAsIHkgPSAwKS0+XG5cbiAgICAgICAgIyByZW1lbWJlciBvdXIgbmFtZSBiZWNhdXNlIFNwcml0ZSBjb25zdHJ1Y3RvciBpcyBkdW1iXG4gICAgICAgIG5hbWUgPSBAbmFtZVxuXG4gICAgICAgICMgQ2FsbCB0aGUgc3ByaXRlIGNvbnN0cnVjdG9yXG4gICAgICAgIHN1cGVyIEBnYW1lLCB4LCB5LCBAZ3JhcGhpY05hbWVcblxuICAgICAgICAjIHJlc2V0IG91ciBuYW1lIGJlY2F1c2UgU3ByaXRlIGNvbnN0cnVjdG9yIGlzIGR1bWJcbiAgICAgICAgQG5hbWUgPSBuYW1lXG5cbiAgICAgICAgIyBTZXQgdGhlIGFuY2hvciB0byB0aGUgY2VudGVyIG9mIHRoZSBzcHJpdGVcbiAgICAgICAgQGFuY2hvci5zZXRUbyAwLjUsIDAuNVxuXG4gICAgICAgIEBnaG9zdCgpXG5cbiAgICAgICAgIyBhZGQgZXZlbnRzIHRvIG1vdXNlb3ZlciBhbmQgbW91c2VvdXRcbiAgICAgICAgQGV2ZW50cy5vbklucHV0T3Zlci5hZGQoQGhvdmVyLCBAKVxuICAgICAgICBAZXZlbnRzLm9uSW5wdXRPdXQuYWRkKEB1bmhvdmVyLCBAKVxuXG4gICAgICAgICMgYWRkIG91cnNlbHZlcyB0byB0aGUgZ2FtZSBzdGF0ZVxuICAgICAgICBAZ2FtZS5hZGQuZXhpc3RpbmcgdGhpc1xuXG4gICAgICAgIEBhZGROZXh0VHVybkxpc3RlbmVyKClcblxuICAgICAgICByZXR1cm4gdGhpc1xuXG4gICAgYnVpbGQ6ICgpLT5cbiAgICAgICAgQHVuZ2hvc3QoKVxuXG4gICAgICAgICMgc2V0IHRoZSBjb25zdHJ1Y3RlZCBmbGFnXG4gICAgICAgIEBpc0NvbnN0cnVjdGVkID0gdHJ1ZVxuICAgICAgICBAZ2FtZS5qdWljZS5zaGFrZSgpXG4gICAgICAgIEBnYW1lLmp1aWNlLmJ1aWxkKClcbiAgICAgICAgcmV0dXJuXG5cbiAgICBhZGROZXh0VHVybkxpc3RlbmVyOiAoKS0+XG4gICAgICAgIEBnYW1lLm9uTmV4dFR1cm4uYWRkKEBuZXh0VHVybiwgQClcblxuICAgIG5leHRUdXJuOiAoKS0+XG4gICAgICAgICMgSWYgd2UgaGF2ZW4ndCBiZWVuIGJ1aWx0IHlldCwgc2tpcCBvdXIgdHVyblxuICAgICAgICBpZiBub3QgQGlzQ29uc3RydWN0ZWRcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICMgZG8gd2hhdGV2ZXIgZWZmZWN0cyB0aGlzIGJ1aWxkaW5nIGhhc1xuICAgICAgICBAdHVybkVmZmVjdHMoKVxuXG4gICAgdHVybkVmZmVjdHM6ICgpLT5cbiAgICAgICAgIyBkZWZhdWx0IGJ1aWxkaW5ncyBkbyBub3RoaW5nXG5cbiAgICBnaG9zdDogKCktPlxuICAgICAgICAjIFNldCBncmFwaGljIGVmZmVjdHMgdG8gaW5kaWNhdGUgYSAnZ2hvc3QnIHBsYW5uZWQgYnVpbGRpbmdcbiAgICAgICAgQGFscGhhID0gMC41XG4gICAgICAgIEB0aW50ID0gMHhmZmNjZmZjY1xuXG4gICAgICAgICMgZGlzYWJsZSBpbnB1dCBldmVudHMgbGlrZSBjbGljaywgdG91Y2gsIHJvbGxvdmVyXG4gICAgICAgIEBpbnB1dEVuYWJsZWQgPSBmYWxzZVxuXG4gICAgdW5naG9zdDogKCktPlxuICAgICAgICAjIFJlbW92ZSBncmFwaGljIGVmZmVjdHMgdG8gaW5kaWNhdGUgYSBmdWxseSBjb25zdHJ1Y3RlZCBidWlsZGluZ1xuICAgICAgICBAYWxwaGEgPSAxXG4gICAgICAgIEB0aW50ID0gMHhmZmZmZmZmZlxuXG4gICAgICAgICMgZW5hYmxlIGlucHV0IGV2ZW50cyBsaWtlIGNsaWNrLCB0b3VjaCwgcm9sbG92ZXJcbiAgICAgICAgQGlucHV0RW5hYmxlZCA9IHRydWVcblxuICAgIGhvdmVyOiAoKS0+XG4gICAgICAgIGlmIG5vdCBAaXNDb25zdHJ1Y3RlZFxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgQGdhbWUudWkudG9vbHRpcC50YXJnZXQgPSBAXG4gICAgICAgIEBnYW1lLnVpLnRvb2x0aXAudmlzaWJsZSA9IHRydWVcbiAgICAgICAgQGdhbWUudWkudG9vbHRpcC50ZXh0ID0gQG5hbWVcbiAgICAgICAgQGdhbWUudWkudG9vbHRpcC54ID0gQHggLSBAZ2FtZS51aS50b29sdGlwLndpZHRoIC8gMlxuICAgICAgICBAZ2FtZS51aS50b29sdGlwLnkgPSBAeSAtIDMyXG5cbiAgICB1bmhvdmVyOiAoKS0+XG4gICAgICAgIGlmIG5vdCBAaXNDb25zdHJ1Y3RlZFxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgaWYgQGdhbWUudWkudG9vbHRpcC50YXJnZXQgPT0gQFxuICAgICAgICAgICAgQGdhbWUudWkudG9vbHRpcC52aXNpYmxlID0gZmFsc2VcbiAgICAgICAgICAgIEBnYW1lLnVpLnRvb2x0aXAudGFyZ2V0ID0gbnVsbFxuIiwiQnVpbGRpbmcgPSByZXF1aXJlKFwiLi9CdWlsZGluZ1wiKS5CdWlsZGluZ1xuXG5jbGFzcyBleHBvcnRzLkJ1aWxkaW5nVGVzdCBleHRlbmRzIEJ1aWxkaW5nXG5cbiAgICBuYW1lOiAnVGVzdCBCdWlsZGluZydcblxuICAgIGdyYXBoaWNOYW1lOiAnYnVpbGRpbmdUZXN0J1xuXG4gICAgY29uc3RydWN0b3I6IChAZ2FtZSwgeCA9IDAsIHkgPSAwKS0+XG5cbiAgICAgICAgIyBDYWxsIHRoZSBidWlsZGluZyBjb25zdHJ1Y3RvclxuICAgICAgICBzdXBlciBAZ2FtZSwgeCwgeVxuXG4gICAgICAgIHJldHVybiB0aGlzXG5cbiAgICB0dXJuRWZmZWN0czogKCktPlxuICAgICAgICAjIGRvIHdoYXRldmVyIGVmZmVjdHMgdGhpcyBidWlsZGluZyBoYXNcbiAgICAgICAgIyBlZy4gYWRkIHJlc291cmNlc1xuICAgICAgICBhbW91bnQgPSAxXG4gICAgICAgIEBnYW1lLnJlZy5zdG9ja3BpbGUuZWFybiggQGdhbWUucmVnLnN0b2NrcGlsZS5BRVIsIGFtb3VudClcbiAgICAgICAgQGdhbWUuanVpY2UucG9wVGV4dChAeCwgQHksIEBnYW1lLnJlZy5zdG9ja3BpbGUuQUVSICsgXCIgKyN7YW1vdW50fVwiKVxuIiwiY2xhc3MgZXhwb3J0cy5FbmVteSBleHRlbmRzIFBoYXNlci5TcHJpdGVcbiAgICAjIGhvdyBmYXN0IGNhbiB3ZSBtb3ZlXG4gICAgTUFYX1NQRUVEOiAxMDBcbiAgICBNSU5fRElTVEFOQ0U6IDY0XG5cbiAgICBjb25zdHJ1Y3RvcjogKEBnYW1lLCBAcGxheWVyKS0+XG5cbiAgICAgICAgIyBTZXQgb3VyIHBvc2l0aW9uIHRvIHRoZSB3b3JsZCBjZW50ZXJcbiAgICAgICAgeCA9IEBnYW1lLndvcmxkLmNlbnRlclhcbiAgICAgICAgeSA9IEBnYW1lLndvcmxkLmNlbnRlcllcblxuICAgICAgICAjIENhbGwgdGhlIHNwcml0ZSBjb25zdHJ1Y3RvclxuICAgICAgICBzdXBlciBAZ2FtZSwgeCwgeSwgJ2VuZW15J1xuXG4gICAgICAgICMgU2V0IHRoZSBhbmNob3IgdG8gdGhlIGNlbnRlciBvZiB0aGUgc3ByaXRlXG4gICAgICAgIEBhbmNob3Iuc2V0VG8gMC41LCAwLjVcblxuICAgICAgICAjIEFkZCBzb21lIGFuaW1hdGlvbnNcbiAgICAgICAgQGFuaW1hdGlvbnMuYWRkICd1cCcsIFswLCAxLCAyLCAzXSwgMTAsIHRydWVcbiAgICAgICAgQGFuaW1hdGlvbnMuYWRkICdkb3duJywgWzQsIDUsIDYsIDddLCAxMCwgdHJ1ZVxuICAgICAgICBAYW5pbWF0aW9ucy5hZGQgJ2xlZnQnLCBbOCwgOSwgMTAsIDExXSwgMTAsIHRydWVcbiAgICAgICAgQGFuaW1hdGlvbnMuYWRkICdyaWdodCcsIFsxMiwgMTMsIDE0LCAxNV0sIDEwLCB0cnVlXG5cbiAgICAgICAgIyBFbmFibGUgcGh5c2ljc1xuICAgICAgICBAZ2FtZS5waHlzaWNzLmVuYWJsZSBALCBQaGFzZXIuUGh5c2ljcy5BUkNBREVcblxuICAgICAgICAjIGFkZCBvdXJzZWx2ZXMgdG8gdGhlIGdhbWUgc3RhdGVcbiAgICAgICAgZ2FtZS5hZGQuZXhpc3RpbmcgdGhpc1xuXG4gICAgICAgIEBhbmltYXRpb25zLnBsYXkoJ2Rvd24nKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG5cblxuICAgIHVwZGF0ZTogKCk9PlxuICAgICAgICBAZm9sbG93KEBwbGF5ZXIpXG4gICAgICAgIEB1cGRhdGVGYWNpbmcoKVxuXG4gICAgdXBkYXRlRmFjaW5nOiAoKS0+XG4gICAgICAgIGggPSBpZiBAYm9keS52ZWxvY2l0eS54IDwgMCB0aGVuICdsZWZ0JyBlbHNlICdyaWdodCdcbiAgICAgICAgdiA9IGlmIEBib2R5LnZlbG9jaXR5LnkgPCAwIHRoZW4gJ3VwJyBlbHNlICdkb3duJ1xuICAgICAgICBkaXIgPSBpZiBNYXRoLmFicyhAYm9keS52ZWxvY2l0eS54KSA+IE1hdGguYWJzKEBib2R5LnZlbG9jaXR5LnkpIHRoZW4gaCBlbHNlIHZcbiAgICAgICAgQGFuaW1hdGlvbnMucGxheShkaXIpXG5cbiAgICBuZXdEaXJlY3Rpb246ICgpLT5cbiAgICAgICAgZGlyZWN0aW9uID0gQGdhbWUucmFuZC5waWNrIFsndXAnLCAnZG93bicsICdsZWZ0JywgJ3JpZ2h0J11cbiAgICAgICAgY29uc29sZS5sb2cgZGlyZWN0aW9uXG4gICAgICAgIHJldHVybiBkaXJlY3Rpb25cblxuICAgIGZvbGxvdzogKHRhcmdldCktPlxuICAgICAgICAjIENhbGN1bGF0ZSBkaXN0YW5jZSB0byB0YXJnZXRcbiAgICAgICAgZGlzdGFuY2UgPSBAZ2FtZS5tYXRoLmRpc3RhbmNlKEB4LCBAeSwgdGFyZ2V0LngsIHRhcmdldC55KVxuXG4gICAgICAgICMgSWYgdGhlIGRpc3RhbmNlID4gTUlOX0RJU1RBTkNFIHRoZW4gbW92ZVxuICAgICAgICBpZiAoZGlzdGFuY2UgPiBATUlOX0RJU1RBTkNFKVxuICAgICAgICAgICAgIyBDYWxjdWxhdGUgdGhlIGFuZ2xlIHRvIHRoZSB0YXJnZXRcbiAgICAgICAgICAgIGFuZ2xlVG9UYXJnZXQgPSBAZ2FtZS5tYXRoLmFuZ2xlQmV0d2VlbihAeCwgQHksIHRhcmdldC54LCB0YXJnZXQueSlcblxuICAgICAgICAgICAgIyBDYWxjdWxhdGUgdmVsb2NpdHkgdmVjdG9yIGJhc2VkIG9uIGFuZ2xlVG9UYXJnZXQgYW5kIEBNQVhfU1BFRURcbiAgICAgICAgICAgIEBib2R5LnZlbG9jaXR5LnggPSBNYXRoLmNvcyhhbmdsZVRvVGFyZ2V0KSAqIEBNQVhfU1BFRURcbiAgICAgICAgICAgIEBib2R5LnZlbG9jaXR5LnkgPSBNYXRoLnNpbihhbmdsZVRvVGFyZ2V0KSAqIEBNQVhfU1BFRURcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGJvZHkudmVsb2NpdHkuc2V0VG8oMCwgMClcbiIsImNsYXNzIGV4cG9ydHMuRnhGbG9hdGluZ1NwYXJrbGVzIGV4dGVuZHMgUGhhc2VyLkdyb3VwXG5cbiAgICBNQVhfQVNURVJPSURTOiAxMDBcbiAgICBzcGF3blRpbWVyOiAwXG5cbiAgICBjb25zdHJ1Y3RvcjogKEBnYW1lKS0+XG5cbiAgICAgICAgIyBDYWxsIHRoZSBncm91cCBjb25zdHJ1Y3RvclxuICAgICAgICBzdXBlciBAZ2FtZVxuXG4gICAgICAgICMgQ3JlYXRlIGEgcG9vbCBvZiBhc3Rlcm9pZHNcbiAgICAgICAgIyBAYXN0ZXJvaWRHcm91cCA9IEBnYW1lLmFkZC5ncm91cCgpXG4gICAgICAgIEBlbmFibGVCb2R5ID0gdHJ1ZVxuICAgICAgICBAcGh5c2ljc0JvZHlUeXBlID0gUGhhc2VyLlBoeXNpY3MuQVJDQURFXG4gICAgICAgIEBjcmVhdGVNdWx0aXBsZShATUFYX0FTVEVST0lEUywgJ3BhcnRpY2xlJywgMClcblxuICAgICAgICAjIENyZWF0ZSBhIHRpbWVyIGZvciBzcGF3bmluZyBhIG5ldyBhc3Rlcm9pZFxuICAgICAgICBAc3Bhd25UaW1lciA9IDBcblxuICAgICAgICAjIGFkZCBvdXJzZWx2ZXMgdG8gdGhlIGdhbWUgc3RhdGVcbiAgICAgICAgIyBnYW1lLmFkZC5leGlzdGluZyB0aGlzXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcblxuXG4gICAgdXBkYXRlOiAoKS0+XG4gICAgICAgICMgU3Bhd24gYSBuZXcgYXN0ZXJvaWRcbiAgICAgICAgQHNwYXduVGltZXIgLT0gQGdhbWUudGltZS5lbGFwc2VkXG4gICAgICAgIGlmIChAc3Bhd25UaW1lciA8PSAwKVxuICAgICAgICAgICAgQHNwYXduVGltZXIgPSBAZ2FtZS5ybmQuaW50ZWdlckluUmFuZ2UoNSwgNTApXG4gICAgICAgICAgICBAY3JlYXRlTmV3QXN0ZXJvaWQoKVxuXG5cbiAgICBjcmVhdGVOZXdBc3Rlcm9pZDogKCkgLT5cbiAgICAgICAgYXN0ZXJvaWQgPSBAZ2V0Rmlyc3REZWFkKCkgIyBSZWN5Y2xlIGEgZGVhZCBhc3Rlcm9pZFxuXG4gICAgICAgIGlmIChhc3Rlcm9pZClcbiAgICAgICAgICAgIGR4ID0gMFxuICAgICAgICAgICAgZHkgPSAwXG4gICAgICAgICAgICBzbG93ID0gMTBcbiAgICAgICAgICAgIGZhc3QgPSA1MFxuICAgICAgICAgICAgd2hpbGUgKGR4IDwgc2xvdyAmJiBkeCA+IC1zbG93ICYmIGR5IDwgc2xvdyAmJiBkeSA+IC1zbG93KVxuICAgICAgICAgICAgICAgIGR4ID0gQGdhbWUucm5kLmJldHdlZW4oLWZhc3QsIGZhc3QpXG4gICAgICAgICAgICAgICAgZHkgPSBAZ2FtZS5ybmQuYmV0d2VlbigtZmFzdCwgZmFzdClcblxuICAgICAgICAgICAgc3ggPSBpZiBkeCA+IDAgdGhlbiAwIGVsc2UgQGdhbWUud29ybGQud2lkdGhcbiAgICAgICAgICAgIHN5ID0gaWYgZHkgPiAwIHRoZW4gMCBlbHNlIEBnYW1lLndvcmxkLmhlaWdodFxuXG4gICAgICAgICAgICBkaXJlY3Rpb24gPSBAZ2FtZS5ybmQucGljayhbJ2gnLCAndiddKVxuICAgICAgICAgICAgc3ggPSBpZiBkaXJlY3Rpb24gPT0gJ2gnIHRoZW4gQGdhbWUucm5kLmJldHdlZW4oMCwgQGdhbWUud29ybGQud2lkdGgpIGVsc2Ugc3hcbiAgICAgICAgICAgIHN5ID0gaWYgZGlyZWN0aW9uID09ICd2JyB0aGVuIEBnYW1lLnJuZC5iZXR3ZWVuKDAsIEBnYW1lLndvcmxkLmhlaWdodCkgZWxzZSBzeVxuXG4gICAgICAgICAgICAjIGFzdGVyb2lkLnJlc2V0KEBnYW1lLndvcmxkLndpZHRoICsgMTAwLCBAZ2FtZS53b3JsZC5oZWlnaHQgLSA0OCkgIyBQb3NpdGlvbiBvbiBncm91bmRcbiAgICAgICAgICAgIGFzdGVyb2lkLnJlc2V0KHN4LCBzeSkgIyBQb3NpdGlvbiBvbiBncm91bmRcbiAgICAgICAgICAgIGFzdGVyb2lkLnJldml2ZSgpICMgU2V0IFwiYWxpdmVcIlxuXG4gICAgICAgICAgICAjIHNldCBhIHJhbmRvbSBzY2FsZSBhbmQgYWxwaGFcbiAgICAgICAgICAgIGRlcHRoID0gQGdhbWUucm5kLnJlYWxJblJhbmdlKDAuMSwgMC44KVxuICAgICAgICAgICAgIyBhc3Rlcm9pZC5zY2FsZSA9IGRlcHRoXG4gICAgICAgICAgICBhc3Rlcm9pZC5hbHBoYSA9IGRlcHRoXG5cbiAgICAgICAgICAgIGFzdGVyb2lkLmJvZHkudmVsb2NpdHkuc2V0VG8oMCwgMCkgIyBTdG9wIG1vdmluZ1xuICAgICAgICAgICAgYXN0ZXJvaWQuYm9keS5hY2NlbGVyYXRpb24uc2V0VG8oMCwgMCkgIyBTdG9wIGFjY2VsZXJhdGluZ1xuXG4gICAgICAgICAgICAjIFNldCBpbml0aWFsIG1vdmVtZW50XG4gICAgICAgICAgICBhc3Rlcm9pZC5ib2R5LnZlbG9jaXR5LnggPSBkeFxuICAgICAgICAgICAgYXN0ZXJvaWQuYm9keS52ZWxvY2l0eS55ID0gZHlcblxuICAgICAgICAgICAgIyBTZXQgcmFuZG9tIHJvdGF0aW9uXG4gICAgICAgICAgICBhc3Rlcm9pZC5yb3RhdGlvbiA9IFBoYXNlci5NYXRoLmRlZ1RvUmFkKEBnYW1lLnJuZC5hbmdsZSgpKSAjIFJlc2V0IHJvdGF0aW9uXG5cbiAgICAgICAgICAgICMgU2V0IGFuaW1hdGlvbiBmcmFtZSB0byAwXG4gICAgICAgICAgICBhc3Rlcm9pZC5mcmFtZSA9IDBcblxuICAgICAgICAgICAgIyBDZW50ZXIgc3ByaXRlXG4gICAgICAgICAgICBhc3Rlcm9pZC5hbmNob3Iuc2V0VG8oMC41LCAwLjUpXG5cbiAgICAgICAgICAgICMgQXN0ZXJvaWRzIHNob3VsZCBraWxsIHRoZW1zZWx2ZXMgd2hlbiB0aGV5IGxlYXZlIHRoZSB3b3JsZC5cbiAgICAgICAgICAgICMgUGhhc2VyIHRha2VzIGNhcmUgb2YgdGhpcyBmb3IgbWUgYnkgc2V0dGluZyB0aGlzIGZsYWdcbiAgICAgICAgICAgICMgYnV0IHlvdSBjYW4gZG8gaXQgeW91cnNlbGYgYnkga2lsbGluZyB0aGUgYXN0ZXJvaWQgaWZcbiAgICAgICAgICAgICMgaXRzIHgseSBjb29yZGluYXRlcyBhcmUgb3V0c2lkZSBvZiB0aGUgd29ybGQuXG4gICAgICAgICAgICBhc3Rlcm9pZC5jaGVja1dvcmxkQm91bmRzID0gdHJ1ZVxuICAgICAgICAgICAgYXN0ZXJvaWQub3V0T2ZCb3VuZHNLaWxsID0gdHJ1ZVxuIiwiY2xhc3MgZXhwb3J0cy5KdWljZVxuXG4gICAgY29uc3RydWN0b3I6IChAZ2FtZSktPlxuXG4gICAgICAgIEBkZWZhdWx0U291bmRWb2x1bWUgPSAxXG5cbiAgICAgICAgIyBBZGQgc291bmRzXG4gICAgICAgIEBzbmRUaWxlID0gZ2FtZS5hZGQuc291bmQoJ3NuZFRpbGUnLCBAZGVmYXVsdFNvdW5kVm9sdW1lKVxuICAgICAgICBAc25kVGlsZS5hbGxvd011bHRpcGxlID0gdHJ1ZVxuXG4gICAgICAgIEBzbmRNaXNzaWxlID0gZ2FtZS5hZGQuc291bmQoJ3NuZE1pc3NpbGUnLCBAZGVmYXVsdFNvdW5kVm9sdW1lKVxuICAgICAgICBAc25kTWlzc2lsZS5hbGxvd011bHRpcGxlID0gdHJ1ZVxuXG4gICAgICAgIEBzbmRUZWxlcG9ydCA9IGdhbWUuYWRkLnNvdW5kKCdzbmRUZWxlcG9ydCcsIEBkZWZhdWx0U291bmRWb2x1bWUpXG4gICAgICAgIEBzbmRUZWxlcG9ydC5hbGxvd011bHRpcGxlID0gdHJ1ZVxuXG4gICAgICAgIEBzbmRQbGFjZSA9IEBnYW1lLmFkZC5zb3VuZCgnc25kUGxhY2UnKVxuICAgICAgICBAc25kUGxhY2UuYWxsb3dNdWx0aXBsZSA9IHRydWVcblxuICAgICAgICAjIHBhcnRpY2xlc1xuICAgICAgICBAZW1pdHRlciA9IGdhbWUuYWRkLmVtaXR0ZXIoMCwgMCwgMTAwMClcblxuICAgICAgICBAZW1pdHRlci5tYWtlUGFydGljbGVzKCdwYXJ0aWNsZScpXG4gICAgICAgIEBlbWl0dGVyLmdyYXZpdHkgPSAzMDBcblxuXG4gICAgICAgIHJldHVybiB0aGlzXG5cblxuICAgIHNoYWtlOiAoKS0+XG4gICAgICAgIEBnYW1lLmFkZC50d2VlbihAZ2FtZS5jYW1lcmEpXG4gICAgICAgICAgICAuZnJvbSh7IHk6IEBnYW1lLmNhbWVyYS55IC0gNSB9LCA1MCwgUGhhc2VyLkVhc2luZy5TaW51c29pZGFsLkluT3V0LCBmYWxzZSwgMCwgNCwgdHJ1ZSlcbiAgICAgICAgICAgIC5zdGFydCgpXG4gICAgICAgICMgY29uc29sZS5sb2cgJ3NoYWtlIHNoYWtlISdcblxuICAgIHNwbG9kZTogKHgsIHkpLT5cbiAgICAgICAgIyAgUG9zaXRpb24gdGhlIGVtaXR0ZXIgd2hlcmUgdGhlIG1vdXNlL3RvdWNoIGV2ZW50IHdhc1xuICAgICAgICBAZW1pdHRlci54ID0geFxuICAgICAgICBAZW1pdHRlci55ID0geVxuXG4gICAgICAgICMgIFRoZSBmaXJzdCBwYXJhbWV0ZXIgc2V0cyB0aGUgZWZmZWN0IHRvIFwiZXhwbG9kZVwiIHdoaWNoIG1lYW5zIGFsbCBwYXJ0aWNsZXMgYXJlIGVtaXR0ZWQgYXQgb25jZVxuICAgICAgICAjICBUaGUgc2Vjb25kIGdpdmVzIGVhY2ggcGFydGljbGUgYSAyMDAwbXMgbGlmZXNwYW5cbiAgICAgICAgIyAgVGhlIHRoaXJkIGlzIGlnbm9yZWQgd2hlbiB1c2luZyBidXJzdC9leHBsb2RlIG1vZGVcbiAgICAgICAgIyAgVGhlIGZpbmFsIHBhcmFtZXRlciAoMTApIGlzIGhvdyBtYW55IHBhcnRpY2xlcyB3aWxsIGJlIGVtaXR0ZWQgaW4gdGhpcyBzaW5nbGUgYnVyc3RcbiAgICAgICAgQGVtaXR0ZXIuc3RhcnQodHJ1ZSwgMjUwLCBudWxsLCA1KVxuXG4gICAgcGV3OiAoKSAtPlxuICAgICAgICBAc25kTWlzc2lsZS5wbGF5KClcblxuICAgIGZvb3NoOiAoeDEsIHkxLCB4MiwgeTIpLT5cbiAgICAgICAgQHNuZFRlbGVwb3J0LnBsYXkoKVxuICAgICAgICBAc3Bsb2RlIHgxLCB5MVxuICAgICAgICBAc3Bsb2RlIHgyLCB5MlxuXG4gICAgYnVpbGQ6ICgpIC0+XG4gICAgICAgIEBzbmRQbGFjZS5wbGF5KClcblxuICAgIHBsb3A6ICh4LCB5KS0+XG4gICAgICAgICMgcGxheSBhIG5ldyBwbG9wIHNvdW5kXG4gICAgICAgICMgc25kVGlsZSA9IGdhbWUuYWRkLnNvdW5kKCdzbmRUaWxlJywgQGRlZmF1bHRTb3VuZFZvbHVtZSlcbiAgICAgICAgQHNuZFRpbGUucGxheSgpXG5cbiAgICAgICAgQHNwbG9kZSB4LCB5XG5cbiAgICBwb3BUZXh0OiAoeCwgeSwgbXNnKS0+XG4gICAgICAgIHRleHQgPSBAZ2FtZS5hZGQudGV4dCB4LCB5LCBtc2csIHtmaWxsOiAnd2hpdGUnLCBmb250OiAnQm9sZCAxMXB0IEFyaWFsJ31cbiAgICAgICAgQGdhbWUuYWRkLnR3ZWVuIHRleHRcbiAgICAgICAgICAgIC50byh7IHk6IHRleHQueSAtIDMyIH0sIDUwMCwgIFBoYXNlci5FYXNpbmcuUXVhZHJhdGljLk91dCwgdHJ1ZSlcbiAgICAgICAgICAgIC5vbkNvbXBsZXRlLmFkZChcbiAgICAgICAgICAgICAgICAoKS0+XG4gICAgICAgICAgICAgICAgICAgIEBkZXN0cm95KClcbiAgICAgICAgICAgICAgICAsIHRleHQpXG5cbiIsIkp1aWNlID0gcmVxdWlyZShcIi4vSnVpY2VcIikuSnVpY2VcbkZ4RmxvYXRpbmdTcGFya2xlcyA9IHJlcXVpcmUoXCIuL0Z4RmxvYXRpbmdTcGFya2xlc1wiKS5GeEZsb2F0aW5nU3BhcmtsZXNcblxuUGxheWVyID0gcmVxdWlyZShcIi4vUGxheWVyXCIpLlBsYXllclxuQnVpbGRpbmcgPSByZXF1aXJlKFwiLi9CdWlsZGluZ1wiKS5CdWlsZGluZ1xuXG5FbmVteSA9IHJlcXVpcmUoXCIuL0VuZW15XCIpLkVuZW15XG5cblN0b2NrcGlsZSA9IHJlcXVpcmUoJy4vU3RvY2twaWxlJykuU3RvY2twaWxlXG5cbndpbmRvdy5vbmxvYWQgPSAoKS0+XG5cbiAgICAjIE9uIHdpbmRvdyBsb2FkLCBjcmVhdGUgdGhlIFBoYXNlciBnYW1lIG9iamVjdCxcbiAgICAjICBhbmQgbG9hZCBnYW1lc3RhdGUgYXMgdGhlIGluaXRpYWwgc3RhdGVcbiAgICB3aW5kb3cuZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZSg2NDAsIDY0MCwgUGhhc2VyLkNBTlZBUywgJ2dhbWUtY29udGFpbmVyJywgZ2FtZXN0YXRlKVxuXG5nYW1lc3RhdGUgPVxuICAgIHByZWxvYWQ6ICgpLT5cbiAgICAgICAgIyBMb2FkIHVzIHNvbWUgYXNzZXRzXG4gICAgICAgICMgZ2FtZS5sb2FkLmltYWdlICdwbGF5ZXInLCAnYXNzZXRzL2ltZy9wbGF5ZXIucG5nJ1xuICAgICAgICBnYW1lLmxvYWQuaW1hZ2UgJ3RpbGVTZWxlY3QnLCAnYXNzZXRzL2ltZy9zdGFyMS5wbmcnXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZSAnc3RhcjInLCAnYXNzZXRzL2ltZy9zdGFyMi5wbmcnXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZSAnbWlzc2lsZScsICdhc3NldHMvaW1nL3N0YXIzLnBuZydcbiAgICAgICAgZ2FtZS5sb2FkLmltYWdlICdwYXJ0aWNsZScsICdhc3NldHMvaW1nL2ZsYXNoLnBuZydcblxuICAgICAgICAjIGxvYWQgc29tZSBidWlsZGluZyBzcHJpdGVzXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZSAnYnVpbGRpbmdUZXN0JywgJ2Fzc2V0cy9pbWcvYnVpbGRpbmdUZXN0LnBuZydcblxuICAgICAgICAjIGxvYWQgdGhlIHBsYXllciBzcHJpdGVzaGVldFxuICAgICAgICBnYW1lLmxvYWQuc3ByaXRlc2hlZXQgJ3BsYXllcicsICdhc3NldHMvaW1nL3BsYXllci5wbmcnLCAzMiwgMzJcblxuICAgICAgICAjIGxvYWQgYW4gZW5lbXkgc3ByaXRlc2hlZXRcbiAgICAgICAgZ2FtZS5sb2FkLnNwcml0ZXNoZWV0ICdlbmVteScsICdhc3NldHMvaW1nL2VuZW15LnBuZycsIDY0LCA2NFxuXG4gICAgICAgICMgTG9hZCB0aWxlc1xuICAgICAgICBnYW1lLmxvYWQuaW1hZ2UgJ3RpbGVzJywgJ2Fzc2V0cy9pbWcvdGlsZXMucG5nJ1xuXG4gICAgICAgICMgbG9hZCBzb21lIHNvdW5kc1xuICAgICAgICBnYW1lLmxvYWQuYXVkaW8oJ3NuZE1pc3NpbGUnLCAnYXNzZXRzL3NuZC9zdGVhbS5vZ2cnKVxuICAgICAgICBnYW1lLmxvYWQuYXVkaW8oJ3NuZFRlbGVwb3J0JywgJ2Fzc2V0cy9zbmQvY2xvdGgyLm9nZycpXG4gICAgICAgIGdhbWUubG9hZC5hdWRpbygnc25kUGxhY2UnLCAnYXNzZXRzL3NuZC9jbG90aDIub2dnJylcbiAgICAgICAgIyBnYW1lLmxvYWQuYXVkaW8oJ3NuZFRpbGUnLCAnYXNzZXRzL3NuZC9yb2xsb3ZlcjEud2F2JylcbiAgICAgICAgIyBnYW1lLmxvYWQuYXVkaW8oJ3NuZFRpbGUnLCAnYXNzZXRzL3NuZC9yb2xsb3ZlcjIud2F2JylcbiAgICAgICAgIyBnYW1lLmxvYWQuYXVkaW8oJ3NuZFRpbGUnLCAnYXNzZXRzL3NuZC9yb2xsb3ZlcjMud2F2JylcbiAgICAgICAgIyBnYW1lLmxvYWQuYXVkaW8oJ3NuZFRpbGUnLCAnYXNzZXRzL3NuZC9yb2xsb3ZlcjQud2F2JylcbiAgICAgICAgIyBnYW1lLmxvYWQuYXVkaW8oJ3NuZFRpbGUnLCAnYXNzZXRzL3NuZC9yb2xsb3ZlcjUud2F2JylcbiAgICAgICAgZ2FtZS5sb2FkLmF1ZGlvKCdzbmRUaWxlJywgJ2Fzc2V0cy9zbmQvcm9sbG92ZXI2LndhdicpXG5cblxuICAgIGNyZWF0ZTogKCktPlxuICAgICAgICAjICMgQWRkIGEgSGVsbG8gV29ybGQgbWVzc2FnZVxuICAgICAgICAjIGZvbyA9IGdhbWUuYWRkLnRleHQgMTAsIDEwLCBcIkhlbGxvIFdvcmxkXCIsIHtmaWxsOiAnd2hpdGUnfVxuXG4gICAgICAgICMgQWRkIGEgcmVnaXN0cnkgb2JqZWN0IHRvIHRoZSBnYW1lIHNjb3BlIHRvIGtlZXAgdHJhY2sgb2Ygc29tZSBnbG9iYWwgcmVmZXJlbmNlc1xuICAgICAgICBAZ2FtZS5yZWcgPSB7fVxuXG4gICAgICAgICMgQWRkIGEgc2hvcnRjdXQgdG8gdGhlIGdhbWUgdWkgKFRPRE86IG1ha2UgaXQgYSBjbGFzcyBleHRlbmRpbmcgZ3JvdXApXG4gICAgICAgIEBnYW1lLnVpID0ge31cblxuICAgICAgICBAY3JlYXRlU3RvY2twaWxlKClcbiAgICAgICAgQGNyZWF0ZU5leHRUdXJuU2lnbmFsKClcblxuICAgICAgICAjIENyZWF0ZSBmbG9hdGluZyBzcGFya2xlcyBiYWNrZ3JvdW5kIGVmZmVjdFxuICAgICAgICBAc3BhcmtsZXMgPSBuZXcgRnhGbG9hdGluZ1NwYXJrbGVzKGdhbWUpXG5cbiAgICAgICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgICAgICMgIENyZWF0ZXMgYSBibGFuayB0aWxlbWFwXG4gICAgICAgIEBtYXAgPSBnYW1lLmFkZC50aWxlbWFwKClcblxuICAgICAgICAjICBBZGQgYSBUaWxlc2V0IGltYWdlIHRvIHRoZSBtYXBcbiAgICAgICAgQG1hcC5hZGRUaWxlc2V0SW1hZ2UoJ3RpbGVzJylcblxuICAgICAgICAjIGluY3JlYXNlIHRoZSB0aWxlbWFwIGJpYXMgaW4gdGhlIHBoeXNpY3Mgc3lzdGVtIHRvIHByZXZlbnQgY2xpcHBpbmcgaW50byB0aWxlc1xuICAgICAgICAjIGdhbWUucGh5c2ljcy5hcmNhZGUuVElMRV9CSUFTID0gNjRcblxuICAgICAgICBNQVBfV0lEVEggPSA0MFxuICAgICAgICBNQVBfSEVJR0hUID0gMzBcblxuICAgICAgICAjICBDcmVhdGVzIGEgbmV3IGJsYW5rIGxheWVyIGFuZCBzZXRzIHRoZSBtYXAgZGltZW5zaW9ucy5cbiAgICAgICAgIyAgSW4gdGhpcyBjYXNlIHRoZSBtYXAgaXMgNDB4MzAgdGlsZXMgaW4gc2l6ZSBhbmQgdGhlIHRpbGVzIGFyZSAzMngzMiBwaXhlbHMgaW4gc2l6ZS5cbiAgICAgICAgbGF5ZXIxID0gQG1hcC5jcmVhdGUoJ2xldmVsMScsIE1BUF9XSURUSCwgTUFQX0hFSUdIVCwgMzIsIDMyKVxuICAgICAgICAjIGxheWVyMS5zY3JvbGxGYWN0b3JYID0gMC41XG4gICAgICAgICMgbGF5ZXIxLnNjcm9sbEZhY3RvclkgPSAwLjVcblxuICAgICAgICAjICBSZXNpemUgdGhlIHdvcmxkXG4gICAgICAgIGxheWVyMS5yZXNpemVXb3JsZCgpXG5cbiAgICAgICAgIyBsYXllcjEuZGVidWcgPSB0cnVlXG5cbiAgICAgICAgQGN1cnJlbnRMYXllciA9IGxheWVyMVxuICAgICAgICBAY3VycmVudFRpbGUgPSA3XG5cbiAgICAgICAgIyBAbWFwLnB1dFRpbGUoQGN1cnJlbnRUaWxlLCAwLCAwLCBAY3VycmVudExheWVyKVxuICAgICAgICBAbWFwLmZpbGwoQGN1cnJlbnRUaWxlLCAwLCAwLCBNQVBfV0lEVEgsIE1BUF9IRUlHSFQsIEBjdXJyZW50TGF5ZXIpXG5cbiAgICAgICAgIyBtYWtlIGEgbGl0dGxlIGlzbGFuZFxuICAgICAgICBAY3VycmVudFRpbGUgPSAwXG4gICAgICAgIEBtYXAuZmlsbChAY3VycmVudFRpbGUsIDEwLCAxMCwgMTgsIDEwLCBAY3VycmVudExheWVyKVxuXG5cbiAgICAgICAgQGdhbWUuY3VycmVudExldmVsID0ge1xuICAgICAgICAgICAgdGlsZW1hcDogQG1hcCxcbiAgICAgICAgICAgIGN1cnJlbnRMYXllcjogQGN1cnJlbnRMYXllcixcbiAgICAgICAgfVxuXG4gICAgICAgICMgc2V0IGNvbGxpc2lvbiBvbiB0aGUgdGlsZW1hcFxuICAgICAgICAjIHRoaXMgaXMgZG9uZSBhZnRlciBnZW5lcmF0aW5nIHRoZSBtYXAgc28gdGhhdCBjb2xsaXNpb24gd2lsbCB1cGRhdGUgcHJvcGVybHlcbiAgICAgICAgIyB0aGUgZmlsbCBjb21tYW5kIGRvZXNuJ3Qgc2VlbSB0byB1cGRhdGUgdGhlIGNvbGxpc2lvbiBib3hlc1xuICAgICAgICBAbWFwLnNldENvbGxpc2lvbihbIDcgXSwgdHJ1ZSwgJ2xldmVsMScpXG5cbiAgICAgICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cblxuICAgICAgICAjIENyZWF0ZSBhIHBsYXllciBvYmplY3RcbiAgICAgICAgQHBsYXllciA9IG5ldyBQbGF5ZXIoZ2FtZSlcblxuICAgICAgICAjIENyZWF0ZSBhbiBlbmVteSBvYmplY3RcbiAgICAgICAgQGVuZW15ID0gbmV3IEVuZW15KGdhbWUsIEBwbGF5ZXIpXG5cblxuICAgICAgICAjIEhhdmUgdGhlIGNhbWVyYSBmb2xsb3cgdGhlIHBsYXllclxuICAgICAgICBAZ2FtZS5jYW1lcmEuZm9sbG93IEBwbGF5ZXIsIFBoYXNlci5DYW1lcmEuRk9MTE9XX1RPUERPV05fVElHSFRcblxuICAgICAgICAjIGFkZCB1cyBhIGp1aWNlXG4gICAgICAgIEBnYW1lLmp1aWNlID0gbmV3IEp1aWNlKEBnYW1lKVxuXG4gICAgICAgICMgYWRkIG5leHQgdHVybiBrZXlcbiAgICAgICAgQGdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5FTlRFUikub25VcC5hZGQoXG4gICAgICAgICAgICAoKS0+XG4gICAgICAgICAgICAgICAgIyBjb25zb2xlLmxvZyAna2V5IGNhbGxiYWNrIGNvbnRleHQ6ICAnXG4gICAgICAgICAgICAgICAgIyBjb25zb2xlLmxvZyBAXG4gICAgICAgICAgICAgICAgQGdhbWUub25OZXh0VHVybi5kaXNwYXRjaCgpXG4gICAgICAgIClcblxuICAgICAgICAjIGFkZCBzb3J0IGtleVxuICAgICAgICBAZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLlopLm9uVXAuYWRkKFxuICAgICAgICAgICAgKCktPlxuICAgICAgICAgICAgICAgICMgY29uc29sZS5sb2cgJ2tleSBjYWxsYmFjayBjb250ZXh0OiAgJ1xuICAgICAgICAgICAgICAgICMgY29uc29sZS5sb2cgQFxuICAgICAgICAgICAgICAgIEBnYW1lLndvcmxkLnNvcnQoJ3knKVxuICAgICAgICApXG5cbiAgICAgICAgIyBhZGQgYSB1aSBncm91cCBvbiB0b3Agb2YgZXZlcnl0aGluZ1xuICAgICAgICBAZ2FtZS51aS5ncm91cCA9IEBnYW1lLmFkZC5ncm91cCgpXG4gICAgICAgIEBnYW1lLnVpLmdyb3VwLmZpeGVkVG9DYW1lcmEgPSB0cnVlXG4gICAgICAgIEBnYW1lLnVpLnRvb2x0aXAgPSBAZ2FtZS5hZGQudGV4dCgwLCAwLCAnJywge2ZpbGw6ICd3aGl0ZScsIGZvbnQ6ICcxMXB0IEFyaWFsJ30pXG4gICAgICAgIEBnYW1lLnVpLnRvb2x0aXAudGFyZ2V0ID0gbnVsbFxuXG4gICAgICAgICMgU2hvdyBEZWJ1ZyBTdGF0dXMgdGV4dFxuICAgICAgICBAZ2FtZS50aW1lLmFkdmFuY2VkVGltaW5nID0gdHJ1ZVxuICAgICAgICBAc3RhdHVzVGV4dCA9IEBnYW1lLmFkZC50ZXh0KFxuICAgICAgICAgICAgMjAsIDIwLCAnJywgeyBmb250OiAnMTZweCBBcmlhbCcsIGZpbGw6ICcjZmZmZmZmJyB9XG4gICAgICAgIClcbiAgICAgICAgQHN0YXR1c1RleHQuZml4ZWRUb0NhbWVyYSA9IHRydWVcblxuXG4gICAgdXBkYXRlOiAoKS0+XG4gICAgICAgIEBnYW1lLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUoQHBsYXllciwgQGN1cnJlbnRMYXllcilcblxuICAgICAgICAjIHVwZGF0ZSBzdGF0dXMgdGV4dFxuICAgICAgICBAc3RhdHVzVGV4dC5zZXRUZXh0KEBnZXRTdGF0dXNUZXh0KCkpXG5cblxuICAgIGdldFN0YXR1c1RleHQ6ICgpLT5cbiAgICAgICAgc3RhdHVzID0gJydcbiAgICAgICAgc3RhdHVzICs9IEBnYW1lLnRpbWUuZnBzICsgJyBGUFMnICsgJ1xcbidcbiAgICAgICAgc3RhdHVzICs9ICdcXG4nXG4gICAgICAgIHN0YXR1cyArPSAnVE9PTDogJyArIEBwbGF5ZXIudG9vbC5uYW1lICsgJ1xcbidcbiAgICAgICAgc3RhdHVzICs9IEBwbGF5ZXIudG9vbC5nZXRTdGF0dXNUZXh0KCkgKyAnXFxuJ1xuICAgICAgICBzdGF0dXMgKz0gJ1xcbidcbiAgICAgICAgc3RhdHVzICs9ICdTVE9DS1BJTEU6IFxcbidcbiAgICAgICAgc3RhdHVzICs9IEBnYW1lLnJlZy5zdG9ja3BpbGUuZ2V0U3RhdHVzVGV4dCgpXG4gICAgICAgIHJldHVybiBzdGF0dXNcblxuXG4gICAgY3JlYXRlTmV4dFR1cm5TaWduYWw6ICgpLT5cbiAgICAgICAgQGdhbWUub25OZXh0VHVybiA9IG5ldyBQaGFzZXIuU2lnbmFsKClcblxuXG4gICAgY3JlYXRlU3RvY2twaWxlOiAoKS0+XG4gICAgICAgIEBnYW1lLnJlZy5zdG9ja3BpbGUgPSBuZXcgU3RvY2twaWxlKEBnYW1lKVxuXG5cbiAgICAgICAgIyBjb25zb2xlLmxvZyBAZ2FtZS5yZWcuc3RvY2twaWxlXG4iLCJQbGF5ZXJDb250cm9sbGVyID0gcmVxdWlyZShcIi4vUGxheWVyQ29udHJvbGxlclwiKS5QbGF5ZXJDb250cm9sbGVyXG5cblRvb2xNaXNzaWxlID0gcmVxdWlyZShcIi4vVG9vbE1pc3NpbGVcIikuVG9vbE1pc3NpbGVcblRvb2xUZXJyYWluID0gcmVxdWlyZShcIi4vVG9vbFRlcnJhaW5cIikuVG9vbFRlcnJhaW5cblRvb2xUZWxlcG9ydCA9IHJlcXVpcmUoXCIuL1Rvb2xUZWxlcG9ydFwiKS5Ub29sVGVsZXBvcnRcblRvb2xCdWlsZCA9IHJlcXVpcmUoXCIuL1Rvb2xCdWlsZFwiKS5Ub29sQnVpbGRcblxuXG5jbGFzcyBleHBvcnRzLlBsYXllciBleHRlbmRzIFBoYXNlci5TcHJpdGVcbiAgICAjIGhvdyBmYXN0IGNhbiB3ZSBtb3ZlXG4gICAgc3BlZWQ6IDI1MFxuXG4gICAgY29uc3RydWN0b3I6IChAZ2FtZSktPlxuXG4gICAgICAgICMgU2V0IG91ciBwb3NpdGlvbiB0byB0aGUgd29ybGQgY2VudGVyXG4gICAgICAgIHggPSBAZ2FtZS53b3JsZC5jZW50ZXJYXG4gICAgICAgIHkgPSBAZ2FtZS53b3JsZC5jZW50ZXJZXG5cbiAgICAgICAgIyBDYWxsIHRoZSBzcHJpdGUgY29uc3RydWN0b3JcbiAgICAgICAgc3VwZXIgQGdhbWUsIHgsIHksICdwbGF5ZXInXG5cbiAgICAgICAgIyBTZXQgdGhlIGFuY2hvciB0byB0aGUgY2VudGVyIG9mIHRoZSBzcHJpdGVcbiAgICAgICAgQGFuY2hvci5zZXRUbyAwLjUsIDAuNVxuXG4gICAgICAgICMgQWRkIHNvbWUgYW5pbWF0aW9uc1xuICAgICAgICBAYW5pbWF0aW9ucy5hZGQgJ2lkbGUnLCBbMF1cbiAgICAgICAgQGFuaW1hdGlvbnMuYWRkICdjYXN0JywgWzFdXG5cbiAgICAgICAgIyBFbmFibGUgcGh5c2ljc1xuICAgICAgICBAZ2FtZS5waHlzaWNzLmVuYWJsZSBALCBQaGFzZXIuUGh5c2ljcy5BUkNBREVcblxuICAgICAgICAjIEF0dGFjaCBhIGNvbnRyb2xsZXJcbiAgICAgICAgQGNvbnRyb2xsZXIgPSBuZXcgUGxheWVyQ29udHJvbGxlciBAZ2FtZSwgQFxuXG4gICAgICAgICMgYWRkIG91cnNlbHZlcyB0byB0aGUgZ2FtZSBzdGF0ZVxuICAgICAgICBnYW1lLmFkZC5leGlzdGluZyB0aGlzXG5cbiAgICAgICAgIyAjIGNyZWF0ZSB0aGUgTWFnaWMgTWlzc2lsZSBUb29sXG4gICAgICAgICMgQHRvb2wgPSBuZXcgVG9vbE1pc3NpbGUgQGdhbWUsIHRoaXNcblxuICAgICAgICAjIGNyZWF0ZSB0aGUgVGVycmFpbiBUb29sXG4gICAgICAgICMgQHRvb2wgPSBuZXcgVG9vbFRlcnJhaW4gQGdhbWUsIHRoaXNcblxuICAgICAgICBAdG9vbHMgPSBbXG4gICAgICAgICAgICBuZXcgVG9vbE1pc3NpbGUgQGdhbWUsIHRoaXNcbiAgICAgICAgICAgIG5ldyBUb29sVGVsZXBvcnQgQGdhbWUsIHRoaXNcbiAgICAgICAgICAgIG5ldyBUb29sVGVycmFpbiBAZ2FtZSwgdGhpc1xuICAgICAgICAgICAgbmV3IFRvb2xCdWlsZCBAZ2FtZSwgdGhpc1xuICAgICAgICBdXG4gICAgICAgIEBuZXh0VG9vbCgpXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcblxuXG4gICAgdXBkYXRlOiAoKT0+XG5cbiAgICAgICAgIyBVcGRhdGUgdGhlIHBsYXllciBjb250cm9sbGVyXG4gICAgICAgIEBjb250cm9sbGVyLnVwZGF0ZSgpXG5cbiAgICAgICAgIyBVcGRhdGUgb3VyIFRvb2xcbiAgICAgICAgaWYgQHRvb2w/XG4gICAgICAgICAgICBAdG9vbC51cGRhdGUoKVxuXG5cbiAgICBuZXh0VG9vbDogKCktPlxuICAgICAgICAjIGNvbnNvbGUubG9nICdzd2l0Y2hpbmcgZnJvbSAnICsgaWYgQHRvb2wgdGhlbiBAdG9vbC5uYW1lIGVsc2UgJ25vdGhpbmcnXG5cbiAgICAgICAgIyBoaWRlIHRoZSBvbGQgdG9vbFxuICAgICAgICBpZiBAdG9vbFxuICAgICAgICAgICAgQHRvb2wudW5zZWxlY3QoKVxuXG4gICAgICAgICMgZ2V0IHRoZSBuZXh0IHRvb2wgYW5kIHJlbW92ZSBpdCBmcm9tIHRoZSBsaXN0XG4gICAgICAgIEB0b29sID0gQHRvb2xzLnBvcCgpXG5cbiAgICAgICAgIyBzaG93IHRoZSBuZXcgdG9vbFxuICAgICAgICBpZiBAdG9vbFxuICAgICAgICAgICAgQHRvb2xzLnVuc2hpZnQoQHRvb2wpXG4gICAgICAgICAgICAjIHJlYWRkIHRoZSB0b29sIHRvIHRoZWZyb250IG9mIHRoZSBsaXN0XG4gICAgICAgICAgICBAdG9vbC5zZWxlY3QoKVxuXG4gICAgICAgICMgY29uc29sZS5sb2cgJ3RvICcgKyBAdG9vbC5uYW1lXG4iLCJjbGFzcyBleHBvcnRzLlBsYXllckNvbnRyb2xsZXJcblxuICAgIGtleWJvYXJkX21vZGVzOiB7XG4gICAgICAgIFFXRVJUWToge1xuICAgICAgICAgICAgdXA6IFBoYXNlci5LZXlib2FyZC5XXG4gICAgICAgICAgICBkb3duOiBQaGFzZXIuS2V5Ym9hcmQuU1xuICAgICAgICAgICAgbGVmdDogUGhhc2VyLktleWJvYXJkLkFcbiAgICAgICAgICAgIHJpZ2h0OiBQaGFzZXIuS2V5Ym9hcmQuRFxuICAgICAgICB9XG4gICAgICAgIERWT1JBSzoge1xuICAgICAgICAgICAgdXA6IDE4OCAjIENvbW1hXG4gICAgICAgICAgICBkb3duOiBQaGFzZXIuS2V5Ym9hcmQuT1xuICAgICAgICAgICAgbGVmdDogUGhhc2VyLktleWJvYXJkLkFcbiAgICAgICAgICAgIHJpZ2h0OiBQaGFzZXIuS2V5Ym9hcmQuRVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcjogKEBnYW1lLCBAcGxheWVyKS0+XG4gICAgICAgIEBjdXJzb3JzID0gZ2FtZS5pbnB1dC5rZXlib2FyZC5jcmVhdGVDdXJzb3JLZXlzKClcbiAgICAgICAgQHNldEtleW1hcChcIlFXRVJUWVwiKVxuXG4gICAgICAgIEBnYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleUNhcHR1cmUoW1xuICAgICAgICAgICAgUGhhc2VyLktleWJvYXJkLkxFRlQsXG4gICAgICAgICAgICBQaGFzZXIuS2V5Ym9hcmQuUklHSFQsXG4gICAgICAgICAgICBQaGFzZXIuS2V5Ym9hcmQuVVAsXG4gICAgICAgICAgICBQaGFzZXIuS2V5Ym9hcmQuRE9XTixcbiAgICAgICAgICAgIFBoYXNlci5LZXlib2FyZC5XLFxuICAgICAgICAgICAgUGhhc2VyLktleWJvYXJkLlMsXG4gICAgICAgICAgICBQaGFzZXIuS2V5Ym9hcmQuQSxcbiAgICAgICAgICAgIFBoYXNlci5LZXlib2FyZC5ELFxuICAgICAgICAgICAgUGhhc2VyLktleWJvYXJkLlEsXG4gICAgICAgICAgICBQaGFzZXIuS2V5Ym9hcmQuRSxcbiAgICAgICAgICAgIFBoYXNlci5LZXlib2FyZC5TUEFDRUJBUixcbiAgICAgICAgICAgIFBoYXNlci5LZXlib2FyZC5FTlRFUixcbiAgICAgICAgXSk7XG5cbiAgICBzZXRLZXltYXA6IChtb2RlKT0+XG4gICAgICAgIGlmIEBrZXlib2FyZF9tb2Rlc1ttb2RlXT9cbiAgICAgICAgICAgIEBrZXlib2FyZF9tb2RlID0gQGtleWJvYXJkX21vZGVzW21vZGVdXG5cbiAgICB1cGRhdGU6ICgpLT5cblxuICAgICAgICAjIFJlc2V0IHRoZSBwbGF5ZXIncyB2ZWxvY2l0eVxuICAgICAgICBAcGxheWVyLmJvZHkudmVsb2NpdHkueCA9IDBcbiAgICAgICAgQHBsYXllci5ib2R5LnZlbG9jaXR5LnkgPSAwXG5cbiAgICAgICAgIyBTZXQgbGVmdCBvciByaWdodCB2ZWxvY2l0eVxuICAgICAgICBpZiBAY3Vyc29ycy5sZWZ0LmlzRG93biBvciBAZ2FtZS5pbnB1dC5rZXlib2FyZC5pc0Rvd24oQGtleWJvYXJkX21vZGUubGVmdClcbiAgICAgICAgICAgIEBwbGF5ZXIuYm9keS52ZWxvY2l0eS54ID0gLTEgKiBAcGxheWVyLnNwZWVkXG4gICAgICAgIGVsc2UgaWYgQGN1cnNvcnMucmlnaHQuaXNEb3duIG9yIEBnYW1lLmlucHV0LmtleWJvYXJkLmlzRG93bihAa2V5Ym9hcmRfbW9kZS5yaWdodClcbiAgICAgICAgICAgIEBwbGF5ZXIuYm9keS52ZWxvY2l0eS54ID0gQHBsYXllci5zcGVlZFxuXG4gICAgICAgICMgU2V0IHVwIG9yIGRvd24gdmVsb2NpdHlcbiAgICAgICAgaWYgQGN1cnNvcnMudXAuaXNEb3duIG9yIEBnYW1lLmlucHV0LmtleWJvYXJkLmlzRG93bihAa2V5Ym9hcmRfbW9kZS51cClcbiAgICAgICAgICAgIEBwbGF5ZXIuYm9keS52ZWxvY2l0eS55ID0gLTEgKiBAcGxheWVyLnNwZWVkXG4gICAgICAgIGVsc2UgaWYgQGN1cnNvcnMuZG93bi5pc0Rvd24gb3IgQGdhbWUuaW5wdXQua2V5Ym9hcmQuaXNEb3duKEBrZXlib2FyZF9tb2RlLmRvd24pXG4gICAgICAgICAgICBAcGxheWVyLmJvZHkudmVsb2NpdHkueSA9IEBwbGF5ZXIuc3BlZWRcblxuICAgICAgICBpZiBAZ2FtZS5pbnB1dC5rZXlib2FyZC5kb3duRHVyYXRpb24oUGhhc2VyLktleWJvYXJkLlNQQUNFQkFSLCAxMClcbiAgICAgICAgICAgIEBwbGF5ZXIubmV4dFRvb2woKVxuXG4gICAgICAgICMgIyBUT0RPOiB3ZSdsbCB3YW50IHRvIHN3aXRjaCB0aGlzIHNvIHdlJ3ZlIGdvdCBvdXIgY2hlY2stYW1tb1xuICAgICAgICAjICMgc2NyZWVuLCByYXRoZXIgdGhhbiBleHBsaWNpdGx5IHByZXNzaW5nIHRoZSBSIGtleSB0byByZWxvYWRcbiAgICAgICAgIyBpZiBAZ2FtZS5pbnB1dC5rZXlib2FyZC5qdXN0UHJlc3NlZChQaGFzZXIuS2V5Ym9hcmQuUilcbiAgICAgICAgIyAgICAgQHBsYXllci5yZWxvYWRHdW4oKVxuIiwiY2xhc3MgZXhwb3J0cy5TdG9ja3BpbGVcbiAgICBjb25zdHJ1Y3RvcjogKEBnYW1lKSAtPlxuICAgICAgICAjIFJlc291cmNlIG5hbWluZyBjb25zdGFudHNcbiAgICAgICAgQEFFUiA9ICdBZXJlZ2l1bSdcbiAgICAgICAgQERZTiA9ICdEeW5hbWlzJ1xuXG4gICAgICAgIEByZXNvdXJjZXMgPSBbXG4gICAgICAgICAgICB7IG5hbWU6ICdBZXJlZ2l1bScsIGFtb3VudDogMCB9XG4gICAgICAgICAgICB7IG5hbWU6ICdEeW5hbWlzJywgYW1vdW50OiAwIH1cbiAgICAgICAgXVxuXG4gICAgZ2V0U3RhdHVzVGV4dDogKCktPlxuICAgICAgICBzdGF0dXMgPSAnJ1xuICAgICAgICBzdGF0dXMgKz0gcmVzb3VyY2UubmFtZSArICc6ICcgKyByZXNvdXJjZS5hbW91bnQgKyAnXFxuJyBmb3IgcmVzb3VyY2UgaW4gQHJlc291cmNlc1xuICAgICAgICByZXR1cm4gc3RhdHVzXG5cbiAgICBmaW5kOiAocmVzb3VyY2UpLT5cbiAgICAgICAgcmV0dXJuIF8uZmluZChAcmVzb3VyY2VzLCB7IG5hbWU6IHJlc291cmNlIH0pXG5cbiAgICBlYXJuOiAocmVzb3VyY2UsIGFtb3VudCktPlxuICAgICAgICBzdG9jayA9IEBmaW5kKHJlc291cmNlKVxuICAgICAgICBpZiBub3Qgc3RvY2tcbiAgICAgICAgICAgICMgd2UgZG9uJ3QgaGF2ZSB0aGlzIHJlc291cmNlLCBhZGQgYW4gZW50cnkgdG8gdGhlIHN0b2NrcGlsZVxuICAgICAgICAgICAgc3RvY2sgPSB7IG5hbWU6IHJlc291cmNlLCBhbW91bnQ6IDAgIH1cbiAgICAgICAgICAgIEByZXNvdXJjZXMucHVzaChzdG9jaylcbiAgICAgICAgIyBhZGQgc29tZSBvZiB0aGlzIHJlc291cmNlIHRvIG91ciBzdG9ja3NcbiAgICAgICAgc3RvY2suYW1vdW50ICs9IGFtb3VudFxuXG4gICAgY2FuQWZmb3JkOiAocmVzb3VyY2UsIGFtb3VudCktPlxuICAgICAgICBzdG9jayA9IEBmaW5kKHJlc291cmNlKVxuICAgICAgICBpZiBub3Qgc3RvY2tcbiAgICAgICAgICAgICMgd2UgZG9uJ3QgaGF2ZSB0aGlzIHJlc291cmNlIGF0IGFsbFxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICMgd2UgaGF2ZSB0aGlzIHJlc291cmNlLCByZXR1cm4gaWYgd2UgaGF2ZSBlbm91Z2hcbiAgICAgICAgcmV0dXJuIHN0b2NrLmFtb3VudCA+PSBhbW91bnRcblxuICAgIHNwZW5kOiAocmVzb3VyY2UsIGFtb3VudCktPlxuICAgICAgICBpZiBub3QgQGNhbkFmZm9yZChyZXNvdXJjZSwgYW1vdW50KVxuICAgICAgICAgICAgIyB3ZSBjYW4ndCBhZmZvcmQgdGhpcyAtIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICMgd2UgYXJlIGFibGUgdG8gYWZmb3JkIHRoaXMgLSBzcGVuZCBpdFxuICAgICAgICBzdG9jayA9IEBmaW5kKHJlc291cmNlKVxuICAgICAgICBzdG9jay5hbW91bnQgLT0gYW1vdW50XG4gICAgICAgICMgd2Ugc3BlbnQgdGhlIHJlc291cmNlIC0gcmV0dXJuIHRydWVcbiAgICAgICAgcmV0dXJuIHRydWVcbiIsIkJ1aWxkaW5nVGVzdCA9IHJlcXVpcmUoXCIuL0J1aWxkaW5nVGVzdFwiKS5CdWlsZGluZ1Rlc3RcblxuIyBUaGUgYnVpbGQgdG9vbCBhbGxvd3MgdGhlIHBsYXllciB0byBjcmVhdGUgYnVpbGRpbmdzXG5jbGFzcyBleHBvcnRzLlRvb2xCdWlsZFxuXG4gICAgIyB0b29sIG5hbWUgc2hvdWxkIGJlIGRpc3BsYXllZCBpbiB0aGUgc3RhdHVzIGJhclxuICAgIG5hbWU6IFwiQnVpbGRcIlxuXG4gICAgIyB0aW1lIGJldHdlZW4gcmVnaXN0ZXJpbmcgc2VwZXJhdGUgY2xpY2tzXG4gICAgY29vbGRvd246IDEwMCAjIG1zXG5cbiAgICAjIHRoZSBidWlsZGluZyB0byBiZSBjcmVhdGVkXG4gICAgY3VycmVudEJ1aWxkaW5nOiBudWxsXG5cbiAgICBjb25zdHJ1Y3RvcjogKEBnYW1lLCBAcGxheWVyKS0+XG5cbiAgICAgICAgQGNvbnN0cnVjdGluZyA9IGZhbHNlXG5cbiAgICAgICAgIyBDcmVhdGUgYW4gb2JqZWN0IHJlcHJlc2VudGluZyBvdXIgZ3VuXG4gICAgICAgIEBndW4gPSBAZ2FtZS5hZGQuc3ByaXRlIDUwLCBAZ2FtZS5oZWlnaHQvMiwgJ3N0YXIyJ1xuXG4gICAgICAgICMgU2V0IHRoZSBwaXZvdCBwb2ludCB0byB0aGUgY2VudGVyIG9mIHRoZSBndW5cbiAgICAgICAgQGd1bi5hbmNob3Iuc2V0VG8gMC41LCAwLjVcblxuICAgICAgICBAZ3VuLnZpc2libGUgPSBmYWxzZVxuXG4gICAgICAgICMgY3JlYXRlIGEgZ2hvc3QgY3Vyc29yXG4gICAgICAgIEBuZXdHaG9zdChCdWlsZGluZ1Rlc3QpXG5cbiAgICAgICAgQHVuc2VsZWN0KClcblxuICAgICAgICByZXR1cm4gdGhpc1xuXG4gICAgdXBkYXRlOiAoKT0+XG5cbiAgICAgICAgIyBNb3ZlIHRoZSBndW4gdG8gdGhlIHBsYXllclxuICAgICAgICBAZ3VuLnggPSBAcGxheWVyLnhcbiAgICAgICAgQGd1bi55ID0gQHBsYXllci55XG5cbiAgICAgICAgIyBNb3ZlIHRoZSBnaG9zdCBpbWFnZSB0byB0aGUgY3Vyc29yXG4gICAgICAgIEBnaG9zdC54ID0gQGdhbWUuaW5wdXQuYWN0aXZlUG9pbnRlci53b3JsZFhcbiAgICAgICAgQGdob3N0LnkgPSBAZ2FtZS5pbnB1dC5hY3RpdmVQb2ludGVyLndvcmxkWVxuXG5cbiAgICAgICAgaWYgbm90IEBjb25zdHJ1Y3RpbmdcbiAgICAgICAgICAgIGlmIEBnYW1lLmlucHV0Lm1vdXNlUG9pbnRlci5qdXN0UmVsZWFzZWQoQGNvb2xkb3duKVxuICAgICAgICAgICAgICAgIEBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdjYXN0JylcbiAgICAgICAgICAgICAgICBAZ2FtZS5qdWljZS5wbG9wKEBnaG9zdC54LCBAZ2hvc3QueSlcbiAgICAgICAgICAgICAgICBAYnVpbGRHaG9zdCgpXG4gICAgICAgICAgICAgICAgQGNvbnN0cnVjdGluZyA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgaWYgbm90IEBnYW1lLmlucHV0Lm1vdXNlUG9pbnRlci5qdXN0UmVsZWFzZWQoQGNvb2xkb3duKVxuICAgICAgICAgICAgICAgIEBwbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdpZGxlJylcbiAgICAgICAgICAgICAgICBAY29uc3RydWN0aW5nID0gZmFsc2VcblxuICAgIGdldFN0YXR1c1RleHQ6ICgpLT5cbiAgICAgICAgc3RhdHVzID0gJydcbiAgICAgICAgc3RhdHVzICs9ICdidWlsZGluZzogJyArIGlmIEBnaG9zdCB0aGVuIEBnaG9zdC5uYW1lIGVsc2UgJ25vbmUnICsgJ1xcbidcbiAgICAgICAgcmV0dXJuIHN0YXR1c1xuXG4gICAgc2VsZWN0OiAoKS0+XG4gICAgICAgIEBnaG9zdC5yZXZpdmUoKVxuXG4gICAgdW5zZWxlY3Q6ICgpLT5cbiAgICAgICAgQGdob3N0LmtpbGwoKVxuXG5cblxuICAgIG5ld0dob3N0OiAoYnVpbGRpbmdUeXBlKT0+XG4gICAgICAgICMgaWYgd2UndmUgbm90IGNvbnN0cnVjdGVkIHRoZSBnaG9zdCBidWlsZGluZyxcbiAgICAgICAgIyB3ZSdyZSBzd2l0Y2hpbmcgY3Vyc29ycywgc28gZGVzdG9yeSB0aGUgb2xkIG9uZVxuICAgICAgICBpZiBAZ2hvc3QgYW5kIG5vdCBAZ2hvc3QuaXNDb25zdHJ1Y3RlZFxuICAgICAgICAgICAgQGdob3N0LmRlc3Ryb3koKVxuICAgICAgICBAZ2hvc3QgPSBuZXcgYnVpbGRpbmdUeXBlKEBnYW1lKVxuICAgICAgICAjIGNvbnNvbGUubG9nIEBnaG9zdFxuICAgICAgICByZXR1cm4gQGdob3N0XG5cbiAgICBidWlsZEdob3N0OiAoKS0+XG4gICAgICAgIGlmIEBnaG9zdFxuICAgICAgICAgICAgQGdob3N0LmJ1aWxkKClcbiAgICAgICAgICAgICMgQGdob3N0ID0gbnVsbFxuICAgICAgICAgICAgQG5ld0dob3N0KEJ1aWxkaW5nVGVzdClcblxuXG4iLCIjIFRoZSBidWlsZCB0b29sIGFsbG93cyB0aGUgcGxheWVyIHRvIHBsYWNlIHRpbGVzXG5jbGFzcyBleHBvcnRzLlRvb2xNaXNzaWxlXG5cbiAgICAjIHRvb2wgbmFtZSBzaG91bGQgYmUgZGlzcGxheWVkIGluIHRoZSBzdGF0dXMgYmFyXG4gICAgbmFtZTogXCJNYWdpYyBNaXNzaWxlXCJcblxuICAgICMgRGVmaW5lIGNvbnN0YW50c1xuICAgIFNIT1RfREVMQVk6IDI1MCAjIG1pbGxpc2Vjb25kc1xuICAgIEJVTExFVF9TUEVFRDogNDUwICMgcGl4ZWxzL3NlY29uZFxuICAgIE5VTUJFUl9PRl9CVUxMRVRTOiAyMFxuICAgIFJPVEFUSU9OX09GRlNFVDogMFxuICAgIEJVTExFVF9FTkVSR1lfQ09TVDogNTBcblxuICAgIGNvbnN0cnVjdG9yOiAoQGdhbWUsIEBwbGF5ZXIpLT5cblxuICAgICAgICBAUk9UQVRJT05fT0ZGU0VUID0gUGhhc2VyLk1hdGguZGVnVG9SYWQgOTBcblxuICAgICAgICAjIENyZWF0ZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIG91ciBndW5cbiAgICAgICAgQGd1biA9IEBnYW1lLmFkZC5zcHJpdGUgNTAsIEBnYW1lLmhlaWdodC8yLCAnbWlzc2lsZSdcblxuICAgICAgICAjIE1ha2UgdGhlIGd1biBpbnZpc2libGVcbiAgICAgICAgQGd1bi52aXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgIyBTZXQgdGhlIHBpdm90IHBvaW50IHRvIHRoZSBjZW50ZXIgb2YgdGhlIGd1blxuICAgICAgICBAZ3VuLmFuY2hvci5zZXRUbyAwLjUsIDAuNVxuXG4gICAgICAgICMgY3JlYXRlIHNvbWUgYnVsbGV0c1xuICAgICAgICBAY3JlYXRlQnVsbGV0cygpXG5cbiAgICAgICAgQHVuc2VsZWN0KClcblxuICAgICAgICByZXR1cm4gdGhpc1xuXG4gICAgdXBkYXRlOiAoKT0+XG5cbiAgICAgICAgIyBNb3ZlIHRoZSBndW4gdG8gdGhlIHBsYXllclxuICAgICAgICBAZ3VuLnggPSBAcGxheWVyLnhcbiAgICAgICAgQGd1bi55ID0gQHBsYXllci55XG4gICAgICAgICMgQGd1bi5yb3RhdGlvbiA9IEBwbGF5ZXIucm90YXRpb25cbiAgICAgICAgIyBSb3RhdGUgdGhlIGd1biB0byBmYWNlIHRoZSBtb3VzZVxuICAgICAgICBAZ3VuLnJvdGF0aW9uID0gQGdhbWUucGh5c2ljcy5hcmNhZGUuYW5nbGVUb1BvaW50ZXIgQGd1blxuXG4gICAgICAgICMgc2hvdCB0aGUgdGhpbmdzXG4gICAgICAgIGlmIEBmaXJlSW5wdXRJc0FjdGl2ZSgpXG4gICAgICAgICAgICBAcGxheWVyLmFuaW1hdGlvbnMucGxheSgnY2FzdCcpXG4gICAgICAgICAgICBAc2hvb3RCdWxsZXQoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAcGxheWVyLmFuaW1hdGlvbnMucGxheSgnaWRsZScpXG5cbiAgICAgICAgIyBsLWNsaWNrIHRvIGZpcmVcblxuICAgICAgICAjIHItY2xpY2sgdG9cbiAgICAgICAgIyAgIHBpY2sgdGFyZ2V0cz9cbiAgICAgICAgIyAgIGd1aWRlIG1pc3NpbGVzP1xuICAgICAgICAjICAgZGVmZW5kP1xuXG5cbiAgICAjIFRoaXMgZnVuY3Rpb24gc2hvdWxkIHJldHVybiB0cnVlIHdoZW4gdGhlIHBsYXllciBhY3RpdmF0ZXMgdGhlIFwiZmlyZVwiIGNvbnRyb2xcbiAgICAjIEluIHRoaXMgY2FzZSwgZWl0aGVyIGhvbGRpbmcgdGhlIHNwYWNlIGJhclxuICAgIGZpcmVJbnB1dElzQWN0aXZlOiAoKS0+XG4gICAgICAgIGlzQWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgIyBmaXJlS2V5ID0gQGdhbWUuaW5wdXQua2V5Ym9hcmQuaXNEb3duIFBoYXNlci5LZXlib2FyZC5TUEFDRUJBUlxuICAgICAgICBmaXJlQnV0dG9uID0gQGdhbWUuaW5wdXQubW91c2UuYnV0dG9uIGlzIFBoYXNlci5Nb3VzZS5MRUZUX0JVVFRPTlxuXG4gICAgICAgICMgaXNBY3RpdmUgPSBmaXJlS2V5IG9yIGZpcmVCdXR0b25cblxuICAgICAgICByZXR1cm4gZmlyZUJ1dHRvblxuXG5cbiAgICBjcmVhdGVCdWxsZXRzOiAoKS0+XG5cbiAgICAgICAgIyBDcmVhdGUgYW4gb2JqZWN0IHBvb2wgb2YgYnVsbGV0c1xuICAgICAgICBAYnVsbGV0UG9vbCA9IEBnYW1lLmFkZC5ncm91cCgpXG4gICAgICAgIGZvciBpIGluIFswLi5ATlVNQkVSX09GX0JVTExFVFNdXG4gICAgICAgICAgICAjIENyZWF0ZSBlYWNoIGJ1bGxldCBhbmQgYWRkIGl0IHRvIHRoZSBncm91cC5cbiAgICAgICAgICAgIGJ1bGxldCA9IEBnYW1lLmFkZC5zcHJpdGUgMCwgMCwgJ21pc3NpbGUnXG4gICAgICAgICAgICBAYnVsbGV0UG9vbC5hZGQgYnVsbGV0XG5cbiAgICAgICAgICAgICMgU2V0IGl0cyBwaXZvdCBwb2ludCB0byB0aGUgY2VudGVyIG9mIHRoZSBidWxsZXRcbiAgICAgICAgICAgICMgYnVsbGV0LmFuY2hvci5zZXRUbygwLjUsIC0wLjI1KTtcbiAgICAgICAgICAgIGJ1bGxldC5hbmNob3Iuc2V0VG8gMC41LCAwLjVcblxuICAgICAgICAgICAgIyBFbmFibGUgcGh5c2ljcyBvbiB0aGUgYnVsbGV0XG4gICAgICAgICAgICBAZ2FtZS5waHlzaWNzLmVuYWJsZSBidWxsZXQsIFBoYXNlci5QaHlzaWNzLkFSQ0FERVxuXG4gICAgICAgICAgICAjIEdpdmUgdGhlIGJ1bGxldCBhIHBvd2VyIHZhbHVlIHdoaWNoIGl0IHVzZXMgdG8gZGVhbCBkYW1hZ2VcbiAgICAgICAgICAgIGJ1bGxldC5wb3dlciA9IDFcblxuICAgICAgICAgICAgIyBTZXQgaXRzIGluaXRpYWwgc3RhdGUgdG8gXCJkZWFkXCIuXG4gICAgICAgICAgICBidWxsZXQua2lsbCgpO1xuXG5cbiAgICBzaG9vdEJ1bGxldDogKCktPlxuICAgICAgICAjIEVuZm9yY2UgYSBzaG9ydCBkZWxheSBiZXR3ZWVuIHNob3RzIGJ5IHJlY29yZGluZ1xuICAgICAgICAjIHRoZSB0aW1lIHRoYXQgZWFjaCBidWxsZXQgaXMgc2hvdCBhbmQgdGVzdGluZyBpZlxuICAgICAgICAjIHRoZSBhbW91bnQgb2YgdGltZSBzaW5jZSB0aGUgbGFzdCBzaG90IGlzIG1vcmUgdGhhblxuICAgICAgICAjIHRoZSByZXF1aXJlZCBkZWxheS5cbiAgICAgICAgaWYgQGxhc3RCdWxsZXRTaG90QXQgaXMgdW5kZWZpbmVkXG4gICAgICAgICAgICBAbGFzdEJ1bGxldFNob3RBdCA9IDBcbiAgICAgICAgaWYgQGdhbWUudGltZS5ub3cgLSBAbGFzdEJ1bGxldFNob3RBdCA8IEBTSE9UX0RFTEFZXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgQGxhc3RCdWxsZXRTaG90QXQgPSBAZ2FtZS50aW1lLm5vd1xuXG4gICAgICAgICMgR2V0IGEgZGVhZCBidWxsZXQgZnJvbSB0aGUgcG9vbFxuICAgICAgICBidWxsZXQgPSBAYnVsbGV0UG9vbC5nZXRGaXJzdERlYWQoKVxuXG4gICAgICAgICMgSWYgdGhlcmUgYXJlbid0IGFueSBidWxsZXRzIGF2YWlsYWJsZSB0aGVuIGRvbid0IHNob290XG4gICAgICAgIGlmIGJ1bGxldCBpcyBudWxsIG9yIGJ1bGxldCBpcyB1bmRlZmluZWRcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICMgUmV2aXZlIHRoZSBidWxsZXRcbiAgICAgICAgIyBUaGlzIG1ha2VzIHRoZSBidWxsZXQgXCJhbGl2ZVwiXG4gICAgICAgIGJ1bGxldC5yZXZpdmUoKVxuXG4gICAgICAgICMgQnVsbGV0cyBzaG91bGQga2lsbCB0aGVtc2VsdmVzIHdoZW4gdGhleSBsZWF2ZSB0aGUgd29ybGQuXG4gICAgICAgICMgUGhhc2VyIHRha2VzIGNhcmUgb2YgdGhpcyBmb3IgbWUgYnkgc2V0dGluZyB0aGlzIGZsYWdcbiAgICAgICAgIyBidXQgeW91IGNhbiBkbyBpdCB5b3Vyc2VsZiBieSBraWxsaW5nIHRoZSBidWxsZXQgaWZcbiAgICAgICAgIyBpdHMgeCx5IGNvb3JkaW5hdGVzIGFyZSBvdXRzaWRlIG9mIHRoZSB3b3JsZC5cbiAgICAgICAgYnVsbGV0LmNoZWNrV29ybGRCb3VuZHMgPSB0cnVlXG4gICAgICAgIGJ1bGxldC5vdXRPZkJvdW5kc0tpbGwgPSB0cnVlXG5cbiAgICAgICAgIyBTZXQgdGhlIGJ1bGxldCBwb3NpdGlvbiB0byB0aGUgZ3VuIHBvc2l0aW9uLlxuICAgICAgICBidWxsZXQucmVzZXQgQGd1bi54LCBAZ3VuLnlcbiAgICAgICAgYnVsbGV0LnJvdGF0aW9uID0gQGd1bi5yb3RhdGlvbiAtIEBST1RBVElPTl9PRkZTRVRcbiAgICAgICAgIyBjb25zb2xlLmxvZyhidWxsZXQucm90YXRpb24pO1xuXG4gICAgICAgICMgU2hvb3QgaXRcbiAgICAgICAgYnVsbGV0LmJvZHkudmVsb2NpdHkueCA9IE1hdGguY29zKGJ1bGxldC5yb3RhdGlvbiArIEBST1RBVElPTl9PRkZTRVQpICogQEJVTExFVF9TUEVFRFxuICAgICAgICBidWxsZXQuYm9keS52ZWxvY2l0eS55ID0gTWF0aC5zaW4oYnVsbGV0LnJvdGF0aW9uICsgQFJPVEFUSU9OX09GRlNFVCkgKiBAQlVMTEVUX1NQRUVEXG5cbiAgICAgICAgIyBEbyBzb21lIGp1aWNlXG4gICAgICAgIEBnYW1lLmp1aWNlLnBldygpXG5cbiAgICBnZXRTdGF0dXNUZXh0OiAoKS0+XG4gICAgICAgIHJldHVybiAnJ1xuXG4gICAgc2VsZWN0OiAoKS0+XG5cbiAgICB1bnNlbGVjdDogKCktPlxuIiwiIyBUaGUgVGVsZXBvcnQgdG9vbCBhbGxvd3MgdGhlIHBsYXllciB0byB0ZWxlcG9ydFxuY2xhc3MgZXhwb3J0cy5Ub29sVGVsZXBvcnRcblxuICAgICMgdG9vbCBuYW1lIHNob3VsZCBiZSBkaXNwbGF5ZWQgaW4gdGhlIHN0YXR1cyBiYXJcbiAgICBuYW1lOiBcIlRlbGVwb3J0XCJcblxuICAgICMgdGltZSBiZXR3ZWVuIHJlZ2lzdGVyaW5nIHNlcGVyYXRlIGNsaWNrc1xuICAgIGNvb2xkb3duOiAxMDAgIyBtc1xuXG4gICAgY29uc3RydWN0b3I6IChAZ2FtZSwgQHBsYXllciktPlxuXG4gICAgICAgIEB0ZWxlcG9ydGluZyA9IGZhbHNlXG5cbiAgICAgICAgQHVuc2VsZWN0KClcblxuICAgICAgICByZXR1cm4gdGhpc1xuXG4gICAgdXBkYXRlOiAoKT0+XG5cbiAgICAgICAgIyBsLWNsaWNrIHRvIHRlbGVwb3J0XG5cbiAgICAgICAgIyByLWNsaWNrIHRvIHBpY2sgdGlsZXNcblxuICAgICAgICAjIHEgdG8gdG9nZ2xlIHBhbGV0dGVcblxuICAgICAgICAjIGNsaWNrIHRoZSB0aWxlIHBhbGV0dGUgdG8gcGljayBhIHRpbGVcblxuICAgICAgICBpZiBub3QgQHRlbGVwb3J0aW5nXG4gICAgICAgICAgICBpZiBAZ2FtZS5pbnB1dC5tb3VzZVBvaW50ZXIuanVzdFJlbGVhc2VkKEBjb29sZG93bilcbiAgICAgICAgICAgICAgICBAcGxheWVyLmFuaW1hdGlvbnMucGxheSgnY2FzdCcpXG4gICAgICAgICAgICAgICAgQGdhbWUuanVpY2UuZm9vc2goQHBsYXllci54LCBAcGxheWVyLnksIGdhbWUuaW5wdXQuYWN0aXZlUG9pbnRlci53b3JsZFgsIGdhbWUuaW5wdXQuYWN0aXZlUG9pbnRlci53b3JsZFkpXG4gICAgICAgICAgICAgICAgQHBsYXllci54ID0gZ2FtZS5pbnB1dC5hY3RpdmVQb2ludGVyLndvcmxkWFxuICAgICAgICAgICAgICAgIEBwbGF5ZXIueSA9IGdhbWUuaW5wdXQuYWN0aXZlUG9pbnRlci53b3JsZFlcbiAgICAgICAgICAgICAgICBAdGVsZXBvcnRpbmcgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGlmIG5vdCBAZ2FtZS5pbnB1dC5tb3VzZVBvaW50ZXIuanVzdFJlbGVhc2VkKEBjb29sZG93bilcbiAgICAgICAgICAgICAgICBAcGxheWVyLmFuaW1hdGlvbnMucGxheSgnaWRsZScpXG4gICAgICAgICAgICAgICAgQHRlbGVwb3J0aW5nID0gZmFsc2VcblxuICAgIGdldFN0YXR1c1RleHQ6ICgpLT5cbiAgICAgICAgcmV0dXJuICd0ZWxlcG9ydGluZzogJyArIEB0ZWxlcG9ydGluZ1xuXG4gICAgc2VsZWN0OiAoKS0+XG5cbiAgICB1bnNlbGVjdDogKCktPlxuXG5cblxuIiwiIyBUaGUgdGVycmFpbiB0b29sIGFsbG93cyB0aGUgcGxheWVyIHRvIHBsYWNlIHRpbGVzXG5jbGFzcyBleHBvcnRzLlRvb2xUZXJyYWluXG5cbiAgICAjIHRvb2wgbmFtZSBzaG91bGQgYmUgZGlzcGxheWVkIGluIHRoZSBzdGF0dXMgYmFyXG4gICAgbmFtZTogXCJUZXJyYWluXCJcblxuICAgICMgdGhlIHRpbGUgaWQgdGhhdCBpcyBjdXJyZW50bHkgcGlja2VkXG4gICAgY3VycmVudFRpbGVJZDogMFxuXG4gICAgIyB0aGUgdGlsZW1hcCB3ZSdyZSBnb2luZyB0byBiZSBjaGFuZ2luZ1xuICAgIHRpbGVtYXA6IG51bGxcblxuICAgIGNvbnN0cnVjdG9yOiAoQGdhbWUsIEBwbGF5ZXIpLT5cblxuICAgICAgICAjIENyZWF0ZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIG91ciBndW5cbiAgICAgICAgQGd1biA9IEBnYW1lLmFkZC5zcHJpdGUgNTAsIEBnYW1lLmhlaWdodC8yLCAnc3RhcjInXG5cbiAgICAgICAgIyBTZXQgdGhlIHBpdm90IHBvaW50IHRvIHRoZSBjZW50ZXIgb2YgdGhlIGd1blxuICAgICAgICBAZ3VuLmFuY2hvci5zZXRUbyAwLjUsIDAuNVxuXG4gICAgICAgIEBndW4udmlzaWJsZSA9IGZhbHNlXG5cbiAgICAgICAgIyBjcmVhdGUgYSBzZWxlY3Rpb24gY3Vyc29yXG4gICAgICAgIEBzZWxlY3Rpb24gPSBAZ2FtZS5hZGQuc3ByaXRlIDUwLCBAZ2FtZS5oZWlnaHQvMiwgJ3RpbGVTZWxlY3QnXG4gICAgICAgIEBzZWxlY3Rpb24uYW5jaG9yLnNldFRvIDAuNSwgMC41XG5cbiAgICAgICAgQGN1cnJlbnRUaWxlID0gMFxuICAgICAgICBAbWFwID0gQGdhbWUuY3VycmVudExldmVsLnRpbGVtYXBcbiAgICAgICAgQGN1cnJlbnRMYXllciA9IEBnYW1lLmN1cnJlbnRMZXZlbC5jdXJyZW50TGF5ZXJcblxuICAgICAgICBAdW5zZWxlY3QoKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG5cbiAgICBzaG93UGFsbGV0ZTogKCktPlxuICAgICAgICAjIFRPRE86IHNob3cgdGhlIHBhbGxldGUgYXQgdGhlIHRvcCBvZiB0aGUgc2NyZWVuXG5cbiAgICBoaWRlUGFsbGV0ZTogKCktPlxuICAgICAgICAjIFRPRE86IGhpZGUgdGhlIHBhbGV0dGVcblxuICAgIHBpY2tQYWxsZXRlVGlsZTogKCktPlxuICAgICAgICAjIFRPRE86IHBpY2sgYSB0aWxlIGZyb20gdGhlIHBhbGV0dGUgYW5kIHNldCBpdCBhcyBjdXJyZW50XG5cbiAgICAjIHBpY2sgYSB0aWxlIGZyb20gdGhlIHRpbGVtYXAgYW5kIHNldCBpdCBhcyB0aGUgY3VycmVudCB0aWxlXG4gICAgcGlja1RpbGU6ICh4LCB5KS0+XG4gICAgICAgICMgaWYgdGhlIHRpbGVtYXAgaXMgbnVsbCwgcmV0dXJuXG4gICAgICAgIGlmIG5vdCBAdGlsZW1hcD9cbiAgICAgICAgICAgIGNvbnNvbGUubG9nIFwiVG9vbFRlcnJhaW4ucGlja1RpbGU6IEB0aWxlbWFwIGRvZXMgbm90IGV4aXN0XCJcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAjIGdldCBhbmQgYXNzaWduIHRoZSB0aWxlIGlkIGZyb20gdGhlIHRpbGVtYXBcbiAgICAgICAgQGN1cnJlbnRUaWxlSWQgPSAwICMgVE9ETzogZ2V0IHRpbGUgZnJvbSB0aWxlbWFwXG5cbiAgICAjIHJlcGxhY2UgYSB0aWxlIG9uIHRoZSB0aWxlbWFwIHdpdGggdGhlIGN1cnJlbnQgdGlsZVxuICAgIHBhaW50VGlsZTogKHgsIHkpLT5cbiAgICAgICAgIyBpZiB0aGUgdGlsZW1hcCBpcyBudWxsLCByZXR1cm5cbiAgICAgICAgaWYgbm90IEB0aWxlbWFwP1xuICAgICAgICAgICAgY29uc29sZS5sb2cgXCJUb29sVGVycmFpbi5wYWludFRpbGU6IEB0aWxlbWFwIGRvZXMgbm90IGV4aXN0XCJcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAjIFRPRE86IGlmIHRoZSB0aWxlIGF0IHgsIHkgaXMgYWxyZWFkeSB0aGUgY3VycmVudCB0aWxlLCByZXR1cm5cblxuICAgICAgICAjIFRPRE86IHJlcGxhY2UgdGhlIHRpbGVtYXAgYXQgeCwgeSB3aXRoIHRoZSBjdXJyZW50IHRpbGVcblxuICAgICMgdGFrZXMgYSBzZXQgb2Ygc2NyZWVuIGNvb3JkaW5hdGVzIGFuZCB0cmFuc2xhdGVzIHRoZW0gdG8gdGlsZW1hcCBjb29yZHNcbiAgICBjb29yZHNTY3JlZW5Ub1RpbGVtYXA6ICh4LCB5KS0+XG4gICAgICAgICMgVE9ETzogdHJhbnNsYXRlIGFuZCByZXR1cm4gY29vcmRpbmF0ZXNcblxuICAgIHVwZGF0ZTogKCk9PlxuXG4gICAgICAgICMgTW92ZSB0aGUgZ3VuIHRvIHRoZSBwbGF5ZXJcbiAgICAgICAgQGd1bi54ID0gQHBsYXllci54XG4gICAgICAgIEBndW4ueSA9IEBwbGF5ZXIueVxuXG4gICAgICAgICMgTW92ZSB0aGUgc2VsZWN0aW9uIHRvIHRoZSBjdXJzb3JcbiAgICAgICAgQHNlbGVjdGlvbi54ID0gTWF0aC5mbG9vcihAZ2FtZS5pbnB1dC5hY3RpdmVQb2ludGVyLndvcmxkWCAvIDMyKSAqIDMyICsgMTZcbiAgICAgICAgQHNlbGVjdGlvbi55ID0gTWF0aC5mbG9vcihAZ2FtZS5pbnB1dC5hY3RpdmVQb2ludGVyLndvcmxkWSAvIDMyKSAqIDMyICsgMTZcblxuICAgICAgICAjIGwtY2xpY2sgdG8gcGFpbnQgdGlsZXNcblxuICAgICAgICAjIHItY2xpY2sgdG8gcGljayB0aWxlc1xuXG4gICAgICAgICMgcSB0byB0b2dnbGUgcGFsZXR0ZVxuXG4gICAgICAgICMgY2xpY2sgdGhlIHRpbGUgcGFsZXR0ZSB0byBwaWNrIGEgdGlsZVxuXG4gICAgICAgIG1hcmtlclggPSBAY3VycmVudExheWVyLmdldFRpbGVYKGdhbWUuaW5wdXQuYWN0aXZlUG9pbnRlci53b3JsZFgpICogMzJcbiAgICAgICAgbWFya2VyWSA9IEBjdXJyZW50TGF5ZXIuZ2V0VGlsZVkoZ2FtZS5pbnB1dC5hY3RpdmVQb2ludGVyLndvcmxkWSkgKiAzMlxuXG4gICAgICAgIGlmIChAZ2FtZS5pbnB1dC5tb3VzZVBvaW50ZXIuaXNEb3duKVxuICAgICAgICAgICAgQHBsYXllci5hbmltYXRpb25zLnBsYXkoJ2Nhc3QnKVxuICAgICAgICAgICAgIyBAbWFwLnB1dFRpbGUoQGN1cnJlbnRUaWxlLCBAY3VycmVudExheWVyLmdldFRpbGVYKG1hcmtlclgpLCBAY3VycmVudExheWVyLmdldFRpbGVZKG1hcmtlclkpLCBAY3VycmVudExheWVyKVxuICAgICAgICAgICAgaWYgKGdhbWUuaW5wdXQua2V5Ym9hcmQuaXNEb3duKFBoYXNlci5LZXlib2FyZC5TSElGVCkpXG4gICAgICAgICAgICAgICAgQGN1cnJlbnRUaWxlID0gQG1hcC5nZXRUaWxlKEBjdXJyZW50TGF5ZXIuZ2V0VGlsZVgobWFya2VyWCksIEBjdXJyZW50TGF5ZXIuZ2V0VGlsZVkobWFya2VyWSkpLmluZGV4XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgaWYgKEBtYXAuZ2V0VGlsZShAY3VycmVudExheWVyLmdldFRpbGVYKG1hcmtlclgpLCBAY3VycmVudExheWVyLmdldFRpbGVZKG1hcmtlclkpKS5pbmRleCAhPSBAY3VycmVudFRpbGUpXG4gICAgICAgICAgICAgICAgICAgIEBtYXAucHV0VGlsZShAY3VycmVudFRpbGUsIEBjdXJyZW50TGF5ZXIuZ2V0VGlsZVgobWFya2VyWCksIEBjdXJyZW50TGF5ZXIuZ2V0VGlsZVkobWFya2VyWSkpXG4gICAgICAgICAgICAgICAgICAgIEBnYW1lLmp1aWNlLnBsb3AoZ2FtZS5pbnB1dC5hY3RpdmVQb2ludGVyLndvcmxkWCwgZ2FtZS5pbnB1dC5hY3RpdmVQb2ludGVyLndvcmxkWSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHBsYXllci5hbmltYXRpb25zLnBsYXkoJ2lkbGUnKVxuXG4gICAgICAgIGlmIEBnYW1lLmlucHV0LmtleWJvYXJkLmRvd25EdXJhdGlvbihQaGFzZXIuS2V5Ym9hcmQuUSwgMTApXG4gICAgICAgICAgICBAY3VycmVudFRpbGUgPSBQaGFzZXIuTWF0aC5jbGFtcCBAY3VycmVudFRpbGUgLSAxLCAwLCA3XG4gICAgICAgICAgICAjIGNvbnNvbGUubG9nICdjdXJyZW50VGlsZSAtLSB0byAnICsgQGN1cnJlbnRUaWxlXG4gICAgICAgIGlmIEBnYW1lLmlucHV0LmtleWJvYXJkLmRvd25EdXJhdGlvbihQaGFzZXIuS2V5Ym9hcmQuRSwgMTApXG4gICAgICAgICAgICBAY3VycmVudFRpbGUgPSBQaGFzZXIuTWF0aC5jbGFtcCBAY3VycmVudFRpbGUgKyAxLCAwLCA3XG4gICAgICAgICAgICAjIGNvbnNvbGUubG9nICdjdXJyZW50VGlsZSArKyB0byAnICsgQGN1cnJlbnRUaWxlXG5cbiAgICBnZXRTdGF0dXNUZXh0OiAoKS0+XG4gICAgICAgIHN0YXR1cyA9ICcnXG4gICAgICAgIHN0YXR1cyArPSAndGlsZUlEOiAnICsgQGN1cnJlbnRUaWxlICsgJ1xcbidcbiAgICAgICAgcmV0dXJuIHN0YXR1c1xuXG4gICAgc2VsZWN0OiAoKS0+XG4gICAgICAgIEBzZWxlY3Rpb24ucmV2aXZlKClcblxuICAgIHVuc2VsZWN0OiAoKS0+XG4gICAgICAgIEBzZWxlY3Rpb24ua2lsbCgpXG5cblxuXG4iXX0=
