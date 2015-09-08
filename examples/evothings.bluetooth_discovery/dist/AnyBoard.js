"use strict";

/**
 * Global variable AnyBoard.
 * @type {object}
 */
var AnyBoard = AnyBoard || {};

/**
 * Exporting AnyBoard as Node Module if applicable
 * @type {object}
 */
if (typeof module !== "undefined") module.exports = AnyBoard;
/**
 * @static {object}
 */
AnyBoard.Drivers = {
    drivers: {}
};

/**
 * Returns driver with given name
 * @param {string} name name of driver
 * @returns {AnyBoard.Driver} driver with given name (or undefined if non-existent)
 */
AnyBoard.Drivers.get = function(name) {
    return this.drivers[name];
};

/**
 * Returns driver of certain type that has a certain compatibility
 * @param {string} type name of driver
 * @param {string|object} compatibility name of driver
 * @returns {AnyBoard.Driver} compatible driver (or undefined if non-existent)
 */
AnyBoard.Drivers.getCompatibleDriver = function(type, compatibility) {
    for (var key in AnyBoard.Drivers.drivers) {
        if (!AnyBoard.Drivers.drivers.hasOwnProperty(key))
            continue;
        var driver = AnyBoard.Drivers.drivers[key];
        if (typeof driver.type === 'string' && type !== driver.type
            || driver.type instanceof Array && driver.type.indexOf(type) === -1)
            continue;
        if (driver.compatibility instanceof Array) {
            for (var index in driver.compatibility) {
                if (driver.compatibility.hasOwnProperty(index))
                    if (AnyBoard._isEqual(compatibility, driver.compatibility[index]))
                        return driver;
            }
        } else if (AnyBoard._isEqual(compatibility, driver.compatibility)) {
            return driver;
        }

    }
    return undefined;
};

/*
 * Help function. Drivers added with this function are retrievable with get function.
 * New drivers are added automatically upon construction with new AnyBoard.Driver(...)
 * @param {function} driver driver to be added
 * @private
 */
AnyBoard.Drivers._add = function(driver) {
    if (!driver.name) {
        AnyBoard.Logger.warn('Attempted to add driver without name. Driver will be ignored.', this);
        return;
    }
    if (this.drivers[driver.name])
        AnyBoard.Logger.warn('Driver with name + ' + driver.name + ' already existed. Overwriting', this);
    this.drivers[driver.name] = driver;
};

/*
 * Returns a short description of this class
 * @returns {string}
 */
AnyBoard.Drivers.toString = function() {
    return 'AnyBoard.Drivers (driverManager)'
};

/** Represents a single Driver, e.g. for spesific token or bluetooth on operating system.
 * @constructor
 * @param {object} options options for the driver
 * @param {string} options.name name of the driver
 * @param {string} options.description description of the driver
 * @param {string} options.version version of the driver
 * @param {string} options.type Type of driver, e.g. "bluetooth"
 * @param {Array|object|string} options.compatibility An object or string that can be used to deduce compatibiity, or
 *      an array of different compatibilies.
 * @param {string} options.dependencies (optional) What if anything the driver depends on.
 * @param {string} options.date (optional) Date upon release/last build.
 * @param {any} options.yourAttributeHere custom attributes, as well as specified ones, are all placed in
 *      driver.properties. E.g. 'heat' would be placed in driver.properties.heat.
 * @property {string} name name of the driver
 * @property {string} description description of the driver
 * @property {string} version version of the driver
 * @property {string} dependencies (optional) What if anything the driver depends on.
 * @property {string} date (optional) Date upon release/last build.
 * @property {string} type Type of driver, e.g. "bluetooth"
 * @property {Array|object|string} compatibility An object or string that can be used to deduce compatibiity, or
 *      an array of different compatibilies.
 * @property {object} properties dictionary that holds custom attributes
 */
AnyBoard.Driver = function(options) {
    if (!options.name || !options.description || !options.version || !options.type || !options.compatibility) {
        AnyBoard.Logger.error(
            'Attempted to add driver without necessary options (name, description, version, type, compatibility). ' +
            'Driver will be ignored.',
            this
        );
    }
    this.name = options.name;
    this.description = options.description;
    this.dependencies = options.dependencies;
    this.version = options.version;
    this.date = options.date;
    this.type = options.type;
    this.compatibility = options.compatibility;
    this.properties = options;

    AnyBoard.Logger.debug('Loaded Driver ' + options.name, this);

    AnyBoard.Drivers._add(this);
};

/**
 * Returns a short description of the Driver instance
 * @returns {string}
 */
AnyBoard.Driver.prototype.toString = function() {
    return 'Driver: ' + this.name;
};



/** Represents a Deck of Cards
 *
 * @constructor
 * @param {string} name name of Deck. This name can be used to retrieve the deck via AnyBoard.Deck.all[name].
 * @param {object} jsonDeck loaded JSON file. See [examples-folder](./examples) for JSON format and loading.
 * @property {string} name name of Deck.
 * @property {Array} cards complete set of cards in the deck
 * @property {Array} pile remaining cards in this pile
 * @property {Array} usedPile cards played from this deck
 * @property {boolean} autoUsedRefill *(default: true)* whether or not to automatically refill pile from usedPile when empty. Is ignored if autoNewRefill is true.
 * @property {boolean} autoNewRefill *(default: false)* whether or not to automatically refill pile with a new deck when empty.
 * @property {Array} playListeners holds functions to be called when cards in this deck are played
 * @property {Array} drawListeners holds functions to be called when cards in this deck are drawn
 */
