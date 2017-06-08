const _ = require('./../util/util'),
    Player = require('./../models/player.model');

const PlayerManager = function() {
    this.players = [];

    /**
     * Return all players
     *
     * @returns {Array<Player>}
     */
    this.getPlayers = function(ids) {
        if(ids !== undefined) {
            var foundPlayers = [];

            for(var i = 0; i < this.players.length; i++) {
                for(var c = 0; c < ids.length; c++) {
                    if(this.players[i].getId() === ids[c]) {
                        foundPlayers.push(player);
                    }
                }
            }

            return foundPlayers;
        }
        else {
            return this.players;
        }
    };

    /**
     * Return single player by id
     *
     * @param playerId
     * @returns {null|Player}
     */
    this.getPlayer = function(playerId) {
        var foundPlayer = null;

        _.foreach(this.players, function(index) {
            if(this.getId() === playerId) {
                foundPlayer = this;
            }
        });

        return foundPlayer;
    };

    /**
     * Create player
     *
     * @param playerId
     * @returns {boolean}
     */
    this.createPlayer = function(playerId) {
        this.players.push(new Player(playerId));

        return true;
    };

    /**
     * Remove player
     *
     * @param playerId
     * @returns {boolean}
     */
    this.removePlayer = function(playerId) {
        var self = this;
        var removedPlayer = false;

        _.foreach(this.players, function(index) {
            if(this.getId() === playerId) {
                self.players.splice(index, 1);

                removedPlayer = true;
            }
        });

        return removedPlayer;
    };
};

module.exports = PlayerManager;