var Rx = require('rx');
var comparer = Rx.internals.isEqual;

function createMessage(actual, expected) {
    return 'Expected: [' + expected.toString() + ']\r\nActual: [' + actual.toString() + ']';
}

/**
 * Used for comparing lists with notification records
 * var result = rxAssert.isEqual([onNext(200, 1)], [onNext(300, 1)]);
 * 
 * @param actual List with actual notification records
 * @param expected List with expected notification records
 * @return List [isEqual, diff message]. 
    List with 2 elements:
    isEqual - defines wether lists with notification records are equal.
    diff message - provides diffing message for not equal sequences.
*/
function isEqual(actual, expected) {
    var i, isEqual = true;

    if (expected.length !== actual.length) {
        var message = 'Not equal length. ' + createMessage(actual, expected);
        return [false, message];
    }

    for (i = 0; i < expected.length; i++) {
      var e = expected[i], a = actual[i];
      // ALlow for predicates
      if (e.value && typeof e.value.predicate === 'function') {
        isEqual = e.time === a.time && e.value.predicate(a.value);
      } else {
        isEqual = comparer(e, a);
      }

      if (!isEqual) {
        break;
      }
    }

    return [isEqual, createMessage(actual, expected)];
};

module.exports = {isEqual: isEqual}