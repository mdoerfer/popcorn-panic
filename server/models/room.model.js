const Room = function () {
    this.name = '';
    this.players = [];
    this.mode = '';
    this.map = '';
    this.maxPlayers = 4;
};

Room.prototype.setName = function (name) {
    this.name = name;
};

Room.prototype.addPlayer = function (player) {
    if (this.players.length < this.maxPlayers) {
        this.players.push(player);
    }
};

Room.prototype.removePlayer = function (player) {
    for (var i = 0; i < this.players.length; i++) {
        if(this.players[i].getName() === player.getName()) {
            this.players.slice(i, 1);
        }
    }
};

Room.prototype.setMode = function(mode) {
    this.mode = mode;
};

Room.prototype.setMap = function(map) {
    this.map = map;
};

Room.prototype.getName = function () {
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

module.exports = Room;