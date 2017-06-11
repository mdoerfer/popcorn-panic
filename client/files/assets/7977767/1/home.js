var Lobby = pc.createScript('lobby');

/**
 * Add component attributes
 */
Lobby.attributes.add('headerLogo', {
    type: 'asset',
    title: 'Header Logo'
});

Lobby.attributes.add('headerBg', {
    type: 'asset',
    title: 'Header Background'
});

Lobby.attributes.add('cornboyPic', {
    type: 'asset',
    title: 'Cornboy'
});

Lobby.attributes.add('corngirlPic', {
    type: 'asset',
    title: 'Corngirl'
});

Lobby.attributes.add('angrycornPic', {
    type: 'asset',
    title: 'Angrycorn'
});

Lobby.attributes.add('chevron', {
    type: 'asset',
    title: 'Chevron'
});

Lobby.attributes.add('redplane', {
    type: 'asset',
    title: 'redplane'
});

Lobby.attributes.add('play', {
    type: 'asset',
    title: 'play'
});

Lobby.attributes.add('lobbyClass', {
    type: 'string',
    title: 'Lobby Class',
    placeholder: 'lobby',
    default: 'lobby'
});

Lobby.attributes.add('lobbyHtml', {
    type: 'asset',
    assetType: 'html',
    title: 'Lobby HTML'
});

Lobby.attributes.add('lobbyCss', {
    type: 'asset',
    assetType: 'css',
    title: 'Lobby CSS'
});

/**
 * Change scene
 * 
 * @param sceneId
 */
Lobby.prototype.changeScenes = function(sceneId) {
    // Get a reference to the current root object
    var oldHierarchy = this.app.root.findByName ('Root');
    
    // Load the new scene. The scene ID is found by loading the scene in the editor and 
    // taking the number from the URL
    // e.g. If the URL when Scene 1 is loaded is: https://playcanvas.com/editor/scene/475211
    // The ID is the number on the end (475211)
    this.loadScene (sceneId, function () {
        // Once the new scene has been loaded, destroy the old one
        oldHierarchy.destroy ();
    });
};

/**
 * Load scene
 * 
 * @param id
 * @param callback
 */
Lobby.prototype.loadScene = function (id, callback) {
    // Get the path to the scene
    var url = id  + ".json";
    
    // Load the scenes entity hierarchy
    this.app.loadSceneHierarchy(url, function (err, parent) {
        if (!err) {
            callback(parent);
        } else {
            console.error (err);
        }
    });
};

/**
 * Initialize component
 */
Lobby.prototype.initialize = function() {
    this.initializeUI();
    this.initializeClient();
};

/**
 * Initialize UI
 */
Lobby.prototype.initializeUI = function() {
    this.loadLobby();
};

/**
 * Load lobby 
 */
Lobby.prototype.loadLobby = function() {
    /**
     * Append CSS
     */
    var style = document.createElement('style');
    style.innerHTML = this.lobbyCss.resource || '';
    document.head.appendChild(style);
    
    /**
     * Append HTML
     */
    var div = document.createElement('div');
    div.classList.add(this.lobbyClass);
    div.innerHTML = this.lobbyHtml.resource || '';
    document.body.appendChild(div);
    
    /**
     * Add images 
     */
    var headerBg = document.getElementById('header-bg');
    headerBg.setAttribute('src', this.headerBg.getFileUrl());
    
    var headerLogo = document.getElementById('header-logo');
    headerLogo.setAttribute('src', this.headerLogo.getFileUrl());
    
    var cornboyPic = document.getElementById('cornboy-pic');
    cornboyPic.setAttribute('src', this.cornboyPic.getFileUrl());
    
    var corngirlPic = document.getElementById('corngirl-pic');
    corngirlPic.setAttribute('src', this.corngirlPic.getFileUrl());
    
    var angrycornPic = document.getElementById('angrycorn-pic');
    angrycornPic.setAttribute('src', this.angrycornPic.getFileUrl());
    
    var redplane = document.getElementById('redplane');
    redplane.setAttribute('src', this.redplane.getFileUrl());
    
    var play = document.getElementById('play');
    play.setAttribute('src', this.play.getFileUrl());
    
    var chevrons = document.getElementsByClassName('chevron');
    
    for(var i = 0; i < chevrons.length; i++) {
        chevrons[i].setAttribute('src', this.chevron.getFileUrl());
    }
};

/**
 * Connect to game server, join lobby and set up event listeners
 */ 
