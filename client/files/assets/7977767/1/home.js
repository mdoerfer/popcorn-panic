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
    
    /**
     * Bind event listeners
     */
    this.bindDataEventListeners();
    this.bindHTMLEventListeners();
};

/**
 * Connect to game server, join lobby and set up event listeners
 */ 
Lobby.prototype.initializeClient = function() {
    //Connect client
    game.client.connect();
    
    //Join lobby
    game.client.joinLobby();  
};

/**
 * Bind data event listeners
 */
Lobby.prototype.bindDataEventListeners = function() {
    this.app.on('lobby:joined', function(player, rooms, players) {      
        //Player name
        updatePlayerNameInput(player.name);
        
        //Players online
        updatePlayersOnline(players);
        
        //Player character
        updatePlayerCharacterSlider(player.character);
        
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
    
     this.app.on('lobby:room-created', function(rooms) {
       //Rooms
        updateLobbyRooms(rooms);
    });
    
    this.app.on('lobby:room-joined', function(rooms) {
       //Rooms
        updateLobbyRooms(rooms);
    });
    
     this.app.on('lobby:room-left', function(rooms) {
       //Rooms
        updateLobbyRooms(rooms);
    });
    
    this.app.on('lobby:game-started', function(rooms) {
       //Rooms
        updateLobbyRooms(rooms);
    });
};

/**
 * Bind html event listeners
 */
Lobby.prototype.bindHTMLEventListeners = function() {
    addPlayerNameInputChangeListener();
    addPlayerCharacterChangeListener();
    addCreateRoomListener();
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