var loadState = {

	preload: function () {		
		// Add a loading label 
		var loadingLabel = game.add.text(game.world.centerX, 150, 'loading...', { font: '30px Arial', fill: '#ffffff' });
		loadingLabel.anchor.setTo(0.5, 0.5);

		// Add a progress bar
		var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');
		progressBar.anchor.setTo(0.5, 0.5);
		game.load.setPreloadSprite(progressBar);

		// Load all images
		game.load.spritesheet('mute', 'assets/muteButton.png', 28, 22);
		game.load.spritesheet('player', 'assets/player.png', 20, 20);
		game.load.spritesheet('enemy', 'assets/enemy.png', 20, 20);
		game.load.image('coin', 'assets/coin.png');
		game.load.image('cloud', 'assets/cloud.png');
		game.load.image('ground', 'assets/ground.png');

		// Load all sound
		game.load.audio('jump', ['assets/jump.ogg', 'assets/jump.mp3']);
		game.load.audio('hit', ['assets/hit.ogg', 'assets/hit.mp3']);
	},

	create: function() { 
		game.state.start('menu');
	}
};