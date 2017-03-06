export const TEST_SET_SUITE_STATUS: string = 'TEST_SET_SUITE_STATUS';
export const TEST_SET_STATUS: string = 'TEST_SET_STATUS';

export function setSuiteStatus({ suite, status, time, message, progress }) {
  return {
    type: TEST_SET_SUITE_STATUS,
    suite,
    status,
    message,
    time,
    progress,
  };
}

export function setTestStatus({ suite, description, status, time = 0, message = null }) {
  return {
    type: TEST_SET_STATUS,
    suite,
    description,
    status,
    message,
    time,
  };
}