AnyBoard.Deck = function (name, jsonDeck) {
    AnyBoard.Logger.debug("Adding new Deck " + name)
    this.name = name;
    this.cards = [];
    this.pile = [];
    this.usedPile = [];
    this.autoUsedRefill = true;
    this.autoNewRefill = false;
    this.playListeners = [];
    this.drawListeners = [];

    if (!AnyBoard.Deck.all[this.name])
        AnyBoard.Deck.all[this.name] = this;
    else
        AnyBoard.Logger.warn("Deck with name " + this.name + " already exists. Old deck will no longer be available " +
            "through AnyBoard.Deck.get", this);

    this.initiate(jsonDeck);
};

AnyBoard.Deck.all = {};

/**
 * Returns deck with given name
 * @param {string} name name of deck
 * @returns {AnyBoard.Deck} deck with given name (or undefined if non-existent)
 */
AnyBoard.Deck.get = function(name) {
    return AnyBoard.Deck.all[name]
};

/**
 * Shuffles the pile of undrawn cards   .
 * Pile is automatically shuffled upon construction, and upon initiate(). New cards added upon refill() are also automatically shuffled.
 */
AnyBoard.Deck.prototype.shuffle = function() {
    for(var j, x, i = this.pile.length; i; j = Math.floor(Math.random() * i), x = this.pile[--i], this.pile[i] = this.pile[j], this.pile[j] = x);
};

/**
 * Reads Deck from jsonObject and provides a shuffled version in pile.
 * Is automatically called upon constructing a deck.
 * @param {object} jsonDeck loaded json file. See [examples-folder](./examples) for example of json file and loading
 */
AnyBoard.Deck.prototype.initiate = function(jsonDeck) {
    if (jsonDeck.hasOwnProperty('autoNewRefill'))
        this.autoNewRefill = jsonDeck.autoNewRefill;
    if (jsonDeck.hasOwnProperty('autoUsedRefill'))
        this.autoUsedRefill = jsonDeck.autoUsedRefill;
    var card;
    for (var i = 0; i < jsonDeck.cards.length; i++) {
        card = new AnyBoard.Card(this, jsonDeck.cards[i]);
        for (var j = 0; j < card.amount; j++)
            this.cards.push(card);
    }
    this.refill(true);
};

/**
 * Manually refills the pile. This is not necessary if autoUsedRefill or autoNewRefill property of deck is true.
 * @param {boolean} newDeck *(default: false)* True if to refill with a new deck. False if to refill with played cards (from usedPile)
 */
AnyBoard.Deck.prototype.refill = function(newDeck) {
    AnyBoard.Logger.debug("Refilling Deck " + this.name + " with " + (newDeck ? "new cards" : "used pile."));
    var tmp = this.pile.slice();
    if (newDeck)
        this.pile = this.cards.slice();
    else
        this.pile = this.usedPile.slice();
    this.shuffle();
    this.pile.concat(tmp);
    if (!newDeck)
        this.usedPile = [];
};

/*
 * NB: Helpfunction! Use player.draw(deck) instead.
 * Draws a card from the deck.
 * Refills pile if autoNewRefill or autoUsedRefill is true.
 * @param {AnyBoard.Player} player player that draws the card
 * @param {object} options *(optional)* custom options sent to drawListeners
 * @returns {AnyBoard.Card} card card that is drawn, or undefined if pile is empty and autoRefill properties are false.
 */
AnyBoard.Deck.prototype._draw = function(player, options) {
    if (this.pile.length < 1) {
        if (this.autoNewRefill)
            this.refill(true);
        else if (this.autoUsedRefill) {
            this.refill(false);
        }
    }
    var card = this.pile.pop();
    if (!card) {
        // out of cards
    }
    for (var func in this.drawListeners) {
        if (this.drawListeners.hasOwnProperty(func))
            this.drawListeners[func](card, player, options)
    }
    return card;
};

/**
 * Adds functions to be executed upon all Cards in this Deck.
 * @param {function} func function to be executed with the 3 parameters AnyBoard.Card, AnyBoard.Player, (options) when cards are played
 */
AnyBoard.Deck.prototype.onPlay = function(func) {
    AnyBoard.Logger.debug("Adds function to playListener of deck " + this.name);
    this.playListeners.push(func);
};

/**
 * Adds functions to be executed upon draw of Card from this Deck
 * @param {function} func function to be executed with the 3 parameters AnyBoard.Card, AnyBoard.Player, (options) when cards are drawn
 */
AnyBoard.Deck.prototype.onDraw = function(func) {
    AnyBoard.Logger.debug("Adds function to drawListener of deck " + this.name);
    this.drawListeners.push(func);
};

AnyBoard.Deck.prototype.toString = function() {
    return 'Deck: ' + this.name;
}


/** Represents a single Card (AnyBoard.Card)
 * Read from JSON file provided to Deck class.
 * @constructor
 * @param {AnyBoard.Deck} deck deck to which the card belongs
 * @param {object} options options for the card
 * @param {string} options.title title of the card.
 * @param {string} options.description description for the Card
 * @param {string} options.color (optional) color of the Card
 * @param {string} options.category (optional) category of the card, not used by AnyBoard FrameWork
 * @param {number} options.value (optional) value of the card, not used by AnyBoard FrameWork
 * @param {string} options.type (optional) type of the card, not used by AnyBoard FrameWork
 * @param {number} options.amount (default: 1) amount of this card in the deck
 * @param {any} options.yourAttributeHere custom attributes, as well as specified ones, are all placed in card.properties. E.g. 'heat' would be placed in card.properties.heat.
 * @property {string} title title of the card.
 * @property {string} description description for the Card
 * @property {string} color color of the Card
 * @property {string} category category of the card, not used by AnyBoard FrameWork
 * @property {number} value value of the card, not used by AnyBoard FrameWork
 * @property {string} type type of the card, not used by AnyBoard FrameWork
 * @property {number} amount amount of this card its deck
 * @property {AnyBoard.Deck} deck deck that this card belongs to
 * @property {Array} playListeneres functions to be called upon play of this spesific card (in addition to playListeners on its belonging deck)
 * @property {object} properties dictionary that holds custom attributes
 */
