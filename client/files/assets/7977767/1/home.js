var UI = pc.createScript('ui');

/**
 * Add component attributes
 */
UI.attributes.add('headerLogo', {
    type: 'asset',
    title: 'Header Logo'
});

UI.attributes.add('headerBg', {
    type: 'asset',
    title: 'Header Background'
});

UI.attributes.add('cornboyPic', {
    type: 'asset',
    title: 'Cornboy'
});

UI.attributes.add('corngirlPic', {
    type: 'asset',
    title: 'Corngirl'
});

UI.attributes.add('angrycornPic', {
    type: 'asset',
    title: 'Angrycorn'
});

UI.attributes.add('chevron', {
    type: 'asset',
    title: 'Chevron'
});

UI.attributes.add('chevronsWhite', {
    type: 'asset',
    title: 'ChevronsWhite'
});

UI.attributes.add('redplane', {
    type: 'asset',
    title: 'redplane'
});

UI.attributes.add('play', {
    type: 'asset',
    title: 'play'
});

UI.attributes.add('crown', {
    type: 'asset',
    title: 'Crown'
});

UI.attributes.add('dummyCorn', {
    type: 'asset',
    title: 'DummyCorn'
});

UI.attributes.add('html', {
    type: 'asset',
    assetType: 'html',
    title: 'HTML'
});

UI.attributes.add('css', {
    type: 'asset',
    assetType: 'css',
    title: 'CSS'
});

UI.attributes.add('productions', {
    type: 'asset',
    title: 'Productions'
});

UI.attributes.add('tutorial01', {
    type: 'asset',
    title: 'Tutorial01'
});

UI.attributes.add('tutorial02', {
    type: 'asset',
    title: 'Tutorial02'
});

/**
 * Initialize component
 */
UI.prototype.initialize = function() {
    this.initializeUI();
    this.initializeClient();
};

/**
 * Initialize UI
 */
UI.prototype.initializeUI = function() {
    this.loadUI();
    this.showUIPart('lobby');
};

/**
 * Load lobby
 */
UI.prototype.loadUI = function() {
    /**
     * Append CSS
     */
    var style = document.createElement('style');
    style.innerHTML = this.css.resource || '';
    document.head.appendChild(style);

    /**
     * Append HTML
     */
    var div = document.createElement('div');
    div.setAttribute('id', 'ui');
    div.innerHTML = this.html.resource || '';
    document.body.appendChild(div);

    /**
     * Add images
     */
    game.images.headerBg = (this.headerBg !== null) ? this.headerBg.getFileUrl() : '';
    game.images.headerLogo = (this.headerLogo !== null) ? this.headerLogo.getFileUrl() : '';
    game.images.cornboy = (this.cornboyPic !== null) ? this.cornboyPic.getFileUrl() : '';
    game.images.corngirl = (this.corngirlPic !== null) ? this.corngirlPic.getFileUrl() : '';
    game.images.angrycorn = (this.angrycornPic !== null) ? this.angrycornPic.getFileUrl() : '';
    game.images.chevron = (this.chevron !== null) ? this.chevron.getFileUrl() : '';
    game.images.chevronWhite = (this.chevronsWhite !== null) ? this.chevronsWhite.getFileUrl() : '';
    game.images.redplane = (this.redplane !== null) ? this.redplane.getFileUrl() : '';
    game.images.play = (this.play !== null) ? this.play.getFileUrl() : '';
    game.images.crown = (this.crown !== null) ? this.crown.getFileUrl() : '';
    game.images.dummyCorn = (this.dummyCorn !== null) ? this.dummyCorn.getFileUrl() : '';
    game.images.productions = (this.productions !== null) ? this.productions.getFileUrl() : '';
    game.images.tutorial01 = (this.tutorial01 !== null) ? this.tutorial01.getFileUrl() : '';
    game.images.tutorial02 = (this.tutorial02 !== null) ? this.tutorial02.getFileUrl() : '';

    document.getElementById('header-bg').setAttribute('src', game.images.headerBg);
    document.getElementById('header-logo').setAttribute('src', game.images.headerLogo);
    document.getElementById('cornboy-pic').setAttribute('src', game.images.cornboy);
    document.getElementById('corngirl-pic').setAttribute('src', game.images.corngirl);
    document.getElementById('angrycorn-pic').setAttribute('src', game.images.angrycorn);
    document.getElementById('productions').setAttribute('src', game.images.productions);
    document.getElementById('tutorial01').setAttribute('src', game.images.tutorial01);
    document.getElementById('tutorial02').setAttribute('src', game.images.tutorial02);

    var redplanes = document.getElementsByClassName('redplane');
    var play = document.getElementsByClassName('play');

    for(var c = 0; c < redplanes.length; c++) {
        redplanes[c].setAttribute('src', game.images.redplane);
    }

    for(var d = 0; d < play.length; d++) {
        play[d].setAttribute('src', game.images.play);
    }


    var chevrons = document.getElementsByClassName('chevron');

    for(var i = 0; i < chevrons.length; i++) {
        chevrons[i].setAttribute('src', game.images.chevron);
    }

    var chevronsWhite = document.getElementsByClassName('chevronsWhite');

    for(var j = 0; j < chevronsWhite.length; j++) {
        chevronsWhite[j].setAttribute('src', game.images.chevronWhite);
    }

    /**
     * Bind event listeners
     */
    this.bindDataEventListeners();
    this.bindHTMLEventListeners();
};

