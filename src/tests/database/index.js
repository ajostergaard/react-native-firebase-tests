import TestSuite from '~/TestSuite';
const Suite = new TestSuite('Realtime Database', 'Read/Write database tests');
const { tryCatch, describe, firebase } = Suite;

describe('on: it should error if permission denied', 'Error Handling', () => {
  return new Promise((resolve, reject) => {
    const successCb = tryCatch(() => {
      reject(new Error('No permission denied error'));
    }, reject);

    const failureCb = tryCatch(error => {
      error.message.includes('Permission denied').should.be.true();
      resolve();
    }, reject);

    firebase.native.database().ref('nope').on('value', successCb, failureCb);
  });
});

describe('once: it should error if permission denied', 'Error Handling', () => {
  return new Promise((resolve, reject) => {
    const successCb = tryCatch(() => {
      reject(new Error('No permission denied error'));
    }, reject);

    const failureCb = tryCatch(error => {
      error.message.includes('Permission denied').should.be.true();
      resolve();
    }, reject);

    firebase.native.database().ref('nope').once('value', successCb, failureCb);
  });
});

export default Suite;

