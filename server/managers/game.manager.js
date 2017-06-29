/**
 * Dependencies
 */
const PlayerManager = require('./player.manager'),
    RoomManager = require('./room.manager'),
    ChatManager = require('./chat.manager'),
    LeaderboardManager = require('./leaderboard.manager');

/**
 * GameManager
 *
 * @constructor
 */
const GameManager = function() {
    this.playerManager = new PlayerManager();
    this.roomManager = new RoomManager();
    this.chatManager = new ChatManager();
    this.leaderboardManager = new LeaderboardManager();
};

module.exports = GameManager;