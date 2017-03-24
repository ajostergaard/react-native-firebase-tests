import sinon from 'sinon';
import 'should-sinon';

import DatabaseContents from '../../support/DatabaseContents';

const CATEGORY = 'ref.off()';

function offTests({ describe, firebase }) {

  describe('stops listening for changes', CATEGORY, async function(){

    // Setup

    const callback = sinon.spy();

    const ref = firebase.native.database().ref(`tests/types/number`);

    await new Promise(function(resolve){
      ref.on('value', function(){
        callback();
        resolve()
      });
    });

    callback.should.be.calledOnce();

    // Test

    ref.off();

    // Assertions

    await ref.set(DatabaseContents.DEFAULT.number).then(function(){
      callback.should.be.calledOnce();
    });
  });

}

export default offTests;
