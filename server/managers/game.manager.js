/**
 * Dependencies
 */
const PlayerManager = require('./player.manager'),
    RoomManager = require('./room.manager');

/**
 * GameManager
 *
 * @constructor
 */
const GameManager = function() {
    this.playerManager = new PlayerManager();
    this.roomManager = new RoomManager();
};

module.exports = GameManager;