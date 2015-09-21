"use strict";

/**
 * Global variable AnyBoard.
 * @type {object}
 */
var AnyBoard = AnyBoard || {};

/*
 * Exporting AnyBoard as Node Module if applicable
 */
if (typeof module !== "undefined") module.exports = AnyBoard;

/**
 * This type of callback will be called when card is drawn or played
 * @callback playDrawCallback
 * @param {AnyBoard.Card} card that is played
 * @param {AnyBoard.Player} player that played the card
 * @param {object} [options] *(optional)* custom options as extra parameter when AnyBoard.Player.play was called
 */

/**
 * Type of callback called upon triggering of events
 * @callback simpleEventCallback
 * @param {object} [options] *(optional)* options called with the triggering of that event
 */

/**
 * Type of callback called upon token-token events, i.e. when two tokens interact with eachother, wuch
 * as 'STACK_ON', 'NEXT_TO'
 * @callback tokenTokenEventCallback
 * @param {AnyBoard.BaseToken} initiatingToken token whose interaction with has triggered the event
 * @param {AnyBoard.BaseToken} respondingToken token that initiatingToken has interacted with
 * @param {object} [options] *(optional)* options called with the triggering of that event
 */

/**
 * Type of callback called upon triggering of a Token event, i.e. events triggered by the physical interaction
 * with tokens, such as 'LIFT', 'SHAKE', 'TURN'
 * @callback tokenEventCallback
 * @param {AnyBoard.BaseToken} token token that has been interacted with
 * @param {object} [options] *(optional)* options called with the triggering of that event
 */

/**
 * Type of callback called upon triggering of a Token-Constraint event, i.e. events triggered by the physical interaction
 * of a token upon a constraint, such as 'MOVED_TO'
 * @callback tokenConstraintEventCallback
 * @param {AnyBoard.BaseToken} token token that triggered the event
 * @param {string} constraint constraint that has been interacted with. Currently only a string representation.
 * @param {object} [options] *(optional)* options called with the triggering of that event
 */

/**
 * Generic callback returning a string param
 * @callback stdStringCallback
 * @param {string} string
 */

/**
 * Generic callback returning a bool param
 * @callback stdBoolCallback
 * @param {boolean} boolean
 */

/**
 * Generic callback without params
 * @callback stdNoParamCallback
 */

/**
 * Type of callback called upon detecting a token
 * @callback onScanCallback
 * @param {AnyBoard.BaseToken} token discovered token
 */

/**
 * This type of callback will be called upon failure to complete a function
 * @callback stdErrorCallback
 * @param {string} errorMessage
 */


/**
 * Manager of drivers.
 * @type {Object}
 */
AnyBoard.Drivers = {
    drivers: {}
};

/**
 * Returns driver with given name
 * @example
 * var discoveryBluetooth = new AnyBoard.Driver({
        name: 'theTardisMachine',
        description: 'bla bla',
        version: '1.0',
        type: ['bluetooth-discovery', 'bluetooth'],
        compatibility: ['tardis', 'pancakes']
    });
 *
 * // Returns undefined
 * AnyBoard.Drivers.get("non-existant-driver")
 *
 * // Returns driver
 * AnyBoard.Drivers.get("theTardisMachine")
 * @param {string} name name of driver
 * @returns {AnyBoard.Driver|undefined} driver with given name (or undefined if non-existent)
 */
AnyBoard.Drivers.get = function(name) {
    return this.drivers[name];
};

/**
 * Returns first driver of certain type that matches the given compatibility.
 * @example
 * var discoveryBluetooth = new AnyBoard.Driver({
        name: 'theTardisMachine',
        description: 'bla bla',
        version: '1.0',
        type: ['bluetooth-discovery', 'bluetooth'],
        compatibility: ['tardis', {"show": "Doctor Who"}]
    });
 *
 * // Returns undefined (right type, wrong compatibility)
 * AnyBoard.Drivers.getCompatibleDriver('bluetooth', 'weirdCompatibility');
 *
 * // Returns undefined (wrong type, right compatibility)
 * AnyBoard.Drivers.getCompatibleDriver('HTTP, {"service": "iCanTypeAnyThingHere"});
 *
 * // Returns discoveryBluetooth driver
 * AnyBoard.Drivers.getCompatibleDriver('bluetooth', 'tardis');
 *
 * @param {string} type name of driver
 * @param {string|object} compatibility name of driver
 * @returns {AnyBoard.Driver} compatible driver (or undefined if non-existent)
 *
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
                    if (AnyBoard.Utils.isEqual(compatibility, driver.compatibility[index]))
                        return driver;
            }
        } else if (AnyBoard.Utils.isEqual(compatibility, driver.compatibility)) {
            return driver;
        }

    }
    return undefined;
};

/**
 * Internal function. Drivers added with this function are retrievable with get function.
 * New drivers are added automatically upon construction with new AnyBoard.Driver(...)
 * @param {AnyBoard.Driver} driver driver to be added
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

/** Represents a single Driver, e.g. for spesific token or bluetooth discovery
 * @constructor
 * @param {object} options options for the driver
 * @param {string} options.name name of the driver
 * @param {string} options.description description of the driver
 * @param {string} options.version version of the driver
 * @param {string} options.type Type of driver, e.g. "bluetooth"
 * @param {Array|object|string} options.compatibility An object or string that can be used to deduce compatibiity, or
 *      an array of different compatibilies. How this is used is determined by the set standard driver on TokenManager
 *      that handles scanning for and connecting to tokens.
 * @param {string} [options.dependencies] *(optional)* What if anything the driver depends on.
 * @param {string} [options.date] *(optional)* Date upon release/last build.
 * @param {any} options.yourAttributeHere custom attributes, as well as specified ones, are all placed in
 *      driver.properties. E.g. 'heat' would be placed in driver.properties.heat.
 * @property {string} name name of the driver
 * @property {string} description description of the driver
 * @property {string} version version of the driver
 * @property {string} dependencies Text describing what, if anything, the driver depends on.
 * @property {string} date Date upon release/last build.
 * @property {Array} type Array of string describing    Type of driver, e.g. "bluetooth"
 * @property {Array|object|string} compatibility An object or string that can be used to deduce compatibiity, or
 *      an array of different compatibilies.
 * @property {object} properties dictionary that holds custom attributes
 */