AnyBoard.Card = function (deck, options) {
    AnyBoard.Logger.debug("Adding new Card " + options.title)
    this.id = AnyBoard.Card.AUTO_INC();
    this.title = options.title;
    this.description = options.description;
    this.color = options.color || null;
    this.category = options.category || null;
    this.value = options.value || null;
    this.type = options.type || null;
    this.amount = options.amount || 1;

    this.properties = options;
    this.deck = deck;

    AnyBoard.Card.all[this.id] = this;
    if (AnyBoard.Card.allTitle[this.title])
        AnyBoard.Logger.warn("Card with title " + this.title + " already exists. Old card will no longer be available " +
        "through AnyBoard.Card.get", this);
    AnyBoard.Card.allTitle[this.title] = this;
};

AnyBoard.Card.COUNTER = 0;
AnyBoard.Card.AUTO_INC = function() {
    return ++AnyBoard.Card.COUNTER;
};

AnyBoard.Card.all = {};
AnyBoard.Card.allTitle = {};

/**
 * Returns card with given id
 * @param {number} cardTitleOrID id or title of card
 * @returns {AnyBoard.Card} card with given id (or undefined if non-existent)
 */
AnyBoard.Card.get = function(cardTitleOrID) {
    if (typeof(cardTitleOrID) === 'number')
        return AnyBoard.Card.all[cardTitleOrID];
    return AnyBoard.Card.allTitle[cardTitleOrID]
};

/*
 * NB: Helpfunction! Use player.play(card) instead.
 * Call in order to play a card. This will ensure any listeners are informed of the play and put the card in the usedPile of its belonging deck.
 * @param {AnyBoard.Player} player the player that does the play
 * @param {object} options custom options/properties
 */
AnyBoard.Card.prototype._play = function(player, options) {
    for (var func in this.deck.playListeners) {
        if (this.deck.playListeners.hasOwnProperty(func))
            this.deck.playListeners[func](this, player, options)
    }
    this.deck.usedPile.push(this);
};

AnyBoard.Card.prototype.toString = function() {
    return 'Card: ' + this.title + ', id: ' + this.id;
};
/** Represents a set of game dices that can be rolled to retrieve a random result.
 * @constructor
 * @param {number} eyes *(default 6)* number of max eyes on a roll with this dice
 * @param {number} numOfDice *(default: 1)* number of dices
 *
 */
AnyBoard.Dices = function (eyes, numOfDice) {
    this.eyes = eyes || 6;
    this.numOfDice = numOfDice || 1;
};

/**
 * Roll the dices and returns a the sum
 * @returns {number} combined result of rolls for all dices
 */
AnyBoard.Dices.prototype.roll = function() {
    var res = 0;
    for (var i = 0; i < this.numOfDice; i++)
        res += Math.floor(Math.random()*this.eyes)+1;
    return res;
};

/**
 * Roll the dices and returns an array of results for each dice
 * @returns {Array} list of results for each dice
 */
AnyBoard.Dices.prototype.rollEach = function() {
    var res = [];
    for (var i = 0; i < this.numOfDice; i++)
        res.push(Math.floor(Math.random()*this.eyes)+1);
    return res;
};

/** Represents a Player (AnyBoard.Player)
 * @constructor
 * @param {string} name name of the player
 * @param {object} options *(optional)* options for the player
 * @param {string} options.color *(optional)* color representing the player
 * @param {string} options.faction *(optional)* faction representing the player
 * @param {string} options.class *(optional)* class representing the player
 * @param {any} options.yourAttributeHere custom attributes, as well as specified ones, are all placed in player.properties. E.g. 'age' would be placed in player.properties.age.
 * @property {AnyBoard.Hand} hand hand of cards (Quests)
 * @property {string} faction faction (Special abilities or perks)
 * @property {string} class class (Special abilities or perks)
 * @property {AnyBoard.ResourceSet} holds the resources belonging to this player
 * @property {string} color color representation of player
 *
 */
AnyBoard.Player = function(name, options) {
    AnyBoard.Logger.debug("Adding new Player " + name);
    options = options || {};
    this.color = options.color;
    this.name = name;
    this.hand = new AnyBoard.Hand(this);
    this.faction = options.faction;
    this.class = options.class;
    this.bank = new AnyBoard.ResourceSet();
    this.properties = options;

    if (AnyBoard.Player.all[this.name])
        AnyBoard.Logger.warn("Player with name " + this.name + " already exists. Old player will no longer be available " +
        "through AnyBoard.Player.get", this);
    AnyBoard.Player.all[this.name] = this;

};

AnyBoard.Player.all = {};

/**
 * Returns player with given name
 * @param {string} name name of player
 * @returns {AnyBoard.Player} player with given name (or undefined if non-existent)
 */
AnyBoard.Player.get = function(name) {
    return AnyBoard.Player.all[name]
};

/**
 * Take resources from this player and give to receivingPlayer.
 * @param {AnyBoard.ResourceSet} resources dictionary of resources
 * @param {AnyBoard.Player} receivingPlayer *(optional)* Who shall receive the resources. Omit if not to anyone
 * @returns {boolean} whether or not transaction was completed (fale if Player don't hold enough resources)
 */
AnyBoard.Player.prototype.pay = function(resources, receivingPlayer) {
    if (!this.bank.contains(resources)) {
        AnyBoard.Logger.debug('' + this.name + " does not have sufficient resources to pay " + resources.resources, this);
        return false;
    }
    if (receivingPlayer) {
        receivingPlayer.recieve(resources);
    }
    AnyBoard.Logger.debug('' + this.name + " paid " + resources.resources, this);
    this.bank.subtract(resources);
    return true;
};

