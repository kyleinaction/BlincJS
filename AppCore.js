var Blinc;
Blinc = Blinc || {};

/**
 * Creates an app core object
 * @param Blinc.Mediator       mediator 
 * @param Blinc.SandboxFactory sandboxFactory
 */
Blinc.AppCoreFactory = function (mediator, sandboxFactory) {
    'use strict';
    var AppCore = {},
        modules = {};

    // Attach mediator 
    if (typeof mediator === "object") {
        /**
         * @see Blinc.Mediator
         */
        if (typeof mediator.publish === "function") {
            AppCore.publish = mediator.publish;
        }

        /**
         * @see Blinc.Mediator
         */
        if (typeof mediator.subscribe === "function") {
            AppCore.subscribe = mediator.subscribe;
        }

        /**
         * @see Blinc.Mediator
         */
        if (typeof mediator.unsubscribe === "function") {
            AppCore.unsubscribe = mediator.unsubscribe;
        }
    }

    /**
     * Registers a module with the application
     * @param  string moduleId 
     * @param  function _onStart Function called when the module is started
     * @param  function _onStop  Function called when the module is stopped
     * @param  function onUnregister Function called when the module is unregistered from the app
     * @return void
     */
    AppCore.registerModule = function (moduleId, onStart, onStop, onUnregister) {
        modules[moduleId] = {
            onStart:        onStart,
            onStop:         onStop,
            onUnregister:   onUnregister,
            started:        false
        };
    };

    /**
     * Unregisters a module from the app
     * @param  string moduleId
     * @return void
     */
    AppCore.unregisterModule = function (moduleId) {
        if (modules[moduleId] === undefined) {
            throw new Error("No module " + moduleId + " to unregister.");
        }

        if (typeof modules[moduleId].onUnregister === "function") {
            modules[moduleId].onUnregister.call();
        }

        this.stopModule(moduleId);
        delete modules[moduleId].onStart;
        delete modules[moduleId].onStop;
        delete modules[moduleId].started;
        delete modules[moduleId].onUnregister;
        delete modules[moduleId];
    };

    /**
     * Starts a module
     * @param  string moduleId 
     * @param  object params Optional
     * @return void
     */
    AppCore.startModule = function (moduleId, params) {
        if (modules[moduleId] === undefined) {
            throw new Error("No module " + moduleId + " registered.");
        }

        if (modules[moduleId].started === false) {
            var moduleSandbox = sandboxFactory(this, params);
            modules[moduleId].started = true;
            modules[moduleId].onStart.call(null, moduleSandbox);
        }
    };

    /**
     * Starts all unstarted modules
     * @return void
     */
    AppCore.startAll = function () {
        var moduleId;
        for (moduleId in modules) {
            if (typeof modules[moduleId] === "object") {
                this.startModule(moduleId);
            }
        }
    };

    /**
     * Stops a module
     * @param  string moduleId
     * @return void
     */
    AppCore.stopModule = function (moduleId) {
        if (modules[moduleId] === undefined) {
            throw new Error("No module " + moduleId + " registered.");
        }

        if (modules[moduleId].started) {
            modules[moduleId].started = false;
            modules[moduleId].onStop.call();
        }
    };

    /**
     * Stops all started modules
     * @return void
     */
    AppCore.stopAll = function () {
        var moduleId;
        for (moduleId in modules) {
            if (typeof modules[moduleId] === "object") {
                this.stopModule(moduleId);
            }
        }
    };

    /**
     * Restarts a module
     * @param  string moduleId 
     * @param  object params
     * @return void
     */
    AppCore.restartModule = function (moduleId, params) {
        this.stopModule(moduleId);
        this.startModule(moduleId, params);
    };


    /**
     * Restarts all started modules, and starts all unstarted modules
     * @return void
     */
    AppCore.restartAll = function () {
        var moduleId;
        for (moduleId in modules) {
            if (typeof modules[moduleId] === "object") {
                this.stopModule(moduleId);
                this.startModule(moduleId);
            }
        }
    };

    return AppCore;
};
