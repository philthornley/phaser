GameStateHolder.Game = function(game) {};

var map;
var tileset;
var blockedLayer;
var player;
var platforms;
var cursors;

var stars;
var playerHealth = 100;
var healthText;
var score = 0;
var scoreText;

var crab_speed = 50;
var crabBoundryLeft = 150;
var crabBoundryRight = 300;

var hurtDelayTime = 0;
var hurtDelay = 300;


GameStateHolder.Game.prototype = {
    create: function() {
        this.bg = this.add.sprite(0, 0, 'sky');
        console.log('###   Loaded Sky');
        console.log(this);

        this.map = this.game.add.tilemap('level1');
        console.log('###   Loaded Tilemap');
        //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
        this.map.addTilesetImage('polar', 'gameTiles');

        console.log('###   Loaded Tilemap Image');
        
        
				this.enemies = game.add.group();
				
				
				
        //create layer
        //this.backgroundlayer = this.map.createLayer('backgroundLayer');
        blockedLayer = this.map.createLayer('blockedLayer');
        console.log('###   blockedLayer');
        //resizes the game world to match the layer dimensions
        blockedLayer.resizeWorld();
        console.log('###   Loaded Resize world');

        //collision on blockedLayer
        this.map.setCollisionBetween(0, 1000, true, 'blockedLayer');
        console.log('###   Loaded Colliion for Blocked layer');
        this.map.createFromObjects('objectLayer',724, 'enemy', 0, true, false, this.enemies);

        blockedLayer.debug = true;
        
        this.add_objects();





        // --------------------------------------
        // The player and its settings
        // --------------------------------------
        player = this.add.sprite(300, 64, 'dude');

        //  We need to enable physics on the player
        this.physics.arcade.enable(player);
        console.log('###   Loaded Player Physics');

        //  Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.linearDamping = 1;
        player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        cursors = this.input.keyboard.createCursorKeys();
        
        



        // --------------------------------------
        // The crabs/enemy and their settings....
        // --------------------------------------
        

        /*
this.enemies.enableBody = true;
        
        this.enemies.createMultiple (10, 'crab');
        
        // Call 'addEnemy' every 2.2 seconds
        this.game.time.events.loop(2000, this.addEnemy, this);
*/
        
        


        /*
this.crabs = this.game.add.group();
        this.crabs.enableBody = true;

        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 16; i++) {
            //  Create a crab inside of the 'crab' group
            var crab = this.add.sprite(i * 170, 0, 'crab');

            //  Let gravity do its thing
            console.log(crab);
            crab.body.bounce.y = 0.2;
            crab.body.gravity.y = 300;
            crab.body.collideWorldBounds = true;
            crab.animations.add('crabLeft', [0, 1], 5, true);
						crab.animations.add('crabRight', [2, 3], 5, true);
						crab.frame = 1;
        }
*/

        


        /*
crab = this.add.sprite(400,300, 'crab');
							this.physics.arcade.enable(crab);
							crab.body.bounce.y = 0.2;
							crab.body.gravity.y = 300;
							crab.body.collideWorldBounds = true;
							crab.animations.add('crabLeft', [0, 1], 5, true);
							crab.animations.add('crabRight', [2, 3], 5, true);
							crab.frame = 1;
							//this.time.events.repeat(Phaser.Timer.SECOND * 2, 10, moveCrab, this)
*/



        // --------------------------------------
        // The Stars and their settings...
        // --------------------------------------
        stars = this.add.group();

        stars.enableBody = true;

        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 6; i++) {
            //  Create a star inside of the 'stars' group
            var star = stars.create(i * 70, 0, 'star');

            //  Let gravity do its thing
            star.body.gravity.y = 300;

            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 0.1 + Math.random() * 0.2;
        }




        // --------------------------------------
        // Setup and Display Onscreen infomation
        // --------------------------------------
        scoreText = this.add.text(16, 16, 'Score: 0', {
            font: 'bold 22px Arial',
            fill: '#000'
        });
        scoreText.fixedToCamera = true;

        healthText = this.add.text(172, 16, 'Energy: 100', {
            font: 'bold 22px Arial',
            fill: '#000'
        });
        healthText.fixedToCamera = true;



        // --------------------------------------
        // Camera settings
        // --------------------------------------
        this.camera.follow(player);
        //  The deadzone is a Rectangle that defines the limits at which the camera will start to scroll
        //  It does NOT keep the target sprite within the rectangle, all it does is control the boundary
        //  at which the camera will start to move. So when the sprite hits the edge, the camera scrolls
        //  (until it reaches an edge of the world)
        this.camera.deadzone = new Phaser.Rectangle(100, 100, 600, 200);
        console.log('###   Loaded Camera');

        player.debug = true;


    }, //End of create




    update: function() {


        // --------------------------------------
        // Collision settings
        // --------------------------------------
        //  Collide the player and the stars with the platforms
        //this.physics.arcade.collide(player, platforms);
        this.physics.arcade.collide(player, blockedLayer);
        this.physics.arcade.overlap(this.enemies, blockedLayer, this.enemy_collide, null, this);
        this.physics.arcade.collide(stars, blockedLayer);
        //  If the player overlaps with the crabs, she looses energy
        //this.physics.arcade.overlap(player, crabs, hurtPlayer, null, this);
        //  If the player overlaps with the stars, collect them
        this.physics.arcade.overlap(player, stars, collectStar, null, this);




        // --------------------------------------
        //  Player controls
        // --------------------------------------
        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;

        if (cursors.left.isDown) {
            //  Move to the left
            player.body.velocity.x = -150;

            player.animations.play('left');
        } else if (cursors.right.isDown) {
            //  Move to the right
            player.body.velocity.x = 150;

            player.animations.play('right');
        } else if (cursors.down.isDown) {
            //  Move to the right
            player.frame = 2;
        } else {
            //  Stand still
            player.animations.stop();

            player.frame = 4;
        }

        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && player.body.onFloor()) {
            player.body.velocity.y = -300;
        }

				
        // --------------------------------------
        // Crab movement
        // --------------------------------------
