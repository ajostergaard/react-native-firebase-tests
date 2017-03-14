import analytics from './analytics';
import crash from './crash';
import database from './database';
import storage from './storage';
import auth from './auth';

const tests = {
  auth,
  analytics,
  crash,
  database,
  storage,
};

/**
 * Return inital state for the tests to provide to Redux
 * @returns {{suites: {}, descriptions: {}}}
 */
export function initialState() {
  const suites = {};
  const descriptions = {};

  Object.keys(tests).forEach((key) => {
    const test = tests[key];

    // Define the test suites
    suites[test.id] = {
      id: test.id,
      name: test.name,
      description: test.description,
      categories: Object.keys(test.tests),
      status: null,
      message: null,
      time: 0,
      progress: 0,
    };

    if (!descriptions[test.id]) descriptions[test.id] = {};

    // Define all tests
    Object.keys(test.tests).forEach((category) => {
      Object.keys(test.tests[category]).forEach((description) => {
        descriptions[test.id][description] = {
          func: test.tests[category][description].toString(),
          description,
          suite: test.id,
          category,
          status: null,
          message: null,
          time: 0,
        };
      });
    });
  });

  return {
    suites,
    descriptions,
  };
}

/**
 * Provide a redux store to the test suites
 * @param store
 */
export function setupSuites(store) {
  Object.values(tests).forEach((test) => {
    test.store = store;
  });
}

/**
 *
 * @param suite
 * @param category
 * @param description
 */
export function runTest(suite, category, description) {
  const testSuite = Object.values(tests).find(t => t.id === suite || '');
  if (testSuite) {
    testSuite.runTest(category, description);
  } else {
    console.error(`runSuite: The suite "${suite}" is not defined`);
  }
}

/**
 * Run all tests in a suite
 * @param suite
 */
export function runSuite(suite) {
  const testSuite = Object.values(tests).find(t => t.id === suite || '');
  if (testSuite) {
    testSuite.run();
  } else {
    console.error(`runSuite: The suite "${suite}" is not defined`);
  }
}

/**
 * Run all tests
 */
export function runAllSuites() {
  Object.values(tests).forEach((suite) => {
    suite.run();
  });
}
