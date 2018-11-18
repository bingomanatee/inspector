

export default (bottle) => {
  bottle.factory('parseTests', ({ Is }) => (tests, onFail) => {
    let testList;
    if (Array.isArray(tests)) {
      if (onFail) {
        testList = tests.map((testItem) => {
          if (Is.function(testItem) || Is.string(testItem)) return [testItem, false, onFail];
          return testItem;
        });
      } else {
        testList = tests;
      }
    } else if (Is.object(tests)) {
      if (!onFail) throw new Error('cannot take an object as a validator without an onFail');
      testList = Object.keys(tests).map(ifFail => [tests[ifFail], false, onFail]);
    } else if ((typeof tests === 'function') || (Is.string(tests))) {
      if (onFail) {
        testList = [[tests, false, onFail]];
      } else {
        testList = [tests];
      }
    }

    return testList;
  });
};
