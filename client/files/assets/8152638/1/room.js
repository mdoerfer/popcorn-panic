var Room = pc.createScript('room');

/**
 * Add component attributes
 */
Room.attributes.add('headerLogo', {
    type: 'asset',
    title: 'Header Logo'
});

Room.attributes.add('headerBg', {
    type: 'asset',
    title: 'Header Background'
});

Room.attributes.add('roomClass', {
    type: 'string',
    title: 'Room Class',
    placeholder: 'room',
    default: 'room'
});

Room.attributes.add('roomHtml', {
    type: 'asset',
    assetType: 'html',
    title: 'Room HTML'
});

Room.attributes.add('roomCss', {
    type: 'asset',
    assetType: 'css',
    title: 'Room CSS'
});

// initialize code called once per entity
Room.prototype.initialize = function() {
    this.initializeUI();
};

/**
 * Initialize UI
 */
Room.prototype.initializeUI = function() {
    this.loadRoom();
};

/**
 * Load lobby 
 */
Room.prototype.loadRoom = function() {
    /**
     * Append CSS
     */
    var style = document.createElement('style');
    style.innerHTML = this.roomCss.resource || '';
    document.head.appendChild(style);
    
    /**
     * Append HTML
     */
    var div = document.createElement('div');
    div.classList.add(this.roomClass);
    div.innerHTML = this.roomHtml.resource || '';
    document.body.appendChild(div);
    
    /**
     * Add images 
     */
    var headerBg = document.getElementById('header-bg');
    headerBg.setAttribute('src', this.headerBg.getFileUrl());
    
    var headerLogo = document.getElementById('header-logo');
    headerLogo.setAttribute('src', this.headerLogo.getFileUrl());
    
    /**
     * Bind event listeners
     */
    //this.bindDataEventListeners();
    //this.bindHTMLEventListeners();
};