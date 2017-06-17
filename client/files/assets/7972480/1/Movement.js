var Arena = pc.createScript('arena');

/**
 * Component attributes
 */
Arena.attributes.add('playerSpeed', {
    type: 'number',
    default: 500,
    title: 'Player Speed'
});

Arena.attributes.add('playerTorque', {
    type: 'number',
    default: 300,
    title: 'Player Torque'
});

/**
 * Initialize
 */
Arena.prototype.initialize = function() {
    console.log('Loading game scene');

    this.angrycorn = this.app.root.findByName('Angrycorn');
    this.cornboy = this.app.root.findByName('Cornboy');
    this.corngirl = this.app.root.findByName('Corngirl');
    this.playercorn = this.app.root.findByName('Playercorn');
    this.popcorn = this.app.root.findByName('Popcorn');
    
    this.force = new pc.Vec3();
    
    this.destroyDestroyables();
    this.spawnPlayers();
    this.addGameListeners();
};

/**
 * Destroy any previously created entities
 */
Arena.prototype.destroyDestroyables = function() {
    console.log('Destroying previous entities');
    
    var destroyables = this.app.root.findByTag('Destroyable');
    
    for(var i = 0; i < destroyables.length; i++) {
        destroyables[i].destroy();
    }
};

/**
 * Spawn players
 */
Arena.prototype.spawnPlayers = function() { 
    console.log('Spawning players');

    //Get room info
    this.room = game.client.room;

    //Declare variables
    var playerEntity;
    var spawnpoint;
    var currPlayer;

    //Create player entities
    for(var i = 0; i < this.room.players.length; i++) {
        currPlayer = this.room.players[i];
        
        //Get correct spawnpoint
        spawnpoint = this.app.root.findByName('Spawnpoint ' + i);

        //Get player character entity
        switch(currPlayer.character) {
            case 'Angrycorn':
                playerEntity = this.app.root.findByName('Angrycorn').clone();
                break;
            case 'Corngirl':
                playerEntity = this.app.root.findByName('Corngirl').clone();
                break;
            case 'Cornboy':
                playerEntity = this.app.root.findByName('Cornboy').clone();
                break;
            case 'Playercorn':
                playerEntity = this.app.root.findByName('Playercorn').clone();
                break;
            default:
                playerEntity = this.app.root.findByName('Cornboy').clone();
        }
        
        //Set entity name
        playerEntity.name = currPlayer.id;
        
        //Tag player entity
        playerEntity.tags.add('Destroyable');
        
        console.log('PLAYER ENTITY');
        console.log(playerEntity.children);
        
        //Save other players
        this.otherEntities = [];

        //If player entity is mine, save it for later use
        if(currPlayer.id === game.client.me.id) {
            this.playerEntity = playerEntity;
  
            this.playerEntity.findByName('damage').collision.on('collisionstart', this.onCollisionStart, this);
        }
        else {
            this.otherEntities.push(playerEntity);
            
            playerEntity.findByName('damage').collision.on('collisionstart', this.onOtherCollisionStart, this);
        }

        //Enable entity
        playerEntity.enabled = true;

        //Teleport entity to spawnpoint
        playerEntity.rigidbody.teleport(spawnpoint.getPosition());    

        //Add entity to hierarchy
        this.app.root.addChild(playerEntity);
    }
};

Arena.prototype.onCollisionStart = function (result) {
    var hit = 0;
    
    //TODO: Debounce attack rate
    if(result.other.tags.has('Attackable') && result.other.tags.has('Player') && hit === 0) {    
        //Send player taking damage to server
        game.client.takeDamage(result.other.name);
        
        //Play sound
        result.other.sound.play("fire");
        
        hit = 1;
    }
    
    if(result.other.tags.has('water')) {    
        //Play sound
        result.other.sound.play("water");
    }
};


Arena.prototype.onOtherCollisionStart = function(result) {
    if(result.other.tags.has('Attackable') && result.other.tags.has('Player')) {    
        //Play sound
        result.other.sound.play("fire");
    }
    
    if(result.other.tags.has('water')) {    
        //Play sound
        result.other.sound.play("water");
    }
};


