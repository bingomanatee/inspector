import Bottle from 'bottlejs';
import Is from 'is';

import collector from './collector';
import customize from './customize';
import parseTests from './parseTests';
import bool from './bool';
import ifFn from './ifFn';
import validator from './validator';

export default () => {
  const bottle = new Bottle();
  bottle.constant('Is', Is);
  collector(bottle);
  customize(bottle);
  bool(bottle);
  parseTests(bottle);
  ifFn(bottle);
  validator(bottle);
  return bottle;
};