/**
 * Trade resources between players/game
 * @param {AnyBoard.ResourceSet} giveResources resources this player shall give
 * @param {AnyBoard.ResourceSet} receiveResources resources this player receieves
 * @param {AnyBoard.Player} player *(optional)* Who shall be traded with. Omit if not to a player, but to game.
 * @returns {boolean} false if any of the players doesn't hold enough resources
 */
AnyBoard.Player.prototype.trade = function(giveResources, receiveResources, player) {
    var similarities = giveResources.similarities(receiveResources);
    receiveResources.subtract(similarities);
    giveResources.subtract(similarities);

    if (!this.bank.contains(giveResources)){
        AnyBoard.Logger.debug('' + this.name + " does not have sufficient resources to trade " + giveResources.resources, this);
        return false;
    }
    if (receiveResources && player && !player.bank.contains(receiveResources)) {
        AnyBoard.Logger.debug('' + player.name + " does not have sufficient resources to trade " + receiveResources.resources, this);
        return false;
    }
    if (player) {
        player.pay(receiveResources, this);
    } else {
        this.receive(receiveResources);
    }
    this.pay(giveResources, player);
    return true;
};

/**
 * Receive resource from bank/game. Use pay() when receiving from players.
 * @param {AnyBoard.ResourceSet} resourceSet resources to be added to this players bank
 */
AnyBoard.Player.prototype.recieve = function(resourceSet) {
    AnyBoard.Logger.debug('' + this.name + " received " + resourceSet.resources, this);
    this.bank.add(resourceSet)
};

/**
 * Draws a card from a deck and puts it in the hand of the player
 * @param {AnyBoard.Deck} deck deck to be drawn from
 * @param {object} options *(optional)* parameters to be sent to the drawListeners on the deck
 * @returns {AnyBoard.Card} card that is drawn
 */
AnyBoard.Player.prototype.draw = function(deck, options) {
    var card = deck._draw(this, options);
    if (!card) {
        AnyBoard.Logger.debug('' + this.name + " couldn't draw from empty deck " + deck.name, this);
    }
    else {
        this.hand._add(card);
        AnyBoard.Logger.debug('' + this.name + " drew card " + card.title + " from deck " + deck.name, this);
    }
    return card;
};

/**
 * Plays a card from the hand. If the hand does not contain the card, the card is not played and the hand unchanged.
 * @param {AnyBoard.Card} card card to be played
 * @param {object} customOptions *(optional)* custom options that the play should be played with
 * @returns {boolean} isPlayed whether or not the card was played
 */
AnyBoard.Player.prototype.play = function(card, customOptions) {
    AnyBoard.Logger.debug('' + this.name + " playes card " + card.title, this);
    if (!this.hand.has(card)) {
        AnyBoard.Logger.debug('' + this.name + "'s Hand does not contain card " + card.title, this);
        return false;
    }
    card._play(this, customOptions);
    this.hand.cards[card.id] -= 1;
    return true;
};

AnyBoard.Player.prototype.toString = function() {
    return 'Player: ' + this.name;
};

/**
 * Represents a Hand of a player, containing cards.
 * @param {AnyBoard.Player} player player to which this hand belongs
 * @param {object} options *(optional)* custom properties added to this hand
 * @constructor
 */
AnyBoard.Hand = function(player, options) {
    AnyBoard.Logger.debug("Adding new Hand to player " + player.name);
    this.cards = {};
    this.player = player;
    this.properties = options;
};

/**
 * Checks whether or not a player has an amount card in this hand.
 * @param {AnyBoard.Card} card card to be checked if is in hand
 * @param {number} amount (default: 1)* amount of card to be checked if is in hand
 * @returns {boolean} hasCard whether or not the player has that amount or more of that card in this hand
 */
AnyBoard.Hand.prototype.has = function(card, amount) {
    amount = amount || 1;
    if (this.cards[card.id] && this.cards[card.id] >= amount) {
        AnyBoard.Logger.debug('' + this.player.name + " has at least " + amount + " card: " + card.title, this);
        return true;
    }
    AnyBoard.Logger.debug('' + this.player.name + " has less than " + amount + " card: " + card.title, this);
    return false;
};

/*
 * NB: Helpfunction! Use player.draw(deck) instead.
 * Adds a card to the hand of a player
 * @param {AnyBoard.Card} card card to be added to this hand
 */
AnyBoard.Hand.prototype._add = function(card) {
    if (!this.cards[card.id])
        this.cards[card.id] = 0;
    AnyBoard.Logger.debug('' + this.player.name + " added to hand, card " + card.title, this);
    this.cards[card.id] += 1;
};

AnyBoard.Hand.prototype.toString = function() {
    return 'Hand: belongs to ' + (this.player ? this.player.name : ' no one');
};



/**
 * Represents a simple resource (AnyBoard.Resource)
 * @constructor
 * @param {string} name name representing the resource
 * @param {object} properties custom properties of this resource
 * @property {string} name name of resource
 * @property {string} properties *(optional)* custom options added to resource
 */
AnyBoard.Resource = function(name, properties) {
    AnyBoard.Logger.debug("Adding new Resource " + name);
    if (AnyBoard.Resource.all[this.name]) {
        AnyBoard.Logger.error("Resource with name " + this.name + " already exists", this)
        return;
    }
    this.name = name;
    this.properties = properties;

    AnyBoard.Resource.all[this.name] = this;
};

AnyBoard.Resource.all = {};

/**
 * Returns resource with given name
 * @param {string} name name of resource
 * @returns {AnyBoard.Resource} resource with given name (or undefined if non-existent)
 */
AnyBoard.Resource.get = function(name) {
    return AnyBoard.Resource.all[name]
};

