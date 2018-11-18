const FN_RE = /^fn:/;

export default (bottle) => {
  bottle.factory('ifFn', ({ strToFn, Is }) => (crit, onSucceed = false, onFail = false) => {
    let rule = crit;
    if (Is.string(crit)) {
      if (!onFail && !onSucceed) onFail = `not an ${rule}`;
      rule = strToFn(crit);
    }
    if (!onSucceed && !onFail) return rule;

    let success;
    if (Is.function(onSucceed)) {
      success = onSucceed;
    } else if (Is.string(onSucceed) && FN_RE.test(onSucceed)) {
      success = strToFn(onSucceed.replace(FN_RE, ''));
    } else {
      success = () => onSucceed;
    }
    let failure;
    if (Is.function(onFail)) {
      failure = onFail;
    } else if (Is.string(onFail) && FN_RE.test(onFail)) {
      failure = strToFn(onFail.replace(FN_RE, ''));
    } else {
      failure = () => onFail;
    }

    if (!Is.function(rule)) {
      console.log('bad rule ', rule, crit, onSucceed, onFail);
      throw new Error('bad rule');
    }
    return (value) => {
      const result = rule(value);
      return (result ? success(value, result) : failure(value, result));
    };
  });
};
