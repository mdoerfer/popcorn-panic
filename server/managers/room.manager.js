const _ = require('./../util/util'),
    Room = require('./../models/room.model');

const RoomManager = function() {
    var rooms = [];

    /**
     * Return all rooms
     *
     * @returns {Array<Room>}
     */
    this.getRooms = function() {
        return rooms;
    };

    /**
     * Return single room by name
     *
     * @param roomName
     * @returns {null|Room}
     */
    this.getRoom = function(roomName) {
        var foundRoom = null;

        _.foreach(rooms, function(index) {
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
    this.createRoom = function(roomName) {
        var createdRoom = false;

        if(!roomExists(roomName)) {
            rooms.push(new Room(roomName));

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
    this.removeRoom = function(roomName) {
        var removedRoom = false;

        _.foreach(rooms, function(index) {
            if(this.getName() === roomName) {
                rooms.splice(index, 1);

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
    this.roomExists = function(roomName) {
        var roomExists = false;

        _.foreach(rooms, function() {
            if(this.getName() === roomName) {
                roomExists = true;
            }
        });

        return roomExists;
    };
};

module.exports = RoomManager;