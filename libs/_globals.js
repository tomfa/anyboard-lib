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
 * @callback simpleEventCallback
 * @param {object} [options] *(optional)* options called with the triggering of that event
 */

/**
 * Type of callback called upon token-token events, i.e. when two tokens interact with eachother, wuch
 * as 'STACK_ON', 'NEXT_TO'
 * @callback tokenTokenEventCallback
 * @param {AnyBoard.BaseToken} initiatingToken token whose interaction with has triggered the event
 * @param {AnyBoard.BaseToken} respondingToken token that initiatingToken has interacted with
 * @param {object} [options] *(optional)* options called with the triggering of that event
 */

/**
 * Type of callback called upon triggering of a Token event, i.e. events triggered by the physical interaction
 * with tokens, such as 'LIFT', 'SHAKE', 'TURN'
 * @callback tokenEventCallback
 * @param {AnyBoard.BaseToken} token token that has been interacted with
 * @param {object} [options] *(optional)* options called with the triggering of that event
 */

/**
 * Type of callback called upon triggering of a Token-Constraint event, i.e. events triggered by the physical interaction
 * of a token upon a constraint, such as 'MOVED_TO'
 * @callback tokenConstraintEventCallback
 * @param {AnyBoard.BaseToken} token token that triggered the event
 * @param {string} constraint constraint that has been interacted with. Currently only a string representation.
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

