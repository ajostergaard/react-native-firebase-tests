const CATEGORY = 'child';

function childTests({ describe, firebase }) {

  describe('returns correct child ref', CATEGORY, function(){
    // Setup

    const ref = firebase.native.database().ref('tests');

    // Test

    const childRef = ref.child('tests');
    const grandChildRef = ref.child('tests/number');

    // Assertion

    childRef.key.should.eql('tests');
    grandChildRef.key.should.eql('number');
  });

}

export default childTests;