/**
 * Creates a ResourceSet (AnyBoard.ResourceSet)
 * @param {object} resources *(optional)* a set of initially contained resources
 * @param {boolean} allowNegative *(default: false)*  whether or not to allow being subtracted resources to below 0 (dept)
 * @property {object} resources *(optional)* a set of initially contained resources
 * @property {boolean} allowNegative *(default: false)*  whether or not to allow being subtracted resources to below 0 (dept)
 * @constructor
 */
AnyBoard.ResourceSet = function(resources, allowNegative) {
    AnyBoard.Logger.debug("Adding new ResourceSet (allowNegative: " + allowNegative + ")");
    this.resources = {};
    for (var i in resources) {
        if (!resources.hasOwnProperty(i))
            continue;
        if (typeof i === 'string') {
            if (AnyBoard.Resource.get(i))
                this.resources[i] = resources[i];
            else
                AnyBoard.Logger.warn("Attempting to create ResourceSet with non-existant resource " + i + ". Resource ignored.");
        }
        else if (i instanceof AnyBoard.Resource) {
            this.resources[i.name] = resources[i]
        }
    }
    this.allowNegative = allowNegative || false;
};

/**
 * Whether or not a ResourceSet contains another ResourceSet
 * @param {AnyBoard.ResourceSet} reqResource ResourceSet to be compared against
 * @returns {boolean} true if this ResourceSet contains reqResource, else false
 */
AnyBoard.ResourceSet.prototype.contains = function(reqResource) {
    for (var resource in reqResource.resources) {
        if (reqResource.resources.hasOwnProperty(resource) && reqResource.resources[resource] > 0) {
            if (!this.resources.hasOwnProperty(resource) || this.resources[resource] < reqResource.resources[resource])
                return false;
        }
    }
    return true;
};

/**
 * Adds a ResourceSet to this one
 * @param {AnyBoard.ResourceSet} resourceSet ResourceSet to be added to this one
 */
AnyBoard.ResourceSet.prototype.add = function(resourceSet) {
    for (var resource in resourceSet.resources) {
        if (resourceSet.resources.hasOwnProperty(resource)) {
            if (!this.resources.hasOwnProperty(resource))
                this.resources[resource] = 0;
            this.resources[resource] += resourceSet.resources[resource]
        }
    }
};

/**
 * Subtracts a dictionary of resources and amounts to a ResourceSet
 * @param {AnyBoard.ResourceSet} resourceSet set of resources to be subtracted
 * @returns {boolean} whether or not resources were subtracted successfully
 */
AnyBoard.ResourceSet.prototype.subtract = function(resourceSet) {
    if (!this.allowNegative && !this.contains(resourceSet)){
        return false;
    }
    for (var resource in resourceSet.resources) {
        if (resourceSet.resources.hasOwnProperty(resource)) {
            if (!this.resources.hasOwnProperty(resource))
                this.resources[resource] = 0;
            this.resources[resource] -= resourceSet.resources[resource];
        }
    }
    return true;
};

/**
 * Returns the common resources and minimum amount between a dictionary of resources and amounts, and this ResourceSet
 * @param {AnyBoard.ResourceSet} resourceSet dictionary of resources and amounts to be compared against
 * @returns {object} similarities dictionary of common resources and amounts
 */
AnyBoard.ResourceSet.prototype.similarities = function(resourceSet) {
    var similarities = {};
    for (var resource in resourceSet.resources) {
        if (resourceSet.resources.hasOwnProperty(resource)) {
            if (this.resources.hasOwnProperty(resource))
                similarities[resource] = Math.min(this.resources[resource], resourceSet.resources[resource])
        }
    }
    return similarities;
};

/**
 * A token manager.
 * @static
 * @property {object} tokens dictionary of connect tokens that maps id to object
 * @property {AnyBoard.Driver} driver driver for comm. Set with setDriver(driver);
 */
AnyBoard.TokenManager = {
    tokens: {},
    driver: null
};

/**
 * Sets a new default driver to handle communication for tokens without specified driver
 * @param {AnyBoard.Driver} driver driver to be used for communication
 */
AnyBoard.TokenManager.setDriver = function(driver) {
    // Check that functions exists on driver
    (driver.connect && typeof driver.connect === 'function') || AnyBoard.Logger.warn('Could not find connect() on given driver.', this);
    (driver.disconnect && typeof driver.disconnect === 'function') || AnyBoard.Logger.warn('Could not find disconnect() on given driver', this);
    (driver.scan && typeof driver.scan === 'function') || AnyBoard.Logger.warn('Could not find scan() on given driver', this);

    if ((!this.driver) || (driver.connect && typeof driver.connect === 'function' &&
        driver.disconnect && typeof driver.disconnect === 'function' &&
        driver.scan && typeof driver.scan === 'function'))

        this.driver = driver;
};

/**
 * Scans for tokens nearby and stores in discoveredTokens property
 * @param {function} win function to be executed when devices are found (called for each device found)
 * @param {function} fail function to be executed upon failure
 * @param {number} timeout amount of milliseconds to scan before stopping
 */
AnyBoard.TokenManager.scan = function(win, fail, timeout) {
    this.driver.scan(
        function(token) {
            AnyBoard.TokenManager.tokens[token.address] = token;
            win(token);
        },
        fail, timeout)
};

/**
 * Returns a token handled by this TokenManager
 * @param {string} address identifer of the token found when scanned
 * @returns {AnyBoard.BaseToken} token if handled by this tokenManager, else undefined
 */
AnyBoard.TokenManager.get = function(address) {
    return this.tokens[address];
};

