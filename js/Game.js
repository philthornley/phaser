//Game.js
GameStateHolder.Game = function(game) {};

var map;
var tileset;
var blockedLayer;
var player;
var platforms;
var cursors;

var stars;
var score = 0;
var scoreText;

GameStateHolder.Game.prototype = {
			create: function() {
							this.bg = this.add.sprite(0, 0, 'sky');
							console.log('###   Loaded Sky');
							
							this.map = this.game.add.tilemap('level1');
							console.log('###   Loaded Tilemap');
							//the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
							this.map.addTilesetImage('polar', 'gameTiles');
							
							console.log('###   Loaded Tilemap Image');
							
							//create layer
							//this.backgroundlayer = this.map.createLayer('backgroundLayer');
							blockedLayer = this.map.createLayer('blockedLayer');
							console.log('###   blockedLayer');
							//resizes the game world to match the layer dimensions
							blockedLayer.resizeWorld();
							console.log('###   Loaded Resize world');
							
							//collision on blockedLayer
							this.map.setCollisionBetween(1, 1000, true, 'blockedLayer');
							console.log('###   Loaded Colliion for Blocked layer');
							
							blockedLayer.debug = true;
							
							
							
							
							
							
							// The player and its settings
							player = this.add.sprite(700, 64, 'dude');
							
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
					    
					    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
					    scoreText.fixedToCamera = true;
		    
		    
					    this.camera.follow(player);
					    //  The deadzone is a Rectangle that defines the limits at which the camera will start to scroll
					    //  It does NOT keep the target sprite within the rectangle, all it does is control the boundary
					    //  at which the camera will start to move. So when the sprite hits the edge, the camera scrolls
					    //  (until it reaches an edge of the world)
					    this.camera.deadzone = new Phaser.Rectangle(100, 100, 600, 200);
					    console.log('###   Loaded Camera');
		    
					    player.debug = true;
			}, //End of create
			
			
			update:function()  {
						//  Collide the player and the stars with the platforms
				    //this.physics.arcade.collide(player, platforms);
				    this.physics.arcade.collide(player, blockedLayer);
				    this.physics.arcade.collide(stars, blockedLayer);
				    
				    
				    //  If the player overlaps with the stars, collect them
						this.physics.arcade.overlap(player, stars, collectStar, null, this);
						
				
				    
				    //  Reset the players velocity (movement)
				    player.body.velocity.x = 0;
				 
				    if (cursors.left.isDown) {
					        //  Move to the left
					        player.body.velocity.x = -150;
					 
					        player.animations.play('left');
				    }
				    
				    else if (cursors.right.isDown) {
					        //  Move to the right
					        player.body.velocity.x = 150;
					 
					        player.animations.play('right');
				    }
				    
				    else if (cursors.down.isDown) {
					        //  Move to the right
					        player.frame = 2;
				    }
				    
				    else {
					        //  Stand still
					        player.animations.stop();
					 
					        player.frame = 4;
				    }
				    
				    //  Allow the player to jump if they are touching the ground.
				    if (cursors.up.isDown && player.body.onFloor()) {
					        player.body.velocity.y = -300;
				    }
			}, //End of update
			
			render: function () {
			    // game.debug.body(p);
			    //this.debug.bodyInfo(player, 32, 120);
			    var zone = this.camera.deadzone;
			    //this.debug.renderRectangle(zone, '#0fffff');
			
			    //game.debug.cameraInfo(this.camera, 32, 32);
			    //this.debug.spriteCoords(player, 32, 500);
		  }

	
};//End of Prototype

function collectStar (player, star) {
    
    // Removes the star from the screen
    star.kill();
 
    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;
 
}


