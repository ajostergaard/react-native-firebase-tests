import TestSuite from '~/TestSuite';
import analyticsTests from './analytics';

const suite = new TestSuite('Analytics', 'firebase.analytics()');

// bootstrap tests
analyticsTests(suite);

export default suite;
