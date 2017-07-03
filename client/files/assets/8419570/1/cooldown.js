var Cooldown = pc.createScript('cooldown');

// initialize code called once per entity
Cooldown.prototype.initialize = function() {
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
};

Cooldown.prototype.onTriggerEnter = function(entity) {
    if(entity.tags.has('Player') && (entity.name === game.playerEntity.name)) {
        game.playEffect('water', this.entity);
        
        game.client.coolDown();
    }
};