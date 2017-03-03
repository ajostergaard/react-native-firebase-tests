import database from './database';
import storage from './storage';

const tests = {
  database,
  storage,
};

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
        };
      });
    });
  });

  return {
    tests: {
      suites,
      descriptions,
    },
  }
}

export function run(suite) {
  tests[suite].run();
}

export default function setupTests(store) {
  Object.values(tests).forEach((test) => {
    test.store = store;
  });
}
