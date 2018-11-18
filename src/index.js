import bottle from './bottle';

const {
  ifFn, collector, validator, andFn, orFn, defineCustomFunction,
} = bottle().container;

const factory = (modifier) => {
  const myBottle = bottle();
  if (modifier) modifier(myBottle);
  return (myBottle().container);
};

export default validator;
export {
  ifFn,
  collector,
  validator,
  andFn,
  orFn,
  defineCustomFunction,
  factory,
};
