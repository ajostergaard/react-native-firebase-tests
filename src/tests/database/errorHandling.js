const CATEGORY = 'Error Handling';

export default function addTests({ tryCatch, describe, firebase }) {
  describe('on: it should error if permission denied', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      const successCb = tryCatch(() => {
        reject(new Error('No permission denied error'));
      }, reject);

      const failureCb = tryCatch(error => {
        error.message.includes('permission_denied').should.be.true();
        resolve();
      }, reject);

      firebase.native.database().ref('nope').on('value', successCb, failureCb).then(res => console.warn(JSON.stringify(res)));
    });
  });

  describe('once: it should error if permission denied', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      const successCb = tryCatch(() => {
        reject(new Error('No permission denied error'));
      }, reject);

      const failureCb = tryCatch(error => {
        error.message.includes('permission_denied').should.be.true();
        resolve();
      }, reject);

      firebase.native.database().ref('nope').once('value', successCb, failureCb);
    });
  });
}
