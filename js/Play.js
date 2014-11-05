var game = new Phaser.Game(800, 480, Phaser.CANVAS, 'game');
						game.state.add('Boot', GameStateHolder.Boot);
						game.state.add('Preloader', GameStateHolder.Preloader);
						game.state.add('MainMenu', GameStateHolder.MainMenu);
						game.state.add('Game', GameStateHolder.Game);
						game.state.add('EndScreen', GameStateHolder.EndScreen);
						//Start the Boot State
						game.state.start('Boot');