UI.prototype.showUIPart = function(selector) {
    document.getElementById(selector).classList.remove('hidden');
};

UI.prototype.hideUIPart = function(selector) {
    document.getElementById(selector).classList.add('hidden');
};

UI.prototype.showLobby = function() {
    this.hideUIPart('room');
    this.hideUIPart('game');
    this.hideUIPart('tutorial');

    this.showUIPart('lobby');
};

UI.prototype.showRoom = function() {
    this.hideUIPart('lobby');
    this.hideUIPart('game');
    this.hideUIPart('tutorial');

    this.showUIPart('room');
};

UI.prototype.showGame = function() {
    this.hideUIPart('room');
    this.hideUIPart('lobby');
    this.hideUIPart('tutorial');
    this.hideUIPart('game');

    this.changeScenes(game.scenes.field);
    
    this.showTutorial();
};

UI.prototype.showTutorial = function() {
    this.showUIPart('tutorial');
    this.playTutorial();

};

UI.prototype.playTutorial = function() {
    var self = this;
    var bgBlack = document.getElementById('bg-black');
    var productions = document.getElementById('productions');
    var tutorial01 = document.getElementById('tutorial-part-01');
    var tutorial02 = document.getElementById('tutorial-part-02');
    
    //Fade out bg and logo after 2s
    setTimeout(function() {
        bgBlack.style.backgroundColor = "rgba(0,0,0,0.8)";
        productions.style.opacity = "0";
        
        //Fade in tutorial01
        setTimeout(function() {
            tutorial01.style.opacity = "1";
            
            //Fade in tutorial02
            setTimeout(function() {
                tutorial01.style.opacity = "0";
                tutorial02.style.opacity = "1";
                
                //Fade in tutorial01
                setTimeout(function() {
                    self.hideUIPart('tutorial');
                    self.showUIPart('game');
                }, 2000);
            }, 2000);
        }, 500);
    }, 2000);
};


UI.prototype.changeScenes = function(sceneId) {
    var oldHierarchy = this.app.root.findByName('Root');

    this.loadScene(sceneId, function() {
        oldHierarchy.destroy();
    });
};

UI.prototype.loadScene = function(id, callback) {
    // Get the path to the scene
    var url = id + ".json";

    // Load the scenes entity hierarchy
    this.app.loadSceneHierarchy(url, function(err, parent) {
        if(!err) {
            callback(parent);
        } else {
            console.error(err);
        }
    });
};

/**
 * Connect to game server, join lobby and set up event listeners
 */
UI.prototype.initializeClient = function() {
    //Connect client
    game.client.connect();

    //Join lobby
    game.client.joinLobby();
};

/**
 * Bind data event listeners
 */
