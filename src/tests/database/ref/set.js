import DatabaseContents from '../../support/DatabaseContents';

const CATEGORY = 'ref.set()';

function setTests({ describe, firebase }) {


  describe('returns a promise', CATEGORY, function(){
    // Setup

    let ref = firebase.native.database().ref('tests/types/number');

    // Test

    const returnValue = ref.set(DatabaseContents.DEFAULT.number);

    // Assertion

    returnValue.should.be.Promise();
  });

  describe('changes value', CATEGORY, async function(){

    await Promise.map(Object.keys(DatabaseContents.DEFAULT), async function(dataRef) {
      // Setup

      const previousValue = DatabaseContents.DEFAULT[dataRef];
      const ref = firebase.native.database().ref(`tests/types/${dataRef}`);

      await ref.once('value').then(function(snapshot){
        snapshot.val().should.eql(previousValue);
      });

      const newValue = DatabaseContents.NEW[dataRef];

      // Test

      await ref.set(newValue);

      await ref.once('value').then(function(snapshot){
        // Assertion

        snapshot.val().should.eql(newValue);
      });

    });

  });

  describe('can unset values', CATEGORY, async function(){

    await Promise.map(Object.keys(DatabaseContents.DEFAULT), async function(dataRef) {
      // Setup

      const previousValue = DatabaseContents.DEFAULT[dataRef];
      const ref = firebase.native.database().ref(`tests/types/${dataRef}`);

      await ref.once('value').then(function(snapshot){
        snapshot.val().should.eql(previousValue);
      });

      // Test

      await ref.set(null);

      await ref.once('value').then(function(snapshot){
        // Assertion

        (snapshot.val() === null).should.be.true();
      });

    });

  });

}

export default setTests;
