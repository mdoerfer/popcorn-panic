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
 * Return single room by random
 *
 * @returns {null|String}
 */
RoomManager.prototype.getRandomRoom = function() {
    var foundRoom = null;
    var i = 0;

    while(foundRoom === null && i < this.rooms.length) {
        if(this.rooms[i].isntFull()) {
            foundRoom = this.rooms[i];
        }

        i++;
    }

    return foundRoom;
};

/**
 * Create room
 *
 * @param roomName
 * @returns {boolean}
 */
RoomManager.prototype.createRoom = function(roomName, ownerId) {
    var createdRoom = null;

    if(!this.roomExists(roomName) && !this.playerIsOwnerAlready(ownerId) && !this.playerIsMemberAlready(ownerId)) {
        var newRoom = new Room(ownerId);
        newRoom.setName(roomName);
        newRoom.addPlayer(ownerId);

        if(!this.roomExists(newRoom.getName())) {
            this.rooms.push(newRoom);

            createdRoom = newRoom;
        }
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

RoomManager.prototype.getPlayersRoomName = function(playerId) {
    var roomName = '';

    _.foreach(this.rooms, function() {
        if(this.hasPlayer(playerId) || this.hasOwner(playerId)) {
            roomName = this.getName();
        }
    });

    return roomName;
};

/**
 * Check if game has started already by room name
 *
 * @param roomName
 * @returns {boolean}
 */
RoomManager.prototype.gameHasStarted = function(roomName) {
    var hasStarted = false;

    _.foreach(this.rooms, function() {
        if((this.getName() === roomName) && this.hasStarted()) {
            hasStarted = true;
        }
    });

    return hasStarted;
};

/**
 * Remove players from rooms he joined and remove his created rooms
 *
 * @param game
 * @param io
 * @param playerId
 */
RoomManager.prototype.removeLeftovers = function(game, io, playerId) {
    var self = this;

    //Remove player from rooms he was in
    _.foreach(this.rooms, function() {
        var roomName = this.getName();

        if(this.hasPlayer(playerId)) {
            this.removePlayer(playerId);

            //Change owner of room if leaving player is owner and room isn't empty
            if(this.hasOwner(playerId) && !this.isEmpty()) {
                this.setOwner(this.getPlayers()[0]);
            }

            //Payload variables
            var leavingPlayer = game.playerManager.getPlayer(playerId),
                roomPlayers = game.playerManager.getPlayers(this.getPlayers());

            //Inform game room about user leaving
            io.to(roomName).emit('room-left', {
                state: 'success',
                target: 'room',
                data: {
                    room: this,
                    roomPlayers: roomPlayers,
                    leavingPlayer: leavingPlayer,
                    rooms: game.roomManager.getRooms()
                }
            });
        }

        //Remove room if empty
        if(this.isEmpty()) {
            self.removeRoom(this.getName());
        }

        io.emit('leftovers-removed', {
            state: 'success',
            target: 'all',
            data: {
                rooms: game.roomManager.getRooms()
            }
        });
    });
};

module.exports = RoomManager;