const _ = require('./../util/util'),
    Room = require('./../models/room.model');

const RoomManager = function() {
    this.rooms = [];

    /**
     * Return all rooms
     *
     * @returns {Array<Room>}
     */
    this.getRooms = function() {
        return this.rooms;
    };

    /**
     * Return single room by name
     *
     * @param roomName
     * @returns {null|Room}
     */
    this.getRoom = function(roomName) {
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
    this.createRoom = function(roomName) {
        var createdRoom = false;

        if(!this.roomExists(roomName)) {
            this.rooms.push(new Room(roomName));

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
    this.roomExists = function(roomName) {
        var roomExists = false;

        _.foreach(this.rooms, function() {
            if(this.getName() === roomName) {
                roomExists = true;
            }
        });

        return roomExists;
    };
};

module.exports = RoomManager;