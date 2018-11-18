import bottleFn from './bottle';

describe('inspector', () => {
  let parseTests;
  beforeEach(() => {
    const bottle = bottleFn();
    parseTests = bottle.container.parseTests;
  });

  describe('parseTests', () => {
    const pos = a => a >= 0;
    const even = a => a % 2;
    describe('without onFail', () => {
      it('should compose a single string into an array', () => {
        expect(parseTests('object'))
          .toEqual(['object']);
      });

      it('should compose a function into an array', () => {
        expect(parseTests(pos)).toEqual([pos]);
      });

      it('should compose a string in an array unaltered', () => {
        expect(parseTests(['object']))
          .toEqual(['object']);
      });

      it('should compose an array of arrays unaltered', () => {
        expect(parseTests([
          [pos, false, 'negative'],
          [even, false, 'odd'],
        ])).toEqual([
          [pos, false, 'negative'],
          [even, false, 'odd'],
        ]);
      });
    });
    describe('with onFail', () => {
      it('should compose a single string into an array', () => {
        expect(parseTests('object', 'bad'))
          .toEqual([['object', false, 'bad']]);
      });

      it('should compose a function into an array', () => {
        expect(parseTests(pos, 'bad')).toEqual([[pos, false, 'bad']]);
      });

      it('should compose a string in an array unaltered', () => {
        expect(parseTests(['object'], 'bad'))
          .toEqual([['object', false, 'bad']]);
      });

      it('should compose an array of arrays unaltered', () => {
        expect(parseTests([
          [pos, false, 'negative'],
          [even, false, 'odd'],
        ], 'bad')).toEqual([
          [pos, false, 'negative'],
          [even, false, 'odd'],
        ]);
      });
    });
  });
});
