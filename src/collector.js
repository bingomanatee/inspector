import test from './test';

export default (tests, { reducer } = {}) => {
  let lTests = tests;
  if (typeof tests === 'function') lTests = [tests];
  if (!Array.isArray(lTests)) {
    throw new Error('collector must receive array');
  }

  const mapper = value => lTests.map(test => test(value));

  if (!reducer) return mapper;
  if (Array.isArray(reducer)) {
    return value => mapper(value).reduce(...reducer);
  } else if (typeof reducer === 'function') {
    return value => mapper(value)
      .reduce(reducer);
  }

  const collector = value => mapper(value)
    .filter(a => a !== false);

  if (reducer === 'and') {
    return (value) => {
      const results = collector(value);
      return results.length !== tests.length ? false : results;
    };
  } else if (reducer === 'or') {
    return (value) => {
      const results = collector(value);
      return results.length > 0 ? results : false;
    };
  }
  return collector;
};
