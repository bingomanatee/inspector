import Is from 'is';
import testModule from './ifFn';

export default (tests, { reducer } = {}) => {
  let lTests = tests;
  if (typeof tests === 'function') lTests = [tests];
  if (!Array.isArray(lTests)) {
    throw new Error('collector must receive array');
  }

  lTests = lTests.map(crit => (Array.isArray(crit) ? testModule(...crit) : crit));
  const mapper = value => lTests.map((crit) => {
    try {
      return crit(value);
    } catch (err) {
      console.log('error in test ', crit, err);
      throw err;
    }
  });

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
    return value => lTests.reduce((error, crit) => {
      if (error) return error;
      if (!Is.function(crit)) {
        console.log('collector test is not a function: ', crit);
      }
      return crit(value);
    }, false);
  } else if (reducer === 'filter') {
    return (value) => {
      const results = collector(value);
      return results.length > 0 ? results : false;
    };
  }
  return collector;
};
