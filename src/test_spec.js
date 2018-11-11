import test from './test';

describe('inspector', () => {
  describe('test', () => {
    it('should return basic function without succeed/fail', () => {
      const c = test(a => a > 4);

      expect(c(3))
        .toEqual(false);
      expect(c(5))
        .toEqual(true);
    });
    it('should return success result on true with succeed', () => {
      const c = test(a => a > 4, 'greater than 4');

      expect(c(3))
        .toEqual(false);
      expect(c(5))
        .toEqual('greater than 4');
    });

    it('should return error message on fail with onFail', () => {
      const c = test(a => a > 4, false, 'lte 4');
      expect(c(3))
        .toEqual('lte 4');
      expect(c(5))
        .toEqual(false);
    });

    it('should return either messages if both are present', () => {
      const c = test(a => a > 4, 'gt4', 'lte 4');
      expect(c(3))
        .toEqual('lte 4');
      expect(c(5))
        .toEqual('gt4');
    });

    it('should accept success function', () => {
      const c = test(a => a > 4, value => `${value} is greater than 4`);

      expect(c(3))
        .toEqual(false);
      expect(c(5))
        .toEqual('5 is greater than 4');
    });

    it('should accept failure function', () => {
      const c = test(a => a > 4, false, value => `${value} is not greater than 4`);
      expect(c(3))
        .toEqual('3 is not greater than 4');
      expect(c(5))
        .toEqual(false);
    });

    describe('with type tests', () => {
      it('should return standard failure message without succeed/fail', () => {
        const c = test('array');

        expect(c(3))
          .toEqual('not an array');
        expect(c([3]))
          .toEqual(false);
      });
      it('should return success result on true with succeed', () => {
        const c = test('array', 'is array');

        expect(c(3))
          .toEqual(false);
        expect(c([3]))
          .toEqual('is array');
      });

      it('should return error message on fail with onFail', () => {
        const c = test('array', false, 'not an array');
        expect(c(3))
          .toEqual('not an array');
        expect(c([3]))
          .toEqual(false);
      });

      it('should return either messages if both are present', () => {
        const c = test('array', 'array', 'not array');
        expect(c(3))
          .toEqual('not array');
        expect(c([3]))
          .toEqual('array');
      });
    });
  });
});
