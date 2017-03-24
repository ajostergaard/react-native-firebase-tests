const CATEGORY = 'parent';

function parentTests({ describe, firebase }) {

  describe('returns null for root ref', CATEGORY, function(){
    // Setup

    const ref = firebase.native.database().ref();

    // Test


    // Assertion

    (ref.parent === null).should.be.true();
  });

  describe('returns correct parent for non-root ref', CATEGORY, function(){

    // Setup

    const ref = firebase.native.database().ref('tests/types/number');
    const parentRef = firebase.native.database().ref('tests/types');

    // Assertion

    ref.parent.key.should.eql(parentRef.key);
  });

}

export default parentTests;
