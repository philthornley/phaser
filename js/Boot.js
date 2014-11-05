// Declare the object that will hold all game states
GameStateHolder = {}; 


//Declare the Boot state
GameStateHolder.Boot = function(game) {};


GameStateHolder.Boot.prototype = {
	
	preload: function() {
		//Load assets for loading screen
		this.load.image('preloaderBackground', 'assets/images/preloadBG.png');
		this.load.image('preloaderBar', 'assets/images/preloadBar.png');
	},
	
	create: function() { 
	  //Start the Preloader state;
		this.game.state.start('Preloader');
	}
	
};