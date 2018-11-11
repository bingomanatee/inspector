import Is from 'is';

import { NOT_ABSENT } from './constants';
import collector from './collector';
import test from './test';

export default (tests, { required = false, onFail = false }) => {
  let testList;
  if (Array.isArray(tests)) {
    testList = tests.map(crit => (Array.isArray(crit) ? crit : [crit, onFail]));
  } else if (Is.object(tests)) {
    testList = Object.keys(tests).map(ifFail => [tests[ifFail], ifFail]);
  } else {
    testList = [[tests, onFail]];
  }

  const validationTests = testList.map(args => test(...args));

  if (!required) {
    return collector([test(a => a, NOT_ABSENT), collector(validationTests, 'or')], { reducer: 'and' })[1];
  }
  const requredMsg = (is.string(required)) ? required : 'required';
  validationTests.unshift([a => a, requredMsg]);
  return collector(validationTests, 'or');
};