/*
        this.crabs.forEach(function(crab) 
        {
        
	        crabWalkCounter += 1;
	        if (crabWalkCounter >= crabBoundryRight) {
	            crabWalkCounter = 0;
	        }
	        crabWalk(crabs);
	       })
        
*/


    }, //End of update
    
    
    enemy_collide: function (e,blockedLayer) {
        console.log('Inside enemy_collide');
        
		    if (e.move == 1) {
						if (e.direction < 0) {
								e.body.velocity.x = 100;
						} else { 
								e.body.velocity.x = -100;
				}  
				if (e.move == 2) {
						if (e.direction < 0) 
							e.body.velocity.y = 100;
						} else {
							e.body.velocity.y = -100;
						}
				}
	
				e.direction = e.direction * -1;
		},
		
		
				
		add_objects: function() {				
						this.enemies.forEachAlive(function(e){
						console.log('Inside Add Objects');
							if (e.move == 1) {
								e.body.velocity.x = 100;
								e.direction = 1;
							}
							else if (e.move == 2) {
								this.e.body.velocity.y = 100;
								e.direction = 1;
							}
							else {
								console.log('nothing is happening!');
							}
						}, this);	
						
		},

	
	    
    /*
addEnemy: function() {
				// Get the first dead enemy of the group
				console.log('Inside Enemy');
				var enemy = this.enemies.getFirstDead();
				// If there isn't any dead enemy, do nothing
				if (!enemy) {
						return;
				}
				// Initialise the enemy
				enemy.anchor.setTo(0.5, 1);
				enemy.reset(100,200);
				enemy.body.gravity.y = 100;
				enemy.body.velocity.x = 100;
				enemy.body.bounce.x = 1;
				enemy.checkWorldBounds = true;
				enemy.outOfBoundsKill = true;
		},
*/


    render: function() {
        // game.debug.body(p);
        //this.debug.bodyInfo(player, 32, 120);
        var zone = this.camera.deadzone;
        //this.debug.renderRectangle(zone, '#0fffff');

        //game.debug.cameraInfo(this.camera, 32, 32);
        //this.debug.spriteCoords(player, 32, 500);
    }


}; //End of Prototype

function collectStar(player, star) {

    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}




function hurtPlayer(player, crab) {
    hurtDelayTime += 10;
    if (hurtDelayTime > hurtDelay) {
        //Update health
        playerHealth -= 20;
        healthText.text = 'Energy: ' + playerHealth;
        hurtDelayTime = 0;
    }
}




function moveCrab(crab) {
    crab_speed = 50;
    crabMover = this.rnd.integerInRange(1, 2);
    if (crabMover == 1) {
        //move left
        crab.body.velocity.x = crab_speed;
        console.log('Right');
    } else if (crabMover == 2) {
        //move right
        crab.body.velocity.x = -crab_speed;
        console.log('Left');
    }
}

// --------------------------------------
// Crab movement
// --------------------------------------
var crabWalkCounter = 0;
function crabWalk() {
    if (crabWalkCounter < crabBoundryLeft) {
        crab[i].animations.play('crabLeft');
        crab[i].body.velocity.x = -crab_speed;
    } else {
        crabs[i].animations.play('crabRight');
        crabs[i].body.velocity.x = crab_speed;
    }
}

