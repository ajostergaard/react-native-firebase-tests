import { setSuiteStatus, setTestStatus } from '~/actions/TestActions';

const START = 'started';
const OK = 'success';
const ERR = 'error';

class BaseTest {

  constructor(name, description) {
    this.describe = this.describe.bind(this);
    this.before = this.before.bind(this);
    this.beforeEach = this.beforeEach.bind(this);
    this.afterEach = this.afterEach.bind(this);
    this.after = this.after.bind(this);

    this.id = name.toLowerCase().replace(/\s/g, '-');
    this.name = name;
    this.description = description;
    this.tests = {};
    this.reduxStore = null;

    this.firebase = {
      web: '',
      native: '',
    };
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
   * Make a promise callback-able to trap errors
   * @param promise
   * @param test
   * @param state
   * @private
   */
  _promiseToCb (promise, test, state) {
    return promise(test, state).then(result => [null, result]).catch(error => [error]);
  }

  /**
   * Try catch to object
   * @param fn
   * @returns {{}}
   * @private
   */
  _tryCatcher(fn) {
    const result = {};
    try {
      result.value = fn();
    } catch (e) {
      result.error = e;
    }
    return result;
  }

  /**
   * Describe a new test
   * @param description
   * @param category
   * @param test
   * @returns {null}
   */
  describe(description, category, test) {
    if (!description) {
      console.error(`A test in the ${this.name} suite has no description`);
      return null;
    }

    const func = typeof category === 'string' ? test : category;
    const cat = typeof category === 'string' ? category : 'default';

    if (!func || typeof func !== 'function') {
      console.error(`Test "${description}" has not been given a valid test function`);
      return null;
    }

    if (!this.tests[cat]) this.tests[cat] = {};

    if (this.tests[cat][description]) {
      console.error(`Test "${description}" is already defined in the ${this.name} test suite`);
      return null;
    }

    this.tests[cat][description] = func;
  }

  /**
   * Run a hook
   * @param name
   * @returns {Promise.<null>}
   * @private
   */
  _runLifecycle = async (name) => {
    if (this[`${name}Func`] && typeof this[`${name}Func`] === 'function') {
      let promiseOrRes = this._tryCatcher(this[`${name}Func`]);
      if (promiseOrRes.error) {
        console.error(`An error occurred during the "${this.name}" ${name} lifecycle method`, promiseOrRes.error.message);
        return null;
      }

      promiseOrRes = promiseOrRes.value;
      if (promiseOrRes && promiseOrRes.then && typeof promiseOrRes.then === 'function') {
        await promiseOrRes;
      }
    }
  };

  /**
   *
   * @param tests
   * @returns {null}
   * @private
   */
  _start = async (tests) => {
    if (!this.reduxStore) {
      console.error(`Failed to run ${this.name} tests as no redux store has been provided`);
      return null;
    }

    const dispatch = this.reduxStore.dispatch;
    const totalTests = tests.length;

    dispatch(setSuiteStatus({
      suite: this.id,
      status: START,
      progress: 0,
      time: 0,
    }));

    // Start timing
    const suiteStart = Date.now();
    let completedTests = 0;

    this._runLifecycle('before');

    return Promise
      .map(tests, async (test) => {
        dispatch(setTestStatus({ suite: this.id, description: test.description, status: START }));
        const testStart = Date.now();

        this._runLifecycle('beforeEach');
        const [error] = await this._promiseToCb(test.func, test, this.reduxStore.getState());

        // Update suite progress
        completedTests += 1;
        dispatch(setSuiteStatus({
          suite: this.id,
          progress: (completedTests / totalTests) * 100,
        }));

        if (error) {
          dispatch(setTestStatus({ suite: this.id, description: test.description, status: ERR, message: error.message }));
        } else {
          dispatch(setTestStatus({ suite: this.id, description: test.description, status: OK, time: Date.now() - testStart }));
        }

        this._runLifecycle('afterEach');
        return Promise.resolve(error);
      })
      .then((results) => {
        const errors = results.filter(Boolean);

        if (errors.length) {
          dispatch(setSuiteStatus({
            suite: this.id,
            status: ERR,
            time: Date.now() - suiteStart,
            message: `${errors.length} test${errors.length > 1 ? 's' : ''} has error(s).`,
          }));
        } else {
          dispatch(setSuiteStatus({ suite: this.id, status: OK, time: Date.now() - suiteStart }));
        }
      })
      .catch((error) => {
        dispatch(setSuiteStatus({
          suite: this.id,
          status: ERR,
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
   * Run a specific test
   * @param category
   * @param description
   * @returns {null}
   */
  runTest(category, description) {
    if (!this.tests[category] || !this.tests[category][description]) {
      console.error(`runTest: Test "${description}" in category "${category}" not found`);
      return null;
    }

    this._start([{
      suite: this.id,
      category,
      description,
      func: this.tests[category][description]
    }]);
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

}

export default BaseTest;
