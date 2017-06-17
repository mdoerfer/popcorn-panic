/**
 * Dependencies
 */
const PlayerManager = require('./player.manager'),
    RoomManager = require('./room.manager'),
    ChatManager = require('./chat.manager');

/**
 * GameManager
 *
 * @constructor
 */
const GameManager = function() {
    this.playerManager = new PlayerManager();
    this.roomManager = new RoomManager();
    this.chatManager = new ChatManager();
};

module.exports = GameManager;