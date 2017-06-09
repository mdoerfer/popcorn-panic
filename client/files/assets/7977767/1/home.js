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

UI.attributes.add('redplane', {
    type: 'asset',
    title: 'redplane'
});

UI.attributes.add('play', {
    type: 'asset',
    title: 'play'
});

UI.attributes.add('lobbyClass', {
    type: 'string',
    title: 'Lobby Class',
    placeholder: 'lobby',
    default: 'lobby'
});

UI.attributes.add('lobbyHtml', {
    type: 'asset',
    assetType: 'html',
    title: 'Lobby HTML'
});

UI.attributes.add('lobbyCss', {
    type: 'asset',
    assetType: 'css',
    title: 'Lobby CSS'
});

UI.attributes.add('roomClass', {
    type: 'string',
    title: 'Room Class',
    placeholder: 'room',
    default: 'room'
});

UI.attributes.add('roomHtml', {
    type: 'asset',
    assetType: 'html',
    title: 'Room HTML'
});

UI.attributes.add('roomCss', {
    type: 'asset',
    assetType: 'css',
    title: 'Room CSS'
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
    this.loadLobby();
};

/**
 * Clear UI
 */ 
UI.prototype.clearUI = function() {
    
};

/**
 * Load lobby 
 */
UI.prototype.loadLobby = function() {
    this.clearUI();
    
    /**
     * Append CSS
     */
    var style = document.createElement('style');
    document.head.appendChild(style);
    style.innerHTML = this.lobbyCss.resource || '';
    
    /**
     * Append HTML
     */
    this.div = document.createElement('div');
    this.div.setAttribute('id', 'ui');
    this.div.classList.add(this.lobbyClass);
    this.div.innerHTML = this.lobbyHtml.resource || '';
    document.body.appendChild(this.div);
    
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
 * Load room
 */ 
UI.prototype.loadRoom = function() {
    this.clearUI();
    
    /**
     * Append CSS
     */
    var style = document.createElement('style');
    document.head.appendChild(style);
    style.innerHTML = this.roomCss.resource || '';
    
    /**
     * Append HTML
     */
    this.div = document.createElement('div');
    this.div.setAttribute('id', 'ui');
    this.div.classList.add(this.roomClass);
    this.div.innerHTML = this.roomHtml.resource || '';
    document.body.appendChild(this.div);
};

/**
 * Connect to game server, join lobby and set up event listeners
 */ 
UI.prototype.initializeClient = function() {
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
UI.prototype.onLobbyJoined = function(payload) {
   if(payload.state === 'success') {
        //TODO: Change scene to lobby and append data accordingly
        console.info('Lobby joined');
        console.log(payload.data);
       
       //Set initial name
       if(typeof payload.data.myPlayer !== "undefined") {
           updatePlayerNameInput(payload.data.myPlayer.name);
           
           //Set character slider to initial character
           updatePlayerCharacterSlider(payload.data.myPlayer.character);
           
           //Update character on change
           addCharacterChangeListener();
       }
       
       //Set initial rooms
       updateLobbyRooms(payload.data.rooms);
       
       //Add listener for room creation
       addCreateRoomListener();
       
       //Show players online
       updatePlayersOnline(payload.data.players);
       
       //Update name on change
       addPlayerNameInputChangeListener();
    }
    else {
        console.log('Error joining lobby');
    }
};

/**
 * React on name chosen
 */ 
UI.prototype.onNameChosen = function(payload) {
    if(payload.state === 'success') {
        console.info('Name changed.');
        
        //Set new name
        updatePlayerNameInput(payload.data.player.name);
    }
    else {
        console.log('Error during name change');
    } 
};

/**
 * React on name chosen
 */ 
UI.prototype.onCharacterChosen = function(payload) {
    if(payload.state === 'success') {
        console.info('Character changed.');
        
        //Set new name
        updatePlayerCharacterSlider(payload.data.player.character);
    }
    else {
        console.log('Error during character change');
    } 
};

/**
 * React on room created
 */
UI.prototype.onRoomCreated = function(payload) {
    if(payload.state === 'success') {
        if(payload.data.room.owner === game.client.socket.id) {
            game.client.joinRoom(payload.data.room.name);
            //TODO: Change scene to room
        }

        updateLobbyRooms(payload.data.rooms);
    }
    else {
        console.log('Error during room creation');
    }
};

/**
 * React on room joined
 */
UI.prototype.onRoomJoined = function(payload) {
   if(payload.state === 'success') {
        //TODO: Change scene to room and append data accordingly
        updateLobbyRooms(payload.data.rooms);
       
       if(typeof payload.data.room !== "undefined") {
           UI.prototype.loadRoom(payload.data.room);
       }
    }
    else {
        console.log('Error joining room');
    }
};

/**
 * React on room left
 */
UI.prototype.onRoomLeft = function(payload) {
   if(payload.state === 'success') {
        game.client.joinLobby();
    }
    else {
        console.log('Error leaving room');
    }
};

/**
 * React on game started
 */
UI.prototype.onGameStarted = function(payload) {
   if(payload.state === 'success') {
        //Change scene to game scene
        console.info('Game started');
        console.log(payload.data);
    }
    else {
        console.info('Error starting game');
    } 
};

/**
 * React on map changed
 */
UI.prototype.onMapChanged = function(payload) {
   if(payload.state === 'success') {
        console.info('Changed map');
        console.log(payload.data);
    }
    else {
        console.log('Error changing map');
    }
};

/**
 * React on mode changed
 */
UI.prototype.onModeChanged = function(payload) {
   if(payload.state === 'success') {
        console.info('Changed mode');
        console.log(payload.data);
    }
    else {
        console.log('Error changing mode');
    }
};

/**
 * LOBBY USER FUNCTIONS
 */ 
function getPlayerNameInput() {
    return document.getElementById('my-username');
}
function updatePlayerNameInput(name) {
    var input = getPlayerNameInput();
    
    input.value = name;
}
function addPlayerNameInputChangeListener() {
    var input = getPlayerNameInput();
    
    input.addEventListener('change', function(e) {
      game.client.chooseName(this.value); 
   });
}
function updatePlayersOnline(players) {
    document.getElementById('players-online').innerHTML = players.length;
}
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
function addCharacterChangeListener() {
    var slideControls = document.querySelectorAll('[data-char]');
    
    console.log(slideControls);
    
    for(var i = 0; i < slideControls.length; i++) {
        slideControls[i].addEventListener('click', function() {
           var char = this.dataset.char;
            
            game.client.chooseCharacter(char);
        });
    }
}

/**
 * LOBBY ROOMS FUNCTIONS
 */  
function getLobbyRoomsList() {
    return document.getElementById('all-rooms');
}
function emptyLobbyRooms() {
    var list = getLobbyRoomsList();
    
    while(list.firstChild) {
        list.removeChild(list.firstChild);
    }
}
function fillLobbyRooms(rooms) {
    var list = getLobbyRoomsList();
    
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
            button.addEventListener('click', function(e) {
                game.client.joinRoom(this.getAttribute('id'));
                //TODO: Change scene to room
            });
            
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
function updateLobbyRooms(rooms) {
    var list = getLobbyRoomsList();
    
    emptyLobbyRooms();
    fillLobbyRooms(rooms);
}
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