/**
 * Utility functions for AnyBoard
 */
AnyBoard.Utils = {};

/**
 * Internal method to evaluate if obj is a function
 * @param obj
 * @returns {boolean}
 * @private
 */
AnyBoard.Utils._isFunction = function(obj) {
    return typeof obj == 'function' || false;
};

/**
 * Internal method to evaluate if obj is an object
 * @param obj
 * @returns {boolean}
 * @private
 */
AnyBoard.Utils._isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
};

/**
 * Internal method to evaluate if obj has a certain key
 * @param obj
 * @param key
 * @returns {boolean|*}
 * @private
 */
AnyBoard.Utils._has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
};

/**
 * Internal method that returns the keys of obj
 * @param obj
 * @returns {Array}
 * @private
 */
AnyBoard.Utils._keys = function(obj) {
    if (!AnyBoard.Utils._isObject(obj)) return [];
    if (Object.keys) return Object.keys(obj);
    var keys = [];
    for (var key in obj) if (AnyBoard.Utils._has(obj, key)) keys.push(key);
    return keys;
};

/**
 * Returns whether or not two objects are equal. Works with objects, dictionaries, and arrays as well.
 * @param {object|Array|String|number|boolean} a item to compare
 * @param {object|Array|String|number|boolean} b item to compare against a
 * @param {Array} [aStack] *(optional)* array of items to further compare
 * @param {Array} [bStack] *(optional)* array of items to further compare
 * @returns {boolean} whether or not the items were equal
 * @example
 * var tardis = {"quality": "awesome"}
 * var smardis = {"quality": "shabby"}
 * var drWhoCar = {"quality": "awesome"}
 *
 * // Returns true
 * AnyBoard.Utils.isEqual(tardis, drWhoCar)
 *
 * // Returns false
 * AnyBoard.Utils.isEqual(tardis, smardis)
 */
AnyBoard.Utils.isEqual = function (a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b !== 'object') return false;
    return AnyBoard.Utils._deepEq(a, b, aStack, bStack);
};

/**
 * Evaluates deep equality between two objects
 * @param {object|Array|String|number|boolean} a item to compare
 * @param {object|Array|String|number|boolean} b item to compare against a
 * @param {Array} [aStack] *(optional)* array of items to further compare
 * @param {Array} [bStack] *(optional)* array of items to further compare
 * @returns {boolean} whether or not the two items were equal
 * @private
 */
AnyBoard.Utils._deepEq = function (a, b, aStack, bStack) {
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
        // Strings, numbers, regular expressions, dates, and booleans are compared by value.
        case '[object RegExp]':
        // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
        case '[object String]':
            // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
            // equivalent to `new String("5")`.
            return '' + a === '' + b;
        case '[object Number]':
            // `NaN`s are equivalent, but non-reflexive.
            // Object(NaN) is equivalent to NaN
            if (+a !== +a) return +b !== +b;
            // An `egal` comparison is performed for other numeric values.
            return +a === 0 ? 1 / +a === 1 / b : +a === +b;
        case '[object Date]':
        case '[object Boolean]':
            // Coerce dates and booleans to numeric primitive values. Dates are compared by their
            // millisecond representations. Note that invalid dates with millisecond representations
            // of `NaN` are not equivalent.
            return +a === +b;
    }
    var areArrays = className === '[object Array]';
    if (!areArrays) {
        if (typeof a != 'object' || typeof b != 'object') return false;

        // Objects with different constructors are not equivalent, but `Object`s or `Array`s
        // from different frames are.
        var aCtor = a.constructor, bCtor = b.constructor;
        if (aCtor !== bCtor && !(AnyBoard.Utils._isFunction(aCtor) && aCtor instanceof aCtor &&
            AnyBoard.Utils._isFunction(bCtor) && bCtor instanceof bCtor)
            && ('constructor' in a && 'constructor' in b)) {
            return false;
        }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
        // Linear search. Performance is inversely proportional to the number of
        // unique nested structures.
        if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
        // Compare array lengths to determine if a deep comparison is necessary.
        length = a.length;
        if (length !== b.length) return false;
        // Deep compare the contents, ignoring non-numeric properties.
        while (length--) {
            if (!AnyBoard.Utils.isEqual(a[length], b[length], aStack, bStack)) return false;
        }
    } else {
        // Deep compare objects.
        var keys = AnyBoard.Utils._keys(a), key;
        length = keys.length;
        // Ensure that both objects contain the same number of properties before comparing deep equality.
        if (AnyBoard.Utils._keys(b).length !== length) return false;
        while (length--) {
            // Deep compare each member
            key = keys[length];
            if (!(AnyBoard.Utils._has(b, key) && AnyBoard.Utils.isEqual(a[key], b[key], aStack, bStack))) return false;
        }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
};
