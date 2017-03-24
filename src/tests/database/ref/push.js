import sinon from 'sinon';
import 'should-sinon';

import DatabaseContents from '../../support/DatabaseContents';

const CATEGORY = 'ref.push()';

function pushTests({ describe, firebase }) {

  describe('push: returns a ref that can be used to set value later', CATEGORY, async function(){
    // Setup

    const ref = firebase.native.database().ref('tests/types/array');

    let originalListValue;

    await ref.once('value', function(snapshot) {
      originalListValue = snapshot.val();
    });

    originalListValue.should.eql(DatabaseContents.DEFAULT.array);

    // Test

    const newItemRef = ref.push();

    const valueToAddToList = DatabaseContents.NEW.number;
    await newItemRef.set(valueToAddToList);

    let newItemValue, newListValue;

    // Assertion

    await newItemRef.once('value', function(snapshot){
      newItemValue = snapshot.val();
    });

    newItemValue.should.eql(valueToAddToList);

    await ref.once('value', function(snapshot) {
      newListValue = snapshot.val();
    });

    const originalListAsObject = originalListValue.reduce(function(memo, value, index) {
      memo[index] = value;
      return memo;
    }, {});

    originalListAsObject[newItemRef.key] = valueToAddToList;

    newListValue.should.eql(originalListAsObject);

  });

  describe('push: allows setting value immediately', CATEGORY, async function(){
    // Setup

    const ref = firebase.native.database().ref('tests/types/array');

    let originalListValue;

    await ref.once('value', function(snapshot) {
      originalListValue = snapshot.val();
    });

    // Test

    const valueToAddToList = DatabaseContents.NEW.number;
    const newItemRef = await ref.push(valueToAddToList);

    let newItemValue, newListValue;

    // Assertion

    await newItemRef.once('value', function(snapshot){
      newItemValue = snapshot.val();
    });

    newItemValue.should.eql(valueToAddToList);

    await ref.once('value', function(snapshot) {
      newListValue = snapshot.val();
    });

    const originalListAsObject = originalListValue.reduce(function(memo, value, index) {
      memo[index] = value;
      return memo;
    }, {});

    originalListAsObject[newItemRef.key] = valueToAddToList;

    newListValue.should.eql(originalListAsObject);

  });

  describe('push: calls an onComplete callback', CATEGORY, async function(){
    // Setup

    const callback = sinon.spy();

    const ref = firebase.native.database().ref('tests/types/array');

    // Test

    const valueToAddToList = DatabaseContents.NEW.number;
    await ref.push(valueToAddToList, callback);

    // Assertion

    callback.should.be.calledWith(null);
  });




}

export default pushTests;
