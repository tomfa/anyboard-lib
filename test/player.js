var assert = require("assert")
var AnyBoard = require("./../dist/AnyBoard.js");
var sinon = require('sinon');
var _ = require('underscore')

AnyBoard.Logger.threshold = AnyBoard.Logger.debugLevel;

describe('AnyBoard.Player', function() {
    var cake = new AnyBoard.Resource('cake');
    describe('when constructed', function () {
        var player = new AnyBoard.Player('cake');
        it('can be found through AnyBoard.Player.get([name of player])', function () {
            assert.equal(player, AnyBoard.Player.get(player.name))
        });
        it('has an instance of AnyBoard.Hand as property hand without cards', function () {
            assert(player.hand instanceof AnyBoard.Hand);
            assert.equal(0, Object.keys(player.hand.cards).length);
        });
        it('has an instance of AnyBoard.ResourceSet as property bank without resources', function () {
            assert(player.bank instanceof AnyBoard.ResourceSet);
            assert.equal(0, Object.keys(player.bank.resources).length);
        });
        it('if constructed with options, those are placed in players property "properties"', function () {
            var customOptions = {'testing': 'testing'};
            var newPlyaer = new AnyBoard.Player('fish', customOptions);
            assert(_.isEqual(newPlyaer.properties, customOptions));
        });

    });
    describe('when calling pay(resources, player)', function () {
        describe('without having sufficient resources', function () {
            var person = new AnyBoard.Player('fisk');
            var debt = new AnyBoard.ResourceSet({'cake': 3});
            var originalBankResources = _.clone(person.bank.resources);
            it('returns false', function () {
                assert.equal(false, person.pay(debt));
            });
            it('and leaves no changes from the players bank', function () {
                assert(_.isEqual(originalBankResources, person.bank.resources));
            });
        });
        describe('with sufficient resources', function () {
            var person = new AnyBoard.Player('fisk');
            var receiversPerson = new AnyBoard.Player('laaneFisken');

            var debt = new AnyBoard.ResourceSet({'cake': 3});
            var expectedAfterBank = {'cake': 4};
            var expectedReceiversAfterBank = {'cake': 10};
            person.bank.add(new AnyBoard.ResourceSet({'cake': 7}));
            receiversPerson.bank.add(new AnyBoard.ResourceSet({'cake': 7}));
            it('returns true', function () {
                assert.equal(true, person.pay(debt, receiversPerson));
            });
            it('deducts the players bank of the specified amount of resources', function () {
                assert(_.isEqual(person.bank.resources, expectedAfterBank));
            });
            it('adds to receiving players bank the specified amount of resources, if player parameter is specified', function () {
                assert(_.isEqual(receiversPerson.bank.resources, expectedReceiversAfterBank));
            });
        });
    });
    describe('when calling trade(giveAmount, receiveAmount, player)', function () {
        describe('without initiating player having sufficient resources', function () {
            it('returns false', function () {
                //assert(false);
            });
            it('and leaves no changes from the either players bank', function () {
                //assert(false);
            });
        });
        describe('with targeted player specified and is not having sufficient amount of resources', function () {
            it('returns false', function () {
                //assert(false);
            });
            it('and leaves no changes from the either players bank', function () {
                //assert(false);
            });
        });
        describe('with targeted player specified and both players have sufficient resources', function () {
            it('returns true', function () {
                //assert(false);
            });
            it('deducts the initiating player bank of the giveResources amount of resources', function () {
                //assert(false);
            });
            it('deducts the targeted player bank of the recieveResources amount of resources', function () {
                //assert(false);
            });
            it('adds to the initiating player bank the recieveResources amount of resources', function () {
                //assert(false);
            });
            it('adds to the targeted player bank the giveResources amount of resources', function () {
                //assert(false);
            });
        });
        describe('with targeted player NOT specified and initiating player have sufficient resources', function () {
            it('returns true', function () {
                //assert(false);
            });
            it('deducts the initiating player bank of the giveResources amount of resources', function () {
                //assert(false);
            });
            it('adds to the initiating player bank the recieveResources amount of resources', function () {
                //assert(false);
            });
        });
    });
    describe('when calling receive(resources)', function () {
        var person = new AnyBoard.Player('fisken');
        var bonus = new AnyBoard.ResourceSet({'cake': 3});
        person.recieve(bonus);
        it('adds resources to the bank of the player', function () {
            assert(_.isEqual(person.bank.resources, {'cake': 3}));
        });
    });

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
            "amount": 1},\
        {"title": "Card of Fish",\
            "description": "Display your private hand to all players.",\
            "category": "Doom",\
            "value": 2,\
            "amount": 1}\
    ]\
}');


    describe('when calling draw(deck)', function () {
        var deck = new AnyBoard.Deck('theFishDeck', jsonDeckData)
        var player = new AnyBoard.Player('soManyNames');
        var orgPileLength = Object.keys(deck.pile).length;
        var orgCardsLength = Object.keys(deck.cards).length;
        var drawnCard = player.draw(deck);
        var afterDrawPileLength = Object.keys(deck.pile).length;
        it('draws a card from the specified decks pile property', function () {
            assert.equal(orgCardsLength, Object.keys(deck.cards).length);
        });
        it('leaves the specified decks card property unchanged', function () {
            assert.equal(orgPileLength-1, afterDrawPileLength)
        });
        it('adds the drawn card to the hand of the player', function () {
            assert(player.hand.has(drawnCard))
            assert.equal(1, Object.keys(player.hand.cards).length)
        });
    });
    describe('when calling play(card)', function () {
        var deck = new AnyBoard.Deck('theFishDeck', jsonDeckData)
        var player = new AnyBoard.Player('soManyNames');
        var orgPileLength = Object.keys(deck.pile).length;
        var orgCardsLength = Object.keys(deck.cards).length;
        var drawnCard = player.draw(deck);
        var afterDrawPileLength = Object.keys(deck.pile).length;
        describe('with player not having that card', function () {
            var lastCard = deck.pile[0];
            var result = player.play(lastCard);
            it('returns false', function () {
                assert.equal(false, result);
            });
            it('leaves no changes in the hand of the player', function () {
                assert.equal(1, Object.keys(player.hand.cards).length)
            });
        });
        describe('with player having that card', function () {
            var result = player.play(drawnCard);
            it('returns true', function () {
                assert.equal(true, result);
            });
            it('deducts 1 instance of that card from the hand of the player', function () {
                assert.equal(1, Object.keys(player.hand.cards).length)
            });
        });
    });


});
