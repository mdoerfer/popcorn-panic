/**
 * Message
 *
 * @constructor
 */
const Message = function(playerId) {
    this.playerId = playerId;
    this.playerName = 'Anon';
    this.createdAt = Date.now().valueOf();
    this.content = '';
};

Message.prototype.setPlayerId = function(playerId) {
    this.playerId = playerId;

    return this;
};

Message.prototype.setPlayerName = function(playerName) {
    this.playerName = playerName;

    return this;
};

Message.prototype.setContent = function(content) {
    this.content = this.sanitize(content);

    return this;
};

Message.prototype.getPlayerId = function() {
    return this.playerId;
};

Message.prototype.getPlayerName = function() {
    return this.playerName;
};

Message.prototype.getContent = function() {
    return this.sanitize(this.content);
};

Message.prototype.sanitize = function(unsafeHtml) {
    return unsafeHtml
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};