Lobby.prototype.initializeClient = function() {
    //Connect client
    game.client.connect();
    
    //Join lobby
    game.client.joinLobby();
    
    //Bind event listeners
    game.client.socket.on('lobby-joined', this.onLobbyJoined);
    game.client.socket.on('name-chosen', this.onNameChosen);
    game.client.socket.on('character-chosen', this.onCharacterChosen);
    game.client.socket.on('room-created', this.onRoomCreated);
    game.client.socket.on('room-joined', this.onRoomJoined);
    game.client.socket.on('room-left', this.onRoomLeft);
    game.client.socket.on('game-started', this.onGameStarted);
    game.client.socket.on('map-changed', this.onMapChanged);
    game.client.socket.on('mode-changed', this.onModeChanged);
};

/**
 * React on lobby joined
 */
Lobby.prototype.onLobbyJoined = function(payload) {
   if(payload.state === 'success') {
       //Console
        console.info('Lobby joined');
        console.log(payload.data);
       
       //Get variables
       var myPlayer = payload.data.myPlayer;
       var rooms = payload.data.rooms;
       var players = payload.data.players;
       
       //Set initial name
       if(typeof myPlayer !== "undefined") {
           //Set player name input
           updatePlayerNameInput(myPlayer.name);
           
           //Set character slider to initial character
           updatePlayerCharacterSlider(myPlayer.character);
           
           //Update character on change
           addCharacterChangeListener();
       }
       
       //Set initial rooms
       updateLobbyRooms(rooms);
       
       //Add listener for room creation
       addCreateRoomListener();
       
       //Show players online
       updatePlayersOnline(players);
       
       //Update name on change
       addPlayerNameInputChangeListener();
    }
    else {
        //Console
        console.log('Error joining lobby');
    }
};

/**
 * React on name chosen
 */ 
Lobby.prototype.onNameChosen = function(payload) {
    if(payload.state === 'success') {
        //Console
        console.info('Name chosen.');
        
        //Get variables
        var player = payload.data.player;
        
        //Set new name
        updatePlayerNameInput(player.name);
    }
    else {
        //Console
        console.log('Error during name change');
    } 
};

/**
 * React on name chosen
 */ 
Lobby.prototype.onCharacterChosen = function(payload) {
    if(payload.state === 'success') {
        //Console
        console.info('Character chosen.');
        
        //Get variables
        var character = payload.data.player.character;
        
        //Update character slider
        updatePlayerCharacterSlider(character);
    }
    else {
        //Console
        console.log('Error during character change');
    } 
};

/**
 * React on room created
 */
Lobby.prototype.onRoomCreated = function(payload) {
    if(payload.state === 'success') {
        //Console
        console.info('Room created.');
        
        //Get variables
        var room = payload.data.room;
        var rooms = payload.data.rooms;
        
        //Join room
        if(room.owner === game.client.socket.id) {
            game.client.joinRoom(room.name);
        }
        
        //Update lobby rooms
        updateLobbyRooms(rooms);
    }
    else {
        //Console
        console.log('Error during room creation');
    }
};

/**
 * React on room joined
 */
Lobby.prototype.onRoomJoined = function(payload) {
   if(payload.state === 'success') {
       //Console
       console.info('Room joined.');
       var rooms = payload.data.rooms;
       
        updateLobbyRooms(rooms);
       
       if(typeof payload.data.room !== "undefined") {
           //TODO: Change scene to room
           console.log('TODO: CHANGE SCENE TO ROOM');
       }
    }
    else {
        console.log('Error joining room');
    }
};

/**
 * React on room left
 */
Lobby.prototype.onRoomLeft = function(payload) {
   if(payload.state === 'success') {
       //Console
       console.info('Room left.');
       
       //Join lobby
        game.client.joinLobby();
    }
    else {
        //Console
        console.log('Error leaving room.');
    }
};

/**
 * React on game started
 */
Lobby.prototype.onGameStarted = function(payload) {
   if(payload.state === 'success') {
        //Console
        console.info('Game started.');
        console.log(payload.data);
       
       //TODO: Change scene to game scene
       console.log('TODO: CHANGE SCENE TO GAME');
    }
    else {
        //Console
        console.info('Error starting game.');
    } 
};

/**
 * React on map changed
 */
Lobby.prototype.onMapChanged = function(payload) {
   if(payload.state === 'success') {
       //Console
        console.info('Changed map.');
        console.log(payload.data);
    }
    else {
        //Console
        console.log('Error changing map.');
    }
};

/**
 * React on mode changed
 */
Lobby.prototype.onModeChanged = function(payload) {
   if(payload.state === 'success') {
       //Console
        console.info('Changed mode.');
        console.log(payload.data);
    }
    else {
        //Console
        console.log('Error changing mode.');
    }
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
function addCharacterChangeListener() {
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
    
    //Button callback
    var buttonCallbackFn = function() {
        game.client.joinRoom(this.getAttribute('id'));
    };
    
    if(rooms.length) {
        for(var i = 0; i < rooms.length; i++) {
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