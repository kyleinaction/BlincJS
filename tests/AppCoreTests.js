(function () {
    'use strict';
    var appCore,
        appCoreFactory;

    // Creates a bare app core object
    appCoreFactory = function () {
        return Blinc.AppCoreFactory({}, function () {
            return function () { return {}; };
        });
    };

    QUnit.module("Blinc.AppCoreTestModule", {
        setup: function () {
            // Create a fresh AppCore object
            appCore = appCoreFactory();
        }
    });

    /**
     * Tests registering and starting a module
     */
    QUnit.test("testStart", function (assert) {
        var isStarted   = false;

        appCore.registerModule("module1", function (sandbox) {
            isStarted = true;
        });

        appCore.startModule("module1");

        assert.ok(isStarted === true, "testStart: did not start module");
    });

    /**
     * Tests starting all modules
     */
    QUnit.test("testStartAll", function (assert) {
        var numStarted   = 0;

        appCore.registerModule("module1", function (sandbox) {
            numStarted = numStarted + 1;
        }, 
        function () {

        });

        appCore.registerModule("module2", function (sandbox) {
            numStarted = numStarted + 1;
        }, 
        function () {

        });

        appCore.registerModule("module3", function (sandbox) {
            numStarted = numStarted + 1;
        }, 
        function () {

        });

        appCore.startAll();

        assert.ok(numStarted === 3, "testStartAll: only started " + numStarted + " modules.");
    });

    /**
     * Tests stopping a module
     */
    QUnit.test("testStop", function (assert) {
        var isStarted   = false;

        appCore.registerModule("module1", function (sandbox) {
            isStarted = true;
        }, function () {
            isStarted = false;
        });

        appCore.startModule("module1");
        appCore.stopModule("module1");

        assert.ok(isStarted === false, "testStop: Module was not stopped.");
    });

    /**
     * Tests stopping all modules
     */
    QUnit.test("testStopAll", function (assert) {
        var numStopped   = 0;

        appCore.registerModule("module1", function (sandbox) {
        }, function () {
            numStopped = numStopped + 1;
        });

        appCore.registerModule("module2", function (sandbox) {
        }, function () {
            numStopped = numStopped + 1;
        });

        appCore.registerModule("module3", function (sandbox) {
        }, function () {
            numStopped = numStopped + 1;
        });

        appCore.startAll();
        appCore.stopAll();

        assert.ok(numStopped === 3, "testStopAll: only stopped " + numStopped + " modules.");
    });

    QUnit.test("testRestart", function (assert) {
        var timesStarted    = 0;
        var timesStopped    = 0;

        appCore.registerModule("module1", function (sandbox) {
            timesStarted = timesStarted + 1;
        }, function () {
            timesStopped = timesStopped + 1;
        });

        appCore.startModule("module1");
        appCore.restartModule("module1");

        assert.ok(timesStarted === 2 && timesStopped === 1, "testRestart: Module was not restarted. Started " + timesStarted + " times, stopped " + timesStopped + "times.");
    });

    QUnit.test("testRestartAll", function (assert) {
        var numStarted   = 0;
        var numStopped   = 0;

        appCore.registerModule("module1", function (sandbox) {
            numStarted = numStarted + 1;
        }, function () {
            numStopped = numStopped + 1;
        });

        appCore.registerModule("module2", function (sandbox) {
            numStarted = numStarted + 1;
        }, function () {
            numStopped = numStopped + 1;
        });

        appCore.registerModule("module3", function (sandbox) {
            numStarted = numStarted + 1;
        }, function () {
            numStopped = numStopped + 1;
        });

        appCore.startAll();
        appCore.restartAll();

        assert.ok(numStarted === 6 && numStopped === 3, "testRestartAll: Did not restart all modules. Started " + numStarted + ", stopped " + numStopped + ".");
    });

})();