UI.prototype.bindDataEventListeners = function() {
    var self = this;

    this.app.on('lobby:you-joined', function(me, rooms, players) {
        //Player name
        updatePlayerNameInput(me.name);

        //Player character
        updatePlayerCharacterSlider(me.character);

        //Players online
        updatePlayersOnline(players);

        //Rooms
        updateLobbyRooms(rooms);

        //Show lobby
        self.showLobby();
    });

    this.app.on('lobby:someone-joined', function(rooms, players) {
        //Players online
        updatePlayersOnline(players);

        //Rooms
        updateLobbyRooms(rooms);
    });

    this.app.on('lobby:name-chosen', function(name) {
        //Player name
        updatePlayerNameInput(name);
    });

    this.app.on('lobby:character-chosen', function(character) {
        //Player character
        updatePlayerCharacterSlider(character);
    });

    this.app.on('lobby:you-created-a-room', function(room, rooms) {
        //Room
        updateRoom(room);

        //Rooms
        updateLobbyRooms(rooms);

        //Show room
        self.showRoom();
    });

    this.app.on('lobby:someone-created-a-room', function(rooms) {
        //Rooms
        updateLobbyRooms(rooms);
    });

    this.app.on('room:someone-joined-your-room', function(room, rooms) {
        //Room
        updateRoom(room);

        //Rooms
        updateLobbyRooms(rooms);

        //Show room
        self.showRoom();
    });

    this.app.on('lobby:someone-joined-a-room', function(rooms) {
        //Rooms
        updateLobbyRooms(rooms);
    });

    this.app.on('lobby:someone-left-your-room', function(room, rooms) {
        //Room
        updateRoom(room);

        //Game
        updateGame(room);

        //Rooms
        updateLobbyRooms(rooms);
    });

    this.app.on('lobby:you-left-a-room', function(rooms) {
        //Rooms
        updateLobbyRooms(rooms);
    });

    this.app.on('room:map-changed', function(room) {
        //Room
        updateRoom(room);
    });

    this.app.on('room:mode-changed', function(room) {
        //Room
        updateRoom(room);
    });

    this.app.on('room:your-game-started', function(room) {
        //Room
        updateRoom(room);

        //Game
        updateGame(room);

        //Show game
        self.showGame();
    });

    this.app.on('lobby:someones-game-started', function(rooms) {
        //Rooms
        updateLobbyRooms(rooms);
    });
};

/**
 * Bind html event listeners
 */
UI.prototype.bindHTMLEventListeners = function() {
    addPlayerNameInputChangeListener();
    addPlayerCharacterChangeListener();
    addCreateRoomListener();
    addLeaveRoomClickListener();
    addJoinRandomGameClickListener();
    addRoomModeChangeListener();
    addRoomMapChangeListener();
    addStartGameClickListener();
};

/**
 * --------------------------
 *
 * LOBBY USER FUNCTIONS
 *
 * --------------------------
 */
//Return the <input> for the player name
function getPlayerNameInput() {
    return document.getElementById('my-username');
}

//Set value of the <input> for the player name
function updatePlayerNameInput(name) {
    var input = getPlayerNameInput();

    input.value = name;
}

//Update player name on <input> change
function addPlayerNameInputChangeListener() {
    var input = getPlayerNameInput();

    input.addEventListener('change', function(e) {
        game.client.chooseName(this.value);
    });
}

//Update players online <span>
function updatePlayersOnline(players) {
    document.getElementById('players-online').innerHTML = players.length;
}

//Update player character slider <div>
function updatePlayerCharacterSlider(character) {
    var slider = document.getElementById('character-slider');
    var slides = slider.querySelectorAll('.slide');

    for(var i = 0; i < slides.length; i++) {
        var slideCharacter = slides[i].getAttribute('id');

        //Hide inactive slides
        if(slideCharacter !== character) {
            slides[i].classList.add('hidden');
        }
        else {
            slides[i].classList.remove('hidden');
        }
    }
}

//Choose character on slider click
function addPlayerCharacterChangeListener() {
    var slideControls = document.querySelectorAll('[data-char]');

    //Function callback for loop
    var chooseCharacter = function() {
        var char = this.dataset.char;

        game.client.chooseCharacter(char);
    };

    for(var i = 0; i < slideControls.length; i++) {
        slideControls[i].addEventListener('click', chooseCharacter);
    }
}

/**
 * --------------------------
 *
 * LOBBY ROOMS FUNCTIONS
 *
 * --------------------------
 */
//Return lobby rooms <ul>
function getLobbyRoomsList() {
    return document.getElementById('all-rooms');
}

