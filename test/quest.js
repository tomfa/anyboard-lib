var assert = require("assert")
var AnyBoard = require("./../dist/AnyBoard.js");
var sinon = require('sinon');
var _ = require('underscore');

AnyBoard.Logger.threshold = AnyBoard.Logger.errorLevel;

describe('AnyBoard.Quest', function() {
    describe('when constructed', function () {
        it.skip('has an (optional) set of resources require to complete it', function () {
        });
        it.skip('has an (optional) set of reward resources given to the player that completes it', function () {
        });
        it.skip('has a title', function () {
        });
        it.skip('has a description', function () {
        });
    });
    describe('when quest are attempted completed()', function() {
        describe('but player does not hold required resources', function() {
            it.skip('it will return false and leave no changes', function () {
            });
        });
        describe('and the player holds required resources', function() {
            describe('but a requirementCheck-function added to the quest returns false', function() {
                it.skip('it will return false and leave no changes', function () {
                });
            });
            describe('and no requirementCheck-functions has been added to the quest', function() {
                it.skip('it will return true', function () {
                });
                it.skip('it will take required resources from the player', function () {
                });
                it.skip('it will take provide reward to the player', function () {
                });
                it.skip('it will call all completeListeners added with onComplete', function () {
                });
            });
            describe('and all requirementCheck-functions that has been added to the quest returns true', function() {
                it.skip('it will return true', function () {
                });
                it.skip('it will take required resources from the player', function () {
                });
                it.skip('it will take provide reward to the player', function () {
                });
                it.skip('it will call all completeListeners added with onComplete', function () {
                });
            });
        });
    });
    describe('when function are added to addRequirementCheck()', function() {
        it.skip('they are invoked if quest is attempted to be completed', function () {
        });
        it.skip('with parameters (player, quest, options)', function () {
        });
    });
    describe('when function are added to onComplete()', function() {
        it.skip('they are invoked if quest is successfully completed', function () {
        });
        it.skip('with parameters (player, quest, options)', function () {
        });
    });
});

