var bootState = {

	preload: function () {
		game.load.image('progressBar', 'assets/progressBar.png');
	},

	create: function() { 
		// Set a background color
		game.stage.backgroundColor = '#ecf0f1';
		// No need for a physics engine in this game

		game.state.start('load');
	}
};