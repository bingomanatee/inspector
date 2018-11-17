import collector from './collector';

const argsToArray = (...args) => {
  if (Array.isArray(args[0])) return args[0];
  return args;
};

const andFn = (...tests) => collector(argsToArray(tests), 'and');
const orFn = (...tests) => collector(argsToArray(tests), 'or');

export { andFn, orFn };
