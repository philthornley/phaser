var menuState = {

	create: function() { 
		// Name of the game with tween
		var nameLabel = game.add.text(game.world.centerX, 100, 'Space Shooter', { font: '50px Arial', fill: '#ffffff' });
		nameLabel.anchor.setTo(0.5, 0.5);
		nameLabel.scale.setTo(0, 0);
		game.add.tween(nameLabel.scale).delay(200).to({x: 1, y: 1}, 1000)
			.easing(Phaser.Easing.Bounce.Out).start();

		// Display score, if any
		if (game.global.score > 0) {
			var scoreLabel = game.add.text(game.world.centerX, game.world.centerY, 'score: ' + game.global.score, { font: '25px Arial', fill: '#ffffff' });
			scoreLabel.anchor.setTo(0.5, 0.5);				
		}

		// How to start the game, with tween
		var startLabel = game.add.text(game.world.centerX, game.world.height-100, 'press the up arrow key to start', { font: '25px Arial', fill: '#ffffff' });
		startLabel.anchor.setTo(0.5, 0.5);	
		game.add.tween(startLabel).to({alpha: 0}, 500).to({alpha: 1}, 1000).loop().start(); 

		// Add a mute button
		this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
		this.muteButton.input.useHandCursor = true;
		if (game.sound.mute) {
			this.muteButton.frame = 1;
		}

		// Start the game when the up arrow key is pressed
		var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		upKey.onDown.addOnce(this.start, this);
	},

	toggleSound: function() {
		game.sound.mute = ! game.sound.mute;
		this.muteButton.frame = game.sound.mute ? 1 : 0;	
	},

	start: function() {
		game.state.start('play');	
	}
};