import Is from 'is';
import collector from './collector';
import { DEFAULT_MAP_RESULT } from './constants';

const test = ({
  rule, outcome: onSucceed = true, defaultOutcome = true, onFail = false, name = null, collectType = 'or',
}) => {
  if (Array.isArray(rule)) {
    rule = collector(rule, { reducer: collectType });
  }

  let tester = rule;
  if (onSucceed) {
    if (Is.string(onSucceed)) {
      tester = value => (rule(value) ? onSucceed : onFail);
    } else if (onSucceed instanceof Map) {
      if (!onSucceed.has(DEFAULT_MAP_RESULT)) {
        onSucceed.set(DEFAULT_MAP_RESULT, defaultOutcome || true);
      }
      tester = (value) => {
        const result = rule(value);
        if (!onSucceed.has(result)) {
          return onSucceed.get(DEFAULT_MAP_RESULT);
        }
        return onSucceed.get(result);
      };
    } else if (Is.function(onSucceed)) {
      tester = value => onSucceed(rule(value));
    } else tester = value => (rule(value) ? onSucceed : onFail);
  }

  if (name) {
    return value => ({
      name,
      result: tester(value),
    });
  }
  return tester;
};

export default test;
