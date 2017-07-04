var UI = pc.createScript('ui');

/**
 * Add component attributes
 */
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

/**
 * Initialize component
 */
UI.prototype.initialize = function() {
    //Initialize UI and Client connection only once
    if(!game.ui.initialized) {
        this.initializeUI();
        this.initializeClient();
        
        game.ui.initialized = true;
    }
    
    //Play music
    game.playMusic('music', this.app.root.findByName('Root'));
};

/**
 * Initialize UI
 */
UI.prototype.initializeUI = function() {
    /**
     * Append CSS
     */
    appendCSStoHead(this.css);

    /**
     * Append HTML
     */
    appendHTMLtoBody(this.html);

    /**
     * Get image paths and save them in global game object
     */
    game.images.headerBg = getFileUrl(this.app.assets.get(8419486));
    game.images.headerLogo = getFileUrl(this.app.assets.get(8423037));
    game.images.cornboy = getFileUrl(this.app.assets.get(8221621));
    game.images.corngirl = getFileUrl(this.app.assets.get(8221623));
    game.images.angrycorn = getFileUrl(this.app.assets.get(8221620));
    game.images.playercorn = getFileUrl(this.app.assets.get(8370833));
    game.images.chevron = getFileUrl(this.app.assets.get(8139421));
    game.images.chevronWhite = getFileUrl(this.app.assets.get(8139155));
    game.images.redplane = getFileUrl(this.app.assets.get(8139154));
    game.images.play = getFileUrl(this.app.assets.get(8139155));
    game.images.crown = getFileUrl(this.app.assets.get(8420405));
    game.images.dummyCorn = getFileUrl(this.app.assets.get(8221622));
    game.images.productions = getFileUrl(this.app.assets.get(8181714));
    game.images.tutorial01 = getFileUrl(this.app.assets.get(8181634));
    game.images.tutorial02 = getFileUrl(this.app.assets.get(8181611));
    game.images.podium = getFileUrl(this.app.assets.get(8193100));
    game.images.leaveRoom = getFileUrl(this.app.assets.get(8220239));
    game.images.bgRoom = getFileUrl(this.app.assets.get(8419851));
    game.images.deathsIcon = getFileUrl(this.app.assets.get(8221056));
    game.images.killsIcon = getFileUrl(this.app.assets.get(8221057));
    game.images.chatIcon = getFileUrl(this.app.assets.get(8376487));
    game.images.starIcon = getFileUrl(this.app.assets.get(8396089));
    game.images.settingsIcon = getFileUrl(this.app.assets.get(8402630));
    
    /*
     * Set src of images
     */
    setSrcById('header-bg', game.images.headerBg);
    setSrcById('header-logo', game.images.headerLogo);
    setSrcById('cornboy-pic', game.images.cornboy);
    setSrcById('corngirl-pic', game.images.corngirl);
    setSrcById('angrycorn-pic', game.images.angrycorn);
    setSrcById('playercorn-pic', game.images.playercorn);
    setSrcById('productions', game.images.productions);
    setSrcById('tutorial01', game.images.tutorial01);
    setSrcById('tutorial02', game.images.tutorial02);
    setSrcById('podium', game.images.podium);
    setSrcById('leave-icon', game.images.leaveRoom);
    setSrcById('bg-room', game.images.bgRoom);
    setSrcById('star-icon', game.images.starIcon);
    setSrcById('settings-icon', game.images.settingsIcon);
    
    setSrcByClass('chat-icon-src', game.images.chatIcon);
    setSrcByClass('redplane', game.images.redplane);
    setSrcByClass('play', game.images.play);
    setSrcByClass('player-deaths-pic', game.images.deathsIcon);
    setSrcByClass('player-kills-pic', game.images.killsIcon);
    setSrcByClass('kills-icon', game.images.killsIcon);
    setSrcByClass('chevron', game.images.chevron);
    setSrcByClass('chevronsWhite', game.images.chevronWhite);
    
    /**
     * Bind event listeners
     */
    this.bindDataEventListeners();
    this.bindHTMLEventListeners();
    
    /**
     * Show lobby
     */
    this.showLobby();
};

