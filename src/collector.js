import Is from 'is';
import ifFn from './ifFn';

export default (tests, reducer = false) => {
  let lTests = tests;
  if (typeof tests === 'function') lTests = [tests];
  if (!Array.isArray(lTests)) {
    throw new Error('collector must receive array');
  }
  if (!lTests.length) return () => false;

  lTests = lTests.map((crit) => {
    if (Array.isArray(crit)) {
      return ifFn(...crit);
    }
    return Is.string(crit) ? ifFn(crit) : crit;
  });
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
    return (value) => {
      const values = mapper(value);
      const [fn, initial] = reducer;
      return values.reduce(fn, (Is.function(initial) ? initial() : initial));
    };
  } else if (typeof reducer === 'function') {
    return (value) => {
      const values = mapper(value);
      return values.reduce(reducer);
    };
  }

  const collector = value => mapper(value)
    .filter(a => a !== false);

  if (reducer === 'and') {
    /**
     * returns all the result until a false value is found,
     * in which case false is returned.
     * put another way, returns false unless all the tests
     * fail (every test returns a result.)
     * skips all the other tests. (all errors unless any success)
     */
    return value => lTests.reduce((results, fn) => {
      if (!results) return results;
      const fnResult = fn(value);
      if (fnResult === false) return false;
      return [...results, fnResult];
    }, []);
  } else if (reducer === 'or') {
    /**
     * returns the first positive result, skipping other tests
     * (first error);
     */
    return value => lTests.reduce((result, fn) => {
      if (result) return result;
      if (!Is.function(fn)) {
        console.log('collector test is not a function: ', fn);
      }
      return fn(value);
    }, false);
  }
  /**
   * returns false unless any of the tests return true,
   * in which case all the test results are returned.
   * like or, except it doesn't stop at the first positive result.
   */
  return (value) => {
    const results = collector(value);
    return results.length > 0 ? results : false;
  };
};


/**

 To explain these here are the results for the same tests


 results          or            and          filter(default)
 -----------------------------------------------------

 []               false          false        false

 a b c d           a            [a b c d]    [a b c d]
 b c d
 not tested

 a => false b c d  b             false        [b c d]
 c d           b c d
 not tested    not tested

 a b c => false d  a             false        [a b d]
 b c d         d
 not tested    not tested

 */
