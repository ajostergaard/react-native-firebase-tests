import TestSuite from '~/TestSuite';
import should from 'should';

const Suite = new TestSuite('Storage', 'Upload/Download storage tests', { concurrency: 1 });
const { describe, firebase, tryCatch } = Suite;

describe('it should error on download file if permission denied', 'Download', () => {
  return new Promise((resolve, reject) => {
    const successCb = tryCatch(() => {
      reject(new Error('No permission denied error'));
    }, reject);

    const failureCb = tryCatch(error => {
      error.code.should.equal('storage/unauthorized');
      error.message.includes('not authorized').should.be.true();
      resolve();
    }, reject);

    firebase.native.storage().ref('/not.jpg').downloadFile(firebase.native.storage.Native.DOCUMENT_DIRECTORY_PATH + '/not.jpg').then(successCb).catch(failureCb);
  });
});

describe('it should download a file', 'Download', () => {
  return new Promise((resolve, reject) => {
    const successCb = tryCatch((meta) => {
      should.equal(meta.state, firebase.native.storage.TaskState.SUCCESS);
      should.equal(meta.bytesTransferred, meta.totalBytes);
      resolve();
    }, reject);

    const failureCb = tryCatch(error => {
      reject(error);
    }, reject);

    firebase.native.storage().ref('/ok.jpeg').downloadFile(firebase.native.storage.Native.DOCUMENT_DIRECTORY_PATH + '/ok.jpeg').then(successCb).catch(failureCb);
  });
});

describe('it should error on upload if permission denied', 'Upload', () => {
  return new Promise((resolve, reject) => {
    const successCb = tryCatch((meta) => {
      reject(new Error('No permission denied error'));
    }, reject);

    const failureCb = tryCatch(error => {
      error.code.should.equal('storage/unauthorized');
      error.message.includes('not authorized').should.be.true();
      resolve();
    }, reject);

    firebase.native.storage().ref('/uploadNope.jpeg').putFile(firebase.native.storage.Native.DOCUMENT_DIRECTORY_PATH + '/ok.jpeg').then(successCb).catch(failureCb);
  });
});

describe('it should upload a file', 'Upload', () => {
  return new Promise((resolve, reject) => {
    const successCb = tryCatch((uploadTaskSnapshot) => {
      should.equal(uploadTaskSnapshot.state, firebase.native.storage.TaskState.SUCCESS);
      should.equal(uploadTaskSnapshot.bytesTransferred, uploadTaskSnapshot.totalBytes);
      uploadTaskSnapshot.metadata.should.be.an.Object();
      uploadTaskSnapshot.downloadUrl.should.be.a.String();
      resolve();
    }, reject);

    const failureCb = tryCatch(error => {
      debugger;
      reject(error);
    }, reject);

    firebase.native.storage().ref('/uploadOk.jpeg').putFile(firebase.native.storage.Native.DOCUMENT_DIRECTORY_PATH + '/ok.jpeg').then(successCb).catch(failureCb);
  });
});


// TODO move to database tests after green re-factors
describe('database should run transactions', 'Database', () => {
  return new Promise((resolve, reject) => {
    let valueBefore = 1;
    firebase.native.database()
      .ref('tests/transaction').transaction(function (currentData) {
      if (currentData === null) {
        return valueBefore + 10;
      } else {
        valueBefore = currentData;
        return valueBefore + 10;
      }
    }, tryCatch(function (error, committed, snapshot) {
      if (error) {
        return reject(error);
      }

      if (!committed) {
        return reject(new Error('Transaction did not commit.'))
      }


      should.equal(snapshot.val(), valueBefore + 10);
      return resolve();
    }, reject), true);
  });
});

describe('database should abort transactions', 'Database', () => {
  return new Promise((resolve, reject) => {
    firebase.native.database()
      .ref('tests/transaction').transaction(function () {
        return undefined;
    }, function (error, committed) {
      if (error) {
        return reject(error);
      }

      if (!committed) {
        return resolve();
      }

      return reject(new Error('Transaction did not abort commit.'))
    }, true);
  });
});


export default Suite;

