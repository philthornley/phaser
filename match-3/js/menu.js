var menuState = {

	create: function() { 
		// Name of the game
		var nameLabel = game.add.text(game.world.centerX, 80, 'Match-3', { font: '50px Arial', fill: '#000' });
		nameLabel.anchor.setTo(0.5, 0.5);

		// How to start the game
		var startLabel = game.add.text(game.world.centerX, game.world.height-80, 'click anywhere to start', { font: '25px Arial', fill: '#000' });
		startLabel.anchor.setTo(0.5, 0.5);	
		game.add.tween(startLabel).to({y: startLabel.y-20}, 150).delay(800).to({y: startLabel.y}, 150).loop().start(); 

		// Add a mute button
		this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
		this.muteButton.input.useHandCursor = true;
		if (game.sound.mute) {
			this.muteButton.frame = 1;
		}

		// Display score, if any
		if (game.global.score > 0) {
			var scoreLabel = game.add.text(game.world.centerX, game.world.centerY, 'score: ' + game.global.score, { font: '25px Arial', fill: '#000' });
			scoreLabel.anchor.setTo(0.5, 0.5);				
		}

		// Start the game when the pointer is pressed
		game.input.onDown.addOnce(this.start, this)

	},

	toggleSound: function() {
		game.sound.mute = ! game.sound.mute;
		this.muteButton.frame = game.sound.mute ? 1 : 0;	
	},

	start: function() {
		game.state.start('play');	
	}
};