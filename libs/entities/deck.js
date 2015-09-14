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