/**
 * Update player
 */
Arena.prototype.update = function(dt) {
    var moved = false;
    var currPos = this.playerEntity.getPosition();
    
    //Dont move if tutorial not done
    if(!game.client.tutorialDone) {
        return;
    }
    
    var forward = this.playerEntity.forward;
    var right = this.playerEntity.right;
    var app = this.app;
    
    x = 0;
    z = 0;

    if(this.app.keyboard.isPressed(pc.KEY_D)) {
        this.playerEntity.rigidbody.applyTorque(0, -this.playerTorque, 0);
    }

    if(this.app.keyboard.isPressed(pc.KEY_A)) {
        this.playerEntity.rigidbody.applyTorque(0, this.playerTorque, 0);
    }

    if(this.app.keyboard.isPressed(pc.KEY_S)) {
        x += forward.x;
        z += forward.z;
    }

    if(this.app.keyboard.isPressed(pc.KEY_W)) {
        x -= forward.x;
        z -= forward.z;
    }
    
    if (x !== 0 || z !== 0) {
        x *= dt;
        z *= dt;

        this.force.set(x, 0, z).normalize().scale((this.playerSpeed));
        this.playerEntity.rigidbody.applyForce(this.force);
    }
    
    //Move player
    game.client.movePlayer(this.playerEntity.getPosition(), this.playerEntity.getLocalEulerAngles());
};

/**
 * React on game events
 */
Arena.prototype.addGameListeners = function() {
    var self = this;
    
    this.app.on('game:tutorial-start', function() {
        console.log('Tutorial started');
        
        self.app.root.findByName('Root').sound.play('tutorial');
    });

    this.app.on('game:countdown-sound', function() {
        self.app.root.findByName('Root').sound.stop('tutorial');
        self.app.root.findByName('Root').sound.play('countdown');
    });
    

    this.app.on('game:countdown-fight', function() {
        self.app.root.findByName('Root').sound.play('fight');
    });


    this.app.on('game:tutorial-end', function() {
        self.app.root.findByName('Root').sound.play('music');
        self.app.root.findByName('Root').sound.play('haha');
    });

    
    //Move player
    this.app.on('game:player-moved', function(player) {
        var entity = self.app.root.findByName(player.id);

        if(entity !== null) {
            entity.setLocalEulerAngles(new pc.Vec3(player.rotX, player.rotY, player.rotZ));
            entity.rigidbody.teleport(new pc.Vec3(player.x, player.y, player.z));
        }
        
    });
    
    //Damage player
    this.app.on('game:player-damaged', function(room, playerThatDied) {
       updateGame(room); 
        
        if(typeof playerThatDied !== "undefined") {
            var diedEntity = self.app.root.findByName(playerThatDied);
            
            //Get random spawn
            var getRandomInt = function(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };
            
            var spawnpoint = self.app.root.findByName('Spawnpoint ' + getRandomInt(0,3));
            var currPos = self.playerEntity.getPosition();
            
            diedEntity.enabled = false;
            diedEntity.rigidbody.teleport(spawnpoint.getPosition());
            
            setTimeout(function() {
                diedEntity.enabled = true;
                self.app.root.findByName('Root').sound.play('respawn');
            }, 5000);
            
            
            var vorlagenPopcorn =  self.app.root.findByName('Popcorn');
            var newPopcorn = vorlagenPopcorn.clone();
            self.app.root.addChild(newPopcorn);
            newPopcorn.rigidbody.teleport(currPos);
            newPopcorn.enabled = true;
            self.app.root.findByName('Root').sound.play('kill');
            self.app.root.findByName('Root').sound.play('haha');
        }
    });
    
    //Remove leaving player entity
    this.app.on('game:someone-left', function(leavingPlayer) {
       var entity = self.app.root.findByName(leavingPlayer.id);
        
        if(entity !== null) {
           entity.destroy();
        }
    });
    
    //End game
    this.app.on('game:game-ended', function(room) {
       //Hier alles was passieren muss wenn game fertig ist
       self.app.root.findByName('Root').sound.stop('music');
       self.app.root.findByName('Root').sound.play('hero');
    });
};