const CATEGORY = 'Log';

export default function addTests({ describe, firebase }) {
  describe('log: it should log without error', CATEGORY, () => {
    return new Promise((resolve) => {
      firebase.native.crash().log('Test log');
      resolve();
    });
  });

  describe('logcat: it should log without error', CATEGORY, () => {
    return new Promise((resolve) => {
      firebase.native.crash().logcat(0, 'LogTest', 'Test log');
      resolve();
    });
  });
}
