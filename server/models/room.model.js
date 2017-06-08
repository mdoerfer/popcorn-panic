const _ = require('./../util/util');

const Room = function(roomName) {
    this.name = roomName;
    this.players = [];
    this.mode = '';
    this.map = '';
    this.maxPlayers = 4;
};

Room.prototype.setName = function(roomName) {
    this.name = roomName;
};

Room.prototype.addPlayer = function(playerId) {
    var addedPlayer = false;

    if(!this.isFull() && !this.hasPlayer(playerId)) {
        this.players.push(playerId);

        addedPlayer = true;
    }

    return addedPlayer;
};

Room.prototype.removePlayer = function(playerId) {
    var self = this;
    var removedPlayer = false;

    _.foreach(this.players, function(index) {
        if(this === playerId) {
            self.players.splice(index, 1);

            removedPlayer = true;
        }
    });

    return removedPlayer;
};

Room.prototype.setMode = function(roomMode) {
    this.mode = roomMode;
};

Room.prototype.setMap = function(roomMap) {
    this.map = roomMap;
};

Room.prototype.getName = function() {
    return this.name;
};

Room.prototype.getPlayers = function() {
    return this.players;
};

Room.prototype.getMode = function() {
    return this.mode;
};

Room.prototype.getMap = function() {
    return this.map;
};

Room.prototype.getMaxPlayers = function() {
    return this.maxPlayers;
};

Room.prototype.isFull = function() {
    return this.players.length >= this.maxPlayers;
};

Room.prototype.isEmpty = function() {
    return this.players.length === 0;
};

Room.prototype.wouldBeEmpty = function() {
    return (this.players.length - 1) === 0;
};

Room.prototype.hasPlayer = function(playerId) {
    return this.players.indexOf(playerId) !== -1;
};

module.exports = Room;