var Movement = pc.createScript('movement');

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

// initialize code called once per entity
Movement.prototype.initialize = function() {
    console.log('Loading game scene');
    
    this.angrycorn = this.app.root.findByName('Angrycorn');
    this.cornboy = this.app.root.findByName('Cornboy');
    this.corngirl = this.app.root.findByName('Corngirl');
    
    this.spawnPlayers();
    
    this.force = new pc.Vec3();
};

Movement.prototype.spawnPlayers = function() {
    console.log('Spawning players');
    
    this.room = game.client.room;
    var originalEntity;
    var playerEntity;
    var spawnpoint;
    
    for(var i = 0; i < this.room.players.length; i++) {
        spawnpoint = this.app.root.findByName('Spawnpoint ' + i);
        
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
        
        playerEntity = originalEntity.clone();
        
        if(this.room.players[i].id === game.client.me.id) {
            this.playerEntity = playerEntity;
        }
        
        playerEntity.name = this.room.players[i].id;
        
        playerEntity.enabled = true;
        
        playerEntity.rigidbody.teleport(spawnpoint.getPosition());
        
        this.app.root.addChild(playerEntity);
    }
};

// update code called every frame
Movement.prototype.update = function(dt) {
    if(this.app.keyboard.isPressed(pc.KEY_A)) {
        this.hspeed = Math.min(this.hspeed + this.hacceleration * dt, this.MAX_HSPEED);
        
        this.playerEntity.translateLocal(this.hspeed * dt, 0, 0);
        this.playerEntity.rigidbody.syncEntityToBody();
    }
    
    if(this.app.keyboard.isPressed(pc.KEY_A) && this.app.keyboard.isPressed(pc.KEY_W)) {
        this.rotspeed = Math.min(this.rotspeed + this.rotacceleration * dt, this.MAX_ROTSPEED); 

        this.playerEntity.rotateLocal(0, this.rotspeed, 0);
        this.playerEntity.rigidbody.syncEntityToBody();
    }
    
    if(this.app.keyboard.isPressed(pc.KEY_A) && this.app.keyboard.isPressed(pc.KEY_S)) {
        this.rotspeed = Math.min(this.rotspeed + this.rotacceleration * dt, this.MAX_ROTSPEED); 

        this.playerEntity.rotateLocal(0, -this.rotspeed, 0);
        this.playerEntity.rigidbody.syncEntityToBody();
    }

    if(this.app.keyboard.isPressed(pc.KEY_D)) {
        this.hspeed = Math.min(this.hspeed + this.hacceleration * dt, this.MAX_HSPEED);
        
        this.playerEntity.translateLocal(-(this.hspeed * dt), 0, 0);
        this.playerEntity.rigidbody.syncEntityToBody();
    }
    
    if(this.app.keyboard.isPressed(pc.KEY_D) && this.app.keyboard.isPressed(pc.KEY_W)) {
        this.rotspeed = Math.min(this.rotspeed + this.rotacceleration * dt, this.MAX_ROTSPEED); 

        this.playerEntity.rotateLocal(0, -this.rotspeed, 0);
        this.playerEntity.rigidbody.syncEntityToBody();
    }
    
    if(this.app.keyboard.isPressed(pc.KEY_D) && this.app.keyboard.isPressed(pc.KEY_S)) {
        this.rotspeed = Math.min(this.rotspeed + this.rotacceleration * dt, this.MAX_ROTSPEED); 

        this.playerEntity.rotateLocal(0, this.rotspeed, 0);
        this.playerEntity.rigidbody.syncEntityToBody();
    }
    
    if(this.app.keyboard.isPressed(pc.KEY_W)) {
        this.vspeed = Math.min(this.vspeed + this.vacceleration * dt, this.MAX_VSPEED);
        
        this.playerEntity.translateLocal(0, 0, this.vspeed * dt);
        this.playerEntity.rigidbody.syncEntityToBody();
    }
    
    if(this.app.keyboard.isPressed(pc.KEY_S)) {
        this.vspeed = Math.min(this.vspeed + this.vacceleration * dt, this.MAX_VSPEED);

        this.playerEntity.translateLocal(0, 0, -(this.vspeed * dt));
        this.playerEntity.rigidbody.syncEntityToBody();
    }

};