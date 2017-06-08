const _ = require('./../util/util');

const Room = function(roomName) {
    var name = roomName,
        players = [],
        mode = '',
        map = '',
        maxPlayers = 4;

    this.setName = function(roomName) {
        name = roomName;
    };

    this.addPlayer = function(playerId) {
        var addedPlayer = false;

        if(!this.isFull() && !this.hasPlayer(playerId)) {
            players.push(playerId);

            addedPlayer = true;
        }

        return addedPlayer;
    };

    this.removePlayer = function(playerId) {
        var removedPlayer = false;

        _.foreach(players, function(index) {
            if(this.getId() === playerId) {
                players.splice(index, 1);

                removedPlayer = true;
            }
        });

        return removedPlayer;
    };

    this.setMode = function(roomMode) {
        mode = roomMode;
    };

    this.setMap = function(roomMap) {
        map = roomMap;
    };

    this.getName = function() {
        return name;
    };

    this.getPlayers = function() {
        return players;
    };

    this.getMode = function() {
        return mode;
    };

    this.getMap = function() {
        return map;
    };

    this.getMaxPlayers = function() {
        return this.maxPlayers;
    };

    this.isFull = function() {
        return players.length >= maxPlayers;
    };

    this.isEmpty = function() {
        return players.length === 0;
    };

    this.wouldBeEmpty = function() {
        return (players.length - 1) === 0;
    };

    this.hasPlayer = function(playerId) {
        return players.indexOf(playerId) !== -1;
    };
};

module.exports = Room;