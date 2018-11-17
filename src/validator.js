import Is from 'is';

import { NOT_ABSENT, REQUIRED_NOT_SET } from './constants';
import collector from './collector';
import ifFn from './ifFn';
import parseTests from './parseTests';

/**
 * The tests passed in to Validator can be one of may formats:
 *
 * if it is an array:
 *    if onFail is set:
 *       each sub-array will be composed into an ifFn
 *       each function in tests will be composed into an ifFn, using onFail as the failure case
 *    otherwise:
 *       each sub-array will be composed into an ifFn
 *       each function will be returned un-altered
 * if it is a function
 *    if onFail is set
 *       the function will be composed into a one-item array of an ifFn
 *    else
 *       the function will be put in an array un-altered.
 *
 * so in sum, onFail will reverse the output of functions in an array,
 * or a single passed function.
 *
 * @param tests {variant}
 * @param required {boolean?}
 * @param onFail {truthy string, optional}
 * @returns {function}
 */
export default (tests, config = {}) => {
  const { required = REQUIRED_NOT_SET, onFail = false } = config;
  const testList = parseTests(tests, onFail);

  if (!Array.isArray(testList)) {
    console.log('tests not turned into an array:', tests, testList);
    throw new Error('cannot array-ify ', tests);
  }
  const validationTests = testList.map((args) => {
    if (Array.isArray(args)) return ifFn(...args);
    return ifFn(args);
  });
  let compound;
  if (!required) {
    compound = value => collector(
      [
        ifFn(a => a, NOT_ABSENT),
        collector(validationTests, 'or'),
      ],
      'and',
    )(value)[1] || false;
  } else if (required === REQUIRED_NOT_SET) {
    compound = collector(validationTests, 'or');
  } else {
    const requiredMsg = (Is.string(required)) ? required : 'required';
    validationTests.unshift([a => a, false, requiredMsg]);
    compound = collector(validationTests, 'or');
  }

  return (value) => {
    let result = compound(value);
    if (result && !Array.isArray(result)) result = [result];
    return result;
  };
};
