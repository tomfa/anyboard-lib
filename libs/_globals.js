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
 * @callback simpleTriggerCallback
 * @param {string} event name of event
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

