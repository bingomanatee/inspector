import bottle from './bottle';

const {
  ifFn, collector, validator, andFn, orFn, defineCustomFunction,
} = bottle().container;

export default validator;
export { ifFn, collector, validator, andFn, orFn, defineCustomFunction };
