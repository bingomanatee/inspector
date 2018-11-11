export default (tests, { reducer, named = false }) => {
  if (!Array.isArray(tests)) {
    throw new Error('collector must receive array');
  }

  if (named) {
    const mapper = value => tests.map(test => value(test));
    if (!reducer) return mapper;
    if (typeof reducer === 'function') {
      return value => mapper(value).reduce(reducer);
    } else if (reducer === 'and') {
      return value => !!mapper(value).reduce((m, v) => ((!m) || (!v.value)), true);
    } else if (reducer === 'or') {
      return value => !!mapper(value).reduce((m, v) => (m || v.value), false);
    }
    throw new Error('strange reducer ', reducer);
  } else {
    const mapper = value => tests.map(test => value(test));
    if (!reducer) return mapper;
    if (typeof reducer === 'function') {
      return value => mapper(value).reduce(reducer);
    } else if (reducer === 'and') {
      return value => !!mapper(value).reduce((m, v) => ((!m) || (!v)), true);
    } else if (reducer === 'or') {
      return value => !!mapper(value).reduce((m, v) => (m || v), false);
    }
    throw new Error('strange reducer ', reducer);
  }
};
