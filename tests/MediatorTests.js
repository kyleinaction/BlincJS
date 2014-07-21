(function () {
    'use strict';
    var mediator,
        mediatorFactory;

    // Creates a bare mediator object
    mediatorFactory = function () {
        return Blinc.MediatorFactory();
    };

    QUnit.module("Blinc.MediatorTestModule", {
        setup: function () {
            // Create a fresh Mediator object
            mediator = mediatorFactory();
        }
    });

    /**
     * Tests the subscribe and publish methods
     */
    QUnit.test("testSubscribeAndPublish", function (assert) {
        var triggered = false,
            paramsPresent = false;

        mediator.subscribe("testChannel", function (message) {
            triggered = true;
            if (typeof message === "object" && message.tmp === "a") {
                paramsPresent = true;
            }
        });

        mediator.publish("testChannel", {
            tmp:    "a"
        });

        assert.ok(triggered === true,      "testSubscribeAndPublish: expecting callback to be triggered. Triggered: " + (triggered === true ? "true" : "false"));
        assert.ok(paramsPresent === true,  "testSubscribeAndPublish: expecting parameters to be passed. Passed: " + (paramsPresent === true ? "true" : "false"));
    });

    /**
     * Tests the unsubscribe method and all of it's parameter combinations
     */
    QUnit.test("testUnsubscribe", function (assert) {
        var timesCalled = 0,
            myFunction;

        myFunction = function (message) {
            timesCalled = timesCalled + 1;
        };

        // Test removing by function
        mediator.subscribe("testChannel", myFunction);
        mediator.publish("testChannel", {});
        mediator.unsubscribe(myFunction);
        mediator.publish("testChannel", {});
        assert.ok(timesCalled === 1, "testUnsubscribeWithFunction: expecting callback to be called 1 time. Called " + timesCalled + " times.");
        timesCalled = 0;

        // Test removing by function from channel
        mediator.subscribe("testChannel", myFunction);
        mediator.publish("testChannel", {});
        mediator.unsubscribe("testChannel", myFunction);
        mediator.publish("testChannel", {});
        assert.ok(timesCalled === 1, "testUnsubscribeWithChannelAndFunction: expecting callback to be called 1 time. Called " + timesCalled + " times.");
        timesCalled = 0;

        // Test removing as array
        mediator.subscribe("testChannel", myFunction);
        mediator.publish("testChannel", {});
        var myArray = [];
        myArray.push(myFunction);
        mediator.unsubscribe(myArray);
        mediator.publish("testChannel", {});
        assert.ok(timesCalled === 1, "testUnsubscribeWithArrayOfFunctions: expecting callback to be called 1 time. Called " + timesCalled + " times.");
        timesCalled = 0;

        // Test removing as array from channel
        mediator.subscribe("testChannel", myFunction);
        mediator.publish("testChannel", {});
        var myArray2 = [];
        myArray2.push(myFunction);
        mediator.unsubscribe("testChannel", myArray2);
        mediator.publish("testChannel", {});
        assert.ok(timesCalled === 1, "testUnsubscribeWithChannelAndFunction: expecting callback to be called 1 time. Called " + timesCalled + " times.");
        timesCalled = 0;

        // Test removing object
        mediator.subscribe("testChannel", myFunction);
        mediator.publish("testChannel", {});
        var myObject = {
            "testChannel": [myFunction]
        };
        mediator.unsubscribe(myObject);
        mediator.publish("testChannel", {});
        assert.ok(timesCalled === 1, "testUnsubscribeWithObject: expecting callback to be called 1 time. Called " + timesCalled + " times.");
        timesCalled = 0;
    });

})();