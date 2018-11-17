import ifFn from './ifFn';
import validator from './validator';

describe('inspector', () => {
  describe('ifFn', () => {
    describe('single argument', () => {
      describe('simple function', () => {
        const isZero = ifFn(a => (a === 0 ? false : 'not zero'));
        it('should pass results when given a function with no other args', () => {
          expect(isZero(0))
            .toEqual(false);
          expect(isZero(1))
            .toEqual('not zero');
        });
      });

      describe('string', () => {
        const isObject = ifFn('object');

        it('should accept objects', () => {
          expect(isObject({}))
            .toEqual(false);
        });
        it('should fail arrays', () => {
          expect(isObject([]))
            .toEqual('not an object');
        });
        it('should fail with no arg', () => {
          expect(isObject())
            .toEqual('not an object');
        });
      });
    });

    describe('one argument', () => {
      describe('simple function', () => {
        const isNotZero = ifFn(a => (a === 0 ? false : 'not zero'), 'is not zero');
        it('should pass results when given a function with no other args', () => {
          expect(isNotZero(0))
            .toEqual(false);
          expect(isNotZero(1))
            .toEqual('is not zero');
        });
      });

      describe('string', () => {
        const isObject = ifFn('object', 'is object');

        it('should reject objects', () => {
          expect(isObject({}))
            .toEqual('is object');
        });
        it('should fail arrays', () => {
          expect(isObject([]))
            .toEqual(false);
        });
        it('should fail with no arg', () => {
          expect(isObject())
            .toEqual(false);
        });
      });

      describe('functional argument', () => {
        describe('simple function', () => {
          const isNotZero = ifFn(a => (a === 0 ? false : 'not zero'), value => `${value} is not zero`);
          it('should pass results when given a function with no other args', () => {
            expect(isNotZero(0))
              .toEqual(false);
            expect(isNotZero(1))
              .toEqual('1 is not zero');
          });
        });

        describe('string', () => {
          const isObject = ifFn('object', value => `${JSON.stringify(value)} is object`);

          it('should reject objects', () => {
            expect(isObject({ a: 1 }))
              .toEqual('{"a":1} is object');
          });
          it('should fail arrays', () => {
            expect(isObject([1, 2, 3]))
              .toEqual(false);
          });
          it('should fail with no arg', () => {
            expect(isObject())
              .toEqual(false);
          });
        });
      });
    });

    describe('two arguments', () => {
      describe('basic true false test', () => {
        const isOdd = ifFn(a => a % 2, false, 'is even');

        it('should return false if odd', () => expect(isOdd(1))
          .toBeFalsy());
        it('should return result if even', () => expect(isOdd(2))
          .toEqual('is even'));
      });

      describe('basic true false test(reverse)', () => {
        const isOdd = ifFn(a => a % 2, 'is odd', false);

        it('should return false if odd', () => expect(isOdd(2))
          .toBeFalsy());
        it('should return result if even', () => expect(isOdd(1))
          .toEqual('is odd'));
      });

      describe('nested tests', () => {
        // the basic test -- assumes input is a string
        const stringIsYesOrNo = ifFn(a => /^yes|no$/.test(a), false, 'string is not yes or no');

        // executes the above IF input is a string
        const isStringAndYesOrNo = ifFn('string', stringIsYesOrNo, 'non string');
        // tests each values of the array -- assumes input is an array
        const eachElementIsYesOrNoString = list => list.reduce((m, value, index) => {
          if (m) return m;
          const error = isStringAndYesOrNo(value);
          if (error) {
            return {
              value,
              index,
              error,
            };
          }
          return false;
        }, false);
        // IF input is an array runs above tests -- otherwise fails.
        //    runs eachElementIsYesOrNoString but replaces failure message with
        //    a message about ARRAY failure

        // eslint-disable-next-line prefer-arrow-callback
        const isArrayOfYesOrNoStrings = ifFn(eachElementIsYesOrNoString, function (badValue, error) {
          return `array element ${error.index} failed - (${error.value}) ${error.error}`;
        }, false);

        // listens to the non-string branch of the root
        // if in array, runs test on each element - else fails both type tests
        const isArrayAndArrayOfYesNoStrings = ifFn('array', isArrayOfYesOrNoStrings, 'not an array or a string');

        const isYesNoStringOrArrayOfYesNoStrings = ifFn(
          'string', stringIsYesOrNo,
          isArrayAndArrayOfYesNoStrings,
        );

        it('should return true for yes', () => {
          expect(isYesNoStringOrArrayOfYesNoStrings('yes'))
            .toEqual(false);
        });

        it('should return nonBoolean for a non-yes-no', () => {
          expect(isYesNoStringOrArrayOfYesNoStrings('f'))
            .toEqual('string is not yes or no');
        });

        it('should fail if passes a non string or array');

        it('should return not an array for non array non string', () => {
          expect(isYesNoStringOrArrayOfYesNoStrings(1))
            .toEqual('not an array or a string');
        });

        it('should return false for an array of strings', () => {
          expect(isYesNoStringOrArrayOfYesNoStrings(['yes', 'no']))
            .toBeFalsy();
        });

        it('should return error if non-match in for an array', () => {
          expect(isYesNoStringOrArrayOfYesNoStrings(['yes', 'no', 'f']))
            .toEqual('array element 2 failed - (f) string is not yes or no');
        });
      });
    });
  });
});

