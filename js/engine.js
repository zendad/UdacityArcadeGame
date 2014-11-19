/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {

    //Define variables and create canvas element
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        patterns = {},
        lastTime,
        rAfId,
        collisionOccurred = false;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    // Kickoff point of game loop and calling of the update and render methods.
    function main() {
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        update(dt);

        if (collisionOccurred) {
            win.cancelAnimationFrame(rAfId);
            return;
        }

        render();
        lastTime = now;

        rAfId =win.requestAnimationFrame(main);
    };

    //function to do the initial setup that should only occur once, 
    //particularly setting the lastTime variable that is required for the game loop.
     
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    //function is called by main (our game loop) and itself calls all
    //of the functions which may need to update entity's data. Based on how
    function update(dt) {
        updateEntities(dt);
        if (checkCollisions()) {
            collisionOccurred = true;
            if (win.confirm('Collision occurred! do you wanna start again?')) {
                reset();
                collisionOccurred = false;
            }
        }
    }

    function checkCollisions() {
        return allEnemies.some(function (enemy) {
            if (Math.floor(enemy.x) + 81 >= player.x && Math.floor(enemy.x) <= player.x + 81 && enemy.y === player.y) {
                return true;
            }
        });
    }

    //This is called by the update function  and loops through all of the
    //objects within your allEnemies array as defined in app.js and calls
    //their update() methods.
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    //This function initially draws the "game level", it will then call
    //the renderEntities function. 
    function render() {
        //This array holds the relative URL to the image used
        //for that particular row of the game level.
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }


        renderEntities();
    }

    // function is called by the render function and is called on each game tick.
    function renderEntities() {
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    // noop
    function reset() {
        global.resetGame();
    }

    //load all of the images
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png'
    ]);
    Resources.onReady(init);

    global.ctx = ctx;
})(this);
