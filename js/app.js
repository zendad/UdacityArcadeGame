(function (global) {
  'use strict';

  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  var entitySize = {
    w: 101,
    h: 83
  };
  var canvasSize = {
    top: 0,
    left: 0,
    right: 505,
    bottom: (6 * entitySize.h) - 15
  };

  function handleMovementBoundaries(moveTo, currPos) {
    switch (moveTo) {
      case 'left':
        console.log('move left');
        currPos.x = currPos.x - entitySize.w >= canvasSize.left ? currPos.x - entitySize.w : currPos.x;
        break;
      case 'right':
        console.log('move right');
        currPos.x = currPos.x + entitySize.w < canvasSize.right ? currPos.x + entitySize.w : currPos.x;
        break;
      case 'up':
        currPos.y = currPos.y - entitySize.h >= canvasSize.top ? currPos.y - entitySize.h : currPos.y;
        console.log('move up');
        break;
      case 'down':
        console.log('move down');
        currPos.y = currPos.y + entitySize.h < canvasSize.bottom ? currPos.y + entitySize.h : currPos.y;
        break;
      default :
        break;
    }

  }

  function generateRandomPosition() {
    return {
      x: randomIntFromInterval(0, 4) * entitySize.w,  //canvas w 505
      y: (randomIntFromInterval(1, 5) * entitySize.h) - 15  //canvas h 606
    };
  }

// Enemies our player must avoid
  var Enemy = (function () {

    function Enemy(startPosition) {
      if (Object.prototype.toString.call(startPosition) !== '[object Object]') {
        startPosition = generateRandomPosition();
      }
      // Variables applied to each of our instances go here,
      // we've provided one for you to get started
      this.x = startPosition.x;
      this.y = startPosition.y;

      // The image/sprite for our enemies, this uses
      // a helper we've provided to easily load images
      this.sprite = Resources.get('images/enemy-bug.png');
    }

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
    Enemy.prototype.update = function (dt) {
      // You should multiply any movement by the dt parameter
      // which will ensure the game runs at the same speed for
      // all computers.
      //var newPosition = generateRandomPosition();
      //this.x = newPosition.x + (newPosition.x*dt);
      //this.y = newPosition.y;
      if (this.x + entitySize.w > canvasSize.right + entitySize.w) {
        this.x = -entitySize.w;
        this.y = generateRandomPosition().y;
        return;
      }
      this.x = this.x + (entitySize.w * dt);
    };

// Draw the enemy on the screen, required method for game
    Enemy.prototype.render = function () {
      ctx.drawImage(this.sprite, this.x, this.y);
    };

    return Enemy;
  })();
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

  var Player = (function (_super) {

    var charImg = {
      M: 'images/char-boy.png',
      F: 'images/char-pink-girl.png'
    };

    /**
     * constructor takes gender as param, if none provided default is 'M' = male
     * @param gender {String}
     * @constructor
     */
    function Player(gender) {

      _super.call(this);

      // The image/sprite for our player, this uses
      // a helper we've provided to easily load images
      this.sprite = Resources.get(charImg[gender || 'M']);

      this.moved = false;
      this.newPosition = {x: this.x, y: this.y};
    }

    // inheritance
    Player.prototype = Object.create(_super.prototype);
    Player.prototype.constructor = Player;

    Player.prototype.update = function () {
      /*if (this.moved) {
        this.x = this.x + (this.newPosition.x * dt);
        this.y = this.y + (this.newPosition.y * dt);
        this.moved = false;
      }*/
    };

    Player.prototype.handleInput = function (moveTo) {
      var currPos = {x: this.x, y: this.y};
      handleMovementBoundaries(moveTo, currPos);
      this.x = currPos.x;
      this.y = currPos.y;
      this.moved = true;
      this.newPosition = currPos;
      /*      switch (moveTo) {
       case 'left':
       console.log('move left');
       this.x -= entitySize.w;
       break;
       case 'right':
       console.log('move right');
       this.x += entitySize.w;
       break;
       case 'up':
       this.y -= entitySize.h;
       console.log('move up');
       break;
       case 'down':
       console.log('move down');
       this.y += entitySize.h;
       break;
       default :
       break;
       }*/
    };

    return Player;
  })(Enemy);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
  document.addEventListener('keyup', function (e) {

    var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
  });

  function init() {

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
    global.allEnemies = [
      new Enemy(),
      new Enemy(),
      new Enemy(),
      new Enemy(),
      new Enemy()
    ];
// Place the player object in a variable called player
    global.player = new Player('M');


  }
  global.resetGame = function(){
    init();
  };

  //Resources.onReady(init);

})(this);