import { setSuiteStatus, setTestStatus } from '~/actions/TestActions';

const START = 'started';
const OK = 'success';
const ERR = 'error';

class BaseTest {

  constructor(name, description) {
    this.describe = this.describe.bind(this);

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

  /**
   * Make a promise callback-able to trap errors
   * @param promise
   * @param props
   * @private
   */
  _promiseToCb (promise, props) {
    return promise(props).then(result => [null, result]).catch(error => [error]);
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
   * Run the described tests
   * @returns {null}
   */
  run() {
    if (!this.reduxStore) {
      console.error(`Failed to run ${this.name} tests as no redux store has been provided`);
      return null;
    }

    const { dispatch } = this.reduxStore;
    const tests = [];

    dispatch(setSuiteStatus(this.id, START));

    // Push all tests into one array for processing
    Object.keys(this.tests).forEach((category) => {
      Object.keys(this.tests[category]).forEach((description) => {
        tests.push({
          id: this.id,
          category,
          description,
          func: this.tests[category][description]
        });
      });
    });

    return Promise
      .map(tests, async (test) => {
        dispatch(setTestStatus(this.id, test.description, START));
        const [error] = await this._promiseToCb(test.func, test);

        if (error) {
          dispatch(setTestStatus(this.id, test.description, ERR, error.message));
        } else {
          dispatch(setTestStatus(this.id, test.description, OK));
        }

        return Promise.resolve(error);
      })
      .then((results) => {
        const errors = results.filter(Boolean);

        if (errors.length) {
          dispatch(setSuiteStatus(this.id, ERR, `${errors.length} test${errors.length > 1 ? 's' : ''} has error(s).`));
        } else {
          dispatch(setSuiteStatus(this.id, OK));
        }
      })
      .catch((error) => {
        // TODO
        console.error(error);
      });
  }

}

export default BaseTest;
