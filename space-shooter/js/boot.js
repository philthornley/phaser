var bootState = {

	preload: function () {
		game.load.image('progressBar', 'assets/progressBar.png');
	},

	create: function() { 
		// Set a background color and the physic system
		game.stage.backgroundColor = '#34495e';
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// Start the load state
		game.state.start('load');
	}
};