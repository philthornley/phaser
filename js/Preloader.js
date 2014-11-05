//Preloader
GameStateHolder = {};
//declare the Preloader function
GameStateHolder.Preloader = function (game) {  
 
 this.background = null;
 //this.preloadBar = null;
 
/*  this.ready = false; */
 
};
 
GameStateHolder.Preloader.prototype = {
 
		preload: function () {
		
				//load the loading screen sprites - a blank bar and a blue bar
				this.bg = this.add.sprite(0, 0, 'preloaderBackground');
				//this.bg.anchor.setTo(0.5,0.5);
				//this.bg.scale.setTo(0.5,0.5);
				this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
				this.preloadBar.anchor.setTo(0,0.5);
				this.preloadBar.scale.setTo(0.5,1);
				this.preloadBar.x = this.world.centerX - this.preloadBar.width/2;
				
				//this statement sets the blue bar to represent the actual percentage of data loaded
				this.load.setPreloadSprite(this.preloadBar);
				
				//load all the required assets in the game - sprites, music, fonts,etc
				game.load.image('menu', 'assets/images/screen-mainmenu.png');
				game.load.spritesheet('playButton','assets/images/playButton.png',0,0);
				this.game.image('sky', 'assets/images/sky.png');
				this.game.load.tilemap('level1', 'assets/tilemaps/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
				this.load.image('gameTiles', 'assets/images/polarbear.png');
				this.load.image('star', 'assets/images/star.png');
				this.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);
				this.load.spritesheet('enemy', 'assets/images/baddie.png', 32, 32);
				//this.load.atlas('spriteset', 'assets/spritesheet.png', 'assets/spritesheet.jsona');
				//this.load.spritesheet('play','assets/play.png',400,110);
				//this.load.spritesheet('back','assets/back.png',400,110);
				//this.load.spritesheet('musicbutton','assets/music.png',400,110);
				//this.load.bitmapFont('font', 'assets/fnt2_0.png', 'assets/fnt2.fnt');
				this.load.audio('music', ['assets/sound/music.mp3','assets/sound/music.ogg','assets/sound/music.wav','assets/sound/music.m4a']);
				//this.load.audio('blip', ['assets/blip.mp3','assets/blip.ogg','assets/blip.wav','assets/blip.m4a']);
		 var map;
var tileset;
var blockedLayer;
var player;
var platforms;
var cursors;

var crab;
var stars;
var score = 0;
var scoreText;

 
		},
		
		create: function () {
		
				this.preloadBar.cropEnabled = false;
				
		
		},
		
		update: function () {
		
				//checking whether the music is ready to be played before proceeding to the Main Menu.
				if (this.cache.isSoundDecoded('music') && this.ready == false)
						{
								this.ready = true;
								this.state.start('MainMenu');
						}
				
				}
 
};