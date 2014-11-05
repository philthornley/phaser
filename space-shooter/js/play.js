var playState = {

	create: function() { 

		/* --- Display the labels on the screen --- */

		// Display lives label in the top left
		this.livesLabel = game.add.text(20, 20, 'lives: 3', 
			{ font: '20px Arial', fill: '#ffffff' });

		// Display score label in the top right
		this.scoreLabel = game.add.text(game.world.width-20, 20, 'score: 0', 
			{ font: '20px Arial', fill: '#ffffff' });
		this.scoreLabel.anchor.setTo(1, 0);

		/* --- Add all the sprites/groups to the game --- */

		// Add the player at the bottom of the screen
		this.player = game.add.sprite(game.world.centerX, 450, 'player');
		game.physics.arcade.enable(this.player); 
		this.player.anchor.setTo(0.5, 0.5);
		this.player.body.collideWorldBounds = true;

		// Create the enemy group
	    this.enemies = game.add.group();
	    this.enemies.enableBody = true;	
	    this.enemies.createMultiple(20, 'enemy');

		// Create the bullet group
	    this.bullets = game.add.group();
	    this.bullets.enableBody = true;	
	    this.bullets.createMultiple(50, 'bullet');
	    	
		// Create the bonus group
	    this.bonuses = game.add.group();
	    this.bonuses.enableBody = true;	
	    this.bonuses.createMultiple(2, 'bonus');

	    /* --- Initialise emitters --- */

	    // Add a starfield to the background of the game
		var startEmitter = game.add.emitter(game.world.centerX, 0, 200);
		startEmitter.alpha = 0.8;
		startEmitter.width = game.world.width;
		startEmitter.makeParticles('pixel');
		startEmitter.setYSpeed(100, 300);
		startEmitter.setXSpeed(0, 0);
		startEmitter.minParticleScale = 0.3;
		startEmitter.maxParticleScale = 0.8;
		startEmitter.minRotation = 0;
		startEmitter.maxRotation = 0;
		startEmitter.gravity = 0;
		startEmitter.start(false, 7000, 100, 0);	

		// Init emitter for enemy explosions
	    this.explosionEmitter = game.add.emitter(0, 0, 50);
	    this.explosionEmitter.makeParticles('pixel');
	    this.explosionEmitter.setYSpeed(-150, 150);
		this.explosionEmitter.setXSpeed(-150, 150);
	    this.explosionEmitter.gravity = 0;

	    /* --- Initialise some variables --- */

		// Use curor keys 
		this.cursor = game.input.keyboard.createCursorKeys();
 		game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);		

	    // Various variable
	    this.lives = 3;
		game.global.score = 0;
		this.bonus = 1;
		this.nextBullet = 0;
		this.nextEnemy = 0;

		// Add sounds
		this.bonusSound = game.add.audio('takeBonus');
		this.bulletSound = game.add.audio('fireBullet');
		this.dieSound = game.add.audio('enemyDie');
		this.hitSound = game.add.audio('playerHit');

		// Create new bonus every 8 seconds
		game.time.events.loop(8000, this.newBonus, this);
	},

	update: function() {
		// If the player is dead, we do nothing
		// To avoid beign able to move and fire
		if (!this.player.alive) {
			return;
		}

		// Handle all the collisions
		game.physics.arcade.overlap(this.player, this.enemies, this.playerHit, null, this);
		game.physics.arcade.overlap(this.player, this.bonuses, this.takeBonus, null, this);
		game.physics.arcade.overlap(this.enemies, this.bullets, this.enemyHit, null, this);

		// Move the player when the arrow keys are pressed
		this.movePlayer();

		// Fire a bullet when the up arrow is pressed
		// And if the previous bullet was emited at least 200ms ago
		if (this.cursor.up.isDown && this.game.time.now > this.nextBullet) {
			// Reset the timer
			this.nextBullet = this.game.time.now + 200; 

			this.playerFire();
		}

		// Add a new enemy, the frequency increases with the score
		// At the bgining: one enemy per second
		// And when we reach 400 points: one eney every 300ms
		if (this.nextEnemy < game.time.now) {
			var start = 1000, end = 300, score = 400;
			var delay = Math.max(start - (start-end)*game.global.score/score, end);
			    
			this.newEnemy();
			this.nextEnemy = game.time.now + delay;
		}
	},

	movePlayer: function() {
		// If the left key is pressed
		if (this.cursor.left.isDown) {
			// Move the player to the left
			this.player.body.velocity.x = -350;
		}

		// If the right key is pressed
		else if (this.cursor.right.isDown) {
			// Move the player to the right
			this.player.body.velocity.x = 350;
		}

		// If neither key are pressed
		else {
			// Stop the player
			this.player.body.velocity.x = 0;
		}
	},

	playerFire: function() {
		// Create a small recoil animation to the player
		game.add.tween(this.player).to({y: 455}, 50).to({y: 450}, 50).start();

		// Fire the correct number of bullets depending on the bonus taken
		if (this.bonus == 1) {
			this.fireOneBullet();
		}
		else if (this.bonus == 2) {
			this.fireTwoBullets();
		}
		else {
			this.fireThreeBullets();
		}
	},

	fireOneBullet: function() {
		// Create one bullet
		this.fireBullet(this.player.x);

		// Play sound with small volume
		this.bulletSound.volume = 0.5;
		this.bulletSound.play();
	},

	fireTwoBullets: function() {
		// Create the 2 bullets
		this.fireBullet(this.player.x-10);
		this.fireBullet(this.player.x+10);

		// Play sound with medium volume
		this.bulletSound.volume = 0.8;
		this.bulletSound.play();
	},

	fireThreeBullets: function() {
		// Create the 3 bullets
		this.fireBullet(this.player.x-15);
		this.fireBullet(this.player.x);
		this.fireBullet(this.player.x+15);

		// Play sound with louc volume
		this.bulletSound.volume = 1;
		this.bulletSound.play();
	},

	fireBullet: function(x) {
		// Retrive a bullet from the bullets group
	    var bullet = this.bullets.getFirstDead();
	    if (!bullet) {
	    	return;
	    }

	    // Reduce the collision area of the bullet
	    bullet.body.setSize(bullet.width, 5, 0, 0);

	    // Init the bullet
	    bullet.anchor.setTo(0.5, 1);
	    bullet.reset(x, this.player.y - this.player.height/2);
	    bullet.body.velocity.y = -400;

	    // Kill the bullet when out of the world
	    bullet.checkWorldBounds = true;	
	    bullet.outOfBoundsKill = true;
	},

	newEnemy: function() {
		// Retrive an enemy from the enemies group
	    var enemy = this.enemies.getFirstDead();
	    if (!enemy) {
	    	return;
	    }

	    // Init the enemy
	    enemy.anchor.setTo(0.5, 1);
	    enemy.reset(game.rnd.integerInRange(40, game.world.width-80), 0);
	    enemy.body.velocity.y = game.rnd.integerInRange(150, 250);

	    // Create and start animation
	    enemy.animations.add('run', [0, 1], 4, true);
	    enemy.animations.play('run');

	    // Give 100 health to the enemy
	    enemy.health = 100;

	    // Kill the enemy when out of the world
	    enemy.checkWorldBounds = true;	
	    enemy.outOfBoundsKill = true;	
	},

	newBonus: function() {
		// Retrive an bonus from the bonuses group
	    var bonus = this.bonuses.getFirstDead();
	    if (!bonus) {
	    	return;
	    }

	    // Init the bonus
	    bonus.anchor.setTo(0.5, 0.5);
	    bonus.reset(game.rnd.integerInRange(20, game.world.width-40), -bonus.height/2);
	    bonus.body.velocity.y = 150;
	    bonus.body.angularVelocity = 100;
	    bonus.checkWorldBounds = true;	
	    bonus.outOfBoundsKill = true;	
	},

	playerHit: function(player, enemy) {
		// Kill the enemy with sound
		enemy.kill();
		this.hitSound.play();

		// Reset the bonus count
		this.bonus = 1;

		// Make the screen flash
		game.stage.backgroundColor = '#ffffff';
		game.time.events.add(50, this.resetBackground, this);
		
		// Update lives count, and game over if 0 lives left
		this.lives -= 1;
		this.livesLabel.text = 'lives: ' + this.lives;
		if (this.lives <= 0) {
			// Kill the player
			this.player.kill();

			// Emitt particles
			this.explosionEmitter.x = this.player.x;
			this.explosionEmitter.y = this.player.y;
			this.explosionEmitter.start(true, 800, null, 30);

			// Go to the menu in 1 second
			game.time.events.add(1000, this.startMenu, this);
		}
	},

	takeBonus: function(player, bonus) {
		// Remove the bonus
		bonus.kill();

		// Update bonus count and score
		this.bonus += 1;
		this.increaseScore(25);

		// Tween the player with sound
		game.add.tween(this.player.scale).to({x: 1.4, y:1.4}, 50)
			.to({x: 1, y: 1}, 100).start();
		this.bonusSound.play();
	},

	enemyHit: function(enemy, bullet) {
		// Remove the bullet
		bullet.kill();

		// Make the enemy move backward when hit
		enemy.y -= 10;

		// Reduce health. If no more health, kill the enemy
		enemy.health -= 25;	
		if (enemy.health <= 0) {
			// Emit particles
			this.explosionEmitter.x = enemy.x;
			this.explosionEmitter.y = enemy.y;
			this.explosionEmitter.start(true, 600, null, 15);

			// Kill the enemy with sound
			enemy.kill();
			this.dieSound.play();

			// Inscrease score
			this.increaseScore(5);
		}
	},

	increaseScore: function(x) {
		// Inscrease the score by 'x' and update the label
		game.global.score += x;
		this.scoreLabel.text = 'score: ' + game.global.score;		
	},

	resetBackground: function() {
		// Set the background to its original color (dark blue)
		game.stage.backgroundColor = '#34495e';
	},

	startMenu: function() {
		game.state.start('menu');
	},
};
