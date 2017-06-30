/**
 * Dependencies
 */
const _ = require('./../util/util');

/**
 * LeaderboardManager
 *
 * @constructor
 */
const LeaderboardManager = function() {
    this.leaderboard = [];

    this.config = {
        maxPlayersInBoard: 20
    };
};

LeaderboardManager.prototype.getLeaderboard = function() {
  return this.leaderboard;
};

/**
 * Add player to leaderboard
 *
 * @param player
 */
LeaderboardManager.prototype.addPlayerToLeaderboard = function(player) {
    //Skip if player has 0 kills
    if(player.kills <= 0) return;

    //Reduce information to be saved
    var boardPlayer = {
        name: player.name,
        kills: player.kills,
        timestamp: new Date().valueOf()
    };

    //Add player to leaderboard
    this.leaderboard.push(boardPlayer);

    //Sort leaderboard anew
    this.leaderboard.sort(function(a, b) {
        return b.kills - a.kills;
    });

    //Reduce leaderboard to max players limit
    this.leaderboard = this.leaderboard.slice(0, this.config.maxPlayersInBoard);
};

module.exports = LeaderboardManager;