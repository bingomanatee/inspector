Inspector evaluates things using one or more tests and returns validation results. The reason I'm writing it is
that validation libraries that exist don't seem to express boolean series well -- i.e., 
"the value either doesn't exist or it meets these conditions" or "the value passes one of these tests".

## The Building Blocks

note that in this system "false is the new true"; false means a test value has passed
the expected test, but non-falsy value indicates a failure, explained by the result.

### Iffn (ifFunctions)

Inspector is built using functional principles of map-reduce. Tests are expressed in iffns -- if functions,
that create functions from the building blocks of `test, ifTrue, ifFalse`. For the purposes of validation
`false` means "no errors", the expected result of a valid variable. There is one shorthand here, testing for
type by name (as a key to the `is` module) is evaluated by iffn as `is[name], false, 'not a [name]'`. 

ifFn returns a function; also if there ifTrue and ifFalse are empty, the original function is returned.
for that reason, 

```javascript

const posFn = ifFn(a => a > 0, null, 'negative');
posFn = (value) => a > 0 ? false : 'negative';

const posFunctionTested = ifFn(posFn);
// posFunctionTested is exactly equal to posFn - it is retrned unchanged. 

const negFn = ifFn(posFn, 'positive');
// negFunction returne a value when posFn does not. 
````

### collectors 

collectors take one or more ifFn constructors and reduces and combines the result from the tests down 
using one or more methods: 

* by default it returns all the non-false results of mapping the input against the tests.
  (note -- non-falsy is literally that -- values that don't === `false`) 
* If its reducer is 'and' and ANY of the tests return a false, false is returned.
  otherwise, an array of all the results are returned.
* If the reducer is 'or' and ALL of the tests are false, false is returned. Otherwise
  an array of the FIRST non-falsy result is returned. 
* if the reducer is 'filter', and ANY of the results are true, the true ones are returned.
  Otherwise false is returned. 
  
```javascript

const isOneTwoorThree = collector(
[
  [a => a === 1, 'one'],
  [a => a === 2, 'two'],
  [a => a === 3, 'three'],
],
{ reducer: 'or' },
);

console.log(isOneTwoorThree(1)) // 'one'
console.log(isOneTwoorThree(4)) // false

const notOneTwoOrThree = collector(
  [
    [a => a === 1, false, 'one'],
    [a => a === 2, false, 'two'],
    [a => a === 3, false, 'three'],
  ],
  { reducer: 'and' },
);

console.log(notOneTwoOrThree(1)); // false
console.log(notOneTwoOrThree(4)).toEqual(['one', 'two', 'three']); // failed all the tests

```
 
The first parameter is an array. Each element in the array can be:
* a function
* a string (evaluated as a type check via Is -- see above) 
* an array [string| function, ...] as with the tests above

A single string or function can also be passed in, creating a one-test collector. 

the last two are taken as arguments and passed through `ifFn`
note that because collecters are themselves functions that evaluate to false or an array of values,
they can be passed into this first argument list. 

## The Validators

Validators are functions that return an array of all failed tests,
or false if none of the tests returned a value(indicating a valid value).

To create a validator you pass an array of functions into the 
validator class. The second argument is an object. If required is true
or a string, to be returned as the error message when not present)
then the tests pass (return false) if the value is falsy. (note this is 
javascript falsy: empty string, false, null, or undefined). 

Why talk about all the components that go into these tests? Because 
you can pass ifFns or collectors into the array of tests for the validators!
I.e., you can create a validator.

### Required is not required. 

Required, the argument to the object that is the second parameter to the validator
function can be omitted. That is because there are three scenarios for values:

* the value must be truthy (required), and non-truthy values failures 
  are an error.
* the value is not required, and falsy values shouldn't be tested. 

Note - in BOTH of these scenarios there are a class of values that won't be tested.
What if you want to test a value that is numeric but not zero?

if you say the value is required, than zero would fail automatically
because it is falsy. 

if you say it is not required, then '' would pass, because it is falsy,
and will never be tested for numeracy. 

so instead we pass NOTHING for the value of required and falsiness is not examined
by validator. 

```javascript
const v = validator([[a => a === 0, false, 'not zero']], { });

console.log(v(0)); // false
console.log(v('')); // ['not zero'];
console.log(v(1)); // ['not zero'];

```