AnyBoard.Driver = function(options) {
    if (!options.name || !options.description || !options.version || !options.type || !options.compatibility) {
        AnyBoard.Logger.warn(
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
 * @param {object} jsonDeck loaded JSON file. See [examples/deck-loading/](./examples/deck-loading) for JSON format and loading.
 * @property {string} name name of Deck.
 * @property {Array.<AnyBoard.Card>} cards complete set of cards in the deck
 * @property {Array.<AnyBoard.Card>} pile remaining cards in this pile
 * @property {Array.<AnyBoard.Card>} usedPile cards played from this deck
 * @property {boolean} autoUsedRefill *(default: true)* whether or not to automatically refill pile from usedPile when empty. Is ignored if autoNewRefill is true.
 * @property {boolean} autoNewRefill *(default: false)* whether or not to automatically refill pile with a whole new deck when empty.
 * @property {Array.<playDrawCallback>} playListeners holds functions to be called when cards in this deck are played
 * @property {Array.<playDrawCallback>} drawListeners holds functions to be called when cards in this deck are drawn
 *
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

    this._initiate(jsonDeck);
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
 * Pile is automatically shuffled upon construction, and upon initiate().
 * New cards added upon refill() are also automatically shuffled.
 */
AnyBoard.Deck.prototype.shuffle = function() {
    for(var j, x, i = this.pile.length; i; j = Math.floor(Math.random() * i), x = this.pile[--i], this.pile[i] = this.pile[j], this.pile[j] = x);
};

/**
 * Reads Deck from jsonObject and provides a shuffled version in pile.
 * Is automatically called upon constructing a deck.
 * @param {object} jsonDeck loaded json file. See [examples-folder](./examples) for example of json file and loading
 * @private
 */
AnyBoard.Deck.prototype._initiate = function(jsonDeck) {
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
 * @param {boolean} [newDeck=false] True if to refill with a new deck.
 * False if to refill with played cards (from usedPile)
 */
AnyBoard.Deck.prototype.refill = function(newDeck) {
    var tmp = this.pile.slice();
    if (newDeck)
        this.pile = this.cards.slice();
    else
        this.pile = this.usedPile.slice();
    if (this.pile.length === 0)
        AnyBoard.Logger.debug("Can't refill Deck. No cards to refill with.", this);
    else
        AnyBoard.Logger.debug("Refilling Deck with " + (newDeck ? "new cards" : "used pile.", this));
    this.shuffle();
    this.pile.concat(tmp);
    if (!newDeck)
        this.usedPile = [];
};

/**
 * Internal function! Use player.draw(deck) instead.
 * Draws a card from the deck.
 * Refills pile if autoNewRefill or autoUsedRefill is true.
 * @param {AnyBoard.Player} player player that draws the card
 * @param {object} [options] *(optional)* custom options sent to drawListeners
 * @returns {AnyBoard.Card} card card that is drawn, or undefined if pile is empty and autoRefill properties are false.
 * @private
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
    if (card) {

        for (var deckCallback in this.drawListeners) {
            if (this.drawListeners.hasOwnProperty(deckCallback))
                this.drawListeners[deckCallback](card, player, options)
        }

        for (var cardCallback in card.drawListeners) {
            if (card.drawListeners.hasOwnProperty(cardCallback))
                card.drawListeners[cardCallback](card, player, options)
        }
    }
    else {
        // out of cards, and couldn't refill. Could potentially trigger an event.
    }

    return card;
};

/**
 * Adds functions to be executed upon all Cards in this Deck.
 * @param {playDrawCallback} func callback function to be executed upon play of card from this deck
 */
AnyBoard.Deck.prototype.onPlay = function(func) {
    AnyBoard.Logger.debug("Adds a new playListener", this);
    this.playListeners.push(func);
};

/**
 * Adds functions to be executed upon draw of Card from this Deck
 * @param {playDrawCallback} callback function to be executed with the 3 parameters AnyBoard.Card, AnyBoard.Player, (options) when cards are drawn
 */
AnyBoard.Deck.prototype.onDraw = function(callback) {
    AnyBoard.Logger.debug("Adds function to drawListener of deck " + this.name);
    this.drawListeners.push(callback);
};

/**
 * Sting representation of a deck
 * @returns {string}
 */
AnyBoard.Deck.prototype.toString = function() {
    return 'Deck: ' + this.name;
};

/** Represents a single Card
 * Should be instantiated in bulk by calling the deck constructor
 * @constructor
 * @param {AnyBoard.Deck} deck deck to which the card belongs
 * @param {object} options options for the card
 * @param {string} options.title title of the card.
 * @param {string} options.description description for the Card
 * @param {string} [options.color] *(optional)* color of the Card
 * @param {string} [options.category] *(optional)* category of the card, not used by AnyBoard FrameWork
 * @param {number} [options.value] *(optional)* value of the card, not used by AnyBoard FrameWork
 * @param {string} [options.type] *(optional)* type of the card, not used by AnyBoard FrameWork
 * @param {number} [options.amount=1] amount of this card in the deck
 * @param {any} [options.yourAttributeHere] custom attributes, as well as specified ones, are all placed in card.properties. E.g. 'heat' would be placed in card.properties.heat.
 * @property {string} title title of the card.
 * @property {string} description description for the Card
 * @property {string} color color of the Card
 * @property {string} category category of the card, not used by AnyBoard FrameWork
 * @property {number} value value of the card, not used by AnyBoard FrameWork
 * @property {string} type type of the card, not used by AnyBoard FrameWork
 * @property {number} amount amount of this card its deck
 * @property {AnyBoard.Deck} deck deck that this card belongs to
 * @property {Array.<playDrawCallback>} playListeners holds functions to be called upon play of this spesific card (before potential playListeners on its belonging deck)
 * @property {Array.<playDrawCallback>} drawListeners holds functions to be called upon draw of this spesific card (before potential drawListeners on its belonging deck)
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
    this.playListeners = [];
    this.drawListeners = [];

    this.properties = options;
    this.deck = deck;

    AnyBoard.Card.all[this.id] = this;
    if (AnyBoard.Card.allTitle[this.title])
        AnyBoard.Logger.warn("Card with title " + this.title + " already exists. Old card will no longer be available " +
            "through AnyBoard.Card.get", this);
    AnyBoard.Card.allTitle[this.title] = this;
};

// Internal: Provides a unique ID for each card. Could be clojured inside the constructor instead of leaving it hanging out here.
AnyBoard.Card.COUNTER = 0;
AnyBoard.Card.AUTO_INC = function() {
    return ++AnyBoard.Card.COUNTER;
};

// Internal: Holds all cards by id
AnyBoard.Card.all = {};

// Internal: Holds all cards by title
AnyBoard.Card.allTitle = {};

/**
 * Returns card with given id
 * @param {number|string} cardTitleOrID id or title of card
 * @returns {AnyBoard.Card} card with given id (or undefined if non-existent)
 */
AnyBoard.Card.get = function(cardTitleOrID) {
    if (isNaN(cardTitleOrID))
        return AnyBoard.Card.allTitle[cardTitleOrID];
    return AnyBoard.Card.all[cardTitleOrID];
};

/**
 * Adds functions to be executed upon a play of this card
 * @param {playDrawCallback} func callback function to be executed upon play of card from this deck
 */
AnyBoard.Card.prototype.onPlay = function(func) {
    AnyBoard.Logger.debug("Adds a new playListener", this);
    this.playListeners.push(func);
};

/**
 * Adds functions to be executed upon a draw of this card
 * @param {playDrawCallback} callback function to be executed upon play of card from this deck
 */
AnyBoard.Card.prototype.onDraw = function(callback) {
    AnyBoard.Logger.debug("Adds a new drawListener", this);
    this.drawListeners.push(callback);
};

/**
 * Internal function! Use player.play(card) instead.
 * Call in order to play a card. This will ensure any listeners are informed of the play and put the card in the usedPile of its belonging deck.
 * @param {AnyBoard.Player} player the player that does the play
 * @param {object} options custom options/properties
 * @private
 */
AnyBoard.Card.prototype._play = function(player, options) {
    this.deck.usedPile.push(this);

    for (var cardCallback in this.playListeners) {
        if (this.playListeners.hasOwnProperty(cardCallback))
            this.playListeners[cardCallback](this, player, options)
    }

    for (var deckCallback in this.deck.playListeners) {
        if (this.deck.playListeners.hasOwnProperty(deckCallback))
            this.deck.playListeners[deckCallback](this, player, options)
    }
};

/**
 * Returns a string representation of the card.
 * @returns {string}
 */
AnyBoard.Card.prototype.toString = function() {
    return 'Card: ' + this.title + ', id: ' + this.id;
};
/** Represents a set of game dices that can be rolled to retrieve a random result.
 * @constructor
 * @param {number} [eyes=6] number of max eyes on a roll with this dice
 * @param {number} [numOfDice=1] number of dices
 * @example
 * // will create 1 dice, with 6 eyes
 * var dice = new AnyBoard.Dice();
 *
 * // will create 2 dice, with 18 eyes
 * var dice = new AnyBoard.Dice(18, 2);
 */
AnyBoard.Dice = function (eyes, numOfDice) {
    this.eyes = eyes || 6;
    this.numOfDice = numOfDice || 1;
};

/**
 * Roll the dices and returns a the sum
 * @returns {number} combined result of rolls for all dices
 * @example
 * var dice = new AnyBoard.Dice();
 *
 * // returns random number between 1 and 6
 * dice.roll()
 *
 * @example
 * var dice = new AnyBoard.Dice(12, 2);
 *
 * // returns random number between 2 and 24
 * dice.roll()
 */
AnyBoard.Dice.prototype.roll = function() {
    var res = 0;
    for (var i = 0; i < this.numOfDice; i++)
        res += Math.floor(Math.random()*this.eyes)+1;
    return res;
};

/**
 * Roll the dices and returns an array of results for each dice
 * @returns {Array} list of results for each dice
 * @example
 * var dice = new AnyBoard.Dice(8, 2);
 *
 * // returns an Array of numbers
 * var resultArray = dice.rollEach()
 *
 * // result of first dice, between 1-8
 * resultArray[0]
 *
 * // result of second dice, between 1-8
 * resultArray[1]
 */
AnyBoard.Dice.prototype.rollEach = function() {
    var res = [];
    for (var i = 0; i < this.numOfDice; i++)
        res.push(Math.floor(Math.random()*this.eyes)+1);
    return res;
};

/** Represents a Player (AnyBoard.Player)
 * @constructor
 * @param {string} name name of the player
 * @param {object} [options] *(optional)* options for the player
 * @param {string} [options.color] *(optional)* color representing the player
 * @param {string} [options.faction] *(optional)* faction representing the player
 * @param {string} [options.class] *(optional)* class representing the player
 * @param {any} [options.yourAttributeHere] *(optional)* custom attributes, as well as specified ones, are all placed in player.properties. E.g. 'age' would be placed in player.properties.age.
 * @property {AnyBoard.Hand} hand hand of cards (Quests)
 * @property {string} faction faction (Sp[ecial abilities or perks)
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
 * @param {AnyBoard.Player} [receivingPlayer] *(optional)* Who shall receive the resources. Omit if not to anyone (e.g. give to "the bank")
 * @returns {boolean} whether or not transaction was completed (false if Player don't hold enough resources)
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
 * @param {AnyBoard.Player} [player] *(optional)* Who shall be traded with. Omit if not to a player, but to "the bank".
 * @returns {boolean} whether or not transaction was completed (false if Player don't hold enough resources)
 * @example
 * new AnyBoard.Resource("gold");
 * new AnyBoard.Resource("silver");
 *
 * var startTreasure = new AnyBoard.ResourceSet({"gold": 6, "silver": 42});
 * var goldTreasure = new AnyBoard.ResourceSet({"gold": 2});
 * var silverTreasure = new AnyBoard.ResourceSet({"silver": 12});
 *
 * var dr1 = new AnyBoard.Player("firstDoctor");
 * var dr2 = new AnyBoard.Player("secondDoctor");
 *
 * dr1.receive(startTreasure);
 * dr2.receive(startTreasure);
 *
 * // returns true. dr1 will now own {"gold": 4, "silver": 54}. dr2 owns {"gold": 8, "silver": 30}
 * dr1.trade(goldTreasure, silverTreasure, dr2)
 *
 * @example
 * // returns true. dr1 will now own {"gold": 2, "silver": 66}. dr2 still owns {"gold": 8, "silver": 30}
 * dr1.trade(goldTreasure, silverTreasure)
 *
 * @example
 * var firstOverlappingTreasure = new AnyBoard.ResourceSet({"silver": 115, "gold": "6"});
 * var secondOverlappingTreasure= new AnyBoard.ResourceSet({"silver": 100, "gold": "7"});
 *
 * // returns true. The trade nullifies the similarities, so that the trade can go through even though
 * //     dr1 has < 100 silver
 * dr1.trade(firstOverlappingTreasure, secondOverlappingTreasure)
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
 * @example
 * new AnyBoard.Resource("gold");
 * new AnyBoard.Resource("silver");
 *
 * var startTreasure = new AnyBoard.ResourceSet({"gold": 6, "silver": 42});
 * var secondTresure = new AnyBoard.ResourceSet({"silver": 12, "copper": 122});
 *
 * var dr1 = new AnyBoard.Player("firstDoctor");  // player owns nothing initially
 *
 * dr1.receive(startTreasure);  // owns {"gold": 6, "silver": 42}
 * dr1.receive(secondTresure);  // owns {"gold": 6, "silver": 54, "copper": 122}
 */
AnyBoard.Player.prototype.recieve = function(resourceSet) {
    AnyBoard.Logger.debug("Received " + resourceSet.resources, this);
    this.bank.add(resourceSet)
};

/**
 * Draws a card from a deck and puts it in the hand of the player
 * @param {AnyBoard.Deck} deck deck to be drawn from
 * @param {object} [options] *(optional)* parameters to be sent to the drawListeners on the deck
 * @returns {AnyBoard.Card} card that is drawn
 * @example
 * var dr1 = new AnyBoard.Player("firstDoctor");  // player has no cards initially
 *
 * // Now has one card
 * dr1.draw(deck);
 *
 * // Now has two cards. option parameter is being passed on to any drawListeners (See Deck/Card)
 * dr1.draw(deck, options);
 */
AnyBoard.Player.prototype.draw = function(deck, options) {
    var card = deck._draw(this, options);
    if (!card) {
        AnyBoard.Logger.debug("Can't draw from empty deck " + deck, this);
    }
    else {
        this.hand._add(card);
        AnyBoard.Logger.debug("Drew " + card+ " from deck " + deck, this);
    }
    return card;
};

/**
 * Plays a card from the hand. If the hand does not contain the card, the card is not played and the hand unchanged.
 * @param {AnyBoard.Card} card card to be played
 * @param {object} [customOptions] *(optional)* custom options that the play should be played with
 * @returns {boolean} whether or not the card was played
 * @example
 * var DrWho = new AnyBoard.Player("firstDoctor");  // player has no cards initially
 *
 * // Store the card that was drawn
 * var card = DrWho.draw(existingDeck);
 *
 * // Play that same card
 * DrWho.play(card)
 */
AnyBoard.Player.prototype.play = function(card, customOptions) {
    if (!this.hand.has(card)) {
        return false;
    }
    AnyBoard.Logger.debug("Plays card " + card.title, this);
    this.hand.cards[card.id] -= 1;
    card._play(this, customOptions);
    return true;
};

/**
 * Returns a string representation of the player
 * @returns {string}
 */
AnyBoard.Player.prototype.toString = function() {
    return 'Player: ' + this.name;
};

/**
 * Represents a Hand of a player, containing cards. Players are given one Hand in Person constructor.
 * @param {AnyBoard.Player} player player to which this hand belongs
 * @param {object} [options] *(optional)* custom properties added to this hand
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
 * @param {number} [amount=1] amount of card to be checked if is in hand
 * @returns {boolean} hasCard whether or not the player has that amount or more of that card in this hand
 *
 * @example
 * var DrWho = new AnyBoard.Player("firstDoctor");  // player has no cards initially
 *
 * // Store the card that was drawn
 * var tardis = DrWho.draw(tardisDeck);
 *
 * // returns true
 * DrWho.hand.has(card)
 *
 * // returns false, as he has only one
 * DrWho.hand.has(card, 3)
 */
AnyBoard.Hand.prototype.has = function(card, amount) {
    amount = amount || 1;
    if (this.cards[card.id] && this.cards[card.id] >= amount) {
        return true;
    }
    return false;
};

/**
 * Internal function! Use player.draw(deck) instead.
 * Adds a card to the hand of a player
 * @param {AnyBoard.Card} card card to be added to this hand
 * @private
 */
AnyBoard.Hand.prototype._add = function(card) {
    if (!this.cards[card.id])
        this.cards[card.id] = 0;
    this.cards[card.id] += 1;
};

/**
 * Discard the entire hand of the player, leaving him with no cards
 */
AnyBoard.Hand.prototype.discardHand = function() {
    for (var cardId in this.cards) {
        if (this.cards.hasOwnProperty(cardId))
            for (var i = 0; i < this.cards[cardId];)
                this.discardCard(AnyBoard.Card.get(cardId));
    }
};

/**
 * Discard a card from the hand of the player
 * @param {AnyBoard.Card} card card to be discarded.
 */
AnyBoard.Hand.prototype.discardCard = function(card) {
    AnyBoard.Logger.debug("Discarding card " + card, this.player);
    if (!this.cards[card.id] || this.cards[card.id] === 0) return;
    card.deck.usedPile.push(card);
    this.cards[card.id] -= 1;
};

/**
 * Returns a string representation of the hand
 * @returns {string}
 */
AnyBoard.Hand.prototype.toString = function() {
    return 'Hand (' + (this.player ? this.player.name : 'no one') + ')';
};



/**
 * Represents a simple resource (AnyBoard.Resource)
 * @constructor
 * @param {string} name name representing the resource
 * @param {object} [properties] *(optional)* custom properties of this resource
 * @property {string} name name of resource
 * @property {any} properties custom options added to resource
 * @example
 * var simpleGold = new AnyBoard.Resource("gold");
 *
 * // The optional properties parameter can be of any type.
 * var advancedPowder = new AnyBoard.Resource("powder", {"value": 6, "color": "blue"});
 *
 * // 6
 * advancedPowder.properties.value
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
 * @example
 * var simpleGold = new AnyBoard.Resource("gold");
 *
 * // returns simpleGold
 * AnyBoard.Resource.get("gold");
 */
AnyBoard.Resource.get = function(name) {
    return AnyBoard.Resource.all[name]
};

/**
 * Creates a ResourceSet
 * @constructor
 * @param {object} [resources] *(optional)* a set of initially contained resources
 * @param {boolean} [allowNegative=false] whether or not to allow being subtracted resources to below 0 (dept)
 * @property {object} [resources] *(optional)* a set of initially contained resources
 * @property {boolean} [allowNegative=false] whether or not to allow being subtracted resources to below 0 (dept)
 *
 * @example
 * // Returns a resourceset that can be deducted below 0
 * var debtBank = new AnyBoard.ResourceSet({}, true);
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
 * @example
 * new AnyBoard.Resource("gold");
 * new AnyBoard.Resource("silver");
 *
 * var myTreasure = new AnyBoard.ResourceSet({"gold": 6, "silver": 42});
 * var minorDebt = new AnyBoard.ResourceSet({"gold": 1, "silver": 3});
 * var hugeDebt = new AnyBoard.ResourceSet({"gold": 12, "silver": 41});
 *
 * // returns true
 * myTreasure.contains(minorDebt);
 *
 * // returns false
 * myTreasure.contains(hugeDebt);
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
 * @example
 * new AnyBoard.Resource("gold");
 * new AnyBoard.Resource("silver");
 *
 * var myTreasure = new AnyBoard.ResourceSet({"gold": 6, "silver": 42});
 * var minorGift = new AnyBoard.ResourceSet({"silver": 2});
 *
 * myTreasure.add(minorGift);
 * // myTreasure is now {"gold": 6, "silver": 45}
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
 * @example
 * new AnyBoard.Resource("gold");
 * new AnyBoard.Resource("silver");
 *
 * var myTreasure = new AnyBoard.ResourceSet({"gold": 6, "silver": 42});
 * var minorGift = new AnyBoard.ResourceSet({"silver": 2});
 * var debtBank = new AnyBoard.ResourceSet({}, true);
 * var cosyBank = new AnyBoard.ResourceSet();
 *
 * // returns true. myTreasure becomes {"gold": 6, "silver": 40}
 * myTreasure.subtract(minorGift);
 *
 * // returns true. debtbank becomes {"silver": -2}
 * debtBank.subtract(minorGift);
 *
 * // returns false and leaves cosyBank unchanged
 * cosyBank.subtract(minorGift);
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
 * @example
 * new AnyBoard.Resource("gold");
 * new AnyBoard.Resource("silver");
 *
 * var myTreasure = new AnyBoard.ResourceSet({"gold": 6, "silver": 42});
 * var otherTresure = new AnyBoard.ResourceSet({"silver": 2, "bacon": 12});
 *
 * // returns {"silver": 2}
 * myTreasure.similarities(otherTresure);
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
 * A token manager. Holds all tokens. Discovers and connects to them.
 * @static
 * @property {object} tokens dictionary of connect tokens that maps id to object
 * @property {AnyBoard.Driver} driver driver for communication with tokens. Set with setDriver(driver);
 */
AnyBoard.TokenManager = {
    tokens: {},
    driver: null,
    listeners: {
        tokenEvent: {},
        onceTokenEvent: {},
        tokenTokenEvent: {},
        onceTokenTokenEvent: {},
        tokenConstraintEvent: {},
        onceTokenConstraintEvent: {}
    }
};

/**
 * Sets a new default driver to handle communication for tokens without specified driver.
 * The driver must have implemented methods *scan(win, fail, timeout) connect(token, win, fail) and
 * disconnect(token, win, fail)*, in order to discover tokens.
 *
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
 * @param {onScanCallback} [win] *(optional)* function to be executed when devices are found (called for each device found)
 * @param {stdErrorCallback} [fail] *(optional)* function to be executed upon failure
 * @param {number} [timeout] *(optional)* amount of milliseconds to scan before stopping. Driver has a default.
 * @example
 * var onDiscover = function(token) { console.log("I found " + token) };
 *
 * // Scans for tokens. For every token found, it prints "I found ...")
 * TokenManager.scan(onDiscover);
 */
AnyBoard.TokenManager.scan = function(win, fail, timeout) {
    this.driver.scan(
        function(token) {
            AnyBoard.TokenManager.tokens[token.address] = token;
            win && win(token);
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
 * Adds a callbackFunction to be executed always when a token-token event is triggered
 * @param {string} eventName name of event to listen to
 * @param {tokenTokenEventCallback} callbackFunction function to be executed
 * @example
 * var cb = function (initToken, resToken, event, options) {
 *      console.log(initToken + " " + event + " " + resToken);
 * };
 *
 * TokenManager.onTokenTokenEvent("MOVE_NEXT_TO", cb);
 *
 * // prints "existingToken MOVE_NEXT_TO anotherToken";
 * existingToken.trigger("MOVE_NEXT_TO", {"meta-eventType": "token", "token": anotherToken};
 *
 * // prints "existingToken MOVE_NEXT_TO oldToken";
 * existingToken.trigger("MOVE_NEXT_TO", {"meta-eventType": "token", "token": anotherToken};
 */
AnyBoard.TokenManager.onTokenTokenEvent = function(eventName, callbackFunction) {
    AnyBoard.Logger.debug('Added listener to TT-event: ' + eventName, this);
    if (!this.listeners.tokenTokenEvent[eventName])
        this.listeners.tokenTokenEvent[eventName] = [];
    this.listeners.tokenTokenEvent[eventName].push(callbackFunction);
};

/**
 * Adds a callbackFunction to be executed next time a token-token event is triggered
 * @param {string} eventName name of event to listen to
 * @param {tokenTokenEventCallback} callbackFunction function to be executed
 * @example
 * var cb = function (initToken, resToken, event, options) {
 *      console.log(initToken + " " + event + " " + resToken);
 * };
 *
 * TokenManager.onceTokenTokenEvent("MOVE_NEXT_TO", cb);
 *
 * // prints "existingToken MOVE_NEXT_TO anotherToken";
 * existingToken.trigger("MOVE_NEXT_TO", {"meta-eventType": "token-token", "token": anotherToken};
 *
 * // no effect
 * existingToken.trigger("MOVE_NEXT_TO", {"meta-eventType": "token-token", "token": anotherToken};
 */
AnyBoard.TokenManager.onceTokenTokenEvent = function(eventName, callbackFunction) {
    AnyBoard.Logger.debug('Added onceListener to TT-event: ' + eventName, this);
    if (!this.listeners.onceTokenTokenEvent[eventName])
        this.listeners.onceTokenTokenEvent[eventName] = [];
    this.listeners.onceTokenTokenEvent[eventName].push(callbackFunction);
};

/**
 * Adds a callbackFunction to be executed always when a token-constraint event is triggered.
 * A token-constraint event is a physical token interaction with a game constraint, e.g. moving a pawn within a board.
 * @param {string} eventName name of event to listen to
 * @param {tokenConstraintEventCallback} callbackFunction function to be executed
 * @example
 * var cb = function (initToken, constraint, event, options) {
 *      console.log(initToken + " " + event + " " + constraint);
 * };
 *
 * TokenManager.onTokenConstraintEvent("MOVE", cb);
 *
 * // prints "existingToken MOVE Tile-5";
 * existingToken.trigger("MOVE", {"meta-eventType": "token-constraint", "constraint": "Tile-5"};
 *
 * // prints "existingToken MOVE Tile-5";
 * existingToken.trigger("MOVE", {"meta-eventType": "token-constraint", "constraint": "Tile-5"};
 */
AnyBoard.TokenManager.onTokenConstraintEvent = function(eventName, callbackFunction) {
    AnyBoard.Logger.debug('Added listener to TC-event: ' + eventName, this);
    if (!this.listeners.tokenConstraintEvent[eventName])
        this.listeners.tokenConstraintEvent[eventName] = [];
    this.listeners.tokenConstraintEvent[eventName].push(callbackFunction);
};

/**
 * Adds a callbackFunction to be executed next time a token-constraint event is triggered
 * @param {string} eventName name of event to listen to
 * @param {tokenConstraintEventCallback} callbackFunction function to be executed
 * @example
 * var cb = function (initToken, constraint, event, options) {
 *      console.log(initToken + " " + event + " " + constraint);
 * };
 *
 * TokenManager.onceTokenConstraintEvent("MOVE", cb);
 *
 * // prints "existingToken MOVE Tile-5";
 * existingToken.trigger("MOVE", {"meta-eventType": "token-constraint"", "constraint": "Tile-5"};
 *
 * // no effect
 * existingToken.trigger("MOVE", {"meta-eventType": "token-constraint""};
 */
AnyBoard.TokenManager.onceTokenConstraintEvent = function(eventName, callbackFunction) {
    AnyBoard.Logger.debug('Added onceListener to TC-event: ' + eventName, this);
    if (!this.listeners.onceTokenConstraintEvent[eventName])
        this.listeners.onceTokenConstraintEvent[eventName] = [];
    this.listeners.onceTokenConstraintEvent[eventName].push(callbackFunction);
};

/**
 * Adds a callbackFunction to be executed always when a token event is triggered.
 * A token event is an physical interaction with a single token.
 * @param {string} eventName name of event to listen to
 * @param {tokenEventCallback} callbackFunction function to be executed
 * @example
 * var cb = function (initToken, event, options) {
 *      console.log(initToken + " was " + event + "'ed ");
 * };
 *
 * TokenManager.onTokenEvent("LIFT", cb);
 *
 * // prints "existingToken was LIFT'ed"
 * existingToken.trigger("LIFT", {"meta-eventType": "token"};
 *
 * // prints "existingToken was LIFT'ed"
 * existingToken.trigger("LIFT", {"meta-eventType": "token"};
 */
AnyBoard.TokenManager.onTokenEvent = function(eventName, callbackFunction) {
    AnyBoard.Logger.debug('Added listener to T-event: ' + eventName, this);
    if (!this.listeners.tokenEvent[eventName])
        this.listeners.tokenEvent[eventName] = [];
    this.listeners.tokenEvent[eventName].push(callbackFunction);
};

/**
 * Adds a callbackFunction to be executed next time a token event is triggered
 * @param {string} eventName name of event to listen to
 * @param {tokenEventCallback} callbackFunction function to be executed
 * @example
 * var cb = function (initToken, event, options) {
 *      console.log(initToken + " was " + event + "'ed ");
 * };
 *
 * TokenManager.onceTokenEvent("LIFT", cb);
 *
 * // prints "existingToken was LIFT'ed"
 * existingToken.trigger("LIFT", {"meta-eventType": "token"};
 *
 * // No effect
 * existingToken.trigger('LIFT');
 */
AnyBoard.TokenManager.onceTokenEvent = function(eventName, callbackFunction) {
    AnyBoard.Logger.debug('Added onceListener to T-event: ' + eventName, this);
    if (!this.listeners.onceTokenEvent[eventName])
        this.listeners.onceTokenEvent[eventName] = [];
    this.listeners.onceTokenEvent[eventName].push(callbackFunction);
};


/**
 * Base class for tokens. Should be used by communication driver upon AnyBoard.TokenManager.scan()
 * @param {string} name name of the token
 * @param {string} address address of the token found when scanned
 * @param {object} device device object used and handled by driver
 * @param {AnyBoard.Driver} [driver=AnyBoard.BaseToken._defaultDriver] token driver for handling communication with it.
 * @property {string} name name of the token
 * @property {string} address address of the token found when scanned
 * @property {boolean} connected whether or not the token is connected
 * @property {object} device driver spesific data.
 * @property {object} listeners functions to be executed upon certain triggered events
 * @property {object} onceListeners functions to be executed upon the next triggering of a certain (only once).
 * @property {Array.<Function>} sendQueue queue for communicating with
 * @property {object} cache key-value store for caching certain communication calls
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
    this.cache = {};
    this.driver = driver || AnyBoard.BaseToken._defaultDriver;
};

AnyBoard.BaseToken._defaultDriver = {};

/**
 * Sets a new default driver to handle communication for tokens without specified driver.
 * The driver must have implement a method *send(win, fail)* in order to discover tokens.
 *
 * @param {AnyBoard.Driver} driver driver to be used for communication
 * @returns {boolean} whether or not driver was successfully set
 */
AnyBoard.BaseToken.setDefaultDriver = function(driver) {
    if (driver.send && typeof driver.send === 'function') {
        AnyBoard.BaseToken._defaultDriver = driver;
        return true;
    }
    AnyBoard.Logger.warn('Could not find send() on given driver', this);
    return false;
};

/**
 * Sets driver for the token.
 * @param driver
 */
AnyBoard.BaseToken.prototype.setDriver = function(driver){
    if (driver && driver.send && typeof driver.send === 'function')
        this.driver = driver;
    else
        AnyBoard.Logger.warn('Could not find send() on given driver', this);
};

/**
 * Returns whether or not the token is connected
 * @returns {boolean} true if connected, else false
 */
AnyBoard.BaseToken.prototype.isConnected = function() {
    return this.connected;
};

/**
 * Attempts to connect to token. Uses TokenManager driver, not its own, since connect
 *      needs to happen before determining suitable driver.
 * @param {stdNoParamCallback} [win] *(optional)* function to be executed upon success
 * @param {stdErrorCallback} [fail] *(optional)* function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.connect = function(win, fail) {
    AnyBoard.Logger.debug('Attempting to connect to ' + this);
    var self = this;
    AnyBoard.TokenManager.driver.connect(
        self,
        function(device) {
            AnyBoard.Logger.debug('Connected to ' + self);
            self.connected = true;
            self.trigger('connect', {device: self});
            win && win();
        },
        function(errorCode) {
            AnyBoard.Logger.debug('Could not connect to ' + self + '. ' + errorCode);
            self.trigger('disconnect', {device: self});
            self.connected = false;
            fail && fail(errorCode);
        }
    );
};

/**
 * Disconnects from the token.
 */
AnyBoard.BaseToken.prototype.disconnect = function() {
    AnyBoard.TokenManager.driver.disconnect(this);
    AnyBoard.Logger.debug('' + this + ' disconnected', this);
    this.connected = false;
    this.trigger('disconnect', {device: this});
};

/**
 * Trigger an event on a token. Also used to trigger special events (Token, Token-Token and Token-Eonstraint-events) by
 * specifying 'meta-eventType' = 'token', 'token-token' or 'token-constraint' in eventOptions.
 * @param {string} eventName name of event
 * @param {object} [eventOptions] (*optional)* dictionary of parameters and values
 * @example
 * var onTimeTravelCallback = function (options) {console.log("The tardis is great!")};
 * existingToken.on('timeTravelled', onTimeTravelCallback);
 *
 * // Triggers the function, and prints praise for the tardis
 * existingToken.trigger('timeTravelled');
 *
 * existingToken.trigger('timeTravelled');  // prints again
 * existingToken.trigger('timeTravelled');  // prints again
 */
AnyBoard.BaseToken.prototype.trigger = function(eventName, eventOptions) {
    AnyBoard.Logger.debug('Triggered "' + eventName + '"', this);

    var baseTrigger = function(dict, event, args) {
        if (dict[event])
            for (var i in dict[event]) {
                if (dict[event].hasOwnProperty(i))
                    dict[event][i].apply(null, args);
            }
    };

    baseTrigger(this.listeners, eventName, [eventOptions]);
    baseTrigger(this.onceListeners, eventName, [eventOptions]);
    this.onceListeners[eventName] = [];

    if (eventOptions.hasOwnProperty('meta-eventType')) {
        if (eventOptions['meta-eventType'] == 'token-token') {
            if (eventOptions.hasOwnProperty('token')) {
                baseTrigger(AnyBoard.TokenManager.listeners.tokenTokenEvent, eventName, [eventOptions.token, eventOptions]);
                baseTrigger(AnyBoard.TokenManager.listeners.onceTokenTokenEvent, eventName, [eventOptions.token, eventOptions]);
                AnyBoard.TokenManager.listeners.onceTokenTokenEvent[eventName] = [];
            } else {
                AnyBoard.warn('Attempting to trigger token-token event type, but missing token option', this);
            }

        } else if (eventOptions['meta-eventType'] == 'token') {
            baseTrigger(AnyBoard.TokenManager.listeners.tokenEvent, eventName, [eventOptions]);
            baseTrigger(AnyBoard.TokenManager.listeners.onceTokenEvent, eventName, [eventOptions]);
            AnyBoard.TokenManager.listeners.onceTokenEvent[eventName] = [];
        } else if (eventOptions['meta-eventType'] == 'token-constraint') {
            if (eventOptions.hasOwnProperty('constraint')) {
                baseTrigger(AnyBoard.TokenManager.listeners.tokenConstraintEvent, eventName, [eventOptions.constraint, eventOptions]);
                baseTrigger(AnyBoard.TokenManager.listeners.onceTokenConstraintEvent, eventName, [eventOptions.constraint, eventOptions]);
                AnyBoard.TokenManager.listeners.onceTokenConstraintEvent[eventName] = [];
            } else {
                AnyBoard.warn('Attempting to trigger token-token event type, but missing constraint option', this);
            }
        } else {
            AnyBoard.warn('Attempting to trigger invalid event type: ' + eventOptions['meta-eventType'], this);
        }
    }
};

/**
 * Adds a callbackFunction to be executed always when event is triggered
 * @param {string} eventName name of event to listen to
 * @param {simpleEventCallback} callbackFunction function to be executed
 * @example
 * var onTimeTravelCallback = function () {console.log("The tardis is great!")};
 * existingToken.on('timeTravelled', onTimeTravelCallback);
 *
 * // Triggers the function, and prints praise for the tardis
 * existingToken.trigger('timeTravelled');
 *
 * existingToken.trigger('timeTravelled');  // prints again
 * existingToken.trigger('timeTravelled');  // prints again
 * @example
 * var onTimeTravelCallback = function (options) {
 *     // Options can be left out of a trigger. You should therefore check
 *     // that input is as expected, throw an error or give a default value
 *     var name = (options && options.name ? options.name : "You're");
  *
 *     console.log(options.name + " is great!");
 * };
 * existingToken.on('timeTravelled', onTimeTravelCallback);
 *
 * // prints "Dr.Who is great!"
 * existingToken.trigger('timeTravelled', {"name": "Dr.Who"});
 *
 * // prints "You're great!"
 * existingToken.trigger('timeTravelled');
 */
AnyBoard.BaseToken.prototype.on = function(eventName, callbackFunction) {
    AnyBoard.Logger.debug('Added listener to event: ' + eventName, this);
    if (!this.listeners[eventName])
        this.listeners[eventName] = [];
    this.listeners[eventName].push(callbackFunction);
};

/**
 * Adds a callbackFunction to be executed next time an event is triggered
 * @param {string} eventName name of event to listen to
 * @param {simpleEventCallback} callbackFunction function to be executed
 * @example
 * var onTimeTravelCallback = function (options) {console.log("The tardis is great!")};
 * existingToken.once('timeTravelled', onTimeTravelCallback);
 *
 * // Triggers the function, and prints praise for the tardis
 * existingToken.trigger('timeTravelled');
 *
 * // No effect
 * existingToken.trigger('timeTravelled');
 */
AnyBoard.BaseToken.prototype.once = function(eventName, callbackFunction) {
    AnyBoard.Logger.debug('Added onceListener to event: ' + eventName, this);
    if (!this.onceListeners[eventName])
        this.onceListeners[eventName] = [];
    this.onceListeners[eventName].push(callbackFunction);
};

/**
 * Sends data to the token. Uses either own driver, or (if not set) TokenManager driver
 * @param {Uint8Array|ArrayBuffer|String} data data to be sent
 * @param {stdNoParamCallback} [win] *(optional)* function to be executed upon success
 * @param {stdErrorCallback} [fail] *(optional)* function to be executed upon error
 */
AnyBoard.BaseToken.prototype.send = function(data, win, fail) {
    AnyBoard.Logger.debug('Attempting to send with data: ' + data, this);
    if (!this.isConnected()) {
        AnyBoard.Logger.warn('Is not connected. Attempting to connect first.', this);
        var self = this;
        this.connect(
            function(device){
                self.send(data, win, fail);
            }, function(errorCode){
                fail && fail(errorCode);
            }
        )
    } else {
        this.driver.send(this, data, win, fail);
    }
};

/**
 * Prints to Token
 *
 * String can have special tokens to signify some printer command, e.g. ##n = newLine.
 * Refer to the individual driver for token spesific implementation and capabilites
 *
 * @param {string} value
 * @param {stdNoParamCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon failure
 *
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
 * @param {stdStringCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon failure
 * @example
 * // Function to be executed upon name retrieval
 * var getNameCallback = function (name) {console.log("Firmware name: " + name)};
 *
 * // Function to be executed upon failure to retrieve name
 * var failGettingNameCallback = function (name) {console.log("Couldn't get name :(")};
 *
 * existingToken.getFirmwareName(getNameCallback, failGettingNameCallback);
 *
 * // Since it's asyncronous, this will be printed before the result
 * console.log("This comes first!")
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
 * @param {stdStringCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon failure
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
 * @param {stdStringCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon failure
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
 * @param {stdBoolCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon failure
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
 * @param {stdBoolCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon failure
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
 * @param {stdBoolCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon failure
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
 * @param {stdBoolCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon failure
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
 * @param {stdBoolCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon failure
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
 * @param {stdBoolCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon failure
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
 * @param {stdBoolCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon failure
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
 * @param {stdBoolCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon failure
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
 * @param {stdBoolCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon failure
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
 * @param {stdNoParamCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon
 * @example
 * // sets Led to white
 * existingToken.ledOn([255, 255, 255]);
 *
 * // sets Led to white (See driver implementation for what colors are supported)
 * existingToken.ledOn("white");
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
 * tells token to blink its led
 * @param {string|Array} value string with color name or array of [red, green, blue] values 0-255
 * @param {stdNoParamCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon
 * @example
 * // blinks red
 * existingToken.ledBlink([255, 0, 0]);
 *
 * // blinks blue
 * existingToken.ledBlink("blue");
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
 * @param {stdNoParamCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon
 */
AnyBoard.BaseToken.prototype.ledOff = function(win, fail) {
    if (!this.driver.hasOwnProperty('ledOff')) {
        AnyBoard.Logger.warn('This token has not implemented ledOff', this);
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
 * Static logger object that handles logging. Will log using hyper.log if hyper is present (when using Evothings).
 * Will then log all events, regardless of severity
 *
 * @static {object}
 * @property {number} threshold *(default: 10)* threshold on whether or not to log an event.
 *      Any message with level above or equal threshold will be logged
 * @property {number} debugLevel *(value: 0)* sets a threshold for when a log should be considered a debug log event.
 * @property {number} normalLevel *(value: 10)* sets a threshold for when a log should be considered a normal log event.
 * @property {number} warningLevel *(value: 20)* sets a threshold for when a log should be considered a warning.
 * @property {number} errorLevel *(value: 30)* sets a threshold for when a log should be considered a fatal error.
 * @property {object} loggerObject *(default: console)* logging method. Must have implemented .debug(), .log(), .warn() and .error()
 */
AnyBoard.Logger = {
    threshold: 10,
    debugLevel: 0,
    normalLevel: 10,
    warningLevel: 20,
    errorLevel: 30,
    loggerObject: console,

    /**
     * Internal method. Logs if threshold <= level parameter
     * @param {number} level of severity
     * @param {string} message event to be logged
     * @param {object} [sender] *(optional)* sender of the message
     * @private
     */
    _message: function(level, message, sender) {
        var messageFormat = 'AnyBoard (' + level + '): ' + message  + (sender ? ' (' + sender + ')' : '');
        if ((this.threshold <= level || this.errorLevel <= level) && this.debugLevel <= level) {
            if (level >= this.errorLevel)
                this.loggerObject.error && this.loggerObject.error(messageFormat);
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
     * @param {object} [sender] *(optional)* sender of the message
     */
    warn: function(message, sender) {
        this._message(this.warningLevel, message, sender)
    },

    /**
     * logs an error. Will never be ignored.
     * @param {string} message event to be logged
     * @param {object} [sender] *(optional)* sender of the message
     */
    error: function(message, sender) {
        this._message(this.errorLevel, message, sender)
    },

    /**
     * logs a normal event. Ignored if threshold > this.normalLevel (default: 10)
     * @param {string} message event to be logged
     * @param {object} [sender] *(optional)* sender of the message
     */
    log: function(message, sender) {
        this._message(this.normalLevel, message, sender)
    },

    /**
     * logs debugging information. Ignored if threshold > this.debugLevel (default: 0)
     * @param {string} message event to be logged
     * @param {object} [sender] *(optional)* sender of the message
     */
    debug: function(message, sender) {
        this._message(this.debugLevel, message, sender)
    },

    /**
     * Sets threshold for logging
     * @param {number} severity a message has to have before being logged
     * @example
     * // By default, debug doesn't log
     * AnyBoard.debug("Hi")  // does not log
     * @example
     * // But you can lower the thresholdlevel
     * AnyBoard.Logger.setThreshold(AnyBoard.Logger.debugLevel)
     * AnyBoard.debug("I'm here afterall!")  // logs
     * @example
     * // Or increase it to avoid certain logging
     * AnyBoard.Logger.setThreshold(AnyBoard.Logger.errorLevel)
     * AnyBoard.warn("The tardis has arrived!")  // does not log
     * @example
     * // But you can never avoid errors
     * AnyBoard.Logger.setThreshold(AnyBoard.Logger.errorLevel+1)
     * AnyBoard.error("The Doctor is dead!!")  // logs
     */
    setThreshold: function(severity) {
        this.threshold = severity;
    }
};
/**
 * Utility functions for AnyBoard
 */
AnyBoard.Utils = {};

/**
 * Internal method to evaluate if obj is a function
 * @param obj
 * @returns {boolean}
 * @private
 */
AnyBoard.Utils._isFunction = function(obj) {
    return typeof obj == 'function' || false;
};

/**
 * Internal method to evaluate if obj is an object
 * @param obj
 * @returns {boolean}
 * @private
 */
AnyBoard.Utils._isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
};

/**
 * Internal method to evaluate if obj has a certain key
 * @param obj
 * @param key
 * @returns {boolean|*}
 * @private
 */
AnyBoard.Utils._has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
};

/**
 * Internal method that returns the keys of obj
 * @param obj
 * @returns {Array}
 * @private
 */
AnyBoard.Utils._keys = function(obj) {
    if (!AnyBoard.Utils._isObject(obj)) return [];
    if (Object.keys) return Object.keys(obj);
    var keys = [];
    for (var key in obj) if (AnyBoard.Utils._has(obj, key)) keys.push(key);
    return keys;
};

/**
 * Returns whether or not two objects are equal. Works with objects, dictionaries, and arrays as well.
 * @param {object|Array|String|number|boolean} a item to compare
 * @param {object|Array|String|number|boolean} b item to compare against a
 * @param {Array} [aStack] *(optional)* array of items to further compare
 * @param {Array} [bStack] *(optional)* array of items to further compare
 * @returns {boolean} whether or not the items were equal
 * @example
 * var tardis = {"quality": "awesome"}
 * var smardis = {"quality": "shabby"}
 * var drWhoCar = {"quality": "awesome"}
 *
 * // Returns true
 * AnyBoard.Utils.isEqual(tardis, drWhoCar)
 *
 * // Returns false
 * AnyBoard.Utils.isEqual(tardis, smardis)
 */
AnyBoard.Utils.isEqual = function (a, b, aStack, bStack) {
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
    return AnyBoard.Utils._deepEq(a, b, aStack, bStack);
};

/**
 * Evaluates deep equality between two objects
 * @param {object|Array|String|number|boolean} a item to compare
 * @param {object|Array|String|number|boolean} b item to compare against a
 * @param {Array} [aStack] *(optional)* array of items to further compare
 * @param {Array} [bStack] *(optional)* array of items to further compare
 * @returns {boolean} whether or not the two items were equal
 * @private
 */
AnyBoard.Utils._deepEq = function (a, b, aStack, bStack) {
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
        if (aCtor !== bCtor && !(AnyBoard.Utils._isFunction(aCtor) && aCtor instanceof aCtor &&
            AnyBoard.Utils._isFunction(bCtor) && bCtor instanceof bCtor)
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
            if (!AnyBoard.Utils.isEqual(a[length], b[length], aStack, bStack)) return false;
        }
    } else {
        // Deep compare objects.
        var keys = AnyBoard.Utils._keys(a), key;
        length = keys.length;
        // Ensure that both objects contain the same number of properties before comparing deep equality.
        if (AnyBoard.Utils._keys(b).length !== length) return false;
        while (length--) {
            // Deep compare each member
            key = keys[length];
            if (!(AnyBoard.Utils._has(b, key) && AnyBoard.Utils.isEqual(a[key], b[key], aStack, bStack))) return false;
        }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
};
