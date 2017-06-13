var Collider = pc.createScript('collider');

// initialize code called once per entity
Collider.prototype.initialize = function () {
    this.entity.collision.on('collisionstart', this.onCollisionStart, this);
};

Collider.prototype.onCollisionStart = function (result) {
    if (result.name == "Collisiontester") {
    //if (result.name == "Cornboy" || result.name == "Corngirl" || result.name == "Angrycorn") {
        //Hier Code einfügen, was dann passieren soll bei Berührung
        this.entity.sound.play("fire");
    }
};