/**
 * Show lobby
 */
UI.prototype.showLobby = function() {
    hideUIPart('room');
    hideUIPart('game');
    hideUIPart('tutorial');
    hideUIPart('game-end');
    
    showUIPart('leaderboard');
    showUIPart('lobby');
};

/**
 * Show room
 */
UI.prototype.showRoom = function() {
    hideUIPart('lobby');
    hideUIPart('game');
    hideUIPart('tutorial');
    hideUIPart('game-end');
    
    showUIPart('leaderboard');
    showUIPart('room');
};

/**
 * Show game
 */
UI.prototype.showGame = function() {
    hideUIPart('room');
    hideUIPart('lobby');
    hideUIPart('tutorial');
    hideUIPart('leaderboard');
    hideUIPart('game');
    hideUIPart('game-end');
    
    //Call the chosen map
    switch(game.client.room.map) {
        case 'Field':
            this.changeScenes(game.scenes.field);
            break;
        default:
            this.changeScenes(game.scenes.field);
    }
    
    this.showTutorial();
};

/**
 * Show tutorial
 */
UI.prototype.showTutorial = function() {
    showUIPart('tutorial');
    this.playTutorial();
};

/**
 * Show game-end
 */
UI.prototype.showGameEnd = function() {
     hideUIPart('game');
     showUIPart('game-end');
};

/**
 * Return to room
 */
UI.prototype.returnToRoom = function() {
    //Fire events
    this.app.fire('game:podium-left');
    
    //Change scenes to lobby
    this.changeScenes(game.scenes.lobby);
    
    //Reset
    resetGame();
    
    //Show room
    this.showRoom();
};

/**
 * Return to lobby
 */
UI.prototype.returnToLobby = function() {
    //Fire events
    this.app.fire('game:podium-left');
    
    //Change scenes to lobby (also contains room)
    this.changeScenes(game.scenes.lobby);
    
    //Reset
    resetGame();
    
    //Leave room
    game.client.leaveRoom(game.client.room.name);
    
    //Show lobby
    this.showLobby();
};

/**
 * Play tutorial step by step
 */
UI.prototype.playTutorial = function() {
    var self = this;
    
    var bgBlack = document.getElementById('bg-black');
    var productions = document.getElementById('productions');
    var tutorial01 = document.getElementById('tutorial-part-01');
    var tutorial02 = document.getElementById('tutorial-part-02');
    var coutdown = document.getElementById('countdown');
    var counter = document.getElementById('counter-number');
    
    (function tutorialStart() {
        setTimeout(function() {
            pc.app.fire('game:tutorial-start');
        
            bgBlack.style.backgroundColor = "rgba(0,0,0,0.8)";
            productions.style.opacity = "0";
            
            tutorialStep01();
        }, 2000);
    })();
    
    
    function tutorialStep01() {
        setTimeout(function() {
            tutorial01.style.opacity = "1";
            
            tutorialStep02();
        }, 500);
    }
    
    function tutorialStep02() {
        setTimeout(function() {
            tutorial01.style.opacity = "0";
            tutorial02.style.opacity = "1";
            
            tutorialCountdown();
        }, 3000);
    }
    
    function tutorialCountdown() {
        setTimeout(function() {
            tutorial02.style.opacity = "0";
            coutdown.style.opacity = "1";
            countdown(counter.innerHTML);
            
            tutorialFinish();
        }, 3000);
    }
    
    function tutorialFinish() {
        setTimeout(function() {
            hideUIPart('tutorial');
            showUIPart('game');

            //Start timer on server
            game.client.startTimer();

            //Reset tutorial
            bgBlack.style.backgroundColor = "rgba(0,0,0,1)";
            productions.style.opacity = "1";
            tutorial01.style.opacity = "0";
            tutorial02.style.opacity = "0";
            coutdown.style.opacity = "0";
            counter.innerHTML = "3";

            //Fire tutorial-end
            pc.app.fire('game:tutorial-end');
        }, 4000);
    }
};

