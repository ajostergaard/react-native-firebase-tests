import typeTests from './types';
import TestSuite from '~/TestSuite';
import errorHandlingTests from './errorHandling';

const suite = new TestSuite('Realtime Database', 'firebase.database()');

// bootstrap tests
typeTests(suite);
errorHandlingTests(suite);

export default suite;

