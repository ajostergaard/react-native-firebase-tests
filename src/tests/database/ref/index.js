import onTests from './on';
import offTests from './off';
import onceTests from './once';
import setTests from './set';
import updateTests from './update';
import removeTests from './remove';
import pushTests from './push';
import factoryTests from './factory';
import keyTests from './key';
import parentTests from './parent';
import childTests from './child';
import rootTests from './root';

import DatabaseContents from '../../support/DatabaseContents';

const testGroups = [
  factoryTests, keyTests, parentTests, childTests, rootTests,
  pushTests, onTests, offTests, onceTests, setTests, updateTests, removeTests
];

function registerTestSuite(testSuite) {
  testSuite.beforeEach(async function(){
    this._databaseRef = testSuite.firebase.native.database().ref('tests/types');

    await this._databaseRef.set(DatabaseContents.DEFAULT)

  });

  testSuite.afterEach(async function(){
    await this._databaseRef.set(DatabaseContents.DEFAULT)
  });

  testGroups.forEach(function(testGroup) {
    testGroup(testSuite);
  })
}


module.exports = registerTestSuite;
