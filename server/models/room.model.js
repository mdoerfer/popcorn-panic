const Room = function(name) {
    this.name = name;
    this.players = [];
    this.mode = '';
    this.map = '';
    this.maxPlayers = 4;
};

Room.prototype.setName = function(name) {
    this.name = name;
};

Room.prototype.addPlayer = function(id) {
    if(this.players.length < this.maxPlayers) {
        this.players.push(id);
    }
};

Room.prototype.removePlayer = function(id) {
    for(var i = 0; i < this.players.length; i++) {
        if(this.players[i] === id) {
            this.players.splice(i, 1);
        }
    }
};

Room.prototype.setMode = function(mode) {
    this.mode = mode;
};

Room.prototype.setMap = function(map) {
    this.map = map;
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

Room.prototype.hasPlayer = function(id) {
    return this.players.indexOf(id) !== -1;
};

module.exports = Room;