const Player = function(id) {
    this.id = id;
    this.name = '';
    this.pressure = 0;
    this.character = '';
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.maxPressure = 100;
};

Player.prototype.setId = function(id) {
    this.id = id;
};

Player.prototype.setName = function(name) {
    this.name = name;
};

Player.prototype.setPressure = function(pressure) {
    this.pressure = pressure;
};

Player.prototype.setCharacter = function(character) {
    this.character = character;
};

Player.prototype.setLocation = function(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
};

Player.prototype.setX = function(x)  {
    this.x = x;
};

Player.prototype.setY = function(y)  {
    this.y = y;
};

Player.prototype.setZ = function(z)  {
    this.z = z;
};

Player.prototype.getName = function() {
    return this.name;
};

Player.prototype.getId = function() {
    return this.id;
};

Player.prototype.getPressure = function() {
    return this.pressure;
};

Player.prototype.getCharacter = function() {
    return this.character;
};

Player.prototype.getLocation = function() {
    return {
        x: this.x,
        y: this.y,
        z: this.z
    };
};

Player.prototype.getX = function() {
    return this.x;
};

Player.prototype.getY = function() {
    return this.y;
};

Player.prototype.getZ = function() {
    return this.z;
};

Player.prototype.takeDamage = function(amount) {
    var newPressure = this.pressure + amount;

    if(newPressure > this.maxPressure) {
        this.pressure = this.maxPressure;
    }
    else {
        this.pressure = newPressure;
    }
};

Player.prototype.reset = function() {
    this.pressure = 0;
    this.character = '';
    this.x = 0;
    this.y = 0;
    this.z = 0;
};

module.exports = Player;