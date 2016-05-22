# rx-assert
Helper methods for making asserts in unit tests for rxjs library.

## Description
This package provides a low level api for comparing observable sequences.
Can be used in unit tests for comparing observables.

## Example of usage with chai
```javascript
const rxAssert = require('rx-assert');

const assert = require('chai').assert;

const Rx = require('rx');
const TestScheduler = Rx.TestScheduler;
const onNext = Rx.ReactiveTest.onNext;
const onError = Rx.ReactiveTest.onError;
const onCompleted = Rx.ReactiveTest.onCompleted;
const subscribe = Rx.ReactiveTest.subscribe;

describe('getDelayedStream', () => {
	
	it('should return messages with delay', () => {
		const scheduler = new TestScheduler();

		const xs = scheduler.createHotObservable(
			onNext(150, 1),
			onNext(250, 2),
			onNext(350, 3),
			onNext(450, 4),
			onCompleted(550)
		);

		const results = scheduler.startScheduler(() => {
			return xs.delay(100, scheduler);
		});

		const expected = [
			onNext(350, 2),
			onNext(450, 3),
			onNext(550, 4),
			onCompleted(650)
		]

		const [equal, message] = rxAssert.isEqual(results.messages, expected);

		assert.isOk(equal, message)
	});
});

```

## Methods
### isEqual(actual, expected)
* *@param* {List} actual List with notification records (onNext(), onCompleted e.t.c)
* *@param* {List} expected List with notification records (onNext(), onCompleted e.t.c)
* *@return* {List} List with 2 elements - [isEqual {bool}, diffMessage {String}]

First element defines wether actual and expected sequences are equal.

The second one provides a diff message.

Example:

```javascript
const xs = scheduler.createHotObservable(
			onNext(150, 1),
			onNext(250, 2),
			onNext(350, 3),
			onNext(450, 4),
			onCompleted(550)
		);

const results = scheduler.startScheduler(() => {
	return xs.delay(100, scheduler);
});

const expected = [
	onNext(350, 2),
	onNext(450, 3),
	onNext(550, 4),
	onCompleted(650)
]

const [equal, message] = rxAssert.isEqual(results.messages, expected);
```

## Dev info
### Installation
```bash
git clone
cd
npm install .
```

### Test coverage
Contributions are welcome. Dont forget to check the tests.

```bash
npm test
```

