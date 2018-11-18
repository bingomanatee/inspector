import bottleFn from './bottle';

describe('inspector', () => {
  let ifFn;
  let defineCustomFunction;
  describe('customization', () => {
    beforeEach(() => {
      let bottle = bottleFn();
      defineCustomFunction = bottle.container.defineCustomFunction;
      ifFn = bottle.container.ifFn;
    });

    it('should remember custom functions for use in iffn', () => {
      defineCustomFunction('sq', ifFn(
        n => n >= 0,
        (n) => {
          const rem = Math.sqrt(n) % 1;
          return (rem ? 'not a perfect square' : false);
        },
        'is negative',
      ));

      const isAPerfectSquare = ifFn('sq', n => `${n} is not a perfect square`);

      expect(isAPerfectSquare(-1))
        .toEqual('-1 is not a perfect square');
      expect(isAPerfectSquare(3))
        .toEqual('3 is not a perfect square');
      expect(isAPerfectSquare(4))
        .toBeFalsy();
    });
  });
});
