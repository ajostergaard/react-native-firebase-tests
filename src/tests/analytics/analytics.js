const CATEGORY = 'Analytics';

export default function addTests({ tryCatch, describe, firebase }) {
  describe('logEvent: it should log a text event without error', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      try {
        firebase.native.analytics().logEvent('test_event');
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });

  describe('logEvent: it should log a text event with parameters without error', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      try {
        firebase.native.analytics().logEvent('test_event', {
          boolean: true,
          number: 1,
          string: 'string',
        });
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });

  describe('setAnalyticsCollectionEnabled: it should run without error', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      try {
        firebase.native.analytics().setAnalyticsCollectionEnabled(true);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });

  describe('setCurrentScreen: it should run without error', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      try {
        firebase.native.analytics().setCurrentScreen('test screen', 'test class override');
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });

  describe('setMinimumSessionDuration: it should run without error', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      try {
        firebase.native.analytics().setMinimumSessionDuration(10000);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });

  describe('setSessionTimeoutDuration: it should run without error', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      try {
        firebase.native.analytics().setSessionTimeoutDuration(1800000);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });

  describe('setUserId: it should run without error', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      try {
        firebase.native.analytics().setUserId('test-id');
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });

  describe('setUserProperty: it should run without error', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      try {
        firebase.native.analytics().setUserProperty('test-property', 'test-value');
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
}
