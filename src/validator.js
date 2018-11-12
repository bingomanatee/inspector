import Is from 'is';

import { NOT_ABSENT } from './constants';
import collector from './collector';
import ifFn from './ifFn';

export default (tests, { required = false, onFail = false }) => {
  let testList;
  if (Array.isArray(tests)) {
    testList = tests.map(crit => (Array.isArray(crit) ? crit : [crit, false, onFail]));
  } else if (Is.object(tests)) {
    testList = Object.keys(tests).map(ifFail => [tests[ifFail], false, ifFail]);
  } else {
    testList = [[tests, false, onFail]];
  }

  const validationTests = testList.map(args => ifFn(...args));

  if (!required) {
    return value => collector(
      [
        ifFn(a => a, NOT_ABSENT),
        collector(validationTests, { reducer: 'filter' }),
      ],
      { reducer: 'and' },
    )(value)[1] || false;
  }
  const requiredMsg = (Is.string(required)) ? required : 'required';
  const compound = collector(
    [
      ifFn(a => a, false, [requiredMsg]),
      collector(validationTests, { reducer: 'filter' }),
    ],
    { reducer: 'or' },
  );
  return value => compound(value);
};
