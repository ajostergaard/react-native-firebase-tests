import DatabaseContents from '../../support/DatabaseContents';

const CATEGORY = 'ref()';

function factoryTests({ describe, firebase }) {

  describe('returns root reference when provided no path', CATEGORY, function(){
    // Setup

    const ref = firebase.native.database().ref();

    // Test


    // Assertion

    (ref.key === null).should.be.true();
    (ref.parent === null).should.be.true();
  });

  describe('returns reference to data at path', CATEGORY, async function(){
    // Setup

    const ref = firebase.native.database().ref('tests/types/number');

    // Test
    let valueAtRef;

    await ref.once('value', function(snapshot){
      valueAtRef = snapshot.val();
    });

    // Assertion

    valueAtRef.should.eql(DatabaseContents.DEFAULT.number);
  });

}

export default factoryTests;
