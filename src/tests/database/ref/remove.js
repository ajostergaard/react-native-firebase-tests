import DatabaseContents from '../../support/DatabaseContents';

function removeTests(category, { describe, firebase }) {

  describe('remove: returns a promise', category, function(){
    // Setup

    let ref = firebase.native.database().ref('tests/types');

    // Test

    const returnValue = ref.remove({ number: DatabaseContents.DEFAULT.number });

    // Assertion

    returnValue.should.be.Promise();
  });

  describe('remove: sets value to null', category, async function(){

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
