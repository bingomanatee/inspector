import validator from './validator';
import collector from './collector';

describe('inspector', () => {
  describe('validator', () => {
    it('should accept a basic test', () => {
      const v = validator('object', { required: false });
      expect(v({ foo: 3 }))
        .toBeFalsy();
      expect(v(3))
        .toEqual(['not an object']);
      expect(v())
        .toBeFalsy();
    });

    describe('should accept an array of tests', () => {
      const v = validator([
        'object',
        [ob => ob && ob.a > 1, false, 'ob.a <= 1'],
      ], { required: false });

      it('should pass a good object', () => {
        expect(v({ a: 2 }))
          .toBeFalsy();
      });
      it('should fail when not an object', () => {
        expect(v(3))
          .toEqual(['not an object', 'ob.a <= 1']);
      });
      it('should pass with an empty object', () => {
        expect(v())
          .toBeFalsy();
      });
    });

    describe('with required', () => {
      describe('should give feedback when missing value', () => {
        const v = validator('object', { required: true });

        it('should pass with an object', () => {
          expect(v({ foo: 3 }))
            .toBeFalsy();
        });
        it('should fail with a non-object', () => {
          expect(v(3))
            .toEqual(['not an object']);
        });
        it('should fail with no value', () => {
          expect(v())
            .toEqual(['required']);
        });
      });


      describe('should accept a test without required', () => {
        const v = validator([[a => a === 0, false, 'not zero']], { });

        it('should fail a string', () => {
          expect(v('')).toEqual(['not zero']);
        });

        it('should fail a number that is not 0 or 2', () => {
          expect(v(100)).toEqual(['not zero']);
        });

        it('should pass that is 0 or 2', () => {
          expect(v(0)).toBeFalsy();
        });
      });

      describe('should accept a collector', () => {
        const isZero = collector(
          [
            [a => a === 2, false, 'not two'],
            [a => a === 0, false, 'not zero'],
          ],
          { reducer: 'and' },
        );

        const v = validator(['number', isZero], { });

        it('should fail a string', () => {
          expect(v('bob')).toEqual(['not an number', ['not two', 'not zero']]);
        });

        it('should fail a number that is not 0 or 2', () => {
          expect(v(100)).toEqual([['not two', 'not zero']]);
        });

        it('should pass that is 0 or 2', () => {
          expect(v(0)).toBeFalsy();
        });

        it('should fail on a falsy non-zero value', () => {
          expect(v('')).toEqual(['not an number', ['not two', 'not zero']]);
        });
      });

      describe('should accept an array of tests', () => {
        const v = validator([
          'object',
          [ob => ob.a > 1, false, 'ob.a <= 1'],
        ], { required: true });

        it('should pass with a big object', () => {
          expect(v({ a: 2 }))
            .toBeFalsy();
        });

        it('should fail on a non-object', () => {
          expect(v(3))
            .toEqual(['not an object', 'ob.a <= 1']);
        });

        it('should fail in no data', () => {
          expect(v())
            .toEqual(['required']);
        });
      });
    });
  });
});
