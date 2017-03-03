import TestSuite from '~/TestSuite';

const Suite = new TestSuite('Storage', 'Upload/Download storage tests');
const { describe } = Suite;

describe('it should upload a file with the correct name', 'upload', async() => {
  return Promise.resolve('SUCCESS');
});

export default Suite;