/**
 * Base class for tokens. Should be used by communication driver upon AnyBoard.TokenManager.scan()
 * @param {string} name name of the token
 * @param {string} address address of the token found when scanned
 * @param {object} device device object used and handled by driver
 * @param {AnyBoard.Driver} [driver=AnyBoard.TokenManager.driver] token driver for handling communication with it.
 * @property {string} name name of the token
 * @property {string} address address of the token found when scanned
 * @property {boolean} connected whether or not the token is connected
 * @property {object} device driver spesific data.
 * @property {object} listeners functions to be execute upon certain triggered events
 * @property {object} onceListeners functions to be execute upon next triggering of certain events
 * @property {object} sendQueue sending to Pawn is being held here until available
 * @property {AnyBoard.Driver} driver driver that handles communication
 * @constructor
 */
AnyBoard.BaseToken = function(name, address, device, driver) {
    this.name = name;
    this.address = address;
    this.connected = false;
    this.device = device;
    this.listeners = {};
    this.onceListeners = {};
    this.sendQueue = [];
    this.cache = [];
    this.driver = driver;
};

/**
 * Returns whether or not the token is connected
 * @returns {boolean} true if connected, else false
 */
AnyBoard.BaseToken.prototype.isConnected = function() {
    return this.connected;
};

/**
 * Attempts to connect to token.
 * @param {function} win function to be executed upon success
 * @param {function} fail function to be executed upon failure
 * @returns {boolean} whether or not token is connected
 */
AnyBoard.BaseToken.prototype.connect = function(win, fail) {
    AnyBoard.Logger.debug('Attempting to connect to ' + this);
    var pointer = this.driver || AnyBoard.TokenManager.driver;
    var self = this;
    pointer.connect(
        self,
        function(device) {
            AnyBoard.Logger.debug('Connected to ' + self);
            self.connected = true;
            self.trigger('connect', {device: self});
            win(device);
        },
        function(errorCode) {
            AnyBoard.Logger.debug('Could not connect to ' + self + '. ' + errorCode);
            self.trigger('disconnect', {device: self});
            self.connected = false;
            fail(errorCode);
        }
    );
};

/**
 * Disconnects from the token.
 */
AnyBoard.BaseToken.prototype.disconnect = function() {
    var pointer = this.driver || AnyBoard.TokenManager.driver;
    pointer.disconnect(this);
    AnyBoard.Logger.debug('' + this + ' disconnected', this);
    this.connected = false;
    this.trigger('disconnect', {device: this});
};

/**
 * Trigger an event on a token
 * @param {string} eventName name of event
 * @param {object} eventOptions dictionary of parameters and values
 */
AnyBoard.BaseToken.prototype.trigger = function(eventName, eventOptions) {
    AnyBoard.Logger.debug('' + this + ' triggered "' + eventName + '"');
    if (this.listeners[eventName])
        for (var i in this.listeners[eventName]) {
            if (this.listeners[eventName].hasOwnProperty(i))
                this.listeners[eventName][i](eventOptions);
        }
    if (this.onceListeners[eventName]) {
        for (var j in this.onceListeners[eventName]) {
            if (this.onceListeners[eventName].hasOwnProperty(j))
                this.onceListeners[eventName][j](eventOptions);
        }
        this.onceListeners[eventName] = [];
    }
};

/**
 * Adds a callbackFunction to be executed always when event is triggered
 * @param {string} eventName name of event to listen to
 * @param {function} callbackFunction function to be executed
 */
AnyBoard.BaseToken.prototype.on = function(eventName, callbackFunction) {
    AnyBoard.Logger.debug('' + this + ' added listener to event: ' + eventName, this);
    if (!this.listeners[eventName])
        this.listeners[eventName] = [];
    this.listeners[eventName].push(callbackFunction);
};

/**
 * Adds a callbackFunction to be executed next time an event is triggered
 * @param {string} eventName name of event to listen to
 * @param {function} callbackFunction function to be executed
 */
AnyBoard.BaseToken.prototype.once = function(eventName, callbackFunction) {
    AnyBoard.Logger.debug('' + this + ' added onceListener to event: ' + eventName, this);
    if (!this.onceListeners[eventName])
        this.onceListeners[eventName] = [];
    this.onceListeners[eventName].push(callbackFunction);
};

/**
 * Sends raw data to the token.
 * @param {Uint8Array|ArrayBuffer|String} data data to be sent
 * @param {function} win function to be executed upon success
 * @param {function} fail function to be executed upon error
 */
AnyBoard.BaseToken.prototype.send = function(data, win, fail) {
    AnyBoard.Logger.debug('' + this + ' attempting to send with data: ' + data, this);
    if (!this.isConnected()) {
        AnyBoard.Logger.warn(this + ' is not connected. Attempting to connect first.', this);
        var self = this;
        this.connect(
            function(device){
                self.sendBuffer(data, win, fail);
            }, function(errorCode){
                fail(errorCode);
            }
        )
    } else {
        var pointer = this.driver || AnyBoard.TokenManager.driver;
        pointer.send(this, data, win, fail);
    }
};

