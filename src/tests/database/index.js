import TestSuite from '../../TestSuite';

/*
  Test suite files
 */

import snapshotTests from './snapshot';
import refTestGroups from './ref/index';

const suite = new TestSuite('Database', 'firebase.database()', { concurrency: 1 });

/*
  Register tests with test suite
 */

refTestGroups(suite);

snapshotTests(suite);

export default suite;

