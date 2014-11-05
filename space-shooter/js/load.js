var loadState = {

	preload: function () {		
		// Add a loading label 
		var loadingLabel = game.add.text(game.world.centerX, 150, 'loading...', { font: '30px Arial', fill: '#ffffff' });
		loadingLabel.anchor.setTo(0.5, 0.5);

		// Add a progress bar
		var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');
		progressBar.anchor.setTo(0.5, 0.5);
		game.load.setPreloadSprite(progressBar);

		// Load all image assets
		game.load.spritesheet('mute', 'assets/muteButton.png', 28, 22);
		game.load.image('player', 'assets/player.png');
		game.load.image('bonus', 'assets/bonus.png');
		game.load.spritesheet('enemy', 'assets/enemy.png', 56, 72);
		game.load.image('bullet', 'assets/bullet.png');
		game.load.image('pixel', 'assets/pixel.png');

		// Load all sound effects
		game.load.audio('takeBonus', ['assets/bonus.ogg', 'assets/bonus.mp3']);
		game.load.audio('fireBullet', ['assets/bullet.ogg', 'assets/bullet.mp3']);
		game.load.audio('enemyDie', ['assets/die.ogg', 'assets/die.mp3']);
		game.load.audio('playerHit', ['assets/hit.ogg', 'assets/hit.mp3']);
	},

	create: function() { 
		game.state.start('menu');
	}
};