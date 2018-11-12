import collector from './collector';

describe('inspector', () => {
  describe('collector', () => {
    it('should fail on a non-array', () => {
      expect.assertions(1);
      try {
        collector(1);
      } catch (err) {
        expect(err.message)
          .toEqual('collector must receive array');
      }
    });

    it('should return values mapped through testModule on a function', () => {
      const c = collector(a => 2 * a);
      expect(c(1))
        .toEqual([2]);
    });

    it('should map all functions passed in on an array of functions', () => {
      const c = collector([a => 2 * a, a => 3 * a]);

      expect(c(4))
        .toEqual([8, 12]);
    });

    it('should reduce with a reducer', () => {
      const c = collector([a => 2 * a, a => 3 * a], {
        reducer: [
          (a, b) => a + b,
          0,
        ],
      });

      expect(c(4))
        .toEqual(20);
    });

    describe('and', () => {
      const c = collector([a => a > 0, a => a % 2 === 0, a => a < 10], {
        reducer: 'and',
      });

      it('should return all the results if all are true', () => {
        expect(c(4))
          .toEqual([true, true, true]);
      });

      it('should return no results if one is false', () => {
        expect(c(0))
          .toEqual(false);
        expect(c(1))
          .toEqual(false);
      });

      it('should return no results if all are false', () => {
        expect(c(-1))
          .toEqual(false);
      });
    });

    describe('or', () => {
      const c = collector([a => a < 4, a => a % 2 === 1, a => a > 10], {
        reducer: 'or',
      });

      it('should return false if none of the tests are true', () => {
        expect(c(4))
          .toEqual(false);
      });

      it('should return results if one of the tests are true', () => {
        expect(c(2))
          .toEqual(true);
      });

      it('should return no results if more than one are true', () => {
        expect(c(1))
          .toEqual(true);
      });
    });
  });
});
