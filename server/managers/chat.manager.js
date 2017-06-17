/**
 * Dependencies
 */
const _ = require('./../util/util'),
    Message = require('./../models/message.model');


/**
 * ChatManager
 *
 * @constructor
 */
const ChatManager = function() {
    this.chat = [];
};

/**
 * Return new Message object
 *
 * @param playerId
 */
ChatManager.prototype.getNewMessage = function(playerId) {
  return new Message(playerId);
};

/**
 * Return the whole lobby chat
 */
ChatManager.prototype.getLobbyChat = function() {
    return this.chat;
};

/**
 * Add lobby chat message
 */
ChatManager.prototype.addLobbyChatMessage = function(message) {
    if(message instanceof Message) {
        this.chat.push(message);
    }
};