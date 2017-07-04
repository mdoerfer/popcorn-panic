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
    
    this.force = new pc.Vec3();
    
    this.colors = this.app.assets.findByTag('PlayerColor');
    
    this.addGameListeners();
    this.destroyDestroyables();
    this.spawnPlayers();
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
    
    game.playerEntity = null;
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
        
        //Save other players
        this.otherEntities = [];

        //If player entity is mine, save it for later use
        if(currPlayer.id === game.client.me.id) {
            this.playerEntity = playerEntity;
            game.playerEntity = this.playerEntity;
  
            this.playerEntity.findByName('damage').collision.on('collisionstart', this.onCollisionStart, this);
        }
        else {
            this.otherEntities.push(playerEntity);
            
            playerEntity.findByName('damage').collision.on('collisionstart', this.onOtherCollisionStart, this);
        }
        
        //Set player entity marker color
        var playerMarker = playerEntity.findByName('Marker');
        var playerMarkerMaterial = this.app.assets.find('Marker' + i, 'material');
        var playerMarkerMaterialColor = new pc.Color(playerMarkerMaterial.data.diffuse[0], playerMarkerMaterial.data.diffuse[1], playerMarkerMaterial.data.diffuse[2]);
        var dotColor = playerMarkerMaterialColor.toString();
        
        //Give marker the right asset
        playerMarker.model.materialAsset = playerMarkerMaterial;
        
        //Change dot color to player color
        document.getElementById('player-'+(i+1)).dataset.dotColor = dotColor;
        document.getElementById('player-'+(i+1)).querySelector('.player-dot').style.backgroundColor = dotColor;
        
        //TODO: Rotate player to match local euler angles of spawnpoint

        //Enable entity
        playerEntity.enabled = true;

        //Teleport entity to spawnpoint
        playerEntity.rigidbody.teleport(spawnpoint.getPosition());    

        //Add entity to hierarchy
        this.app.root.addChild(playerEntity);
    }
};

Arena.prototype.onCollisionStart = function (result) {
    //TODO: Debounce attack rate
    if(result.other.tags.has('Attackable') && result.other.tags.has('Player')) {    
        //Send player taking damage to server
        game.client.takeDamage(result.other.name);
        
        //Play sound
        game.playEffect('fire', result.other);
    }
    
    if(result.other.tags.has('Water')) {
        //Play sound
        game.playEffect('water', result.other);
    }
};


Arena.prototype.onOtherCollisionStart = function(result) {
    if(result.other.tags.has('Attackable') && result.other.tags.has('Player')) {    
        //Play sound
        game.playEffect('fire', result.other);
    }
    
    if(result.other.tags.has('Water')) {
        //Play sound
        game.playEffect('water', result.other);
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
    
    if(!game.client.addedListeners) {
        this.app.on('game:tutorial-start', function() {
            console.log('Tutorial started'); 
            
            game.playMusic('tutorial');
        });

        this.app.on('game:countdown-sound', function() {
            game.stopSound('tutorial');
            game.playEffect('countdown');
        });


        this.app.on('game:countdown-fight', function() {
            game.playEffect('fight');
        });


        this.app.on('game:tutorial-end', function() {
            console.log('Tutorial ended'); 
            
            game.playMusic('music');
            game.playEffect('haha');
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
                
                //Disable died player
                diedEntity.enabled = false;
                diedEntity.rigidbody.teleport(spawnpoint.getPosition());
                
                //After 5 sec, teleport to spawnpoint and enable again
                setTimeout(function() {
                    diedEntity.enabled = true;
                    game.playEffect('respawn');
                }, 5000);

                var vorlagenPopcorn =  self.app.root.findByName('Popcorn');
                var newPopcorn = vorlagenPopcorn.clone();
                
                newPopcorn.tags.add('Destroyable');
                
                self.app.root.addChild(newPopcorn);
                newPopcorn.rigidbody.teleport(currPos);
                newPopcorn.enabled = true;
                
                game.playEffect('kill');
                game.playEffect('haha');
            }
        });
        
        //Cool down player
        this.app.on('game:player-cooled-down', function(room) {
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
            game.stopSound('music');
            game.playMusic('hero');
        });
        
        //Leave podium
        this.app.on('game:podium-left', function() {
            game.stopSound('hero');
        });
        
        //Set flag
        game.client.addedListeners = true;
    }
};