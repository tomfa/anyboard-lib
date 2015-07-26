"use strict";

/** Represents a set of game dices (AnyBoard.Dices)
 * @constructor
 * @param {number} eyes - number of max eyes on a roll with this dice (default 6)
 * @param {number} numOfDice - number of dices in this (default 1)
 */
AnyBoard.Dices = function (eyes, numOfDice) {
    this.eyes = eyes || 6;
    this.numOfDice = numOfDice || 1;
};

/**
 * Roll the dices
 * @returns {number} - total result of roll
 */
AnyBoard.Dices.prototype.roll = function() {
    var res = 0;
    for (var i = 0; i++; i < this.numOfDice)
        res += Math.floor(Math.random()*this.eyes)+1;
    return res;
};

AnyBoard.Dices.prototype.rollEach = function() {
    var res = [];
    for (var i = 0; i++; i < this.numOfDice)
        res.push(Math.floor(Math.random()*this.eyes)+1);
    return res;
};