/**
 * Change scene and destroy old hierarchy
 */
UI.prototype.changeScenes = function(sceneId) {
    var oldHierarchy = this.app.root.findByName('Root');

    this.loadScene(sceneId, function() {
        oldHierarchy.destroy();
    });
};

/**
 * Load scene by ID
 */
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
    
    this.app.on('lobby:leftovers-removed', function(rooms) {
       updateLobbyRooms(rooms); 
    });

    this.app.on('lobby:you-joined', function(me, rooms, players, lobbyChat, leaderboard) {   
        //Player name
        updatePlayerNameInput(me.name);

        //Player character
        updatePlayerCharacterSlider(me.character);

        //Players online
        updatePlayersOnline(players);

        //Rooms
        updateLobbyRooms(rooms);
        
        //Chat
        updateLobbyChat(lobbyChat);
        
        //Leaderboard
        updateLeaderboard(leaderboard);

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
        
        //Empty room chat
        updateRoomChat([]);

        //Rooms
        updateLobbyRooms(rooms);

        //Show room
        self.showRoom();
    });
    
    this.app.on('lobby:message', function(lobbyChat) {
       //Update lobby chat
       updateLobbyChat(lobbyChat); 
    });

    this.app.on('lobby:someone-created-a-room', function(rooms) {
        //Rooms
        updateLobbyRooms(rooms);
    });

    this.app.on('room:someone-joined-your-room', function(room, rooms) {
        //Room
        updateRoom(room);
        
        //Chat
        updateRoomChat(room.chat);

        //Rooms
        updateLobbyRooms(rooms);

        //Show room (only if not on game-end already)
        if(document.getElementById('game-end').classList.contains('hidden')) {
            self.showRoom();
        }
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
    
    this.app.on('room:game-time-updated', function(room) {
       //Room
       updateRoom(room); 
    });

    this.app.on('room:mode-changed', function(room) {
        //Room
        updateRoom(room);
    });

    this.app.on('room:your-game-started', function(room) {
        if(!document.getElementById('game-end').classList.contains('hidden')) {
            self.returnToRoom();
        }
        
        //Mark tutorial as not done
        game.client.tutorialDone = false;

        //Room
        updateRoom(room);

        //Game
        updateGame(room);

        //Show game
        self.showGame();
    });
    
    this.app.on('room:message', function(roomChat) {
       //Update room chat
       updateRoomChat(roomChat); 
    });

    this.app.on('lobby:someones-game-started', function(rooms) {
        //Rooms
        updateLobbyRooms(rooms);
    });
    
    this.app.on('lobby:someones-game-reset', function(rooms, leaderboard) {
        //Rooms
        updateLobbyRooms(rooms);
        
        //Leaderboard
        updateLeaderboard(leaderboard);
    });

    this.app.on('room:your-timer-started', function(secondsLeft) {
        //Mark tutorial as done
        game.client.tutorialDone = true;
        
        updateTimer(secondsLeft);
    });
    
    this.app.on('room:your-timer-updated', function(secondsLeft) {
        updateTimer(secondsLeft);
    });
    
    this.app.on('room:your-game-ended', function(podium) {
        //Update game end
        updateGameEnd(podium);
        
        //Show game end screen
        self.showGameEnd();
    });
};

/**
 * Bind html event listeners
 */
UI.prototype.bindHTMLEventListeners = function() {
    var self = this;
    
    addFullScreenPopupClickListeners();
    addSoundEffectsChangeListener();
    addSoundMusicChangeListener();
    addSoundVolumeChangeListener();
    addPlayerNameInputChangeListener();
    addPlayerCharacterChangeListener();
    addCreateRoomListener();
    addLeaveRoomClickListener();
    addJoinRandomGameClickListener();
    addRoomModeChangeListener();
    addRoomMapChangeListener();
    addStartGameClickListener();
    addGameTimeChangeListener();
    addLobbyChatSubmitListener();
    addRoomChatSubmitListener();
    
    //Return to room
    var returnToRoomBtn = document.getElementById('return-to-room-btn');
    returnToRoomBtn.addEventListener('click', function() {
        self.returnToRoom();
    });
    
    //Return to lobby
    var returnToLobbyBtn = document.getElementById('return-to-lobby-btn');
    returnToLobbyBtn.addEventListener('click', function() {
        self.returnToLobby();
    });
};

/**
 * ----------------------------------------------------------------------------------------------------------------------------------
 *
 * LOBBY USER FUNCTIONS
 *
 * ----------------------------------------------------------------------------------------------------------------------------------
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
 * ----------------------------------------------------------------------------------------------------------------------------------
 *
 * LOBBY LEADERBOARD FUNCTIONS
 *
 * ----------------------------------------------------------------------------------------------------------------------------------
 */
function updateLeaderboard(leaderboard) {
    var leaderboardContainer = document.getElementById('leaderboard');
    var leaderboardList = leaderboardContainer.querySelector('#leaderboard-list');
    
    while(leaderboardList.firstChild) {
        leaderboardList.removeChild(leaderboardList.firstChild);
    }
    
    for(var i = 0; i < leaderboard.length; i++) {
        var li = document.createElement('li');
        var tag = document.createElement('span');
        var name = document.createElement('span');
        var kills = document.createElement('span');
        
        //Add classes
        tag.classList.add('tag');
        name.classList.add('name');
        kills.classList.add('kills');
        
        //Fill HTML
        tag.innerHTML = "<span class='inner'>#" + (i+1) + "</span>";
        name.innerHTML = "<span class='inner'>" + leaderboard[i].name + "</span>";
        kills.innerHTML = "<span class='inner'>" + leaderboard[i].kills + " Pops</span>" ;
        
        //Append
        li.appendChild(tag);
        li.appendChild(name);
        li.appendChild(kills);
        
        leaderboardList.appendChild(li);
    }
    
    //Fill empty slots
    var remainingSlots = 10 - leaderboard.length;
    
    for(var c = remainingSlots; c > 0; c--) {
        var emptyLi = document.createElement('li');
        
        emptyLi.classList.add('empty-slot');
        
        leaderboardList.appendChild(emptyLi);
    }
}

/**
 * ----------------------------------------------------------------------------------------------------------------------------------
 *
 * LOBBY ROOMS LISTING FUNCTIONS
 *
 * ----------------------------------------------------------------------------------------------------------------------------------
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
            game.log('Error during room creation, room name must not be empty');
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
 * ----------------------------------------------------------------------------------------------------------------------------------
 *
 * ROOM FUNCTIONS
 *
 * ----------------------------------------------------------------------------------------------------------------------------------
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

function addGameTimeChangeListener() {
    var gameTimeSetter = document.getElementById('game-time-setter');
    var btns = gameTimeSetter.querySelectorAll('.time-setter');
    
    var updateGameTime = function() {
       game.client.updateGameTime(game.client.room.name, this.dataset.action);
    };
    
    for(var i = 0; i < btns.length; i++) {
        btns[i].addEventListener('click', updateGameTime);
    }
}

function updateGameTimeSlider(time) {
    document.getElementById('game-time-minutes').innerHTML = time;
}

//Start game
function addStartGameClickListener() {
    var startGameBtn = document.getElementById('start-game');

    startGameBtn.addEventListener('click', function() {
        game.client.startGame(game.client.room.name);
    });
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
        
        playerSlotImg.setAttribute('src', getCharImg(room.players[i].character));

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
    updateRoomModeSlider(room.mode);
    updateRoomMapSlider(room.map);
    updateGameTimeSlider(room.gameTime);
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
 * ----------------------------------------------------------------------------------------------------------------------------------
 *
 * GAME FUNCTIONS
 *
 * ----------------------------------------------------------------------------------------------------------------------------------
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
    hudName.innerHTML = "<span class='player-dot'></span>" + player.name;
    
    var hudPlayerDot = hud.querySelector('.player-dot');
    hudPlayerDot.style.backgroundColor = hud.dataset.dotColor;

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

function resetGameTime() {
    var timeEl = document.getElementById('game-time');
    
    timeEl.classList.remove('has-been-set');
}

//Update game
function updateGame(room) {
    updatePlayerHuds(room);
    updateGameTime(room.gameTime);
}

//Reset game
function resetGame() {
    resetGameTime();
}

/**
 * ----------------------------------------------------------------------------------------------------------------------------------
 *
 * GAME TIMER FUNCTIONS
 *
 * ----------------------------------------------------------------------------------------------------------------------------------
 */
//Tutorial countdown
function countdown (time) {
  document.getElementById('counter-number').innerHTML = time;
    
  time -= 1;  
    
  if (time > -1) {
      pc.app.fire('game:countdown-sound');
     setTimeout( countdown, 1000, time);
  }
  else if (time < 0) {
      pc.app.fire('game:countdown-fight');
      document.getElementById('counter-number').innerHTML= "Fight";
  }
}

//Game Timer
function updateTimer(secondsLeft) {
    var m = document.getElementById('minutes');
    var s = document.getElementById('seconds');
    
    var minVal = Math.floor(secondsLeft/60);
    var secVal = secondsLeft % 60;
    
    secVal = (secVal < 10) ? "0" + secVal : secVal;

    m.innerHTML = minVal;
    s.innerHTML = secVal;
}

/**
 * ----------------------------------------------------------------------------------------------------------------------------------
 *
 * GAME-END FUNCTIONS
 *
 * ----------------------------------------------------------------------------------------------------------------------------------
 */
function updateScoreText(podium) {
    var scoreText = document.getElementById('score-text');
    
    if(!podium.length) return;
    
    if(typeof podium[0] !== undefined) {
        if(podium[0].id === game.client.me.id) {
            scoreText.innerHTML = 'YOU WIN';
        }
        else {
            scoreText.innerHTML = 'YOU LOSE';
        }
    }
    else {
        scoreText.innerHTML = 'MIMIMI';
    } 
}

function updatePodium(podium) {
    var podiums = document.getElementsByClassName('podium');
    
    var charSelector = '.podium-character';
    var nameSelector = '.podium-name';
    var killsSelector = '.numberKills';
    var deathsSelector = '.numberdeaths';
    
    for(var i = 0; i < podiums.length; i++) {
        if(typeof podium[i] !== "undefined") {
            if(podiums[i].querySelector(charSelector) !== null) {
                podiums[i].querySelector(charSelector).setAttribute('src', getCharImg(podium[i].character));
            }
            podiums[i].querySelector(nameSelector).innerHTML = podium[i].name;
            podiums[i].querySelector(killsSelector).innerHTML = podium[i].kills;
            podiums[i].querySelector(deathsSelector).innerHTML = podium[i].deaths;
            podiums[i].classList.remove('hidden');
        }
        else {
            podiums[i].classList.add('hidden');
        }
    }
}

function updateGameEnd(podium) {
    updateScoreText(podium);
    updatePodium(podium);
}

/**
 * ----------------------------------------------------------------------------------------------------------------------------------
 *
 * LOBBY CHAT FUNCTIONS
 *
 * ----------------------------------------------------------------------------------------------------------------------------------
 */

function moveChatLobby() {
    var obj= document.getElementById('moveChatLobby');
    
    var style = window.getComputedStyle(obj);
    var right = style.getPropertyValue('right');
    
    if(right == "0px"){
        obj.style.right= "-502px";
        obj.style.zIndex= 0;
    }
    else{
        obj.style.right= "0px";
        obj.style.zIndex= 15;
    }      
}


function updateLobbyChat(lobbyChat) {
    var chat = document.getElementById('lobby-chat'),
        msgContainer = chat.querySelector('#lobby-chat-messages');
    
    //Empty chat
    while(msgContainer.firstChild) {
        msgContainer.removeChild(msgContainer.firstChild);
    }
    
    //Fill chat
    for(var i = 0; i < lobbyChat.length; i++) {
        var li = document.createElement('li');
        var time = document.createElement('span');
        var name = document.createElement('span');
        var msg = document.createElement('span');
        
        time.classList.add('msg-time');
        name.classList.add('player-name');
        msg.classList.add('msg');
        
        var date  = new Date(lobbyChat[i].createdAt);
        
        time.innerHTML = formatTime(date.getHours()) + ':' + formatTime(date.getMinutes());
        name.innerHTML = lobbyChat[i].playerName +':';
        msg.innerHTML = lobbyChat[i].content;
        
        
        li.appendChild(name);
        li.appendChild(msg);
        li.appendChild(time);
        
        msgContainer.appendChild(li);
    }
    
    //Scroll down to last message
    chat.scrollTop = chat.scrollHeight;
}

function addLobbyChatSubmitListener() {
    var form = document.getElementById('lobby-chat-form'),
        input = form.querySelector('#lobby-chat-input');
    
    form.addEventListener('submit', function(e) {
        //Prevent browser reload
        e.preventDefault();
        
        //Send message
        game.client.lobbyMessage(input.value);
        
        //Reset input value
        input.value = '';
    });
}

/**
 * ----------------------------------------------------------------------------------------------------------------------------------
 *
 * ROOM CHAT FUNCTIONS
 *
 * ----------------------------------------------------------------------------------------------------------------------------------
 */

function moveChatRoom() {
    var obj= document.getElementById('moveChatRoom');
    
    var style = window.getComputedStyle(obj);
    var right = style.getPropertyValue('right');
    
    if(right == "0px"){
        obj.style.right= "-502px";
        obj.style.zIndex= 0;
    }
    else{
        obj.style.right= "0px";
        obj.style.zIndex= 15;
    }      
}


function updateRoomChat(roomChat) {
    var chat = document.getElementById('room-chat'),
        msgContainer = chat.querySelector('#room-chat-messages');
    
    //Empty chat
    while(msgContainer.firstChild) {
        msgContainer.removeChild(msgContainer.firstChild);
    }
    
    //Fill chat
    for(var i = 0; i < roomChat.length; i++) {
        var li = document.createElement('li');
        var time = document.createElement('span');
        var name = document.createElement('span');
        var msg = document.createElement('span');
        
        time.classList.add('msg-time');
        name.classList.add('player-name');
        msg.classList.add('msg');
        
        var date  = new Date(roomChat[i].createdAt);
        
        time.innerHTML = formatTime(date.getHours()) + ':' + formatTime(date.getMinutes());
        name.innerHTML = roomChat[i].playerName;
        msg.innerHTML = roomChat[i].content;
        

        li.appendChild(name);
        li.appendChild(msg);
        li.appendChild(time);
        
        msgContainer.appendChild(li);
    }
    
    //Scroll down to last message
    chat.scrollTop = chat.scrollHeight;
}

function addRoomChatSubmitListener() {
    var form = document.getElementById('room-chat-form'),
        input = form.querySelector('#room-chat-input');
    
    form.addEventListener('submit', function(e) {
        //Prevent browser reload
        e.preventDefault();
        
        //Send message
        game.client.roomMessage(input.value);
        
        //Reset input value
        input.value = '';
    });
}

/**
 * ----------------------------------------------------------------------------------------------------------------------------------
 *
 * GENERIC DOM FUNCTIONS
 *
 * ----------------------------------------------------------------------------------------------------------------------------------
 */
function appendCSStoHead(asset) {
    var style = document.createElement('style');
    style.innerHTML = asset.resource || '';
    document.head.appendChild(style);
}

function appendHTMLtoBody(asset) {
    var div = document.createElement('div');
    div.setAttribute('id', 'ui');
    div.innerHTML = asset.resource || '';
    document.body.appendChild(div);
}

function showUIPart(selector) {
    document.getElementById(selector).classList.remove('hidden');
}

function hideUIPart(selector) {
    document.getElementById(selector).classList.add('hidden');
}

/**
 * ----------------------------------------------------------------------------------------------------------------------------------
 *
 * IMAGE FUNCTIONS
 *
 * ----------------------------------------------------------------------------------------------------------------------------------
 */
function getFileUrl(asset) {
    return (asset !== null) ? asset.getFileUrl() : '';
}

function setSrcById(id, src) {
    document.getElementById(id).setAttribute('src', src);
}

function setSrcByClass(klass, src) {
    var coll = document.getElementsByClassName(klass);
    
    for(var i = 0; i < coll.length; i++) {
        coll[i].setAttribute('src', src);
    }
}

function getCharImg(char) {
    var imgUrl = game.images.cornboy;

    switch(char) {
        case 'Cornboy':
            imgUrl = game.images.cornboy;
            break;
        case 'Corngirl':
            imgUrl = game.images.corngirl;
            break;
        case 'Angrycorn':
            imgUrl = game.images.angrycorn;
            break;
        case 'Playercorn':
            imgUrl = game.images.playercorn;
            break;
        default:
            imgUrl = game.images.cornboy;
            break;
    }

    return imgUrl;
}

function formatTime(number) {
    return (number < 10) ? "0" + number : number;
}

/**
 * ----------------------------------------------------------------------------------------------------------------------------------
 *
 * SOUND FUNCTIONS
 *
 * ----------------------------------------------------------------------------------------------------------------------------------
 */
function addSoundEffectsChangeListener() {
    var slider = document.getElementById('settings-effects');
    
    var eventCallback = function() {
        game.sounds.effects = this.value;
    };
    
    slider.addEventListener('input', eventCallback);
    slider.addEventListener('change', eventCallback);
}

function addSoundMusicChangeListener() {
    var slider = document.getElementById('settings-music');
    
    var eventCallback = function() {
        game.sounds.music = this.value;
        
        game.changeMusicVolume();
    };
    
    slider.addEventListener('input', eventCallback);
    slider.addEventListener('change', eventCallback);
}

function addSoundVolumeChangeListener() {
    var slider = document.getElementById('settings-volume');
    
    var eventCallback = function() {
        game.sounds.volume = this.value;
        
        game.changeMasterVolume();
    };
    
    slider.addEventListener('input', eventCallback);
    slider.addEventListener('change', eventCallback);
}

/**
 * ----------------------------------------------------------------------------------------------------------------------------------
 *
 * LEADERBOARD
 *
 * ----------------------------------------------------------------------------------------------------------------------------------
 */
function moveLeaderboard() {
    var obj= document.getElementById('leaderboard');
    
    var style = window.getComputedStyle(obj);
    var right = style.getPropertyValue('right');
    if(right == "0px"){
        obj.style.right= "-502px";
        obj.style.zIndex= 0;
    }
    else{
        obj.style.right= "0px";
        obj.style.zIndex= 15;
    }      
}

function moveSettings() {
    var obj= document.getElementById('settings');
    
    var style = window.getComputedStyle(obj);
    var right = style.getPropertyValue('right');
    if(right == "0px"){
        obj.style.right= "-502px";
        obj.style.zIndex= 0;
    }
    else{
        obj.style.right= "0px";
        obj.style.zIndex= 15;
    }      
}

/**
 * ----------------------------------------------------------------------------------------------------------------------------------
 *
 * FULLSCREEN FUNCTIONS
 *
 * ----------------------------------------------------------------------------------------------------------------------------------
 */
function addFullScreenPopupClickListeners() {
    var popup = document.querySelector('#request-fullscreen');
    var popupBack = document.querySelector('#pop-up-back');
    var acceptBtn = popup.querySelector('[data-js="accept-fullscreen"]');
    var declineBtn = popup.querySelector('[data-js="decline-fullscreen"]');
    
    acceptBtn.addEventListener('click', function() {
        requestFullScreen(document.body);
        popup.classList.add('hidden');
        popupBack.classList.add('hidden');
         setSrcById('header-logo', game.images.headerLogo);
    });
    

}

function requestFullScreen(element) {
    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}