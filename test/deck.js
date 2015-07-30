var assert = require("assert")
var AnyBoard = require("./../dist/AnyBoard.js");
var sinon = require('sinon');

AnyBoard.Logger.threshold = 40;

var jsonDeckData = JSON.parse('{\
    "name": "DoomsDeck",\
    "color": "black",\
    "autoUsedRefill": false,\
    "autoNewRefill": true,\
    "cards":[\
        {"title": "Card of Doom",\
            "description": "Display your private hand to all players.",\
            "category": "Doom",\
            "value": 1,\
            "amount": 5},\
        {"title": "Card of Fish",\
            "description": "Display your private hand to all players.",\
            "category": "Doom",\
            "value": 2,\
            "amount": 3}\
    ]\
}');

describe('AnyBoard.Deck', function() {
    describe('after being constructed', function () {
        var deck = new AnyBoard.Deck('testDeck', jsonDeckData);
        it('can be found through AnyBoard.Deck.get([name of deck])', function () {
            assert.equal(deck, AnyBoard.Deck.get('testDeck'))
        });
        it('has loaded all cards to property "cards"', function () {
            var amountOfCards = 0;
            for (var i in jsonDeckData.cards) {
                amountOfCards += jsonDeckData.cards[i].amount;
            }
            assert.equal(deck.cards.length, amountOfCards)
        });
        it('has property "pile" containing all cards', function () {
            assert.equal(deck.cards.length, deck.pile.length)
        });
        it('has no used cards in property "usedCards"', function () {
            assert.equal(0, deck.usedPile.length)
        });
    });
    describe('when a card is drawn from a non-empty pile', function () {
        var deck = new AnyBoard.Deck('second', jsonDeckData);
        it('returns an card (AnyBoard.Card)', function () {
            var drawnCard = deck._draw();
            assert(drawnCard instanceof AnyBoard.Card)
        });
        it('has the top card removed from pile"', function () {
            var initLength = deck.pile.length;
            deck._draw();
            assert(initLength === deck.pile.length + 1)
        });
    });

    describe('when a card is drawn from an empty pile', function () {
        describe('and autoNewRefill = true, it', function () {
            var deck = new AnyBoard.Deck('third', jsonDeckData);
            deck.pile.length = 0;
            deck.autoNewRefill = true;
            var drawnCard = deck._draw();
            it('restocks the pile with a complete new deck', function () {
                assert.equal(deck.pile.length, deck.cards.length-1);
            });
            it('provides a card', function () {
                assert(drawnCard instanceof AnyBoard.Card)
            });
        });
        describe('and autoNewRefill = false, autoUsedRefill = true', function () {
            var deck = new AnyBoard.Deck('fourth', jsonDeckData);
            deck.autoNewRefill = false;
            deck.autoUsedRefill = true;
            var originalPileLength = deck.pile.length;
            for (; deck.pile.length > 0;) {
                deck._draw()._play();
            }
            var drawnCard = deck._draw();

            it('restocks the pile with the used pile (shuffled)', function () {
                assert.equal(deck.usedPile.length, 0)
                assert.equal(deck.pile.length, originalPileLength-1)
            });
            it('returns a card from the pile if the usedPile had cards', function () {
                assert(drawnCard instanceof AnyBoard.Card)
            });
            it('returns undefined if the usedPile was empty', function () {
                var secondDeck = new AnyBoard.Deck('fifth', jsonDeckData);
                secondDeck.pile.length = 0;
                secondDeck.usedPile.length = 0;
                secondDeck.autoNewRefill = false;
                secondDeck.autoUsedRefill = true;
                var emptyDrawnCard = secondDeck._draw();
                assert(emptyDrawnCard === undefined)
            });
        });
        describe('and autoNewRefill = false, autoUsedRefill = false', function () {
            var thirdDeck = new AnyBoard.Deck('sixth', jsonDeckData);
            thirdDeck._draw()._play();
            thirdDeck._draw()._play();
            thirdDeck.pile.length = 0;
            thirdDeck.autoNewRefill = false;
            thirdDeck.autoUsedRefill = false;
            var emptyDrawnCard = thirdDeck._draw();
            it('returns undefined', function () {
                assert(emptyDrawnCard === undefined)
            });
        });
    });

    describe('when functions are added with onDraw()', function () {
        var deck = new AnyBoard.Deck('seventh', jsonDeckData);
        var spy = sinon.spy();
        var player = new AnyBoard.Player("tomas");
        var customData = {"anything": "cake"};
        deck.onDraw(spy);
        var card = player.draw(deck, customData);
        it('they are invoked on draw()', function () {
            assert(spy.called);
        });
        it('with parameters card, player, customOptions', function () {
            assert(spy.calledWith(card, player, customData));
        });
    });

    describe('when functions are added with onPlay()', function () {
        var deck = new AnyBoard.Deck('eight', jsonDeckData);
        var spy = sinon.spy();
        var player = new AnyBoard.Player("tomas");
        var customData = {"anything": "cake"};
        deck.onPlay(spy);
        var card = player.draw(deck);
        player.play(card, customData);
        it('they are invoked on play', function () {
            assert(spy.called);
        });
        it('with parameters card, player, customOptions', function () {
            assert(spy.calledWith(card, player, customData));
        });
    });
});

describe('AnyBoard.Card', function() {
    describe('when constructed with valid options', function () {
        var deck = new AnyBoard.Deck('nine', jsonDeckData);
        var options = JSON.parse('{"title": "Card of Cake",\
            "description": "Eat all the cake.",\
            "category": "Doom",\
            "value": 1,\
            "amount": 5,\
            "customVar": 3}');
        var card = new AnyBoard.Card(deck, options);
        it('stores all options in card.properties', function () {
            assert.equal(options, card.properties);
        });
        it('stores corresponding deck as card.deck', function () {
            assert.equal(deck, card.deck);
        });
        it('is retrievable through AnyBoard.Card.get function with title as parameter', function () {
            assert.equal(AnyBoard.Card.get(card.title), card)
        });
        it('is retrievable through AnyBoard.Card.get function with id as parameter', function () {
            assert.equal(AnyBoard.Card.get(card.id), card)
        });
    });
    describe('when played with parameter player', function () {
        var deck = new AnyBoard.Deck('nine', jsonDeckData);
        var options = JSON.parse('{"title": "Card of Cream",\
            "description": "Eat all the cream.",\
            "category": "Doom",\
            "value": 1,\
            "amount": 5,\
            "customVar": 3}');
        var player = new AnyBoard.Player("Ingrid");
        var card = new AnyBoard.Card(deck, options);
        var spy = sinon.spy();
        var spy2 = sinon.spy();
        deck.onPlay(spy);
        deck.onPlay(spy2);
        card._play(player);
        it('puts card in its corresponding decks usedPile property', function () {
            assert.equal(deck.usedPile[0], card);
        });
        it('and calls functions added to the decks onPlay listeners', function () {
            assert(spy.calledWith(card, player));
            assert(spy2.calledWith(card, player));
        });
    });

});

