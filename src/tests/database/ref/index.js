import on from './on';
import off from './off';
import once from './once';
import set from './set';
import update from './update';
import remove from './remove';

const testGroups = [
  on, off, once, set, update, remove
];

function registerTestSuite(testSuite) {
  testSuite.beforeEach(async function(){
    this._databaseRef = testSuite.firebase.native.database().ref('tests/types');

    await new Promise((resolve) => {
      this._databaseRef.once('value', (snapshot) => {
        this._databaseContentsBefore = snapshot.val();
      })
    })

  });

  testSuite.afterEach(async function(){
    await this._databaseRef.set(this._databaseContentsBefore);
  });

  testGroups.forEach(function(testGroup) {
    testGroup('ref', testSuite);
  })
}


module.exports = registerTestSuite;
