import DatabaseContents from '../../support/DatabaseContents';

const CATEGORY = 'ref.remove()';

function removeTests({ describe, firebase }) {

  describe('returns a promise', CATEGORY, function(){
    // Setup

    let ref = firebase.native.database().ref('tests/types');

    // Test

    const returnValue = ref.remove({ number: DatabaseContents.DEFAULT.number });

    // Assertion

    returnValue.should.be.Promise();
  });

  describe('sets value to null', CATEGORY, async function(){

    await Promise.map(Object.keys(DatabaseContents.DEFAULT), async function(dataRef) {
      // Setup

      const previousValue = DatabaseContents.DEFAULT[dataRef];
      const ref = firebase.native.database().ref(`tests/types/${dataRef}`);

      await ref.once('value').then(function(snapshot){
        snapshot.val().should.eql(previousValue);
      });

      // Test

      await ref.remove();

      // Assertion

      await ref.once('value').then(function(snapshot){
        (snapshot.val() === null).should.be.true();
      });
    });

  });

}

export default removeTests;
