const CATEGORY = 'Log';

export default function addTests({ tryCatch, describe, firebase }) {
  describe('log: it should log without error', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      try {
        firebase.native.crash().log('Test log');
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });

  describe('logcat: it should log without error', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      try {
        firebase.native.crash().logcat(0, 'LogTest', 'Test log');
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
}
