var menuState = {

	create: function() { 
		// Add green ground
		this.ground = game.add.sprite(0, 200, 'ground');
		game.physics.arcade.enable(this.ground);

		// Name of the game
		this.nameLabel = game.add.text(game.world.centerX, 50, 'Infinite Runner', { font: '50px Arial', fill: '#ffffff' });
		this.nameLabel.anchor.setTo(0.5, 0.5);


		// Display score
		this.scoreLabel = game.add.text(game.world.centerX, game.world.centerY, 'time: ' + game.global.score, { font: '25px Arial', fill: '#ffffff' });
		this.scoreLabel.anchor.setTo(0.5, 0.5);				

		// How to start the game
		this.startLabel = game.add.text(game.world.centerX, game.world.height-50, 'press the space bar to start', { font: '25px Arial', fill: '#ffffff' });
		this.startLabel.anchor.setTo(0.5, 0.5);	
		game.add.tween(this.startLabel).to({x: this.startLabel.x-10}, 500).to({x: this.startLabel.x+10}, 500).loop().start(); 

		// Add a mute button
		this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
		this.muteButton.input.useHandCursor = true;
		if (game.sound.mute) {
			this.muteButton.frame = 1;
		}

		// Start the game when the up arrow key is pressed
		var upKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		upKey.onDown.addOnce(this.start, this);
	},

	toggleSound: function() {
		game.sound.mute = ! game.sound.mute;
		this.muteButton.frame = game.sound.mute ? 1 : 0;	
	},

	start: function() {
		// Add tweens to all the elements
		game.add.tween(this.nameLabel).to({y:-50}, 500).start();
		game.add.tween(this.muteButton).to({y:-50}, 500).start();
		game.add.tween(this.startLabel).to({y:game.world.height+50}, 500).start();
		game.add.tween(this.scoreLabel).to({alpha:0}, 500).start();

		// Start the game in 500ms, to have time to see the tweens
		game.time.events.add(500, this.startPlay, this)
	},

	startPlay: function() {
		game.state.start('play');			
	}
};