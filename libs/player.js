"use strict";

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
        this.hand.add(card);
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

/**
 * Adds a card to the hand of a player
 * @param {AnyBoard.Card} card card to be added to this hand
 */
AnyBoard.Hand.prototype.add = function(card) {
    if (!this.cards[card.id])
        this.cards[card.id] = 0;
    AnyBoard.Logger.debug('' + this.player.name + " added to hand, card " + card.title, this);
    this.cards[card.id] += 1;
};

AnyBoard.Hand.prototype.toString = function() {
    return 'Hand: belongs to ' + (this.player ? this.player.name : ' no one');
};


