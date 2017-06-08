const _ = require('./../util/util'),
    Player = require('./../models/player.model');

const PlayerManager = function() {
    var players = [];

    /**
     * Return all players
     *
     * @returns {Array<Player>}
     */
    this.getPlayers = function(ids) {
        if(ids !== undefined) {
            var foundPlayers = [];

            _.foreach(players, function(index) {
                var player = this;

                _.foreach(ids, function(index) {
                    var id = this;

                    if(player.getId() === id) {
                        foundPlayers.push(player);
                    }
                });
            });

            return foundPlayers;
        }
        else {
            return players;
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

        _.foreach(players, function(index) {
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
        players.push(new Player(playerId));

        return true;
    };

    /**
     * Remove player
     *
     * @param playerId
     * @returns {boolean}
     */
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
};

module.exports = PlayerManager;