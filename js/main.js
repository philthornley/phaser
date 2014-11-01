

function preload() {
		GrubGame.game.load.image('sky', 'assets/images/sky.png');
		GrubGame.game.load.tilemap('level1', 'assets/tilemaps/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
    GrubGame.game.load.image('gameTiles', 'assets/images/polarbear.png');
		GrubGame.game.load.image('star', 'assets/images/star.png');
		GrubGame.game.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);
		
		//scaling options
    //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
    //have the game centered horizontally
    //this.scale.pageAlignHorizontally = true;
    //this.scale.pageAlignVertically = true;

    //screen size will be set automatically
    //this.scale.setScreenSize(true);
}

var map;
var tileset;
var blockedLayer;
var player;
var platforms;
var cursors;

var stars;
var score = 0;
var scoreText;

function create() {
		//  We're going to be using physics, so enable the Arcade Physics system
		GrubGame.game.physics.startSystem(Phaser.Physics.ARCADE);
		
		//  A simple background for our game
		GrubGame.game.add.sprite(0, 0, 'sky');
		
		//GrubGame.game.world.setBounds(0, 0, 1920, 1200);
		
		GrubGame.game.map = this.game.add.tilemap('level1');

    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    GrubGame.game.map.addTilesetImage('polar', 'gameTiles');

    //create layer
    //GrubGame.game.backgroundlayer = this.map.createLayer('backgroundLayer');
    blockedLayer = GrubGame.game.map.createLayer('blockedLayer');
    //resizes the game world to match the layer dimensions
    blockedLayer.resizeWorld();

    //collision on blockedLayer
    GrubGame.game.map.setCollisionBetween(1, 100000, true, 'blockedLayer');
    
    blockedLayer.debug = true;

		
		
		
		
		
		// The player and its settings
    player = GrubGame.game.add.sprite(700, 64, 'dude');
 
    //  We need to enable physics on the player
    GrubGame.game.physics.arcade.enable(player);
 
    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.linearDamping = 1;
    player.body.collideWorldBounds = true;
 
    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    
    cursors = GrubGame.game.input.keyboard.createCursorKeys();
    
    
    stars = GrubGame.game.add.group();
 
    stars.enableBody = true;
 
    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 6; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');
 
        //  Let gravity do its thing
        star.body.gravity.y = 300;
 
        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.1 + Math.random() * 0.2;
    }
    
    scoreText = GrubGame.game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    
    

    
    
    GrubGame.game.camera.follow(player);
    
    player.debug = true;

}

function update() {
 
    //  Collide the player and the stars with the platforms
    //GrubGame.game.physics.arcade.collide(player, platforms);
    GrubGame.game.physics.arcade.collide(player, blockedLayer);
    GrubGame.game.physics.arcade.collide(stars, platforms);
    
    //  If the player overlaps with the stars, collect them
		GrubGame.game.physics.arcade.overlap(player, stars, collectStar, null, this);

    
    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
 
    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;
 
        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;
 
        player.animations.play('right');
    }
    else if (cursors.down.isDown)
    {
        //  Move to the right
        player.frame = 2;
    }
    else
    {
        //  Stand still
        player.animations.stop();
 
        player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.onFloor())
    {
        player.body.velocity.y = -300;
    }

 
}


function collectStar (player, star) {
    
    // Removes the star from the screen
    star.kill();
 
    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;
 
}

function render() {
    // game.debug.body(p);
    game.debug.bodyInfo(player, 32, 120);
}