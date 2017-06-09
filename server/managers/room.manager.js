/**
 * Dependencies
 */
const _ = require('./../util/util'),
    Room = require('./../models/room.model');

/**
 * RoomManager
 *
 * @constructor
 */
const RoomManager = function() {
    this.rooms = [];
};

/**
 * Return all rooms
 *
 * @returns {Array<Room>}
 */
RoomManager.prototype.getRooms = function() {
    return this.rooms;
};

/**
 * Return single room by name
 *
 * @param roomName
 * @returns {null|Room}
 */
RoomManager.prototype.getRoom = function(roomName) {
    var foundRoom = null;

    _.foreach(this.rooms, function(index) {
        if(this.getName() === roomName) {
            foundRoom = this;
        }
    });

    return foundRoom;
};

/**
 * Create room
 *
 * @param roomName
 * @returns {boolean}
 */
RoomManager.prototype.createRoom = function(roomName, ownerId) {
    var createdRoom = false;

    if(!this.roomExists(roomName) && !this.playerIsOwnerAlready(ownerId) && !this.playerIsMemberAlready(ownerId)) {
        this.rooms.push(new Room(roomName, ownerId));

        createdRoom = true;
    }

    return createdRoom;
};

/**
 * Remove room
 *
 * @param roomName
 * @returns {boolean}
 */
RoomManager.prototype.removeRoom = function(roomName) {
    var self = this;
    var removedRoom = false;

    _.foreach(this.rooms, function(index) {
        if(this.getName() === roomName) {
            self.rooms.splice(index, 1);

            removedRoom = true;
        }
    });

    return removedRoom;
};

/**
 * Check if room exists already
 *
 * @param roomName
 * @returns {boolean}
 */
RoomManager.prototype.roomExists = function(roomName) {
    var roomExists = false;

    _.foreach(this.rooms, function() {
        if(this.getName() === roomName) {
            roomExists = true;
        }
    });

    return roomExists;
};

/**
 * Check if player has already created a room
 *
 * @param playerId
 */
RoomManager.prototype.playerIsOwnerAlready = function(playerId) {
    var isOwnerAlready = false;

    _.foreach(this.rooms, function() {
       if(this.hasOwner(playerId)) {
           isOwnerAlready = true;
       }
    });

    return isOwnerAlready;
};

/**
 * Check if player has already joined a room
 *
 * @param playerId
 */
RoomManager.prototype.playerIsMemberAlready = function(playerId) {
    var isMemberAlready = false;

    _.foreach(this.rooms, function() {
        if(this.hasPlayer(playerId)) {
            isMemberAlready = true;
        }
    });

    return isMemberAlready;
};

/**
 * Remove players from rooms he joined and remove his created rooms
 *
 * @param playerId
 */
RoomManager.prototype.removeLeftovers = function(playerId) {
    var self = this;

    //Remove player from rooms he was in
  _.foreach(this.rooms, function() {
      if(this.hasPlayer(playerId)) {
          this.removePlayer(playerId);
      }

      if(this.hasOwner(playerId)) {
          self.removeRoom(this.getName());
      }
  });
};

module.exports = RoomManager;