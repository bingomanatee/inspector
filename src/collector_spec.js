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

    describe('reducer', () => {
      it('should reduce with a reducer array', () => {
        const c = collector([a => 2 * a, a => 3 * a], [
          (a, b) => a + b,
          7,
        ]);

        expect(c(4))
          .toEqual(27);
      });

      it('should accept functional intitializer', () => {
        const c = collector(
          [a => a, a => a + 1, a => a + 2],
          [(a, b) => [...a, b], () => [0, 1, 2]],
        );

        expect(c(1)).toEqual([0, 1, 2, 1, 2, 3]);
        expect(c(3)).toEqual([0, 1, 2, 3, 4, 5]);
      });
    });

    describe('and', () => {
      const c = collector([a => a > 0, a => a % 2 === 0, a => a < 10], 'and');

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

    describe('or inclusive', () => {
      const isOneTwoorThree = collector(
        [
          [a => a === 1, 'one'],
          [a => a === 2, 'two'],
          [a => a === 3, 'three'],
        ],
        'or',
      );

      it('should return one for 1', () => {
        expect(isOneTwoorThree(1))
          .toEqual('one');
      });
      it('should return false for 4', () => {
        expect(isOneTwoorThree(4))
          .toEqual(false);
      });

      describe('and exclusive', () => {
        const notOneTwoOrThree = collector(
          [
            [a => a === 1, false, 'not one'],
            [a => a === 2, false, 'not two'],
            [a => a === 3, false, 'not three'],
          ],
          'and',
        );

        it('should return one for 1', () => {
          expect(notOneTwoOrThree(1))
            .toEqual(false);
        });
        it('should return false for 4', () => {
          expect(notOneTwoOrThree(4))
            .toEqual(['not one', 'not two', 'not three']);
        });
      });
    });

    describe('or', () => {
      const c = collector([a => a < 4, a => a % 2 === 1, a => a > 10], 'or');

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
