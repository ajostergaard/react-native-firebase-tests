import { combineReducers } from 'redux';

import device from './device';
import tests from './tests';

export default combineReducers({
  device,
  tests,
});
