
export default (bottle) => {
  bottle.factory('argsToArray', () => (...args) => {
    if (Array.isArray(args[0])) return args[0];
    return args;
  });

  bottle.factory('andFn', ({ collector, argsToArray }) => (...tests) => collector(argsToArray(tests), 'and'));
  bottle.factory('orFn', ({ collector, argsToArray }) => (...tests) => collector(argsToArray(tests), 'or'));
};
