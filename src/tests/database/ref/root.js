const CATEGORY = 'root';

function rootTests({ describe, firebase }) {

  describe('returns root ref', CATEGORY, function(){
    // Setup

    const rootRef = firebase.native.database().ref();
    const nonRootRef = firebase.native.database().ref('tests/types/number');

    // Test


    // Assertion

    (rootRef.key === nonRootRef.root.key).should.be.true();
    (rootRef.parent === nonRootRef.root.parent).should.be.true();
  });

}

export default rootTests;
