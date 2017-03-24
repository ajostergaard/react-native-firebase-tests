const CATEGORY = 'key';

function keyTests({ describe, firebase }) {

  describe('returns null for root ref', CATEGORY, function(){
    // Setup

    const ref = firebase.native.database().ref();

    // Test


    // Assertion

    (ref.key === null).should.be.true();
  });

  describe('returns correct key for path', CATEGORY, function(){
    // Setup

    const ref = firebase.native.database().ref('tests/types/number');
    const arrayItemRef = firebase.native.database().ref('tests/types/array/1');

    // Assertion

    ref.key.should.eql('number');
    arrayItemRef.key.should.eql('1');
  });

}

export default keyTests;
