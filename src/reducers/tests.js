import * as testActions from '~/actions/TestActions';
import { flatten, unflatten } from 'deeps';
import { initialState } from '~/tests';

const initState = initialState();

function tests(state = initState, action: Object): State {

  if (action.type === testActions.TEST_SET_SUITE_STATUS) {
    const flattened = flatten(state);
    if (action.status) flattened[`suites.${action.suite}.status`] = action.status;
    if (action.message) flattened[`suites.${action.suite}.message`] = action.message;
    if (action.progress) flattened[`suites.${action.suite}.progress`] = action.progress;
    if (!isNaN(action.time)) flattened[`suites.${action.suite}.time`] = action.time;
    return unflatten(flattened);
  }

  if (action.type === testActions.TEST_SET_STATUS) {
    const flattened = flatten(state);
    flattened[`descriptions.${action.suite}.${action.description}.status`] = action.status;
    flattened[`descriptions.${action.suite}.${action.description}.message`] = action.message;
    flattened[`descriptions.${action.suite}.${action.description}.time`] = action.time;
    return unflatten(flattened);
  }

  return state;
}

export default tests;
