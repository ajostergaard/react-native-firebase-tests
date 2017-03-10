import TestSuite from '~/TestSuite';
import logTests from './log';

const suite = new TestSuite('Crash', 'firebase.crash()');

// bootstrap tests
logTests(suite);

export default suite;
