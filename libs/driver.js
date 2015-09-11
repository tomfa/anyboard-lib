/**
 * Manager of drivers.
 * @type {Object}
 */
AnyBoard.Drivers = {
    drivers: {}
};

/**
 * Returns driver with given name
 * @example
 * var discoveryBluetooth = new AnyBoard.Driver({
        name: 'theTardisMachine',
        description: 'bla bla',
        version: '1.0',
        type: ['bluetooth-discovery', 'bluetooth'],
        compatibility: ['tardis', 'pancakes']
    });
 *
 * // Returns undefined
 * AnyBoard.Drivers.get("non-existant-driver")
 *
 * // Returns driver
 * AnyBoard.Drivers.get("theTardisMachine")
 * @param {string} name name of driver
 * @returns {AnyBoard.Driver|undefined} driver with given name (or undefined if non-existent)
 */
AnyBoard.Drivers.get = function(name) {
    return this.drivers[name];
};

/**
 * Returns first driver of certain type that matches the given compatibility.
 * @example
 * var discoveryBluetooth = new AnyBoard.Driver({
        name: 'theTardisMachine',
        description: 'bla bla',
        version: '1.0',
        type: ['bluetooth-discovery', 'bluetooth'],
        compatibility: ['tardis', {"show": "Doctor Who"}]
    });
 *
 * // Returns undefined (right type, wrong compatibility)
 * AnyBoard.Drivers.getCompatibleDriver('bluetooth', 'weirdCompatibility');
 *
 * // Returns undefined (wrong type, right compatibility)
 * AnyBoard.Drivers.getCompatibleDriver('HTTP, {"service": "iCanTypeAnyThingHere"});
 *
 * // Returns discoveryBluetooth driver
 * AnyBoard.Drivers.getCompatibleDriver('bluetooth', 'tardis');
 *
 * @param {string} type name of driver
 * @param {string|object} compatibility name of driver
 * @returns {AnyBoard.Driver} compatible driver (or undefined if non-existent)
 *
 */
AnyBoard.Drivers.getCompatibleDriver = function(type, compatibility) {
    for (var key in AnyBoard.Drivers.drivers) {
        if (!AnyBoard.Drivers.drivers.hasOwnProperty(key))
            continue;
        var driver = AnyBoard.Drivers.drivers[key];
        if (typeof driver.type === 'string' && type !== driver.type
            || driver.type instanceof Array && driver.type.indexOf(type) === -1)
            continue;
        if (driver.compatibility instanceof Array) {
            for (var index in driver.compatibility) {
                if (driver.compatibility.hasOwnProperty(index))
                    if (AnyBoard.Utils.isEqual(compatibility, driver.compatibility[index]))
                        return driver;
            }
        } else if (AnyBoard.Utils.isEqual(compatibility, driver.compatibility)) {
            return driver;
        }

    }
    return undefined;
};

/**
 * Internal function. Drivers added with this function are retrievable with get function.
 * New drivers are added automatically upon construction with new AnyBoard.Driver(...)
 * @param {AnyBoard.Driver} driver driver to be added
 * @private
 */
AnyBoard.Drivers._add = function(driver) {
    if (!driver.name) {
        AnyBoard.Logger.warn('Attempted to add driver without name. Driver will be ignored.', this);
        return;
    }
    if (this.drivers[driver.name])
        AnyBoard.Logger.warn('Driver with name + ' + driver.name + ' already existed. Overwriting', this);
    this.drivers[driver.name] = driver;
};

/*
 * Returns a short description of this class
 * @returns {string}
 */
AnyBoard.Drivers.toString = function() {
    return 'AnyBoard.Drivers (driverManager)'
};

/** Represents a single Driver, e.g. for spesific token or bluetooth discovery
 * @constructor
 * @param {object} options options for the driver
 * @param {string} options.name name of the driver
 * @param {string} options.description description of the driver
 * @param {string} options.version version of the driver
 * @param {string} options.type Type of driver, e.g. "bluetooth"
 * @param {Array|object|string} options.compatibility An object or string that can be used to deduce compatibiity, or
 *      an array of different compatibilies. How this is used is determined by the set standard driver on TokenManager
 *      that handles scanning for and connecting to tokens.
 * @param {string} [options.dependencies] *(optional)* What if anything the driver depends on.
 * @param {string} [options.date] *(optional)* Date upon release/last build.
 * @param {any} options.yourAttributeHere custom attributes, as well as specified ones, are all placed in
 *      driver.properties. E.g. 'heat' would be placed in driver.properties.heat.
 * @property {string} name name of the driver
 * @property {string} description description of the driver
 * @property {string} version version of the driver
 * @property {string} dependencies Text describing what, if anything, the driver depends on.
 * @property {string} date Date upon release/last build.
 * @property {Array} type Array of string describing    Type of driver, e.g. "bluetooth"
 * @property {Array|object|string} compatibility An object or string that can be used to deduce compatibiity, or
 *      an array of different compatibilies.
 * @property {object} properties dictionary that holds custom attributes
 */
AnyBoard.Driver = function(options) {
    if (!options.name || !options.description || !options.version || !options.type || !options.compatibility) {
        AnyBoard.Logger.warn(
            'Attempted to add driver without necessary options (name, description, version, type, compatibility). ' +
            'Driver will be ignored.',
            this
        );
    }
    this.name = options.name;
    this.description = options.description;
    this.dependencies = options.dependencies;
    this.version = options.version;
    this.date = options.date;
    this.type = options.type;
    this.compatibility = options.compatibility;
    this.properties = options;

    AnyBoard.Logger.debug('Loaded Driver ' + options.name, this);

    AnyBoard.Drivers._add(this);
};

/**
 * Returns a short description of the Driver instance
 * @returns {string}
 */
AnyBoard.Driver.prototype.toString = function() {
    return 'Driver: ' + this.name;
};


