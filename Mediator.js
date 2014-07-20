var Blinc;
Blinc = Blinc || {};

Blinc.MediatorFactory = function () {
    'use strict';

    var Mediator = {},

        // Private Members
        channels = {},

        // Private Methods
        unsubscribeArray,
        unsubscribeObject,
        unsubscribeFunction,
        unsubscribeArrayFromChannel,
        unsubscribeFunctionFromChannel;

    /**
     * Subscribes a function to a channel
     * @param  string channel
     * @param  function func
     * @return void
     */
    Mediator.subscribe = function (channel, func) {
        if (channels[channel] === undefined) {
            channels[channel] = [];
        }
        if (typeof func !== "function") {
            throw new Error("Invalid argument. func is not a Function.");
        }
        channels[channel].push(func);
    };

    /**
     * Publishes a message to a channel
     * @param  string channel
     * @param  mixed message
     * @return void
     */
    Mediator.publish = function (channel, message) {
        var i;
        if (channels[channel] === undefined) {
            return true;
        }

        for (i = 0; i < channels[channel].length; i = i + 1) {
            if (typeof channels[channel][i] === "function") {
                channels[channel][i].call(null, message);
            }
        }
    };

    /**
     * Unsubscribes an array of functions in bulk
     * @private
     * @param  Array array
     * @return void
     */
    unsubscribeArray = function (array) {
        var i,
            i2,
            channel;

        for (i = 0; i < array.length; i = i + 1) {
            for (channel in channels) {
                if (typeof channels[channel] === "object" && Array.isArray(channels[channel]) === true) {
                    for (i2 = 0; i2 < channels[channel].length; i2 = i2 + 1) {
                        if (array[i] === channels[channel][i2]) {
                            channels[channel].splice(i2, 1);
                        }
                    }
                }
            }
        }
    };

    /**
     * @private
     * @param  {[type]} channel [description]
     * @param  {[type]} array   [description]
     * @return {[type]}         [description]
     */
    unsubscribeArrayFromChannel = function (channel, array) {
        var i,
            i2;
        if (typeof channels[channel] !== "object" || Array.isArray(channels[channel]) !== true) {
            return;
        }

        for (i = 0; i < array.length; i = i + 1) {
            for (i2 = 0; i2 < channels[channel].length; i2 = i2 + 1) {
                if (array[i] === channels[channel][i2]) {
                    channels[channel].splice(i2, 1);
                }
            }
        }
    };

    /**
     * @private
     * @param  {[type]} object [description]
     * @return {[type]}        [description]
     */
    unsubscribeObject = function (object) {
        var i,
            i2,
            channel;
        for (channel in object) {
            if (object[channel] !== undefined) {
                for (i = 0; i < channels[channel].length; i = i + 1) {
                    for (i2 = 0; i2 < object[channel].length; i2 = i2 + 1) {
                        if (channels[channel][i] === object[channel][i2]) {
                            channels[channel].splice(i, 1);
                        }
                    }
                }
            }
        }
    };

    /**
     * @private
     * @param  {[type]} func [description]
     * @return {[type]}      [description]
     */
    unsubscribeFunction = function (func) {
        var i,
            channel;
        for (channel in channels) {
            if (typeof channels[channel] === "object") {
                for (i = 0; i < channels[channel].length; i = i + 1) {
                    if (func === channels[channel][i]) {
                        channels[channel].splice(i, 1);
                    }
                }
            }
        }
    };

    /**
     * @private
     * @param  {[type]} channel [description]
     * @param  {[type]} func    [description]
     * @return {[type]}         [description]
     */
    unsubscribeFunctionFromChannel = function (channel, func) {
        var i;
        if (channels[channel] === undefined) {
            return;
        }
        for (i = 0; i < channels[channel].length; i = i + 1) {
            if (func === channels[channel][i]) {
                channels[channel].splice(i, 1);
            }
        }
    };

    /**
     * unsubscribe([Function])
     * unsubscribe(channel, [Function])
     * unsubscribe({channel,[Function]});
     * unsubscribe(Function)
     * unsubscribe(channel, Function);
     * @return boolean
     */
    Mediator.unsubscribe = function (a, b) {
        if (typeof a === "string") {
            if (typeof b === "function") {
                unsubscribeFunctionFromChannel(a, b);
            }
            if (typeof b === "object" && Array.isArray(b) === true) {
                unsubscribeArrayFromChannel(a, b);
            }
        } else if (typeof a === "function") {
            unsubscribeFunction(a);
        } else if (typeof a === "object" && Array.isArray(a) === true) {
            unsubscribeArray(a);
        } else if (typeof a === "object") {
            unsubscribeObject(a);
        } else {
            throw new Error("Unknown overload of unsubscribe.");
        }
    };

    return Mediator;
};