//Empty lobby rooms <ul>
function emptyLobbyRooms() {
    var list = getLobbyRoomsList();

    while(list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

//Fill lobby rooms <ul> with <li> element for each room
function fillLobbyRooms(rooms) {
    var list = getLobbyRoomsList();
    var roomsAvailable = 0;

    //Button callback
    var buttonCallbackFn = function() {
        game.client.joinRoom(this.getAttribute('id'));
    };

    if(rooms.length) {
        for(var i = 0; i < rooms.length; i++) {
            //Skip room if game already started
            if(rooms[i].started) continue;
            //Skip room if it's full
            if(rooms[i].players.length >= rooms[i].maxPlayers) continue;

            //Count rooms available
            roomsAvailable++;

            //Create items
            var item = document.createElement('li');
            var name = document.createElement('h3');
            var count = document.createElement('span');
            var button = document.createElement('button');

            //Configure name element
            name.innerHTML = rooms[i].name;
            name.classList.add('name');

            //Configure count element
            count.innerHTML = rooms[i].players.length + '/' + rooms[i].maxPlayers;
            count.classList.add('count');

            //Configure button element
            button.innerHTML = '<span>+</span>';
            button.classList.add('btn');
            button.setAttribute('id', rooms[i].name);

            //Add click listener to button
            button.addEventListener('click', buttonCallbackFn);

            //Append elements to item
            item.appendChild(name);
            item.appendChild(count);
            item.appendChild(button);

            //Append item to list
            list.appendChild(item);
        }

        if(roomsAvailable === 0) {
            var allFull = document.createElement('li');

            allFull.innerHTML = 'All rooms are full or already started playing. Go ahead and create your own!';

            list.appendChild(allFull);
        }
    }
    else {
        var notice = document.createElement('li');

        notice.innerHTML = 'No rooms available. Go ahead and create one!';

        list.appendChild(notice);
    }
}

//Empty and then fill lobby rooms
function updateLobbyRooms(rooms) {
    emptyLobbyRooms();
    fillLobbyRooms(rooms);
}

//Create room from input value
function addCreateRoomListener() {
    var input = document.getElementById('new-room-name');
    var btn = document.getElementById('create-room-btn');

    btn.addEventListener('click', function() {
        if(input.value.length) {
            game.client.createRoom(input.value);
        }
        else {
            console.log('Error during room creation, room name must not be empty');
        }
    });
}

//Join random game
function addJoinRandomGameClickListener() {
    var btn = document.getElementById('join-random-game');

    btn.addEventListener('click', function() {
        game.client.joinRandomRoom();
    });
}

/**
 * --------------------------
 *
 * ROOM FUNCTIONS
 *
 * --------------------------
 */
//Update room title
function updateRoomTitle(title) {
    var h1 = document.getElementById('room-title');

    h1.innerHTML = title;
}

//Update room mode slider <div>
function updateRoomModeSlider(mode) {
    var slider = document.getElementById('mode-slider');
    var slides = slider.querySelectorAll('.slide');

    for(var i = 0; i < slides.length; i++) {
        var slideMode = slides[i].getAttribute('id');

        //Hide inactive slides
        if(slideMode !== mode) {
            slides[i].classList.add('hidden');
        }
        else {
            slides[i].classList.remove('hidden');
        }
    }
}

//Choose mode on mode slider click
function addRoomModeChangeListener() {
    var slideControls = document.querySelectorAll('[data-mode]');

    //Function callback for loop
    var chooseMode = function() {
        var mode = this.dataset.mode;

        game.client.changeMode(game.client.room.name, mode);
    };

    for(var i = 0; i < slideControls.length; i++) {
        slideControls[i].removeEventListener('click', chooseMode);
        slideControls[i].addEventListener('click', chooseMode);
    }
}

//Update room map slider <div>
function updateRoomMapSlider(map) {
    var slider = document.getElementById('map-slider');
    var slides = slider.querySelectorAll('.slide');

    for(var i = 0; i < slides.length; i++) {
        var slideMap = slides[i].getAttribute('id');

        //Hide inactive slides
        if(slideMap !== map) {
            slides[i].classList.add('hidden');
        }
        else {
            slides[i].classList.remove('hidden');
        }
    }
}

//Choose map on map slider click
function addRoomMapChangeListener() {
    var slideControls = document.querySelectorAll('[data-map]');

    //Function callback for loop
    var chooseMap = function() {
        var map = this.dataset.map;

        game.client.changeMap(game.client.room.name, map);
    };

    for(var i = 0; i < slideControls.length; i++) {
        slideControls[i].removeEventListener('click', chooseMap);
        slideControls[i].addEventListener('click', chooseMap);
    }
}

//Start game
function addStartGameClickListener() {
    var startGameBtn = document.getElementById('start-game');

    startGameBtn.addEventListener('click', function() {
        game.client.startGame(game.client.room.name);
    });
}

//Update room player count
function updateRoomPlayerCount(room) {
    var count = document.getElementById('room-player-count');

    count.innerHTML = room.players.length + '/' + room.maxPlayers;
}

//Get player slots
function getPlayerSlots() {
    return document.querySelectorAll('.player-slot');
}

//Empty player slots
function emptyPlayerSlots() {
    var playerSlots = getPlayerSlots();

    for(var i = 0; i < playerSlots.length; i++) {
        var playerSlotImg = playerSlots[i].querySelector('.player-slot-img');
        var playerSlotName = playerSlots[i].querySelector('.player-slot-name');
        var playerSlotRole = playerSlots[i].querySelector('.player-slot-role');

        playerSlotImg.setAttribute('src', game.images.dummyCorn);
        playerSlotRole.setAttribute('src', '');
        playerSlotRole.classList.add('hidden');
        playerSlotName.innerHTML = 'Empty';
    }
}

//Fill player slots
function fillPlayerSlots(room) {
    var playerSlots = getPlayerSlots();

    for(var i = 0; i < room.players.length; i++) {
        var playerSlotImg = playerSlots[i].querySelector('.player-slot-img');
        var playerSlotName = playerSlots[i].querySelector('.player-slot-name');
        var playerSlotRole = playerSlots[i].querySelector('.player-slot-role');

        //Set role
        if(room.players[i].id === room.owner) {
            playerSlotRole.setAttribute('src', game.images.crown);
            playerSlotRole.classList.remove('hidden');
        }

        //Set character
        switch(room.players[i].character) {
            case 'Cornboy':
                playerSlotImg.setAttribute('src', game.images.cornboy);
                break;
            case 'Corngirl':
                playerSlotImg.setAttribute('src', game.images.corngirl);
                break;
            case 'Angrycorn':
                playerSlotImg.setAttribute('src', game.images.angrycorn);
                break;
            default:
                playerSlotImg.setAttribute('src', game.images.cornboy);
                break;
        }

        //Set name
        playerSlotName.innerHTML = room.players[i].name;
    }
}

//Update player slots
function updatePlayerSlots(room) {
    emptyPlayerSlots();
    fillPlayerSlots(room);
}

//Update room
function updateRoom(room) {
    updateRoomTitle(room.name);
    updateRoomPlayerCount(room);
    updateRoomModeSlider(room.mode);
    updateRoomMapSlider(room.map);
    updatePlayerSlots(room);
}

//Leave room
function addLeaveRoomClickListener() {
    var btn = document.getElementById('leave-room');

    btn.addEventListener('click', function() {
        if(typeof game.client.room !== "undefined") {
            game.client.leaveRoom(game.client.room.name);
        }
    });
}

/**
 * --------------------------
 *
 * GAME FUNCTIONS
 *
 * --------------------------
 */
//Get player hud
function getPlayerHud(playerIndex) {
    var incIndex = playerIndex + 1;

    return document.getElementById('player-' + incIndex);
}

//Empty player huds
function emptyPlayerHuds() {
    var playerHuds = document.getElementsByClassName('player-hud');

    for(var i = 0; i < playerHuds.length; i++) {
        playerHuds[i].querySelector('.player-name').innerHTML = "Empty";
        playerHuds[i].querySelector('.pressure').classList.add('hidden');
        playerHuds[i].querySelector('.player-kills').classList.add('hidden');
    }
}

//Fill player hud
function fillPlayerHud(playerIndex, player) {
    var hud = getPlayerHud(playerIndex);

    var hudName = hud.querySelector('.player-name');
    var hudPressureContainer = hud.querySelector('.pressure');
    var hudPressure = hud.querySelector('.actual-pressure');
    var hudKillContainer = hud.querySelector('.player-kills');
    var hudKills = hud.querySelector('.numberKills');

    //Set player name
    hudName.innerHTML = player.name;

    //Set pressure
    hudPressureContainer.classList.remove('hidden');

    if(player.pressure === 0) {
        hudPressure.classList.add('hidden');
        hudPressure.style.width = '0px';
    }
    else {
        hudPressure.classList.remove('hidden');
        hudPressure.style.width = player.pressure + '%';
    }

    //Set kills
    hudKillContainer.classList.remove('hidden');
    hudKills.innerHTML = player.kills;
}

//Fill player huds
function fillPlayerHuds(room) {
    for(var i = 0; i < room.players.length; i++) {
        fillPlayerHud(i, room.players[i]);
    }
}

//Update player huds
function updatePlayerHuds(room) {
    emptyPlayerHuds();
    fillPlayerHuds(room);
}

//Update game time
function updateGameTime(gameTime) {
    var timeEl = document.getElementById('game-time');
    var minEl = timeEl.querySelector('.minutes');
    var secEl = timeEl.querySelector('.seconds');

    //Only set the game time once, don't overwrite countdown
    if(!timeEl.classList.contains('has-been-set')) {
        minEl.innerHTML = gameTime;
        secEl.innerHTML = '00';

        timeEl.classList.add('has-been-set');
    }
}

//Update game
function updateGame(room) {
    updatePlayerHuds(room);
    updateGameTime(room.gameTime);
}