/**
 * Prints to Token
 *
 * String can have special tokens to signify some printer command, e.g. ##n = newLine
 * Refer to the individual driver for token spesific implementation and capabilites
 *
 * @param {string} value
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.print = function(value, win, fail) {
    if (!this.driver.hasOwnProperty('print')) {
        AnyBoard.Logger.warn('This token has not implemented print', this);
        fail && fail('This token has not implemented print');
    } else {
        this.driver.print(this, value, win, fail);
    }
};

/**
 * Gets the name of the firmware type of the token
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.getFirmwareName = function(win, fail) {
    if (!this.driver.hasOwnProperty('getName')) {
        AnyBoard.Logger.warn('This token has not implemented getName', this);
        fail && fail('This token has not implemented getName');
    } else {
        this.driver.getName(this, function(data){
            win && win(data.value); }, fail);
    }
};

/**
 * Gets the version of the firmware type of the token
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.getFirmwareVersion = function(win, fail) {
    if (!this.driver.hasOwnProperty('getVersion')) {
        AnyBoard.Logger.warn('This token has not implemented getVersion', this);
        fail && fail('This token has not implemented getVersion');
    } else {
        this.driver.getVersion(this, function(data){
            win && win(data.value); }, fail);
    }
};

/**
 * Gets a uniquie ID the firmware of the token
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.getFirmwareUUID = function(win, fail) {
    if (!this.driver.hasOwnProperty('getUUID')) {
        AnyBoard.Logger.warn('This token has not implemented getUUID', this);
        fail && fail('This token has not implemented getUUID');
    } else {
        this.driver.getUUID(this, function(data){ win && win(data.value); }, fail);
    }
};

/**
 * Checks whether or not the token has simple LED
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.hasLed = function(win, fail) {
    if (!this.driver.hasOwnProperty('hasLed')) {
        AnyBoard.Logger.debug('This token has not implemented hasLed', this);
        fail && fail('This token has not implemented hasLed');
    } else {
        this.driver.hasLed(this, function(data) { win && win(data.value); }, fail);
    }
};

/**
 * Checks whether or not the token has colored LEDs
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.hasLedColor = function(win, fail) {
    if (!this.driver.hasOwnProperty('hasLedColor')) {
        AnyBoard.Logger.debug('This token has not implemented hasLedColor', this);
        fail && fail('This token has not implemented hasLedColor');
    } else {
        this.driver.hasLedColor(this, function(data) { win && win(data.value); }, fail);
    }
};

/**
 * Checks whether or not the token has vibration
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.hasVibration = function(win, fail) {
    if (!this.driver.hasOwnProperty('hasVibration')) {
        AnyBoard.Logger.debug('This token has not implemented hasVibration', this);
        fail && fail('This token has not implemented hasVibration');
    } else {
        this.driver.hasVibration(this, function(data) { win && win(data.value); }, fail);
    }
};

/**
 * Checks whether or not the token has ColorDetection
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.hasColorDetection = function(win, fail) {
    if (!this.driver.hasOwnProperty('hasColorDetection')) {
        AnyBoard.Logger.debug('This token has not implemented hasColorDetection', this);
        fail && fail('This token has not implemented hasColorDetection');
    } else {
        this.driver.hasColorDetection(this, function(data) { win && win(data.value); }, fail);
    }
};

/**
 * Checks whether or not the token has LedSceen
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.hasLedScreen = function(win, fail) {
    if (!this.driver.hasOwnProperty('hasLedSceen')) {
        AnyBoard.Logger.debug('This token has not implemented hasLedSceen', this);
        fail && fail('This token has not implemented hasLedSceen');
    } else {
        this.driver.hasLedScreen(this, function(data) { win && win(data.value); }, fail);
    }
};

/**
 * Checks whether or not the token has RFID reader
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.hasRfid = function(win, fail) {
    if (!this.driver.hasOwnProperty('hasRfid')) {
        AnyBoard.Logger.debug('This token has not implemented hasRfid', this);
        fail && fail('This token has not implemented hasRfid');
    } else {
        this.driver.hasRfid(this, function(data) { win && win(data.value); }, fail);
    }
};

/**
 * Checks whether or not the token has NFC reader
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.hasNfc = function(win, fail) {
    if (!this.driver.hasOwnProperty('hasNfc')) {
        AnyBoard.Logger.debug('This token has not implemented hasNfc', this);
        fail && fail('This token has not implemented hasNfc');
    } else {
        this.driver.hasNfc(this, function(data) { win && win(data.value); }, fail);
    }
};

/**
 * Checks whether or not the token has Accelometer
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.hasAccelometer = function(win, fail) {
    if (!this.driver.hasOwnProperty('hasAccelometer')) {
        AnyBoard.Logger.debug('This token has not implemented hasAccelometer', this);
        fail && fail('This token has not implemented hasAccelometer');
    } else {
        this.driver.hasAccelometer(this, function(data) { win && win(data.value); }, fail);
    }
};

/**
 * Checks whether or not the token has temperature measurement
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.hasTemperature = function(win, fail) {
    if (!this.driver.hasOwnProperty('hasTemperature')) {
        AnyBoard.Logger.debug('This token has not implemented hasTemperature', this);
        fail && fail('This token has not implemented hasTemperature');
    } else {
        this.driver.hasTemperature(this, function(data) { win && win(data.value); }, fail);
    }
};

/**
 * Sets color on token
 * @param {string|Array} value string with color name or array of [red, green, blue] values 0-255
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon
 */
AnyBoard.BaseToken.prototype.ledOn = function(value, win, fail) {
    if (!this.driver.hasOwnProperty('ledOn')) {
        AnyBoard.Logger.warn('This token has not implemented ledOn', this);
        fail && fail('This token has not implemented ledOn');
    } else {
        this.driver.ledOn(this, value, win, fail);
    }
};

/**
 * Sets color on token
 * @param {string|Array} value string with color name or array of [red, green, blue] values 0-255
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon
 */
AnyBoard.BaseToken.prototype.ledBlink = function(value, win, fail) {
    if (!this.driver.hasOwnProperty('ledBlink')) {
        AnyBoard.Logger.warn('This token has not implemented ledBlink', this);
        fail && fail('This token has not implemented ledBlink');
    } else {
        this.driver.ledBlink(this, value, win, fail);
    }
};

/**
 * Turns LED off
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon
 */
AnyBoard.BaseToken.prototype.ledOff = function(win, fail) {
    if (!this.driver.hasOwnProperty('ledOff')) {
        AnyBoard.Logger.warn('This token has not implemented ledOff', this)
        fail && fail('This token has not implemented ledOff');
    } else {
        this.driver.ledOff(this, win, fail);
    }
};

/**
 * Representational string of class instance.
 * @returns {string}
 */
AnyBoard.BaseToken.prototype.toString = function() {
    return 'Token: ' + this.name + ' (' + this.address + ')';
};

