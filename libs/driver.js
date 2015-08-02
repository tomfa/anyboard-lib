"use strict";

/**
 * @static {object}
 */
AnyBoard.Drivers = {
    drivers: {}
};

/**
 * Returns deck with given name
 * @param {string} name name of driver
 * @returns {AnyBoard.Driver} driver with given name (or undefined if non-existent)
 */
AnyBoard.Drivers.get = function(name) {
    return this.drivers[name];
};

/*
 * Help function. Drivers added with this function are retrievable with get function.
 * New drivers are added automatically upon construction with new AnyBoard.Driver(...)
 * @param {function} driver driver to be added
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

/** Represents a single Driver, e.g. for spesific token or bluetooth on operating system.
 * @constructor
 * @param {object} options options for the driver
 * @param {string} options.name name of the driver
 * @param {string} options.description description of the driver
 * @param {string} options.version version of the driver
 * @param {string} options.dependencies (optional) What if anything the driver depends on.
 * @param {string} options.date (optional) Date upon release/last build.
 * @param {any} options.yourAttributeHere custom attributes, as well as specified ones, are all placed in driver.properties. E.g. 'heat' would be placed in driver.properties.heat.
 * @property {object} options options for the driver
 * @property {string} options.name name of the driver
 * @property {string} options.description description of the driver
 * @property {string} options.version version of the driver
 * @property {string} options.dependencies (optional) What if anything the driver depends on.
 * @property {string} options.date (optional) Date upon release/last build.
 * @property {object} properties dictionary that holds custom attributes
 */
AnyBoard.Driver = function(options) {
    if (!options.name || !options.description || !options.version) {
        AnyBoard.Logger.error(
            'Attempted to add driver without necessary options (name, description, version). Driver will be ignored.',
            this
        );
    }
    this.name = options.name;
    this.description = options.description;
    this.dependencies = options.dependencies;
    this.version = options.version;
    this.date = options.date;
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


