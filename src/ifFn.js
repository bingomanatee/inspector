import Is from 'is';

const ifFn = (crit, onSucceed = false, onFail = false) => {
  let rule = crit;
  if (Is.string(rule)) {
    if (!onFail && !onSucceed) onFail = `not an ${rule}`;
    rule = Is[rule];
  }
  if (!onSucceed && !onFail) return rule;

  const success = Is.function(onSucceed) ? onSucceed : () => onSucceed;
  const failure = Is.function(onFail) ? onFail : () => onFail;

  if (!Is.function(rule)) {
    console.log('bad rule ', rule, crit, onSucceed, onFail);
    throw new Error('bad rule');
  }
  return (value) => {
    const result = rule(value);
    return (result ? success(value, result) : failure(value, result));
  };
};

export default ifFn;
