var assert = require("assert")
var AnyBoard = require("./../dist/AnyBoard.js");
var sinon = require('sinon');
var _ = require('underscore');

AnyBoard.Logger.threshold = 40;

describe('AnyBoard.Resource', function() {
    describe('after being constructed', function () {
        var name = 'gold';
        var props = {"value":5, "color": "yellow"};
        var resource = new AnyBoard.Resource('gold', props);
        it('can be found through AnyBoard.Resource.get([name of resource])', function () {
            assert.equal(resource, AnyBoard.Resource.get(resource.name))
        });
        it('has name defined by the parameter, stored in property name', function () {
            assert.equal('gold', resource.name);
        });
        it('has any custom properties stored in property properties', function () {
            assert.equal(props, resource.properties)
        });
    });
});

describe('AnyBoard.ResourceSet', function() {
    var cake = new AnyBoard.Resource('cake');
    var soda = new AnyBoard.Resource('soda');
    var banana = new AnyBoard.Resource('banana');

    var bananaResourceSet = new AnyBoard.ResourceSet({'banana': 5});
    var bananaCakeResourceSet = new AnyBoard.ResourceSet({'cake': 3, 'banana': 5});
    var bigSodaCakeResourceSet = new AnyBoard.ResourceSet({'cake': 51, 'soda': 36});
    var smallSodaCakeResourceSet = new AnyBoard.ResourceSet({'cake': 5, 'soda': 3});

    describe('when constructed without specifying resources', function () {
        var resourceSet = new AnyBoard.ResourceSet();
        it('is initially without resources', function () {
            assert.equal(0, Object.keys(resourceSet.resources).length);
        });
    });
    describe('when constructed with specifying resources', function () {
        var resourceSet = new AnyBoard.ResourceSet({'cake': 3, 'banana': 5});
        it('is initialized with those resources', function () {
            assert(_.isEqual({'cake': 3, 'banana': 5}, resourceSet.resources));
        });
    });
    describe('when called contains(resourceSet)', function () {
        it('returns false if the set does not contain the resources as in resourceSet', function () {
            assert.equal(false, bigSodaCakeResourceSet.contains(bananaCakeResourceSet));
        });
        it('returns false if the set does not contain the same or greater amount of resources as in resourceSet', function () {
            assert.equal(false, smallSodaCakeResourceSet.contains(bigSodaCakeResourceSet));
        });
        it('returns true if the set contains the same or greater amount of resources as in resourceSet', function () {
            assert(bigSodaCakeResourceSet.contains(smallSodaCakeResourceSet));
        });
    });
    describe('when called add(resourceSet)', function () {
        var resourceSet = new AnyBoard.ResourceSet(smallSodaCakeResourceSet.resources);

        it('adds to property resources the amount of resources contained in resourceSet', function () {
            assert.equal(false, resourceSet.contains(bananaResourceSet));
            resourceSet.add(bananaResourceSet);
            assert(resourceSet.contains(bananaResourceSet));
            assert(resourceSet.contains(smallSodaCakeResourceSet));
        });
    });
    describe('when called subtract(resourceSet)', function () {
        describe('with allowNegative = true', function () {
            var resourceSet = new AnyBoard.ResourceSet({'banana': 5}, true);
            var resourceSet2 = new AnyBoard.ResourceSet({'cake': 5, 'soda': 3}, true);
            it('returns true and deducts from this set the amount of resources specified in resourceSet', function () {
                assert(resourceSet.subtract(resourceSet2));
                assert(resourceSet.resources['cake'] === -resourceSet2.resources['cake']);
                assert(resourceSet.resources['soda'] === -resourceSet2.resources['soda']);
            });
        });
        describe('with allowNegative = false', function () {
            var resourceSet1 = new AnyBoard.ResourceSet({'cake': 5, 'soda': 3}, false);
            var resourceSet2 = new AnyBoard.ResourceSet({'cake': 51, 'soda': 36}, false);
            describe('and without enough resources', function () {
                it('returns false and leaves this set unchanged if this set does not contain resourceSet', function () {
                    assert.equal(false, resourceSet1.subtract(resourceSet2));
                    assert.equal(5, resourceSet1.resources['cake']);
                    assert.equal(3, resourceSet1.resources['soda']);
                });
            });
            describe('and with enough resources', function () {
                it('returns true and deducts from this set the amount of resources specified in resourceSet', function () {
                    assert(resourceSet2.subtract(resourceSet1));
                    assert.equal(46, resourceSet2.resources['cake'])
                    assert.equal(33, resourceSet2.resources['soda'])
                    assert(resourceSet1.subtract(resourceSet1));
                    assert.equal(0, resourceSet1.resources['soda']);
                    assert.equal(0, resourceSet1.resources['cake']);
                });
            });
        });
    });
    describe('when called similarities(resourceSet)', function () {
        describe('and there is no common resources between the sets', function () {
            it('returns an empty object', function () {
                assert.equal(0, Object.keys(bananaResourceSet.similarities(smallSodaCakeResourceSet)).length);
            });
        });
        describe('and there is common resources between the sets', function () {
            var similarities = bananaCakeResourceSet.similarities(smallSodaCakeResourceSet);
            it('returns an object with those resources as keys', function () {
                assert(similarities.hasOwnProperty('cake'));
            });
            it('and the value of the keys are the common amount of resources between those sets', function () {
                assert.equal(3, similarities['cake']);
            });
        });
    });
});
