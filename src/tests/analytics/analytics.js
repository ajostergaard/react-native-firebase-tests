const CATEGORY = 'Analytics';

export default function addTests({ tryCatch, describe, firebase }) {
  describe('logEvent: it should log a text event without error', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      firebase.native.analytics().logEvent('test_event');
      resolve();
    });
  });

  describe('logEvent: it should log a text event with parameters without error', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      firebase.native.analytics().logEvent('test_event', {
        boolean: true,
        number: 1,
        string: 'string',
      });
      resolve();
    });
  });

  describe('setAnalyticsCollectionEnabled: it should run without error', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      firebase.native.analytics().setAnalyticsCollectionEnabled(true);
      resolve();
    });
  });

  describe('setCurrentScreen: it should run without error', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      firebase.native.analytics().setCurrentScreen('test screen', 'test class override');
      resolve();
    });
  });

  describe('setMinimumSessionDuration: it should run without error', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      firebase.native.analytics().setMinimumSessionDuration(10000);
      resolve();
    });
  });

  describe('setSessionTimeoutDuration: it should run without error', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      firebase.native.analytics().setSessionTimeoutDuration(1800000);
      resolve();
    });
  });

  describe('setUserId: it should run without error', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      firebase.native.analytics().setUserId('test-id');
      resolve();
    });
  });

  describe('setUserProperty: it should run without error', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      firebase.native.analytics().setUserProperty('test-property', 'test-value');
      resolve();
    });
  });
}
