/**
 * Represents a simple resource (AnyBoard.Resource)
 * @constructor
 * @param {string} name name representing the resource
 * @param {object} [properties] *(optional)* custom properties of this resource
 * @property {string} name name of resource
 * @property {any} properties custom options added to resource
 * @example
 * var simpleGold = new AnyBoard.Resource("gold");
 *
 * // The optional properties parameter can be of any type.
 * var advancedPowder = new AnyBoard.Resource("powder", {"value": 6, "color": "blue"});
 *
 * // 6
 * advancedPowder.properties.value
 */
AnyBoard.Resource = function(name, properties) {
    AnyBoard.Logger.debug("Adding new Resource " + name);
    if (AnyBoard.Resource.all[this.name]) {
        AnyBoard.Logger.error("Resource with name " + this.name + " already exists", this)
        return;
    }
    this.name = name;
    this.properties = properties;

    AnyBoard.Resource.all[this.name] = this;
};

AnyBoard.Resource.all = {};

/**
 * Returns resource with given name
 * @param {string} name name of resource
 * @returns {AnyBoard.Resource} resource with given name (or undefined if non-existent)
 * @example
 * var simpleGold = new AnyBoard.Resource("gold");
 *
 * // returns simpleGold
 * AnyBoard.Resource.get("gold");
 */
AnyBoard.Resource.get = function(name) {
    return AnyBoard.Resource.all[name]
};

/**
 * Creates a ResourceSet
 * @constructor
 * @param {object} [resources] *(optional)* a set of initially contained resources
 * @param {boolean} [allowNegative=false] whether or not to allow being subtracted resources to below 0 (dept)
 * @property {object} [resources] *(optional)* a set of initially contained resources
 * @property {boolean} [allowNegative=false] whether or not to allow being subtracted resources to below 0 (dept)
 *
 * @example
 * // Returns a resourceset that can be deducted below 0
 * var debtBank = new AnyBoard.ResourceSet({}, true);
 */
AnyBoard.ResourceSet = function(resources, allowNegative) {
    AnyBoard.Logger.debug("Adding new ResourceSet (allowNegative: " + allowNegative + ")");
    this.resources = {};
    for (var i in resources) {
        if (!resources.hasOwnProperty(i))
            continue;
        if (typeof i === 'string') {
            if (AnyBoard.Resource.get(i))
                this.resources[i] = resources[i];
            else
                AnyBoard.Logger.warn("Attempting to create ResourceSet with non-existant resource " + i + ". Resource ignored.");
        }
        else if (i instanceof AnyBoard.Resource) {
            this.resources[i.name] = resources[i]
        }
    }
    this.allowNegative = allowNegative || false;
};

/**
 * Whether or not a ResourceSet contains another ResourceSet
 * @param {AnyBoard.ResourceSet} reqResource ResourceSet to be compared against
 * @returns {boolean} true if this ResourceSet contains reqResource, else false
 * @example
 * new AnyBoard.Resource("gold");
 * new AnyBoard.Resource("silver");
 *
 * var myTreasure = new AnyBoard.ResourceSet({"gold": 6, "silver": 42});
 * var minorDebt = new AnyBoard.ResourceSet({"gold": 1, "silver": 3});
 * var hugeDebt = new AnyBoard.ResourceSet({"gold": 12, "silver": 41});
 *
 * // returns true
 * myTreasure.contains(minorDebt);
 *
 * // returns false
 * myTreasure.contains(hugeDebt);
 */
AnyBoard.ResourceSet.prototype.contains = function(reqResource) {
    for (var resource in reqResource.resources) {
        if (reqResource.resources.hasOwnProperty(resource) && reqResource.resources[resource] > 0) {
            if (!this.resources.hasOwnProperty(resource) || this.resources[resource] < reqResource.resources[resource])
                return false;
        }
    }
    return true;
};

/**
 * Adds a ResourceSet to this one
 * @param {AnyBoard.ResourceSet} resourceSet ResourceSet to be added to this one
 * @example
 * new AnyBoard.Resource("gold");
 * new AnyBoard.Resource("silver");
 *
 * var myTreasure = new AnyBoard.ResourceSet({"gold": 6, "silver": 42});
 * var minorGift = new AnyBoard.ResourceSet({"silver": 2});
 *
 * myTreasure.add(minorGift);
 * // myTreasure is now {"gold": 6, "silver": 45}
 */
AnyBoard.ResourceSet.prototype.add = function(resourceSet) {
    for (var resource in resourceSet.resources) {
        if (resourceSet.resources.hasOwnProperty(resource)) {
            if (!this.resources.hasOwnProperty(resource))
                this.resources[resource] = 0;
            this.resources[resource] += resourceSet.resources[resource]
        }
    }
};

/**
 * Subtracts a dictionary of resources and amounts to a ResourceSet
 * @param {AnyBoard.ResourceSet} resourceSet set of resources to be subtracted
 * @returns {boolean} whether or not resources were subtracted successfully
 * @example
 * new AnyBoard.Resource("gold");
 * new AnyBoard.Resource("silver");
 *
 * var myTreasure = new AnyBoard.ResourceSet({"gold": 6, "silver": 42});
 * var minorGift = new AnyBoard.ResourceSet({"silver": 2});
 * var debtBank = new AnyBoard.ResourceSet({}, true);
 * var cosyBank = new AnyBoard.ResourceSet();
 *
 * // returns true. myTreasure becomes {"gold": 6, "silver": 40}
 * myTreasure.subtract(minorGift);
 *
 * // returns true. debtbank becomes {"silver": -2}
 * debtBank.subtract(minorGift);
 *
 * // returns false and leaves cosyBank unchanged
 * cosyBank.subtract(minorGift);
 */
AnyBoard.ResourceSet.prototype.subtract = function(resourceSet) {
    if (!this.allowNegative && !this.contains(resourceSet)){
        return false;
    }
    for (var resource in resourceSet.resources) {
        if (resourceSet.resources.hasOwnProperty(resource)) {
            if (!this.resources.hasOwnProperty(resource))
                this.resources[resource] = 0;
            this.resources[resource] -= resourceSet.resources[resource];
        }
    }
    return true;
};

/**
 * Returns the common resources and minimum amount between a dictionary of resources and amounts, and this ResourceSet
 * @param {AnyBoard.ResourceSet} resourceSet dictionary of resources and amounts to be compared against
 * @returns {object} similarities dictionary of common resources and amounts
 * @example
 * new AnyBoard.Resource("gold");
 * new AnyBoard.Resource("silver");
 *
 * var myTreasure = new AnyBoard.ResourceSet({"gold": 6, "silver": 42});
 * var otherTresure = new AnyBoard.ResourceSet({"silver": 2, "bacon": 12});
 *
 * // returns {"silver": 2}
 * myTreasure.similarities(otherTresure);
 */
AnyBoard.ResourceSet.prototype.similarities = function(resourceSet) {
    var similarities = {};
    for (var resource in resourceSet.resources) {
        if (resourceSet.resources.hasOwnProperty(resource)) {
            if (this.resources.hasOwnProperty(resource))
                similarities[resource] = Math.min(this.resources[resource], resourceSet.resources[resource])
        }
    }
    return similarities;
};
