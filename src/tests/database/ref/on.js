import sinon from 'sinon';
import 'should-sinon';
import Promise from 'bluebird';

import DatabaseContents from '../../support/DatabaseContents';

const CATEGORY = 'ref.on()';

function onTests({ describe, firebase, tryCatch }) {

  describe('calls callback when value changes', CATEGORY, function(){

    return Promise.each( Object.keys(DatabaseContents.DEFAULT), async function(dataRef) {
      // Setup

      const ref = firebase.native.database().ref(`tests/types/${dataRef}`);
      const currentDataValue = DatabaseContents.DEFAULT[dataRef];

      const callback = sinon.spy();

      // Test

      await new Promise(function(resolve){
        ref.on('value', function(snapshot) {
          callback(snapshot.val());
          resolve();
        });
      });

      callback.should.be.calledWith(currentDataValue);

      const newDataValue = DatabaseContents.NEW[dataRef];
      await ref.set(newDataValue);

      // Assertions

      callback.should.be.calledWith(newDataValue);

      // Tear down

      ref.off();
    }
  );

  });

  describe('calls callback with current values', CATEGORY, function(){

    return Promise.each(Object.keys(DatabaseContents.DEFAULT), function(dataRef) {
      // Setup

      const dataTypeValue = DatabaseContents.DEFAULT[dataRef];
      const ref = firebase.native.database().ref(`tests/types/${dataRef}`);

      // Test

      return new Promise(function(resolve){
        ref.on('value', function(snapshot) {
          // Assertion

          snapshot.val().should.eql(dataTypeValue);

          // Tear down

          ref.off();
          resolve();
        });
      })

    });
  });

  describe('errors if permission denied', CATEGORY, function(){
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
