var Home = pc.createScript('home');

/**
 * Add component attributes
 */
Home.attributes.add('containerClass', {
    type: 'string',
    title: 'Container Class',
    placeholder: 'container',
    default: 'container'
});

Home.attributes.add('html', {
    type: 'asset',
    assetType: 'html',
    title: 'HTML Asset'
});

Home.attributes.add('css', {
    type: 'asset',
    assetType: 'css',
    title: 'CSS Asset'
});

/**
 * Initialize component
 */
Home.prototype.initialize = function() {
    this.initializeUI();
    this.initializeClient();
};

/**
 * Initialize UI
 */
Home.prototype.initializeUI = function() {
    /**
     * Append CSS
     */
    var style = document.createElement('style');
    document.head.appendChild(style);
    style.innerHTML = this.css.resource || '';
    
    /**
     * Append HTML
     */
    this.div = document.createElement('div');
    this.div.classList.add(this.containerClass);
    this.div.innerHTML = this.html.resource || '';
    document.body.appendChild(this.div);
    
    /**
     * Bind Events to UI
     */
    var playBtn = this.div.querySelector('#playBtn');
    var settingsBtn = this.div.querySelector('#settingsBtn');
    var quitBtn = this.div.querySelector('#quitBtn');

    if(playBtn) {
        playBtn.addEventListener('click', function() {
            console.log('Play clicked.');
        });
    }

    if(settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            console.log('Settings clicked.');
        });
    }

    if(quitBtn) {
        quitBtn.addEventListener('click', function() {
            console.log('Quit clicked.');
        });
    }
};

Home.prototype.initializeClient = function() {
  //Connect client
  game.client.connect();
    
    //Join lobby
    game.client.joinLobby();
};

/**
 * Update component every frame
 */
Home.prototype.update = function(dt) {
    
};