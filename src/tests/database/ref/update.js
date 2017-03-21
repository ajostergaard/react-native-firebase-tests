import DatabaseContents from '../../support/DatabaseContents';

function updateTests(category, { describe, firebase }) {

  describe('update: returns a promise', category, function(){
    // Setup

    let ref = firebase.native.database().ref('tests/types');

    // Test

    const returnValue = ref.update({ number: DatabaseContents.DEFAULT.number });

    // Assertion

    returnValue.should.be.Promise();
  });

  describe('update: changes value', category, async function(){

    await Promise.map(Object.keys(DatabaseContents.DEFAULT), async function(dataRef) {
      // Setup

      const previousValue = DatabaseContents.DEFAULT[dataRef];
      const ref = firebase.native.database().ref(`tests/types/${dataRef}`);

      await ref.once('value').then(function(snapshot){
        snapshot.val().should.eql(previousValue);
      });

      const newValue = DatabaseContents.NEW[dataRef];
      const parentRef =  firebase.native.database().ref('tests/types');

      // Test

      await parentRef.update({ [dataRef]: newValue });

      // Assertion

      await ref.once('value').then(function(snapshot){
        snapshot.val().should.eql(newValue);
      });
    });

  });

  describe('update: can unset values', category, async function(){

    await Promise.map(Object.keys(DatabaseContents.DEFAULT), async function(dataRef) {
      // Setup

      const previousValue = DatabaseContents.DEFAULT[dataRef];
      const ref = firebase.native.database().ref(`tests/types/${dataRef}`);

      await ref.once('value').then(function(snapshot){
        snapshot.val().should.eql(previousValue);
      });

      const parentRef =  firebase.native.database().ref('tests/types');

      // Test

      await parentRef.update({ [dataRef]: null });

      // Assertion

      await ref.once('value').then(function(snapshot){
        (snapshot.val() === null).should.be.true();
      });
    });

  });

  describe('update: updates multiple values at once', category, async function(){

    // Setup

    const numberPreviousValue = DatabaseContents.DEFAULT.number;
    const stringPreviousValue = DatabaseContents.DEFAULT.string;

    const numberRef = firebase.native.database().ref(`tests/types/number`);
    const stringRef = firebase.native.database().ref(`tests/types/string`);

    await numberRef.once('value').then(function(snapshot){
      snapshot.val().should.eql(numberPreviousValue);
    });

    await stringRef.once('value').then(function(snapshot){
      snapshot.val().should.eql(stringPreviousValue);
    });

    const numberNewValue = DatabaseContents.NEW.number;
    const stringNewValue = DatabaseContents.NEW.string;
    const parentRef =  firebase.native.database().ref('tests/types');

    // Test

    await parentRef.update({
      number: numberNewValue,
      string: stringNewValue
    });

    // Assertion

    await numberRef.once('value').then(function(snapshot){
      snapshot.val().should.eql(numberNewValue);
    });

    await stringRef.once('value').then(function(snapshot){
      snapshot.val().should.eql(stringNewValue);
    });

  });

}

export default updateTests;
