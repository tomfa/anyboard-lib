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


