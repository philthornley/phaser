var playState = {

	create: function() { 

		/* --- Add sprites and groups --- */

		// Add the green ground
		this.ground = game.add.sprite(0, 200, 'ground');
		game.physics.arcade.enable(this.ground);
		this.ground.body.immovable = true;

		// Cloud group
		this.clouds = game.add.group();
		this.clouds.enableBody = true;
		this.clouds.createMultiple(10, 'cloud');
		this.addCloud();	

		// Add the player
		this.player = game.add.sprite(150, 0, 'player');
		game.physics.arcade.enable(this.player);
		this.player.anchor.setTo(0.5, 1);
		this.player.body.gravity.y = 800;
		this.player.animations.add('run', [0, 1], 5, true);
		this.player.animations.add('jump', [0, 1], 10, true);

		// Enemy group
		this.enemies = game.add.group();
		this.enemies.enableBody = true;
		this.enemies.createMultiple(10, 'enemy');

		/* --- Display the labels on the screen --- */

		// Score label, with tween
		this.scoreLabel = game.add.text(20, 20, 'time: 0', 
			{ font: '18px Arial', fill: '#ffffff' });
		this.scoreLabel.alpha = 0;
		game.add.tween(this.scoreLabel).to({alpha:1}, 1000).start();

		/* --- Various variables and timers --- */

		// Add sounds
		this.jumpSound = game.add.audio('jump');
		this.hitSound = game.add.audio('hit');

		// Init variables
		game.global.score = 0;
		this.nextEnemy = game.time.now + 500;

		// Add jump key (spacebar)
		this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		// Add a cloud every 2.8 seconds
		game.time.events.loop(2800, this.addCloud, this);	

		// Inscrease the score 10 times per second
		game.time.events.loop(100, this.inscreaseScore, this);				
	},

	update: function() {
		// Collisions
		game.physics.arcade.collide(this.player, this.ground);
		game.physics.arcade.overlap(this.player, this.enemies, this.playerHit, null, this);

		// Handle player movement and animations
		this.movePlayer();

		// If the player is out of the world, game over
		if (!this.player.inWorld) {
			game.state.start('menu');
		}

		// Create new enemies faster and faster
		// At first, one every 1.5 second, and finally one evey 800ms
		if (this.nextEnemy < game.time.now) {
			var start = 1500, end = 800, score = 400;
			var delay = Math.max(start - (start-end)*game.global.score/score, end);
			    
			this.addEnemy();
			this.nextEnemy = game.time.now + delay;
		}
	},

	movePlayer: function() {
		// Jump the player if the spacebar is pressed
		// The longer the spacebar is pressed, the longer the jump
		if (this.spacebar.isDown && this.player.body.touching.down) {
			this.player.body.velocity.y = - 220;
			this.jumpSound.play();
			this.timeJump = 0;
		}
		else if (this.spacebar.isDown && this.timeJump < 10) {
			this.timeJump += 1;
			this.player.body.velocity.y = - 220;
		}
		else if (this.spacebar.isUp) {
			this.timeJump = 10;
		}

		// Play the correct animation
		if (this.player.body.touching.down) {
			this.player.animations.play('run');
		}
		else {
			this.player.animations.play('jump');
		}
	},

	addEnemy: function() {
		// Get an enemy from the group
		var enemy = this.enemies.getFirstDead();
		if (!enemy) {
			return;
		}

		// Make the enemy appear at 2 possible height
		if (game.rnd.integerInRange(0, 3) == 1) {
			enemy.reset(game.world.width, 150);
			enemy.frame = 1;
			enemy.scale.setTo(1, 1);
		}
		else {
			enemy.reset(game.world.width, 200);
			enemy.frame = 0;

			// Change the scale of the enemey
			var scaleX = 1 * game.rnd.integerInRange(1, 3);
			var scaleY = 1 * game.rnd.integerInRange(1, 2);
			enemy.scale.setTo(scaleX, scaleY);
		}

		// Init the enemy
		enemy.anchor.setTo(0, 1);
		enemy.body.velocity.x = -300;

		// Kill the enemy when out of the screen
		enemy.checkWorldBounds = true;
		enemy.outOfBoundsKill = true;
	},

	addCloud: function() {
		// Get a cloud from the group
		var cloud = this.clouds.getFirstDead();
		if (!cloud) {
			return;
		}

		// Init the cloud
		cloud.anchor.setTo(0, 0.5);
		cloud.reset(game.world.width, game.rnd.integerInRange(40, 150));
		cloud.body.velocity.x = game.rnd.integerInRange(-100, -30);

		// Create 3 different size of clouds
		var scale = 0.2 * game.rnd.integerInRange(3, 5);
		cloud.scale.setTo(scale, scale);

		// Kill the cloud when out of the screen
		cloud.checkWorldBounds = true;
		cloud.outOfBoundsKill = true;
	},

	playerHit: function(player, enemy) {
		// Kill the enemy with sound
		enemy.kill();
		this.hitSound.play();

		// Move the player backward
		game.add.tween(this.player).to({x: this.player.x - 60}, 100).start();

		// Shake all the clouds
		this.clouds.forEachAlive(this.shakeClouds, this);
	},
	
	// Shake one cloud up and down
	shakeClouds: function(cloud) {
		game.add.tween(cloud).to({y: cloud.y+8}, 50)
			.to({y: cloud.y-8}, 100).to({y: cloud.y+8}, 100)
			.to({y: cloud.y}, 50).start();
	},

	// Inscrease the score by 1 
	inscreaseScore: function() {
		game.global.score += 1;
		this.scoreLabel.text = 'time: ' + game.global.score;
	}
};