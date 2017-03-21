import sinon from 'sinon';
import 'should-sinon';

import DatabaseContents from '../../support/DatabaseContents';

function onceTests(category, { describe, firebase, tryCatch }) {

  describe('once: returns a promise', category, function(){
    // Setup

    const ref = firebase.native.database().ref('tests/types/number');

    // Test

    const returnValue = ref.once('value');

    // Assertion

    returnValue.should.be.Promise();
  });

  describe('once: resolves with the correct value', category, async function(){

    await Promise.map(Object.keys(DatabaseContents.DEFAULT), function(dataRef) {
      // Setup

      const dataTypeValue = DatabaseContents.DEFAULT[dataRef];
      const ref = firebase.native.database().ref(`tests/types/${dataRef}`);

      // Test

      return ref.once('value').then(function(snapshot){
        // Assertion

        snapshot.val().should.eql(dataTypeValue);
      });

    });
  });

  describe('once: is NOT called when the value is changed', category, async function(){
    // Setup

    const callback = sinon.spy();
    const ref = firebase.native.database().ref(`tests/types/number`);

    // Test

    ref.once('value').then(callback);

    await ref.set(DatabaseContents.NEW.number);

    // Assertion
    callback.should.be.calledOnce();
  });

  describe('once: errors if permission denied', category, () => {
    return new Promise((resolve, reject) => {

      const successCb = tryCatch(() => {
        // Assertion

        reject(new Error('No permission denied error'));
      }, reject);

      const failureCb = tryCatch(error => {
        // Assertion

        error.message.includes('permission_denied').should.be.true();
        resolve();
      }, reject);

      // Setup

      const reference = firebase.native.database().ref('nope');

      // Test
      reference.once('value', successCb, failureCb);
    });
  });


}

export default onceTests;
