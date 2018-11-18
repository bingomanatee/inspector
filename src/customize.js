/**
 * strToFnFactory returns a closured context in which a custom function collection can be generated.
 *
 * For "quick and dirty" global definitions the closured properties for a singleton instance of
 * one are exposed as module properties.
 * @returns {{define: define, strToFn: strToFn, customFunctions: Map<any, any>, clear: (function(): Map<any, any>)}}
 */

export default (bottle) => {
  bottle.factory('customFunctions', () => new Map());

  bottle.factory('defineCustomFunction', ({ customFunctions, Is }) => (name, fn) => {
    if (!(name && Is.string(name))) throw new Error(`bad define name: ${name}`);
    if (!(fn && Is.function(fn))) throw new Error(`bad define function for ${name}`);

    customFunctions.set(name, fn);
  });

  bottle.factory('clearCustomFunctions', ({ customFunctions }) => () => customFunctions.clear());

  bottle.factory('strToFn', ({ customFunctions, Is }) => (name) => {
    if (!(name && Is.string(name))) throw new Error(`bad strToFn name: ${name}`);
    if (customFunctions.has(name)) return customFunctions.get(name);
    if (Is[name]) return Is[name];

    throw new Error(`bad function string: ${name}`);
  });
};
