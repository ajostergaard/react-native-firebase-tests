import sinon from 'sinon';
import 'should-sinon';

import DatabaseContents from '../../support/DatabaseContents';

function onTests(category, { describe, firebase, tryCatch }) {

  describe('on: calls callback when value changes', category, function(){

    return Promise.all(
      Object.keys(DatabaseContents.DEFAULT).map(async function(dataRef) {
        // Setup

        const ref = firebase.native.database().ref(`tests/types/${dataRef}`);
        const currentDataValue = DatabaseContents.DEFAULT[dataRef];

        const valueEvaluator = sinon.spy();

        // Test

        await new Promise(function(resolve){

          ref.on('value', function(snapshot) {
            valueEvaluator(snapshot.val());
            resolve();
          });

        });

        valueEvaluator.should.be.calledWith(currentDataValue);

        const newDataValue = DatabaseContents.NEW[dataRef];
        await ref.set(newDataValue);

        // Assertions

        valueEvaluator.should.be.calledWith(newDataValue);

        // Tear down

        ref.off();
      })
    );

  });

  describe('on: calls callback with current values', category, function(){

    return Promise.all(Object.keys(DatabaseContents.DEFAULT).map(async function(dataRef) {
      // Setup

      const dataTypeValue = DatabaseContents.DEFAULT[dataRef];

      await new Promise(function(resolve){
        const ref = firebase.native.database().ref(`tests/types/${dataRef}`);

        // Test

        ref.on('value', function(snapshot) {
          // Assertion

          snapshot.val().should.eql(dataTypeValue);

          // Tear down

          ref.off();

          resolve();
        });
      });

    }));
  });

  describe('on: errors if permission denied', category, () => {
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

      const invalidRef = firebase.native.database().ref('nope');

      // Test

      invalidRef.on('value', successCb, failureCb);
    });
  });


}

export default onTests;
