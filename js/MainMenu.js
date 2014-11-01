GameStateHolder.MainMenu = function(game) {};

var music;


GameStateHolder.MainMenu.prototype = {
	create: function() {
			this.bg = this.add.sprite(0, 0, 'menu');
			
			music = this.add.audio('music');
			
			music.play('',0,1,true);
			
			playButton = this.add.button(150,150, 'playButton', this.startGame, this, 1,0,2);
			
			//  We're going to be using physics, so enable the Arcade Physics system
			//this.physics.startSystem(Phaser.Physics.ARCADE);


	},

	startGame: function() {
			this.game.state.start('Game');
	}

};