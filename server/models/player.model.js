const _ = require('./../util/util');

const Player = function(playerId) {
    var id = playerId,
        name = 'Unknown Unicorn',
        x = 0,
        y = 0,
        z = 0,
        pressure = 0,
        character = 'Default',
        maxPressure = 100;

    this.setId = function(playerId) {
        id = playerId;
    };

    this.setName = function(playerId) {
        name = playerName;
    };

    this.setPressure = function(playerPressure) {
        pressure = playerPressure;
    };

    this.setCharacter = function(playerCharacter) {
        character = playerCharacter;
    };

    this.setLocation = function(playerX, playerY, playerZ) {
        x = playerX;
        y = playerY;
        z = playerZ;
    };

    this.setX = function(playerX) {
        x = playerX;
    };

    this.setY = function(playerY) {
        y = playerY;
    };

    this.setZ = function(playerZ) {
        z = playerZ;
    };

    this.getName = function() {
        return name;
    };

    this.getId = function() {
        return id;
    };

    this.getPressure = function() {
        return pressure;
    };

    this.getCharacter = function() {
        return character;
    };

    this.getLocation = function() {
        return {
            x: x,
            y: y,
            z: z
        };
    };

    this.getX = function() {
        return x;
    };

    this.getY = function() {
        return y;
    };

    this.getZ = function() {
        return z;
    };

    this.takeDamage = function(amount) {
        var newPressure = pressure + amount;

        if(newPressure > maxPressure) {
            pressure = maxPressure;
        }
        else {
            pressure = newPressure;
        }
    };

    this.reset = function() {
        pressure = 0;
        character = 'Default';
        x = 0;
        y = 0;
        z = 0;
    };
};

module.exports = Player;