/*

Here are the main steps of this game:

1- When the user clicks, we select the dot below the cursor: findClickedDot()
2- Select all adjacent dots to the clicked dot: selectDots()
3- kill all the selcted dots: removeSelectedDots()
4- Update score and labels: updateScore()
5- Refill the world with dots: refillDots()

*/


var playState = {

	create: function() { 
		// Create the dots group
		this.dots = game.add.group();
		this.dots.createMultiple(60, 'dot');
		this.dots.setAll('inputEnabled', true);
		this.dots.setAll('input.useHandCursor', true);

		// Score label
		this.scoreLabel = game.add.text(15, 15, 'score: 0', 
			{ font: '18px Arial', fill: '#000' });

		// Number of moves left before the game ends
		this.moveLabel = game.add.text(game.world.width-15, 15, 'moves: 10', 
			{ font: '18px Arial', fill: '#000' });
		this.moveLabel.anchor.setTo(1, 0);

		// Various variables
		this.gridSize = 7;
		this.tileSize = 50;
		this.dotsSelected = 0;
		game.global.score = 0;
		this.moveCount = 10;
		this.clickSound = game.add.audio('click');

		// Fill the world with dots
		this.initWorld();

		// Call 'clicked' when the user clicks
		game.input.onDown.add(this.clicked, this)
	},

	// This is the main function of the game
	// Called when the user clicks on a dot
	clicked: function() {
		// If dots are already selected, do nothing
		if (this.dotsSelected != 0) {
			return;
		}

		// Return the dot that is below the pointer
		// If there is no dot, do nothing
		var dot = this.findClickedDot();
		if (!dot) {
			return;
		}

		// Set 'dot.selected = true' to all the dots that should be removed
		// If only 1 dot is selected: do nothing
		this.selectDots(dot.i, dot.j, dot.frame);
		if (this.dotsSelected == 1) {
			this.dots.setAll('selected', false);
			this.dotsSelected = 0;
			return;
		}

		// remove the dots and update score
		this.removeSelectedDots();
		this.updateScore();

		// Once the dots finish disapearing: refill the world with dots
		game.time.events.add(300, this.refillDots, this);
	},

	// Fill the world with dots
	initWorld: function() {
		// Go through the grid (7x7)
        for (var i = 0; i < this.gridSize; i++) {
            for (var j = 0; j < this.gridSize; j++) {
            	// Create a dot at each spot
                this.addDot(i, j);	
            }
        }	
    },

    // Add a new dot at the i, j position
	addDot: function(i, j) {
		// Retrive a dead dot from the group
    	var dot = this.dots.getFirstDead();
    	if (!dot) {
    		return;
    	}
    	
    	// Init the dot
    	dot.scale.setTo(1, 1);
		dot.reset(30 + i*dot.width, 70 + j*dot.height);	
		dot.anchor.setTo(0.5, 0.5);
		dot.frame = game.rnd.integerInRange(0, 3);

		// Add custom parameters to the dot
		dot.i = i;
		dot.j = j;
		dot.selected = false;

		// Tween
		dot.scale.setTo(0, 0);
		game.add.tween(dot.scale).to({x: 1, y: 1}, 200).start();
	},

	// Return the dot that was clicked by the pointer
	findClickedDot: function() {
		var x = game.input.activePointer.x, y = game.input.activePointer.y;
		
		// Convert the x, y point into i,j value
		var i = Math.floor((x-30+25)/this.tileSize);
		var j = Math.floor((y-70+25)/this.tileSize);
		
		return this.getDot(i, j);
	},

	// Select adjacent dots to the i, j dot if they have the same frame
	selectDots: function(i, j, frame) {
		// Get the corresponding dot
		var dot = this.getDot(i, j);
		if (!dot) {
			return;
		}

		// If the dot maches the color we are looking for (the same frame)
		if (dot.frame == frame && !dot.selected) {
			// Then select the dot
			dot.selected = true;
			this.dotsSelected += 1;

			// And recursively call the function for all the adjacent dots
			this.selectDots(i, j-1, frame);
			this.selectDots(i, j+1, frame);
			this.selectDots(i-1, j, frame);
			this.selectDots(i+1, j, frame);			
		}
	},

	// Kill all dots that are 'selected'
	removeSelectedDots: function() {
		// Go through all the dots
		for (var i = 0; i < this.gridSize; i++) {
            for (var j = 0; j < this.gridSize; j++) {
           		var dot = this.getDot(i, j);

				if (dot.selected) {
					// If the dot is selected, kill it with a tween
                	game.add.tween(dot.scale).to({x: 0, y: 0}, 200).start();
                	dot.alive = false;
				}

			}
		}
	},

	// Refill the world with dots
	refillDots: function() {
		this.moveDotsDown();
		this.addMissingDots();

		this.dotsSelected = 0;	
	},

	// Move the dots down to fill the empty dots
	moveDotsDown: function() {
		// Go through the grid
        for (var i = 0; i < this.gridSize; i++) {
        	var moveBy = 0;

            for (var j = this.gridSize-1; j >= 0; j--) {
            	var dot = this.getDot(i, j);

                if (!dot) {
                	// If a dot is missing
                	// It means that the dots above will have to move down
                	moveBy += 1;
                }
                else if (moveBy > 0) {
                	// If there is a dot, and it should move down
                	// Move it down by the correct amount (moveBy)
            		this.setDot(i, j, j+moveBy);
                	game.add.tween(dot).to({y: dot.y + moveBy*dot.height}, 200).start();
                }
            }
        }	
	},

	// Add missing dots 
	addMissingDots: function() {
		// Go through the grid
        for (var i = 0; i < this.gridSize; i++) {
            for (var j = this.gridSize-1; j >= 0; j--) {
            	var dot = this.getDot(i, j);

                if (!dot) {
                	// If a dot is missing, add a new one
                	this.addDot(i, j);
                }
            }
        }			
	},

	updateScore: function() {
		// Update score with sound
		game.global.score += this.dotsSelected*this.dotsSelected;
		this.scoreLabel.text = 'score: ' + game.global.score;
		game.add.tween(this.scoreLabel.scale)
			.to({x: 1.3, y: 1.3}, 150).to({x: 1, y: 1}, 150).start();
		this.clickSound.play();

		// Update move count
		this.moveCount -= 1;
		this.moveLabel.text = 'moves: ' + this.moveCount;
		game.add.tween(this.moveLabel.scale)
			.to({x: 1.3, y: 1.3}, 150).to({x: 1, y: 1}, 150).start();

		// If no more moves, end the game
		if (this.moveCount <= 0) {
			game.time.events.add(600, this.startMenu, this);
		}
	},

	// Return the dot i, j
	getDot: function(i, j) {
		var dotIJ;

		// We go through every dots to find the one we are looking for
		this.dots.forEachAlive(function(dot) {
			if (dot.i == i && dot.j == j) {
				dotIJ = dot;
			}
		}, this);

		return dotIJ;
	},

	// Change the j value of the i, j dot
	setDot: function(i, j, newJ) {
		var dot = this.getDot(i, j);
		dot.j = newJ;
	},

	// Start the menu state
	startMenu: function() {
		game.state.start('menu');
	}
};