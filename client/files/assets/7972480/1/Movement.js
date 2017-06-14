var Movement = pc.createScript('movement');

/**
 * Component attributes
 */
Movement.attributes.add('hspeed', {
    type: 'number',
    default: 10,
    title: 'Horizontal speed'
});

Movement.attributes.add('hacceleration', {
    type: 'number',
    default: 10,
    title: 'Horizontal acceleration'
});

Movement.attributes.add('MAX_HSPEED', {
    type: 'number',
    default: 10,
    title: 'Maximum horizontal speed'
});

Movement.attributes.add('vspeed', {
    type: 'number',
    default: 10,
    title: 'Vertical speed'
});

Movement.attributes.add('vacceleration', {
    type: 'number',
    default: 10,
    title: 'Vertical acceleration'
});

Movement.attributes.add('MAX_VSPEED', {
    type: 'number',
    default: 10,
    title: 'Maximum vertical speed'
});

Movement.attributes.add('rotspeed', {
    type: 'number',
    default: 10,
    title: 'Rotation speed'
});

Movement.attributes.add('rotacceleration', {
    type: 'number',
    default: 10,
    title: 'Rotation acceleration'
});

Movement.attributes.add('MAX_ROTSPEED', {
    type: 'number',
    default: 10,
    title: 'Maximum rotation speed'
});

/**
 * Initialize
 */
Movement.prototype.initialize = function() {
    console.log('Loading game scene');

    this.angrycorn = this.app.root.findByName('Angrycorn');
    this.cornboy = this.app.root.findByName('Cornboy');
    this.corngirl = this.app.root.findByName('Corngirl');

    this.spawnPlayers();
    this.addPlayerMoveListener();  
};

/**
 * Spawn players
 */
Movement.prototype.spawnPlayers = function() {
    console.log('Spawning players');

    //Get room info
    this.room = game.client.room;

    //Declare variables
    var originalEntity;
    var playerEntity;
    var spawnpoint;

    this.otherEntities = [];

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

        //If player entity is mine, save it for later use
        if(this.room.players[i].id === game.client.me.id) {
            this.playerEntity = playerEntity;
        }
        else {
            this.otherEntities.push(playerEntity);
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

/**
 * Update player
 */
Movement.prototype.update = function(dt) {
    var moved = false;

    if(this.app.keyboard.isPressed(pc.KEY_D)) {
        this.playerEntity.rotateLocal(0, -this.rotspeed, 0);
        this.playerEntity.rigidbody.syncEntityToBody();

        moved = true;
    }

    if(this.app.keyboard.isPressed(pc.KEY_A)) {
        this.playerEntity.rotateLocal(0, this.rotspeed, 0);
        this.playerEntity.rigidbody.syncEntityToBody();

        moved = true;
    }

    if(this.app.keyboard.isPressed(pc.KEY_W)) {
        this.vspeed = Math.min(this.vspeed + this.vacceleration * dt, this.MAX_VSPEED);

        this.playerEntity.translateLocal(0, 0, this.vspeed * dt);
        this.playerEntity.rigidbody.syncEntityToBody();

        moved = true;
    }

    if(this.app.keyboard.isPressed(pc.KEY_S)) {
        this.vspeed = Math.min(this.vspeed + this.vacceleration * dt, this.MAX_VSPEED);

        this.playerEntity.translateLocal(0, 0, -(this.vspeed * dt));
        this.playerEntity.rigidbody.syncEntityToBody();

        moved = true;
    }

    if(moved) {
        game.client.movePlayer(this.playerEntity.getPosition(), this.playerEntity.getLocalEulerAngles());
    }
};

/**
 * React on game events
 */
Movement.prototype.addPlayerMoveListener = function() {
    var self = this;
    
    //Move player
    this.app.on('game:player-moved', function(player) {
        var entity = self.app.root.findByName(player.id);

        if(entity !== null) {
            entity.setLocalEulerAngles(new pc.Vec3(player.rotX, player.rotY, player.rotZ));
            entity.rigidbody.teleport(new pc.Vec3(player.x, player.y, player.z));
        }
    });
    
    //Remove leaving player entity
    this.app.on('game:someone-left', function(leavingPlayer) {
       var entity = self.app.root.findByName(leavingPlayer.id);
        
        if(entity !== null) {
           entity.destroy(); 
        }
    });
};