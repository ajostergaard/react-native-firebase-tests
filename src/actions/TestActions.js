export const TEST_SET_SUITE_STATUS: string = 'TEST_SET_SUITE_STATUS';
export const TEST_SET_STATUS: string = 'TEST_SET_STATUS';

export function setSuiteStatus(suite, status, message = null) {
  return {
    type: TEST_SET_SUITE_STATUS,
    suite,
    status,

  };
}

export function setTestStatus(suite, description, status, message = null) {
  return {
    type: TEST_SET_STATUS,
    suite,
    description,
    status,
    message,
  };
}
