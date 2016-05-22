var rxAssert = require('../index');

var assert = require('chai').assert;
var expect = require('chai').expect;

var Rx = require('rx');
var TestScheduler = Rx.TestScheduler;
var onNext = Rx.ReactiveTest.onNext;
var onError = Rx.ReactiveTest.onError;
var onCompleted = Rx.ReactiveTest.onCompleted;
var subscribe = Rx.ReactiveTest.subscribe;

describe('check isEqual', function() {

    it('should check that isEqual works with simple values', function() {
        var scheduler = new TestScheduler();

        var xs = scheduler.createHotObservable(
            onNext(150, 1),
            onNext(250, 2),
            onNext(350, 3),
            onNext(450, 4),
            onCompleted(550)
        );

        var results = scheduler.startScheduler(function() {
            return xs.delay(100, scheduler);
        });

        var expected = [
            onNext(350, 2),
            onNext(450, 3),
            onNext(550, 4),
            onCompleted(650)
        ]

        var result = rxAssert.isEqual(results.messages, expected);
        expect(result).to.have.length(2);
        expect(result[0]).to.equal(true);
    });

    it('should check that isEqual works with predicate values', function() {
        var scheduler = new TestScheduler();

        var xs = scheduler.createHotObservable(
            onNext(150, 1),
            onNext(250, 2),
            onNext(350, 3),
            onNext(450, 4),
            onCompleted(550)
        );

        var results = scheduler.startScheduler(function() {
            return xs.delay(100, scheduler);
        });

        var expected = [
            onNext(350, function(a) {return a.value === 2}),
            onNext(450, function(a) {return a.value === 3}),
            onNext(550, 4),
            onCompleted(650)
        ]

        var result = rxAssert.isEqual(results.messages, expected);
        expect(result).to.have.length(2);
        expect(result[0]).to.equal(true);
    });

    it('should return false result if values are not equal', function() {
        var scheduler = new TestScheduler();

        var xs = scheduler.createHotObservable(
            onNext(250, 1),
            onCompleted(550)
        );

        var results = scheduler.startScheduler(function() {
            return xs.delay(100, scheduler);
        });

        var expected = [
            onNext(350, 3),
            onCompleted(650)
        ]

        var result = rxAssert.isEqual(results.messages, expected);
        expect(result).to.have.length(2);
        expect(result[0]).to.equal(false);
        expect(result[1]).to.be.a('string');
    });

    it('should return false result if predicate fails', function() {
        var scheduler = new TestScheduler();

        var xs = scheduler.createHotObservable(
            onNext(250, 1),
            onCompleted(550)
        );

        var results = scheduler.startScheduler(function() {
            return xs.delay(100, scheduler);
        });

        var expected = [
            onNext(350, function(a){ return a.value === 3}),
            onCompleted(650)
        ]

        var result = rxAssert.isEqual(results.messages, expected);
        expect(result).to.have.length(2);
        expect(result[0]).to.equal(false);
        expect(result[1]).to.be.a('string');
    });

    it('should return false if not equal length', function() {
        var scheduler = new TestScheduler();

        var xs = scheduler.createHotObservable(
            onNext(250, 1),
            onCompleted(550)
        );

        var results = scheduler.startScheduler(function() {
            return xs.delay(100, scheduler);
        });

        var expected = [
            onNext(350, 1)
        ]

        var result = rxAssert.isEqual(results.messages, expected);
        expect(result).to.have.length(2);
        expect(result[0]).to.equal(false);
        expect(result[1]).to.be.a('string');        
    });
});