/** Represents a set of game dices that can be rolled to retrieve a random result.
 * @constructor
 * @param {number} [eyes=6] *(optional, default: 6)* number of max eyes on a roll with this dice
 * @param {number} [numOfDice=1] *(optional, default: 1)* number of dices
 * @example
 * // will create 1 dice, with 6 eyes
 * var dice = new AnyBoard.Dices();
 *
 * // will create 2 dice, with 6 eyes
 * var dice = new AnyBoard.Dices(2, 6);
 */
AnyBoard.Dices = function (eyes, numOfDice) {
    this.eyes = eyes || 6;
    this.numOfDice = numOfDice || 1;
};

/**
 * Roll the dices and returns a the sum
 * @returns {number} combined result of rolls for all dices
 * @example
 * var dice = new AnyBoard.Dices();
 *
 * // returns random number between 1 and 6
 * dice.roll()
 *
 * @example
 * var dice = new AnyBoard.Dices(2, 6);
 *
 * // returns random number between 1 and 12
 * dice.roll()
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
 * @example
 * var dice = new AnyBoard.Dices(2, 6);
 *
 * // returns an Array of numbers
 * var resultArray = dice.rollEach()
 *
 * // result of first dice, between 1-6
 * resultArray[0]
 *
 * // result of second dice, between 1-6
 * resultArray[1]
 */
AnyBoard.Dices.prototype.rollEach = function() {
    var res = [];
    for (var i = 0; i < this.numOfDice; i++)
        res.push(Math.floor(Math.random()*this.eyes)+1);
    return res;
};