/**
 * @static {object}
 * @property {number} threshold *(default: 10)* sets a threshold on whether or not to log an event. debugLevel will be used instead if threshold is lower.
 * @property {number} debugLevel *(default: 0)* sets a threshold for when a log should be considered a debug log event.
 * @property {number} normalLevel *(default: 10)* sets a threshold for when a log should be considered a normal log event.
 * @property {number} warningLevel *(default: 20)* sets a threshold for when a log should be considered a warning.
 * @property {number} errorLevel *(default: 30)* sets a threshold for when a log should be considered a fatal error.
 * @property {function} loggerObject *(default: console)* logging method. Must have implemented .debug(), .log(), .warn() and .error()
 *
 */
AnyBoard.Logger = {
    threshold: 10,
    debugLevel: 0,
    normalLevel: 10,
    warningLevel: 20,
    errorLevel: 30,
    loggerObject: console,
    /**
     * logs if threshold <= level parameter
     * @param {number} level of severity
     * @param {string} message event to be logged
     * @param {object} sender *(optional)* sender of the message
     */
    message: function(level, message, sender) {
        var messageFormat = 'AnyBoard (' + level + '): ' + message  + (sender ? ' (' + sender + ')' : '');
        if ((this.threshold <= level || this.errorLevel <= level) && this.debugLevel <= level) {
            if (level >= this.errorLevel) {
                this.loggerObject.error && this.loggerObject.error(messageFormat);
            }
            else if (level >= this.warningLevel)
                this.loggerObject.warn && this.loggerObject.warn(messageFormat);
            else if (level >= this.normalLevel)
                this.loggerObject.log && this.loggerObject.log(messageFormat);
            else
                this.loggerObject.debug && this.loggerObject.debug(messageFormat);
        }

        if (typeof hyper !== 'undefined') hyper.log(messageFormat);
    },
    /**
     * logs a warning. Ignored if threshold > this.warningLevel (default: 20)
     * @param {string} message event to be logged
     * @param {object} sender *(optional)* sender of the message
     */
    warn: function(message, sender) {
        this.message(this.warningLevel, message, sender)
    },
    /**
     * logs an error. Will never be ignored.
     * @param {string} message event to be logged
     * @param {object} sender *(optional)* sender of the message
     */
    error: function(message, sender) {
        this.message(this.errorLevel, message, sender)
    },
    /**
     * logs a normal event. Ignored if threshold > this.normalLevel (default: 10)
     * @param {string} message event to be logged
     * @param {object} sender *(optional)* sender of the message
     */
    log: function(message, sender) {
        this.message(this.normalLevel, message, sender)
    },
    /**
     * logs debugging information. Ignored if threshold > this.debugLevel (default: 0)
     * @param {string} message event to be logged
     * @param {object} sender *(optional)* sender of the message
     */
    debug: function(message, sender) {
        this.message(this.debugLevel, message, sender)
    }
};

AnyBoard._isFunction = function(obj) {
    return typeof obj == 'function' || false;
};

AnyBoard._isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
};

AnyBoard._has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
};

AnyBoard._keys = function(obj) {
    if (!AnyBoard._isObject(obj)) return [];
    if (Object.keys) return Object.keys(obj);
    var keys = [];
    for (var key in obj) if (AnyBoard._has(obj, key)) keys.push(key);
    return keys;
};

// Internal recursive comparison function for `isEqual`.
AnyBoard._isEqual = function (a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b !== 'object') return false;
    return AnyBoard._deepEq(a, b, aStack, bStack);
};

// Internal recursive comparison function for `isEqual`.
AnyBoard._deepEq = function (a, b, aStack, bStack) {
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
        // Strings, numbers, regular expressions, dates, and booleans are compared by value.
        case '[object RegExp]':
        // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
        case '[object String]':
            // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
            // equivalent to `new String("5")`.
            return '' + a === '' + b;
        case '[object Number]':
            // `NaN`s are equivalent, but non-reflexive.
            // Object(NaN) is equivalent to NaN
            if (+a !== +a) return +b !== +b;
            // An `egal` comparison is performed for other numeric values.
            return +a === 0 ? 1 / +a === 1 / b : +a === +b;
        case '[object Date]':
        case '[object Boolean]':
            // Coerce dates and booleans to numeric primitive values. Dates are compared by their
            // millisecond representations. Note that invalid dates with millisecond representations
            // of `NaN` are not equivalent.
            return +a === +b;
    }
    var areArrays = className === '[object Array]';
    if (!areArrays) {
        if (typeof a != 'object' || typeof b != 'object') return false;

        // Objects with different constructors are not equivalent, but `Object`s or `Array`s
        // from different frames are.
        var aCtor = a.constructor, bCtor = b.constructor;
        if (aCtor !== bCtor && !(AnyBoard._isFunction(aCtor) && aCtor instanceof aCtor &&
            AnyBoard._isFunction(bCtor) && bCtor instanceof bCtor)
            && ('constructor' in a && 'constructor' in b)) {
            return false;
        }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
        // Linear search. Performance is inversely proportional to the number of
        // unique nested structures.
        if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
        // Compare array lengths to determine if a deep comparison is necessary.
        length = a.length;
        if (length !== b.length) return false;
        // Deep compare the contents, ignoring non-numeric properties.
        while (length--) {
            if (!AnyBoard._isEqual(a[length], b[length], aStack, bStack)) return false;
        }
    } else {
        // Deep compare objects.
        var keys = AnyBoard._keys(a), key;
        length = keys.length;
        // Ensure that both objects contain the same number of properties before comparing deep equality.
        if (AnyBoard._keys(b).length !== length) return false;
        while (length--) {
            // Deep compare each member
            key = keys[length];
            if (!(AnyBoard._has(b, key) && AnyBoard._isEqual(a[key], b[key], aStack, bStack))) return false;
        }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
};
