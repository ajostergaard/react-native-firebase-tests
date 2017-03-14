import typeTests from './types';
import snapshotTests from './snapshot';
import TestSuite from '~/TestSuite';
import errorHandlingTests from './errorHandling';

const suite = new TestSuite('Database', 'firebase.database()', { concurrency: 1 });

// bootstrap tests
snapshotTests(suite);
typeTests(suite);
errorHandlingTests(suite);

export default suite;

