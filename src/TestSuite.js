import { setSuiteStatus, setTestStatus } from '~/actions/TestActions';
import firebase from '~/firebase';

const RUN_STATUS = {
  START: 'started',
  OK: 'success',
  ERR: 'error'
};

class TestSuite {

  constructor(name, description, { concurrency }: Object = { concurrency: 10 }) {

    this.after = this.after.bind(this);
    this.before = this.before.bind(this);
    this.describe = this.describe.bind(this);
    this.afterEach = this.afterEach.bind(this);
    this.beforeEach = this.beforeEach.bind(this);

    this.tests = {};
    this.reduxStore = null;

    this.firebase = firebase;

    this.name = name;
    this.concurrency = concurrency;
    this.description = description;

    this.id = name.toLowerCase().replace(/\s/g, '-');
  }

  /**
   * Assign the redux store
   * @param store
   */

  set store(store) {
    this.reduxStore = store;
  }

  before(func) {
    this.beforeFunc = func;
  }

  beforeEach(func) {
    this.beforeEachFunc = func;
  }

  afterEach(func) {
    this.afterEachFunc = func;
  }

  after(func) {
    this.afterFunc = func;
  }

  /**
   * Describe a new test
   * @param description
   * @param categoryOrTest
   * @param test
   * @returns {null}
   */

  describe(description, categoryOrTest, test = undefined) {

    if (!description) {
      testDefinitionError(`Test detected in ${this.name} without description.`);
      return null;
    }

    const [testFunction, category] = function(){
      if (typeof categoryOrTest === 'string') {
        return [test, categoryOrTest];
      } else {
        return [categoryOrTest, 'default'];
      }
    }();

    if (!testFunction || typeof testFunction !== 'function') {
      testDefinitionError(`Invalid test function for "${description}".`);
      return null;
    }

    this.tests[category] = this.tests[category] || {};

    if (this.tests[category][description]) {
      testDefinitionError(`Test "${description}" already defined in the ${this.name} test suite.`);
      return null;
    }

    this.tests[category][description] = testFunction;
  }

  /**
   * Run all the described tests
   * @returns {null}
   */

  run() {
    const tests = [];

    // Push all tests into one array for processing

    Object.keys(this.tests).forEach((category) => {

      Object.keys(this.tests[category]).forEach((description) => {
        tests.push({
          suite: this.id,
          category,
          description,
          func: this.tests[category][description]
        });
      });

    });

    this._start(tests);
  }

  /**
   * Run a specific test
   * @param category
   * @param description
   * @returns {null}
   */

  runTest(category, description) {
    const testFunction = this.tests[category] && this.tests[category][description];

    if (!testFunction) {
      testRuntimeError(`runTest: Test "${description}" in category "${category}" not found`);
      return null;
    }

    this._start([{
      suite: this.id,
      category,
      description,
      func: testFunction
    }]);
  }

  /**
   * Try catch for callbacks - sends error to provided reject.
   * @returns {{}}
   * @private
   */
  tryCatch(cb, reject) {
    return (...args) => {
      try {
        cb(...args);
      } catch (error) {
        reject(error);
      }
    }
  }

  /**
   * @param tests
   * @returns {null}
   * @private
   */

  _start = async(tests) => {

    if (!this.reduxStore) {
      testRuntimeError(`Failed to run ${this.name} tests as no Redux store has been provided`);
      return null;
    }

    const dispatch = this.reduxStore.dispatch;
    const totalTests = tests.length;

    dispatch(setSuiteStatus({
      suite: this.id,
      status: RUN_STATUS.START,
      progress: 0,
      time: 0
    }));

    // Start timing

    const suiteStart = Date.now();
    let completedTests = 0;

    this._runLifecycle('before');

    return Promise
      .map(tests, async(test) => {

        dispatch(
          setTestStatus({
            suite: this.id,
            description: test.description,
            status: RUN_STATUS.START
          })
        );

        const testStart = Date.now();

        this._runLifecycle('beforeEach');

        // Catch synchronous errors

        const syncResultOrPromise = _tryCatcher(
          test.func.bind(null, [ test, this.reduxStore.getState() ])
        );

        let error = null;

        if (syncResultOrPromise.error) {
          synchronousError = syncResultOrPromise.error;
          error = synchronousError;
        } else {
          asynchronousError = await _promiseToCb(syncResultOrPromise.value);
          error = asynchronousError;
        }

        // Update suite progress

        completedTests += 1;

        dispatch(setSuiteStatus({
          suite: this.id,
          progress: (completedTests / totalTests) * 100,
        }));

        if (error) {

          dispatch(setTestStatus({
            suite: this.id,
            description: test.description,
            status: RUN_STATUS.ERR,
            message: `${error.name}: ${error.message}`
          }));

        } else {

          dispatch(setTestStatus({
            suite: this.id,
            description: test.description,
            status: RUN_STATUS.OK,
            time: Date.now() - testStart
          }));
        }

        this._runLifecycle('afterEach');

        return Promise.resolve(error);

      }, { concurrency: this.concurrency })

      .then((results) => {
        const errors = results.filter(Boolean);

        if (errors.length) {

          dispatch(setSuiteStatus({
            suite: this.id,
            status: RUN_STATUS.ERR,
            time: Date.now() - suiteStart,
            message: `${errors.length} test${errors.length > 1 ? 's' : ''} has error(s).`,
          }));

        } else {
          dispatch(setSuiteStatus({ suite: this.id, status: RUN_STATUS.OK, time: Date.now() - suiteStart }));
        }

      })

      .catch((error) => {

        dispatch(setSuiteStatus({
          suite: this.id,
          status: RUN_STATUS.ERR,
          time: Date.now() - suiteStart,
          message: `Test suite failed: ${error.message}`,
        }));

      })

      .finally(() => {
        this._runLifecycle('after');
        return Promise.resolve();
      });
  };

  /**
   * Run a hook
   * @param name
   * @returns {Promise.<null>}
   * @private
   */

  _runLifecycle = async(name) => {

    const lifeCycleFunction = this[`${name}Func`];

    if (lifeCycleFunction && typeof lifeCycleFunction === 'function') {

      let promiseOrRes = _tryCatcher(lifeCycleFunction);

      if (promiseOrRes.error) {
        testRuntimeError(`Error occurred during "${this.name}" ${name} lifecycle method`, promiseOrRes.error.message);
        return null;
      } else {
        promiseOrRes = promiseOrRes.value;

        if (promiseOrRes && promiseOrRes.then && typeof promiseOrRes.then === 'function') {
          await promiseOrRes;
        }
      }

    }

  };

}

/**
 * Make a promise callback-able to trap errors
 * @param promise
 * @param test
 * @param state
 * @private
 */

function _promiseToCb(promise) {
  let returnValue = null;

  try {

    returnValue = Promise.resolve(promise)
      .then(result => null, error => Promise.resolve(error))
      .catch(error => Promise.resolve(error));

  } catch (error) {
    returnValue = Promise.resolve(error);
  }

  return returnValue;
}


/**
 * Try catch to object
 * @returns {{}}
 * @private
 */

function _tryCatcher(func) {
  const result = {};

  try {
    result.value = func();
  } catch (e) {
    result.error = e;
  }

  return result;
}

function testDefinitionError(error) {
  console.error('ReactNativeFirebaseTests.TestDefinitionError: ' + error);
  console.error('This test was ignored.')
}

function testRuntimeError(error) {
  console.error('ReactNativeFirebaseTests.TestRuntimeError: ' + error);
}


export default TestSuite;
