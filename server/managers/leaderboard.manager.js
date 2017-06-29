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
    this.leaderboard.push(player);

    this.leaderboard.sort(function(a, b) {
        return b.getKills() - a.getKills();
    });

    this.leaderboard = this.leaderboard.slice(0, this.config.maxPlayersInBoard);
};

module.exports = LeaderboardManager;