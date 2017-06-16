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
    
    this.force = new pc.Vec3();

    this.spawnPlayers();
    this.addGameListeners();
};

/**
 * Spawn players
 */
Arena.prototype.spawnPlayers = function() { 
    console.log('Spawning players');

    //Get room info
    this.room = game.client.room;

    //Declare variables
    var originalEntity;
    var playerEntity;
    var spawnpoint;

    //Create player entities
    for(var i = 0; i < this.room.players.length; i++) {
        //Get correct spawnpoint
        spawnpoint = this.app.root.findByName('Spawnpoint ' + i);

        //Get player character entity
        switch(this.room.players[i].character) {
            case 'Angrycorn':
                originalEntity = this.angrycorn;
                break;
            case 'Corngirl':
                originalEntity = this.corngirl;
                break;
            case 'Cornboy':
                originalEntity = this.cornboy;
                break;
            default:
                originalEntity = this.cornboy;
        }

        //Create player entity
        playerEntity = originalEntity.clone();
        
        //Save other players
        this.otherEntities = [];

        //If player entity is mine, save it for later use
        if(this.room.players[i].id === game.client.me.id) {
            this.playerEntity = playerEntity;
  
            this.playerEntity.findByName('damage').collision.on('collisionstart', this.onCollisionStart, this); 
        }
        else {
            this.otherEntities.push(playerEntity);
            
            playerEntity.findByName('damage').collision.on('collisionstart', this.onOtherCollisionStart, this);
        }

        //Set entity name
        playerEntity.name = this.room.players[i].id;

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
};


Arena.prototype.onOtherCollisionStart = function(result) {
    if(result.other.tags.has('Attackable') && result.other.tags.has('Player')) {    
        //Play sound
        result.other.sound.play("fire");
    }
};

//Mirjam
/**
Arena.prototype.onOtherCollisionStart = function(result) {
    if(result.other.tags.has('water')) {    
        //Play sound
        result.other.sound.play("water");
    }
};
*/

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
        
        moved = true;
    }

    if(this.app.keyboard.isPressed(pc.KEY_A)) {
        this.playerEntity.rigidbody.applyTorque(0, this.playerTorque, 0);

        moved = true;
    }

    if(this.app.keyboard.isPressed(pc.KEY_S)) {
        x += forward.x;
        z += forward.z;

        moved = true;
    }

    if(this.app.keyboard.isPressed(pc.KEY_W)) {
        x -= forward.x;
        z -= forward.z;

        moved = true;
    }
    
    if (x !== 0 || z !== 0) {
        x *= dt;
        z *= dt;

        this.force.set(x, 0, z).normalize().scale((this.playerSpeed));
        this.playerEntity.rigidbody.applyForce(this.force);
    }

    if(moved) {    
        //Move player
        game.client.movePlayer(this.playerEntity.getPosition(), this.playerEntity.getLocalEulerAngles());
    }
};

/**
 * React on game events
 */
Arena.prototype.addGameListeners = function() {
    var self = this;
    
    //Move player
    this.app.on('game:player-moved', function(player) {
        var entity = self.app.root.findByName(player.id);

        if(entity !== null) {
            entity.setLocalEulerAngles(new pc.Vec3(player.rotX, player.rotY, player.rotZ));
            entity.rigidbody.teleport(new pc.Vec3(player.x, player.y, player.z));
        }
    });
    
    //Damage player
    this.app.on('game:player-damaged', function(room) {
       updateGame(room); 
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